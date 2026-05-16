import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../index';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

router.post('/issue', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { courseId } = req.body;
    if (!courseId) return res.status(400).json({ error: 'courseId required' });

    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) return res.status(404).json({ error: 'Course not found' });

    const userCourse = await prisma.userCourse.findUnique({
      where: { userId_courseId: { userId: req.userId!, courseId } },
    });

    if (!userCourse || userCourse.status !== 'completed') {
      return res.status(400).json({ error: 'Course not yet completed' });
    }

    const existingCert = await prisma.certificate.findUnique({
      where: { studentId_courseId: { studentId: req.userId!, courseId } },
    });
    if (existingCert) return res.json(existingCert);

    const certId = 'CERT-' + uuidv4().substring(0, 8).toUpperCase();
    const publicUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify/${certId}`;

    const user = await prisma.user.findUnique({ where: { id: req.userId } });

    const submissionCount = await prisma.submission.count({
      where: { userId: req.userId!, lessonId: { in: (await prisma.lesson.findMany({ where: { courseId }, select: { id: true } })).map(l => l.id) } },
    });

    const grade = submissionCount > 10 ? 'Distinction' : submissionCount > 5 ? 'Merit' : 'Pass';

    const certificate = await prisma.certificate.create({
      data: {
        studentId: req.userId!,
        courseId,
        certificateId: certId,
        grade,
        publicUrl,
      },
    });

    res.status(201).json(certificate);
  } catch (err) {
    console.error('Issue certificate error:', err);
    res.status(500).json({ error: 'Failed to issue certificate' });
  }
});

router.get('/:id', async (req, res: Response) => {
  try {
    const cert = await prisma.certificate.findUnique({
      where: { id: req.params.id },
      include: {
        student: { select: { name: true } },
        course: { select: { title: true } },
      },
    });
    if (!cert) return res.status(404).json({ error: 'Certificate not found' });
    res.json(cert);
  } catch (err) {
    console.error('Get certificate error:', err);
    res.status(500).json({ error: 'Failed to fetch certificate' });
  }
});

router.get('/user/:userId', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const certs = await prisma.certificate.findMany({
      where: { studentId: req.params.userId },
      include: {
        course: { select: { title: true, description: true } },
      },
      orderBy: { issueDate: 'desc' },
    });
    res.json(certs);
  } catch (err) {
    console.error('Get user certificates error:', err);
    res.status(500).json({ error: 'Failed to fetch certificates' });
  }
});

export default router;
