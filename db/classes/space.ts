import { BaseRecord } from './base_record.ts';

import type { Calendar } from './calendar.ts';

/** Represents a group within a {@link Calendar}. */
export class Space extends BaseRecord {
  constructor(values: BaseRecord & { name: string; calendarid: Calendar['id'] }) {
    super({ id: values.id, created_at: values.created_at });

    this.name = values.name;
    this.calendarid = values.calendarid;
  }

  /** Name for the space. */
  name: string;
  /** ID of the {@link Calendar} the space belongs to. */
  calendarid: Calendar['id'];
}
