import { dark, experimental_createTheme } from '@clerk/themes';

const sharedElements = {
  rootBox: 'w-full',
  card: 'w-full shadow-none',
};

/** Dark auth shell — matches the black login layout. */
export const clerkAuthAppearanceDark = {
  baseTheme: dark,
  elements: sharedElements,
  variables: {
    colorBackground: '#000000',
    colorInputBackground: '#000000',
    colorText: '#fafafa',
    colorTextSecondary: '#888888',
    colorInputText: '#fafafa',
    colorPrimary: '#fafafa',
    borderRadius: '6px',
  },
};

/**
 * Explicit light appearance so the form never follows OS dark mode
 * when the user chose light on this page.
 */
export const clerkAuthAppearanceLight = experimental_createTheme({
  name: 'vibe-mentor-auth-light',
  elements: {
    ...sharedElements,
    card: 'w-full shadow-none bg-white',
    headerTitle: 'text-neutral-900',
    headerSubtitle: 'text-neutral-600',
    formFieldInput: 'bg-white text-neutral-900 border-neutral-200',
    formFieldLabelRow: 'text-neutral-800',
    footer: 'text-neutral-600',
    formButtonPrimary: 'bg-neutral-900 text-white hover:bg-neutral-800',
    identityPreviewText: 'text-neutral-900',
    formFieldSuccessText: 'text-neutral-800',
    formFieldErrorText: 'text-red-600',
    alternativeMethodsBlockButton: 'text-neutral-900 border-neutral-200',
    socialButtonsBlockButton: 'border-neutral-200 text-neutral-900 bg-white',
  },
  variables: {
    colorBackground: '#ffffff',
    colorInputBackground: '#ffffff',
    colorText: '#0a0a0a',
    colorTextSecondary: '#525252',
    colorInputText: '#0a0a0a',
    colorPrimary: '#0a0a0a',
    borderRadius: '6px',
  },
});
