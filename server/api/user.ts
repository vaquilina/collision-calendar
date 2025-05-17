import { Hono } from 'hono';
import { DB } from 'sqlite';
import * as bcrypt from '@da/bcrypt';

import {
  deleteUserQuery,
  insertUserQuery,
  selectUserQuery,
  updateUserEmailQuery,
  updateUserNameQuery,
  updateUserPasswordQuery,
} from '../db/queries/user.ts';

import type { User } from '../db/classes/user.ts';
import type { Email } from '../../types/types.ts';

/** {@link User} route. */
export const user = new Hono().basePath('/user')
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
  /* get user */
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
  /* create user */
  .post('/', async (c) => {
    const body: { name: string; email: Email; password: string } = await c.req.json();

    const hashed_password = await bcrypt.hash(body.password);

    const db = new DB(Deno.env.get('DB_PATH'), { mode: 'write' });
    const query = insertUserQuery(db);
    query.execute({
      name: body.name,
      email: body.email,
      password: hashed_password,
      created_at: Temporal.Now.instant().toString(),
    });
    query.finalize();
    db.close();

    return c.json('created user', 201);
  })
  /* update user */
  .patch('/:id', async (c) => {
    const id = Number.parseInt(c.req.param('id'));
    const body: { field: 'name' | 'email' | 'password'; value: string } = await c.req.json();

    const db = new DB(Deno.env.get('DB_PATH'), { mode: 'write' });

    // ensure user exists
    const fetch_query = selectUserQuery(db);
    const record = fetch_query.firstEntry({ id });
    fetch_query.finalize();

    if (!record) {
      db.close();
      return c.notFound();
    }

    switch (body.field) {
      case 'name': {
        const query = updateUserNameQuery(db);
        query.execute({ id, name: body.value });
        query.finalize();
        break;
      }
      case 'email': {
        const query = updateUserEmailQuery(db);
        query.execute({ id, email: body.value });
        query.finalize();
        break;
      }
      case 'password': {
        const hashed_password = await bcrypt.hash(body.value);

        const query = updateUserPasswordQuery(db);
        query.execute({ id, password: hashed_password });
        query.finalize();
      }
    }

    db.close();

    return c.json(`updated user ${body.field}`);
  })
  /* delete user */
  .delete('/:id', (c) => {
    const id = Number.parseInt(c.req.param('id'));

    if (!id || Number.isNaN(id)) return c.text('bad request', 400);

    const db = new DB(Deno.env.get('DB_PATH'), { mode: 'write' });

    // ensure record exists
    const fetch_query = selectUserQuery(db);
    const record = fetch_query.firstEntry({ id });
    fetch_query.finalize();

    if (!record) return c.notFound();

    const query = deleteUserQuery(db);
    query.execute({ id });
    query.finalize();

    db.close();

    return c.json('deleted user');
  });
