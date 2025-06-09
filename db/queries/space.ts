import type { DB, Row, RowObject } from 'sqlite';
import type { Space } from '../classes/space.ts';

/** Get prepared query for retrieving a {@link Space} record by id. */
export const selectSpaceByIdQuery = (db: DB) =>
  db.prepareQuery<
    [Space],
    { id: number; name: string; calendarid: number; created_at: string },
    { id: number }
  >('SELECT * FROM space WHERE id = :id');

/** Get prepared query for retrieving {@link Space} records by calendar id. */
export const selectSpaceByCalendarIdQuery = (db: DB) =>
  db.prepareQuery<
    [Space],
    { id: number; name: string; calendarid: number; created_at: string },
    { calendarid: number }
  >('SELECT * FROM space WHERE calendarid = :calendarid');

/** Get prepared query for inserting a {@link Space} record. */
export const insertSpaceQuery = (db: DB) =>
  db.prepareQuery<Row, RowObject, { name: string; calendarid: number; created_at: string }>(
    `
      INSERT INTO space (name, calendarid, created_at)
      VALUES (:name, :calendarid, :created_at)
    `,
  );

/** Get prepared query for updating the `name` field of a {@link Space} record. */
export const updateSpaceNameQuery = (db: DB) =>
  db.prepareQuery<Row, RowObject, { name: string; id: number }>(
    `
      UPDATE space
         SET name = :name
       WHERE id = :id
    `,
  );

/** Get prepared query for deleting a {@link Space} record by id. */
export const deleteSpaceQuery = (db: DB) =>
  db.prepareQuery<Row, RowObject, { id: number }>(' DELETE FROM space WHERE id = :id');
