import { assert, assertEquals, assertExists, assertGreater, assertObjectMatch } from '@std/assert';

import { randomIntegerBetween, sample } from '@std/random';

import { DB } from 'sqlite';

import { faker } from '@faker-js/faker';

import {
  deleteCalendarAccessByIdQuery,
  deleteCalendarAccessByUserAndCalendarQuery,
  insertCalendarAccessQuery,
  selectCalendarAccessByCalendarIdAndPermissionsQuery,
  updateCalendarAccessPermissionsQuery,
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
  const db = new DB();

  db.execute(create_tables_sql);

  const access_permissions: AccessPermissions[] = [100, 110, 111];

  const number_of_users_to_insert = randomIntegerBetween(20, 40);
  for (let i = 0; i < number_of_users_to_insert; i++) {
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
  }

  const user_entries = db.queryEntries<UserEntry>('SELECT * FROM user');
  assertGreater(user_entries.length, 0);

  const mock_calendar_data: CalendarData = {
    name: faker.company.name().replaceAll(`'`, ''),
    owneruserid: sample(user_entries.map((e) => e.id))!,
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

  const number_of_calendar_access_to_insert = randomIntegerBetween(10, 19);

  const mock_calendar_access_data: CalendarAccessData[] = [];
  for (let i = 0; i < number_of_calendar_access_to_insert; i++) {
    mock_calendar_access_data[i] = {
      userid: user_entries[i].id,
      calendarid: calendar_entry.id,
      permissions: access_permissions[randomIntegerBetween(0, access_permissions.length - 1)],
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

  await t.step('query: select calendar_access by id & permissions', () => {
    const calendarid = calendar_entry.id;
    assertExists(calendarid);

    const permissions = sample(calendar_access_entries.map((e) => e.permissions));
    assertExists(permissions);
    assert(access_permissions.includes(permissions), 'invalid permissions value');

    const expected_entries = calendar_access_entries.filter((e) =>
      e.calendarid === calendarid && e.permissions === permissions
    ).map((e) => ({ userid: e.userid, calendarid: e.calendarid, permissions: e.permissions }));
    assertGreater(expected_entries.length, 0);

    const query = selectCalendarAccessByCalendarIdAndPermissionsQuery(db);
    const actual_entries = query.allEntries({ calendarid, permissions });
    query.finalize();

    assertExists(actual_entries);
    assertEquals(
      actual_entries.toSorted((a, b) => a.userid - b.userid),
      expected_entries.toSorted((a, b) => a.userid - b.userid),
    );
  });

  await t.step('query: insert calendar_access', () => {
    const all_user_ids = user_entries.map((e) => e.id);
    const used_user_ids = calendar_access_entries.map((e) => e.userid);

    const mock_calendar_access_data: CalendarAccessData = {
      userid: sample(all_user_ids.filter((id) => !used_user_ids.includes(id)))!,
      calendarid: calendar_entry.id,
      permissions: sample(access_permissions)!,
      created_at: Temporal.Now.instant().toString(),
    };

    const { userid, calendarid, permissions, created_at } = mock_calendar_access_data;

    const query = insertCalendarAccessQuery(db);
    query.execute({ calendarid, userid, permissions, created_at });
    query.finalize();

    const [actual_entry] = db.queryEntries<CalendarAccessEntry>(
      `
        SELECT * FROM calendar_access
         WHERE userid = ${userid}
           AND calendarid = ${calendarid}
           AND permissions = ${permissions}
           AND created_at = '${created_at}'
      `,
    );
    assertExists(actual_entry, 'inserted calendar_access not found');
    assertObjectMatch(actual_entry, mock_calendar_access_data);
  });

  await t.step('query: update calendar access permissions', () => {
    const entry_to_update = sample(calendar_access_entries);
    assertExists(entry_to_update);

    const new_permissions = sample(access_permissions.filter((p) => p !== entry_to_update.permissions));
    assertExists(new_permissions);

    const query = updateCalendarAccessPermissionsQuery(db);
    query.execute({
      calendarid: entry_to_update.calendarid,
      userid: entry_to_update.userid,
      permissions: new_permissions,
    });
    query.finalize();

    const [updated_entry] = db.queryEntries<CalendarAccessEntry>(
      `
        SELECT * FROM calendar_access
         WHERE calendarid = ${entry_to_update.calendarid}
           AND userid = ${entry_to_update.userid}
      `,
    );
    assertExists(updated_entry);
    assertEquals(updated_entry.permissions, new_permissions);
  });

  const getEntries = () => db.queryEntries<CalendarAccessEntry>('SELECT * FROM calendar_access');

  await t.step('query: delete calendar_access by id', () => {
    const entries = getEntries();
    assertGreater(entries.length, 0);

    const id = sample(entries.map((e) => e.id));
    assertExists(id);

    const query = deleteCalendarAccessByIdQuery(db);
    query.execute({ id });
    query.finalize();

    const [deleted_entry] = db.queryEntries<CalendarAccessEntry>(
      `
        SELECT * FROM calendar_access
         WHERE id = ${id}
      `,
    );

    assertEquals(deleted_entry, undefined);
  });

  await t.step('query: delete calendar_access by user and calendar', () => {
    const entries = getEntries();
    assertGreater(entries.length, 0);

    const userid = sample(entries.map((e) => e.userid));
    assertExists(userid);

    const calendarid = calendar_entry.id;
    assertExists(calendarid);

    const query = deleteCalendarAccessByUserAndCalendarQuery(db);
    query.execute({ userid, calendarid });
    query.finalize();

    const [deleted_entry] = db.queryEntries<CalendarAccessEntry>(
      `
        SELECT * FROM calendar_access
         WHERE userid = ${userid}
           AND calendarid = ${calendarid}
      `,
    );

    assertEquals(deleted_entry, undefined);
  });

  db.execute(
    `
      DELETE FROM calendar_access;
      DELETE FROM calendar;
      DELETE FROM user;
    `,
  );
  const deleted_calendar_access_entries = db.queryEntries<CalendarAccessEntry>('SELECT * FROM calendar_access');
  assertEquals(deleted_calendar_access_entries.length, 0, 'Not all calendar access entries were deleted');
  const deleted_calendar_entries = db.queryEntries<CalendarEntry>('SELECT * FROM calendar');
  assertEquals(deleted_calendar_entries.length, 0, 'Not all calendar records were deleted');
  const deleted_user_entries = db.queryEntries<UserEntry>('SELECT * FROM user');
  assertEquals(deleted_user_entries.length, 0, 'Not all user entries were deleted');

  db.close();
});
