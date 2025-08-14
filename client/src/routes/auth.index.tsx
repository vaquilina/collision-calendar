import { Navigate } from '@tanstack/solid-router';
import { createFileRoute } from '@tanstack/solid-router';

import { Route as SignInRoute } from './auth.signin.tsx';

export const Route = createFileRoute('/auth/')({
  component: AuthIndexRoute,
});

function AuthIndexRoute() {
  return <Navigate to={SignInRoute.to} />;
}
