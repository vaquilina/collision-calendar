import {
  assert,
  assertArrayIncludes,
  assertEquals,
  assertExists,
  assertGreater,
  assertNotEquals,
  assertObjectMatch,
} from '@std/assert';

import { randomIntegerBetween, sample } from '@std/random';

import { faker } from '@faker-js/faker';

import { DB } from 'sqlite';

import {
  deleteSpaceAccessByIdQuery,
  deleteSpaceAccessByUserAndSpaceQuery,
  insertSpaceAccessQuery,
  selectSpaceAccessByIdAndPermissionsQuery,
  updateSpaceAccessPermissionsQuery,
} from '@collision-calendar/db/queries';

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

  await t.step('query: select space_access', () => {
    const query = selectSpaceAccessByIdAndPermissionsQuery(db);
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
  });

  await t.step('query: insert space_access', () => {
    const mock_space_access_data: SpaceAccessData = {
      userid: user_entries[randomIntegerBetween(0, number_of_users_to_insert - 1)].id,
      spaceid: space_entry.id,
      permissions: access_permissions_values[randomIntegerBetween(0, 2)],
      created_at: Temporal.Now.instant().toString(),
    };

    const { userid, spaceid, permissions, created_at } = mock_space_access_data;

    const query = insertSpaceAccessQuery(db);
    query.execute({ spaceid, userid, permissions, created_at });
    query.finalize();

    const [space_access_entry] = db.queryEntries<SpaceAccessEntry>(
      `
        SELECT * FROM space_access
        WHERE userid = ${userid}
          AND spaceid = ${spaceid}
          AND permissions = ${permissions}
          AND created_at = '${created_at}'
      `,
    );
    assertExists(space_access_entry, 'inserted space_access entry not found');
    assertObjectMatch(space_access_entry, mock_space_access_data);
  });

  await t.step('query: update space_access permissions', () => {
    const space_access_entry_to_update =
      space_access_entries[randomIntegerBetween(0, number_of_space_access_to_insert - 1)];
    const [space_access_entry] = db.queryEntries<SpaceAccessEntry>(
      `
        SELECT * FROM space_access
         WHERE id = ${space_access_entry_to_update.id}
      `,
    );
    assertExists(space_access_entry);

    const new_permissions_value = sample(
      access_permissions_values.toSpliced(
        access_permissions_values.indexOf(space_access_entry_to_update.permissions),
        1,
      ),
    );
    assertExists(new_permissions_value);

    const query = updateSpaceAccessPermissionsQuery(db);
    query.execute({
      permissions: new_permissions_value,
      userid: space_access_entry_to_update.userid,
      spaceid: space_access_entry_to_update.spaceid,
    });
    query.finalize();

    const [updated_entry] = db.queryEntries<SpaceAccessEntry>(
      `SELECT * FROM space_access WHERE id = ${space_access_entry_to_update.id}`,
    );
    assertExists(updated_entry);
    assertEquals(updated_entry.permissions, new_permissions_value, 'entry not updated');
  });

  await t.step('query: delete space_access by id', () => {
    const existing_space_access_entries = db.queryEntries<SpaceAccessEntry>('SELECT * FROM space_access');
    assertExists(existing_space_access_entries);

    const space_access_entry_to_delete = sample(existing_space_access_entries.map((e) => e.id));
    assertExists(space_access_entry_to_delete);

    const query = deleteSpaceAccessByIdQuery(db);
    query.execute({ id: space_access_entry_to_delete });
    query.finalize();

    const result_entries = db.queryEntries<SpaceAccessEntry>('SELECT * FROM space_access');
    assertExists(result_entries);
    assertEquals(result_entries.length, existing_space_access_entries.length - 1);

    result_entries.forEach((e) => assertNotEquals(e.id, space_access_entry_to_delete));
  });

  await t.step('query: delete space_access by user and space', () => {
    const existing_space_access_entries = db.queryEntries<SpaceAccessEntry>('SELECT * FROM space_access');

    const target_space_access_entry = sample(existing_space_access_entries);
    assertExists(target_space_access_entry);

    const target_space_access_entries = db.queryEntries<SpaceAccessEntry>(
      `
        SELECT * FROM space_access
         WHERE userid = ${target_space_access_entry.userid}
           AND spaceid = ${target_space_access_entry.spaceid}
      `,
    );
    assertExists(target_space_access_entries);
    assertExists(target_space_access_entries);
    assertGreater(target_space_access_entries.length, 0);

    const { userid, spaceid } = target_space_access_entry;

    const query = deleteSpaceAccessByUserAndSpaceQuery(db);
    query.execute({ userid, spaceid });
    query.finalize();

    const result_entries = db.queryEntries<SpaceAccessEntry>('SELECT * FROM space_access');
    assertExists(result_entries);
    result_entries.forEach((e) => assert(!target_space_access_entries.map((entry) => entry.id).includes(e.id)));
  });

  // clean up
  db.execute(
    `
        DELETE FROM space;
        DELETE FROM calendar;
        DELETE FROM user;
      `,
  );

  db.close();
});
