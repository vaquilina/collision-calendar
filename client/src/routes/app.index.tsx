import { createFileRoute, Navigate } from '@tanstack/solid-router';
import { Route as CalendarRoute } from './app.calendar.tsx';

export const Route = createFileRoute('/app/')({
  component: Index,
});

function Index() {
  return <Navigate to={CalendarRoute.to} />;
}
