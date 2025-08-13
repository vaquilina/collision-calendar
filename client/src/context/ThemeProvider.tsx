import { createStore } from 'solid-js/store';

import { INITIAL_THEME, ThemeContext } from './ThemeContext.tsx';

import type { ParentComponent } from 'solid-js';
import type { ThemeContextValue } from './ThemeContext.tsx';
import type { Theme } from '../utils/detect-theme.tsx';

interface ThemeProviderProps {
  theme?: Theme;
}

export const ThemeProvider: ParentComponent<ThemeProviderProps> = (props) => {
  const [value, setValue] = createStore({ theme: props.theme || INITIAL_THEME });

  const themeContextValue: ThemeContextValue = [
    value,
    setValue,
  ];

  return (
    <ThemeContext.Provider value={themeContextValue}>
      {props.children}
    </ThemeContext.Provider>
  );
};
