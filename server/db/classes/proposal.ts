import { BaseRecord } from './base_record.ts';
import { Space } from './space.ts';

/** Represents a set of {@link Block}s, on which {@link Occupant}s will vote for the most agreeable. */
export class Proposal extends BaseRecord {
  constructor(values: BaseRecord & { name: string; spaceid: Space['id'] }) {
    super({ id: values.id, created_at: values.created_at, updated_at: values.updated_at });

    this.name = values.name;
    this.spaceid = values.spaceid;
  }

  name: string;
  spaceid: Space['id'];
}
