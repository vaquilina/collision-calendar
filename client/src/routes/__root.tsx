import { createRootRoute, Outlet } from '@tanstack/solid-router';
import { NavMenu } from '../components/NavMenu.tsx';

export const Route = createRootRoute({
  component: () => {
    const b = document.documentElement;
    b.setAttribute('data-user-agent', navigator.userAgent);

    return (
      <>
        <header>
          <NavMenu />
        </header>
        <main>
          <Outlet />
        </main>
        <footer>
          <small>footer</small>
        </footer>
      </>
    );
  },
});
