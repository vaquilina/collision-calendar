import { integer, sqliteTable, text, unique } from 'drizzle-orm/sqlite-core';

import { space } from './space.sql.ts';
import { user } from './user.sql.ts';
import { timestamps } from './columns.helpers.ts';

/**
 * Occupant table.
 * @remarks
 * Represents a {@link user} who occupies a {@link space}.
 */
export const occupant = sqliteTable('occupant', {
  /** Unique identifier for each occupant */
  id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
  /** The id of the {@link user} */
  userId: text({ mode: 'text' }).references(() => user.id, { onDelete: 'cascade' }).notNull(),
  /** The id of the {@link space} */
  spaceId: integer({ mode: 'number' }).references(() => space.id, { onDelete: 'cascade' }).notNull(),
  ...timestamps,
}, (t) => [
  unique('uniq_occupant').on(t.userId, t.spaceId),
]);
