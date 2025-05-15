import { BaseRecord } from './base_record.ts';
import type { User } from './user.ts';
import type { Space } from './space.ts';

/** Represents an association between a {@link User} and a {@link Space}. */
export class Occupant extends BaseRecord {
  constructor(values: BaseRecord & { userid: User['id']; spaceid: Space['id'] }) {
    super({ id: values.id, created_at: values.created_at });

    this.userid = values.userid;
    this.spaceid = values.spaceid;
  }

  userid: User['id'];
  spaceid: Space['id'];
}
