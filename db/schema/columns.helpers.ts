import { integer } from 'drizzle-orm/sqlite-core/columns/integer';

export const timestamps = {
  /** The timestamp for when the record was created */
  createdAt: integer({ mode: 'timestamp_ms' }).notNull(),
  /** The timestamp for when the record was last updated */
  updatedAt: integer({ mode: 'timestamp_ms' }),
};
