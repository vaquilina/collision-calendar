import { BaseRecord } from './base_record.ts';

import type { Space } from './space.ts';
import type { Block as _Block } from './block.ts';
import type { Occupant as _Occupant } from './occupant.ts';

/** Represents a container for set of {@link _Block Blocks}, from which {@link _Occupant Occupants} can vote for the most agreeable. */
export class Proposal extends BaseRecord {
  constructor(values: BaseRecord & { name: string; spaceid: Space['id'] }) {
    super({ id: values.id, created_at: values.created_at });

    this.name = values.name;
    this.spaceid = values.spaceid;
  }

  /** Name for the proposal. */
  name: string;
  /** ID of the {@link Space} the proposal pertains to. */
  spaceid: Space['id'];
}
