import { integer, sqliteTable, unique } from 'drizzle-orm/sqlite-core';

import { space } from './space.sql.ts';
import { timestamps } from './columns.helpers.ts';

/**
 * Collision table.
 * @remarks
 * Represents a relationship between two {@link space spaces} that cannot have block overlap.
 */
export const collision = sqliteTable('collision', {
  /** Unique identifier for each collision */
  id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
  /** First {@link space} in the relation */
  spaceid_l: integer({ mode: 'number' }).references(() => space.id, { onDelete: 'cascade' }).notNull(),
  /** Second {@link space} in the relation */
  spaceid_r: integer({ mode: 'number' }).references(() => space.id, { onDelete: 'cascade' }).notNull(),
  ...timestamps,
}, (t) => [
  unique('uniq_collision').on(t.spaceid_l, t.spaceid_r),
]);
