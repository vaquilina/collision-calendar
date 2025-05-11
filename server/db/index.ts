import { DB } from "sqlite";

/** Initialize the main database. */
export const initDB = (): void => {
  const db = new DB("collision-calendar.db");

  /*
   * Location
   * - location must be associated to an owner user
   * - location doesn't care about users; only spaces
   *
   * Space
   * - a room or section housed within a location
   *
   * Collision
   * - explicit collisions are defined as two spaces that cannot have block overlap
   * - implicit collisions occur when two blocks at the same space have block overlap
   *
   * - hash passwords before storing in db
   * - generate avatars; store as base64 image?
   *
   * - could package a db with the client for user settings
   *
   * Occupant
   * - a user occupying a space
   *
   * Proposal
   * - a set of blocks to be voted on by occupants
   *
   * Vote
   * - a vote provided by an occupant for a block within a proposal
   *
   * Block
   * - represents a block of time when the space will be occupied
   * - blocks can have occupants; users who are part of the space who will be occupying it during the block
   * - if a block's proposal id is not null, it is considered pending (waiting for votes)
   *
   * Repeat
   * - defines a repetition rule for a block
   * - unit: day|week|month|year
   * - interval: number (eg. every 2 units)
   * - start: the beginning of the repeat (eg. starting on 05/04/2025)
   * - end: the end of the repeat; may be null to repeat indefinitely
   */

  db.execute(`
  PRAGMA foreign_keys = ON;

  CREATE TABLE IF NOT EXISTS user (
    id INTEGER PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    password TEXT,
    avatar TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  
  CREATE TABLE IF NOT EXISTS location (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    owneruserid INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(owneruserid) REFERENCES user(id)
  );
  
  CREATE TABLE IF NOT EXISTS space (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    locationid INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(locationid) REFERENCES location(id)
  );
  
  CREATE TABLE IF NOT EXISTS collision (
    id INTEGER PRIMARY KEY,
    spaceid_l INTEGER NOT NULL,
    spaceid_r INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(spaceid_l) REFERENCES space(id),
    FOREIGN KEY(spaceid_r) REFERENCES space(id)
  );
  
  CREATE TABLE IF NOT EXISTS occupant (
    id INTEGER PRIMARY KEY,
    userid INTEGER NOT NULL,
    spaceid INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(userid) REFERENCES user(id),
    FOREIGN KEY(spaceid) REFERENCES space(id)
  );
  
  CREATE TABLE IF NOT EXISTS proposal (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    spaceid INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(spaceid) REFERENCES space(id)
  );

  CREATE TABLE IF NOT EXISTS block (
    id INTEGER PRIMARY KEY,
    name TEXT,
    color TEXT NOT NULL,
    start DATETIME NOT NULL,
    end DATETIME NOT NULL,
    spaceid INTEGER NOT NULL,
    proposalid INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(spaceid) REFERENCES space(id),
    FOREIGN KEY(proposalid) REFERENCES proposal(id)
  );
  
  CREATE TABLE IF NOT EXISTS repeat (
    id INTEGER PRIMARY KEY,
    unit TEXT NOT NULL,
    interval INTEGER NOT NULL,
    start DATETIME NOT NULL,
    end DATETIME,
    blockid INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(blockid) REFERENCES block(id)
  );
  
  CREATE TABLE IF NOT EXISTS vote (
    id INTEGER PRIMARY KEY,
    answer INTEGER NOT NULL,
    blockid INTEGER NOT NULL,
    proposalid INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(blockid) REFERENCES block(id),
    FOREIGN KEY(proposalid) REFERENCES proposal(id)
  );
`);

  db.close();
};
