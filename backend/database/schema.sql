DROP TABLE IF EXISTS actors;
DROP TABLE IF EXISTS pairs;

CREATE TABLE actors (
    id INTEGER PRIMARY KEY,  
    name TEXT NOT NULL,
    profile_path TEXT NOT NULL
);

CREATE TABLE pairs (
    actor1_id INTEGER NOT NULL,
    actor2_id INTEGER NOT NULL,
    date TEXT NOT NULL, -- format: 'YYYY-MM-DD'
    PRIMARY KEY (actor1_id, actor2_id),       
    UNIQUE(date),                             
    FOREIGN KEY (actor1_id) REFERENCES actors(id),
    FOREIGN KEY (actor2_id) REFERENCES actors(id),
    CHECK (actor1_id < actor2_id)
);