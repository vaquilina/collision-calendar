import { Hono } from 'hono';

import { DB } from 'sqlite';

import { User } from '../db/classes/user.ts';

import { insertUserQuery } from '../db/queries/user.ts';

import type { Email } from '../../types/types.ts';

export const user = new Hono()
  .get('/', (c) => {
    const db = new DB(Deno.env.get('DB_PATH'), { mode: 'read' });

    const users = db.query<[User]>('SELECT * FROM user');

    db.close();

    return c.json(users);
  })
  .get('/:id', (c) => c.json(`get ${c.req.param('id')}`))
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

    return c.json(`created user`, 201);
  })
  .put('/:id', (c) => c.json(`update ${c.req.param('id')}`))
  .delete('/:id', (c) => c.json(`delete ${c.req.param('id')}`));
