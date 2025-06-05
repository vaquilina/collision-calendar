import { BaseRecord } from './base_record.ts';

import type { Block, Proposal } from '@collision-calendar/db/classes';

/** Represents an association between a {@link Proposal} and a {@link Block}. */
export class ProposalBlock extends BaseRecord {
  constructor(values: BaseRecord & { proposalid: number; blockid: number }) {
    super({ id: values.id, created_at: values.created_at });

    this.proposalid = values.proposalid;
    this.blockid = values.blockid;
  }

  /** The ID of the {@link Proposal}. */
  proposalid: Proposal['id'];

  /** The ID of the {@link Block}. */
  blockid: Block['id'];
}
