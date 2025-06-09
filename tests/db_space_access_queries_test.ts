import { assert, assertArrayIncludes, assertEquals, assertExists } from '@std/assert';

import { randomIntegerBetween } from '@std/random';

import { faker } from '@faker-js/faker';

import { DB } from 'sqlite';

import { selectSpaceAccessQuery } from '@collision-calendar/db/queries';

import { create_tables_sql } from '@collision-calendar/db/init';

import type { AccessPermissions } from '@collision-calendar/types';

type SpaceAccessData = { userid: number; spaceid: number; permissions: AccessPermissions; created_at: string };
type SpaceAccessEntry = SpaceAccessData & { id: number };
type UserData = { name: string; email: string; password: string; created_at: string };
type UserEntry = UserData & { id: number };
type CalendarData = { name: string; owneruserid: number; created_at: string };
type CalendarEntry = CalendarData & { id: number };
type SpaceData = { name: string; calendarid: number; created_at: string };
type SpaceEntry = SpaceData & { id: number };

Deno.test('DB: space_access queries', async (t) => {
  // open an in-memory database
  const db = new DB();

  // create tables
  db.execute(create_tables_sql);

  const access_permissions_values: AccessPermissions[] = [100, 110, 111];

  await t.step('query: select space_access', () => {
    // create users
    const mock_user_data: UserData[] = [];
    const user_entries: UserEntry[] = [];
    const number_of_users_to_insert = randomIntegerBetween(3, 6);
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
      owneruserid: user_entries[0].id,
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

    // create a space
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
    assertExists(space_entry, 'inserted space not found');

    // create space access
    const mock_space_access_data: SpaceAccessData[] = [];
    const space_access_entries: SpaceAccessEntry[] = [];
    const number_of_space_access_to_insert = randomIntegerBetween(1, number_of_users_to_insert);
    for (let i = 0; i < number_of_space_access_to_insert; i++) {
      mock_space_access_data[i] = {
        userid: user_entries[i].id,
        spaceid: space_entry.id,
        permissions: access_permissions_values[randomIntegerBetween(0, access_permissions_values.length - 1)],
        created_at: Temporal.Now.instant().toString(),
      };

      db.execute(
        `
          INSERT INTO space_access (userid, spaceid, permissions, created_at)
          VALUES (${mock_space_access_data[i].userid},
                  ${mock_space_access_data[i].spaceid},
                  ${mock_space_access_data[i].permissions},
                 '${mock_space_access_data[i].created_at}')
        `,
      );

      const [space_access_entry] = db.queryEntries<SpaceAccessEntry>(
        `
          SELECT * FROM space_access
           WHERE userid = ${mock_space_access_data[i].userid}
             AND spaceid = ${mock_space_access_data[i].spaceid}
             AND permissions = ${mock_space_access_data[i].permissions}
             AND created_at = '${mock_space_access_data[i].created_at}'
        `,
      );
      assertExists(space_access_entry, 'inserted space access not found');

      space_access_entries[i] = space_access_entry;
    }

    // test query
    const query = selectSpaceAccessQuery(db);
    const results: { [permissions: number]: { spaceid: number; userid: number }[] } = {};
    for (const access_permissions_value of access_permissions_values) {
      results[access_permissions_value] = query.allEntries({
        spaceid: space_entry.id,
        permissions: access_permissions_value,
      });
      assertExists(results[access_permissions_value]);
      assertEquals(
        results[access_permissions_value].length,
        space_access_entries.filter((entry) => entry.permissions === access_permissions_value).length,
      );
      assert(
        results[access_permissions_value].map((result) => result.spaceid).every((spaceid) =>
          spaceid === space_entry.id
        ),
      );
      assertArrayIncludes(
        results[access_permissions_value].map((result) => result.userid),
        space_access_entries.filter((entry) => entry.permissions === access_permissions_value).map((entry) =>
          entry.userid
        ),
      );
    }
    query.finalize();

    // clean up
    db.execute(
      `
        DELETE FROM space;
        DELETE FROM calendar;
        DELETE FROM user;
      `,
    );
  });

  db.close();
});
