import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { user } from './user.sql.ts';
import { timestamps } from './columns.helpers.ts';

/**
 * Calendar table.
 * @remarks
 * Represents a top-level calendar container.
 */
export const calendar = sqliteTable('calendar', {
  /** Unique identifier for each calendar */
  id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
  /** The name of the calendar */
  name: text({ mode: 'text' }).notNull(),
  /** The id of the {@link user} that owns the calendar */
  ownerUserId: text({ mode: 'text' }).references(() => user.id, { onDelete: 'cascade' }).notNull(),
  ...timestamps,
});
