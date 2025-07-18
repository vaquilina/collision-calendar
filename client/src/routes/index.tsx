import { createFileRoute } from '@tanstack/solid-router';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  return (
    <>
      <header>
        <h5>Home</h5>
      </header>
      <aside>sidebar</aside>
      <main>home content</main>
    </>
  );
}
