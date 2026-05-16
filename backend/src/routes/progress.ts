import { Router, Response } from 'express';
import { prisma } from '../index';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

router.get('/:id/progress', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userCourses = await prisma.userCourse.findMany({
      where: { userId: req.params.id },
      include: {
        course: {
          select: { id: true, title: true, description: true, ageGroup: true, type: true },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    const lessonProgress = await prisma.userProgress.findMany({
      where: { userId: req.params.id },
      include: {
        lesson: { select: { id: true, title: true, lessonNumber: true, courseId: true } },
      },
    });

    res.json({ courses: userCourses, lessons: lessonProgress });
  } catch (err) {
    console.error('Get progress error:', err);
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

router.get('/:id/courses', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userCourses = await prisma.userCourse.findMany({
      where: { userId: req.params.id },
      include: {
        course: {
          include: {
            lessons: { orderBy: { lessonNumber: 'asc' }, select: { id: true, title: true, lessonNumber: true } },
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
    res.json(userCourses);
  } catch (err) {
    console.error('Get user courses error:', err);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

export default router;
