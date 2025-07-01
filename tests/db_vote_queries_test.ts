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
type ProposalBlockData = { proposalid: number; blockid: number; created_at: string };
type ProposalBlockEntry = ProposalBlockData & { id: number };
type VoteData = { answer: VoteAnswer; blockid: number; occupantid: number; proposalid: number; created_at: string };
type VoteEntry = VoteData & { id: number };

Deno.test('DB: vote queries', async (t) => {
  const db = new DB();

  db.execute(create_tables_sql);

  const number_of_users_to_insert = randomIntegerBetween(40, 60);
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
               '${Temporal.Now.instant().toString()}')
      `,
    );
  }

  const proposal_block_entries = db.queryEntries<ProposalBlockEntry>('SELECT * FROM proposal_block');
  assertExists(proposal_block_entries);
  assertEquals(proposal_block_entries.length, proposal_blocks_to_insert.length);

  let i = 0;
  for (const proposal_block_entry of proposal_block_entries) {
    const mock_vote_data: VoteData = {
      answer: randomIntegerBetween(0, 1),
      blockid: proposal_block_entry.blockid,
      proposalid: proposal_block_entry.proposalid,
      occupantid: occupant_entries[i].id,
      created_at: Temporal.Now.instant().toString(),
    };

    i += 1;

    db.execute(
      `
        INSERT INTO vote (answer, blockid, proposalid, occupantid, created_at)
        VALUES (${mock_vote_data.answer},
                ${mock_vote_data.blockid},
                ${mock_vote_data.proposalid},
                ${mock_vote_data.occupantid},
               '${mock_vote_data.created_at}')
      `,
    );
  }

  const vote_entries = db.queryEntries<VoteEntry>('SELECT * FROM vote');
  assertExists(vote_entries);
  assertGreater(vote_entries.length, 0);
  assertEquals(vote_entries.length, proposal_block_entries.length);

  await t.step('query: select vote by id', () => {
    const expected_entry = sample(vote_entries);
    assertExists(expected_entry);

    const query = selectVoteByIdQuery(db);
    const actual_entry = query.firstEntry({ id: expected_entry.id });
    query.finalize();

    assertExists(actual_entry);
    assertEquals(actual_entry, expected_entry);
  });

  await t.step('query: select vote by block id', () => {
    const blockid = sample(proposal_block_entries.map((e) => e.blockid));
    assertExists(blockid);

    const expected_entries = vote_entries.filter((e) => e.blockid === blockid);
    assertGreater(expected_entries.length, 0);

    const query = selectVoteByBlockIdQuery(db);
    const actual_entries = query.allEntries({ blockid });
    query.finalize();

    assertExists(actual_entries);
    assertEquals(actual_entries.toSorted((a, b) => a.id - b.id), expected_entries.toSorted((a, b) => a.id - b.id));
  });

  await t.step('query: select vote by proposal id', () => {
    const proposalid = sample(proposal_block_entries.map((e) => e.proposalid));
    assertExists(proposalid);

    const expected_entries = vote_entries.filter((e) => e.proposalid === proposalid);
    assertGreater(expected_entries.length, 0);

    const query = selectVoteByProposalIdQuery(db);
    const actual_entries = query.allEntries({ proposalid });
    query.finalize();

    assertExists(actual_entries);
    assertEquals(actual_entries, expected_entries);
  });

  await t.step('query: select vote by block and proposal', () => {
    const { blockid, proposalid } = sample(proposal_block_entries)!;
    assertExists(blockid);
    assertExists(proposalid);

    const expected_entries = vote_entries.filter((e) => e.blockid === blockid && e.proposalid === proposalid);
    assertGreater(expected_entries.length, 0);

    const query = selectVoteByBlockAndProposalQuery(db);
    const actual_entries = query.allEntries({ blockid, proposalid });
    query.finalize();

    assertExists(actual_entries);
    assertEquals(actual_entries, expected_entries);
  });

  await t.step('query: select vote by occupant id', () => {
    const occupantid = sample(vote_entries.map((e) => e.occupantid));
    assertExists(occupantid);

    const expected_entries = vote_entries.filter((e) => e.occupantid === occupantid);
    assertGreater(expected_entries.length, 0);

    const query = selectVoteByOccupantIdQuery(db);
    const actual_entries = query.allEntries({ occupantid });
    query.finalize();

    assertExists(actual_entries);
    assertEquals(actual_entries, expected_entries);
  });

  await t.step('query: insert vote', () => {
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

    const [user_entry] = db.queryEntries<UserEntry>(
      `
        SELECT * FROM user
         WHERE created_at = '${mock_user_data.created_at}'
      `,
    );

    assertExists(user_entry);
    assertObjectMatch(user_entry, mock_user_data);

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

    const [occupant_entry] = db.queryEntries<OccupantEntry>(
      `
        SELECT * FROM occupant
         WHERE created_at = '${mock_occupant_data.created_at}'
      `,
    );

    assertExists(occupant_entry);
    assertObjectMatch(occupant_entry, mock_occupant_data);

    const start = Temporal.Now.plainDateTimeISO();
    const mock_block_data: BlockData = {
      name: faker.word.noun(),
      color: faker.color.rgb(),
      start: start.toString(),
      end: start.add({ hours: randomIntegerBetween(1, 8) }).toString(),
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

    const [block_entry] = db.queryEntries<BlockEntry>(
      `
        SELECT * FROM block
         WHERE created_at = '${mock_block_data.created_at}'
      `,
    );

    assertExists(block_entry);
    assertObjectMatch(block_entry, mock_block_data);

    const mock_proposal_block_data: ProposalBlockData = {
      proposalid: proposal_entry.id,
      blockid: block_entry.id,
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

    const [proposal_block_entry] = db.queryEntries<ProposalBlockEntry>(
      `
        SELECT * FROM proposal_block
         WHERE created_at = '${mock_proposal_block_data.created_at}'
      `,
    );

    assertExists(proposal_block_entry);
    assertObjectMatch(proposal_block_entry, mock_proposal_block_data);

    const mock_vote_data: VoteData = {
      blockid: proposal_block_entry.blockid,
      proposalid: proposal_block_entry.proposalid,
      occupantid: occupant_entry.id,
      created_at: Temporal.Now.instant().toString(),
      answer: randomIntegerBetween(0, 1),
    };

    const query = insertVoteQuery(db);
    query.execute(mock_vote_data);
    query.finalize();

    const [actual_entry] = db.queryEntries(
      `
        SELECT * FROM vote
         WHERE blockid = ${mock_vote_data.blockid}
           AND proposalid = ${mock_vote_data.proposalid}
           AND occupantid = ${mock_vote_data.occupantid}
           AND answer = ${mock_vote_data.answer}
           AND created_at = '${mock_vote_data.created_at}'
      `,
    );

    assertExists(actual_entry);
    assertObjectMatch(actual_entry, mock_vote_data);
  });

  const getEntries = () => db.queryEntries<VoteEntry>('SELECT * FROM vote');

  await t.step('query: delete vote by id', () => {
    const entries = getEntries();
    assertGreater(entries.length, 0);

    const id = sample(entries.map((e) => e.id));
    assertExists(id);

    const query = deleteVoteByIdQuery(db);
    query.execute({ id });
    query.finalize();

    const [actual_entry] = db.queryEntries<VoteEntry>(
      `
        SELECT * FROM vote
         WHERE id = ${id}
      `,
    );

    assertEquals(actual_entry, undefined);
  });

  await t.step('query: delete vote by block id', () => {
    const entries = getEntries();
    assertGreater(entries.length, 0);

    const blockid = sample(entries.map((e) => e.blockid));
    assertExists(blockid);

    const query = deleteVoteByBlockIdQuery(db);
    query.execute({ blockid });
    query.finalize();

    const actual_entries = db.queryEntries<VoteEntry>(
      `
        SELECT * FROM vote
         WHERE blockid = ${blockid}
      `,
    );
    assertEquals(actual_entries.length, 0);
  });

  await t.step('query: delete vote by proposal id', () => {
    const entries = getEntries();
    assertGreater(entries.length, 0);

    const proposalid = sample(entries.map((e) => e.proposalid));
    assertExists(proposalid);

    const query = deleteVoteByProposalIdQuery(db);
    query.execute({ proposalid });
    query.finalize();

    const actual_entries = db.queryEntries<VoteEntry>(
      `
        SELECT * FROM vote
         WHERE proposalid = ${proposalid}
      `,
    );

    assertEquals(actual_entries.length, 0);
  });

  await t.step('query: delete vote by proposal and block', () => {
    const insert_query = insertVoteQuery(db);
    for (const vote_entry of vote_entries) {
      const { blockid, proposalid, occupantid, answer, created_at } = vote_entry;
      insert_query.execute({ blockid, proposalid, occupantid, answer, created_at });
    }
    insert_query.finalize();

    const entries = getEntries();
    assertGreater(entries.length, 0);

    const { proposalid, blockid } = sample(entries)!;
    assertExists(proposalid);
    assertExists(blockid);

    const query = deleteVoteByBlockAndProposalQuery(db);
    query.execute({ blockid, proposalid });
    query.finalize();

    const actual_entries = db.queryEntries<VoteEntry>(
      `
        SELECT * FROM vote
         WHERE blockid = ${blockid}
           AND proposalid = ${proposalid}
      `,
    );

    assertEquals(actual_entries.length, 0);
  });

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
