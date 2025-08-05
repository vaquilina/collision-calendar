//import * as path from '@std/path';

/** Enum-like object containing environment variable keys. */
export const ENV_VAR = {
  //DB_PATH: 'DB_PATH',
  SMTP_PORT: 'SMTP_PORT',
  AUTH_PORT: 'AUTH_PORT',
  TURSO_DATABASE_URL: 'TURSO_DATABASE_URL',
  TURSO_AUTH_TOKEN: 'TURSO_AUTH_TOKEN',
} as const;

/** Set environment variables. */
export const initEnv = async (): Promise<void> => {
  // Resolve database path
  //Deno.chdir(path.dirname(path.fromFileUrl(Deno.mainModule))); // directory of entry point
  //const db_path = path.resolve('..', 'db', 'collision-calendar.db');

  const db_credentials = await import('../../db.txt', {
    with: { type: 'text' },
  });

  const [db_url, auth_token] = db_credentials.default.split('\n');

  //Deno.env.set(ENV_VAR.DB_PATH, db_path);
  Deno.env.set(ENV_VAR.SMTP_PORT, '1025'); // replace
  Deno.env.set(ENV_VAR.AUTH_PORT, '3001');
  //Deno.env.set(ENV_VAR.TURSO_DATABASE_URL, 'file:local.db');
  Deno.env.set(ENV_VAR.TURSO_DATABASE_URL, db_url);
  Deno.env.set(ENV_VAR.TURSO_AUTH_TOKEN, auth_token);
};
