import { BaseRecord } from './base_record.ts';
import type { Block } from './block.ts';
import type { Proposal } from './proposal.ts';
import type { Occupant } from './occupant.ts';
import type { VoteAnswer } from '../../../types/types.ts';

/** Represents an {@link Occupant Occupant's} vote for or against a {@link Block} as part of a {@link Proposal}. */
export class Vote extends BaseRecord {
  constructor(
    values: BaseRecord & {
      answer: VoteAnswer;
      blockid: Block['id'];
      proposalid: Proposal['id'];
      occupantid: Occupant['id'];
    },
  ) {
    super({ id: values.id, created_at: values.created_at });

    this.answer = values.answer;
    this.blockid = values.blockid;
    this.proposalid = values.proposalid;
    this.occupantid = values.occupantid;
  }

  answer: VoteAnswer;
  blockid: Block['id'];
  proposalid: Proposal['id'];
  occupantid: Occupant['id'];
}
