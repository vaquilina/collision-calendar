import { createFileRoute } from '@tanstack/solid-router';

export const Route = createFileRoute('/calendar')({
  component: CalendarComponent,
});

function CalendarComponent() {
  return <div>Hello "/calendar"!</div>;
}
