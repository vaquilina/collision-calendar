import { type SendConfig, SMTPClient } from 'denomailer';

/**
 * Send an email with the provided send config.
 * @see https://github.com/EC-Nordbund/denomailer
 * @todo remove debug options when smtp server is set up
 * @todo add hardcoded replyTo email?
 */
export const sendMail = async (sendConfig: SendConfig) => {
  const port = Deno.env.get('SMTP_PORT');
  if (!port) throw new Error('SMTP_PORT not set');

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
