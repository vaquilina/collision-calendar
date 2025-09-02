import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { user } from './user.sql.ts';

/**
 * Session table.
 * @see https://www.better-auth.com/docs/concepts/database#session
 */
export const session = sqliteTable('session', {
  /** Unique identifier for each session */
  id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
  /** The ID of the user */
  userId: integer({ mode: 'number' }).references(() => user.id),
  /** The unique session token */
  token: text(),
  /** The time when the session expires */
  expiresAt: integer({ mode: 'timestamp' }),
  /** The IP address of the device */
  ipAddress: text(),
  /** The user agent information of the device */
  userAgent: text(),
  /** Timestamp of when the session was created */
  createdAt: integer({ mode: 'timestamp' }),
  /** Timestamp of when the session was updated */
  updatedAt: integer({ mode: 'timestamp' }),
}, (t) => [
  index('session_user_idx').on(t.userId),
  index('token_idx').on(t.token),
]);
