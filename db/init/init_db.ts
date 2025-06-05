import { DB } from 'sqlite';

import { ENV_VAR } from './init_env.ts';

/** SQL query to create the tables. */
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
    FOREIGN KEY(owneruserid) REFERENCES user(id)
  );
  
  CREATE TABLE IF NOT EXISTS calendar_access (
    id          INTEGER PRIMARY KEY,
    calendarid  INTEGER NOT NULL,
    userid      INTEGER NOT NULL,
    permissions INTEGER NOT NULL,
    created_at  TEXT NOT NULL,
    FOREIGN KEY(calendarid) REFERENCES calendar(id),
    FOREIGN KEY(userid) REFERENCES user(id)
  );
  
  CREATE TABLE IF NOT EXISTS space ( 
    id          INTEGER PRIMARY KEY,
    name        TEXT NOT NULL,
    calendarid  INTEGER NOT NULL,
    created_at  TEXT NOT NULL,
    FOREIGN KEY(calendarid) REFERENCES calendar(id)
  );
  
  CREATE TABLE IF NOT EXISTS space_access (
    id          INTEGER PRIMARY KEY,
    spaceid     INTEGER NOT NULL,
    userid      INTEGER NOT NULL,
    created_at  TEXT NOT NULL,
    FOREIGN KEY(spaceid) REFERENCES space(id),
    FOREIGN KEY(userid) REFERENCES user(id)
  );
  
  CREATE TABLE IF NOT EXISTS collision (
    id          INTEGER PRIMARY KEY,
    spaceid_l   INTEGER NOT NULL,
    spaceid_r   INTEGER NOT NULL,
    created_at  TEXT NOT NULL,
    FOREIGN KEY(spaceid_l) REFERENCES space(id),
    FOREIGN KEY(spaceid_r) REFERENCES space(id)
  );
  
  CREATE TABLE IF NOT EXISTS occupant (
    id          INTEGER PRIMARY KEY,
    userid      INTEGER NOT NULL,
    spaceid     INTEGER NOT NULL,
    created_at  TEXT NOT NULL,
    FOREIGN KEY(userid) REFERENCES user(id),
    FOREIGN KEY(spaceid) REFERENCES space(id)
  );
  
  CREATE TABLE IF NOT EXISTS proposal (
    id          INTEGER PRIMARY KEY,
    name        TEXT NOT NULL,
    spaceid     INTEGER NOT NULL,
    created_at  TEXT NOT NULL,
    FOREIGN KEY(spaceid) REFERENCES space(id)
  );

  CREATE TABLE IF NOT EXISTS block (
    id          INTEGER PRIMARY KEY,
    name        TEXT,
    color       TEXT NOT NULL,
    start       INTEGER NOT NULL,
    end         INTEGER NOT NULL,
    spaceid     INTEGER NOT NULL,
    proposalid  INTEGER,
    created_at  TEXT NOT NULL,
    FOREIGN KEY(spaceid) REFERENCES space(id),
    FOREIGN KEY(proposalid) REFERENCES proposal(id)
  );
  
  CREATE TABLE IF NOT EXISTS repeat (
    id          INTEGER PRIMARY KEY,
    unit        TEXT NOT NULL,
    interval    INTEGER NOT NULL,
    start       INTEGER NOT NULL,
    end         INTEGER,
    blockid     INTEGER NOT NULL,
    created_at  TEXT NOT NULL,
    FOREIGN KEY(blockid) REFERENCES block(id)
  );
  
  CREATE TABLE IF NOT EXISTS vote (
    id          INTEGER PRIMARY KEY,
    answer      INTEGER NOT NULL,
    blockid     INTEGER NOT NULL,
    proposalid  INTEGER NOT NULL,
    occupantid  INTEGER NOT NULL,
    created_at  TEXT NOT NULL,
    FOREIGN KEY(blockid) REFERENCES block(id),
    FOREIGN KEY(proposalid) REFERENCES proposal(id),
    FOREIGN KEY(occupantid) REFERENCES occupant(id)
  );
`;

/** Initialize the main database. */
export const initDB = (): void => {
  const db = new DB(Deno.env.get(ENV_VAR.DB_PATH));

  db.execute(create_tables_sql);

  db.close();
};
