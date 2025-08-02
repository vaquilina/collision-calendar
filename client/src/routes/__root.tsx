import { createRootRoute, Outlet } from '@tanstack/solid-router';

import { NavMenu } from '../components/nav/NavMenu.tsx';
import { ThemeSwitcher } from '../components/ThemeSwitcher.tsx';
import { NotFound } from '../components/feedback/NotFound.tsx';

export const Route = createRootRoute({
  component: () => {
    /* set user agent */
    const b = document.documentElement;
    b.setAttribute('data-user-agent', navigator.userAgent);

    return (
      <div class='screen'>
        <div class='logo-nav'>
          <NavMenu />
          <ThemeSwitcher />
        </div>
        <Outlet />
      </div>
    );
  },
  notFoundComponent: NotFound,
});
