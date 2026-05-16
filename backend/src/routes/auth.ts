import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../index';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
  ageGroup: z.enum(['4-11', '12+']),
  parentEmail: z.string().email().optional(),
  learningGoals: z.string().optional(),
  interests: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

router.post('/signup', async (req: Request, res: Response) => {
  try {
    const data = signupSchema.parse(req.body);
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(data.password, 12);
    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        name: data.name,
        ageGroup: data.ageGroup,
        parentEmail: data.parentEmail,
        parentConsent: data.ageGroup === '4-11' ? false : true,
        learningGoals: data.learningGoals,
        interests: data.interests,
      },
    });

    const token = jwt.sign(
      { userId: user.id, email: user.email, ageGroup: user.ageGroup },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        ageGroup: user.ageGroup,
      },
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.errors[0].message });
    }
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Failed to create account' });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    const data = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const valid = await bcrypt.compare(data.password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, ageGroup: user.ageGroup },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        ageGroup: user.ageGroup,
        profilePicture: user.profilePicture,
        learningGoals: user.learningGoals,
        interests: user.interests,
      },
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.errors[0].message });
    }
    console.error('Login error:', err);
    res.status(500).json({ error: 'Failed to sign in' });
  }
});

router.get('/me', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true, email: true, name: true, ageGroup: true,
        profilePicture: true, learningGoals: true, interests: true,
        parentEmail: true, parentConsent: true, isEmailVerified: true,
        createdAt: true,
      },
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error('Get me error:', err);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

router.put('/me', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { name, learningGoals, interests, profilePicture } = req.body;
    const user = await prisma.user.update({
      where: { id: req.userId },
      data: { name, learningGoals, interests, profilePicture },
      select: {
        id: true, email: true, name: true, ageGroup: true,
        profilePicture: true, learningGoals: true, interests: true,
      },
    });
    res.json(user);
  } catch (err) {
    console.error('Update user error:', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

export default router;
