import { BaseRecord } from './base_record.ts';
import { Block } from './block.ts';
import { Proposal } from './proposal.ts';
import { Occupant } from './occupant.ts';
import { VoteAnswer } from '../../../types/types.ts';

/** Represents an {@link Occupant}'s vote for a {@link Block} as part of a {@link Proposal}. */
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
