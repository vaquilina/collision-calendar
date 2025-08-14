const DARK = '(prefers-color-scheme: dark)';
const LIGHT = '(prefers-color-scheme: light)';

const prefersDarkColorScheme = () => matchMedia && matchMedia(DARK).matches;
const prefersLightColorScheme = () => matchMedia && matchMedia(LIGHT).matches;

export type Theme = 'light' | 'dark';

/** Detect the system color scheme. */
export function detectColorScheme(): Theme | undefined {
  if (prefersDarkColorScheme()) return 'dark';
  if (prefersLightColorScheme()) return 'light';

  return;
}
