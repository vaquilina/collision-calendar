import type { DB, Row, RowObject } from 'sqlite';
import type { User } from '../classes/user.ts';

/** Get prepared query for retrieving a {@link User} record by id. */
export const selectUserByIdQuery = (db: DB) =>
  db.prepareQuery<
    [User],
    { id: number; name: string; email: string; password: string; created_at: string },
    { id: number }
  >('SELECT * FROM user WHERE id = :id');

/** Get prepared query for retrieving a {@link User} record by email */
export const selectUserByEmailQuery = (db: DB) =>
  db.prepareQuery<
    [User],
    { id: number; name: string; email: string; password: string; created_at: string },
    { email: string }
  >('SELECT * FROM user WHERE email = :email');

/** Get prepared query for inserting a {@link User} record.  */
export const insertUserQuery = (db: DB) =>
  db.prepareQuery<Row, RowObject, { name: string; email: string; password: string; created_at: string }>(
    `
      INSERT INTO user (name, email, password, created_at)
      VALUES(:name, :email, :password, :created_at)
    `,
  );

/** Get prepared query for updating the `name` field of a {@link User} record. */
export const updateUserNameQuery = (db: DB) =>
  db.prepareQuery<Row, RowObject, { name: string; id: number }>(
    `
      UPDATE user
         SET name = :name
       WHERE id = :id
    `,
  );

/** Get prepared query for updating the `email` field of a {@link User} record. */
export const updateUserEmailQuery = (db: DB) =>
  db.prepareQuery<Row, RowObject, { email: string; id: number }>(
    `
      UPDATE user
         SET email = :email
       WHERE id = :id
    `,
  );

/** Get prepared query for updating the `password` field of a {@link User} record. */
export const updateUserPasswordQuery = (db: DB) =>
  db.prepareQuery<Row, RowObject, { password: string; id: number }>(
    `
      UPDATE user
         SET password = :password
       WHERE id = :id
    `,
  );

/** Get prepared query for deleting a {@link User} record. */
export const deleteUserQuery = (db: DB) =>
  db.prepareQuery<Row, RowObject, { id: number }>('DELETE FROM user WHERE id = :id');
