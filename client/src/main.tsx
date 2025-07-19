import { render } from 'solid-js/web';
import { createRouter, RouterProvider } from '@tanstack/solid-router';
import { TanStackRouterDevtools } from '@tanstack/solid-router-devtools';

// Import the generated route tree
import { routeTree } from './routeTree.gen.ts';

// Create a new router instance
const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module '@tanstack/solid-router' {
  interface Register {
    router: typeof router;
  }
}

// Render the app
const rootElement = document.getElementById('root')!;
if (!rootElement.innerHTML) {
  render(() => (
    <>
      <RouterProvider router={router} />
      <TanStackRouterDevtools router={router} position='bottom-right' containerElement='div' />
    </>
  ), rootElement);
}
