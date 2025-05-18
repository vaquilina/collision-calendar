import { BaseRecord } from './base_record.ts';
import type { User } from './user.ts';

/** Represents a top-level calendar container. */
export class Calendar extends BaseRecord {
  constructor(values: BaseRecord & { name: string; owneruserid: User['id'] }) {
    super({ id: values.id, created_at: values.created_at });

    this.name = values.name;
    this.owneruserid = values.owneruserid;
  }

  /** Name of the calendar. */
  name: string;
  /** ID of the {@link User} that owns the calendar. */
  owneruserid: User['id'];
}
