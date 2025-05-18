import { DB } from 'sqlite';
import type { User } from '../classes/user.ts';
import type { Email } from '../../../types/types.ts';

/** A complete {@link User} record as returned from the database. */
type UserEntry = {
  id: number;
  name: string;
  email: Email;
  password: string;
  created_at: string;
};

/** Get a list of all {@link User Users}. */
export const getAllUsers = (): User[] => {
  const db = new DB(Deno.env.get('DB_PATH'), { mode: 'read' });
  const records = db.queryEntries<UserEntry>('SELECT * FROM user');
  db.close();

  return records?.map<User>((u) => ({ ...u, created_at: Temporal.Instant.from(u.created_at) })) ?? [];
};
