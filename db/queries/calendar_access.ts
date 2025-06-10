import type { DB, Row, RowObject } from 'sqlite';
import type { CalendarAccess } from '../classes/calendar_access.ts';
import type { AccessPermissions } from '@collision-calendar/types';

/** Get prepared query for retrieving {@link CalendarAccess} entries. */
export const selectCalendarAccessQuery = (db: DB) =>
  db.prepareQuery<
    [CalendarAccess],
    { calendarid: number; userid: number },
    { calendarid: number; permissions: AccessPermissions }
  >(
    `
      SELECT calendarid, userid
        FROM calendar_access
       WHERE calendarid = :calendarid
         AND permissions = :permissions
    `,
  );

/** Get prepared query for inserting a {@link CalendarAccess} record. */
export const insertCalendarAccessQuery = (db: DB) =>
  db.prepareQuery<
    Row,
    RowObject,
    { calendarid: number; userid: number; permissions: AccessPermissions; created_at: string }
  >(
    `
      INSERT INTO calendar_access (calendarid, userid, permissions, created_at)
      VALUES (:calendarid, :userid, :permissions, :created_at)
    `,
  );

/** Get prepared query for updating the `permissions` field of a {@link CalendarAccess} record. */
export const updateCalendarAccessPermissionsQuery = (db: DB) =>
  db.prepareQuery<Row, RowObject, { permissions: AccessPermissions; calendarid: number; userid: number }>(
    `
      UPDATE calendar_access
         SET permissions = :permissions
       WHERE calendarid = :calendarid
         AND userid = :userid
    `,
  );

/** Get prepared query for deleting a {@link CalendarAccess} record by id. */
export const deleteCalendarAccessByIdQuery = (db: DB) =>
  db.prepareQuery<Row, RowObject, { id: number }>(
    `
      DELETE FROM calendar_access
       WHERE id = :id
    `,
  );

/** Get prepared query for deleting {@link CalendarAccess} records by user id and calendar id. */
export const deleteCalendarAccessByUserAndCalendarQuery = (db: DB) =>
  db.prepareQuery<Row, RowObject, { userid: number; calendarid: number }>(
    `
      DELETE FROM calendar_access
       WHERE userid = :userid
         AND calendarid = :calendarid
    `,
  );
