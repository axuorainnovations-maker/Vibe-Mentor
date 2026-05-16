import { Sun, Moon } from 'lucide-react';

interface ThemeSwitchProps {
  theme: 'dark' | 'light';
  onToggle: () => void;
}

export function ThemeSwitch({ theme, onToggle }: ThemeSwitchProps) {
  return (
    <button
      onClick={onToggle}
      className="relative flex h-16 w-16 items-center justify-center transition-opacity hover:opacity-80"
    >
      <Sun
        className={`absolute h-9 w-9 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
          theme === 'light'
            ? 'scale-100 translate-y-0 opacity-100'
            : 'scale-50 translate-y-5 opacity-0'
        }`}
        style={{ color: theme === 'light' ? '#000000' : '#fafafa' }}
      />
      <Moon
        className={`absolute h-9 w-9 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
          theme === 'dark'
            ? 'scale-100 translate-y-0 opacity-100'
            : 'scale-50 translate-y-5 opacity-0'
        }`}
        style={{ color: theme === 'dark' ? '#fafafa' : '#888888' }}
      />
    </button>
  );
}