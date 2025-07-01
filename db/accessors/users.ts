import { selectCalendarAccessByCalendarIdAndPermissionsQuery } from '../queries/calendar_access.ts';
import { selectUserByIdQuery } from '../queries/user.ts';
import { selectSpaceAccessByIdAndPermissionsQuery } from '../queries/space_access.ts';

import type { AccessPermissions } from '@collision-calendar/types';
import type { Calendar } from '../classes/calendar.ts';
import type { DB } from 'sqlite';
import type { Space } from '../classes/space.ts';

type UserLogin = {
  email: string;
  password: string;
};

/** Get an array of {@link UserLogin user logins} in the system to compare against for authentication. */
export const getAllUserLogins = (db: DB): UserLogin[] => db.queryEntries<UserLogin>('SELECT email, password FROM user');

/** Get a list of all {@link UserLogin user logins} with specific {@link AccessPermissions} for a {@link Calendar}. */
export const getAllUsersWithCalendarAccess = (
  calendarid: Calendar['id'],
  permissions: AccessPermissions,
  db: DB,
): UserLogin[] => {
  const calendar_access_query = selectCalendarAccessByCalendarIdAndPermissionsQuery(db);
  const calendar_access_entries = calendar_access_query.allEntries({ calendarid, permissions });
  calendar_access_query.finalize();

  const user_query = selectUserByIdQuery(db);
  const user_entries: UserLogin[] = [];
  for (const { userid } of calendar_access_entries) {
    const user = user_query.firstEntry({ id: userid });
    if (user) user_entries.push({ email: user.email, password: user.password });
  }
  user_query.finalize();

  return user_entries;
};

/** Get a list of all {@link UserLogin user logins} with specific {@link AccessPermissions} for a {@link Space}. */
export const getAllUsersWithSpaceAccess = (
  spaceid: Space['id'],
  permissions: AccessPermissions,
  db: DB,
): UserLogin[] => {
  const space_access_query = selectSpaceAccessByIdAndPermissionsQuery(db);
  const space_access_entries = space_access_query.allEntries({ spaceid, permissions });
  space_access_query.finalize();

  const user_query = selectUserByIdQuery(db);
  const user_entries: UserLogin[] = [];
  for (const { userid } of space_access_entries) {
    const user = user_query.firstEntry({ id: userid });
    if (user) user_entries.push({ email: user.email, password: user.password });
  }
  user_query.finalize();

  return user_entries;
};
