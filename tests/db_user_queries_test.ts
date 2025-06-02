import { assertExists, assertObjectMatch } from '@std/assert';

import { DB } from 'sqlite';

import { create_tables_sql } from '@collision-calendar/db/init';

import {
  deleteUserQuery,
  insertUserQuery,
  selectUserByEmailQuery,
  selectUserQuery,
  updateUserEmailQuery,
  updateUserNameQuery,
  updateUserPasswordQuery,
} from '@collision-calendar/db/queries';

Deno.test('DB: User queries', async (t) => {
  // open a database in memory
  const db = new DB();

  // create tables
  db.execute(create_tables_sql);

  await t.step('query: select user', () => {
    const mock_data = {
      name: 'Paul Atreides',
      email: 'spiced@arrakis.gov',
      password: 'Kw1satz-Hader4ch',
      created_at: Temporal.Now.instant(),
    };

    // insert a user
    db.query(
      `INSERT INTO user (name, email, password, created_at) VALUES ('${mock_data.name}', '${mock_data.email}', '${mock_data.password}', '${mock_data.created_at.toString()}')`,
    );

    // determine the user's id
    const [inserted_user] = db.queryEntries<
      { id: number; name: string; email: string; password: string; created_at: string }
    >(`SELECT * FROM user`);
    assertExists(inserted_user, 'inserted user not found');
    const id = inserted_user.id;

    // test query
    const query = selectUserQuery(db);
    const user = query.firstEntry({ id });
    query.finalize();

    assertExists(user, 'queried user not found');
    assertObjectMatch(user, {
      id,
      name: mock_data.name,
      email: mock_data.email,
      password: mock_data.password,
      created_at: mock_data.created_at.toString(),
    });
  });

  db.close();
});
