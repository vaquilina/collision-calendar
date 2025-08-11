import { type SendConfig, SMTPClient } from 'denomailer';

import { ENV_VAR } from '@collision-calendar/db/init';

/**
 * Send an email with the provided send config.
 * @see https://github.com/EC-Nordbund/denomailer
 * @todo remove debug options when smtp server is set up
 * @todo add hardcoded replyTo email?
 */
export const sendMail = async (sendConfig: SendConfig) => {
  const port = Deno.env.get(ENV_VAR.SMTP_PORT);
  if (!port) throw new Error('SMTP port not set');

  const client = new SMTPClient({
    /* TODO: remove this */
    debug: {
      allowUnsecure: true,
    },
    connection: {
      hostname: 'localhost', // replace
      port: Number.parseInt(port),
      // tls: true,
      // auth: {
      //  username: "example",
      //  password: "password"
      // }
    },
  });

  await client.send(sendConfig);

  await client.close();
};
