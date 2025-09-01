import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';

import { ENV_VAR } from './init_env.ts';

/** Turso/libSQL client. */
const client = createClient({
  url: Deno.env.get(ENV_VAR.TURSO_DATABASE_URL)!,
  authToken: Deno.env.get(ENV_VAR.TURSO_AUTH_TOKEN),
});

/** Drizzle driver. */
export const db = drizzle({ client, casing: 'snake_case' });
