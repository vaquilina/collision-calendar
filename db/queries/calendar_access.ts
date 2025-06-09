import type { DB } from 'sqlite';
import type { CalendarAccess } from '../classes/calendar_access.ts';
import type { AccessPermissions } from '@collision-calendar/types';

/** Get prepared query for retrieving {@link CalendarAccess} entries. */
export const selectCalendarAccessQuery = (db: DB) =>
  db.prepareQuery<
    [CalendarAccess],
    { calendarid: number; userid: number },
    { calendarid: number; permissions: AccessPermissions }
  >(`
  SELECT calendarid, userid
    FROM calendar_access
   WHERE calendarid = :calendarid AND permissions = :permissions
  `);
