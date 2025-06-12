import type { DB, Row, RowObject } from 'sqlite';
import type { Calendar } from '../classes/calendar.ts';

/** Get prepared query for retrieving a {@link Calendar} record by ID. */
export const selectCalendarByIdQuery = (db: DB) =>
  db.prepareQuery<
    [Calendar],
    { id: number; name: string; owneruserid: number; created_at: string },
    { id: number }
  >('SELECT * FROM calendar WHERE id = :id');

/** Get prepared query for retrieving {@link Calendar} records by owner user ID. */
export const selectCalendarByOwnerUserIdQuery = (db: DB) =>
  db.prepareQuery<
    [Calendar],
    { id: number; name: string; owneruserid: number; created_at: string },
    { owneruserid: number }
  >('SELECT * FROM calendar WHERE owneruserid = :owneruserid');

/** Get prepared query for inserting a {@link Calendar} record. */
export const insertCalendarQuery = (db: DB) =>
  db.prepareQuery<Row, RowObject, { name: string; owneruserid: number; created_at: string }>(
    `
      INSERT INTO calendar (name, owneruserid, created_at)
      VALUES (:name, :owneruserid, :created_at)
    `,
  );

/** Get prepared query for updating the `name` field of a {@link Calendar} record. */
export const updateCalendarNameQuery = (db: DB) =>
  db.prepareQuery<Row, RowObject, { name: string; id: number }>(
    `
      UPDATE calendar
         SET name = :name
       WHERE id = :id
    `,
  );

/** Get prepared query for updating the `owneruserid` field of a {@link Calendar} record. */
export const updateCalendarOwnerUserIdQuery = (db: DB) =>
  db.prepareQuery<Row, RowObject, { owneruserid: number; id: number }>(
    `
      UPDATE calendar
         SET owneruserid = :owneruserid
       WHERE id = :id
    `,
  );

/** Get prepared query for deleting a {@link Calendar} record by id. */
export const deleteCalendarByIdQuery = (db: DB) =>
  db.prepareQuery<Row, RowObject, { id: number }>('DELETE FROM calendar WHERE id = :id');
