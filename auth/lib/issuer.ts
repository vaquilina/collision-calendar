import { issuer } from '@openauthjs/openauth';
import { PasswordProvider } from '@openauthjs/openauth/provider/password';
import { PasswordUI } from '@openauthjs/openauth/ui/password';

import denoKVdriver from 'unstorage/drivers/deno-kv';
import type denoKVtypes from 'unstorage/drivers/deno-kv';

import { DB } from 'sqlite';

import { selectUserByEmailQuery } from '@collision-calendar/db/queries';
import type { User as _User } from '@collision-calendar/db/classes';
import { ENV_VAR } from '@collision-calendar/db/init';

import { sendMail } from '@collision-calendar/api/util';

import { subjects } from './subjects.ts';
import { Unstorage } from './storage_adapter.ts';

/**
 * Workaround until the library exports types for `moduleResolution: node16`.
 * @see https://docs.deno.com/runtime/fundamentals/node/#importing-types
 */
const driver = denoKVdriver as unknown as typeof denoKVtypes.default;

const storage = Unstorage({ driver: driver({}) });

/** {@link _User User} lookup function. */
function getUser(email: string) {
  const db = new DB(Deno.env.get(ENV_VAR.DB_PATH), { mode: 'read' });
  const query = selectUserByEmailQuery(db);

  const userEntry = query.firstEntry({ email });
  query.finalize();
  db.close();

  if (!userEntry) return;

  return userEntry.id;
}

/**
 * OpenAuth Issuer.
 * @see https://openauth.js.org/docs/issuer/
 */
export const Issuer = issuer({
  providers: {
    password: PasswordProvider(
      PasswordUI({
        copy: {
          error_email_taken: 'This email is already taken.',
        },
        sendCode: async (email, code) => {
          await sendMail({
            from: 'Collision Calendar',
            to: email,
            subject: 'password reset code',
            content: `Your password reset confirmation code is ${code}`,
          });
        },
        validatePassword: (password) => password.length < 8 ? 'Password must be at least 8 characters' : undefined,
      }),
    ),
  },
  subjects,
  success(ctx, value) {
    if (value.provider === 'password') {
      return ctx.subject('user', {
        userid: getUser(value.email),
      });
    }
    throw new Error('invalid provider');
  },
  storage,
});
