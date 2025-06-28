import { DB } from 'sqlite';

import { assertEquals, assertExists, assertGreater, assertObjectMatch } from '@std/assert';

import { randomIntegerBetween, sample } from '@std/random';

import { faker } from '@faker-js/faker';

import { create_tables_sql } from '@collision-calendar/db/init';

import {
  deleteProposalByIdQuery,
  deleteProposalBySpaceIdQuery,
  insertProposalQuery,
  selectProposalByIdQuery,
  selectProposalBySpaceIdQuery,
  updateProposalNameQuery,
} from '@collision-calendar/db/queries';

type UserData = { name: string; email: string; password: string; created_at: string };
type UserEntry = UserData & { id: number };
type CalendarData = { name: string; owneruserid: number; created_at: string };
type CalendarEntry = CalendarData & { id: number };
type SpaceData = { name: string; calendarid: number; created_at: string };
type SpaceEntry = SpaceData & { id: number };
type ProposalData = { name: string; spaceid: number; created_at: string };
type ProposalEntry = ProposalData & { id: number };

Deno.test('DB: proposal queries', async (t) => {
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

  const number_of_spaces_to_insert = randomIntegerBetween(4, 8);
  for (let i = 0; i < number_of_spaces_to_insert; i++) {
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
  }

  const space_entries = db.queryEntries<SpaceEntry>('SELECT * FROM space');
  assertEquals(space_entries.length, number_of_spaces_to_insert);

  const number_of_proposals_to_insert = randomIntegerBetween(10, 20);
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
  assertEquals(proposal_entries.length, number_of_proposals_to_insert);

  await t.step('query: select proposal by id', () => {
    const proposal_id_to_select = sample(proposal_entries.map((e) => e.id));
    assertExists(proposal_id_to_select);

    const expected_entry = proposal_entries.find((e) => e.id === proposal_id_to_select);
    assertExists(expected_entry);

    const query = selectProposalByIdQuery(db);
    const actual_entry = query.firstEntry({ id: proposal_id_to_select });
    query.finalize();

    assertExists(actual_entry);
    assertObjectMatch(actual_entry, expected_entry);
  });
  await t.step('query: select proposal by space id', () => {
    const space_id_to_select = sample(proposal_entries.map((e) => e.spaceid));
    assertExists(space_id_to_select);

    const expected_entries = proposal_entries.filter((e) => e.spaceid === space_id_to_select);

    const query = selectProposalBySpaceIdQuery(db);
    const actual_entries = query.allEntries({ spaceid: space_id_to_select });
    query.finalize();

    assertExists(actual_entries);
    assertEquals(actual_entries, expected_entries);
  });
  await t.step('query: insert proposal', () => {
    const mock_proposal_data: ProposalData = {
      name: faker.word.noun(),
      spaceid: sample(space_entries.map((e) => e.id))!,
      created_at: Temporal.Now.instant().toString(),
    };

    const query = insertProposalQuery(db);
    query.execute(mock_proposal_data);
    query.finalize();

    const [entry] = db.queryEntries<ProposalEntry>(
      `
        SELECT * FROM proposal
         WHERE name = '${mock_proposal_data.name}'
           AND spaceid = ${mock_proposal_data.spaceid}
           AND created_at = '${mock_proposal_data.created_at}'
      `,
    );
    assertExists(entry);
    assertObjectMatch(entry, mock_proposal_data);
  });
  await t.step('query: update proposal name', () => {
    const entries = db.queryEntries<ProposalEntry>('SELECT * FROM proposal');
    assertExists(entries);
    assertGreater(entries.length, 0);

    const proposal_entry_to_update = sample(entries);
    assertExists(proposal_entry_to_update);

    let new_name: string;
    do {
      new_name = faker.word.noun();
    } while (new_name !== proposal_entry_to_update.name);

    const query = updateProposalNameQuery(db);
    query.execute({ id: proposal_entry_to_update.id, name: new_name });
    query.finalize();

    const [updated_entry] = db.queryEntries<ProposalEntry>(
      `SELECT * FROM proposal WHERE id = ${proposal_entry_to_update.id}`,
    );
    assertExists(updated_entry);
    assertEquals(updated_entry.name, new_name);
  });
  await t.step('query: delete proposal by id', () => {
    const entries = db.queryEntries<ProposalEntry>('SELECT * FROM proposal');
    assertExists(entries);
    assertGreater(entries.length, 0);

    const proposal_id_to_select = sample(entries.map((e) => e.id));
    assertExists(proposal_id_to_select);

    const query = deleteProposalByIdQuery(db);
    query.execute({ id: proposal_id_to_select });
    query.finalize();

    const [deleted_entry] = db.queryEntries<ProposalEntry>(
      `SELECT * FROM proposal WHERE id = ${proposal_id_to_select}`,
    );
    assertEquals(deleted_entry, undefined);
  });
  await t.step('query: delete proposal by space id', () => {
    const entries = db.queryEntries<ProposalEntry>('SELECT * FROM proposal');
    assertExists(entries);
    assertGreater(entries.length, 0);

    const space_id_to_select = sample(entries.map((e) => e.spaceid));
    assertExists(space_id_to_select);

    const query = deleteProposalBySpaceIdQuery(db);
    query.execute({ spaceid: space_id_to_select });
    query.finalize();

    const deleted_entries = db.queryEntries<ProposalEntry>(
      `SELECT * FROM proposal WHERE spaceid = ${space_id_to_select}`,
    );
    assertEquals(deleted_entries.length, 0);
  });

  db.execute(
    `
      DELETE FROM proposal;
      DELETE FROM space;
      DELETE FROM calendar;
      DELETE FROM user;
    `,
  );

  db.close();
});
