import type { DB } from 'sqlite';
import type { Calendar } from '../classes/calendar.ts';

/** Get prepared query for retrieving {@link Calendar} records by ID. */
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
