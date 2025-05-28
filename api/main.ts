import * as path from '@std/path';

import { faker } from 'faker';

import { Hono } from 'hono';

import { logger } from 'hono/logger';
import { serveStatic } from 'hono/deno';

import { initDB } from '@collision-calendar/db/init';

import { user } from './routes/user.ts';

// Resolve database path
Deno.chdir(path.dirname(path.fromFileUrl(Deno.mainModule))); // directory of entry point
const db_path = path.resolve('..', 'db', 'collision-calendar.db');

// Set environment variables
Deno.env.set('DB_PATH', db_path);
Deno.env.set('SMTP_PORT', '1025'); // replace

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
