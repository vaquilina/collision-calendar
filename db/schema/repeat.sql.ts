import { sql } from 'drizzle-orm';
import { check, integer, sqliteTable, text, unique } from 'drizzle-orm/sqlite-core';

import { block } from './block.sql.ts';
import { timestamps } from './columns.helpers.ts';

/**
 * Repeat table.
 * @remarks
 * Represents a repeat rule for a {@link block}.
 */
export const repeat = sqliteTable('repeat', {
  /** Unique identifier for each repeat rule */
  id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
  /** Repeat */
  unit: text({ mode: 'text', enum: ['day', 'week', 'month', 'year'] }).notNull(),
  interval: integer({ mode: 'number' }).notNull(),
  start: integer({ mode: 'timestamp_ms' }).notNull(),
  end: integer({ mode: 'timestamp_ms' }).notNull(),
  blockId: integer({ mode: 'number' }).references(() => block.id, { onDelete: 'cascade' }).notNull(),
  ...timestamps,
}, (t) => [
  unique('uniq_repeat_config').on(t.unit, t.interval, t.start, t.end, t.blockId),
  check('repeat_unit_check', sql`${t.unit} IN ('day', 'week', 'month', 'year')`),
  check('repeat_start_before_end', sql`${t.start} < ${t.end}`),
]);
