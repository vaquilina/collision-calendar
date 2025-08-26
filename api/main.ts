import { faker } from '@faker-js/faker';
import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { serveStatic } from 'hono/deno';

import { auth } from './utils/auth.ts';
import authRoute from './routes/auth.ts';

import type { AuthType } from './utils/auth.ts';

const app = new Hono<{ Variables: AuthType }>({ strict: false })
  .use('*', async (c, next) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });

    if (!session) {
      c.set('user', null);
      c.set('session', null);
      return next();
    }

    c.set('user', session.user);
    c.set('session', session.session);
    return next();
  })
  .use(logger())
  .use('/favicon.ico', serveStatic({ path: './favicon.ico' }))
  .notFound((c) => c.text('resource not found', 404))
  .onError((err, c) => {
    console.error(`${err}`);
    return c.text(`${faker.word.interjection()}! something broke`, 500);
  });

const routes = app.route('/api', authRoute);

Deno.serve(app.fetch);

export type Api = typeof routes;
