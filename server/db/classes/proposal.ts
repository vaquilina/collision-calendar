import { BaseRecord } from './base_record.ts';
import { Space } from './space.ts';

// deno-lint-ignore no-unused-vars
import { Block } from './block.ts';
// deno-lint-ignore no-unused-vars
import { Occupant } from './occupant.ts';

/** Represents a container for set of {@link Block}s, from which {@link Occupant}s can vote for the most agreeable. */
export class Proposal extends BaseRecord {
  constructor(values: BaseRecord & { name: string; spaceid: Space['id'] }) {
    super({ id: values.id, created_at: values.created_at });

    this.name = values.name;
    this.spaceid = values.spaceid;
  }

  name: string;
  spaceid: Space['id'];
}
