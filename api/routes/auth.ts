import { Hono } from 'hono';
import { cors } from 'hono/cors';

import { auth } from '../utils/auth.ts';

import type { AuthType } from '../utils/auth.ts';

const router = new Hono<{ Bindings: AuthType }>({
  strict: false,
})
  .use(
    '*',
    cors({
      origin: 'http://localhost:5173',
      allowHeaders: ['Content-Type', 'Authorization'],
      allowMethods: ['POST', 'GET', 'OPTIONS'],
      exposeHeaders: ['Content-Length'],
      maxAge: 600,
      credentials: true,
    }),
  )
  .on(['POST', 'GET'], '/auth/*', (c) => {
    return auth.handler(c.req.raw);
  });

export default router;
