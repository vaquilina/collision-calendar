import { createFileRoute } from '@tanstack/solid-router';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  return (
    <div>
      <h3>Welcome Home!</h3>
    </div>
  );
}
