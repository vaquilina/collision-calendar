import { BaseRecord } from './base_record.ts';
import type { Calendar } from './calendar.ts';
import type { User } from './user.ts';
import type { AccessPermissions } from '../../../types/types.ts';

/** Represents a {@link User User's} access {@link AccessPermissions permissions} for a {@link Calendar}. */
export class CalendarAccess extends BaseRecord {
  constructor(
    values: BaseRecord & { userid: User['id']; calendarid: Calendar['id']; permissions: AccessPermissions },
  ) {
    super({ id: values.id, created_at: values.created_at });

    this.userid = values.userid;
    this.calendarid = values.calendarid;
    this.permissions = values.permissions;
  }

  /** ID of the {@link User} the permissions are granted to. */
  userid: User['id'];
  /** ID of the {@link Calendar} the permissions apply to. */
  calendarid: Calendar['id'];
  /** {@link AccessPermissions} inidcating the permissions granted. */
  permissions: AccessPermissions;
}
