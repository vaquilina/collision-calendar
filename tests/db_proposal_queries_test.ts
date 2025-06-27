import { DB } from 'sqlite';

import { assertEquals, assertExists, assertNotEquals, assertObjectMatch } from '@std/assert';

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

  await t.step('query: select proposal by id', () => {});
  await t.step('query: select proposal by space id', () => {});
  await t.step('query: insert proposal', () => {});
  await t.step('query: update proposal name', () => {});
  await t.step('query: delete proposal by id', () => {});
  await t.step('query: delete proposal by space id', () => {});

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
