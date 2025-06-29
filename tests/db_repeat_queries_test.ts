import { DB } from 'sqlite';

import { assertEquals, assertExists, assertGreater, assertObjectMatch } from '@std/assert';

import { randomIntegerBetween, sample } from '@std/random';

import { faker } from '@faker-js/faker';

import { create_tables_sql } from '@collision-calendar/db/init';

import {
  deleteRepeatByBlockIdQuery,
  deleteRepeatByIdQuery,
  insertRepeatQuery,
  selectRepeatByBlockIdQuery,
  selectRepeatByIdQuery,
} from '@collision-calendar/db/queries';

import type { RepeatUnit } from '@collision-calendar/types';

type UserData = { name: string; email: string; password: string; created_at: string };
type UserEntry = UserData & { id: number };
type CalendarData = { name: string; owneruserid: number; created_at: string };
type CalendarEntry = CalendarData & { id: number };
type SpaceData = { name: string; calendarid: number; created_at: string };
type SpaceEntry = SpaceData & { id: number };
type BlockData = { name: string; color: string; start: string; end: string; spaceid: number; created_at: string };
type BlockEntry = BlockData & { id: number };
type RepeatData = {
  unit: RepeatUnit;
  interval: number;
  start: string;
  end: string;
  blockid: number;
  created_at: string;
};
type RepeatEntry = RepeatData & { id: number };

Deno.test('DB: repeat queries', async (t) => {
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

  const [space_entry] = db.queryEntries<SpaceEntry>('SELECT * FROM space');
  assertExists(space_entry);
  assertObjectMatch(space_entry, mock_space_data);

  const block_start = Temporal.Now.plainDateTimeISO();

  const mock_block_data: BlockData = {
    name: faker.word.noun(),
    color: faker.color.rgb(),
    spaceid: space_entry.id,
    start: block_start.toString(),
    end: block_start.add({ hours: randomIntegerBetween(2, 8) }).toString(),
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
  assertExists(block_entry);
  assertObjectMatch(block_entry, mock_block_data);

  const repeat_units: RepeatUnit[] = ['day', 'week', 'month', 'year'];
  for (const repeat_unit of repeat_units) {
    const start = Temporal.Now.plainDateISO();
    const mock_repeat_data: RepeatData = {
      start: start.toString(),
      end: start.add({ days: randomIntegerBetween(7, 62) }).toString(),
      unit: repeat_unit,
      interval: randomIntegerBetween(1, 10),
      blockid: block_entry.id,
      created_at: Temporal.Now.instant().toString(),
    };

    db.execute(
      `
        INSERT INTO repeat (start, end, unit, interval, blockid, created_at)
        VALUES ('${mock_repeat_data.start}',
                '${mock_repeat_data.end}',
                '${mock_repeat_data.unit}',
                 ${mock_repeat_data.interval},
                 ${mock_repeat_data.blockid},
                '${mock_repeat_data.created_at}')
      `,
    );
  }

  const repeat_entries = db.queryEntries<RepeatEntry>('SELECT * FROM repeat');
  assertExists(repeat_entries);
  assertEquals(repeat_entries.length, repeat_units.length);

  await t.step('query: select repeat by id', () => {
    const expected_entry = sample(repeat_entries);
    assertExists(expected_entry);

    const query = selectRepeatByIdQuery(db);
    const actual_entry = query.firstEntry({ id: expected_entry.id });
    query.finalize();

    assertExists(actual_entry);
    assertObjectMatch(actual_entry, expected_entry);
    assertEquals(actual_entry, expected_entry);
  });

  await t.step('query: select repeat by block id', () => {
    const blockid = block_entry.id;
    assertExists(blockid);

    const expected_entries = repeat_entries.filter((e) => e.blockid === block_entry.id);
    assertGreater(expected_entries.length, 0);

    const query = selectRepeatByBlockIdQuery(db);
    const actual_entries = query.allEntries({ blockid });
    query.finalize();

    assertEquals(actual_entries.length, expected_entries.length);
    assertEquals(actual_entries.toSorted((a, b) => a.id - b.id), expected_entries.toSorted((a, b) => a.id - b.id));
  });
  await t.step('query: insert repeat', () => {
    const repeat_start = Temporal.Now.plainDateISO();
    const mock_repeat_data: RepeatData = {
      start: repeat_start.toString(),
      end: repeat_start.add({ days: randomIntegerBetween(7, 31) }).toString(),
      unit: sample(repeat_units)!,
      interval: randomIntegerBetween(1, 7),
      blockid: block_entry.id,
      created_at: Temporal.Now.instant().toString(),
    };

    const query = insertRepeatQuery(db);
    query.execute(mock_repeat_data);
    query.finalize();

    const [actual_entry] = db.queryEntries<RepeatEntry>(
      `
        SELECT * FROM repeat
         WHERE start = '${mock_repeat_data.start}'
           AND end = '${mock_repeat_data.end}'
           AND unit = '${mock_repeat_data.unit}'
           AND interval = ${mock_repeat_data.interval}
           AND blockid = ${mock_repeat_data.blockid}
           AND created_at = '${mock_repeat_data.created_at}'
      `,
    );

    assertExists(actual_entry);
    assertObjectMatch(actual_entry, mock_repeat_data);

    const actual_data: RepeatData = {
      start: actual_entry.start,
      end: actual_entry.end,
      unit: actual_entry.unit,
      interval: actual_entry.interval,
      blockid: actual_entry.blockid,
      created_at: actual_entry.created_at,
    };

    assertEquals(actual_data, mock_repeat_data);
  });
  await t.step('query: delete repeat by id', () => {
    const entries = db.queryEntries<RepeatEntry>('SELECT * FROM repeat');
    assertGreater(entries.length, 0);

    const entry_to_select = sample(entries);
    assertExists(entry_to_select);

    const query = deleteRepeatByIdQuery(db);
    query.execute({ id: entry_to_select.id });
    query.finalize();

    const [actual_entry] = db.queryEntries(
      `
        SELECT * FROM repeat
         WHERE id = ${entry_to_select.id}
      `,
    );
    assertEquals(actual_entry, undefined);
  });
  await t.step('query: delete repeat by block id', () => {
    const entries = db.queryEntries<RepeatEntry>('SELECT * FROM repeat');
    assertGreater(entries.length, 0);

    const blockid = sample(entries.map((e) => e.blockid));
    assertExists(blockid);

    const query = deleteRepeatByBlockIdQuery(db);
    query.execute({ blockid });
    query.finalize();

    const actual_entries = db.queryEntries<RepeatEntry>(
      `
        SELECT * FROM repeat
         WHERE blockid = ${blockid}
      `,
    );
    assertEquals(actual_entries.length, 0);
  });

  db.execute(
    `
      DELETE FROM repeat;
      DELETE FROM block;
      DELETE FROM space;
      DELETE FROM calendar;
      DELETE FROM user;
    `,
  );

  db.close();
});
