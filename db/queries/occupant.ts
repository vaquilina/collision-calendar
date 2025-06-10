import type { DB, Row, RowObject } from 'sqlite';
import type { Occupant } from '../classes/occupant.ts';

/** Get prepared query for retrieving a {@link Occupant} record by id. */
export const selectOccupantByIdQuery = (db: DB) =>
  db.prepareQuery<[Occupant], { id: number; userid: number; spaceid: number; created_at: string }, { id: number }>(
    'SELECT * FROM occupant WHERE id = :id',
  );

/** Get prepared query for retrieving {@link Occupant} records by user id. */
export const selectOccupantByUserIdQuery = (db: DB) =>
  db.prepareQuery<[Occupant], { id: number; userid: number; spaceid: number; created_at: string }, { userid: number }>(
    'SELECT * FROM occupant WHERE userid = :userid',
  );

/** Get prepared query for retrieving {@link Occupant} records by space id. */
export const selectOccupantBySpaceIdQuery = (db: DB) =>
  db.prepareQuery<[Occupant], { id: number; userid: number; spaceid: number; created_at: string }, { spaceid: number }>(
    'SELECT * FROM occupant WHERE spaceid = :spaceid',
  );

/** Get prepared query for retrieving {@link Occupant} records by user id and space id. */
export const selectOccupantByUserAndSpaceQuery = (db: DB) =>
  db.prepareQuery<
    [Occupant],
    { id: number; userid: number; spaceid: number; created_at: string },
    { userid: number; spaceid: number }
  >(
    'SELECT * FROM occupant WHERE userid = :userid AND spaceid = :spaceid',
  );

/** Get prepared query for inserting an {@link Occupant} record. */
export const insertOccupantQuery = (db: DB) =>
  db.prepareQuery<Row, RowObject, { userid: number; spaceid: number; created_at: string }>(
    `
      INSERT INTO occupant (userid, spaceid, created_at)
      VALUES (:userid, :spaceid, :created_at)
    `,
  );

/** Get prepared query for deleting an {@link Occupant} record by id. */
export const deleteOccupantByIdQuery = (db: DB) =>
  db.prepareQuery<Row, RowObject, { id: number }>('DELETE FROM occupant WHERE id = :id');

/** Get prepared query for deleting {@link Occupant} records by user id. */
export const deleteOccupantByUserIdQuery = (db: DB) =>
  db.prepareQuery<Row, RowObject, { userid: number }>('DELETE FROM occupant WHERE userid = :userid');

/** Get prepared query for deleting {@link Occupant} records by space id. */
export const deleteOccupantBySpaceIdQuery = (db: DB) =>
  db.prepareQuery<Row, RowObject, { spaceid: number }>('DELETE FROM occupant WHERE spaceid = :spaceid');

/** Get prepared query for deleting {@link Occupant} records by user id and space id. */
export const deleteOccupantByUserAndSpaceQuery = (db: DB) =>
  db.prepareQuery<Row, RowObject, { userid: number; spaceid: number }>(
    'DELETE FROM occupant WHERE userid = :userid AND spaceid = :spaceid',
  );
