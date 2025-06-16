import { assertEquals, assertExists, assertObjectMatch } from '@std/assert';

import { DB } from 'sqlite';

import { faker } from '@faker-js/faker';

import { create_tables_sql } from '@collision-calendar/db/init';

import {
  deleteCalendarByIdQuery,
  insertCalendarQuery,
  selectCalendarByIdQuery,
  selectCalendarByOwnerUserIdQuery,
} from '@collision-calendar/db/queries';

type CalendarData = { name: string; owneruserid: number; created_at: string };
type CalendarEntry = CalendarData & { id: number };
type UserData = { name: string; email: string; password: string; created_at: string };
type UserEntry = UserData & { id: number };

Deno.test('DB: calendar queries', async (t) => {
  // create an in-memory database
  const db = new DB();

  // create tables
  db.execute(create_tables_sql);

  await t.step('query: select calendar by id', () => {
    // create a user
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

    const [user_entry] = db.queryEntries<UserEntry>(
      `
        SELECT * FROM user
         WHERE name = '${mock_user_data.name}'
           AND email = '${mock_user_data.email}'
           AND password = '${mock_user_data.password}'
           AND created_at = '${mock_user_data.created_at}'
      `,
    );
    assertExists(user_entry, 'inserted user not found');

    // create a calendar
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

    const [calendar_entry] = db.queryEntries<CalendarEntry>(
      `
        SELECT * FROM calendar
         WHERE name = '${mock_calendar_data.name}'
           AND owneruserid = ${mock_calendar_data.owneruserid}
           AND created_at = '${mock_calendar_data.created_at}'
      `,
    );
    assertExists(calendar_entry, 'inserted calendar not found');

    // test query
    const query = selectCalendarByIdQuery(db);
    const calendar_result = query.firstEntry({ id: calendar_entry.id });
    query.finalize();

    assertExists(calendar_result, 'no results');
    assertObjectMatch(calendar_result, calendar_entry);
    assertEquals(calendar_result.id, calendar_entry.id);
    assertEquals(calendar_result.name, calendar_entry.name);
    assertEquals(calendar_result.owneruserid, calendar_entry.owneruserid);
    assertEquals(calendar_result.created_at, calendar_entry.created_at);

    // clean up
    db.execute(
      `
        DELETE FROM calendar;
        DELETE FROM user;
      `,
    );
  });

  await t.step('query: select calendar by owner user id', () => {
    // create a user
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

    const [user_entry] = db.queryEntries<UserEntry>(
      `
        SELECT * FROM user
         WHERE name = '${mock_user_data.name}'
           AND email = '${mock_user_data.email}'
           AND password = '${mock_user_data.password}'
           AND created_at = '${mock_user_data.created_at}'
      `,
    );
    assertExists(user_entry, 'inserted user not found');

    // create a calendar
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

    const [calendar_entry] = db.queryEntries<CalendarEntry>(
      `
        SELECT * FROM calendar
         WHERE name = '${mock_calendar_data.name}'
           AND owneruserid = ${mock_calendar_data.owneruserid}
           AND created_at = '${mock_calendar_data.created_at}'
      `,
    );
    assertExists(calendar_entry, 'inserted calendar not found');

    // test query
    const query = selectCalendarByOwnerUserIdQuery(db);
    const calendar_result = query.firstEntry({ owneruserid: user_entry.id });
    query.finalize();

    assertExists(calendar_result, 'no results');
    assertObjectMatch(calendar_result, calendar_entry);
    assertEquals(calendar_result.id, calendar_entry.id);
    assertEquals(calendar_result.name, calendar_entry.name);
    assertEquals(calendar_result.owneruserid, calendar_entry.owneruserid);
    assertEquals(calendar_result.created_at, calendar_entry.created_at);

    // clean up
    db.execute(
      `
        DELETE FROM calendar;
        DELETE FROM user;
      `,
    );
  });

  await t.step('query: insert calendar', () => {
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

    const mock_calendar_data: CalendarData = {
      name: faker.company.name().replaceAll(`'`, ''),
      owneruserid: user_entry.id,
      created_at: Temporal.Now.instant().toString(),
    };

    const query = insertCalendarQuery(db);
    query.execute({ ...mock_calendar_data });
    query.finalize();

    const [calendar_entry] = db.queryEntries<CalendarEntry>('SELECT * FROM calendar');
    assertExists(calendar_entry, 'inserted calendar not found');
    assertEquals(calendar_entry.owneruserid, user_entry.id);
    assertEquals(calendar_entry.name, mock_calendar_data.name);
    assertEquals(calendar_entry.created_at, mock_calendar_data.created_at);

    db.execute(
      `
        DELETE FROM calendar;
        DELETE FROM user;
      `,
    );
  });

  await t.step('query: delete calendar by id', () => {
    const mock_user_data: UserData = {
      name: faker.person.firstName().replaceAll(`'`, ''),
      email: faker.internet.email(),
      password: faker.internet.password(),
      created_at: Temporal.Now.instant.toString(),
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
    assertEquals<UserData>({
      name: user_entry.name,
      email: user_entry.email,
      password: user_entry.password,
      created_at: user_entry.created_at,
    }, {
      name: mock_user_data.name,
      email: mock_user_data.email,
      password: mock_user_data.password,
      created_at: mock_user_data.created_at,
    }, 'entry does not match input');

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
    assertEquals<CalendarData>({
      name: calendar_entry.name,
      owneruserid: calendar_entry.owneruserid,
      created_at: calendar_entry.created_at,
    }, {
      name: mock_calendar_data.name,
      owneruserid: mock_calendar_data.owneruserid,
      created_at: mock_calendar_data.created_at,
    }, 'entry does not match data');

    const query = deleteCalendarByIdQuery(db);
    query.execute({ id: calendar_entry.id });
    query.finalize();

    const [entry] = db.queryEntries(`SELECT * FROM calendar WHERE id = ${calendar_entry.id}`);
    assertEquals(entry, undefined, 'calendar entry not deleted');

    db.execute(
      `
        DELETE FROM calendar;
        DELETE FROM user;
      `,
    );
  });

  db.close();
});
