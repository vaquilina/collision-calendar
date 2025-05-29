import { assertEquals } from '@std/assert';

import { ENV_VAR, initEnv } from '@collision-calendar/db/init';

Deno.test('environment variables', () => {
  initEnv();

  for (const key of Object.values(ENV_VAR)) {
    assertEquals(Deno.env.has(key), true, `${key} not set`);
  }
});

//Deno.test('database exists', () => { });
//Deno.test('KV exists', () => { });
