import { BaseRecord } from './base_record.ts';
import type { Space } from './space.ts';
import type { User } from './user.ts';
import type { AccessPermissions } from '../../../types/types.ts';

/** Represents a {@link User User's} access {@link AccessPermissions permissions} for a {@link Space}. */
export class SpaceAccess extends BaseRecord {
  constructor(values: BaseRecord & { spaceid: Space['id']; userid: User['id']; permissions: AccessPermissions }) {
    super({ id: values.id, created_at: values.created_at });

    this.spaceid = values.spaceid;
    this.userid = values.userid;
    this.permissions = values.permissions;
  }

  spaceid: Space['id'];
  userid: User['id'];
  permissions: AccessPermissions;
}
