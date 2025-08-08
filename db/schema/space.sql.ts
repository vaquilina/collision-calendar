import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { calendar } from './calendar.sql.ts';
import { timestamps } from './columns.helpers.ts';

/**
 * Space table.
 * @remarks
 * Represents a space within a {@link calendar}.
 */
export const space = sqliteTable('space', {
  /** Unique identifier for each space */
  id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
  /** The name of the space */
  name: text({ mode: 'text' }).notNull(),
  /** The id of the {@link calendar} the space belongs to */
  calendarId: integer({ mode: 'number' }).references(() => calendar.id, { onDelete: 'cascade' }).notNull(),
  ...timestamps,
});
