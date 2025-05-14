import { BaseRecord } from './base_record.ts';
import { Email } from '../../../types/types.ts';

/** Represents a user of the system. */
export class User extends BaseRecord {
  constructor(
    values: BaseRecord & {
      email: Email;
      name: string;
      password: string;
    },
  ) {
    super({ id: values.id, created_at: values.created_at });

    this.email = values.email;
    this.name = values.name;
    this.password = values.password;
  }

  email: Email;
  name: string;
  password: string;
}
