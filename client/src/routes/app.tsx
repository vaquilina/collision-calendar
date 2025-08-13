import { createFileRoute, Outlet } from '@tanstack/solid-router';

import { NavMenu } from '../components/nav/NavMenu.tsx';
import { ThemeSwitcher } from '../components/ThemeSwitcher.tsx';

export const Route = createFileRoute('/app')({
  component: AppLayoutComponent,
});

function AppLayoutComponent() {
  return (
    <div class='screen'>
      <div class='logo-nav'>
        <NavMenu />
        <ThemeSwitcher />
      </div>
      <Outlet />
    </div>
  );
}
