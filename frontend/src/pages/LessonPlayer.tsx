import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import { ArrowLeft, Volume2, CheckCircle, Circle, Upload, Play, ChevronRight } from 'lucide-react';

interface Task {
  id: string;
  type: string;
  title: string;
  description: string;
  options?: { label: string; correct: boolean }[];
  correctAnswer?: boolean;
  pairs?: { left: string; right: string }[];
}

interface Lesson {
  id: string;
  title: string;
  lessonNumber: number;
  objective: string;
  explanation: string;
  simplifiedConcept?: string;
  realWorldExamples: string[];
  voiceNarration?: string;
  checklistTasks: Task[];
  progress: { status: string; completedTasks: number } | null;
  courseId: string;
}

export default function LessonPlayer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ taskId: string; score: number; level: string; feedback: string } | null>(null);
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.get(`/lessons/${id}`);
        setLesson(data);
        await api.post(`/lessons/${id}/start`);
      } catch (err) {
        console.error('Failed to load lesson:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.onend = () => setSpeaking(false);
      setSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleTextSubmit = async (taskId: string, value: string) => {
    if (!value.trim()) return;
    setSubmitting(taskId);
    try {
      const result = await api.post(`/lessons/${id}/submit-task`, {
        taskId, submissionType: 'text_input', submissionData: value,
      });
      setCompletedTasks(prev => new Set(prev).add(taskId));
      if (result.grading) {
        setFeedback({ taskId, ...result.grading });
      }
    } catch (err) {
      console.error('Submit failed:', err);
    } finally {
      setSubmitting(null);
    }
  };

  const handleMCSubmit = async (taskId: string, selected: string, correct: boolean) => {
    setSubmitting(taskId);
    try {
      const result = await api.post(`/lessons/${id}/submit-task`, {
        taskId, submissionType: 'multiple_choice', submissionData: selected,
      });
      setCompletedTasks(prev => new Set(prev).add(taskId));
      if (!correct) {
        setFeedback({ taskId, score: 30, level: 'attempted', feedback: 'Not quite right. Try again!' });
        return;
      }
      if (result.grading) setFeedback({ taskId, ...result.grading });
    } finally {
      setSubmitting(null);
    }
  };

  const handleTFSubmit = async (taskId: string, answer: boolean, correct: boolean) => {
    setSubmitting(taskId);
    try {
      await api.post(`/lessons/${id}/submit-task`, {
        taskId, submissionType: 'true_false', submissionData: String(answer),
      });
      setCompletedTasks(prev => new Set(prev).add(taskId));
      setFeedback({
        taskId, score: correct ? 100 : 30,
        level: correct ? 'completed' : 'attempted',
        feedback: correct ? 'Correct!' : 'Not quite. Think about it and try again.',
      });
    } finally {
      setSubmitting(null);
    }
  };

  const handleScreenshotUpload = async (taskId: string, file: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      setSubmitting(taskId);
      try {
        const result = await api.post(`/lessons/${id}/submit-task`, {
          taskId, submissionType: 'screenshot', submissionData: e.target?.result,
        });
        setCompletedTasks(prev => new Set(prev).add(taskId));
        if (result.grading) setFeedback({ taskId, ...result.grading });
      } finally {
        setSubmitting(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCheckbox = async (taskId: string) => {
    setSubmitting(taskId);
    try {
      await api.post(`/lessons/${id}/submit-task`, {
        taskId, submissionType: 'checkbox', submissionData: 'completed',
      });
      setCompletedTasks(prev => new Set(prev).add(taskId));
    } finally {
      setSubmitting(null);
    }
  };

  const handleMatchingSubmit = async (taskId: string) => {
    setSubmitting(taskId);
    try {
      await api.post(`/lessons/${id}/submit-task`, {
        taskId, submissionType: 'matching_game', submissionData: JSON.stringify(matches),
      });
      setCompletedTasks(prev => new Set(prev).add(taskId));
      setFeedback({ taskId, score: 70, level: 'completed', feedback: 'Great matching!' });
    } finally {
      setSubmitting(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!lesson) {
    return <div className="text-center py-24 text-text-secondary">Lesson not found</div>;
  }

  const tasks = lesson.checklistTasks || [];
  const percentDone = tasks.length > 0 ? Math.round((completedTasks.size / tasks.length) * 100) : 0;
  const canProceed = percentDone >= 80;

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate(`/courses/${lesson.courseId}`)}
        className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
      >
        <ArrowLeft size={16} />
        Back to course
      </button>

      <div className="flex gap-8">
        <div className="flex-1 min-w-0 space-y-6">
          <div>
            <p className="text-xs font-medium text-primary mb-1">Lesson {lesson.lessonNumber}</p>
            <h1 className="text-2xl font-bold text-text-primary">{lesson.title}</h1>
          </div>

          <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
            <p className="text-sm font-medium text-primary mb-1">Objective</p>
            <p className="text-sm text-text-primary">{lesson.objective}</p>
          </div>

          <div>
            <p className="text-sm text-text-primary leading-relaxed">{lesson.explanation}</p>
          </div>

          {lesson.simplifiedConcept && (
            <div className="p-4 rounded-2xl bg-surface border border-border">
              <p className="text-xs font-medium text-text-secondary mb-1">Simplified</p>
              <p className="text-sm text-text-primary">{lesson.simplifiedConcept}</p>
            </div>
          )}

          {lesson.realWorldExamples.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-text-primary mb-3">Real World Examples</h3>
              <ul className="space-y-2">
                {lesson.realWorldExamples.map((ex, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-text-secondary">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                    {ex}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button
            onClick={() => speak(lesson.explanation)}
            className="flex items-center gap-2 px-4 h-10 rounded-xl bg-surface border border-border text-sm text-text-secondary hover:text-text-primary hover:border-primary/30 transition-all"
          >
            <Volume2 size={16} className={speaking ? 'text-primary' : ''} />
            {speaking ? 'Playing...' : 'Play Audio'}
          </button>
        </div>

        <div className="w-80 flex-shrink-0 space-y-4">
          <div className="p-4 rounded-2xl bg-surface border border-border">
            <h3 className="text-sm font-semibold text-text-primary mb-3">Tasks</h3>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex-1 h-1.5 rounded-full bg-border">
                <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${percentDone}%` }} />
              </div>
              <span className="text-xs text-text-secondary">{completedTasks.size}/{tasks.length}</span>
            </div>

            <div className="space-y-3">
              {tasks.map((task) => {
                const isDone = completedTasks.has(task.id);
                return (
                  <div key={task.id} className={`p-3 rounded-xl border ${isDone ? 'border-green-500/20 bg-green-500/5' : 'border-border bg-[#0B0F14]'}`}>
                    <div className="flex items-start gap-2">
                      {isDone ? (
                        <CheckCircle size={16} className="text-green-400 mt-0.5 flex-shrink-0" />
                      ) : (
                        <Circle size={16} className="text-text-secondary mt-0.5 flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text-primary">{task.title}</p>
                        <p className="text-xs text-text-secondary mt-1">{task.description}</p>

                        {!isDone && (
                          <div className="mt-3">
                            {task.type === 'text_input' && (
                              <div className="space-y-2">
                                <textarea
                                  rows={3}
                                  className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-sm text-text-primary focus:outline-none focus:border-primary resize-none"
                                  placeholder="Type your answer..."
                                />
                                <button
                                  onClick={(e) => {
                                    const textarea = (e.target as HTMLElement).closest('div')?.querySelector('textarea');
                                    handleTextSubmit(task.id, textarea?.value || '');
                                  }}
                                  disabled={submitting === task.id}
                                  className="w-full h-8 rounded-lg bg-primary text-white text-xs font-medium hover:bg-primary-hover disabled:opacity-50 transition-colors"
                                >
                                  {submitting === task.id ? 'Submitting...' : 'Submit'}
                                </button>
                              </div>
                            )}

                            {task.type === 'multiple_choice' && task.options && (
                              <div className="space-y-1.5">
                                {task.options.map((opt, i) => (
                                  <button
                                    key={i}
                                    onClick={() => handleMCSubmit(task.id, opt.label, opt.correct)}
                                    disabled={submitting === task.id}
                                    className="w-full p-2 rounded-lg bg-surface border border-border text-xs text-text-secondary hover:border-primary/50 hover:text-text-primary text-left transition-all disabled:opacity-50"
                                  >
                                    {opt.label}
                                  </button>
                                ))}
                              </div>
                            )}

                            {task.type === 'true_false' && (
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleTFSubmit(task.id, true, task.correctAnswer === true)}
                                  disabled={submitting === task.id}
                                  className="flex-1 h-8 rounded-lg bg-surface border border-border text-xs text-text-secondary hover:border-primary/50 hover:text-text-primary transition-all"
                                >
                                  True
                                </button>
                                <button
                                  onClick={() => handleTFSubmit(task.id, false, task.correctAnswer === false)}
                                  disabled={submitting === task.id}
                                  className="flex-1 h-8 rounded-lg bg-surface border border-border text-xs text-text-secondary hover:border-primary/50 hover:text-text-primary transition-all"
                                >
                                  False
                                </button>
                              </div>
                            )}

                            {task.type === 'screenshot_upload' && (
                              <div>
                                <label className="flex items-center justify-center gap-2 w-full h-10 rounded-lg bg-surface border border-border cursor-pointer hover:border-primary/50 transition-all">
                                  <Upload size={14} className="text-text-secondary" />
                                  <span className="text-xs text-text-secondary">Upload screenshot</span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) handleScreenshotUpload(task.id, file);
                                    }}
                                  />
                                </label>
                              </div>
                            )}

                            {task.type === 'matching_game' && task.pairs && (
                              <div className="space-y-2">
                                {task.pairs.map((pair, i) => (
                                  <div key={i} className="flex gap-2">
                                    <span className="flex-1 p-2 rounded-lg bg-surface border border-border text-xs text-text-primary text-center">
                                      {pair.left}
                                    </span>
                                    <select
                                      className="flex-1 p-2 rounded-lg bg-surface border border-border text-xs text-text-primary focus:outline-none focus:border-primary"
                                      onChange={(e) => setMatches({ ...matches, [pair.left]: e.target.value })}
                                    >
                                      <option value="">Match...</option>
                                      {task.pairs?.map((p, j) => (
                                        <option key={j} value={p.right}>{p.right}</option>
                                      ))}
                                    </select>
                                  </div>
                                ))}
                                <button
                                  onClick={() => handleMatchingSubmit(task.id)}
                                  disabled={submitting === task.id}
                                  className="w-full h-8 rounded-lg bg-primary text-white text-xs font-medium hover:bg-primary-hover disabled:opacity-50 transition-colors"
                                >
                                  Check Matches
                                </button>
                              </div>
                            )}

                            {task.type === 'checkbox' && (
                              <button
                                onClick={() => handleCheckbox(task.id)}
                                disabled={submitting === task.id}
                                className="flex items-center gap-2 px-3 h-8 rounded-lg bg-surface border border-border text-xs text-text-secondary hover:border-primary/50 transition-all"
                              >
                                <Play size={12} />
                                Mark as done
                              </button>
                            )}
                          </div>
                        )}

                        {feedback?.taskId === task.id && (
                          <div className="mt-2 p-2 rounded-lg bg-primary/5 border border-primary/10">
                            <p className={`text-xs font-medium ${feedback.level === 'completed' || feedback.level === 'mastered' ? 'text-green-400' : 'text-yellow-400'}`}>
                              {feedback.feedback}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {canProceed && (
            <button className="w-full h-10 rounded-xl bg-primary text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-primary-hover transition-colors">
              Next Lesson <ChevronRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
