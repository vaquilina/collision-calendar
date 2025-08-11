import { Hono } from 'hono';
import { auth } from '../utils/auth.ts';

import type { AuthType } from '../utils/auth.ts';

const router = new Hono<{ Bindings: AuthType }>({
  strict: false,
});

router.on(['POST', 'GET'], '/auth/**', (c) => auth.handler(c.req.raw));

export default router;
