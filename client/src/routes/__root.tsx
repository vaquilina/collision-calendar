import { createRootRoute, Outlet } from '@tanstack/solid-router';
import { NavMenu } from '../components/nav/NavMenu.tsx';

export const Route = createRootRoute({
  component: () => {
    /* set user agent */
    const b = document.documentElement;
    b.setAttribute('data-user-agent', navigator.userAgent);

    return (
      <div class='screen'>
        <div class='logo-nav'>
          <NavMenu />
        </div>
        <Outlet />
      </div>
    );
  },
});
