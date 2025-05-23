import { sign, verify } from 'hono/jwt';

import type { User } from '../db/classes/user.ts';

/**
 * Get a signed auth token.
 * @remarks
 * If the `JWT_SECRET` environment variable is not set, this function returns an emtpy string.
 */
export const getAuthToken = async (user: User) => {
  const payload = {
    /** **Payload Validation:** Time at which the token was issued. */
    iat: Date.now(),
    /** **Payload Validation:** Token expires in 15 minutes. */
    exp: Math.floor(Date.now() / 1000) + 60 * 15,
    /** The user's name. */
    name: user.name,
    /**
     * Whether the user is an admin.
     * @todo hard-code superuser
     */
    admin: false,
  };

  const secret = Deno.env.get('JWT_SECRET');
  if (!secret) return '';

  return await sign(payload, secret);
};

/**
 * Verify that an auth token is genuine and still valid.
 * @remarks
 * If the token passes verification, the decoded JWT payload is returned.
 */
export const verifyAuthToken = async (token: string) => {
  const secret = Deno.env.get('JWT_SECRET');
  if (!secret) return;

  return await verify(token, secret);
};
