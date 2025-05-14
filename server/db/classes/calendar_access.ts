import { BaseRecord } from './base_record.ts';
import { Calendar } from './calendar.ts';
import { User } from './user.ts';
import { AccessPermissions } from '../../../types/types.ts';

/** Represents a {@link User}'s {@link AccessPermissions} for a {@link Calendar}.  */
export class CalendarAccess extends BaseRecord {
  constructor(
    values: BaseRecord & { userid: User['id']; calendarid: Calendar['id']; permissions: AccessPermissions },
  ) {
    super({ id: values.id, created_at: values.created_at });

    this.userid = values.userid;
    this.calendarid = values.calendarid;
    this.permissions = values.permissions;
  }

  userid: User['id'];
  calendarid: Calendar['id'];
  permissions: AccessPermissions;
}
