import { createClient } from '@libsql/client';

import { ENV_VAR, initEnv } from './init_env.ts';

import type { Client, ResultSet } from '@libsql/client';

/** Batch SQL statements for create the database tables. */
export const create_tables_stmnts: string[] = [
  'PRAGMA foreign_keys = ON',
  `CREATE TABLE IF NOT EXISTS user (
    id          INTEGER PRIMARY KEY,
    email       TEXT UNIQUE NOT NULL,
    name        TEXT NOT NULL,
    password    TEXT,
    created_at  TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS calendar (
    id          INTEGER PRIMARY KEY,
    name        TEXT NOT NULL,
    owneruserid INTEGER NOT NULL,
    created_at  TEXT NOT NULL,

    CONSTRAINT fk_user
      FOREIGN KEY(owneruserid)
      REFERENCES user(id)
      ON DELETE CASCADE
  )`,
  `CREATE TABLE IF NOT EXISTS calendar_access (
    id          INTEGER PRIMARY KEY,
    calendarid  INTEGER NOT NULL,
    userid      INTEGER NOT NULL,
    permissions INTEGER NOT NULL,
    created_at  TEXT NOT NULL,

    CONSTRAINT fk_calendar
      FOREIGN KEY(calendarid)
      REFERENCES calendar(id)
      ON DELETE CASCADE,

    CONSTRAINT fk_user
      FOREIGN KEY(userid)
      REFERENCES user(id)
      ON DELETE CASCADE
      
    CONSTRAINT uniq_calendar_access
      UNIQUE (calendarid, userid)
      ON CONFLICT IGNORE
  )`,
  `CREATE TABLE IF NOT EXISTS space_access (
    id          INTEGER PRIMARY KEY,
    spaceid     INTEGER NOT NULL,
    userid      INTEGER NOT NULL,
    permissions INTEGER NOT NULL,
    created_at  TEXT NOT NULL,
    
    CONSTRAINT fk_space
      FOREIGN KEY(spaceid)
      REFERENCES space(id)
      ON DELETE CASCADE,

    CONSTRAINT fk_user
      FOREIGN KEY(userid)
      REFERENCES user(id)
      ON DELETE CASCADE
      
    CONSTRAINT uniq_space_access
      UNIQUE (spaceid, userid)
      ON CONFLICT IGNORE
  )`,
  `CREATE TABLE IF NOT EXISTS collision (
    id          INTEGER PRIMARY KEY,
    spaceid_l   INTEGER NOT NULL,
    spaceid_r   INTEGER NOT NULL,
    created_at  TEXT NOT NULL,
    
    CONSTRAINT fk_space_l
      FOREIGN KEY(spaceid_l)
      REFERENCES space(id)
      ON DELETE CASCADE,

    CONSTRAINT fk_space_r
      FOREIGN KEY(spaceid_r)
      REFERENCES space(id)
      ON DELETE CASCADE
      
    CONSTRAINT uniq_collision
      UNIQUE (spaceid_l, spaceid_r)
      ON CONFLICT IGNORE
  )`,
  `CREATE TABLE IF NOT EXISTS occupant (
    id          INTEGER PRIMARY KEY,
    userid      INTEGER NOT NULL,
    spaceid     INTEGER NOT NULL,
    created_at  TEXT NOT NULL,
    
    CONSTRAINT fk_user
      FOREIGN KEY(userid)
      REFERENCES user(id)
      ON DELETE CASCADE,
    
    CONSTRAINT fk_space
      FOREIGN KEY(spaceid)
      REFERENCES space(id)
      ON DELETE CASCADE
    
    CONSTRAINT uniq_user_space
      UNIQUE (userid, spaceid)
      ON CONFLICT IGNORE
  )`,
  `CREATE TABLE IF NOT EXISTS proposal (
    id          INTEGER PRIMARY KEY,
    name        TEXT NOT NULL,
    spaceid     INTEGER NOT NULL,
    created_at  TEXT NOT NULL,
    
    CONSTRAINT fk_space
      FOREIGN KEY(spaceid)
      REFERENCES space(id)
      ON DELETE CASCADE
  )`,
  `CREATE TABLE IF NOT EXISTS block (
    id          INTEGER PRIMARY KEY,
    name        TEXT,
    color       TEXT NOT NULL,
    start       INTEGER NOT NULL,
    end         INTEGER NOT NULL,
    spaceid     INTEGER NOT NULL,
    created_at  TEXT NOT NULL,
    
    CONSTRAINT fk_space
      FOREIGN KEY(spaceid)
      REFERENCES space(id)
      ON DELETE CASCADE
  )`,
  `CREATE TABLE IF NOT EXISTS proposal_block (
    id          INTEGER PRIMARY KEY,
    proposalid  INTEGER NOT NULL,
    blockid     INTEGER NOT NULL,
    created_at  TEXT NOT NULL,

    CONSTRAINT fk_proposal
      FOREIGN KEY(proposalid)
      REFERENCES proposal(id)
      ON DELETE CASCADE
    
    CONSTRAINT fk_block
      FOREIGN KEY(blockid)
      REFERENCES block(id)
      ON DELETE CASCADE
      
    CONSTRAINT uniq_proposal_block
      UNIQUE (proposalid, blockid)
      ON CONFLICT IGNORE
  )`,
  `CREATE TABLE IF NOT EXISTS repeat (
    id          INTEGER PRIMARY KEY,
    unit        TEXT NOT NULL,
    interval    INTEGER NOT NULL,
    start       INTEGER NOT NULL,
    end         INTEGER,
    blockid     INTEGER NOT NULL,
    created_at  TEXT NOT NULL,
    
    CONSTRAINT fk_block
      FOREIGN KEY(blockid)
      REFERENCES block(id)
      
    CONSTRAINT uniq_config
      UNIQUE (unit, interval, start, end, blockid)
      ON CONFLICT IGNORE
  )`,
  `CREATE TABLE IF NOT EXISTS vote (
    id          INTEGER PRIMARY KEY,
    answer      INTEGER NOT NULL,
    blockid     INTEGER NOT NULL,
    proposalid  INTEGER NOT NULL,
    occupantid  INTEGER NOT NULL,
    created_at  TEXT NOT NULL,
    
    CONSTRAINT fk_block
      FOREIGN KEY(blockid)
      REFERENCES block(id)
      ON DELETE CASCADE,

    CONSTRAINT fk_proposal
      FOREIGN KEY(proposalid)
      REFERENCES proposal(id)
      ON DELETE CASCADE,
    
    CONSTRAINT fk_occupant
      FOREIGN KEY(occupantid)
      REFERENCES occupant(id)
      ON DELETE CASCADE
      
    CONSTRAINT uniq_vote
      UNIQUE (blockid, proposalid, occupantid)
      ON CONFLICT IGNORE
  )`,
];

/** SQL script to create the tables. */
export const create_tables_sql: string = `
  PRAGMA foreign_keys = ON;

  CREATE TABLE IF NOT EXISTS user (
    id          INTEGER PRIMARY KEY,
    email       TEXT UNIQUE NOT NULL,
    name        TEXT NOT NULL,
    password    TEXT,
    created_at  TEXT NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS calendar (
    id          INTEGER PRIMARY KEY,
    name        TEXT NOT NULL,
    owneruserid INTEGER NOT NULL,
    created_at  TEXT NOT NULL,

    CONSTRAINT fk_user
      FOREIGN KEY(owneruserid)
      REFERENCES user(id)
      ON DELETE CASCADE
  );
  
  CREATE TABLE IF NOT EXISTS calendar_access (
    id          INTEGER PRIMARY KEY,
    calendarid  INTEGER NOT NULL,
    userid      INTEGER NOT NULL,
    permissions INTEGER NOT NULL,
    created_at  TEXT NOT NULL,

    CONSTRAINT fk_calendar
      FOREIGN KEY(calendarid)
      REFERENCES calendar(id)
      ON DELETE CASCADE,

    CONSTRAINT fk_user
      FOREIGN KEY(userid)
      REFERENCES user(id)
      ON DELETE CASCADE
      
    CONSTRAINT uniq_calendar_access
      UNIQUE (calendarid, userid)
      ON CONFLICT IGNORE
  );
  
  CREATE TABLE IF NOT EXISTS space ( 
    id          INTEGER PRIMARY KEY,
    name        TEXT NOT NULL,
    calendarid  INTEGER NOT NULL,
    created_at  TEXT NOT NULL,
    
    CONSTRAINT fk_calendar
      FOREIGN KEY(calendarid)
      REFERENCES calendar(id)
      ON DELETE CASCADE
  );
  
  CREATE TABLE IF NOT EXISTS space_access (
    id          INTEGER PRIMARY KEY,
    spaceid     INTEGER NOT NULL,
    userid      INTEGER NOT NULL,
    permissions INTEGER NOT NULL,
    created_at  TEXT NOT NULL,
    
    CONSTRAINT fk_space
      FOREIGN KEY(spaceid)
      REFERENCES space(id)
      ON DELETE CASCADE,

    CONSTRAINT fk_user
      FOREIGN KEY(userid)
      REFERENCES user(id)
      ON DELETE CASCADE
      
    CONSTRAINT uniq_space_access
      UNIQUE (spaceid, userid)
      ON CONFLICT IGNORE
  );
  
  CREATE TABLE IF NOT EXISTS collision (
    id          INTEGER PRIMARY KEY,
    spaceid_l   INTEGER NOT NULL,
    spaceid_r   INTEGER NOT NULL,
    created_at  TEXT NOT NULL,
    
    CONSTRAINT fk_space_l
      FOREIGN KEY(spaceid_l)
      REFERENCES space(id)
      ON DELETE CASCADE,

    CONSTRAINT fk_space_r
      FOREIGN KEY(spaceid_r)
      REFERENCES space(id)
      ON DELETE CASCADE
      
    CONSTRAINT uniq_collision
      UNIQUE (spaceid_l, spaceid_r)
      ON CONFLICT IGNORE
  );
  
  CREATE TABLE IF NOT EXISTS occupant (
    id          INTEGER PRIMARY KEY,
    userid      INTEGER NOT NULL,
    spaceid     INTEGER NOT NULL,
    created_at  TEXT NOT NULL,
    
    CONSTRAINT fk_user
      FOREIGN KEY(userid)
      REFERENCES user(id)
      ON DELETE CASCADE,
    
    CONSTRAINT fk_space
      FOREIGN KEY(spaceid)
      REFERENCES space(id)
      ON DELETE CASCADE
    
    CONSTRAINT uniq_user_space
      UNIQUE (userid, spaceid)
      ON CONFLICT IGNORE
  );
  
  CREATE TABLE IF NOT EXISTS proposal (
    id          INTEGER PRIMARY KEY,
    name        TEXT NOT NULL,
    spaceid     INTEGER NOT NULL,
    created_at  TEXT NOT NULL,
    
    CONSTRAINT fk_space
      FOREIGN KEY(spaceid)
      REFERENCES space(id)
      ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS block (
    id          INTEGER PRIMARY KEY,
    name        TEXT,
    color       TEXT NOT NULL,
    start       INTEGER NOT NULL,
    end         INTEGER NOT NULL,
    spaceid     INTEGER NOT NULL,
    created_at  TEXT NOT NULL,
    
    CONSTRAINT fk_space
      FOREIGN KEY(spaceid)
      REFERENCES space(id)
      ON DELETE CASCADE
  );
  
  CREATE TABLE IF NOT EXISTS proposal_block (
    id          INTEGER PRIMARY KEY,
    proposalid  INTEGER NOT NULL,
    blockid     INTEGER NOT NULL,
    created_at  TEXT NOT NULL,

    CONSTRAINT fk_proposal
      FOREIGN KEY(proposalid)
      REFERENCES proposal(id)
      ON DELETE CASCADE
    
    CONSTRAINT fk_block
      FOREIGN KEY(blockid)
      REFERENCES block(id)
      ON DELETE CASCADE
      
    CONSTRAINT uniq_proposal_block
      UNIQUE (proposalid, blockid)
      ON CONFLICT IGNORE
  );
  
  CREATE TABLE IF NOT EXISTS repeat (
    id          INTEGER PRIMARY KEY,
    unit        TEXT NOT NULL,
    interval    INTEGER NOT NULL,
    start       INTEGER NOT NULL,
    end         INTEGER,
    blockid     INTEGER NOT NULL,
    created_at  TEXT NOT NULL,
    
    CONSTRAINT fk_block
      FOREIGN KEY(blockid)
      REFERENCES block(id)
      
    CONSTRAINT uniq_config
      UNIQUE (unit, interval, start, end, blockid)
      ON CONFLICT IGNORE
  );
  
  CREATE TABLE IF NOT EXISTS vote (
    id          INTEGER PRIMARY KEY,
    answer      INTEGER NOT NULL,
    blockid     INTEGER NOT NULL,
    proposalid  INTEGER NOT NULL,
    occupantid  INTEGER NOT NULL,
    created_at  TEXT NOT NULL,
    
    CONSTRAINT fk_block
      FOREIGN KEY(blockid)
      REFERENCES block(id)
      ON DELETE CASCADE,

    CONSTRAINT fk_proposal
      FOREIGN KEY(proposalid)
      REFERENCES proposal(id)
      ON DELETE CASCADE,
    
    CONSTRAINT fk_occupant
      FOREIGN KEY(occupantid)
      REFERENCES occupant(id)
      ON DELETE CASCADE
      
    CONSTRAINT uniq_vote
      UNIQUE (blockid, proposalid, occupantid)
      ON CONFLICT IGNORE
  );
`;

await initEnv();

/** Turso/libSQL client. */
export const turso: Client = createClient({
  url: Deno.env.get(ENV_VAR.TURSO_DATABASE_URL)!,
  authToken: Deno.env.get(ENV_VAR.TURSO_AUTH_TOKEN),
});

/** Initialize the main database. */
export const initDB = async (): Promise<ResultSet[]> => await turso.batch(create_tables_stmnts, 'write');
