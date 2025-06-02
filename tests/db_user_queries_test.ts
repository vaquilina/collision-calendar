import { assert, assertExists, assertObjectMatch } from '@std/assert';

import { DB } from 'sqlite';

import { faker } from '@faker-js/faker';

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

  await t.step('query: insert user', () => {
    const mock_data = {
      name: faker.person.firstName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      created_at: Temporal.Now.instant().toString(),
    };

    // test query
    const query = insertUserQuery(db);
    query.execute(mock_data);
    query.finalize();

    // retrieve created record
    const [user] = db.queryEntries(`
      SELECT * FROM user
      WHERE name = '${mock_data.name}'
        AND email = '${mock_data.email}'
        AND password = '${mock_data.password}'
        AND created_at = '${mock_data.created_at}'
      `);

    assertExists(user, 'inserted user not found');
    assertObjectMatch(user, { ...mock_data, id: user.id });

    // clean up
    db.query(`DELETE FROM user WHERE id = ${user.id}`);
  });

  await t.step('query: select user', () => {
    const mock_data = {
      name: faker.person.firstName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      created_at: Temporal.Now.instant().toString(),
    };

    // insert a user
    db.query(
      `INSERT INTO user (name, email, password, created_at)
       VALUES ('${mock_data.name}', '${mock_data.email}', '${mock_data.password}', '${mock_data.created_at}')`,
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
    assertObjectMatch(user, { id, ...mock_data });

    // clean up
    db.query(`DELETE FROM user WHERE id = ${id}`);
  });

  await t.step('query: select user by email', () => {
    const mock_data = {
      name: faker.person.firstName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      created_at: Temporal.Now.instant().toString(),
    };

    // insert a user
    db.query(
      `INSERT INTO user (name, email, password, created_at)
       VALUES ('${mock_data.name}', '${mock_data.email}', '${mock_data.password}', '${mock_data.created_at}')`,
    );

    // test query
    const query = selectUserByEmailQuery(db);
    const user = query.firstEntry({ email: mock_data.email });
    query.finalize();

    assertExists(user, 'queried user not found');
    assertObjectMatch(user, { ...mock_data, id: user.id });

    // clean up
    db.query(`DELETE FROM user WHERE id = ${user.id}`);
  });

  await t.step('query: delete user', () => {
    const mock_data = {
      name: faker.person.firstName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      created_at: Temporal.Now.instant().toString(),
    };

    // insert a user
    db.query(
      `INSERT INTO user (name, email, password, created_at)
       VALUES ('${mock_data.name}', '${mock_data.email}', '${mock_data.password}', '${mock_data.created_at}')`,
    );

    // retrieve inserted record
    const [user] = db.queryEntries<{ id: number; name: string; email: string; password: string; created_at: string }>(
      `SELECT * FROM user`,
    );
    assertExists(user, 'inserted user not found');

    // test query
    const query = deleteUserQuery(db);
    query.execute({ id: user.id });
    query.finalize();

    const entries = db.queryEntries(`SELECT * FROM user WHERE id = ${user.id}`);
    assert(entries.length === 0, 'user table contains rows');
  });

  db.close();
});
