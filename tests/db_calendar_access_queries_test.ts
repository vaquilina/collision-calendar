import { assertArrayIncludes, assertEquals, assertExists } from '@std/assert';

import { randomIntegerBetween } from '@std/random';

import { DB } from 'sqlite';

import { faker } from '@faker-js/faker';

import { selectCalendarAccessQuery } from '@collision-calendar/db/queries';

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

  await t.step('query: select calendar_access', () => {
    // create users
    const number_of_users_to_insert = randomIntegerBetween(3, 6);
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

    // create calendar access
    const number_of_calendar_access_to_insert = randomIntegerBetween(3, number_of_users_to_insert);
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
    const query = selectCalendarAccessQuery(db);
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
  });

  db.close();
});
