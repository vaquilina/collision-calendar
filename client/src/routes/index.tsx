import { createFileRoute } from '@tanstack/solid-router';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  return <div>Welcome to Home</div>;
}
