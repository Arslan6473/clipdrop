/**
 * Tiny in-memory cache for short-lived processing data (e.g. a provider response reused
 * between analyze and download). Entries expire automatically; nothing is persisted.
 */
export function createTtlCache<V>({ ttlMs, maxEntries = 500 }: { ttlMs: number; maxEntries?: number }) {
  const store = new Map<string, { value: V; expiresAt: number }>();

  return {
    get(key: string, now = Date.now()): V | undefined {
      const hit = store.get(key);
      if (!hit) return undefined;
      if (hit.expiresAt <= now) {
        store.delete(key);
        return undefined;
      }
      return hit.value;
    },
    set(key: string, value: V, now = Date.now()) {
      if (store.size >= maxEntries) {
        for (const [k, v] of store) if (v.expiresAt <= now) store.delete(k);
        if (store.size >= maxEntries) store.delete(store.keys().next().value!);
      }
      store.set(key, { value, expiresAt: now + ttlMs });
    },
    delete: (key: string) => store.delete(key),
    clear: () => store.clear(),
  };
}
