import { Hono } from 'hono';

import { zValidator } from '@hono/zod-validator';

import { z } from 'zod/v4';

import { DB } from 'sqlite';

import * as bcrypt from '@da/bcrypt';

import {
  deleteUserQuery,
  insertUserQuery,
  selectUserQuery,
  updateUserEmailQuery,
  updateUserNameQuery,
  updateUserPasswordQuery,
} from '@collision-calendar/db/queries';
import { processEntry } from '@collision-calendar/db/util';
import { User } from '@collision-calendar/db/classes';

const zUserIdSchema = z.preprocess((val) => {
  if (typeof val === 'string') return Number.parseInt(val);

  return val;
}, z.int().positive());

const getUserSchema = z.object({ id: zUserIdSchema });
const getUsersSchema = z.object({ ids: z.array(zUserIdSchema) });
const createUserSchema = z.object({ name: z.string(), email: z.email(), password: z.string() });
const updateUserParamSchema = z.object({ id: zUserIdSchema });
const updateUserBodySchema = z.discriminatedUnion('field', [
  z.object({ field: z.literal('name'), value: z.string() }),
  z.object({ field: z.literal('email'), value: z.email() }),
  z.object({ field: z.literal('password'), value: z.string() }),
]);
const deleteUserSchema = z.object({ id: zUserIdSchema });

/** {@link User} route. */
export const user = new Hono().basePath('/user')
  /* get user */
  .get('/:id', zValidator('param', getUserSchema), (c) => {
    const { id } = c.req.valid('param');

    const db = new DB(Deno.env.get('DB_PATH'), { mode: 'read' });
    const query = selectUserQuery(db);
    const entry = query.firstEntry({ id: id });
    const user = entry ? new User(processEntry(entry)) : undefined;
    query.finalize();
    db.close();

    if (!user) return c.notFound();

    return c.json(user);
  })
  /* get many users */
  .get('/', zValidator('query', getUsersSchema), (c) => {
    // eg. /user?ids=1&ids=2
    const { ids } = c.req.valid('query');

    const db = new DB(Deno.env.get('DB_PATH'), { mode: 'read' });
    const query = selectUserQuery(db);

    const entries: ReturnType<typeof query.allEntries> = [];
    if (ids) {
      for (const id of ids) {
        const entry = query.firstEntry({ id: id });
        if (entry) entries.push(entry);
      }
    }
    query.finalize();

    db.close();

    const users = entries.map((entry) => new User(processEntry(entry)));

    return c.json(users);
  })
  /* create user */
  .post('/', zValidator('json', createUserSchema), async (c) => {
    const body = c.req.valid('json');

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
  .patch('/:id', zValidator('param', updateUserParamSchema), zValidator('json', updateUserBodySchema), async (c) => {
    const { id } = c.req.valid('param');
    const { field, value } = c.req.valid('json');

    const db = new DB(Deno.env.get('DB_PATH'), { mode: 'write' });

    // ensure user exists
    const fetch_query = selectUserQuery(db);
    const record = fetch_query.firstEntry({ id });
    fetch_query.finalize();

    if (!record) {
      db.close();
      return c.notFound();
    }

    switch (field) {
      case 'name': {
        const query = updateUserNameQuery(db);
        query.execute({ id, name: value });
        query.finalize();
        break;
      }
      case 'email': {
        const query = updateUserEmailQuery(db);
        query.execute({ id, email: value });
        query.finalize();
        break;
      }
      case 'password': {
        const hashed_password = await bcrypt.hash(value);

        const query = updateUserPasswordQuery(db);
        query.execute({ id, password: hashed_password });
        query.finalize();
      }
    }

    db.close();

    return c.json(`updated user ${field}`);
  })
  /* delete user */
  .delete('/:id', zValidator('param', deleteUserSchema), (c) => {
    const { id } = c.req.valid('param');

    const db = new DB(Deno.env.get('DB_PATH'), { mode: 'write' });

    // ensure record exists
    const fetch_query = selectUserQuery(db);
    const record = fetch_query.firstEntry({ id });
    fetch_query.finalize();

    if (!record) {
      db.close();
      return c.notFound();
    }

    const query = deleteUserQuery(db);
    query.execute({ id });
    query.finalize();

    db.close();

    return c.json('deleted user');
  });
