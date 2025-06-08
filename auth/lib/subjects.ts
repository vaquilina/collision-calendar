import { createSubjects } from '@openauthjs/openauth/subject';

import { z } from 'zod/v4';

/**
 * Defines what the access token generated at the end of the auth flow will map to.
 * @see https://openauth.js.org/docs/subject/
 */
export const subjects = createSubjects({
  user: z.object({
    userID: z.int().optional(),
  }),
});
