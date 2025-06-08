import { Issuer } from './lib/issuer.ts';

import { ENV_VAR, initEnv } from '@collision-calendar/db/init';

initEnv();

const port_number = Number(Deno.env.get(ENV_VAR.AUTH_PORT));

Deno.serve({ port: !Number.isNaN(port_number) ? port_number : 3001 }, Issuer.fetch);
