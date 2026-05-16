import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { api } from '../utils/api';
import { Sparkles, ArrowRight, Loader2, Lightbulb, Code, Palette, Video, Bot } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string;
  type: string;
  difficulty: string;
  progress: number;
  status: string | null;
  ageGroup: string;
  _count: { lessons: number };
}

const ideaSuggestions = [
  { icon: Code, label: 'Build a website for my business' },
  { icon: Palette, label: 'Design a brand and logo' },
  { icon: Video, label: 'Make a TikTok series' },
  { icon: Bot, label: 'Learn AI video editing' },
  { icon: Lightbulb, label: 'Create an app for my friends' },
];

export default function Courses() {
  const { user } = useAuthStore();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [idea, setIdea] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generatedCourse, setGeneratedCourse] = useState<any>(null);

  useEffect(() => {
    api.get('/courses')
      .then(setCourses)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleGenerate = async () => {
    if (!idea.trim()) return;
    setGenerating(true);
    setGeneratedCourse(null);
    try {
      const result = await api.post('/courses/generate', {
        studentIdea: idea,
        skillLevel: 'beginner',
      });
      setGeneratedCourse(result);
      setCourses(prev => [{
        id: result.courseId,
        title: result.title,
        description: '',
        type: 'project',
        difficulty: 'beginner',
        progress: 0,
        status: null,
        ageGroup: user?.ageGroup || '12+',
        _count: { lessons: result.lessons },
      }, ...prev]);
    } catch (err: any) {
      console.error('Generation failed:', err);
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-text-primary">Courses</h1>
        <p className="text-text-secondary mt-1">Start learning or create a new course</p>
      </div>

      {user?.ageGroup === '12+' && (
        <section className="p-6 rounded-2xl bg-surface border border-border">
          <h2 className="text-lg font-semibold text-text-primary mb-2">What would you like to build?</h2>
          <p className="text-sm text-text-secondary mb-4">
            Tell us your idea and we'll generate a personalized course with AI
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {ideaSuggestions.map((s) => (
              <button
                key={s.label}
                onClick={() => setIdea(s.label)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-light border border-border text-xs text-text-secondary hover:border-primary/50 hover:text-text-primary transition-all"
              >
                <s.icon size={14} />
                {s.label}
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <input
              type="text"
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="I want to..."
              className="flex-1 h-11 px-4 rounded-xl bg-[#0B0F14] border border-border text-text-primary text-sm focus:outline-none focus:border-primary transition-colors"
            />
            <button
              onClick={handleGenerate}
              disabled={generating || !idea.trim()}
              className="h-11 px-6 rounded-xl bg-primary text-white text-sm font-semibold flex items-center gap-2 hover:bg-primary-hover disabled:opacity-50 transition-colors"
            >
              {generating ? (
                <><Loader2 size={16} className="animate-spin" /> Generating...</>
              ) : (
                <><Sparkles size={16} /> Generate My Course</>
              )}
            </button>
          </div>

          {generatedCourse && (
            <div className="mt-4 p-4 rounded-xl bg-primary/10 border border-primary/20">
              <p className="text-sm font-semibold text-primary mb-1">Course Generated!</p>
              <p className="text-sm text-text-primary">{generatedCourse.title}</p>
              <p className="text-xs text-text-secondary mt-1">{generatedCourse.lessons} lessons</p>
            </div>
          )}
        </section>
      )}

      <section>
        <h2 className="text-lg font-semibold text-text-primary mb-4">
          {user?.ageGroup === '4-11' ? 'Foundation Courses' : 'All Courses'}
        </h2>

        {courses.length === 0 ? (
          <div className="p-12 rounded-2xl bg-surface border border-border text-center">
            <Sparkles size={32} className="text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-text-primary mb-2">No courses available</h3>
            <p className="text-sm text-text-secondary">Check back soon for new courses!</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {courses.map((course) => (
              <Link
                key={course.id}
                to={`/courses/${course.id}`}
                className="p-5 rounded-2xl bg-surface border border-border hover:border-primary/30 transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className={`px-2 py-0.5 rounded-lg text-xs font-medium ${
                    course.type === 'foundation' ? 'bg-blue-500/10 text-blue-400' : 'bg-primary/10 text-primary'
                  }`}>
                    {course.type === 'foundation' ? 'Foundation' : 'Project'}
                  </span>
                  {course.status === 'in-progress' && (
                    <span className="text-xs text-primary">{course.progress}%</span>
                  )}
                </div>
                <h3 className="text-sm font-semibold text-text-primary mb-1">{course.title}</h3>
                <p className="text-xs text-text-secondary line-clamp-2 mb-4">{course.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-secondary">{course._count.lessons} lessons</span>
                  <span className="text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    {course.status === 'completed' ? 'Completed' : 'View course'}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
