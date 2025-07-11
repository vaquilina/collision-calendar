import { createSubjects } from '@openauthjs/openauth/subject';

import * as z from 'zod';

/**
 * Defines what the access token generated at the end of the auth flow will map to.
 * @see https://openauth.js.org/docs/subject/
 */
export const subjects = createSubjects({
  user: z.object({
    userid: z.int().optional(),
  }),
});
