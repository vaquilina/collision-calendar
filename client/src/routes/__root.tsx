import { createRootRoute, Outlet } from '@tanstack/solid-router';

import { ThemeProvider } from '../context/ThemeProvider.tsx';
import { detectColorScheme, type Theme } from '../utils/detect-theme.tsx';

export const Route = createRootRoute({
  component: () => {
    /* set user agent */
    const b = document.documentElement;
    b.setAttribute('data-user-agent', navigator.userAgent);

    /* detect preferred color scheme */
    const preferredTheme: Theme | undefined = detectColorScheme();

    return (
      <ThemeProvider theme={preferredTheme}>
        <Outlet />
      </ThemeProvider>
    );
  },
  notFoundComponent: () => <div class='centered'>Nothing here.. should probably redirect you</div>,
});
