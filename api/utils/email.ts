import { Resend } from 'resend';
import { ENV_VAR } from '@collision-calendar/db/init';

const resend = new Resend(Deno.env.get(ENV_VAR.RESEND_API_KEY));

export { resend };
