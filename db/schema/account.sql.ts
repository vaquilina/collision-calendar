import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { user } from './user.sql.ts';
import { timestamps } from './columns.helpers.ts';

/**
 * Account table.
 * @see https://www.better-auth.com/docs/concepts/database#account
 */
export const account = sqliteTable('account', {
  /** Unique identifier for each account */
  id: text().primaryKey(),
  /** The ID of the user */
  userId: text().references(() => user.id),
  /** The ID of the account as provided by the SSO or equal to userId for credential accounts */
  accountId: text(),
  /** The ID of the provider */
  providerId: text(),
  /** The access token of the account. Returned by the provider */
  accessToken: text(),
  /** The refresh token of the account. Returned by the provider */
  refreshToken: text(),
  /** The time when the access token expires */
  accessTokenExpiresAt: integer({ mode: 'timestamp' }),
  /** The time when the refresh token expires */
  refreshTokenExpiresAt: integer({ mode: 'timestamp' }),
  /** The scope of the account. Returned by the provider */
  scope: text(),
  /** The ID token returned from the provider */
  idToken: text(),
  /** The password of the account. Mainly used for email and password authentication */
  password: text(),
  ...timestamps,
});
