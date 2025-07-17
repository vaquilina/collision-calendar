import { createFileRoute } from '@tanstack/solid-router';

export const Route = createFileRoute('/about')({
  component: AboutComponent,
});

function AboutComponent() {
  return <div>Hello from About!</div>;
}
