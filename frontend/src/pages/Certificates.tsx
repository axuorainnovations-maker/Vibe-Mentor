import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { api } from '../utils/api';
import { Award, ExternalLink, Download, Shield } from 'lucide-react';

interface Certificate {
  id: string;
  certificateId: string;
  grade: string;
  issueDate: string;
  publicUrl: string;
  course: { title: string; description: string };
}

export default function Certificates() {
  const { user } = useAuthStore();
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/certificates/user/${user?.id}`)
      .then(setCerts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

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
        <h1 className="text-3xl font-bold text-text-primary">Certificates</h1>
        <p className="text-text-secondary mt-1">Your verified credentials and achievements</p>
      </div>

      {certs.length === 0 ? (
        <div className="p-12 rounded-2xl bg-surface border border-border text-center">
          <Award size={40} className="text-primary mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-text-primary mb-2">No certificates yet</h3>
          <p className="text-sm text-text-secondary">Complete a course to earn your first certificate</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {certs.map((cert) => (
            <div key={cert.id} className="p-6 rounded-2xl bg-surface border border-border">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Shield size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-primary font-medium uppercase tracking-wider">Verified</p>
                    <p className="text-xs text-text-secondary mt-0.5">{cert.certificateId}</p>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded-lg text-xs font-medium ${
                  cert.grade === 'Distinction' ? 'bg-purple-500/10 text-purple-400' :
                  cert.grade === 'Merit' ? 'bg-blue-500/10 text-blue-400' :
                  'bg-green-500/10 text-green-400'
                }`}>
                  {cert.grade}
                </span>
              </div>

              <h3 className="text-base font-semibold text-text-primary mb-2">{cert.course.title}</h3>
              {cert.course.description && (
                <p className="text-sm text-text-secondary mb-4">{cert.course.description}</p>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <span className="text-xs text-text-secondary">
                  Issued {new Date(cert.issueDate).toLocaleDateString()}
                </span>
                <div className="flex items-center gap-2">
                  <a
                    href={cert.publicUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 h-8 rounded-lg bg-surface-light border border-border text-xs text-text-secondary hover:text-text-primary transition-colors"
                  >
                    <ExternalLink size={12} />
                    Verify
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
