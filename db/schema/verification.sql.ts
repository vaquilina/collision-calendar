import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

/**
 * Verification table.
 * @see https://www.better-auth.com/docs/concepts/database#verification
 */
export const verification = sqliteTable('verification', {
  /** Unique identifier for each verification */
  id: text().primaryKey(),
  /** The identifier for the verification request */
  identifier: text(),
  /** The value to be verified */
  value: text(),
  /** The time when the verification request expires */
  expiresAt: integer({ mode: 'timestamp' }),
  /** Timestamp of when the verification request was created */
  createdAt: integer({ mode: 'timestamp' }),
  /** Timestamp of when the verification request was updated */
  updatedAt: integer({ mode: 'timestamp' }),
});
