/**
 * Process a returned entry from the database by converting the `created_at` field to an Instant.
 * @see https://docs.deno.com/api/web/~/Temporal.Instant
 */
export function processEntry<E extends { created_at: string }>(entry: E): E & { created_at: Temporal.Instant } {
  return { ...entry, created_at: Temporal.Instant.from(entry.created_at) };
}
