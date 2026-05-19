import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth';
import courseRoutes from './routes/courses';
import lessonRoutes from './routes/lessons';
import progressRoutes from './routes/progress';
import extensionRoutes from './routes/extension';
import certificateRoutes from './routes/certificates';
import adminRoutes from './routes/admin';
import chatRoutes from './routes/chat';

dotenv.config();

const openRouterKey = process.env.OPENROUTER_API_KEY?.trim();
const openRouterReady =
  !!openRouterKey &&
  openRouterKey !== 'your-openrouter-api-key' &&
  openRouterKey.startsWith('sk-');

export const prisma = new PrismaClient();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));

app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/users', progressRoutes);
app.use('/api/extension', extensionRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/chat', chatRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Vibe Mentor API running on port ${PORT}`);
  console.log(
    openRouterReady
      ? 'OpenRouter: configured'
      : 'OpenRouter: NOT configured — chat will use fallback responses. Set OPENROUTER_API_KEY in backend/.env and restart.',
  );
});
