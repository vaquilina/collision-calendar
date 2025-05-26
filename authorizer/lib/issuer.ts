import { issuer } from '@openauthjs/openauth';
import { PasswordProvider } from '@openauthjs/openauth/provider/password';
import { PasswordUI } from '@openauthjs/openauth/ui/password';

import { DB } from 'sqlite';

import { processEntry } from '@collision-calendar/db/util';
import { selectUserByEmailQuery } from '@collision-calendar/db/queries';
import { User } from '@collision-calendar/db/classes';

import { subjects } from './subjects.ts';

async function getUser(email: string) {
  const db = new DB(Deno.env.get('DB_PATH'), { mode: 'read' });
  const query = selectUserByEmailQuery(db);

  const entry = query.firstEntry({ email });
  query.finalize();
  db.close();

  if (!entry) return;

  const user = new User(processEntry(entry));
  return user.id;
}

export default issuer({
  providers: {
    password: PasswordProvider(
      PasswordUI({
        copy: {
          error_email_taken: 'This email is already taken.',
        },
        sendCode: async (email, code) => {
          console.log(email, code);
        },
      }),
    ),
  },
  subjects,
  async success(ctx, value) {
    if (value.provider === 'password') {
      return ctx.subject('user', {
        userID: await getUser(value.email),
      });
    }
    throw new Error('invalid provider');
  },
});
