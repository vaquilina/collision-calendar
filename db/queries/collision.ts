import type { DB, Row, RowObject } from 'sqlite';
import type { Collision } from '../classes/collision.ts';

/** Get prepared query for retrieving a {@link Collision} record by id. */
export const selectCollisionByIdQuery = (db: DB) =>
  db.prepareQuery<
    [Collision],
    { id: number; spaceid_l: number; spaceid_r: number; created_at: string },
    { id: number }
  >('SELECT * FROM collision WHERE id = :id');

/**
 * Get prepared query for retrieving {@link Collision} records by space id.
 * @remarks
 * This query returns rows where the provided space id matches either space.
 */
export const selectCollisionBySpaceIdQuery = (db: DB) =>
  db.prepareQuery<
    [Collision],
    { id: number; spaceid_l: number; spaceid_r: number; created_at: string },
    { spaceid: number }
  >('SELECT * FROM collision WHERE spaceid_l = :spaceid OR spaceid_r = :spaceid');

/**
 * Get prepared query for retrieving {@link Collision} records by space ids.
 * @remarks
 * This query returns rows where the provided space ids match both spaces.
 */
export const selectCollisionBySpaceIdsQuery = (db: DB) =>
  db.prepareQuery<
    [Collision],
    { id: number; spaceid_l: number; spaceid_r: number; created_at: string },
    { spaceid_1: number; spaceid_2: number }
  >(
    `
     SELECT * FROM collision
      WHERE (spaceid_l = :spaceid_1 OR spaceid_l = :spaceid_2)
        AND (spaceid_r = :spaceid_1 OR spaceid_r = :spaceid_2)
    `,
  );

/** Get prepared query for inserting a {@link Collision} record. */
export const insertCollisionQuery = (db: DB) =>
  db.prepareQuery<Row, RowObject, { spaceid_l: number; spaceid_r: number; created_at: string }>(
    `
      INSERT INTO collision (spaceid_l, spaceid_r, created_at)
      VALUES (:spaceid_l, :spaceid_r, :created_at)
    `,
  );

/** Get prepared query for deleting a {@link Collision} record by id. */
export const deleteCollisionByIdQuery = (db: DB) =>
  db.prepareQuery<Row, RowObject, { id: number }>('DELETE FROM collision WHERE id = :id');

/**
 * Get prepared query for deleting {@link Collision} records by space id.
 * @remarks
 * This query deletes rows where the provided space id matches either space.
 */
export const deleteCollisionBySpaceIdQuery = (db: DB) =>
  db.prepareQuery<Row, RowObject, { spaceid: number }>(
    `
      DELETE FROM collision
       WHERE spaceid_l = :spaceid
          OR spaceid_r = :spaceid
    `,
  );
