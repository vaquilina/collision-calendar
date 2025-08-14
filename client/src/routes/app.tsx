import { createFileRoute, Outlet } from '@tanstack/solid-router';

import { SidebarProvider } from '../context/SidebarProvider.tsx';
import { LogoNav } from '../components/nav/LogoNav.tsx';

export const Route = createFileRoute('/app')({
  component: AppLayoutComponent,
});

function AppLayoutComponent() {
  return (
    <div class='screen'>
      <SidebarProvider expanded>
        <LogoNav />
        <Outlet />
      </SidebarProvider>
    </div>
  );
}
