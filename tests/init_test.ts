import { assertArrayIncludes, assertEquals, assertExists } from '@std/assert';

import { exists } from '@std/fs';

import { DB } from 'sqlite';

import { Tables } from '@collision-calendar/db/classes';
import { ENV_VAR, initDB, initEnv } from '@collision-calendar/db/init';

Deno.test('INIT', async (t) => {
  await t.step('environment variables are set', () => {
    initEnv();

    for (const key of Object.values(ENV_VAR)) {
      assertEquals(Deno.env.has(key), true, `${key} not set`);
    }
  });
  await t.step('sqlite db exists at expected path', async () => {
    const db_path = Deno.env.get(ENV_VAR.DB_PATH);
    assertExists(db_path, `${ENV_VAR.DB_PATH} not set`);

    initDB();

    assertEquals(await exists(db_path), true, `no db found at path: ${db_path}`);
  });

  await t.step('db contains expected tables', () => {
    initDB();

    const db = new DB(Deno.env.get(ENV_VAR.DB_PATH), { mode: 'read' });

    const entries = db.queryEntries<{ name: string }>(
      `
        SELECT name
        FROM sqlite_master
        WHERE type = 'table'
      `,
    );

    db.close();

    assertArrayIncludes<string>(entries.map((e) => e.name), Tables);
  });
});
