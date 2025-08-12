import { createFileRoute } from '@tanstack/solid-router';

export const Route = createFileRoute('/app/about')({
  component: AboutComponent,
});

function AboutComponent() {
  return (
    <>
      <header>
        <h5>About</h5>
      </header>
      <aside>sidebar</aside>
      <main>about content</main>
    </>
  );
}
