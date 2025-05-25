import { issuer } from '@openauthjs/openauth';
import { PasswordProvider } from '@openauthjs/openauth/provider/password';
import { PasswordUI } from '@openauthjs/openauth/ui/password';

import { subjects } from './subjects.ts';

const app = issuer({
  providers: {
    password: PasswordProvider(
      PasswordUI({
        sendCode: async (email, code) => {
          console.log(email, code);
        },
      }),
    ),
  },
  subjects,
  async success(ctx, value) {
    let userID;
    if (value.provider === 'password') {
      console.log(value.email);
      userID = 0; // look up user or create them
    }
    return ctx.subject('user', { userID });
  },
});
