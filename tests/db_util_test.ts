import { assertInstanceOf, assertObjectMatch } from '@std/assert';

import { processEntry } from '@collision-calendar/db/util';

Deno.test('DB: util', async (t) => {
  await t.step('util: process entry converts created_at field to Instant', (t) => {
    const unprocessed_entry = { created_at: Temporal.Now.instant().toString() };
    const expected_entry = { created_at: Temporal.Instant.from(unprocessed_entry.created_at) };

    const processed_entry = processEntry(unprocessed_entry);

    assertObjectMatch(processed_entry, expected_entry);
    assertInstanceOf(processed_entry.created_at, Temporal.Instant);
  });
});
