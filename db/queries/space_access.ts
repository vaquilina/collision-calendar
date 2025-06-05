import type { DB } from 'sqlite';
import type { SpaceAccess } from '../classes/space_access.ts';
import type { AccessPermissions } from '@collision-calendar/types';

/** Get prepared query for retrieving {@link SpaceAccess} records. */
export const selectSpaceAccessQuery = (db: DB) =>
  db.prepareQuery<
    [SpaceAccess],
    { spaceid: number; userid: number },
    { spaceid: number; permissions: AccessPermissions }
  >(
    `
  SELECT spaceid, userid,
    FROM space_access
   WHERE spaceid = :spaceid AND permissions = :permissions
  `,
  );
