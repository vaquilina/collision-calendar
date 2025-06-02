import { faker } from '@faker-js/faker';

import { Hono } from 'hono';

import { logger } from 'hono/logger';
import { serveStatic } from 'hono/deno';

import { initDB, initEnv } from '@collision-calendar/db/init';

import { user } from './routes/user.ts';

// Initialize environment variables
initEnv();

// Initialize DB
initDB();

const app = new Hono()
  .use(logger())
  .use('/favicon.ico', serveStatic({ path: './favicon.ico' }))
  .notFound((c) => c.text('resource not found', 404))
  .onError((err, c) => {
    console.error(`${err}`);
    return c.text(`${faker.word.interjection()}! something broke`, 500);
  })
  .route('/api', user);

Deno.serve(app.fetch);
