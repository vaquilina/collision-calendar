import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

/**
 * User table.
 * @see https://www.better-auth.com/docs/concepts/database#user
 */
export const user = sqliteTable('user', {
  /** Unique identifier for each user */
  id: text({ mode: 'text' }).primaryKey(),
  /** User's chosen display name */
  name: text({ mode: 'text' }),
  /** User's email address for communication and login */
  email: text({ mode: 'text' }),
  /** Whether the user's email is verified */
  emailVerified: integer({ mode: 'boolean' }),
  /** Timestamp of when the user was created */
  createdAt: integer({ mode: 'timestamp' }),
  /** Timestamp of when the user was updated */
  updatedAt: integer({ mode: 'timestamp' }),
});
