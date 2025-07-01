import { assertEquals, assertExists, assertGreater, assertNotEquals, assertObjectMatch } from '@std/assert';

import { randomIntegerBetween, sample } from '@std/random';

import { faker } from '@faker-js/faker';

import { DB } from 'sqlite';

import {
  deleteSpaceAccessByIdQuery,
  deleteSpaceAccessByUserAndSpaceQuery,
  insertSpaceAccessQuery,
  selectSpaceAccessBySpaceIdAndPermissionsQuery,
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
  const db = new DB();

  db.execute(create_tables_sql);

  const access_permissions: AccessPermissions[] = [100, 110, 111];

  const number_of_users_to_insert = randomIntegerBetween(20, 40);
  for (let i = 0; i < number_of_users_to_insert; i++) {
    const mock_user_data = {
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
  }

  const user_entries = db.queryEntries<UserEntry>('SELECT * FROM user');
  assertGreater(user_entries.length, 0);

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
  assertObjectMatch(calendar_entry, mock_calendar_data);

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
  assertObjectMatch(space_entry, mock_space_data);

  const number_of_space_access_to_insert = randomIntegerBetween(1, number_of_users_to_insert - 1);
  for (let i = 0; i < number_of_space_access_to_insert; i++) {
    const mock_space_access_data = {
      userid: user_entries[i].id,
      spaceid: space_entry.id,
      permissions: access_permissions[randomIntegerBetween(0, access_permissions.length - 1)],
      created_at: Temporal.Now.instant().toString(),
    };

    db.execute(
      `
          INSERT INTO space_access (userid, spaceid, permissions, created_at)
          VALUES (${mock_space_access_data.userid},
                  ${mock_space_access_data.spaceid},
                  ${mock_space_access_data.permissions},
                 '${mock_space_access_data.created_at}')
        `,
    );
  }

  const space_access_entries = db.queryEntries<SpaceAccessEntry>('SELECT * FROM space_access');
  assertGreater(space_access_entries.length, 0);

  await t.step('query: select space_access by space id and permissions', () => {
    const spaceid = space_entry.id;
    assertExists(spaceid);

    const permissions = sample(space_access_entries.filter((e) => e.spaceid === spaceid).map((e) => e.permissions));
    assertExists(permissions);

    const expected_entries = space_access_entries.filter((e) => e.spaceid === spaceid && e.permissions === permissions)
      .map((e) => ({ userid: e.userid, spaceid: e.spaceid, permissions: e.permissions }));
    assertGreater(expected_entries.length, 0);

    const query = selectSpaceAccessBySpaceIdAndPermissionsQuery(db);
    const actual_entries = query.allEntries({ spaceid, permissions });
    query.finalize();

    assertExists(actual_entries);
    assertEquals(
      actual_entries.toSorted((a, b) => a.userid - b.userid),
      expected_entries.toSorted((a, b) => a.userid - b.userid),
    );
  });

  await t.step('query: insert space_access', () => {
    const all_user_ids = user_entries.map((e) => e.id);
    assertGreater(all_user_ids.length, 0);

    const used_user_ids = space_access_entries.map((e) => e.userid);
    assertGreater(used_user_ids.length, 0);

    const mock_space_access_data: SpaceAccessData = {
      userid: sample(all_user_ids.filter((id) => !used_user_ids.includes(id)))!,
      spaceid: space_entry.id,
      permissions: sample(access_permissions)!,
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
    const entry_to_update = sample(space_access_entries);
    assertExists(entry_to_update);

    const new_permissions = sample(access_permissions.filter((p) => p !== entry_to_update.permissions));
    assertExists(new_permissions);

    const query = updateSpaceAccessPermissionsQuery(db);
    query.execute({ userid: entry_to_update.userid, spaceid: entry_to_update.spaceid, permissions: new_permissions });
    query.finalize();

    const [updated_entry] = db.queryEntries<SpaceAccessEntry>(
      `
        SELECT * FROM space_access
         WHERE id = ${entry_to_update.id}
      `,
    );

    assertExists(updated_entry);
    assertNotEquals(updated_entry.permissions, entry_to_update.permissions);
    assertEquals(updated_entry.permissions, new_permissions);
  });

  const getEntries = () => db.queryEntries<SpaceAccessEntry>('SELECT * FROM space_access');

  await t.step('query: delete space_access by id', () => {
    const entries = getEntries();
    assertExists(entries);

    const id = sample(entries.map((e) => e.id));
    assertExists(id);

    const query = deleteSpaceAccessByIdQuery(db);
    query.execute({ id });
    query.finalize();

    const [deleted_entry] = db.queryEntries<SpaceAccessEntry>(
      `
        SELECT * FROM space_access
         WHERE id = ${id}
      `,
    );

    assertEquals(deleted_entry, undefined);
  });

  await t.step('query: delete space_access by user and space', () => {
    const entry_to_delete = sample(space_access_entries);
    assertExists(entry_to_delete);

    const { userid, spaceid } = entry_to_delete;

    const query = deleteSpaceAccessByUserAndSpaceQuery(db);
    query.execute({ userid, spaceid });
    query.finalize();

    const [deleted_entry] = db.queryEntries<SpaceAccessEntry>(
      `
        SELECT * FROM space_access
         WHERE id = ${entry_to_delete.id}
      `,
    );

    assertEquals(deleted_entry, undefined);
  });

  db.execute(
    `
      DELETE FROM space_access;
      DELETE FROM space;
      DELETE FROM calendar;
      DELETE FROM user;
    `,
  );

  db.close();
});
