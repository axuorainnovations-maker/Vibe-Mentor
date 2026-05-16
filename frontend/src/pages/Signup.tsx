import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { SignUp, useAuth } from '@clerk/clerk-react';
import { GraduationCap } from 'lucide-react';
import { ThemeSwitch } from '../components/ThemeSwitch';
import { clerkAuthAppearanceDark, clerkAuthAppearanceLight } from '../clerkAuthAppearance';

function readAuthPageTheme(): 'dark' | 'light' {
  try {
    const v = localStorage.getItem('auth-theme');
    if (v === 'light' || v === 'dark') return v;
  } catch {
    /* private mode / SSR */
  }
  return 'dark';
}

export default function Signup() {
  const { isSignedIn, isLoaded } = useAuth();
  const [theme, setTheme] = useState<'dark' | 'light'>(readAuthPageTheme);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('auth-theme', next);
  };

  const isDark = theme === 'dark';

  if (!isLoaded) {
    return (
      <div
        className="min-h-dvh flex items-center justify-center"
        style={{ backgroundColor: isDark ? '#000000' : '#ffffff' }}
      >
        <div
          className="h-6 w-6 animate-spin rounded-full border-2 border-t-transparent"
          style={{ borderColor: isDark ? '#fafafa' : '#0a0a0a', borderTopColor: 'transparent' }}
        />
      </div>
    );
  }

  if (isSignedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  const panelBg = { backgroundColor: isDark ? '#000000' : '#ffffff' } as const;

  return (
    <div
      className="animate-fadeIn container relative flex h-dvh w-full flex-col overflow-hidden lg:grid lg:max-w-none lg:grid-cols-2 lg:flex-none lg:overflow-visible lg:px-0"
      style={panelBg}
    >
      <div
        className="flex min-h-0 w-full flex-1 flex-col overflow-hidden p-10 lg:box-border lg:h-full lg:flex-none lg:overflow-visible lg:p-12"
        style={panelBg}
      >
        <header className="flex shrink-0 items-center justify-between">
          <div
            className="flex items-center gap-2 text-lg font-medium"
            style={{ color: isDark ? '#fafafa' : '#000000' }}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-[#FBC627]">
              <GraduationCap size={18} className="text-black" />
            </div>
            Vibe Mentor
          </div>
          <ThemeSwitch theme={theme} onToggle={toggleTheme} />
        </header>

        <div className="flex min-h-0 flex-1 flex-col items-center justify-center pb-8 lg:mx-auto lg:mt-auto lg:mb-auto lg:w-full lg:max-w-[400px] lg:flex-none lg:justify-center lg:pb-0">
          <SignUp
            key={theme}
            routing="path"
            path="/signup"
            signInUrl="/login"
            afterSignUpUrl="/dashboard"
            appearance={isDark ? clerkAuthAppearanceDark : clerkAuthAppearanceLight}
          />
        </div>
      </div>

      <div className="relative hidden h-full min-h-0 w-full flex-col lg:flex">
        <img src="/cleve-bg.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
      </div>
    </div>
  );
}
