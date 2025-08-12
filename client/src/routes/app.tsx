import { createFileRoute, Outlet } from '@tanstack/solid-router';

import { NavMenu } from '../components/nav/NavMenu.tsx';
import { ThemeSwitcher } from '../components/ThemeSwitcher.tsx';
import { NotFound } from '../components/feedback/NotFound.tsx';

export const Route = createFileRoute('/app')({
  component: AppLayoutComponent,
  notFoundComponent: NotFound,
});

function AppLayoutComponent() {
  <div class='screen'>
    <div class='logo-nav'>
      <NavMenu />
      <ThemeSwitcher />
    </div>
    <Outlet />
  </div>;
}
