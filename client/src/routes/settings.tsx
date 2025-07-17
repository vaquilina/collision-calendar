import { createFileRoute } from '@tanstack/solid-router';

export const Route = createFileRoute('/settings')({
  component: SettingsComponent,
});

function SettingsComponent() {
  return <div>Hello "/settings"!</div>;
}
