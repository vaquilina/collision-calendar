import { BaseRecord } from './base_record.ts';

import type { Block } from './block.ts';
import type { Proposal } from './proposal.ts';

/** Represents an association between a {@link Proposal} and a {@link Block}. */
export class ProposalBlock extends BaseRecord {
  constructor(values: BaseRecord & { proposalid: number; blockid: number }) {
    super({ id: values.id, created_at: values.created_at });

    this.proposalid = values.proposalid;
    this.blockid = values.blockid;
  }

  /** The ID of the {@link Proposal} which the {@link Block} is a part of. */
  proposalid: Proposal['id'];

  /** The ID of the {@link Block} that is a part of the {@link Proposal}. */
  blockid: Block['id'];
}
