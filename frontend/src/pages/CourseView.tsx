import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../utils/api';
import { ArrowLeft, BookOpen, Clock, CheckCircle, Play, Lock } from 'lucide-react';

interface Lesson {
  id: string;
  lessonNumber: number;
  title: string;
  objective: string;
  checklistTasks: any[];
}

interface Course {
  id: string;
  title: string;
  description: string;
  type: string;
  difficulty: string;
  estimatedHours: number;
  ageGroup: string;
  lessons: Lesson[];
  userProgress: { progress: number; status: string } | null;
}

export default function CourseView() {
  const { id } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    api.get(`/courses/${id}`)
      .then(setCourse)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleEnroll = async () => {
    setEnrolling(true);
    try {
      await api.post(`/courses/${id}/enroll`);
      const updated = await api.get(`/courses/${id}`);
      setCourse(updated);
    } catch (err) {
      console.error('Enroll failed:', err);
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-24">
        <p className="text-text-secondary">Course not found</p>
        <Link to="/courses" className="text-primary text-sm mt-4 block">Back to courses</Link>
      </div>
    );
  }

  const isEnrolled = course.userProgress !== null;
  const progress = course.userProgress?.progress || 0;
  const firstLessonId = course.lessons[0]?.id;

  return (
    <div className="space-y-8">
      <Link to="/courses" className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors">
        <ArrowLeft size={16} />
        Back to courses
      </Link>

      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <span className={`px-2 py-0.5 rounded-lg text-xs font-medium ${
              course.type === 'foundation' ? 'bg-blue-500/10 text-blue-400' : 'bg-primary/10 text-primary'
            }`}>
              {course.type === 'foundation' ? 'Foundation' : 'Project'}
            </span>
            <span className="text-xs text-text-secondary capitalize">{course.difficulty}</span>
          </div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">{course.title}</h1>
          <p className="text-text-secondary">{course.description}</p>
          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <BookOpen size={16} />
              {course.lessons.length} lessons
            </div>
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <Clock size={16} />
              {course.estimatedHours} hours
            </div>
          </div>
        </div>

        {!isEnrolled && (
          <button
            onClick={handleEnroll}
            disabled={enrolling}
            className="h-11 px-6 rounded-xl bg-primary text-white text-sm font-semibold flex items-center gap-2 hover:bg-primary-hover disabled:opacity-50 transition-colors"
          >
            {enrolling ? 'Enrolling...' : 'Start Course'}
          </button>
        )}
      </div>

      {isEnrolled && progress > 0 && (
        <div className="p-4 rounded-2xl bg-surface border border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-text-primary">Progress</span>
            <span className="text-sm font-medium text-primary">{progress}%</span>
          </div>
          <div className="h-2 rounded-full bg-border">
            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      <section>
        <h2 className="text-lg font-semibold text-text-primary mb-4">Lessons</h2>
        <div className="space-y-2">
          {course.lessons.map((lesson, index) => {
            const isFirst = index === 0;
            const isAccessible = isEnrolled && isFirst;

            return (
              <div
                key={lesson.id}
                className={`p-4 rounded-2xl bg-surface border border-border flex items-center gap-4 ${
                  isAccessible ? 'hover:border-primary/30 cursor-pointer transition-all group' : 'opacity-60'
                }`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-semibold ${
                  progress > ((index) / course.lessons.length) * 100
                    ? 'bg-green-500/10 text-green-400'
                    : 'bg-surface-light text-text-secondary'
                }`}>
                  {progress > ((index) / course.lessons.length) * 100 ? (
                    <CheckCircle size={16} className="text-green-400" />
                  ) : (
                    lesson.lessonNumber
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-text-primary">{lesson.title}</h3>
                  <p className="text-xs text-text-secondary mt-0.5">{lesson.objective}</p>
                </div>
                {isAccessible && (
                  <Link
                    to={`/lessons/${lesson.id}`}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary/10 text-primary text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Play size={14} />
                    Start
                  </Link>
                )}
                {!isAccessible && !isEnrolled && (
                  <Lock size={16} className="text-text-secondary" />
                )}
                {isEnrolled && !isFirst && progress <= ((index - 1) / course.lessons.length) * 100 && (
                  <Lock size={16} className="text-text-secondary" />
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
