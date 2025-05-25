import { createStorage } from 'unstorage';
import denoKVdriver from 'unstorage/drivers/deno-kv';

export const storage = createStorage({
  driver: denoKVdriver({}),
});
