import type { ReactNode } from 'react';
import { ClerkProvider } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

type Props = {
  publishableKey: string;
  children: ReactNode;
};

/**
 * Clerk path-based SignIn/SignUp must use the same router as React Router,
 * otherwise post-auth navigations desync (redirect loops, /login showing app UI).
 */
export default function ClerkProviderWithRouter({ publishableKey, children }: Props) {
  const navigate = useNavigate();

  return (
    <ClerkProvider
      publishableKey={publishableKey}
      routerPush={(to) => void navigate(to)}
      routerReplace={(to) => void navigate(to, { replace: true })}
      signInUrl="/login"
      signUpUrl="/signup"
    >
      {children}
    </ClerkProvider>
  );
}
