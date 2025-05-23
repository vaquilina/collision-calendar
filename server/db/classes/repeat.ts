import { BaseRecord } from './base_record.ts';

import type { Block } from './block.ts';
import type { RepeatUnit } from '../../../types/types.ts';

/**
 * Represents a repeat rule for a {@link Block}.
 * @remarks
 * Reads: *"Starting on (start), repeat this block every (interval) * (unit)s until (end)."*
 */
export class Repeat extends BaseRecord {
  constructor(
    values: BaseRecord & {
      unit: RepeatUnit;
      interval: number;
      start: Temporal.PlainDate;
      end: Temporal.PlainDate;
      blockid: Block['id'];
    },
  ) {
    super({ id: values.id, created_at: values.created_at });

    this.unit = values.unit;
    this.interval = values.interval;
    this.start = values.start;
    this.end = values.end;
    this.blockid = values.blockid;
  }

  /** Unit by which the {@link Block} repeats. */
  unit: RepeatUnit;
  /** Interval by which the {@link Block} repeats. */
  interval: number;
  /** [Calendar date](https://docs.deno.com/api/web/~/Temporal.PlainDate) when the repeat begins being applied. */
  start: Temporal.PlainDate;
  /** [Calendar date](https://docs.deno.com/api/web/~/Temporal.PlainDate) when the repeat stops being applied. */
  end: Temporal.PlainDate;
  /** ID of the {@link Block} the repeat applies to. */
  blockid: Block['id'];
}
