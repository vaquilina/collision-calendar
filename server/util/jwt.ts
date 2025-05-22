/** @see https://docs.deno.com/examples/hmac_generate_verify/ */

/**
 * Secret key for HMAC.
 * @todo store this somewhere secure
 */
const secret = 'boy-what-a-secret';

const encoder = new TextEncoder();

/* Convert secret key to a UInt8Array using TextEncoder */
const keyData = encoder.encode(secret);

/* Import key into the SubtleCrypto API for HMAC operations */
const key = await crypto.subtle.importKey(
  'raw', // the format of the key
  keyData, // the key data
  { // algorithmic details
    name: 'HMAC',
    hash: { name: 'SHA-256' },
  },
  false, // whether the key is extractable
  ['sign', 'verify'], // key usages: sign & verify
);

/** The message to be authenticated. */
const message = 'Authenticate this message';

/* Convert the message to a UInt8Array */
const messageData = encoder.encode(message);

/* Generate the HMAC signature for the message */
const signature = await crypto.subtle.sign('HMAC', key, messageData);

/**
 * Function to convert ArrayBuffer to hex.
 * @remarks
 * This is for readability only. It isn't part of the generation or verification.
 */
function bufferToHex(buffer: ArrayBuffer): string {
  const byteArray = new Uint8Array(buffer);
  return Array.from(byteArray)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

/* Output the generated HMAC signature in hexadecimal format. */
console.log('Generated HMAC:', bufferToHex(signature));

/* Verify the HMAC signature. */
const isValid = await crypto.subtle.verify('HMAC', key, signature, messageData);

/* Output the verification result. */
console.log('Is the HMAC valid?', isValid);
