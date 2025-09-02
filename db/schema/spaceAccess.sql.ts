import { sql } from 'drizzle-orm';
import { check, integer, sqliteTable, unique } from 'drizzle-orm/sqlite-core';

import { space } from './space.sql.ts';
import { user } from './user.sql.ts';
import { timestamps } from './columns.helpers.ts';

import type { AccessPermissions as _AccessPermissions } from '@collision-calendar/types';

/**
 * SpaceAccess table.
 * @remarks
 * Represents the {@link _AccessPermissions access permissions} a {@link user} has for a {@link space}.
 */
export const spaceAccess = sqliteTable('space_access', {
  /** Unique identifier for each space access record */
  id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
  /** The id of the {@link user} */
  userId: integer({ mode: 'number' }).references(() => user.id, { onDelete: 'cascade' }).notNull(),
  /** The id of the {@link space} */
  spaceId: integer({ mode: 'number' }).references(() => space.id, { onDelete: 'cascade' }).notNull(),
  /** The {@link _AccessPermissions} code */
  permissions: integer({ mode: 'number' }).notNull(),
  ...timestamps,
}, (t) => [
  unique('uniq_space_access').on(t.userId, t.spaceId),
  check('perm_check2', sql`${t.permissions} = 100 OR ${t.permissions} OR 110 OR ${t.permissions} = 111`),
]);
