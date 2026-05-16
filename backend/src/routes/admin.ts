import { Router, Response } from 'express';
import { prisma } from '../index';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

router.get('/analytics', authenticate, async (_req: AuthRequest, res: Response) => {
  try {
    const [totalStudents, totalCourses, totalSubmissions, totalCertificates, recentUsers] = await Promise.all([
      prisma.user.count(),
      prisma.course.count(),
      prisma.submission.count(),
      prisma.certificate.count(),
      prisma.user.findMany({ orderBy: { createdAt: 'desc' }, take: 5, select: { id: true, name: true, email: true, createdAt: true } }),
    ]);

    const completedCourses = await prisma.userCourse.count({ where: { status: 'completed' } });
    const inProgressCourses = await prisma.userCourse.count({ where: { status: 'in-progress' } });

    res.json({
      totalStudents,
      totalCourses,
      totalSubmissions,
      totalCertificates,
      completedCourses,
      inProgressCourses,
      recentUsers,
    });
  } catch (err) {
    console.error('Admin analytics error:', err);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

router.get('/students', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const search = (req.query.search as string) || '';
    const students = await prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: search } },
          { email: { contains: search } },
        ],
      },
      select: {
        id: true, name: true, email: true, ageGroup: true,
        isActive: true, createdAt: true,
        _count: { select: { userCourses: true, certificates: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    res.json(students);
  } catch (err) {
    console.error('Admin students error:', err);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

router.get('/courses', authenticate, async (_req: AuthRequest, res: Response) => {
  try {
    const courses = await prisma.course.findMany({
      include: {
        _count: { select: { lessons: true, userCourses: true, certificates: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(courses);
  } catch (err) {
    console.error('Admin courses error:', err);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

export default router;
