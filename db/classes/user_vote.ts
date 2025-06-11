import { BaseRecord } from './base_record.ts';

import type { User } from './user.ts';
import type { Vote } from './vote.ts';

/** Represents an association between a {@link User} and a {@link Vote}. */
export class UserVote extends BaseRecord {
  constructor(values: BaseRecord & { userid: User['id']; voteid: Vote['id'] }) {
    super({ id: values.id, created_at: values.created_at });

    this.userid = values.userid;
    this.voteid = values.voteid;
  }

  /** The ID of the {@link User} who cast the {@link Vote}. */
  userid: User['id'];

  /** The ID of the {@link Vote}. */
  voteid: Vote['id'];
}
