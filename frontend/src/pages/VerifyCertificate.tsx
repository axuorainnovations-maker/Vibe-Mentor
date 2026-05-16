import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../utils/api';
import { Shield, CheckCircle, GraduationCap } from 'lucide-react';

interface CertData {
  certificateId: string;
  grade: string;
  issueDate: string;
  student: { name: string };
  course: { title: string };
}

export default function VerifyCertificate() {
  const { certId } = useParams();
  const [cert, setCert] = useState<CertData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const certs = await api.get(`/certificates/user/verify`);
        const found = certs.find((c: any) => c.certificateId === certId);
        if (found) setCert(found);
        else setError('Certificate not found');
      } catch {
        setError('Certificate not found');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [certId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F14] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !cert) {
    return (
      <div className="min-h-screen bg-[#0B0F14] flex items-center justify-center px-8">
        <div className="text-center">
          <Shield size={48} className="text-text-secondary mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-text-primary mb-2">Certificate Not Found</h1>
          <p className="text-text-secondary">This certificate could not be verified.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F14] flex items-center justify-center px-8">
      <div className="w-full max-w-lg">
        <div className="flex items-center justify-center gap-3 mb-12">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <GraduationCap size={22} className="text-white" />
          </div>
          <span className="text-xl font-semibold text-text-primary">Vibe Mentor</span>
        </div>

        <div className="p-8 rounded-2xl bg-surface border border-border text-center">
          <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={32} className="text-green-400" />
          </div>

          <h1 className="text-xl font-bold text-text-primary mb-1">Verified Certificate</h1>
          <p className="text-sm text-text-secondary mb-8">This certificate is authentic</p>

          <div className="space-y-4 text-left">
            <div className="flex justify-between items-center p-3 rounded-xl bg-[#0B0F14]">
              <span className="text-sm text-text-secondary">Student</span>
              <span className="text-sm font-medium text-text-primary">{cert.student.name}</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-xl bg-[#0B0F14]">
              <span className="text-sm text-text-secondary">Course</span>
              <span className="text-sm font-medium text-text-primary">{cert.course.title}</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-xl bg-[#0B0F14]">
              <span className="text-sm text-text-secondary">Grade</span>
              <span className="text-sm font-medium text-primary">{cert.grade}</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-xl bg-[#0B0F14]">
              <span className="text-sm text-text-secondary">Issued</span>
              <span className="text-sm font-medium text-text-primary">
                {new Date(cert.issueDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-xl bg-[#0B0F14]">
              <span className="text-sm text-text-secondary">Certificate ID</span>
              <span className="text-sm font-medium text-text-primary font-mono">{cert.certificateId}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
