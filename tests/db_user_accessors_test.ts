import { assertArrayIncludes, assertEquals, assertExists } from '@std/assert';

import { randomIntegerBetween } from '@std/random';

import { faker } from '@faker-js/faker';

import { DB } from 'sqlite';

import { create_tables_sql } from '@collision-calendar/db/init';

import {
  getAllUserLogins,
  getAllUsersWithCalendarAccess,
  getAllUsersWithSpaceAccess,
} from '@collision-calendar/db/accessors';

import type { AccessPermissions } from '@collision-calendar/types';

type UserData = { name: string; email: string; password: string; created_at: string };
type UserLogin = { email: string; password: string };
type UserEntry = { id: number; name: string; email: string; password: string; created_at: string };
type CalendarData = { name: string; owneruserid: number; created_at: string };
type CalendarEntry = { id: number; name: string; owneruserid: number; created_at: string };
type CalendarAccessData = { userid: number; calendarid: number; permissions: AccessPermissions; created_at: string };
type CalendarAccessEntry = {
  id: number;
  userid: number;
  calendarid: number;
  permissions: AccessPermissions;
  created_at: string;
};

Deno.test('DB: user accessors', async (t) => {
  // open an in-memory database
  const db = new DB();

  // create tables
  db.execute(create_tables_sql);

  const access_permissions_values: AccessPermissions[] = [100, 110, 111];

  await t.step('accessor: get all user logins', () => {
    const mock_data: UserData[] = [];

    // generate 1-5 users and insert them
    const number_of_users_to_insert = randomIntegerBetween(1, 5);
    const entries: UserLogin[] = [];
    for (let i = 0; i < number_of_users_to_insert; i++) {
      mock_data[i] = {
        name: faker.person.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        created_at: Temporal.Now.instant().toString(),
      };

      db.query(
        `
          INSERT INTO user (name, email, password, created_at)
               VALUES ('${mock_data[i].name}',
                       '${mock_data[i].email}',
                       '${mock_data[i].password}',
                       '${mock_data[i].created_at}')
        `,
      );

      // retrieve created record
      const [login] = db.queryEntries<UserLogin>(`
        SELECT email, password FROM user
         WHERE name = '${mock_data[i].name}'
           AND email = '${mock_data[i].email}'
           AND password = '${mock_data[i].password}'
           AND created_at = '${mock_data[i].created_at}'
      `);
      assertExists(login, 'inserted user not found');

      entries[i] = login;
    }

    // test accessor
    const logins = getAllUserLogins(db);
    assertExists(logins, 'query failed');
    assertEquals<UserLogin[]>(entries, logins);

    // clean up
    db.query(`DELETE FROM user WHERE email IN (${logins.map((l) => `'${l.email}'`).join(', ')})`);
  });

  await t.step('accessor: get all user logins with calendar access', () => {
    const mock_user_data: UserData[] = [];

    // generate 3-6 users
    const number_of_users_to_insert = randomIntegerBetween(3, 6);
    const user_entries: UserEntry[] = [];
    for (let i = 0; i < number_of_users_to_insert; i++) {
      mock_user_data[i] = {
        name: faker.person.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        created_at: Temporal.Now.instant().toString(),
      };

      db.query(
        `
          INSERT INTO user (name, email, password, created_at)
               VALUES ('${mock_user_data[i].name}',
                       '${mock_user_data[i].email}',
                       '${mock_user_data[i].password}',
                       '${mock_user_data[i].created_at}')
        `,
      );

      // retrieve created record
      const [user_entry] = db.queryEntries<UserEntry>(`
        SELECT * FROM user
         WHERE name = '${mock_user_data[i].name}'
           AND email = '${mock_user_data[i].email}'
           AND password = '${mock_user_data[i].password}'
           AND created_at = '${mock_user_data[i].created_at}'
      `);
      assertExists(user_entry, 'inserted user not found');

      user_entries[i] = user_entry;
    }

    // create a calendar
    const mock_calendar_data: CalendarData = {
      name: faker.company.name(),
      owneruserid: user_entries[randomIntegerBetween(0, number_of_users_to_insert - 1)].id,
      created_at: Temporal.Now.instant().toString(),
    };
    db.query(
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

    // create calendar access for a subset of the users
    const mock_calendar_access_data: CalendarAccessData[] = [];
    const number_of_cal_access = randomIntegerBetween(1, 3);
    for (let i = 0; i < number_of_cal_access; i++) {
      mock_calendar_access_data[i] = {
        userid: user_entries[i].id,
        calendarid: calendar_entry.id,
        permissions: access_permissions_values[randomIntegerBetween(1, 2)],
        created_at: Temporal.Now.instant().toString(),
      };

      db.execute(
        `
          INSERT INTO calendar_access (userid, calendarid, permissions, created_at)
          VALUES (${mock_calendar_access_data[i].userid},
                  ${mock_calendar_access_data[i].calendarid},
                  ${mock_calendar_access_data[i].permissions},
                 '${mock_calendar_access_data[i].created_at}');
        `,
      );
    }
    const calendar_access_entries = db.queryEntries<CalendarAccessEntry>('SELECT * FROM calendar_access');
    assertExists(calendar_access_entries, 'inserted calendar access entries not found');
    assertEquals(calendar_access_entries.length, number_of_cal_access);

    // counts
    const users_with_permissions = {
      [access_permissions_values[0]]: calendar_access_entries.filter((cae) =>
        cae.permissions === access_permissions_values[0]
      ).length,
      [access_permissions_values[1]]:
        calendar_access_entries.filter((cae) => cae.permissions === access_permissions_values[1]).length,
      [access_permissions_values[2]]:
        calendar_access_entries.filter((cae) => cae.permissions === access_permissions_values[2]).length,
    };

    // test accessor
    let index_perms_to_test_for: number;
    let results: UserLogin[] = [];
    do {
      index_perms_to_test_for = randomIntegerBetween(0, 2);
      results = getAllUsersWithCalendarAccess(
        calendar_entry.id,
        access_permissions_values[index_perms_to_test_for],
        db,
      );
    } while (results.length < 1);
    assertExists(results, 'results are undefined');
    assertEquals(
      results.length,
      users_with_permissions[access_permissions_values[index_perms_to_test_for]],
      `actual: ${results.length} !== expected: ${
        users_with_permissions[access_permissions_values[index_perms_to_test_for]]
      }`,
    );
    assertArrayIncludes(user_entries.map((ue) => ue.email), results.map((r) => r.email));
    assertArrayIncludes(user_entries.map((ue) => ue.password), results.map((r) => r.password));

    // clean up
    db.execute(
      `
        DELETE FROM calendar_access;
        DELETE FROM calendar;
        DELETE FROM user;
      `,
    );
  });

  db.close();
});
