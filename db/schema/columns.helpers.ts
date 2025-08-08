import { integer } from 'drizzle-orm/sqlite-core/columns/integer';

export const timestamps = {
  createdAt: integer({ mode: 'timestamp' }).notNull(),
  updatedAt: integer({ mode: 'timestamp' }),
};
