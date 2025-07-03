import { createClient } from '@openauthjs/openauth/client';

import { ENV_VAR } from '@collision-calendar/db/init';

const auth_port_env_var = Number(Deno.env.get(ENV_VAR.AUTH_PORT));
const auth_port = !Number.isNaN(auth_port_env_var) ? auth_port_env_var : 3001;

export const authClient = createClient({
  clientID: 'collision-calendar-web',
  issuer: `http://localhost:${auth_port}`, // change
});
