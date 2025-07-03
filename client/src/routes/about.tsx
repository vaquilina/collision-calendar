import { createFileRoute } from '@tanstack/solid-router';

export const Route = createFileRoute('/about')({
  component: About,
});

function About() {
  return <div>Hello from About!</div>;
}
