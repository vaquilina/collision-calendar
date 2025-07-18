import { createFileRoute } from '@tanstack/solid-router';

export const Route = createFileRoute('/account')({
  component: AccountComponent,
});

function AccountComponent() {
  return (
    <>
      <header>
        <h5>Account</h5>
      </header>
      <aside>sidebar</aside>
      <main>account content</main>
    </>
  );
}
