import { joinKey, splitKey, type StorageAdapter } from '@openauthjs/openauth/storage/storage';
import { createStorage, type Driver as UnstorageDriver } from 'unstorage';

// deno-lint-ignore no-explicit-any
type Entry = { value: Record<string, any> | undefined; expiry?: number };

/**
 * Unstorage storage adapter for openauth.
 * @remarks
 * implementation taken from `@openauthjs/openauth` PR #235 `finxol:add-unstorage-adapter`
 */
export function Unstorage({ driver }: { driver?: UnstorageDriver }): StorageAdapter {
  const store = createStorage<Entry>({ driver });

  return {
    async get(key: string[]) {
      const k = joinKey(key);
      const entry = await store.getItem(k);

      if (!entry) return undefined;

      if (entry.expiry && Date.now() >= entry.expiry) {
        await store.removeItem(k);
        return undefined;
      }

      return entry.value;
    },

    // deno-lint-ignore no-explicit-any
    async set(key: string[], value: any, expiry?: Date) {
      const k = joinKey(key);

      await store.setItem(
        k,
        {
          value,
          expiry: expiry ? expiry?.getTime() : undefined,
        } satisfies Entry,
      );
    },

    async remove(key: string[]) {
      const k = joinKey(key);
      await store.removeItem(k);
    },

    async *scan(prefix: string[]) {
      const now = Date.now();
      const prefixStr = joinKey(prefix);

      // Get all keys matching our prefix
      const keys = await store.getKeys(prefixStr);

      for (const key of keys) {
        // Get the entry for this key
        const entry = await store.getItem(key);

        if (!entry) continue;
        if (entry.expiry && now >= entry.expiry) {
          // Clean up expired entries as we go
          await store.removeItem(key);
          continue;
        }

        yield [splitKey(key), entry.value];
      }
    },
  };
}
