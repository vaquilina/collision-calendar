import { DB } from 'sqlite';

import type { SpaceAccess } from '../classes/space_access.ts';
import type { AccessPermissions } from '../../../types/types.ts';

/** Get prepared query for retrieving {@link SpaceAccess} records. */
export const selectSpaceAccessQuery = (db: DB) =>
  db.prepareQuery<
    [SpaceAccess],
    { space_id: number; user_id: number },
    { space_id: number; permissions: AccessPermissions }
  >(
    `
  SELECT space_id, user_id,
    FROM space_access
   WHERE space_id = :space_id AND permissions = :permissions
  `,
  );
