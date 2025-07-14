import { createFileRoute } from '@tanstack/solid-router';

export const Route = createFileRoute('/calendar')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/calendar"!</div>;
}
