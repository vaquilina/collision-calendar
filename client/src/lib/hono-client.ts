import { hc } from 'hono/client';

import type { Api } from '@collision-calendar/api';

export const honoClient = hc<Api>('http://localhost:8000/');
