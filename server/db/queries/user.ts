import { DB } from 'sqlite';

import type { User } from '../classes/user.ts';
import type { Email } from '../../../types/types.ts';

export const insertUserQuery = (db: DB) =>
  db.prepareQuery<
    [User],
    { id: number; name: string; email: Email; password: string; created_at: string },
    { name: string; email: Email; password: string; created_at: string }
  >(
    'INSERT INTO user (name, email, password, created_at) VALUES(:name, :email, :password, :created_at)',
  );

export const updateUserQuery = (db: DB) =>
  db.prepareQuery<
    [User],
    { id: number; name: string; email: Email; password: string; created_at: string },
    { name: string; email: Email; password: string }
  >(`
  UPDATE user
     SET name = :name, email = :email, password = :password
     WHERE id = :id
  `);

export const selectUserQuery = (db: DB) =>
  db.prepareQuery<
    [User],
    { id: number; name: string; email: Email; password: string; created_at: string },
    { id: number }
  >('SELECT * FROM user WHERE id = :id');

export const selectUsersQuery = (db: DB) =>
  db.prepareQuery<
    [User],
    { id: number; name: string; email: Email; password: string; created_at: string },
    { ids: string }
  >('SELECT * FROM user WHERE id in (:ids)');

export const deleteUserQuery = (db: DB) =>
  db.prepareQuery<
    [User],
    { id: number; name: string; email: Email; password: string; created_at: string },
    { id: number }
  >('DELETE FROM user WHERE id = :id');
