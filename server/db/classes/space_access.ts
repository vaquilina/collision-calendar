import { BaseRecord } from './base_record.ts';
import { AccessPermissions } from '../../../types/types.ts';

import type { Space } from './space.ts';
import type { User } from './user.ts';

/** Represents {@link AccessPermissions} granted to a {@link User} for a {@link Space}. */
export class SpaceAccess extends BaseRecord {
  constructor(values: BaseRecord & { spaceid: Space['id']; userid: User['id']; permissions: AccessPermissions }) {
    super({ id: values.id, created_at: values.created_at });

    this.spaceid = values.spaceid;
    this.userid = values.userid;
    this.permissions = values.permissions;
  }

  /** ID of the {@link Space} the permissions apply to. */
  spaceid: Space['id'];
  /** ID of the {@link User} the permissions are granted to. */
  userid: User['id'];
  /** {@link AccessPermissions} indicating the permissions granted. */
  permissions: AccessPermissions;
}
