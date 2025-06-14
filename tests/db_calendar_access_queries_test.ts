import { assertArrayIncludes, assertEquals, assertExists, assertFalse, assertGreater, assertLess } from '@std/assert';

import { randomIntegerBetween } from '@std/random';

import { DB } from 'sqlite';

import { faker } from '@faker-js/faker';

import {
  deleteCalendarAccessByIdQuery,
  deleteCalendarAccessByUserAndCalendarQuery,
  insertCalendarAccessQuery,
  selectCalendarAccessByIdAndPermissionsQuery,
} from '@collision-calendar/db/queries';

import { create_tables_sql } from '@collision-calendar/db/init';

import type { AccessPermissions } from '@collision-calendar/types';

type UserData = { name: string; email: string; password: string; created_at: string };
type UserEntry = UserData & { id: number };
type CalendarData = { name: string; owneruserid: number; created_at: string };
type CalendarEntry = CalendarData & { id: number };
type CalendarAccessData = { userid: number; calendarid: number; permissions: AccessPermissions; created_at: string };
type CalendarAccessEntry = CalendarAccessData & { id: number };

Deno.test('DB: calendar_access queries', async (t) => {
  // open an in-memory database
  const db = new DB();

  // create tables
  db.execute(create_tables_sql);

  const access_permissions_values: AccessPermissions[] = [100, 110, 111];

  // create users
  const number_of_users_to_insert = 10;
  const mock_user_data: UserData[] = [];
  const user_entries: UserEntry[] = [];
  for (let i = 0; i < number_of_users_to_insert; i++) {
    mock_user_data[i] = {
      name: faker.person.firstName().replaceAll(`'`, ''),
      email: faker.internet.email(),
      password: faker.internet.password(),
      created_at: Temporal.Now.instant().toString(),
    };

    db.execute(
      `
          INSERT INTO user (name, email, password, created_at)
          VALUES ('${mock_user_data[i].name}',
                  '${mock_user_data[i].email}',
                  '${mock_user_data[i].password}',
                  '${mock_user_data[i].created_at}')
        `,
    );

    const [user_entry] = db.queryEntries<UserEntry>(
      `
          SELECT * FROM user
           WHERE name = '${mock_user_data[i].name}'
             AND email = '${mock_user_data[i].email}'
             AND password = '${mock_user_data[i].password}'
             AND created_at = '${mock_user_data[i].created_at}'
        `,
    );
    assertExists(user_entry, 'inserted user not found');

    user_entries[i] = user_entry;
  }

  // create a calendar
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

  const [calendar_entry] = db.queryEntries<CalendarEntry>(
    `
        SELECT * FROM calendar
         WHERE name = '${mock_calendar_data.name}'
           AND owneruserid = ${mock_calendar_data.owneruserid}
           AND created_at = '${mock_calendar_data.created_at}'
      `,
  );
  assertExists(calendar_entry, 'inserted calendar not found');

  await t.step('query: select calendar_access by id & permissions', () => {
    // create calendar access
    const number_of_calendar_access_to_insert = 8;
    const mock_calendar_access_data: CalendarAccessData[] = [];
    for (let i = 0; i < number_of_calendar_access_to_insert; i++) {
      mock_calendar_access_data[i] = {
        userid: user_entries[i].id,
        calendarid: calendar_entry.id,
        permissions: access_permissions_values[randomIntegerBetween(0, access_permissions_values.length - 1)],
        created_at: Temporal.Now.instant().toString(),
      };

      db.execute(
        `
          INSERT INTO calendar_access (userid, calendarid, permissions, created_at)
          VALUES (${mock_calendar_access_data[i].userid},
                  ${mock_calendar_access_data[i].calendarid},
                  ${mock_calendar_access_data[i].permissions},
                 '${mock_calendar_access_data[i].created_at}')
        `,
      );
    }

    const calendar_access_entries = db.queryEntries<CalendarAccessEntry>(`SELECT * FROM calendar_access`);
    assertExists(calendar_access_entries, 'inserted calendar access entries not found');
    assertEquals(mock_calendar_access_data.length, calendar_access_entries.length);

    // test query
    const query = selectCalendarAccessByIdAndPermissionsQuery(db);
    const query_results: { [permissions: number]: { userid: number; calendarid: number }[] } = [];
    for (const access_permissions_value of access_permissions_values) {
      query_results[access_permissions_value] = query.allEntries({
        calendarid: calendar_entry.id,
        permissions: access_permissions_value,
      });
    }
    query.finalize();

    for (const [access_permissions_value, result_entries] of Object.entries(query_results)) {
      const expected_entries = calendar_access_entries.filter((entry) =>
        entry.permissions === Number(access_permissions_value)
      );

      assertEquals(result_entries.length, expected_entries.length);
      assertEquals(result_entries.map((entry) => entry.calendarid), expected_entries.map((entry) => entry.calendarid));
      assertArrayIncludes(result_entries.map((entry) => entry.userid), expected_entries.map((entry) => entry.userid));
    }
  });

  await t.step('query: insert calendar_access', () => {
    const mock_calendar_access_data: CalendarAccessData = {
      userid: user_entries[7].id,
      calendarid: calendar_entry.id,
      permissions: access_permissions_values[randomIntegerBetween(0, access_permissions_values.length - 1)],
      created_at: Temporal.Now.instant().toString(),
    };

    const query = insertCalendarAccessQuery(db);
    query.execute({
      calendarid: mock_calendar_access_data.calendarid,
      userid: mock_calendar_access_data.userid,
      permissions: mock_calendar_access_data.permissions,
      created_at: mock_calendar_access_data.created_at,
    });
    query.finalize();

    const [calendar_access_entry] = db.queryEntries<CalendarAccessEntry>(
      `
        SELECT * FROM calendar_access
         WHERE userid = ${mock_calendar_access_data.userid}
           AND calendarid = ${mock_calendar_access_data.calendarid}
           AND permissions = ${mock_calendar_access_data.permissions}
           AND created_at = '${mock_calendar_access_data.created_at}'
      `,
    );
    assertExists(calendar_access_entry, 'inserted calendar_access not found');
  });

  await t.step('query: delete calendar_access by id', () => {
    const calendar_access_entries = db.queryEntries<CalendarAccessEntry>('SELECT * FROM calendar_access');
    assertExists(calendar_access_entries);
    assertGreater(calendar_access_entries.length, 0, 'no calendar_access entries found');

    const id_to_delete = randomIntegerBetween(0, calendar_access_entries.length - 1);

    const query = deleteCalendarAccessByIdQuery(db);
    query.execute({ id: id_to_delete });
    query.finalize();

    const actual_entries = db.queryEntries<CalendarAccessEntry>('SELECT * FROM calendar_access');
    assertExists(actual_entries);
    assertFalse(actual_entries.map((e) => e.id).includes(id_to_delete), 'failed to delete record');
  });

  await t.step('query: delete calendar_access by user and calendar', () => {
    const calendar_access_entries = db.queryEntries<CalendarAccessEntry>('SELECT * FROM calendar_access');
    assertExists(calendar_access_entries);
    assertGreater(calendar_access_entries.length, 0, 'no calendar_access entries found');

    const index_to_delete: number = randomIntegerBetween(0, calendar_access_entries.length - 1);

    const userid: number = calendar_access_entries[index_to_delete].userid;
    const calendarid: number = calendar_access_entries[index_to_delete].calendarid;

    const query = deleteCalendarAccessByUserAndCalendarQuery(db);
    query.execute({ userid, calendarid });
    query.finalize();

    const actual_entries = db.queryEntries<CalendarAccessEntry>('SELECT * FROM calendar_access');
    assertExists(actual_entries);
    assertLess(actual_entries.length, calendar_access_entries.length);
  });

  // clean up
  db.execute(
    `
        DELETE FROM calendar;
        DELETE FROM user;
      `,
  );
  const test_calendar_entries = db.queryEntries<CalendarEntry>('SELECT * FROM calendar');
  assertEquals(test_calendar_entries.length, 0, 'Not all calendar records were deleted');
  const test_user_entries = db.queryEntries<UserEntry>('SELECT * FROM user');
  assertEquals(test_user_entries.length, 0, 'Not all user entries were deleted');
  const test_calendar_access_entries = db.queryEntries<CalendarAccessEntry>('SELECT * FROM calendar_access');
  assertEquals(test_calendar_access_entries.length, 0, 'Not all calendar access entries were deleted');

  db.close();
});
