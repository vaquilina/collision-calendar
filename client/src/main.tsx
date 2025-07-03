import { initEnv } from '@collision-calendar/db/init';
import { render } from 'solid-js/web';
import { createRouter, RouterProvider } from '@tanstack/solid-router';

// Import the generated route tree
import { routeTree } from './routeTree.gen.ts';

initEnv();

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
  render(() => <RouterProvider router={router} />, rootElement);
}
