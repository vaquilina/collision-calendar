import { createFileRoute } from '@tanstack/solid-router';

export const Route = createFileRoute('/logout')({
  component: LogoutComponent,
});

function LogoutComponent() {
  return <div>Hello "/logout"!</div>;
}
