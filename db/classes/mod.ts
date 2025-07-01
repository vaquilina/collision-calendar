import { Block } from './block.ts';
import { Calendar } from './calendar.ts';
import { CalendarAccess } from './calendar_access.ts';
import { Collision } from './collision.ts';
import { Occupant } from './occupant.ts';
import { Proposal } from './proposal.ts';
import { ProposalBlock } from './proposal_block.ts';
import { Repeat } from './repeat.ts';
import { Space } from './space.ts';
import { SpaceAccess } from './space_access.ts';
import { User } from './user.ts';
import { Vote } from './vote.ts';

/** Crawl the classes directory to get the table names. */
const getTables = async (): Promise<string[]> => {
  const exclude_entries = ['mod', 'base_record'];

  const classes_path = import.meta.dirname;
  if (!classes_path) throw new Error('could not resolve classes path');

  const tables: string[] = [];
  for await (const dir_entry of Deno.readDir(classes_path)) {
    const table_name = dir_entry.name.slice(0, -3);
    if (exclude_entries.includes(table_name)) continue;

    tables.push(table_name);
  }

  return tables;
};

/** Array of table names that should exist in the database. */
const Tables = await getTables();

export {
  Block,
  Calendar,
  CalendarAccess,
  Collision,
  Occupant,
  Proposal,
  ProposalBlock,
  Repeat,
  Space,
  SpaceAccess,
  Tables,
  User,
  Vote,
};
