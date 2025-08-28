import { createRootRouteWithContext, Outlet } from '@tanstack/solid-router';
import { TanStackRouterDevtools } from '@tanstack/solid-router-devtools';
import { SolidQueryDevtools } from '@tanstack/solid-query-devtools';
import { Toaster } from 'solid-toast';

import { ThemeProvider } from '../context/ThemeProvider.tsx';
import { detectColorScheme, type Theme } from '../utils/detect-theme.tsx';

import type { QueryClient } from '@tanstack/solid-query';
import type { JSX } from 'solid-js';

const toastStyle: JSX.CSSProperties = {
  background: 'light-dark(var(--theme-color-04), var(--theme-color-20))',
  color: 'light-dark(var(--theme-color-25), var(--theme-color-01))',
  'font-size': '0.8rem',
  'border-radius': 'var(--theme-border-radius)',
  'border': '1px solid light-dark(var(--theme-color-20), var(--theme-color-10))',
  'box-shadow': '1.5px 2px 0 0 light-dark(var(--theme-color-20), var(--theme-color-10))',
};

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
        <Toaster
          position='bottom-left'
          gutter={8}
          toastOptions={{
            style: toastStyle,
          }}
        />
      </ThemeProvider>
      <SolidQueryDevtools buttonPosition='top-right' />
      <TanStackRouterDevtools position='bottom-right' containerElement='div' />
    </>
  );
}
