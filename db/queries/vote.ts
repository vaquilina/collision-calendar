import type { DB, Row, RowObject } from 'sqlite';
import type { Vote } from '../classes/vote.ts';
import type { VoteAnswer } from '@collision-calendar/types';

/** Get prepared query for retrieving a {@link Vote} record by id. */
export const selectVoteByIdQuery = (db: DB) =>
  db.prepareQuery<
    [Vote],
    { id: number; answer: VoteAnswer; blockid: number; proposalid: number; occupantid: number; created_at: string },
    { id: number }
  >('SELECT * FROM vote WHERE id = :id');

/** Get prepared query for retrieving {@link Vote} records by block id. */
export const selectVoteByBlockIdQuery = (db: DB) =>
  db.prepareQuery<
    [Vote],
    { id: number; answer: VoteAnswer; blockid: number; proposalid: number; occupantid: number; created_at: string },
    { blockid: number }
  >('SELECT * FROM vote WHERE blockid = :blockid');

/** Get prepared query for retrieving {@link Vote} records by proposal id. */
export const selectVoteByProposalIdQuery = (db: DB) =>
  db.prepareQuery<
    [Vote],
    { id: number; answer: VoteAnswer; blockid: number; proposalid: number; occupantid: number; created_at: string },
    { proposalid: number }
  >('SELECT * FROM vote WHERE proposalid = :proposalid');

/** Get prepared query for retrieving {@link Vote} records by occupant id. */
export const selectVoteByOccupantIdQuery = (db: DB) =>
  db.prepareQuery<
    [Vote],
    { id: number; answer: VoteAnswer; blockid: number; proposalid: number; occupantid: number; created_at: string },
    { occupantid: number }
  >('SELECT * FROM vote WHERE occupantid = :occupantid');

/** Get prepared query for retrieving {@link Vote} records by block id and proposal id. */
export const selectVoteByBlockAndProposalQuery = (db: DB) =>
  db.prepareQuery<
    [Vote],
    { id: number; answer: VoteAnswer; blockid: number; proposalid: number; occupantid: number; created_at: string },
    { blockid: number; proposalid: number }
  >('SELECT * FROM vote WHERE blockid = :blockid AND proposalid = :proposalid');

/** Get prepared query for inserting a {@link Vote} record. */
export const insertVoteQuery = (db: DB) =>
  db.prepareQuery<Row, RowObject, { blockid: number; proposalid: number; occupantid: number; created_at: string }>(
    `
      INSERT INTO vote (blockid, proposalid, occupantid, created_at)
      VALUES (:blockid, :proposalid, :occupantid, :created_at)
    `,
  );

/** Get prepared query for deleting a {@link Vote} record by id. */
export const deleteVoteByIdQuery = (db: DB) =>
  db.prepareQuery<Row, RowObject, { id: number }>(
    'DELETE FROM vote WHERE id = :id',
  );

/** Get prepared query for deleting {@link Vote} records by block id. */
export const deleteVoteByBlockIdQuery = (db: DB) =>
  db.prepareQuery<Row, RowObject, { blockid: number }>(
    'DELETE FROM vote WHERE blockid = :blockid',
  );

/** Get prepared query for deleting {@link Vote} records by proposal id. */
export const deleteVoteByProposalIdQuery = (db: DB) =>
  db.prepareQuery<Row, RowObject, { proposalid: number }>(
    'DELETE FROM vote WHERE proposalid = :proposalid',
  );

/** Get prepared query for deleting {@link Vote} records by block id and proposal id. */
export const deleteVoteByBlockAndProposalQuery = (db: DB) =>
  db.prepareQuery<Row, RowObject, { blockid: number; proposalid: number }>(
    'DELETE FROM vote WHERE blockid = :blockid AND proposalid = :proposalid',
  );
