import { createRootRoute, Link, Outlet } from '@tanstack/solid-router';
import { TanStackRouterDevtools } from '@tanstack/solid-router-devtools';

export const Route = createRootRoute({
  component: () => (
    <>
      <div>
        <Link to='/'>
          Home
        </Link>{' '}
        <Link to='/about'>
          About
        </Link>
      </div>
      <hr />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
});
