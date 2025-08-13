import { createFileRoute } from '@tanstack/solid-router';

export const Route = createFileRoute('/auth/signup')({
  component: SignUpComponent,
});

function SignUpComponent() {
  return <div>Hello "/auth/signup"!</div>;
}
