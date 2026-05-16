import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { User, Save } from 'lucide-react';

export default function Settings() {
  const { user, updateProfile } = useAuthStore();
  const [name, setName] = useState(user?.name || '');
  const [learningGoals, setLearningGoals] = useState(user?.learningGoals || '');
  const [interests, setInterests] = useState(user?.interests || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile({ name, learningGoals, interests });
    } catch (err) {
      console.error('Failed to save:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold text-text-primary">Settings</h1>
        <p className="text-text-secondary mt-1">Manage your profile and preferences</p>
      </div>

      <section className="p-6 rounded-2xl bg-surface border border-border space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-border">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
            <User size={28} className="text-primary" />
          </div>
          <div>
            <p className="text-lg font-semibold text-text-primary">{user?.name}</p>
            <p className="text-sm text-text-secondary">{user?.email}</p>
            <p className="text-xs text-text-secondary mt-1">Age Group: {user?.ageGroup}</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">Display Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full h-11 px-4 rounded-xl bg-[#0B0F14] border border-border text-text-primary text-sm focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">Learning Goals</label>
          <textarea
            value={learningGoals}
            onChange={(e) => setLearningGoals(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 rounded-xl bg-[#0B0F14] border border-border text-text-primary text-sm focus:outline-none focus:border-primary resize-none transition-colors"
            placeholder="What do you want to learn?"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">Interests</label>
          <textarea
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 rounded-xl bg-[#0B0F14] border border-border text-text-primary text-sm focus:outline-none focus:border-primary resize-none transition-colors"
            placeholder="What are you interested in?"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 h-11 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-hover disabled:opacity-50 transition-colors"
        >
          <Save size={16} />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </section>
    </div>
  );
}
