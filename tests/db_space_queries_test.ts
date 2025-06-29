import { DB } from 'sqlite';

import { assertEquals, assertExists, assertGreater, assertNotEquals, assertObjectMatch } from '@std/assert';

import { randomIntegerBetween, sample } from '@std/random';

import { faker } from '@faker-js/faker';

import { create_tables_sql } from '@collision-calendar/db/init';

import {
  deleteSpaceByIdQuery,
  insertSpaceQuery,
  selectSpaceByCalendarIdQuery,
  selectSpaceByIdQuery,
  updateSpaceNameQuery,
} from '@collision-calendar/db/queries';

type UserData = { name: string; email: string; password: string; created_at: string };
type UserEntry = UserData & { id: number };
type CalendarData = { name: string; owneruserid: number; created_at: string };
type CalendarEntry = CalendarData & { id: number };
type SpaceData = { name: string; calendarid: number; created_at: string };
type SpaceEntry = SpaceData & { id: number };

Deno.test('DB: space queries', async (t) => {
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
  assertExists(user_entry);
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
  assertExists(calendar_entry);
  assertObjectMatch(calendar_entry, mock_calendar_data);

  const number_of_spaces_to_insert = randomIntegerBetween(4, 8);
  assertExists(number_of_spaces_to_insert);

  for (let i = 0; i < number_of_spaces_to_insert; i++) {
    const mock_space_data: SpaceData = {
      name: faker.commerce.department().replaceAll(`,`, ''),
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
  }

  const space_entries = db.queryEntries<SpaceEntry>('SELECT * FROM space');
  assertExists(space_entries);
  assertEquals(space_entries.length, number_of_spaces_to_insert);

  await t.step('query: select space by id', () => {
    const expected_entry = sample(space_entries);
    assertExists(expected_entry);

    const query = selectSpaceByIdQuery(db);
    const actual_entry = query.firstEntry({ id: expected_entry.id });
    query.finalize();

    assertExists(actual_entry);
    assertObjectMatch(actual_entry, expected_entry);
  });

  await t.step('query: select space by calendar id', () => {
    const calendarid = calendar_entry.id;
    const expected_entries = space_entries.filter((e) => e.calendarid === calendarid);

    const query = selectSpaceByCalendarIdQuery(db);
    const actual_entries = query.allEntries({ calendarid });
    query.finalize();

    assertEquals(actual_entries.length, expected_entries.length);
    assertEquals(actual_entries.map((e) => e.calendarid), expected_entries.map((e) => e.calendarid));
  });

  await t.step('query: update space name', () => {
    const entry_to_update = sample(space_entries);
    assertExists(entry_to_update);

    let new_name: string;
    do {
      new_name = faker.commerce.department().replaceAll(`'`, '');
    } while (new_name === entry_to_update.name);
    assertExists(new_name);

    const query = updateSpaceNameQuery(db);
    query.execute({ id: entry_to_update.id, name: new_name });
    query.finalize();

    const [actual_entry] = db.queryEntries<SpaceEntry>(`SELECT * FROM space WHERE id = ${entry_to_update.id}`);
    assertExists(actual_entry);
    assertNotEquals(actual_entry.name, entry_to_update.name);
    assertEquals(actual_entry.name, new_name);
  });

  await t.step('query: insert space', () => {
    const mock_space_data: SpaceData = {
      name: faker.commerce.department().replaceAll(`'`, ''),
      calendarid: calendar_entry.id,
      created_at: Temporal.Now.instant().toString(),
    };

    const query = insertSpaceQuery(db);
    query.execute(mock_space_data);
    query.finalize();

    const [actual_entry] = db.queryEntries<SpaceEntry>(
      `
        SELECT * FROM space
         WHERE name = '${mock_space_data.name}'
           AND calendarid = ${mock_space_data.calendarid}
           AND created_at = '${mock_space_data.created_at}'
      `,
    );
    assertExists(actual_entry);
    assertObjectMatch(actual_entry, mock_space_data);
  });

  await t.step('query: delete space by id', () => {
    const entries = db.queryEntries<SpaceEntry>('SELECT * FROM space');
    assertGreater(entries.length, 0);

    const id = sample(entries.map((e) => e.id));
    assertExists(id);

    const query = deleteSpaceByIdQuery(db);
    query.execute({ id });
    query.finalize();

    const [deleted_entry] = db.queryEntries(`SELECT * FROM space WHERE id = ${id}`);
    assertEquals(deleted_entry, undefined);
  });

  db.execute(
    `
      DELETE FROM space;
      DELETE FROM calendar;
      DELETE FROM user;
    `,
  );

  db.close();
});
