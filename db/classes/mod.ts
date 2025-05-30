import { Block } from './block.ts';
import { Calendar } from './calendar.ts';
import { CalendarAccess } from './calendar_access.ts';
import { Collision } from './collision.ts';
import { Occupant } from './occupant.ts';
import { Proposal } from './proposal.ts';
import { Repeat } from './repeat.ts';
import { Space } from './space.ts';
import { SpaceAccess } from './space_access.ts';
import { User } from './user.ts';
import { Vote } from './vote.ts';

const getTables = async (): Promise<string[]> => {
  const excludeEntries = ['mod', 'base_record'];

  const classesPath = import.meta.dirname;
  if (!classesPath) throw new Error('could not resolve classes path');

  const tables: string[] = [];
  for await (const dirEntry of Deno.readDir(classesPath)) {
    const tableName = dirEntry.name.slice(0, -3);
    if (excludeEntries.includes(tableName)) continue;

    tables.push(tableName);
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
  Repeat,
  Space,
  SpaceAccess,
  Tables,
  User,
  Vote,
};
