import { BaseRecord } from './base_record.ts';
import { Space } from './space.ts';
import { Proposal } from './proposal.ts';

/** Represents a block of time during which a {@link Space} will be occupied. */
export class Block extends BaseRecord {
  constructor(
    values: BaseRecord & {
      name: string;
      color: string;
      start: Temporal.ZonedDateTime;
      end: Temporal.ZonedDateTime;
      spaceid: Space['id'];
      proposalid?: Proposal['id'];
    },
  ) {
    super({ id: values.id, created_at: values.created_at, updated_at: values.updated_at });

    this.name = values.name;
    this.color = values.color;
    this.start = values.start;
    this.end = values.end;
    this.spaceid = values.spaceid;
    this.proposalid = values.proposalid;
  }

  name: string;
  color: string;
  start: Temporal.ZonedDateTime;
  end: Temporal.ZonedDateTime;
  spaceid: Space['id'];
  proposalid?: Proposal['id'];
}
