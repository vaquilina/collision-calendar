import { createContext } from 'solid-js';

import type { SetStoreFunction } from 'solid-js/store';
import type { Theme } from '../utils/detect-theme.tsx';

export type ThemeContextValue = [{ theme: Theme }, SetStoreFunction<{ theme: Theme }>];

export const INITIAL_THEME: Theme = 'dark';

const INITIAL_THEME_SETTER: SetStoreFunction<{ theme: Theme }> = () => {};

export const ThemeContext = createContext<ThemeContextValue>([
  { theme: INITIAL_THEME },
  INITIAL_THEME_SETTER,
]);
