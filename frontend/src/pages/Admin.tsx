import { useEffect, useState } from 'react';
import { api } from '../utils/api';
import { Users, BookOpen, Award, TrendingUp, FileText, GraduationCap } from 'lucide-react';

interface Analytics {
  totalStudents: number;
  totalCourses: number;
  totalSubmissions: number;
  totalCertificates: number;
  completedCourses: number;
  inProgressCourses: number;
  recentUsers: { id: string; name: string; email: string; createdAt: string }[];
}

export default function Admin() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/analytics')
      .then(setAnalytics)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F14] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const stats = [
    { label: 'Total Students', value: analytics?.totalStudents || 0, icon: Users },
    { label: 'Total Courses', value: analytics?.totalCourses || 0, icon: BookOpen },
    { label: 'Completed Courses', value: analytics?.completedCourses || 0, icon: Award },
    { label: 'Submissions', value: analytics?.totalSubmissions || 0, icon: FileText },
    { label: 'Certificates Issued', value: analytics?.totalCertificates || 0, icon: GraduationCap },
    { label: 'In Progress', value: analytics?.inProgressCourses || 0, icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-[#0B0F14] p-8">
      <div className="max-w-content mx-auto space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <GraduationCap size={22} className="text-white" />
          </div>
          <span className="text-xl font-semibold text-text-primary">Vibe Mentor Admin</span>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="p-5 rounded-2xl bg-surface border border-border">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                  <stat.icon size={18} className="text-primary" />
                </div>
                <span className="text-sm text-text-secondary">{stat.label}</span>
              </div>
              <p className="text-2xl font-bold text-text-primary">{stat.value}</p>
            </div>
          ))}
        </div>

        <section className="p-6 rounded-2xl bg-surface border border-border">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Recent Users</h2>
          <div className="space-y-3">
            {analytics?.recentUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-3 rounded-xl bg-[#0B0F14]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-xs font-medium text-primary">{user.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">{user.name}</p>
                    <p className="text-xs text-text-secondary">{user.email}</p>
                  </div>
                </div>
                <span className="text-xs text-text-secondary">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
            {(!analytics?.recentUsers || analytics.recentUsers.length === 0) && (
              <p className="text-sm text-text-secondary text-center py-4">No users yet</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
