import { BaseRecord } from './base_record.ts';

/** Represents a user of the system. */
export class User extends BaseRecord {
  constructor(
    values: BaseRecord & {
      email: string;
      name: string;
      password: string;
    },
  ) {
    super({ id: values.id, created_at: values.created_at });

    this.email = values.email;
    this.name = values.name;
    this.password = values.password;
  }

  /** User's email. */
  email: string;
  /** User's display name. */
  name: string;
  /**
   * User's password.
   * @remarks
   * Passwords are [hashed](https://github.com/darkaqua/bcrypt) before being stored in the database.
   */
  password: string;
}
