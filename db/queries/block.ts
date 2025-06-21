import type { DB, Row, RowObject } from 'sqlite';
import type { Block } from '../classes/block.ts';

/** Get prepared query for retrieving {@link Block} records by id. */
export const selectBlockByIdQuery = (db: DB) =>
  db.prepareQuery<
    [Block],
    { id: number; name: string; color: string; start: string; end: string; spaceid: number; created_at: string },
    { id: number }
  >(
    'SELECT * FROM block WHERE id = :id',
  );

/** Get prepared query for retrieving {@link Block} records by space id. */
export const selectBlockBySpaceIdQuery = (db: DB) =>
  db.prepareQuery<
    [Block],
    { id: number; name: string; color: string; start: string; end: string; spaceid: number; created_at: string },
    { spaceid: number }
  >(
    'SELECT * FROM block WHERE spaceid = :spaceid',
  );

/** Get prepared query for inserting {@link Block} records. */
export const insertBlockQuery = (db: DB) =>
  db.prepareQuery<
    Row,
    RowObject,
    { name: string; color: string; start: string; end: string; spaceid: number; created_at: string }
  >(
    `
      INSERT INTO block (name, color, start, end, spaceid, created_at)
      VALUES (:name, :color, :start, :end, :spaceid, :created_at)
    `,
  );

/** Get prepared query for updating the `name` field of a {@link Block} record. */
export const updateBlockNameQuery = (db: DB) =>
  db.prepareQuery<Row, RowObject, { name: string; id: number }>(
    `
      UPDATE block
         SET name = :name
       WHERE id = :id
    `,
  );

/** Get prepared query for updating the `color` field of a {@link Block} record. */
export const updateBlockColorQuery = (db: DB) =>
  db.prepareQuery<Row, RowObject, { color: string; id: number }>(
    `
      UPDATE block
         SET color = :color
       WHERE id = :id
    `,
  );

/** Get prepared query for updating the `start` and `end` fields of a {@link Block} record. */
export const updateBlockTimeQuery = (db: DB) =>
  db.prepareQuery<Row, RowObject, { start: string; end: string; id: number }>(
    `
      UPDATE block
         SET start = :start, end = :end
       WHERE id = :id
    `,
  );

/** Get prepared query for deleting a {@link Block} record. */
export const deleteBlockByIdQuery = (db: DB) =>
  db.prepareQuery<Row, RowObject, { id: number }>(
    'DELETE FROM block WHERE id = :id',
  );

/** Get prepared query for deleting {@link Block} records by space id. */
export const deleteBlockBySpaceIdQuery = (db: DB) =>
  db.prepareQuery<Row, RowObject, { spaceid: number }>(
    'DELETE FROM block WHERE spaceid = :spaceid',
  );
