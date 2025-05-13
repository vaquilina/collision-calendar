import { Hono } from '@hono/hono';

import { faker } from '@faker-js/faker';

// Endpoints
import { user } from './api/user.ts';

const app = new Hono()
  /* 404 handler */
  .notFound((c) => c.text(`${faker.word.interjection()}! 404 Page not found`, 404))
  /* Error handler */
  .onError((err, c) => {
    console.error(`${err}`);
    return c.text('An unexpected issue has occurred', 500);
  })
  /* Routes */
  .route('/user', user);

Deno.serve(app.fetch);
