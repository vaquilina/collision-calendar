import { BaseRecord } from './base_record.ts';
import { Space } from './space.ts';

// deno-lint-ignore no-unused-vars
import { Block } from './block.ts';

/**
 * Represents an **explicit collision**.
 * @remarks
 * An explicit collision defines an incompatibilty between two {@link Space}s; they cannot be occupied at the same time.
 * (No {@link Block} overlap)
 */
export class Collision extends BaseRecord {
  constructor(values: BaseRecord & { spaceid_l: Space['id']; spaceid_r: Space['id'] }) {
    super({ id: values.id, created_at: values.created_at });

    this.spaceid_l = values.spaceid_l;
    this.spaceid_r = values.spaceid_r;
  }

  spaceid_l: Space['id'];
  spaceid_r: Space['id'];
}
