import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const foundationCourses = [
  {
    title: 'What Is AI? (The Basics)',
    description: 'Learn what Artificial Intelligence is, how it works, and why it matters in our world today.',
    ageGroup: '4-11',
    type: 'foundation',
    difficulty: 'beginner',
    estimatedHours: 2,
    lessons: [
      {
        lessonNumber: 1,
        title: 'What Does "Artificial Intelligence" Mean?',
        objective: 'Understand what AI is in simple terms',
        explanation: 'Artificial Intelligence (AI) is like giving a computer a brain! Just like you learn from experience, AI learns from data. When you show a computer many pictures of cats, it learns to recognize cats. AI is everywhere - in your games, in YouTube recommendations, and even in smart speakers!',
        simplifiedConcept: 'AI is a computer that can learn things, just like you do!',
        realWorldExamples: [
          'YouTube suggests videos you might like using AI',
          'Smart speakers like Alexa use AI to understand your voice',
          'Video games use AI to make characters smarter',
        ],
        checklistTasks: [
          { id: 'what-is-ai-1-1', type: 'text_input', title: 'What Do You Think AI Is?', description: 'Write in your own words what you think AI means' },
          { id: 'what-is-ai-1-2', type: 'multiple_choice', title: 'Can AI Learn?', description: 'Choose the correct answer', options: [{ label: 'Yes, AI can learn from examples', correct: true }, { label: 'No, AI只能do what it is programmed', correct: false }, { label: 'Only sometimes', correct: false }] },
          { id: 'what-is-ai-1-3', type: 'checkbox', title: 'Watch: What is AI?', description: 'Watch the introductory video about AI' },
        ],
      },
      {
        lessonNumber: 2,
        title: 'How Does AI Learn?',
        objective: 'Understand how AI improves with practice',
        explanation: 'AI learns the same way you do - by practicing! When you learn to ride a bike, you fall a few times before you get it right. AI does the same thing. It tries, makes mistakes, learns from them, and tries again. This is called "machine learning." The more data (information) AI gets, the smarter it becomes.',
        simplifiedConcept: 'AI gets better by practicing lots and lots, just like you!',
        realWorldExamples: [
          'AI practiced millions of chess games to become really good',
          'Google Translate learned from billions of translated sentences',
          'Face filters on your phone learned from millions of faces',
        ],
        checklistTasks: [
          { id: 'what-is-ai-2-1', type: 'true_false', title: 'AI Is Perfect Immediately', description: 'AI never makes mistakes when it starts', correctAnswer: false },
          { id: 'what-is-ai-2-2', type: 'text_input', title: 'How Does Practice Help AI?', description: 'Explain why practicing helps AI get better' },
          { id: 'what-is-ai-2-3', type: 'matching_game', title: 'Match the Concept', description: 'Match AI concepts with their meanings', pairs: [{ left: 'Data', right: 'Information AI learns from' }, { left: 'Training', right: 'When AI practices' }, { left: 'Model', right: 'The smart AI after training' }] },
        ],
      },
      {
        lessonNumber: 3,
        title: 'AI Can See, Hear, and Talk',
        objective: 'Learn about the different ways AI perceives the world',
        explanation: 'AI can do amazing things! Some AI can "see" by looking at pictures (computer vision). Some AI can "hear" by listening to sounds (speech recognition). And some AI can "talk" by generating human-like speech. Each type of AI is trained differently to do its special job.',
        simplifiedConcept: 'AI can be trained to see, hear, and even talk to us!',
        realWorldExamples: [
          'Your phone can unlock by recognizing your face (computer vision)',
          'Closed captions on YouTube are made by AI that listens',
          'Chatbots like ChatGPT can talk to you like a friend',
        ],
        checklistTasks: [
          { id: 'what-is-ai-3-1', type: 'multiple_choice', title: 'How Does AI See?', description: 'What do we call it when AI can recognize images?', options: [{ label: 'Computer Vision', correct: true }, { label: 'AI Hearing', correct: false }, { label: 'Robot Eyes', correct: false }] },
          { id: 'what-is-ai-3-2', type: 'screenshot_upload', title: 'Find an AI in Your Life', description: 'Take a screenshot of an AI tool you use (like YouTube recommendations or a smart speaker app)' },
          { id: 'what-is-ai-3-3', type: 'text_input', title: 'Which AI Is Your Favorite?', description: 'Tell us which AI tool you use the most and why' },
        ],
      },
      {
        lessonNumber: 4,
        title: 'Good AI vs Bad AI',
        objective: 'Understand that AI can be used for good or bad purposes',
        explanation: 'AI is a tool, like a pencil. You can use a pencil to draw a beautiful picture or to write something mean. The same is true for AI. Good AI helps people - like doctors finding sickness faster. Bad AI can trick people or spread lies. This is why we need to learn about AI - so we can use it for good!',
        simplifiedConcept: 'AI can help people or hurt people - it depends on how we use it!',
        realWorldExamples: [
          'Good AI helps doctors find diseases in X-rays',
          'Good AI helps farmers know when to plant crops',
          'Bad AI can create fake videos that look real (deepfakes)',
        ],
        checklistTasks: [
          { id: 'what-is-ai-4-1', type: 'true_false', title: 'AI Is Always Good', description: 'AI is always helpful and never causes problems', correctAnswer: false },
          { id: 'what-is-ai-4-2', type: 'text_input', title: 'How Would You Use AI for Good?', description: 'Describe one way you would use AI to help people' },
          { id: 'what-is-ai-4-3', type: 'checkbox', title: 'Watch: AI Safety', description: 'Watch the video about using AI responsibly' },
        ],
      },
      {
        lessonNumber: 5,
        title: 'Your AI Future',
        objective: 'Imagine how AI will shape the future and your role in it',
        explanation: 'AI is going to change everything! In the future, AI will drive cars, help teachers teach, help farmers grow food, and even help scientists discover new medicines. By learning about AI now, you are preparing for a future where AI is everywhere. You can be someone who creates AI, not just someone who uses it!',
        simplifiedConcept: 'By learning about AI today, you can be the one who creates the future!',
        realWorldExamples: [
          'Future AI might help clean up our oceans',
          'AI tutors could help every child learn anything',
          'AI artists could help you create amazing art',
        ],
        checklistTasks: [
          { id: 'what-is-ai-5-1', type: 'text_input', title: 'What Will AI Do in 10 Years?', description: 'Imagine and describe what AI might be able to do in 10 years' },
          { id: 'what-is-ai-5-2', type: 'screenshot_upload', title: 'Design Your AI Invention', description: 'Draw or design your own AI invention and upload a screenshot' },
          { id: 'what-is-ai-5-3', type: 'multiple_choice', title: 'Should You Learn About AI?', description: 'Is it important for kids to learn about AI?', options: [{ label: 'Yes, so we can create the future!', correct: true }, { label: 'No, only adults need to know', correct: false }, { label: 'Maybe, it depends', correct: false }] },
        ],
      },
    ],
  },
  {
    title: 'How To Talk To AI',
    description: 'Master the art of prompting - learn how to ask AI questions and get the best answers.',
    ageGroup: '4-11',
    type: 'foundation',
    difficulty: 'beginner',
    estimatedHours: 2,
    lessons: [
      {
        lessonNumber: 1,
        title: 'What Is a Prompt?',
        objective: 'Understand what a prompt is and why it matters',
        explanation: 'A prompt is simply what you say to an AI. Think of it like asking a friend a question. If you ask "What is that?" your friend doesn\'t know what you mean. But if you ask "What is that red bird in the tree?" your friend can answer! The same is true for AI. Better prompts = Better answers.',
        simplifiedConcept: 'A prompt is just the question or instruction you give to AI!',
        realWorldExamples: [
          'Bad: "Tell me about space" → Gets a very general answer',
          'Good: "Tell me 3 fun facts about Mars for a 10-year-old" → Gets a perfect answer',
        ],
        checklistTasks: [
          { id: 'prompt-1-1', type: 'text_input', title: 'Write a Prompt', description: 'Write a prompt you would use to ask AI about dinosaurs' },
          { id: 'prompt-1-2', type: 'multiple_choice', title: 'What Is a Prompt?', description: 'Choose the best definition', options: [{ label: 'A question or instruction for AI', correct: true }, { label: 'A type of computer', correct: false }, { label: 'A programming language', correct: false }] },
        ],
      },
      {
        lessonNumber: 2,
        title: 'The Magic Formula: Context + Question',
        objective: 'Learn how to structure effective prompts',
        explanation: 'The secret to great prompts is simple: give context first, then ask your question. Context means telling the AI WHO you are, WHAT you need, and HOW you want the answer. For example: "I am a 10-year-old learning about space. Explain what a black hole is in simple words, with 2 examples."',
        simplifiedConcept: 'First tell AI about yourself, then ask your question clearly!',
        realWorldExamples: [
          'Without context: "Tell me about coding"',
          'With context: "I am 12 and want to make a game. What coding language should I learn first? Keep it simple!"',
        ],
        checklistTasks: [
          { id: 'prompt-2-1', type: 'text_input', title: 'Use the Formula', description: 'Write a prompt using Context + Question about a topic you love' },
          { id: 'prompt-2-2', type: 'matching_game', title: 'Match Prompt Parts', description: 'Match each part of a prompt to its purpose', pairs: [{ left: 'Context', right: 'Who you are and what you need' }, { left: 'Question', right: 'What you want to know' }, { left: 'Format', right: 'How you want the answer' }] },
        ],
      },
      {
        lessonNumber: 3,
        title: 'Getting Specific',
        objective: 'Learn how details make AI answers better',
        explanation: 'The more specific you are, the better AI answers! Instead of "Tell me about cars," say "Tell me about electric cars and how they are better for the environment. List 3 reasons." Specific prompts give AI clear boundaries and expectations.',
        simplifiedConcept: 'Be specific! AI reads your mind about as well as your pet does.',
        realWorldExamples: [
          'Vague: "Write a story"',
          'Specific: "Write a 1-page story about a brave cat who saves his family from a fire. For kids age 8."',
        ],
        checklistTasks: [
          { id: 'prompt-3-1', type: 'text_input', title: 'Make It Specific', description: 'Take a vague prompt and make it specific' },
          { id: 'prompt-3-2', type: 'true_false', title: 'Vague Prompts Work Best', description: 'Giving vague, short prompts always gets the best answers', correctAnswer: false },
        ],
      },
      {
        lessonNumber: 4,
        title: 'Asking AI to Explain Itself',
        objective: 'Learn how to ask AI why it gave a certain answer',
        explanation: 'One of the best things about AI is that you can ask it WHY it said something! If AI gives you an answer you don\'t understand, just say "Explain that in simpler terms" or "Why did you say that?" This helps you learn and makes sure the AI is correct.',
        simplifiedConcept: 'You can ask AI "Why?" just like you ask your teacher!',
        realWorldExamples: [
          '"Why did you suggest learning Python first?"',
          '"Can you explain that like I am 10 years old?"',
          '"Give me an example of what you mean"',
        ],
        checklistTasks: [
          { id: 'prompt-4-1', type: 'screenshot_upload', title: 'Ask AI and Question It', description: 'Use ChatGPT or any AI to answer something, then ask it "why" and screenshot both answers' },
          { id: 'prompt-4-2', type: 'text_input', title: 'Your Follow-Up Question', description: 'Write a follow-up question you would ask AI to learn more' },
        ],
      },
      {
        lessonNumber: 5,
        title: 'Prompt Challenge!',
        objective: 'Apply all prompt skills in a creative challenge',
        explanation: 'Now you know all the secrets of talking to AI! Let\'s put it all together. Remember: Context + Specific Question + Format. Use this formula to get AI to help you create something amazing - a story, a game idea, a recipe, or anything you imagine!',
        simplifiedConcept: 'You are now a Prompt Master! Go create something amazing with AI!',
        realWorldExamples: [],
        checklistTasks: [
          { id: 'prompt-5-1', type: 'text_input', title: 'Your Best Prompt', description: 'Write your best prompt to make AI create something awesome' },
          { id: 'prompt-5-2', type: 'screenshot_upload', title: 'Show the Result', description: 'Use your prompt with an AI tool and screenshot the result' },
          { id: 'prompt-5-3', type: 'checkbox', title: 'Share Your Creation', description: 'Share what you created with AI on the discussion board' },
        ],
      },
    ],
  },
  {
    title: 'Meet The AI Tools',
    description: 'Explore practical AI tools you can use today for creativity, learning, and fun projects.',
    ageGroup: '4-11',
    type: 'foundation',
    difficulty: 'beginner',
    estimatedHours: 3,
    lessons: [
      {
        lessonNumber: 1,
        title: 'ChatGPT: Your AI Assistant',
        objective: 'Learn how to use ChatGPT as a learning companion',
        explanation: 'ChatGPT is like having a super-smart friend who knows everything! You can ask it questions, get help with homework, generate ideas, or just chat. Remember: ChatGPT is a tool to help you learn, not to do your work for you. Use it to understand things better, get unstuck, and explore new topics.',
        simplifiedConcept: 'ChatGPT is a friendly AI that can answer almost any question you have!',
        realWorldExamples: [
          'Ask ChatGPT to explain photosynthesis in simple terms',
          'Get ChatGPT to help you brainstorm ideas for a school project',
          'Use ChatGPT to practice a new language by chatting',
        ],
        checklistTasks: [
          { id: 'tools-1-1', type: 'text_input', title: 'Your First Chat', description: 'Ask ChatGPT one question and write the answer you got' },
          { id: 'tools-1-2', type: 'screenshot_upload', title: 'ChatGPT Screenshot', description: 'Take a screenshot of your conversation with ChatGPT' },
          { id: 'tools-1-3', type: 'multiple_choice', title: 'What Can ChatGPT Do?', description: 'Which of these can ChatGPT help with?', options: [{ label: 'Answer questions and explain things', correct: true }, { label: 'Cook dinner for you', correct: false }, { label: 'Clean your room', correct: false }] },
        ],
      },
      {
        lessonNumber: 2,
        title: 'AI Image Makers (DALL-E, Midjourney)',
        objective: 'Explore AI tools that create images from text descriptions',
        explanation: 'Did you know you can describe any picture and AI will draw it for you? Tools like DALL-E and Midjourney can create images from your words. Want to see "a purple elephant flying over a rainbow castle with ice cream mountains"? Just describe it and AI will make it! This is great for creative projects, presentations, and art.',
        simplifiedConcept: 'You can become an artist just by describing what you want to see!',
        realWorldExamples: [
          'Describe a scene for your book report cover',
          'Create illustrations for your school presentation',
          'Design characters for a story you are writing',
        ],
        checklistTasks: [
          { id: 'tools-2-1', type: 'text_input', title: 'Design Your Prompt', description: 'Write a detailed description of an image you want AI to create' },
          { id: 'tools-2-2', type: 'screenshot_upload', title: 'Your AI Artwork', description: 'Use an AI image tool and upload what it created' },
        ],
      },
      {
        lessonNumber: 3,
        title: 'AI for Schoolwork (Smart Study Buddy)',
        objective: 'Learn how to use AI to study smarter, not harder',
        explanation: 'AI can be your ultimate study buddy! It can create practice quizzes, summarize long articles, explain difficult concepts in simple words, and help you organize your notes. But remember - always check what AI tells you, and never copy AI answers as your own work. Use AI to understand, not to avoid learning.',
        simplifiedConcept: 'AI is like having a personal tutor that is always ready to help you study!',
        realWorldExamples: [
          'Ask AI to make a practice quiz for your science test',
          'Get AI to summarize a long chapter into 5 bullet points',
          'Have AI explain a math problem step by step',
        ],
        checklistTasks: [
          { id: 'tools-3-1', type: 'text_input', title: 'AI Study Help', description: 'Ask AI to help you understand a school topic and write what you learned' },
          { id: 'tools-3-2', type: 'true_false', title: 'AI Is Always Right', description: 'You should always trust AI answers without checking', correctAnswer: false },
        ],
      },
      {
        lessonNumber: 4,
        title: 'AI Video & Music Creators',
        objective: 'Explore how AI can create videos and music',
        explanation: 'AI is not just for text and pictures - it can make music and videos too! Tools like Suno AI can create songs from your lyrics, and RunwayML can generate short videos from text descriptions. This is incredibly fun for creative projects, but also teaches you how AI is changing entertainment and media.',
        simplifiedConcept: 'AI can help you make your own songs and videos, even if you are not a musician yet!',
        realWorldExamples: [
          'Create a song about your favorite subject for a school project',
          'Make a short animated video about a historical event',
          'Generate background music for your video presentation',
        ],
        checklistTasks: [
          { id: 'tools-4-1', type: 'text_input', title: 'Your AI Song Lyrics', description: 'Write lyrics for a song about something you love, like AI would create' },
          { id: 'tools-4-2', type: 'checkbox', title: 'Try an AI Music Tool', description: 'Try Suno AI or similar to create a short song' },
        ],
      },
      {
        lessonNumber: 5,
        title: 'AI Safety & Responsible Use',
        objective: 'Understand how to use AI safely and responsibly',
        explanation: 'With great power comes great responsibility! AI is powerful, so we need to use it wisely. Never share personal information with AI (your full name, address, phone number). Always check AI facts with trusted sources. And remember - AI is a tool to help you learn and create, not a replacement for your own brain!',
        simplifiedConcept: 'Use AI like a helpful tool, but always use your own brain too!',
        realWorldExamples: [
          'Never tell AI your password or home address',
          'Always double-check AI answers with a teacher or parent',
          'Never use AI to write your homework - use it to understand instead',
        ],
        checklistTasks: [
          { id: 'tools-5-1', type: 'multiple_choice', title: 'AI Safety Rule', description: 'What should you NOT share with AI?', options: [{ label: 'Your home address', correct: true }, { label: 'Questions about science', correct: false }, { label: 'Ideas for stories', correct: false }] },
          { id: 'tools-5-2', type: 'text_input', title: 'Your AI Promise', description: 'Write a promise for how you will use AI responsibly' },
          { id: 'tools-5-3', type: 'checkbox', title: 'Share With Parent', description: 'Share what you learned about AI safety with a parent or guardian' },
        ],
      },
    ],
  },
];

async function seed() {
  for (const courseData of foundationCourses) {
    const { lessons, ...courseInfo } = courseData;
    const existing = await prisma.course.findFirst({
      where: { title: courseInfo.title, type: 'foundation' },
    });
    if (existing) {
      console.log(`Skipping existing course: ${courseInfo.title}`);
      continue;
    }

    const course = await prisma.course.create({
      data: {
        ...courseInfo,
        lessons: {
          create: lessons.map(l => ({
            lessonNumber: l.lessonNumber,
            title: l.title,
            objective: l.objective,
            explanation: l.explanation,
            simplifiedConcept: l.simplifiedConcept || null,
            realWorldExamples: JSON.stringify(l.realWorldExamples || []),
            voiceNarration: null,
            checklistTasks: JSON.stringify(l.checklistTasks || []),
          })),
        },
      },
    });
    console.log(`Seeded: ${course.title}`);
  }

  console.log('Foundation courses seeded successfully!');
}

seed()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
