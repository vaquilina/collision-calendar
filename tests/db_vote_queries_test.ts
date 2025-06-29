import { DB } from 'sqlite';

import { assertEquals, assertExists, assertGreater, assertObjectMatch } from '@std/assert';

import { randomIntegerBetween, sample } from '@std/random';

import { faker } from '@faker-js/faker';

import { create_tables_sql } from '@collision-calendar/db/init';

import {
  deleteVoteByBlockAndProposalQuery,
  deleteVoteByBlockIdQuery,
  deleteVoteByIdQuery,
  deleteVoteByProposalIdQuery,
  insertVoteQuery,
  selectVoteByBlockAndProposalQuery,
  selectVoteByBlockIdQuery,
  selectVoteByIdQuery,
  selectVoteByOccupantIdQuery,
  selectVoteByProposalIdQuery,
} from '@collision-calendar/db/queries';

import type { VoteAnswer } from '@collision-calendar/types';

type UserData = { name: string; email: string; password: string; created_at: string };
type UserEntry = UserData & { id: number };
type CalendarData = { name: string; owneruserid: number; created_at: string };
type CalendarEntry = CalendarData & { id: number };
type SpaceData = { name: string; calendarid: number; created_at: string };
type SpaceEntry = SpaceData & { id: number };
type OccupantData = { userid: number; spaceid: number; created_at: string };
type OccupantEntry = OccupantData & { id: number };
type BlockData = { name: string; color: string; start: string; end: string; spaceid: number; created_at: string };
type BlockEntry = BlockData & { id: number };
type ProposalData = { name: string; spaceid: number; created_at: string };
type ProposalEntry = ProposalData & { id: number };
type ProposalBlockEntry = { proposalid: number; blockid: number; created_at: string; id: number };
type VoteData = { answer: VoteAnswer; blockid: number; occupantid: number; proposalid: number };
type VoteEntry = VoteData & { id: number };

Deno.test('DB: vote queries', async (t) => {
  const db = new DB();

  db.execute(create_tables_sql);

  const number_of_users_to_insert = randomIntegerBetween(4, 6);
  for (let i = 0; i < number_of_users_to_insert; i++) {
    const mock_user_data: UserData = {
      name: faker.person.firstName().replaceAll(`,`, ''),
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
  assertExists(user_entries);
  assertEquals(user_entries.length, number_of_users_to_insert);

  const mock_calendar_data: CalendarData = {
    name: faker.company.name().replaceAll(`,`, ''),
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

  const number_of_blocks_to_insert = randomIntegerBetween(20, 40);
  for (let i = 0; i < number_of_blocks_to_insert; i++) {
    const start = Temporal.Now.plainDateTimeISO();
    const mock_block_data: BlockData = {
      name: faker.word.noun(),
      color: faker.color.rgb(),
      start: start.toString(),
      end: start.add({ hours: randomIntegerBetween(2, 8) }).toString(),
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
  }

  const block_entries = db.queryEntries<BlockEntry>('SELECT * FROM block');
  assertExists(block_entries);
  assertEquals(block_entries.length, number_of_blocks_to_insert);

  for (const user_entry of user_entries) {
    const mock_occupant_data: OccupantData = {
      userid: user_entry.id,
      spaceid: space_entry.id,
      created_at: Temporal.Now.instant().toString(),
    };

    db.execute(
      `
        INSERT INTO occupant (userid, spaceid, created_at)
        VALUES (${mock_occupant_data.userid},
                ${mock_occupant_data.spaceid},
               '${mock_occupant_data.created_at}')
      `,
    );
  }

  const occupant_entries = db.queryEntries<OccupantEntry>('SELECT * FROM occupant');
  assertExists(occupant_entries);
  assertEquals(occupant_entries.length, user_entries.length);

  const mock_proposal_data: ProposalData = {
    name: faker.word.noun(),
    spaceid: space_entry.id,
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

  const [proposal_entry] = db.queryEntries<ProposalEntry>('SELECT * FROM proposal');
  assertExists(proposal_entry);
  assertObjectMatch(proposal_entry, mock_proposal_data);

  const proposal_blocks_to_insert: [number, number][] = block_entries.map(
    (block_entry) => [proposal_entry.id, block_entry.id],
  );

  for (const [proposalid, blockid] of proposal_blocks_to_insert) {
    db.execute(
      `
        INSERT INTO proposal_block (proposalid, blockid, created_at)
        VALUES (${proposalid},
                ${blockid},
                ${Temporal.Now.instant().toString()})
      `,
    );
  }

  const proposal_block_entries = db.queryEntries<ProposalBlockEntry>('SELECT * FROM proposal_block');
  assertExists(proposal_block_entries);
  assertEquals(proposal_block_entries.length, proposal_blocks_to_insert.length);

  // create votes

  await t.step('query: select vote by id', () => {});

  await t.step('query: select vote by block id', () => {});

  await t.step('query: select vote by proposal id', () => {});

  await t.step('query: select vote by block and proposal', () => {});

  await t.step('query: select vote by occupant id', () => {});

  await t.step('query: insert vote', () => {});

  await t.step('query: delete vote by id', () => {});

  await t.step('query: delete vote by block id', () => {});

  await t.step('query: delete vote by proposal id', () => {});

  await t.step('query: delete vote by proposal and block', () => {});

  db.execute(
    `
      DELETE FROM vote;
      DELETE FROM proposal;
      DELETE FROM block;
      DELETE FROM occupant;
      DELETE FROM space;
      DELETE FROM calendar;
      DELETE FROM user;
    `,
  );

  db.close();
});
