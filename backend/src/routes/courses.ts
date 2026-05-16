import { Router, Response } from 'express';
import { prisma } from '../index';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const courses = await prisma.course.findMany({
      where: {
        ageGroup: req.userAgeGroup || '12+',
        type: req.userAgeGroup === '4-11' ? 'foundation' : undefined,
      },
      include: {
        lessons: { orderBy: { lessonNumber: 'asc' }, select: { id: true, title: true, lessonNumber: true } },
        _count: { select: { lessons: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const userCourses = await prisma.userCourse.findMany({
      where: { userId: req.userId },
    });

    const enriched = courses.map(course => {
      const userCourse = userCourses.find(uc => uc.courseId === course.id);
      return {
        ...course,
        progress: userCourse?.progress || 0,
        status: userCourse?.status || null,
        startedAt: userCourse?.startedAt || null,
      };
    });

    res.json(enriched);
  } catch (err) {
    console.error('Get courses error:', err);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

router.get('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const course = await prisma.course.findUnique({
      where: { id: req.params.id },
      include: {
        lessons: { orderBy: { lessonNumber: 'asc' } },
        _count: { select: { lessons: true } },
      },
    });
    if (!course) return res.status(404).json({ error: 'Course not found' });

    const userCourse = await prisma.userCourse.findUnique({
      where: { userId_courseId: { userId: req.userId!, courseId: course.id } },
    });

    res.json({ ...course, userProgress: userCourse });
  } catch (err) {
    console.error('Get course error:', err);
    res.status(500).json({ error: 'Failed to fetch course' });
  }
});

router.post('/generate', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { studentIdea, skillLevel } = req.body;
    if (!studentIdea) return res.status(400).json({ error: 'Student idea is required' });

    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const prompt = `You are an expert AI education curriculum designer.

A ${user.ageGroup === '4-11' ? user.ageGroup + ' year old' : user.ageGroup + ' year old'} student wants to: "${studentIdea}"

Create a ${user.ageGroup === '4-11' ? '5' : '7'}-lesson personalized course with:
- Clear learning objectives for each lesson
- Recommended AI tools (Framer, Bolt.new, Canva AI, ChatGPT, etc.)
- Step-by-step tasks that build towards the final project
- Real-world examples
- Difficulty progression (beginner → intermediate)
- Each lesson 30-60 minutes of work

Respond ONLY with valid JSON:
{
  "title": "Course title",
  "description": "Short description",
  "difficulty": "beginner",
  "estimatedHours": 5,
  "lessons": [
    {
      "lessonNumber": 1,
      "title": "Lesson title",
      "objective": "What student will learn",
      "explanation": "Detailed explanation",
      "simplifiedConcept": "Simple version for kids",
      "realWorldExamples": ["example1", "example2"],
      "tools": ["ChatGPT"],
      "tasks": [
        {
          "id": "task-1",
          "type": "text_input",
          "title": "Task title",
          "description": "Task description"
        }
      ]
    }
  ]
}`;

    const claudeKey = process.env.CLAUDE_API_KEY;
    let courseData: any;

    if (claudeKey && claudeKey !== 'your-claude-api-key') {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': claudeKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-3-haiku-20240307',
          max_tokens: 4000,
          messages: [{ role: 'user', content: prompt }],
        }),
      });

      const result: any = await response.json();
      const content = result.content?.[0]?.text || '';
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        courseData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Failed to parse AI response');
      }
    } else {
      courseData = getFallbackCourse(studentIdea, user.ageGroup);
    }

    const course = await prisma.course.create({
      data: {
        title: courseData.title,
        description: courseData.description,
        ageGroup: user.ageGroup,
        type: 'project',
        difficulty: courseData.difficulty || 'beginner',
        estimatedHours: courseData.estimatedHours || 5,
        content: JSON.stringify(courseData),
        createdBy: user.id,
        lessons: {
          create: courseData.lessons.map((l: any) => ({
            lessonNumber: l.lessonNumber,
            title: l.title,
            objective: l.objective,
            explanation: l.explanation,
            simplifiedConcept: l.simplifiedConcept || null,
            realWorldExamples: JSON.stringify(l.realWorldExamples || []),
            voiceNarration: null,
            checklistTasks: JSON.stringify(l.tasks || []),
          })),
        },
      },
      include: {
        lessons: { orderBy: { lessonNumber: 'asc' } },
      },
    });

    res.status(201).json({
      courseId: course.id,
      title: course.title,
      lessonCount: course.lessons.length,
      estimatedHours: course.estimatedHours,
      lessons: course.lessons,
    });
  } catch (err) {
    console.error('Generate course error:', err);
    res.status(500).json({ error: 'Failed to generate course' });
  }
});

router.post('/:id/enroll', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const existing = await prisma.userCourse.findUnique({
      where: { userId_courseId: { userId: req.userId!, courseId: req.params.id } },
    });
    if (existing) return res.json(existing);

    const userCourse = await prisma.userCourse.create({
      data: {
        userId: req.userId!,
        courseId: req.params.id,
        status: 'in-progress',
      },
    });
    res.status(201).json(userCourse);
  } catch (err) {
    console.error('Enroll error:', err);
    res.status(500).json({ error: 'Failed to enroll' });
  }
});

function getFallbackCourse(idea: string, ageGroup: string) {
  const lessons = ageGroup === '4-11' ? 5 : 7;
  return {
    title: idea.length > 50 ? idea.substring(0, 50) + '...' : idea,
    description: `A personalized course about ${idea}`,
    difficulty: 'beginner',
    estimatedHours: lessons,
    lessons: Array.from({ length: lessons }, (_, i) => ({
      lessonNumber: i + 1,
      title: `Lesson ${i + 1}: Getting Started`,
      objective: `Learn the basics of ${idea}`,
      explanation: `In this lesson, we will explore how to approach ${idea} step by step.`,
      simplifiedConcept: `We'll learn about ${idea} in a simple way.`,
      realWorldExamples: ['Example 1', 'Example 2'],
      tools: ['ChatGPT'],
      tasks: [
        {
          id: `task-${i + 1}-1`,
          type: 'text_input',
          title: 'Think About Your Project',
          description: `Write down what you know about ${idea}`,
        },
        {
          id: `task-${i + 1}-2`,
          type: 'checkbox',
          title: 'Watch the Tutorial',
          description: 'Watch the video tutorial for this lesson',
        },
      ],
    })),
  };
}

export default router;
