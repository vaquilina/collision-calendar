import { DB } from 'sqlite';

import { assertEquals, assertExists, assertObjectMatch } from '@std/assert';

import { randomIntegerBetween } from '@std/random';

import { faker } from '@faker-js/faker';

import { create_tables_sql } from '@collision-calendar/db/init';

import {
  deleteBlockByIdQuery,
  deleteBlockBySpaceIdQuery,
  insertBlockQuery,
  selectBlockByIdQuery,
  selectBlockBySpaceIdQuery,
  updateBlockColorQuery,
  updateBlockNameQuery,
  updateBlockTimeQuery,
} from '@collision-calendar/db/queries';

type UserData = { name: string; email: string; password: string; created_at: string };
type UserEntry = UserData & { id: number };
type CalendarData = { name: string; owneruserid: number; created_at: string };
type CalendarEntry = CalendarData & { id: number };
type SpaceData = { name: string; calendarid: number; created_at: string };
type SpaceEntry = SpaceData & { id: number };
type BlockData = { name: string; color: string; start: string; end: string; spaceid: number; created_at: string };
type BlockEntry = BlockData & { id: number };

Deno.test('DB: block queries', async (t) => {
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
  assertExists(user_entry, 'inserted user not found');

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

  const [space_entry] = db.queryEntries<SpaceEntry>('SELECT * FROM space');
  assertExists(space_entry, 'inserted space not found');

  const mock_block_data: BlockData = {
    name: faker.company.buzzPhrase().replaceAll(`,`, ''),
    color: faker.color.rgb(),
    start: Temporal.Now.plainDateTimeISO().toString(),
    end: Temporal.Now.plainDateTimeISO().add({ hours: randomIntegerBetween(1, 8) }).toString(),
    spaceid: space_entry.id,
    created_at: Temporal.Now.instant().toString(),
  };

  db.execute(
    `
        INSERT INTO block (name, color, start, end, spaceid, created_at)
        VALUES ('${mock_block_data.name}',
                '${mock_block_data.color}',
                '${mock_block_data.start}',
                '${mock_block_data.end}',
                 ${mock_block_data.spaceid},
                '${mock_block_data.created_at}')
      `,
  );

  const [block_entry] = db.queryEntries<BlockEntry>('SELECT * FROM block');
  assertExists(block_entry, 'inserted block not found');

  await t.step('query: select block by id', () => {
    const query = selectBlockByIdQuery(db);
    const result_entry = query.firstEntry({ id: block_entry.id });
    query.finalize();

    assertExists(result_entry, 'expected block entry to be returned');
    assertObjectMatch(result_entry, block_entry);
    assertEquals(result_entry.id, block_entry.id, 'ids do not match');
  });

  await t.step('query: select block by space id', () => {
    const query = selectBlockBySpaceIdQuery(db);
    const result_entry = query.firstEntry({ spaceid: space_entry.id });
    query.finalize();

    assertExists(result_entry, 'expected block entry to be returned');
    assertObjectMatch(result_entry, block_entry);
    assertEquals(result_entry.id, block_entry.id);
  });

  await t.step('query: insert block', () => {
    const mock_block_data: BlockData = {
      name: faker.company.buzzPhrase().replaceAll(`,`, ''),
      color: faker.color.rgb(),
      start: Temporal.Now.plainDateTimeISO().toString(),
      end: Temporal.Now.plainDateTimeISO().add({ hours: randomIntegerBetween(1, 8) }).toString(),
      spaceid: space_entry.id,
      created_at: Temporal.Now.instant().toString(),
    };

    const query = insertBlockQuery(db);
    query.execute(mock_block_data);
    query.finalize();

    const [result_entry] = db.queryEntries<BlockEntry>(
      `
        SELECT * FROM block
         WHERE name = '${mock_block_data.name}'
           AND color = '${mock_block_data.color}'
           AND start = '${mock_block_data.start}'
           AND end = '${mock_block_data.end}'
           AND spaceid = '${mock_block_data.spaceid}'
           AND created_at = '${mock_block_data.created_at}'
      `,
    );
    assertExists(result_entry, 'inserted block not found');
    assertObjectMatch(result_entry, mock_block_data);

    const result_entries = db.queryEntries<BlockEntry>('SELECT * FROM block');
    assertExists(result_entries, 'expected block entries to be returned');
    assertEquals(result_entries.length, 2);
  });

  await t.step('query: update block color', () => {
    const entries = db.queryEntries<BlockEntry>('SELECT * FROM block');
    assertExists(entries, 'no block entries found');

    const entry_to_update = entries[randomIntegerBetween(0, entries.length - 1)];

    const get_new_color = () => {
      let color = '';
      do {
        color = faker.color.rgb();
      } while (color === entry_to_update.color);
      return color;
    };

    const mock_update_data: Pick<BlockEntry, 'color' | 'id'> = {
      color: get_new_color(),
      id: entry_to_update.id,
    };

    const query = updateBlockColorQuery(db);
    query.execute(mock_update_data);
    query.finalize();

    const [updated_entry] = db.queryEntries<BlockEntry>(`SELECT * FROM block WHERE id = ${entry_to_update.id}`);
    assertExists(updated_entry);
    assertEquals(updated_entry.color, mock_update_data.color, 'block color was not updated');
  });

  await t.step('query: update block name', () => {
    const entries = db.queryEntries<BlockEntry>('SELECT * FROM block');
    assertExists(entries, 'no block entries found');

    const entry_to_update = entries[randomIntegerBetween(0, entries.length - 1)];

    const getNewName = () => {
      let name = '';
      do {
        name = faker.company.buzzPhrase().replaceAll(`'`, '');
      } while (name === entry_to_update.name);
      return name;
    };

    const mock_update_data: Pick<BlockEntry, 'name' | 'id'> = {
      name: getNewName(),
      id: entry_to_update.id,
    };

    const query = updateBlockNameQuery(db);
    query.execute(mock_update_data);
    query.finalize();

    const [updated_entry] = db.queryEntries<BlockEntry>(`SELECT * FROM block WHERE id = ${entry_to_update.id}`);
    assertExists(updated_entry);
    assertEquals(updated_entry.name, mock_update_data.name, 'block name was not updated');
  });

  await t.step('query: update block time', () => {
    const entries = db.queryEntries<BlockEntry>('SELECT * FROM block');
    assertExists(entries, 'no block entries found');

    const entry_to_update = entries[randomIntegerBetween(0, entries.length - 1)];

    const mock_update_data: Pick<BlockEntry, 'start' | 'end' | 'id'> = {
      start: Temporal.Now.plainDateTimeISO().toString(),
      end: Temporal.Now.plainDateTimeISO().add({ hours: randomIntegerBetween(1, 8) }).toString(),
      id: entry_to_update.id,
    };

    const query = updateBlockTimeQuery(db);
    query.execute(mock_update_data);
    query.finalize();

    const [updated_entry] = db.queryEntries<BlockEntry>(`SELECT * FROM block WHERE id = ${entry_to_update.id}`);
    assertExists(updated_entry);
    assertEquals(updated_entry.start, mock_update_data.start, 'block start was not updated');
    assertEquals(updated_entry.end, mock_update_data.end, 'block end was not updated');
  });

  await t.step('query: delete block by id', () => {
    const entries = db.queryEntries<BlockEntry>('SELECT * FROM block');
    assertExists(entries, 'no block entries found');

    const entry_to_delete = entries[randomIntegerBetween(0, entries.length - 1)];

    const query = deleteBlockByIdQuery(db);
    query.execute({ id: entry_to_delete.id });
    query.finalize();

    const [deleted_entry] = db.queryEntries<BlockEntry>(`SELECT * FROM block WHERE id = ${entry_to_delete.id}`);
    assertEquals(deleted_entry, undefined, 'block entry was not deleted');
  });

  await t.step('query: delete block by space id', () => {
    const entries = db.queryEntries<BlockEntry>('SELECT * FROM block');
    assertExists(entries, 'no block entries found');

    const query = deleteBlockBySpaceIdQuery(db);
    query.execute({ spaceid: space_entry.id });
    query.finalize();

    const result_entries = db.queryEntries<BlockEntry>(`SELECT * FROM block WHERE spaceid = ${space_entry.id}`);
    assertEquals(result_entries.length, 0, 'block entries were not deleted');
  });

  db.execute(
    `
        DELETE FROM calendar;
        DELETE FROM user;
      `,
  );

  const block_entries = db.queryEntries<BlockEntry>('SELECT * FROM block');
  const space_entries = db.queryEntries<SpaceEntry>('SELECT * FROM space');
  const calendar_entries = db.queryEntries<CalendarEntry>('SELECT * FROM calendar');
  const user_entries = db.queryEntries<UserEntry>('SELECT * FROM user');

  assertEquals(block_entries.length, 0, 'not all block records were deleted');
  assertEquals(space_entries.length, 0, 'not all space records were deleted');
  assertEquals(calendar_entries.length, 0, 'not all calendar records were deleted');
  assertEquals(user_entries.length, 0, 'not all user entries were deleted');

  db.close();
});
