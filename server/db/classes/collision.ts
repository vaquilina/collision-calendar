import { BaseRecord } from './base_record.ts';
import { Space } from './space.ts';

/**
 * Represents an **explicit collision**.
 * @remarks
 * An explicit collision occurs when a {@link Block} at a {@link Space} overlaps
 * with a Block at another Space that it cannot overlap with.
 */
export class Collision extends BaseRecord {
  constructor(values: BaseRecord & { spaceid_l: Space['id']; spaceid_r: Space['id'] }) {
    super({ id: values.id, created_at: values.created_at, updated_at: values.updated_at });

    this.spaceid_l = values.spaceid_l;
    this.spaceid_r = values.spaceid_r;
  }

  spaceid_l: Space['id'];
  spaceid_r: Space['id'];
}
