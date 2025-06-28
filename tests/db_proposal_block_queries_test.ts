import { DB } from 'sqlite';

import { assertEquals, assertExists, assertGreater, assertObjectMatch } from '@std/assert';

import { randomIntegerBetween, sample, shuffle } from '@std/random';

import { faker } from '@faker-js/faker';

import { create_tables_sql } from '@collision-calendar/db/init';

import {
  deleteProposalBlockByBlockIdQuery,
  deleteProposalBlockByIdQuery,
  deleteProposalBlockByProposalAndBlockQuery,
  deleteProposalBlockByProposalIdQuery,
  insertProposalBlockQuery,
  selectProposalBlockByBlockIdQuery,
  selectProposalBlockByIdQuery,
  selectProposalBlockByProposalAndBlockQuery,
  selectProposalBlockByProposalIdQuery,
} from '@collision-calendar/db/queries';

type UserData = { name: string; email: string; password: string; created_at: string };
type UserEntry = UserData & { id: number };
type CalendarData = { name: string; owneruserid: number; created_at: string };
type CalendarEntry = CalendarData & { id: number };
type SpaceData = { name: string; calendarid: number; created_at: string };
type SpaceEntry = SpaceData & { id: number };
type BlockData = { name: string; color: string; start: string; end: string; spaceid: number; created_at: string };
type BlockEntry = BlockData & { id: number };
type ProposalData = { name: string; spaceid: number; created_at: string };
type ProposalEntry = ProposalData & { id: number };
type ProposalBlockData = { blockid: number; proposalid: number; created_at: string };
type ProposalBlockEntry = ProposalBlockData & { id: number };

Deno.test('DB: proposal_block queries', async (t) => {
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

  const number_of_spaces_to_insert = randomIntegerBetween(3, 5);
  for (let i = 0; i < number_of_spaces_to_insert; i++) {
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
  }

  const space_entries = db.queryEntries<SpaceEntry>('SELECT * FROM space');
  assertExists(space_entries);
  assertEquals(space_entries.length, number_of_spaces_to_insert);

  const number_of_blocks_to_insert = randomIntegerBetween(20, 40);
  for (let i = 0; i < number_of_blocks_to_insert; i++) {
    const start = Temporal.Now.plainDateTimeISO();
    const mock_block_data: BlockData = {
      name: faker.word.noun(),
      spaceid: sample(space_entries.map((e) => e.id))!,
      color: faker.color.rgb(),
      start: start.toString(),
      end: start.add({ hours: randomIntegerBetween(2, 8) }).toString(),
      created_at: Temporal.Now.instant().toString(),
    };

    db.execute(
      `
        INSERT INTO block (name, color, spaceid, start, end, created_at)
        VALUES ('${mock_block_data.name}',
                '${mock_block_data.color}',
                 ${mock_block_data.spaceid},
                '${mock_block_data.start}',
                '${mock_block_data.end}',
                '${mock_block_data.created_at}')
      `,
    );
  }

  const block_entries = db.queryEntries<BlockEntry>('SELECT * FROM block');
  assertExists(block_entries);
  assertEquals(block_entries.length, number_of_blocks_to_insert);

  const number_of_proposals_to_insert = randomIntegerBetween(4, 8);
  for (let i = 0; i < number_of_proposals_to_insert; i++) {
    const mock_proposal_data: ProposalData = {
      name: faker.word.noun(),
      spaceid: sample(space_entries.map((e) => e.id))!,
      created_at: Temporal.Now.instant().toString(),
    };

    db.execute(
      `
        INSERT INTO proposal (name, spaceid, created_at)
        VALUES ('${mock_proposal_data.name}',
                 ${mock_proposal_data.spaceid},
                '${mock_proposal_data.created_at}')
      `,
    );
  }

  const proposal_entries = db.queryEntries<ProposalEntry>('SELECT * FROM proposal');
  assertExists(proposal_entries);
  assertEquals(proposal_entries.length, number_of_proposals_to_insert);

  const proposal_ids = proposal_entries.map((e) => e.id);
  const block_ids = block_entries.map((e) => e.id);

  const proposal_block_combinations = Array.from(
    proposal_ids.map((proposalid) => block_ids.map((blockid) => [proposalid, blockid])),
  ).reduce((a, b) => a.concat(b));

  const proposal_blocks_to_insert = shuffle(proposal_block_combinations).toSpliced(
    0,
    randomIntegerBetween(number_of_proposals_to_insert, number_of_blocks_to_insert),
  );

  for (const [proposalid, blockid] of proposal_blocks_to_insert) {
    const mock_proposal_block_data: ProposalBlockData = {
      proposalid,
      blockid,
      created_at: Temporal.Now.instant().toString(),
    };

    db.execute(
      `
        INSERT INTO proposal_block (proposalid, blockid, created_at)
        VALUES (${mock_proposal_block_data.proposalid},
                ${mock_proposal_block_data.blockid},
               '${mock_proposal_block_data.created_at}')
      `,
    );
  }

  const proposal_block_entries = db.queryEntries<ProposalBlockEntry>('SELECT * FROM proposal_block');
  assertExists(proposal_block_entries);
  assertEquals(proposal_block_entries.length, proposal_blocks_to_insert.length);

  await t.step('query: select proposal_block by id', () => {
    const expected_entry = sample(proposal_block_entries);
    assertExists(expected_entry);

    const query = selectProposalBlockByIdQuery(db);
    const actual_entry = query.firstEntry({ id: expected_entry.id });
    query.finalize();

    assertExists(actual_entry);
    assertObjectMatch(actual_entry, expected_entry);
    assertEquals(actual_entry, expected_entry);
  });
  await t.step('query: select proposal_block by block id', () => {
    const block_id_to_select = sample([...new Set(proposal_block_entries.map((e) => e.blockid))]);
    assertExists(block_id_to_select);

    const expected_entries = proposal_block_entries.filter((e) => e.blockid === block_id_to_select);
    assertGreater(expected_entries.length, 0);

    const query = selectProposalBlockByBlockIdQuery(db);
    const actual_entries = query.allEntries({ blockid: block_id_to_select });
    query.finalize();

    assertExists(actual_entries);
    assertEquals(actual_entries.sort((a, b) => a.id - b.id), expected_entries.sort((a, b) => a.id - b.id));
  });
  await t.step('query: select proposal_block by proposal id', () => {
    const proposal_id_to_select = sample([...new Set(proposal_block_entries.map((e) => e.proposalid))]);
    assertExists(proposal_id_to_select);

    const expected_entries = proposal_block_entries.filter((e) => e.proposalid === proposal_id_to_select);
    assertGreater(expected_entries.length, 0);

    const query = selectProposalBlockByProposalIdQuery(db);
    const actual_entries = query.allEntries({ proposalid: proposal_id_to_select });
    query.finalize();

    assertExists(actual_entries);
    assertEquals(actual_entries.sort((a, b) => a.id - b.id), expected_entries.sort((a, b) => a.id - b.id));
  });
  await t.step('query: select proposal_block by proposal and block', () => {
    const expected_entry = sample(proposal_block_entries);
    assertExists(expected_entry);

    const query = selectProposalBlockByProposalAndBlockQuery(db);
    const actual_entries = query.allEntries({ proposalid: expected_entry.proposalid, blockid: expected_entry.blockid });
    query.finalize();

    assertExists(actual_entries);
    assertEquals(actual_entries.length, 1);
    assertEquals(actual_entries[0], expected_entry);
  });
  await t.step('query: insert proposal_block', () => {
    let proposal_block_to_insert: number[] | undefined = [];
    do {
      proposal_block_to_insert = sample(proposal_block_combinations);
    } while (
      proposal_block_entries.find((e) =>
        e.proposalid === proposal_block_to_insert?.[0] && e.blockid === proposal_block_to_insert?.[1]
      )
    );
    assertExists(proposal_block_to_insert);
    assertEquals(proposal_block_to_insert.length, 2);

    const mock_proposal_block_data: ProposalBlockData = {
      proposalid: proposal_block_to_insert[0],
      blockid: proposal_block_to_insert[1],
      created_at: Temporal.Now.instant().toString(),
    };

    const query = insertProposalBlockQuery(db);
    query.execute({
      proposalid: mock_proposal_block_data.proposalid,
      blockid: mock_proposal_block_data.blockid,
      created_at: mock_proposal_block_data.created_at,
    });
    query.finalize();

    const actual_entries = db.queryEntries(
      `
        SELECT * FROM proposal_block
         WHERE proposalid = ${mock_proposal_block_data.proposalid}
           AND blockid = ${mock_proposal_block_data.blockid}
      `,
    );

    assertExists(actual_entries);
    assertEquals(actual_entries.length, 1);
    assertObjectMatch(actual_entries[0], mock_proposal_block_data);
  });

  await t.step('query: delete proposal_block by id', () => {
    const entry_to_delete = sample(proposal_block_entries);
    assertExists(entry_to_delete);

    const query = deleteProposalBlockByIdQuery(db);
    query.execute({ id: entry_to_delete.id });
    query.finalize();

    const [deleted_entry] = db.queryEntries<ProposalBlockEntry>(
      `
        SELECT * FROM proposal_block
         WHERE id = ${entry_to_delete.id}
      `,
    );
    assertEquals(deleted_entry, undefined);
  });
  await t.step('query: delete proposal_block by proposal id', () => {
    const entries = db.queryEntries<ProposalBlockEntry>('SELECT * FROM proposal_block');
    assertGreater(entries.length, 0);

    const proposal_id_to_select = sample(entries.map((e) => e.proposalid));
    assertExists(proposal_id_to_select);

    const expected_entries_to_delete = entries.filter((e) => e.proposalid === proposal_id_to_select);
    assertGreater(expected_entries_to_delete.length, 0);

    const query = deleteProposalBlockByProposalIdQuery(db);
    query.execute({ proposalid: proposal_id_to_select });
    query.finalize();

    const deleted_entries = db.queryEntries<ProposalBlockEntry>(
      `
        SELECT * FROM proposal_block
         WHERE proposalid = ${proposal_id_to_select}
      `,
    );
    assertEquals(deleted_entries.length, 0);
  });
  await t.step('query: delete proposal_block by block id', () => {
    const entries = db.queryEntries<ProposalBlockEntry>('SELECT * FROM proposal_block');

    const block_id_to_select = sample(entries.map((e) => e.blockid));
    assertExists(block_id_to_select);

    const expected_entries_to_delete = entries.filter((e) => e.blockid === block_id_to_select);
    assertGreater(expected_entries_to_delete.length, 0);

    const query = deleteProposalBlockByBlockIdQuery(db);
    query.execute({ blockid: block_id_to_select });
    query.finalize();

    const deleted_entries = db.queryEntries<ProposalBlockEntry>(
      `
        SELECT * FROM proposal_block
         WHERE blockid = ${block_id_to_select}
      `,
    );
    assertEquals(deleted_entries.length, 0);
  });
  await t.step('query: delete proposal_block by proposal and block', () => {
    const entries = db.queryEntries<ProposalBlockEntry>('SELECT * FROM proposal_block');
    assertGreater(entries.length, 0);

    const entry_to_delete = sample(entries);
    assertExists(entry_to_delete);

    const query = deleteProposalBlockByProposalAndBlockQuery(db);
    query.execute({
      proposalid: entry_to_delete.proposalid,
      blockid: entry_to_delete.blockid,
    });
    query.finalize();

    const [deleted_entry] = db.queryEntries<ProposalBlockEntry>(
      `
        SELECT * FROM proposal_block
         WHERE proposalid = ${entry_to_delete.proposalid}
           AND blockid = ${entry_to_delete.blockid}
      `,
    );
    assertEquals(deleted_entry, undefined);
  });

  db.execute(
    `
      DELETE FROM proposal_block;
      DELETE FROM proposal;
      DELETE FROM block;
      DELETE FROM space;
      DELETE FROM calendar;
      DELETE FROM user;
    `,
  );

  db.close();
});
