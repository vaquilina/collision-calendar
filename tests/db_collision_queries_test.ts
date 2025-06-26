import { DB } from 'sqlite';

import { assertArrayIncludes, assertEquals, assertExists, assertGreater, assertObjectMatch } from '@std/assert';

import { randomIntegerBetween, sample } from '@std/random';

import { faker } from '@faker-js/faker';

import { create_tables_sql } from '@collision-calendar/db/init';

import {
  deleteCollisionByIdQuery,
  deleteCollisionBySpaceIdQuery,
  insertCollisionQuery,
  selectCollisionByIdQuery,
  selectCollisionBySpaceIdQuery,
  selectCollisionBySpaceIdsQuery,
} from '@collision-calendar/db/queries';

type UserData = { name: string; email: string; password: string; created_at: string };
type UserEntry = UserData & { id: number };
type CalendarData = { name: string; owneruserid: number; created_at: string };
type CalendarEntry = CalendarData & { id: number };
type SpaceData = { name: string; calendarid: number; created_at: string };
type SpaceEntry = SpaceData & { id: number };
type CollisionData = { spaceid_l: number; spaceid_r: number; created_at: string };
type CollisionEntry = CollisionData & { id: number };

Deno.test('DB: collision queries', async (t) => {
  const db = new DB();

  db.execute(create_tables_sql);

  const mock_user_data: UserData = {
    name: faker.person.firstName().replaceAll(`'`, ''),
    email: faker.internet.email(),
    password: faker.internet.password(),
    created_at: Temporal.Now.instant().toString(),
  };

  db.execute(
    `
      INSERT INTO user (name, email, password, created_at)
      VALUES ('${mock_user_data.name}',
              '${mock_user_data.email}',
              '${mock_user_data.password}',
              '${mock_user_data.created_at}')
    `,
  );

  const [user_entry] = db.queryEntries<UserEntry>('SELECT * FROM user');
  assertExists(user_entry, 'inserted user not found');
  assertObjectMatch(user_entry, mock_user_data);

  const mock_calendar_data: CalendarData = {
    name: faker.company.name().replaceAll(`'`, ''),
    owneruserid: user_entry.id,
    created_at: Temporal.Now.instant().toString(),
  };

  db.execute(
    `
      INSERT INTO calendar (name, owneruserid, created_at)
      VALUES ('${mock_calendar_data.name}',
               ${mock_calendar_data.owneruserid},
              '${mock_calendar_data.created_at}')
    `,
  );

  const [calendar_entry] = db.queryEntries<CalendarEntry>('SELECT * FROM calendar');
  assertExists(calendar_entry, 'inserted calendar not found');
  assertObjectMatch(calendar_entry, mock_calendar_data);

  const number_of_spaces_to_insert = randomIntegerBetween(5, 10);
  const space_entries: SpaceEntry[] = [];
  for (let i = 0; i < number_of_spaces_to_insert; i++) {
    const mock_space_data: SpaceData = {
      name: faker.commerce.department().replaceAll(`'`, ''),
      calendarid: calendar_entry.id,
      created_at: Temporal.Now.instant().toString(),
    };

    const { name, calendarid, created_at } = mock_space_data;

    db.execute(
      `
        INSERT INTO space (name, calendarid, created_at)
        VALUES ('${name}', ${calendarid}, '${created_at}')
      `,
    );

    const [space_entry] = db.queryEntries<SpaceEntry>(
      `
        SELECT * FROM space
         WHERE name = '${name}'
           AND calendarid = ${calendarid}
           AND created_at = '${created_at}'
      `,
    );
    assertExists(space_entry);
    assertObjectMatch(space_entry, mock_space_data);

    space_entries[i] = space_entry;
  }

  const getUniqSpaceId = (spaceid: number) => {
    const ids = space_entries.map((e) => e.id);
    let new_space_id: number;
    do {
      new_space_id = sample(ids)!;
    } while (new_space_id === spaceid);
    return new_space_id;
  };

  const number_of_collisions_to_insert = randomIntegerBetween(3, 6);
  const collision_entries = [];
  for (let i = 0; i < number_of_collisions_to_insert; i++) {
    const first_space_id = space_entries[randomIntegerBetween(0, number_of_spaces_to_insert - 1)].id;
    const mock_collision_data: CollisionData = {
      spaceid_l: first_space_id,
      spaceid_r: getUniqSpaceId(first_space_id),
      created_at: Temporal.Now.instant().toString(),
    };

    const { spaceid_l, spaceid_r, created_at } = mock_collision_data;

    db.execute(
      `
        INSERT INTO collision (spaceid_l, spaceid_r, created_at)
        VALUES (${spaceid_l}, ${spaceid_r}, '${created_at}')
      `,
    );

    const [collision_entry] = db.queryEntries<CollisionEntry>(
      `
        SELECT * FROM collision
         WHERE spaceid_l = ${spaceid_l}
           AND spaceid_r = ${spaceid_r}
           AND created_at = '${created_at}'
      `,
    );
    assertExists(collision_entry, 'inserted collision not found');
    assertObjectMatch(collision_entry, mock_collision_data);

    collision_entries[i] = collision_entry;
  }

  await t.step('query: select collision by id', () => {
    const entries = db.queryEntries<CollisionEntry>('SELECT * FROM collision');
    assertExists(entries);
    assertGreater(entries.length, 0);

    const expected_entry = entries[randomIntegerBetween(0, entries.length - 1)];
    assertExists(expected_entry);

    const query = selectCollisionByIdQuery(db);
    const result_entry = query.firstEntry({ id: expected_entry.id });
    query.finalize();

    assertExists(result_entry, 'entry not found');
    assertObjectMatch(result_entry, expected_entry);
  });

  await t.step('query: select collision by space id', () => {
    const entries = db.queryEntries<CollisionEntry>('SELECT * FROM collision');
    assertExists(entries);

    const space_id_to_query = sample(space_entries.map((e) => e.id))!;

    const filtered_entries = entries.filter((e) =>
      e.spaceid_l === space_id_to_query || e.spaceid_r === space_id_to_query
    );

    const query = selectCollisionBySpaceIdQuery(db);
    const result_entries = query.allEntries({ spaceid: space_id_to_query });
    query.finalize();

    assertExists(result_entries);
    assertEquals(result_entries.length, filtered_entries.length);

    for (const result_entry of result_entries) {
      const expected_entry = filtered_entries.find((e) => e.id === result_entry.id);
      assertExists(expected_entry);
      assertObjectMatch(result_entry, expected_entry);
    }
  });

  await t.step('query: select collision by space ids', () => {
    const entries = db.queryEntries<CollisionEntry>('SELECT * FROM collision');
    assertExists(entries);
    assertGreater(entries.length, 0);

    const target_entry = entries[randomIntegerBetween(0, number_of_collisions_to_insert - 1)];
    const { spaceid_l: spaceid_1, spaceid_r: spaceid_2 } = target_entry;

    const spaceids: [number, number] = [spaceid_1, spaceid_2];

    const filtered_entries = entries.filter((e) => spaceids.includes(e.spaceid_l) && spaceids.includes(e.spaceid_r));
    assertGreater(filtered_entries.length, 0);

    const query = selectCollisionBySpaceIdsQuery(db);
    const result_entries = query.allEntries({ spaceid_1, spaceid_2 });
    query.finalize();

    assertExists(result_entries);
    assertGreater(result_entries.length, 0);
    assertArrayIncludes(result_entries, filtered_entries);
  });

  await t.step('query: insert collision', () => {
    const first_space_id = space_entries[randomIntegerBetween(0, number_of_spaces_to_insert - 1)].id;
    const mock_collision_data: CollisionData = {
      spaceid_l: first_space_id,
      spaceid_r: getUniqSpaceId(first_space_id),
      created_at: Temporal.Now.instant().toString(),
    };

    const entries = db.queryEntries<CollisionEntry>('SELECT * FROM collision');
    assertExists(entries);
    assertGreater(entries.length, 0);

    const { spaceid_l, spaceid_r, created_at } = mock_collision_data;

    const query = insertCollisionQuery(db);
    query.execute({ spaceid_l, spaceid_r, created_at });
    query.finalize();

    const new_entries = db.queryEntries<CollisionEntry>('SELECT * FROM collision');
    assertExists(new_entries);
    assertGreater(new_entries.length, entries.length);

    const [inserted_entry] = db.queryEntries<CollisionEntry>(
      `
        SELECT * FROM collision
         WHERE spaceid_l = ${spaceid_l}
           AND spaceid_r = ${spaceid_r}
           AND created_at = '${created_at}'
      `,
    );
    assertExists(inserted_entry);
    assertObjectMatch(inserted_entry, mock_collision_data);
  });

  await t.step('query: delete collision by id', () => {
    const [collision_entry] = db.queryEntries<CollisionEntry>('SELECT * FROM collision');
    assertExists(collision_entry);

    const query = deleteCollisionByIdQuery(db);
    query.execute({ id: collision_entry.id });
    query.finalize();

    const [deleted_entry] = db.queryEntries<CollisionEntry>(`SELECT * FROM collision WHERE id = ${collision_entry.id}`);
    assertEquals(deleted_entry, undefined);
  });

  await t.step('query: delete collision by space id', () => {
    const entries = db.queryEntries<CollisionEntry>('SELECT * FROM collision');
    assertExists(entries);
    assertGreater(entries.length, 0);

    const spaceids = [...new Set(entries.flatMap(({ spaceid_l, spaceid_r }) => [spaceid_l, spaceid_r]))];
    const space_id_to_delete = spaceids[randomIntegerBetween(0, spaceids.length - 1)];

    const query = deleteCollisionBySpaceIdQuery(db);
    query.execute({ spaceid: space_id_to_delete });
    query.finalize();

    const deleted_entries = db.queryEntries<CollisionEntry>(
      `
        SELECT * FROM collision
         WHERE spaceid_l = ${space_id_to_delete}
            OR spaceid_r = ${space_id_to_delete}
      `,
    );
    assertEquals(deleted_entries.length, 0);
  });

  db.execute(
    `
      DELETE FROM collision;
      DELETE FROM space;
      DELETE FROM calendar;
      DELETE FROM user;
    `,
  );
  const deleted_collision_entries = db.queryEntries<CollisionEntry>('SELECT * FROM collision');
  assertEquals(deleted_collision_entries.length, 0);
  const deleted_space_entries = db.queryEntries<SpaceEntry>('SELECT * FROM space');
  assertEquals(deleted_space_entries.length, 0);
  const deleted_calendar_entries = db.queryEntries<CalendarEntry>('SELECT * FROM calendar');
  assertEquals(deleted_calendar_entries.length, 0);
  const deleted_user_entries = db.queryEntries<UserEntry>('SELECT * FROM user');
  assertEquals(deleted_user_entries.length, 0);

  db.close();
});
