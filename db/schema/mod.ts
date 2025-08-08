import { user } from './user.sql.ts';
import { session } from './session.sql.ts';
import { account } from './account.sql.ts';
import { verification } from './verification.sql.ts';
import { calendar } from './calendar.sql.ts';
import { space } from './space.sql.ts';
import { calendarAccess } from './calendarAccess.sql.ts';
import { spaceAccess } from './spaceAccess.sql.ts';

/** Crawl the classes directory to get the table names. */
const getTables = async (): Promise<string[]> => {
  const exclude_entries = ['mod'];

  const classes_path = import.meta.dirname;
  if (!classes_path) throw new Error('could not resolve classes path');

  const tables: string[] = [];
  for await (const dir_entry of Deno.readDir(classes_path)) {
    const table_name = dir_entry.name.slice(0, -7);
    if (exclude_entries.includes(table_name)) continue;

    tables.push(table_name);
  }

  return tables;
};

/** Array of table names that should exist in the database. */
const Tables = await getTables();

export { account, calendar, calendarAccess, session, space, spaceAccess, Tables, user, verification };
