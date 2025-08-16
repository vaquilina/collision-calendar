import { createSignal } from 'solid-js';
import { createFileRoute, Outlet } from '@tanstack/solid-router';

import { AuthSwitcher, type AuthView } from '../components/auth/AuthSwitcher.tsx';

export const Route = createFileRoute('/auth')({
  component: AuthLayoutComponent,
});

function AuthLayoutComponent() {
  const [selectedView, setSelectedView] = createSignal<AuthView>('sign-in');

  return (
    <div class='auth'>
      <header>
        <h1>
          collision calendar
        </h1>
        <AuthSwitcher selected={selectedView()} setSelected={setSelectedView} />
      </header>
      <main aria-role='tabpanel'>
        <Outlet />
      </main>
      <footer>
        <a href='https://github.com/vaquilina/collision-calendar' title='source code'>
          <h6>source</h6>
        </a>
      </footer>
    </div>
  );
}
