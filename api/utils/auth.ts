import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { haveIBeenPwned, openAPI } from 'better-auth/plugins';

import { db } from '@collision-calendar/db/init';

import { account, session, user, verification } from '@collision-calendar/db/schema';

const timestamp_fields = {
  createdAt: 'created_at',
  updatedAt: 'updated_at',
};

/** better-auth instance. */
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'sqlite',
    schema: { account, session, user, verification },
  }),
  trustedOrigins: ['http://localhost:5173'],
  plugins: [
    haveIBeenPwned({
      customPasswordCompromisedMessage: 'Please choose a more secure password.',
    }),
    openAPI(),
  ],
  logger: {
    disabled: false,
    level: 'debug',
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  user: {
    modelName: 'user',
    fields: {
      emailVerified: 'email_verified',
      ...timestamp_fields,
    },
  },
  session: {
    modelName: 'session',
    fields: {
      userId: 'user_id',
      ipAddress: 'ip_address',
      userAgent: 'user_agent',
      expiresAt: 'expires_at',
      ...timestamp_fields,
    },
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // Cache duration in seconds
    },
  },
  account: {
    modelName: 'account',
    fields: {
      userId: 'user_id',
      accountId: 'account_id',
      providerId: 'provider_id',
      accessToken: 'access_token',
      refreshToken: 'refresh_token',
      accessTokenExpiresAt: 'access_token_expires_at',
      refreshTokenExpiresAt: 'refresh_token_expires_at',
      idToken: 'id_token',
      ...timestamp_fields,
    },
  },
  verification: {
    modelName: 'verification',
    fields: {
      expiresAt: 'expires_at',
      ...timestamp_fields,
    },
  },
  advanced: {
    database: {
      generateId: false,
    },
  },
});

export type AuthType = {
  user: typeof auth.$Infer.Session.user | null;
  session: typeof auth.$Infer.Session.session | null;
};
