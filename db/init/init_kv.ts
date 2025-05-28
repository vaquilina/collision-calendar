import { createStorage } from 'unstorage';
import denoKVdriver from 'unstorage/drivers/deno-kv';
import type denoKVtypes from 'unstorage/drivers/deno-kv';

/** workaround until the library exposes the types properly */
const driver = denoKVdriver as unknown as typeof denoKVtypes.default;

export const storage = createStorage({
  driver: driver({}),
});
