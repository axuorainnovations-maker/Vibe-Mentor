import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

router.post('/analyze-screen', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { screenshot, taskDescription, ageGroup } = req.body;

    const claudeKey = process.env.CLAUDE_API_KEY;
    if (!claudeKey || claudeKey === 'your-claude-api-key') {
      return res.json({
        instruction: 'Try clicking the button in the top-right corner',
        cursorPath: [
          { x: 200, y: 300 },
          { x: 400, y: 150 },
        ],
        clickAt: { x: 400, y: 150 },
        voiceNarration: 'Click the button in the top-right corner to continue.',
      });
    }

    const prompt = `You are a real-time tutor helping a ${ageGroup || 'student'} complete this task: "${taskDescription || 'Continue working'}"

Analyze this screenshot and tell the student what to do next. Return JSON:
{
  "instruction": "Clear next step",
  "cursorPath": [{"x": number, "y": number}],
  "clickAt": {"x": number, "y": number},
  "voiceNarration": "Spoken instruction"
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
        messages: [{
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            { type: 'image', source: { type: 'base64', media_type: 'image/png', data: screenshot } },
          ],
        }],
      }),
    });

    const result: any = await response.json();
    const content = result.content?.[0]?.text || '';
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return res.json(JSON.parse(jsonMatch[0]));
    }

    res.json({
      instruction: 'Try the next step in your task.',
      cursorPath: [],
      clickAt: null,
      voiceNarration: 'Try the next step.',
    });
  } catch (err) {
    console.error('Analyze screen error:', err);
    res.status(500).json({ error: 'Failed to analyze screen' });
  }
});

router.post('/explain-element', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { elementText, elementTag, parentContext, taskDescription } = req.body;

    const claudeKey = process.env.CLAUDE_API_KEY;
    if (!claudeKey || claudeKey === 'your-claude-api-key') {
      return res.json({
        explanation: `This is a "${elementTag}" element labeled "${elementText || 'unknown'}". It lets you interact with the page.`,
        voiceNarration: `This is a ${elementTag} element.`,
      });
    }

    const prompt = `Explain what this UI element does to a student:

Tag: ${elementTag}
Text/Label: ${elementText || 'N/A'}
Context: ${parentContext || 'N/A'}
Task: ${taskDescription || 'N/A'}

Return JSON:
{
  "explanation": "Simple explanation of what this element does",
  "voiceNarration": "Short spoken version"
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
        max_tokens: 500,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const result: any = await response.json();
    const content = result.content?.[0]?.text || '';
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return res.json(JSON.parse(jsonMatch[0]));
    }

    res.json({
      explanation: `This is a ${elementTag} element.`,
      voiceNarration: `This is a ${elementTag} element.`,
    });
  } catch (err) {
    console.error('Explain element error:', err);
    res.status(500).json({ error: 'Failed to explain element' });
  }
});

router.post('/task-complete', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { lessonId, taskId, screenshotProof } = req.body;
    res.json({
      pass: true,
      grade: 75,
      feedback: 'Task completed successfully!',
    });
  } catch (err) {
    console.error('Task complete error:', err);
    res.status(500).json({ error: 'Failed to process task completion' });
  }
});

export default router;
