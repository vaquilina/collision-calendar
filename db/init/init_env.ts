import * as path from '@std/path';

/** Enum-like object containing environment variable keys. */
export const ENV_VAR = {
  TURSO_DATABASE_URL: 'TURSO_DATABASE_URL',
  TURSO_AUTH_TOKEN: 'TURSO_AUTH_TOKEN',
  BETTER_AUTH_URL: 'BETTER_AUTH_URL',
  BETTER_AUTH_SECRET: 'BETTER_AUTH_SECRET',
  RESEND_API_KEY: 'RESEND_API_KEY',
} as const;

/**
 * Set environment variables.
 * @remarks
 * Entry point must be `api/main.ts`.
 */
export const initEnv = () => {
  const main_module_dir = path.dirname(path.fromFileUrl(Deno.mainModule));
  Deno.chdir(main_module_dir);

  const db_credentials = Deno.readTextFileSync(path.resolve('..', 'db', 'db.txt'));
  const better_auth_env = Deno.readTextFileSync(path.resolve('..', 'db', 'ba.txt'));
  const resend_api_key = Deno.readTextFileSync(path.resolve('..', 'db', 'rs.txt'));

  const [db_url, auth_token] = db_credentials.split('\n');
  const [ba_url, ba_secret] = better_auth_env.split('\n');

  Deno.env.set(ENV_VAR.TURSO_DATABASE_URL, db_url);
  Deno.env.set(ENV_VAR.TURSO_AUTH_TOKEN, auth_token);
  Deno.env.set(ENV_VAR.BETTER_AUTH_URL, ba_url);
  Deno.env.set(ENV_VAR.BETTER_AUTH_SECRET, ba_secret);
  Deno.env.set(ENV_VAR.RESEND_API_KEY, resend_api_key);
};
