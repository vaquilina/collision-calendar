import { createFileRoute } from '@tanstack/solid-router';

export const Route = createFileRoute('/account')({
  component: AccountComponent,
});

function AccountComponent() {
  return <div>Hello "/account"!</div>;
}
