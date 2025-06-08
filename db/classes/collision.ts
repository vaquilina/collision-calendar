import { BaseRecord } from './base_record.ts';

import type { Space } from './space.ts';
import type { Block as _Block } from './block.ts';

/**
 * Represents an **explicit collision**.
 * @remarks
 * An explicit collision defines the relationship between two {@link Space Spaces} that cannot be occupied at the same time.
 * This means that a {@link _Block Block} at either space cannot overlap with a block at the other.
 */
export class Collision extends BaseRecord {
  constructor(values: BaseRecord & { spaceid_l: Space['id']; spaceid_r: Space['id'] }) {
    super({ id: values.id, created_at: values.created_at });

    this.spaceid_l = values.spaceid_l;
    this.spaceid_r = values.spaceid_r;
  }

  /** ID of the {@link Space} defining the collision. */
  spaceid_l: Space['id'];
  /** ID of the {@link Space} the defining space cannot collide with. */
  spaceid_r: Space['id'];
}
