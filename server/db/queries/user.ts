import { DB, type RowObject } from 'sqlite';

import type { User } from '../classes/user.ts';
import type { Email } from '../../../types/types.ts';

export const insertUserQuery = (db: DB) =>
  db.prepareQuery<[User], RowObject, { name: string; email: Email; password: string; created_at: string }>(
    'INSERT INTO user (name, email, password, created_at) VALUES(:name, :email, :password, :created_at)',
  );

export const updateUserQuery = (db: DB) =>
  db.prepareQuery<[User], RowObject, { name: string; email: Email; password: string }>(`
  UPDATE user
     SET name = :name, email = :email, password = :password
     WHERE id = :id
  `);

export const selectUserQuery = (db: DB) =>
  db.prepareQuery<[User], RowObject, { id: number }>('SELECT * FROM user WHERE id = :id');

export const selectUsersQuery = (db: DB) =>
  db.prepareQuery<[User], RowObject, { ids: string }>('SELECT * FROM user WHERE id in (:ids)');

export const deleteUserQuery = (db: DB) =>
  db.prepareQuery<[User], RowObject, { id: number }>('DELETE FROM user WHERE id = :id');
