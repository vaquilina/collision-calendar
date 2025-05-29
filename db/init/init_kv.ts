import { createStorage } from 'unstorage';
import denoKVdriver from 'unstorage/drivers/deno-kv';
import type denoKVtypes from 'unstorage/drivers/deno-kv';

/**
 * workaround until the library exports types properly
 * @see https://docs.deno.com/runtime/fundamentals/node/#importing-types
 */
const driver = denoKVdriver as unknown as typeof denoKVtypes.default;

/** Initialize KV storage wrapper. */
export const initKV = () => createStorage({ driver: driver({}) });
