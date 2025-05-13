import { DB } from 'sqlite';

/** Initialize the main database. */
export const initDB = (): void => {
  const db = new DB('collision-calendar.db');

  db.execute(`
  PRAGMA foreign_keys = ON;

  CREATE TABLE IF NOT EXISTS user (
    id INTEGER PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    password TEXT,
    avatar TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME
  );
  
  CREATE TABLE IF NOT EXISTS location (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    owneruserid INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME,
    FOREIGN KEY(owneruserid) REFERENCES user(id)
  );
  
  CREATE TABLE IF NOT EXISTS space (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    locationid INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME
    FOREIGN KEY(locationid) REFERENCES location(id)
  );
  
  CREATE TABLE IF NOT EXISTS collision (
    id INTEGER PRIMARY KEY,
    spaceid_l INTEGER NOT NULL,
    spaceid_r INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME,
    FOREIGN KEY(spaceid_l) REFERENCES space(id),
    FOREIGN KEY(spaceid_r) REFERENCES space(id)
  );
  
  CREATE TABLE IF NOT EXISTS occupant (
    id INTEGER PRIMARY KEY,
    userid INTEGER NOT NULL,
    spaceid INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME,
    FOREIGN KEY(userid) REFERENCES user(id),
    FOREIGN KEY(spaceid) REFERENCES space(id)
  );
  
  CREATE TABLE IF NOT EXISTS proposal (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    spaceid INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME,
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
    updated_at DATETIME,
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
    updated_at DATETIME,
    FOREIGN KEY(blockid) REFERENCES block(id)
  );
  
  CREATE TABLE IF NOT EXISTS vote (
    id INTEGER PRIMARY KEY,
    answer INTEGER NOT NULL,
    blockid INTEGER NOT NULL,
    proposalid INTEGER NOT NULL,
    occupantid INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME,
    FOREIGN KEY(blockid) REFERENCES block(id),
    FOREIGN KEY(proposalid) REFERENCES proposal(id),
    FOREIGN KEY(occupantid) REFERENCES occupant(id)
  );
`);

  db.close();
};
