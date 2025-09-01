import { defineConfig } from 'drizzle-kit';
import { ENV_VAR } from './init/mod.ts';

import type { Config } from 'drizzle-kit';

export default defineConfig({
  casing: 'snake_case',
  dialect: 'turso',
  schema: './schema/*.sql.ts',
  out: './migrations',
  dbCredentials: {
    url: Deno.env.get(ENV_VAR.TURSO_DATABASE_URL)!,
    authToken: Deno.env.get(ENV_VAR.TURSO_AUTH_TOKEN),
  },
}) satisfies Config;
