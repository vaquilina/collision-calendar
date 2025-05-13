import { BaseRecord } from './base_record.ts';
import { User } from './user.ts';

/** Represents a physical location. */
export class Location extends BaseRecord {
  constructor(values: BaseRecord & { name: string; owneruserid: User['id'] }) {
    super({ id: values.id, created_at: values.created_at, updated_at: values.updated_at });

    this.name = values.name;
    this.owneruserid = values.owneruserid;
  }

  name: string;
  owneruserid: User['id'];
}
