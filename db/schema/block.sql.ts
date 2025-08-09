import { sql } from 'drizzle-orm';
import { check, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { space } from './space.sql.ts';
import { timestamps } from './columns.helpers.ts';

/**
 * Block table.
 * @remarks
 * Represents a block of time during which a {@link space} will be occupied.
 */
export const block = sqliteTable('block', {
  /** Unique identifier for each block */
  id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
  /** The name of the block */
  name: text({ mode: 'text' }),
  /** The color of the block */
  color: text({ mode: 'text' }).notNull(),
  /** The timestamp for when the block starts */
  start: integer({ mode: 'timestamp_ms' }).notNull(),
  /** The timestamp for when the block ends */
  end: integer({ mode: 'timestamp_ms' }).notNull(),
  /** The ID of the {@link space} */
  spaceId: integer({ mode: 'number' }).references(() => space.id).notNull(),
  ...timestamps,
}, (t) => [
  check('start_before_end', sql`${t.start} < ${t.end}`),
]);
