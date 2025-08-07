import { assertEquals } from '@std/assert';

import { ENV_VAR, initEnv } from '@collision-calendar/db/init';

Deno.test('INIT', async (t) => {
  await t.step('environment variables are set', () => {
    initEnv();

    const keys = Object.values(ENV_VAR);

    for (const key of keys) {
      assertEquals(Deno.env.has(key), true, `${key} not set`);
    }
  });
});
