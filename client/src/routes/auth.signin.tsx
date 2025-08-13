import { createFileRoute } from '@tanstack/solid-router';

export const Route = createFileRoute('/auth/signin')({
  component: SignInComponent,
});

function SignInComponent() {
  return <div>Hello "/auth/signin"!</div>;
}
