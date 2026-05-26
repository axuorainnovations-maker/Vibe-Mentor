import { Router, Response } from 'express';
import { optionalAuth, AuthRequest } from '../middleware/auth';

const router = Router();

const SYSTEM_PROMPT = `You are Vibe Mentor AI, a friendly and knowledgeable coding mentor for kids and teens. You help students build projects, explain concepts simply, and encourage creativity. Keep responses concise, encouraging, and age-appropriate. Use examples and analogies.

IMPORTANT: You must format every response with two sections:

<reasoning>
Your internal step-by-step reasoning. Think through the user's request, consider your approach, and explain your thought process. This is your "thinking" that will be shown to the user.
</reasoning>
<response>
Your final response to the user. Be concise, encouraging, and age-appropriate.
</response>`;

router.post('/', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { message, history } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required' });

    const openRouterKey = process.env.OPENROUTER_API_KEY?.trim();
    if (!openRouterKey || openRouterKey === 'your-openrouter-api-key' || !openRouterKey.startsWith('sk-')) {
      return res.status(200).json({
        role: 'assistant',
        thinking: 'The user is asking me to respond. I should provide a helpful introduction.',
        content: `Hey! I'm your Vibe Mentor AI assistant. I can help you build projects, answer questions, and guide your learning journey.\n\nTo get started, try telling me what you'd like to build or learn about!`,
      });
    }

    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
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
        max_tokens: 4000,
      }),
    });

    const result: { choices?: Array<{ message?: { content?: string } }>; error?: { message?: string } } =
      await response.json();

    if (!response.ok) {
      const apiError = result.error?.message || 'OpenRouter request failed';
      return res.status(response.status).json({ error: apiError });
    }

    const rawContent = result.choices?.[0]?.message?.content || '';

    const reasoningMatch = rawContent.match(/<reasoning>([\s\S]*?)<\/reasoning>/);
    const responseMatch = rawContent.match(/<response>([\s\S]*?)(?:<\/response>|$)/);

    const thinking = reasoningMatch
      ? reasoningMatch[1].trim()
      : 'Thinking through your request...';

    let content = responseMatch
      ? responseMatch[1].trim()
      : rawContent.replace(/<reasoning>[\s\S]*?<\/reasoning>/g, '').replace(/<\/?response>/g, '').trim();

    res.json({ role: 'assistant', thinking, content });
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ error: 'Failed to generate response' });
  }
});

export default router;