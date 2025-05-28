import { issuer } from '@openauthjs/openauth';
import { PasswordProvider } from '@openauthjs/openauth/provider/password';
import { PasswordUI } from '@openauthjs/openauth/ui/password';

import { DB } from 'sqlite';

import { selectUserByEmailQuery } from '@collision-calendar/db/queries';

import { sendMail } from '@collision-calendar/api/util';

import { subjects } from './subjects.ts';

function getUser(email: string) {
  const db = new DB(Deno.env.get('DB_PATH'), { mode: 'read' });
  const query = selectUserByEmailQuery(db);

  const userEntry = query.firstEntry({ email });
  query.finalize();
  db.close();

  if (!userEntry) return;

  return userEntry.id;
}

export default issuer({
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
      }),
    ),
  },
  subjects,
  success(ctx, value) {
    if (value.provider === 'password') {
      return ctx.subject('user', {
        userID: getUser(value.email),
      });
    }
    throw new Error('invalid provider');
  },
});
