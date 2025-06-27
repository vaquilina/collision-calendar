import { DB } from 'sqlite';

import { assertEquals, assertExists, assertGreater, assertNotEquals, assertObjectMatch } from '@std/assert';

import { randomIntegerBetween, sample } from '@std/random';

import { faker } from '@faker-js/faker';

import { create_tables_sql } from '@collision-calendar/db/init';

import {
  deleteOccupantByIdQuery,
  deleteOccupantBySpaceIdQuery,
  deleteOccupantByUserAndSpaceQuery,
  deleteOccupantByUserIdQuery,
  insertOccupantQuery,
  selectOccupantByIdQuery,
  selectOccupantBySpaceIdQuery,
  selectOccupantByUserAndSpaceQuery,
  selectOccupantByUserIdQuery,
} from '@collision-calendar/db/queries';

type UserData = { name: string; email: string; password: string; created_at: string };
type UserEntry = UserData & { id: number };
type CalendarData = { name: string; owneruserid: number; created_at: string };
type CalendarEntry = CalendarData & { id: number };
type SpaceData = { name: string; calendarid: number; created_at: string };
type SpaceEntry = SpaceData & { id: number };
type OccupantData = { userid: number; spaceid: number; created_at: string };
type OccupantEntry = OccupantData & { id: number };

Deno.test('DB: occupant queries', async (t) => {
  const db = new DB();

  db.execute(create_tables_sql);

  const number_of_users_to_insert = randomIntegerBetween(10, 20);
  for (let i = 0; i < number_of_users_to_insert; i++) {
    const mock_user_data: UserData = {
      name: faker.person.firstName().replaceAll(`'`, ''),
      email: faker.internet.email(),
      password: faker.internet.password(),
      created_at: Temporal.Now.instant().toString(),
    };

    const { name, email, password, created_at } = mock_user_data;

    db.execute(
      `
        INSERT INTO user (name, email, password, created_at)
        VALUES ('${name}',
                '${email}',
                '${password}',
                '${created_at}')
      `,
    );
  }

  const user_entries = db.queryEntries<UserEntry>('SELECT * FROM user');
  assertExists(user_entries);
  assertEquals(user_entries.length, number_of_users_to_insert);

  const mock_calendar_data: CalendarData = {
    name: faker.company.name().replaceAll(`'`, ''),
    owneruserid: user_entries[randomIntegerBetween(0, user_entries.length - 1)].id,
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
  assertExists(calendar_entry);
  assertObjectMatch(calendar_entry, mock_calendar_data);

  const number_of_spaces_to_insert = randomIntegerBetween(4, 8);
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
        VALUES ('${name}',
                 ${calendarid},
                '${created_at}')
      `,
    );
  }

  const space_entries = db.queryEntries<SpaceEntry>('SELECT * FROM space');
  assertGreater(space_entries.length, 0);

  for (const user_entry of user_entries) {
    const mock_occupant_data: OccupantData = {
      userid: user_entry.id,
      spaceid: sample(space_entries.map((e) => e.id))!,
      created_at: Temporal.Now.instant().toString(),
    };

    const { userid, spaceid, created_at } = mock_occupant_data;

    db.execute(
      `
        INSERT INTO occupant (userid, spaceid, created_at)
        VALUES (${userid},
                ${spaceid},
               '${created_at}')
      `,
    );
  }

  const occupant_entries = db.queryEntries<OccupantEntry>('SELECT * FROM occupant');
  assertGreater(occupant_entries.length, 0);
  assertEquals(occupant_entries.length, user_entries.length);

  await t.step('query: select occupant by id', () => {
    const occupant_id_to_select = sample(occupant_entries.map((e) => e.id));
    assertExists(occupant_id_to_select);

    const expected_entry = occupant_entries.find((e) => e.id === occupant_id_to_select);
    assertExists(expected_entry);

    const query = selectOccupantByIdQuery(db);
    const actual_entry = query.firstEntry({ id: occupant_id_to_select });
    query.finalize();

    assertExists(actual_entry);
    assertObjectMatch(actual_entry, expected_entry);
    assertEquals(actual_entry, expected_entry);
  });
  await t.step('query: select occupant by space id', () => {
    const space_id_to_select = sample(occupant_entries.map((e) => e.spaceid));
    assertExists(space_id_to_select);

    const expected_entries = occupant_entries.filter((e) => e.spaceid === space_id_to_select);

    const query = selectOccupantBySpaceIdQuery(db);
    const actual_entries = query.allEntries({ spaceid: space_id_to_select });
    query.finalize();

    assertGreater(actual_entries.length, 0);
    assertEquals(actual_entries.length, expected_entries.length);

    for (const actual_entry of actual_entries) {
      const expected_entry = expected_entries.find((e) => e.id === actual_entry.id);
      assertExists(expected_entry);
      assertObjectMatch(actual_entry, expected_entry);
    }
  });
  await t.step('query: select occupant by user id', () => {
    const user_id_to_select = sample(occupant_entries.map((e) => e.userid));
    assertExists(user_id_to_select);

    const expected_entries = occupant_entries.filter((e) => e.userid === user_id_to_select);

    const query = selectOccupantByUserIdQuery(db);
    const actual_entries = query.allEntries({ userid: user_id_to_select });
    query.finalize();

    assertGreater(actual_entries.length, 0);
    assertEquals(actual_entries.length, expected_entries.length);

    for (const actual_entry of actual_entries) {
      const expected_entry = expected_entries.find((e) => e.id === actual_entry.id);
      assertExists(expected_entry);
      assertObjectMatch(actual_entry, expected_entry);
    }
  });
  await t.step('query: select occupant by user and space', () => {
    const { userid, spaceid } = sample(occupant_entries)!;

    const expected_entries = occupant_entries.filter((e) => e.userid === userid && e.spaceid === spaceid);
    assertGreater(expected_entries.length, 0);

    const query = selectOccupantByUserAndSpaceQuery(db);
    const actual_entries = query.allEntries({ userid, spaceid });
    query.finalize();

    assertGreater(actual_entries.length, 0);
    assertEquals(actual_entries.length, expected_entries.length);

    for (const actual_entry of actual_entries) {
      const expected_entry = expected_entries.find((e) => e.id === actual_entry.id);
      assertExists(expected_entry);
      assertObjectMatch(actual_entry, expected_entry);
    }
  });
  await t.step('query: insert occupant', () => {
    const mock_occupant_data: OccupantData = {
      userid: sample(user_entries.map((e) => e.id))!,
      spaceid: sample(space_entries.map((e) => e.id))!,
      created_at: Temporal.Now.instant().toString(),
    };

    const { userid, spaceid, created_at } = mock_occupant_data;

    const query = insertOccupantQuery(db);
    query.execute({ userid, spaceid, created_at });
    query.finalize();

    const [result_entry] = db.queryEntries<OccupantEntry>(
      `
        SELECT * FROM occupant
         WHERE userid = ${userid}
           AND spaceid = ${spaceid}
           AND created_at = '${created_at}'
      `,
    );
    assertExists(result_entry);
    assertObjectMatch(result_entry, mock_occupant_data);
  });
  await t.step('query: delete occupant by id', () => {
    const entries = db.queryEntries<OccupantEntry>('SELECT * FROM occupant');
    assertGreater(entries.length, 0);

    const id_to_delete = sample(entries.map((e) => e.id));
    assertExists(id_to_delete);

    const query = deleteOccupantByIdQuery(db);
    query.execute({ id: id_to_delete });
    query.finalize();

    const result_entries = db.queryEntries<OccupantEntry>('SELECT * FROM occupant');
    assertGreater(result_entries.length, 0);
    assertNotEquals(result_entries.length, entries.length);

    const deleted_entry = result_entries.find((e) => e.id === id_to_delete);
    assertEquals(deleted_entry, undefined);
  });
  await t.step('query: delete occupant by space id', () => {
    const entries = db.queryEntries<OccupantEntry>('SELECT * FROM occupant');
    assertGreater(entries.length, 0);

    const space_id_to_select = sample(entries.map((e) => e.spaceid));
    assertExists(space_id_to_select);

    const expected_entries = entries.filter((e) => e.spaceid === space_id_to_select);
    assertGreater(expected_entries.length, 0);

    const query = deleteOccupantBySpaceIdQuery(db);
    query.execute({ spaceid: space_id_to_select });
    query.finalize();

    const actual_entries = db.queryEntries<OccupantEntry>(
      `SELECT * FROM occupant WHERE spaceid = ${space_id_to_select}`,
    );
    assertEquals(actual_entries.length, 0);
  });
  await t.step('query: delete occupant by user id', () => {
    const entries = db.queryEntries<OccupantEntry>('SELECT * FROM occupant');
    assertGreater(entries.length, 0);

    const user_id_to_select = sample(entries.map((e) => e.userid));
    assertExists(user_id_to_select);

    const expected_entries = entries.filter((e) => e.userid === user_id_to_select);
    assertGreater(expected_entries.length, 0);

    const query = deleteOccupantByUserIdQuery(db);
    query.execute({ userid: user_id_to_select });
    query.finalize();

    const actual_entries = db.queryEntries<OccupantEntry>(
      `SELECT * FROM occupant WHERE userid = ${user_id_to_select}`,
    );
    assertEquals(actual_entries.length, 0);
  });
  await t.step('query: delete occupant by user and space', () => {
    const entries = db.queryEntries<OccupantEntry>('SELECT * FROM occupant');
    assertGreater(entries.length, 0);

    const { userid, spaceid } = sample(entries)!;

    const expected_entries = entries.filter((e) => e.userid === userid && e.spaceid === spaceid);
    assertGreater(expected_entries.length, 0);

    const query = deleteOccupantByUserAndSpaceQuery(db);
    query.execute({ userid, spaceid });
    query.finalize();

    const actual_entries = db.queryEntries<OccupantEntry>(
      `SELECT * FROM occupant WHERE userid = ${userid} AND spaceid = ${spaceid}`,
    );
    assertEquals(actual_entries.length, 0);
  });

  db.execute(
    `
      DELETE FROM occupant;
      DELETE FROM space;
      DELETE FROM calendar;
      DELETE FROM user;
    `,
  );

  db.close();
});
