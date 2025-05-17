import { Hono } from 'hono';
import { faker } from '@faker-js/faker';

// Middleware
import { requestId, RequestIdVariables } from 'hono/request-id';
import { logger } from 'hono/logger';

// Routes
import { user } from './api/user.ts';

import { initDB } from './db/init.ts';

// Set environment variables
Deno.env.set('DB_PATH', 'db/collision-calendar.db');

// Initialize DB
initDB();

const app = new Hono<{ Variables: RequestIdVariables }>()
  .use('*', requestId())
  .use(logger())
  .notFound((c) => c.text('resource not found', 404))
  .onError((err, c) => {
    console.error(`${err}`);
    return c.text(`${faker.word.interjection()}! something broke`, 500);
  })
  .route('/', user);

Deno.serve(app.fetch);
