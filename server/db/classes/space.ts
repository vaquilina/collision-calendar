import { BaseRecord } from './base_record.ts';
import { Location } from './location.ts';

/** Represents a subdivision of a {@link Location}. */
export class Space extends BaseRecord {
  constructor(values: BaseRecord & { name: string; locationid: Location['id'] }) {
    super({ id: values.id, created_at: values.created_at, updated_at: values.updated_at });

    this.name = values.name;
    this.locationid = values.locationid;
  }

  name: string;
  locationid: Location['id'];
}
