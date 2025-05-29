import { DB } from 'sqlite';

import { ENV_VAR } from '../init/init_env.ts';

import { selectCalendarAccessQuery } from '../queries/calendar_access.ts';
import { selectUserQuery } from '../queries/user.ts';
import { selectSpaceAccessQuery } from '../queries/space_access.ts';

import type { AccessPermissions } from '@collision-calendar/types';
import type { Calendar } from '../classes/calendar.ts';
import type { Space } from '../classes/space.ts';

type UserEntry = {
  email: string;
  password: string;
};

/** Get a list of all users in the system to compare against for authentication. */
export const getAllUsers = (): UserEntry[] => {
  const db = new DB(Deno.env.get(ENV_VAR.DB_PATH), { mode: 'read' });
  const user_entries = db.queryEntries<UserEntry>('SELECT email, password FROM user');
  db.close();

  return user_entries;
};

/** Get a list of all users with specific {@link AccessPermissions} for a {@link Calendar}. */
export const getAllUsersWithCalendarAccess = (
  calendar_id: Calendar['id'],
  permissions: AccessPermissions,
): UserEntry[] => {
  const db = new DB(Deno.env.get(ENV_VAR.DB_PATH), { mode: 'read' });

  const calendar_access_query = selectCalendarAccessQuery(db);
  const calendar_access_entries = calendar_access_query.allEntries({ calendar_id, permissions });
  calendar_access_query.finalize();

  const user_query = selectUserQuery(db);
  const user_entries: UserEntry[] = [];
  for (const { user_id } of calendar_access_entries) {
    const user = user_query.firstEntry({ id: user_id });
    if (user) user_entries.push({ email: user.email, password: user.password });
  }
  user_query.finalize();

  db.close();

  return user_entries;
};

/** Get a list of all users with specific {@link AccessPermissions} for a {@link Space}. */
export const getAllUsersWithSpaceAccess = (space_id: Space['id'], permissions: AccessPermissions): UserEntry[] => {
  const db = new DB(Deno.env.get(ENV_VAR.DB_PATH), { mode: 'read' });

  const space_access_query = selectSpaceAccessQuery(db);
  const space_access_entries = space_access_query.allEntries({ space_id, permissions });
  space_access_query.finalize();

  const user_query = selectUserQuery(db);
  const user_entries: UserEntry[] = [];
  for (const { user_id } of space_access_entries) {
    const user = user_query.firstEntry({ id: user_id });
    if (user) user_entries.push({ email: user.email, password: user.password });
  }
  user_query.finalize();

  db.close();

  return user_entries;
};
