import type { DB, Row, RowObject } from 'sqlite';
import type { Repeat } from '../classes/repeat.ts';
import type { RepeatUnit } from '@collision-calendar/types';

/** Get prepared query for retrieving a {@link Repeat} record by id. */
export const selectRepeatByIdQuery = (db: DB) =>
  db.prepareQuery<
    [Repeat],
    { id: number; unit: RepeatUnit; interval: number; start: string; end: string; blockid: number; created_at: string },
    { id: number }
  >('SELECT * FROM repeat WHERE id = :id');

/** Get prepared query for retrieving {@link Repeat} records by block id. */
export const selectRepeatByBlockIdQuery = (db: DB) =>
  db.prepareQuery<
    [Repeat],
    { id: number; unit: RepeatUnit; interval: number; start: string; end: string; blockid: number; created_at: string },
    { blockid: number }
  >('SELECT * FROM repeat WHERE blockid = :blockid');

/** Get prepated query for inserting a {@link Repeat} record. */
export const insertRepeatQuery = (db: DB) =>
  db.prepareQuery<
    Row,
    RowObject,
    { unit: RepeatUnit; interval: number; start: string; end: string; blockid: number; created_at: string }
  >(
    `
      INSERT INTO repeat (unit, interval, start, end, blockid, created_at)
      VALUES (:unit, :interval, :start, :end, :blockid, :created_at)
    `,
  );

/** Get prepared query for deleting a {@link Repeat} record by id. */
export const deleteRepeatByIdQuery = (db: DB) =>
  db.prepareQuery<Row, RowObject, { id: number }>('DELETE FROM repeat WHERE id = :id');

/** Get prepared query for deleting {@link Repeat} records by block id. */
export const deleteRepeatByBlockIdQuery = (db: DB) =>
  db.prepareQuery<Row, RowObject, { blockid: number }>('DELETE FROM repeat WHERE blockid = :blockid');
