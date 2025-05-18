import { BaseRecord } from './base_record.ts';
import { VoteAnswer } from '../../../types/types.ts';
import type { Block } from './block.ts';
import type { Proposal } from './proposal.ts';
import type { Occupant } from './occupant.ts';

/** Reprents a vote provided by an {@link Occupant}, for or against a {@link Block} that is part of a {@link Proposal}. */
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

  /** Vote answer. */
  answer: VoteAnswer;
  /** ID of the {@link Block} voted on. */
  blockid: Block['id'];
  /** ID of the {@link Proposal} the {@link Block} voted on belongs to. */
  proposalid: Proposal['id'];
  /** ID of the {@link Occupant} providing the vote. */
  occupantid: Occupant['id'];
}
