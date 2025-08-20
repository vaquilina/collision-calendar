import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';

import { ENV_VAR, initEnv } from './init_env.ts';

// Set environment variables if they are not already present
if (!Object.values(ENV_VAR).every((v) => Deno.env.has(v))) initEnv();

/** Turso/libSQL client. */
const client = createClient({
  url: Deno.env.get(ENV_VAR.TURSO_DATABASE_URL)!,
  authToken: Deno.env.get(ENV_VAR.TURSO_AUTH_TOKEN),
});

/** Drizzle driver. */
export const db = drizzle({ client, casing: 'snake_case' });
