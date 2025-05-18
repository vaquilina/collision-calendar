import { DB } from 'sqlite';
import type { CalendarAccess } from '../classes/calendar_access.ts';
import type { AccessPermissions } from '../../../types/types.ts';

/** Get prepared query for retrieving {@link CalendarAccess} records. */
export const selectCalendarAccessQuery = (db: DB) =>
  db.prepareQuery<
    [CalendarAccess],
    { calendar_id: number; user_id: number },
    { calendar_id: number; permissions: AccessPermissions }
  >(`
  SELECT calendar_id, user_id
    FROM calendar_access
   WHERE calendar_id = :calendar_id AND permissions = :permissions
  `);
