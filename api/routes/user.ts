import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import * as z from 'zod';
import * as bcrypt from '@da/bcrypt';

import { turso } from '@collision-calendar/db/init';
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
  .get('/:id', zValidator('param', getUserSchema), async (c) => {
    const { id } = c.req.valid('param');

    const rs = await turso.execute({
      sql: 'SELECT * FROM user WHERE id = $id',
      args: { id },
    });

    if (rs.rows.length < 1) return c.notFound();

    console.log({ rows: rs.rows });

    return c.json(rs.rows[0]);
  })
  /* get many users */
  .get('/', zValidator('query', getUsersSchema), (c) => {
    // eg. /user?ids=1&ids=2
    return c.text('todo: get users');
  })
  /* create user */
  .post('/', zValidator('json', createUserSchema), async (c) => {
    return c.text('todo: create user');
  })
  /* update user */
  .patch('/:id', zValidator('param', updateUserParamSchema), zValidator('json', updateUserBodySchema), (c) => {
    return c.text('todo: update user');
  })
  /* delete user */
  .delete('/:id', zValidator('param', deleteUserSchema), (c) => {
    return c.text('todo: delete user');
  });
