import { Router, Response } from 'express';
import { optionalAuth, AuthRequest } from '../middleware/auth';

const router = Router();

router.post('/', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { message, history } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required' });

    const openRouterKey = process.env.OPENROUTER_API_KEY;
    if (!openRouterKey || openRouterKey === 'your-openrouter-api-key') {
      return res.status(200).json({
        role: 'assistant',
        content: `Hey! I'm your Vibe Mentor AI assistant. I can help you build projects, answer questions, and guide your learning journey.\n\nTo get started, try telling me what you'd like to build or learn about!`,
      });
    }

    const messages = [
      { role: 'system', content: 'You are Vibe Mentor AI, a friendly and knowledgeable coding mentor for kids and teens. You help students build projects, explain concepts simply, and encourage creativity. Keep responses concise, encouraging, and age-appropriate. Use examples and analogies.' },
      ...(history || []),
      { role: 'user', content: message },
    ];

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openRouterKey}`,
        'HTTP-Referer': process.env.FRONTEND_URL || 'http://localhost:5173',
        'X-Title': 'Vibe Mentor',
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        messages,
        max_tokens: 1000,
      }),
    });

    const result: any = await response.json();
    const content = result.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.';

    res.json({ role: 'assistant', content });
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ error: 'Failed to generate response' });
  }
});

export default router;