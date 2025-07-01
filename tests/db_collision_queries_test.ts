import { DB } from 'sqlite';

import { assertEquals, assertExists, assertGreater, assertObjectMatch } from '@std/assert';

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

/** @see https://stackoverflow.com/a/36255356/13113770 */
const pairwise = (list: number[]): [number, number][] => {
  if (list.length < 2) return [];
  const first = list[0];
  const rest = list.slice(1);
  const pairs: [number, number][] = list.map((i) => [first, i]);
  return pairs.concat(pairwise(rest));
};
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

  const number_of_spaces_to_insert = randomIntegerBetween(10, 20);
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
  }

  const space_entries = db.queryEntries<SpaceEntry>('SELECT * FROM space');
  assertGreater(space_entries.length, 0);

  for (const pair of pairwise(space_entries.map((e) => e.id)).filter(([id1, id2]) => id1 !== id2)) {
    const [spaceid_l, spaceid_r] = pair;

    const mock_collision_data: CollisionData = {
      spaceid_l,
      spaceid_r,
      created_at: Temporal.Now.instant().toString(),
    };

    db.execute(
      `
        INSERT INTO collision (spaceid_l, spaceid_r, created_at)
        VALUES (${spaceid_l},
                ${spaceid_r},
               '${mock_collision_data.created_at}')
      `,
    );
  }

  const collision_entries = db.queryEntries<CollisionEntry>('SELECT * FROM collision');

  await t.step('query: select collision by id', () => {
    const expected_entry = sample(collision_entries);
    assertExists(expected_entry);

    const query = selectCollisionByIdQuery(db);
    const result_entry = query.firstEntry({ id: expected_entry.id });
    query.finalize();

    assertExists(result_entry, 'entry not found');
    assertObjectMatch(result_entry, expected_entry);
  });

  await t.step('query: select collision by space id', () => {
    const spaceid = sample(collision_entries.flatMap((e) => [e.spaceid_l, e.spaceid_r]));
    assertExists(spaceid);
    const expected_entries = collision_entries.filter((e) => e.spaceid_l === spaceid || e.spaceid_r === spaceid);
    assertGreater(expected_entries.length, 0);

    const query = selectCollisionBySpaceIdQuery(db);
    const actual_entries = query.allEntries({ spaceid });
    query.finalize();

    assertExists(actual_entries);
    assertGreater(actual_entries.length, 0);
    assertEquals(actual_entries.toSorted((a, b) => a.id - b.id), expected_entries.toSorted((a, b) => a.id - b.id));
  });

  await t.step('query: select collision by space ids', () => {
    const spaceids = space_entries.map((e) => e.id);
    assertGreater(spaceids.length, 0);

    const spaceid_1 = sample(spaceids);
    assertExists(spaceid_1);
    const spaceid_2 = sample(spaceids.filter((id) => id !== spaceid_1));
    assertExists(spaceid_2);

    const expected_entries = collision_entries.filter((e) =>
      [spaceid_1, spaceid_2].includes(e.spaceid_l) && [spaceid_1, spaceid_2].includes(e.spaceid_r)
    );
    assertGreater(expected_entries.length, 0);

    const query = selectCollisionBySpaceIdsQuery(db);
    const actual_entries = query.allEntries({ spaceid_1, spaceid_2 });
    query.finalize();

    assertExists(actual_entries);
    assertEquals(actual_entries.toSorted((a, b) => a.id - b.id), expected_entries.toSorted((a, b) => a.id - b.id));
  });

  await t.step('query: insert collision', () => {
    const new_space_entries: SpaceEntry[] = [];
    for (let i = 0; i < 2; i++) {
      const mock_space_data: SpaceData = {
        name: faker.commerce.department().replaceAll(`'`, ''),
        calendarid: calendar_entry.id,
        created_at: Temporal.Now.instant().toString(),
      };

      db.execute(
        `
          INSERT INTO space (name, calendarid, created_at)
          VALUES ('${mock_space_data.name}',
                   ${mock_space_data.calendarid},
                  '${mock_space_data.created_at}')
        `,
      );

      const [space_entry] = db.queryEntries<SpaceEntry>(
        `
          SELECT * FROM space
           WHERE name = '${mock_space_data.name}'
             AND calendarid = ${mock_space_data.calendarid}
             AND created_at = '${mock_space_data.created_at}'
        `,
      );

      assertExists(space_entry);
      assertObjectMatch(space_entry, mock_space_data);

      new_space_entries.push(space_entry);
    }

    const [spaceid_l, spaceid_r] = new_space_entries.map((e) => e.id);

    const mock_collision_data: CollisionData = {
      spaceid_l,
      spaceid_r,
      created_at: Temporal.Now.instant().toString(),
    };

    const query = insertCollisionQuery(db);
    query.execute(mock_collision_data);
    query.finalize();

    const [actual_entry] = db.queryEntries<CollisionEntry>(
      `
        SELECT * FROM collision
         WHERE spaceid_l = ${spaceid_l}
           AND spaceid_r = ${spaceid_r}
      `,
    );

    assertExists(actual_entry);
    assertObjectMatch(actual_entry, mock_collision_data);
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
