import { faker } from '@faker-js/faker';
import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { serveStatic } from 'hono/deno';

import auth from './routes/auth.ts';

import type { AuthType } from './utils/auth.ts';

const app = new Hono<{ Variables: AuthType }>({ strict: false })
  .use(logger())
  .use('/favicon.ico', serveStatic({ path: './favicon.ico' }))
  .notFound((c) => c.text('resource not found', 404))
  .onError((err, c) => {
    console.error(`${err}`);
    return c.text(`${faker.word.interjection()}! something broke`, 500);
  });

const routes = app.route('/api', auth);

Deno.serve(app.fetch);

export type Api = typeof routes;
