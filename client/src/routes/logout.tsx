import { createFileRoute } from '@tanstack/solid-router';

export const Route = createFileRoute('/logout')({
  component: LogoutComponent,
});

function LogoutComponent() {
  return (
    <>
      <header>
        <h5>Logout</h5>
      </header>
      <aside>sidebar</aside>
      <main>logout content</main>
    </>
  );
}
