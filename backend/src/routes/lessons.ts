import { Router, Response } from 'express';
import { prisma } from '../index';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

router.get('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const lesson = await prisma.lesson.findUnique({
      where: { id: req.params.id },
    });
    if (!lesson) return res.status(404).json({ error: 'Lesson not found' });

    const progress = await prisma.userProgress.findUnique({
      where: { userId_lessonId: { userId: req.userId!, lessonId: lesson.id } },
    });

    res.json({ ...lesson, progress });
  } catch (err) {
    console.error('Get lesson error:', err);
    res.status(500).json({ error: 'Failed to fetch lesson' });
  }
});

router.post('/:id/start', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const lesson = await prisma.lesson.findUnique({ where: { id: req.params.id } });
    if (!lesson) return res.status(404).json({ error: 'Lesson not found' });

    const progress = await prisma.userProgress.upsert({
      where: { userId_lessonId: { userId: req.userId!, lessonId: req.params.id } },
      update: { status: 'in-progress' },
      create: {
        userId: req.userId!,
        lessonId: req.params.id,
        status: 'in-progress',
      },
    });

    await prisma.userCourse.upsert({
      where: { userId_courseId: { userId: req.userId!, courseId: lesson.courseId } },
      update: { status: 'in-progress' },
      create: {
        userId: req.userId!,
        courseId: lesson.courseId,
        status: 'in-progress',
      },
    });

    res.json(progress);
  } catch (err) {
    console.error('Start lesson error:', err);
    res.status(500).json({ error: 'Failed to start lesson' });
  }
});

router.post('/:id/submit-task', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { taskId, submissionType, submissionData, screenshotUrl } = req.body;
    if (!taskId || !submissionType) {
      return res.status(400).json({ error: 'taskId and submissionType required' });
    }

    const submission = await prisma.submission.create({
      data: {
        userId: req.userId!,
        lessonId: req.params.id,
        taskId,
        submissionType,
        submissionData: submissionData || '',
        screenshotUrl: screenshotUrl || null,
      },
    });

    const lesson = await prisma.lesson.findUnique({ where: { id: req.params.id } });
    if (!lesson) return res.status(404).json({ error: 'Lesson not found' });
    const tasks = JSON.parse(lesson.checklistTasks || '[]') as any[];
    const taskIds = tasks.map((t: any) => t.id);

    const completedTasks = await prisma.submission.groupBy({
      by: ['taskId'],
      where: { userId: req.userId!, lessonId: req.params.id },
    });

    const progress = await prisma.userProgress.upsert({
      where: { userId_lessonId: { userId: req.userId!, lessonId: req.params.id } },
      update: { completedTasks: completedTasks.length },
      create: {
        userId: req.userId!,
        lessonId: req.params.id,
        status: 'in-progress',
        completedTasks: completedTasks.length,
      },
    });

    const percentComplete = taskIds.length > 0 ? Math.round((completedTasks.length / taskIds.length) * 100) : 0;

    if (percentComplete >= 80) {
      await prisma.userProgress.update({
        where: { id: progress.id },
        data: { status: 'completed', completedAt: new Date() },
      });
    }

    await updateCourseProgress(req.userId!, lesson.courseId);

    if (submissionType === 'text_input' || submissionType === 'screenshot') {
      const grading = await gradeSubmission(submission, tasks.find((t: any) => t.id === taskId));
      if (grading) {
        await prisma.submission.update({
          where: { id: submission.id },
          data: {
            aiGradingScore: grading.score,
            aiGradingLevel: grading.level,
            aiFeedback: grading.feedback,
            gradedAt: new Date(),
          },
        });
        return res.json({ submission, grading });
      }
    }

    res.json({ submission, progress: { ...progress, percentComplete } });
  } catch (err) {
    console.error('Submit task error:', err);
    res.status(500).json({ error: 'Failed to submit task' });
  }
});

async function updateCourseProgress(userId: string, courseId: string) {
  const lessons = await prisma.lesson.findMany({
    where: { courseId },
    select: { id: true },
  });

  const completedLessons = await prisma.userProgress.count({
    where: {
      userId,
      lessonId: { in: lessons.map(l => l.id) },
      status: 'completed',
    },
  });

  const progress = lessons.length > 0 ? Math.round((completedLessons / lessons.length) * 100) : 0;

  await prisma.userCourse.updateMany({
    where: { userId, courseId },
    data: {
      progress,
      ...(progress === 100 ? { status: 'completed', completedAt: new Date() } : {}),
    },
  });
}

async function gradeSubmission(submission: any, task: any) {
  const claudeKey = process.env.CLAUDE_API_KEY;
  if (!claudeKey || claudeKey === 'your-claude-api-key') {
    return { score: 70, level: 'completed', feedback: 'Good work! Keep it up!' };
  }

  try {
    const prompt = `Grade this student submission:

Task: ${task?.title || 'General task'}
Description: ${task?.description || ''}
Type: ${submission.submissionType}
Submission: ${submission.submissionData}

Return JSON:
{
  "score": 0-100,
  "level": "attempted|completed|mastered",
  "feedback": "Specific feedback for student",
  "suggestedReview": "Optional resource link"
}`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': claudeKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const result: any = await response.json();
    const content = result.content?.[0]?.text || '';
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (err) {
    console.error('Grading AI error:', err);
  }

  return { score: 70, level: 'completed', feedback: 'Good work! Keep it up!' };
}

export default router;
