import type { DB, Row, RowObject } from 'sqlite';
import type { SpaceAccess } from '../classes/space_access.ts';
import type { AccessPermissions } from '@collision-calendar/types';

/** Get prepared query for retrieving {@link SpaceAccess} entries. */
export const selectSpaceAccessByIdAndPermissionsQuery = (db: DB) =>
  db.prepareQuery<
    [SpaceAccess],
    { spaceid: number; userid: number },
    { spaceid: number; permissions: AccessPermissions }
  >(
    `
      SELECT spaceid, userid
        FROM space_access
       WHERE spaceid = :spaceid
         AND permissions = :permissions
    `,
  );

/** Get prepared query for inserting a {@link SpaceAccess} record. */
export const insertSpaceAccessQuery = (db: DB) =>
  db.prepareQuery<
    Row,
    RowObject,
    { spaceid: number; userid: number; permissions: AccessPermissions; created_at: string }
  >(
    `
      INSERT INTO calendar_access (spaceid, userid, permissions, created_at)
      VALUES (:spaceid, :userid, :permissions, :created_at)
    `,
  );

/** Get prepared query for updating the `permissions` field of a {@link SpaceAccess} record. */
export const updateSpaceAccessPermissionsQuery = (db: DB) =>
  db.prepareQuery<Row, RowObject, { permissions: AccessPermissions; userid: number; spaceid: number }>(
    `
      UPDATE space_acess
         SET permissions = :permissions
       WHERE userid = :userid
         AND spaceid = :spaceid
    `,
  );

export const deleteSpaceAccessByIdQuery = (db: DB) =>
  db.prepareQuery<Row, RowObject, { id: number }>(
    `
      DELETE FROM space_access
       WHERE id = :id
    `,
  );

export const deleteSpaceAccessByUserAndSpaceQuery = (db: DB) =>
  db.prepareQuery<Row, RowObject, { userid: number; spaceid: number }>(
    `
      DELETE FROM space_access
       WHERE userid = :userid
         AND spaceid = :spaceid
    `,
  );
