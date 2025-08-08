import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';

import { db } from '@collision-calendar/db/init';

const timestamp_fields = {
  createdAt: 'created_at',
  updatedAt: 'updated_at',
};

/** better-auth instance. */
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'sqlite',
  }),
  user: {
    modelName: 'user',
    fields: {
      name: 'name',
      email: 'email',
      emailVerified: 'email_verified',
      ...timestamp_fields,
    },
  },
  session: {
    modelName: 'session',
    fields: {
      userId: 'user_id',
      token: 'token',
      ipAddress: 'ip_address',
      userAgent: 'user_agent',
      expiresAt: 'expires_at',
      ...timestamp_fields,
    },
  },
  account: {
    modelName: 'account',
    fields: {
      userId: 'user_id',
      accessToken: 'access_token',
      refreshToken: 'refresh_token',
      accessTokenExpiresAt: 'access_token_expires_at',
      refreshTokenExpiresAt: 'refresh_token_expires_at',
      accountId: 'account_id',
      providerId: 'provider_id',
      idToken: 'id_token',
      password: 'password',
      scope: 'scope',
      ...timestamp_fields,
    },
  },
  verification: {
    modelName: 'verification',
    fields: {
      identifier: 'identifier',
      value: 'value',
      expiresAt: 'expires_at',
      ...timestamp_fields,
    },
  },
});
