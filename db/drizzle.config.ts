import { defineConfig } from 'drizzle-kit';

import { ENV_VAR, initEnv } from './init/init_env.ts';

import type { Config } from 'drizzle-kit';

if (!Object.values(ENV_VAR).every((v) => Deno.env.has(v))) initEnv();

export default defineConfig({
  dialect: 'turso',
  schema: './schema/*.sql.ts',
  out: './migrations',
  dbCredentials: {
    url: Deno.env.get(ENV_VAR.TURSO_DATABASE_URL)!,
    authToken: Deno.env.get(ENV_VAR.TURSO_AUTH_TOKEN),
  },
}) satisfies Config;
