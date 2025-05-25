import { BaseRecord } from './base_record.ts';

import type { Space } from './space.ts';
import type { Proposal } from './proposal.ts';

/** Represents a block of time during which a {@link Space} will be occupied. */
export class Block extends BaseRecord {
  constructor(
    values: BaseRecord & {
      name: string;
      color: string;
      start: Temporal.PlainDateTime;
      end: Temporal.PlainDateTime;
      spaceid: Space['id'];
      proposalid: Proposal['id'] | null;
    },
  ) {
    super({ id: values.id, created_at: values.created_at });

    this.name = values.name;
    this.color = values.color;
    this.start = values.start;
    this.end = values.end;
    this.spaceid = values.spaceid;
    this.proposalid = values.proposalid;
  }

  /** Name of the block. */
  name: string;
  /** Color of the block. */
  color: string;
  /** Calendar date and wall-clock time when the block starts. */
  start: Temporal.PlainDateTime;
  /** Calendar date and wall-clock time when the block ends. */
  end: Temporal.PlainDateTime;
  /** ID of the {@link Space} the block belongs to. */
  spaceid: Space['id'];
  /** ID of the {@link Proposal} the block is a part of, if any. */
  proposalid: Proposal['id'] | null;
}
