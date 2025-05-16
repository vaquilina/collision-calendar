import { Hono } from 'hono';

import { DB } from 'sqlite';

import type { User } from '../db/classes/user.ts';
import type { Email } from '../../types/types.ts';

import {
  deleteUserQuery,
  insertUserQuery,
  selectUserQuery,
  selectUsersQuery,
  updateUserQuery,
} from '../db/queries/user.ts';

export const user = new Hono()
  /* get all users  */
  .get('/', (c) => {
    const db = new DB(Deno.env.get('DB_PATH'), { mode: 'read' });
    const users = db.queryEntries<{ id: number; name: string; email: Email; password: string; created_at: string }>(
      'SELECT * FROM user',
    );
    db.close();

    const processed_users = users.map<User>((u) => ({ ...u, created_at: Temporal.Instant.from(u.created_at) }));

    return c.json(processed_users);
  })
  /* get one user */
  .get('/:id', (c) => {
    const id = c.req.param('id');

    const db = new DB(Deno.env.get('DB_PATH'), { mode: 'read' });
    const query = selectUserQuery(db);
    const entry = query.firstEntry({ id: Number.parseInt(id) });
    const user = entry ? { ...entry, created_at: Temporal.Instant.from(entry.created_at) } : undefined;
    query.finalize();
    db.close();

    if (!user) return c.notFound();

    return c.json(user);
  })
  /* create a user */
  .post('/', async (c) => {
    const body: { name: string; email: Email; password: string } = await c.req.json();

    const db = new DB(Deno.env.get('DB_PATH'), { mode: 'write' });
    const query = insertUserQuery(db);
    query.execute({
      name: body.name,
      email: body.email,
      password: body.password,
      created_at: Temporal.Now.instant().toString(),
    });
    query.finalize();
    db.close();

    return c.json('created user', 201);
  })
  .patch('/', async (c) => {
    const body: { id: number; name?: string; email?: Email; password?: string } = await c.req.json();

    const db = new DB(Deno.env.get('DB_PATH'), { mode: 'write' });
    const fetch_query = selectUserQuery(db);
    const record = fetch_query.firstEntry({ id: body.id });
    fetch_query.finalize();

    if (!record) {
      db.close();
      return c.notFound();
    }

    const update_query = updateUserQuery(db);
    update_query.execute({
      name: body?.name ? body.name : record.name,
      email: body?.email ? body.email : record.email,
      password: body?.password ? body.password : record.password,
    });
    update_query.finalize();
    db.close();

    return c.json('updated user');
  })
  .delete('/:id', (c) => c.json(`delete ${c.req.param('id')}`));
