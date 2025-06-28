import type { DB, Row, RowObject } from 'sqlite';
import type { Proposal } from '../classes/proposal.ts';

/** Get prepared query for retrieving a {@link Proposal} record by id. */
export const selectProposalByIdQuery = (db: DB) =>
  db.prepareQuery<[Proposal], { id: number; name: string; spaceid: number; created_at: string }, { id: number }>(
    'SELECT * FROM proposal WHERE id = :id',
  );

/** Get prepared query for retrieving {@link Proposal} records by space id. */
export const selectProposalBySpaceIdQuery = (db: DB) =>
  db.prepareQuery<[Proposal], { id: number; name: string; spaceid: number; created_at: string }, { spaceid: number }>(
    'SELECT * FROM proposal WHERE spaceid = :spaceid',
  );

/** Get prepared query for inserting a {@link Proposal} record. */
export const insertProposalQuery = (db: DB) =>
  db.prepareQuery<Row, RowObject, { name: string; spaceid: number; created_at: string }>(
    `
      INSERT INTO proposal (name, spaceid, created_at)
      VALUES (:name, :spaceid, :created_at)
    `,
  );

/** Get prepared query for updating the `name` field of a {@link Proposal} record. */
export const updateProposalNameQuery = (db: DB) =>
  db.prepareQuery<Row, RowObject, { name: string; id: number }>(
    `
      UPDATE proposal
         SET name = :name
       WHERE id = :id
    `,
  );

/** Get prepared query for deleting a {@link Proposal} record by id. */
export const deleteProposalByIdQuery = (db: DB) =>
  db.prepareQuery<Row, RowObject, { id: number }>(
    `
      DELETE FROM proposal
       WHERE id = :id
    `,
  );

/** Get prepared query for deleting {@link Proposal} records by space id. */
export const deleteProposalBySpaceIdQuery = (db: DB) =>
  db.prepareQuery<Row, RowObject, { spaceid: number }>(
    `
      DELETE FROM proposal
       WHERE spaceid = :spaceid
    `,
  );
