import { sql } from 'drizzle-orm';
import { check, integer, sqliteTable, text, unique } from 'drizzle-orm/sqlite-core';

import { calendar } from './calendar.sql.ts';
import { user } from './user.sql.ts';
import { timestamps } from './columns.helpers.ts';

import type { AccessPermissions as _AccessPermissions } from '@collision-calendar/types';

/**
 * CalendarAccess table.
 * @remarks
 * Represents the {@link _AccessPermissions access permissions} a {@link user} has for a {@link calendar}.
 */
export const calendarAccess = sqliteTable('calendar_access', {
  /** Unique identifier for each calendar access record. */
  id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
  /** The id of the {@link calendar} */
  calendarId: integer({ mode: 'number' }).references(() => calendar.id, { onDelete: 'cascade' }).notNull(),
  /** The id of the {@link user} */
  userId: text({ mode: 'text' }).references(() => user.id, { onDelete: 'cascade' }).notNull(),
  /** The {@link _AccessPermissions} code */
  permissions: integer({ mode: 'number' }).notNull(),
  ...timestamps,
}, (t) => [
  unique('uniq_calendar_access').on(t.calendarId, t.userId),
  check('perm_check1', sql`${t.permissions} = 100 OR ${t.permissions} = 110 OR ${t.permissions} = 111`),
]);
