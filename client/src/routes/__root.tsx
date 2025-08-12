import { createRootRoute, Outlet } from '@tanstack/solid-router';

export const Route = createRootRoute({
  component: () => {
    /* set user agent */
    const b = document.documentElement;
    b.setAttribute('data-user-agent', navigator.userAgent);

    return <Outlet />;
  },
  notFoundComponent: () => <div class='centered'>Nothing here.. should probably redirect you</div>,
});
