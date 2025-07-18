import { createFileRoute } from '@tanstack/solid-router';

export const Route = createFileRoute('/settings')({
  component: SettingsComponent,
});

function SettingsComponent() {
  return (
    <>
      <header>
        <h5>Settings</h5>
      </header>
      <aside>sidebar</aside>
      <main>settings content</main>
    </>
  );
}
