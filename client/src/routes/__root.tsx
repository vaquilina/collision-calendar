import { createRootRouteWithContext, Outlet } from '@tanstack/solid-router';
import { TanStackRouterDevtools } from '@tanstack/solid-router-devtools';
import { SolidQueryDevtools } from '@tanstack/solid-query-devtools';

import { ThemeProvider } from '../context/ThemeProvider.tsx';
import { detectColorScheme, type Theme } from '../utils/detect-theme.tsx';

import type { QueryClient } from '@tanstack/solid-query';

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: RootComponent,
  notFoundComponent: () => <div class='centered'>Nothing here.. you should probably be redirected.</div>,
});

function RootComponent() {
  /* set user agent */
  const b = document.documentElement;
  b.setAttribute('data-user-agent', navigator.userAgent);

  /* detect preferred color scheme */
  const preferredTheme: Theme | undefined = detectColorScheme();

  return (
    <>
      <ThemeProvider theme={preferredTheme}>
        <Outlet />
      </ThemeProvider>
      <SolidQueryDevtools buttonPosition='top-right' />
      <TanStackRouterDevtools position='bottom-right' containerElement='div' />
    </>
  );
}
