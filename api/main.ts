import { Hono } from 'hono';
import { faker } from 'faker';

import { logger } from 'hono/logger';
import { serveStatic } from 'hono/deno';

import { user } from './routes/user.ts';

import { initDB } from '@collision-calendar/db/init';

// Set environment variables
Deno.env.set('DB_PATH', 'db/collision-calendar.db');

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
