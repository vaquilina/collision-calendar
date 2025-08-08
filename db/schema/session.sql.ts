import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { user } from './user.sql.ts';
import { timestamps } from './columns.helpers.ts';

/**
 * Session table.
 * @see https://www.better-auth.com/docs/concepts/database#session
 */
export const session = sqliteTable('session', {
  /** Unique identifier for each session */
  id: text().primaryKey(),
  /** The ID of the user */
  userId: text().references(() => user.id),
  /** The unique session token */
  token: text(),
  /** The time when the session expires */
  expiresAt: integer({ mode: 'timestamp' }),
  /** The IP address of the device */
  ipAddress: text(),
  /** The user agent information of the device */
  userAgent: text(),
  ...timestamps,
});
