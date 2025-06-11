import type { DB, Row, RowObject } from 'sqlite';
import type { ProposalBlock } from '../classes/proposal_block.ts';

/** Get prepared query for retrieving a {@link ProposalBlock} record by id. */
export const selectProposalBlockByIdQuery = (db: DB) =>
  db.prepareQuery<
    [ProposalBlock],
    { id: number; proposalid: number; blockid: number; created_at: string },
    { id: number }
  >(
    'SELECT * FROM proposal_block WHERE id = :id',
  );

/** Get prepared query for retrieving {@link ProposalBlock} records by proposal id. */
export const selectProposalBlockByProposalIdQuery = (db: DB) =>
  db.prepareQuery<
    [ProposalBlock],
    { id: number; proposalid: number; blockid: number; created_at: string },
    { proposalid: number }
  >(
    'SELECT * FROM proposal_block WHERE proposalid = :id',
  );

/** Get prepared query for retrieving {@link ProposalBlock} records by block id. */
export const selectProposalBlockByBlockIdQuery = (db: DB) =>
  db.prepareQuery<
    [ProposalBlock],
    { id: number; proposalid: number; blockid: number; created_at: string },
    { blockid: number }
  >(
    'SELECT * FROM proposal_block WHERE blockid = :blockid',
  );

/** Get prepared query for retrieving {@link ProposalBlock} records by proposal id and block id. */
export const selectProposalBlockByProposalAndBlockQuery = (db: DB) =>
  db.prepareQuery<
    [ProposalBlock],
    { id: number; proposalid: number; blockid: number; created_at: string },
    { proposalid: number; blockid: number }
  >(
    'SELECT * FROM proposal_block WHERE proposalid = :proposalid AND blockid = :blockid',
  );

/** Get prepared query for inserting a {@link ProposalBlock} record. */
export const insertProposalBlockQuery = (db: DB) =>
  db.prepareQuery<Row, RowObject, { proposalid: number; blockid: number; created_at: string }>(
    `
      INSERT INTO proposal_block (proposalid, blockid, created_at)
      VALUES (:proposalid, :blockid, :created_at)
    `,
  );

/** Get prepared query for deleting a {@link ProposalBlock} record by id. */
export const deleteProposalBlockByIdQuery = (db: DB) =>
  db.prepareQuery<Row, RowObject, { id: number }>(
    `
      DELETE FROM proposal_block
       WHERE id = :id
    `,
  );

/** Get prepared query for deleting {@link ProposalBlock} records by proposal id. */
export const deleteProposalBlockByProposalIdQuery = (db: DB) =>
  db.prepareQuery<Row, RowObject, { proposalid: number }>(
    `
      DELETE FROM proposal_block
       WHERE proposalid = :proposalid
    `,
  );

/** Get prepared query for deleting {@link ProposalBlock} records by block id. */
export const deleteProposalBlockByBlockIdQuery = (db: DB) =>
  db.prepareQuery<Row, RowObject, { blockid: number }>(
    `
      DELETE FROM proposal_block
       WHERE blockid = :blockid
    `,
  );

/** Get prepared query for deleting {@link ProposalBlock} records by proposal id and block id. */
export const deleteProposalBlockByProposalAndBlockQuery = (db: DB) =>
  db.prepareQuery<Row, RowObject, { proposalid: number; blockid: number }>(
    `
      DELETE FROM proposal_block
       WHERE proposalid = :proposalid
         AND blockid = :blockid
    `,
  );
