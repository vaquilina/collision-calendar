import { Hono } from '@hono/hono';

export const user = new Hono()
  .get('/', (c) => c.json('list users'))
  .get('/:id', (c) => c.json(`get ${c.req.param('id')}`))
  .post('/', (c) => c.json('create a user', 201))
  .put('/:id', (c) => c.json(`update ${c.req.param('id')}`))
  .delete('/:id', (c) => c.json(`delete ${c.req.param('id')}`));
