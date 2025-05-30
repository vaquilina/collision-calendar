import * as path from '@std/path';

/** Enum-like object containing environment variable keys. */
export const ENV_VAR = {
  DB_PATH: 'DB_PATH',
  KV_PATH: 'KV_PATH',
  SMTP_PORT: 'SMTP_PORT',
} as const;

/** Set environment variables. */
export const initEnv = (): void => {
  // Resolve database path
  Deno.chdir(path.dirname(path.fromFileUrl(Deno.mainModule))); // directory of entry point
  const db_path = path.resolve('..', 'db', 'collision-calendar.db');
  const kv_path = path.resolve('..', 'db', 'kv.db');

  Deno.env.set(ENV_VAR.DB_PATH, db_path);
  Deno.env.set(ENV_VAR.KV_PATH, kv_path);
  Deno.env.set(ENV_VAR.SMTP_PORT, '1025'); // replace
};
