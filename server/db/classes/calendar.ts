import { BaseRecord } from './base_record.ts';
import { User } from './user.ts';

/** Represents a top-level calendar container. */
export class Calendar extends BaseRecord {
  constructor(values: BaseRecord & { name: string; owneruserid: User['id'] }) {
    super({ id: values.id, created_at: values.created_at });

    this.name = values.name;
    this.owneruserid = values.owneruserid;
  }

  name: string;
  owneruserid: User['id'];
}
