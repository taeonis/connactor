import sqlite3
import os
from definitions import ROOT_DIR

DATABASE = os.path.join(ROOT_DIR, 'backend/database/database.db')

def get_db():
    try:
        conn = sqlite3.connect(DATABASE)
        conn.row_factory = sqlite3.Row
        return conn
    except Exception as e:
        print(e)

def add_actor(actor):
    db = get_db()
    db.execute(
        '''
        INSERT INTO actors (id, name, profile_path)
        VALUES (?, ?, ?)
        ''',
        (
            actor['id'],
            actor['name'],
            actor['profile_path']
        )
    )
    db.commit()

def add_pair(pair, date):
    db = get_db()
    pair.sort()
    db.execute(
        '''
        INSERT INTO pairs (actor1_id, actor2_id, date)
        VALUES (?, ?, ?)
        ''',
        (
            pair[0],
            pair[1],
            date
        )
    )
    db.commit()

def fetch_actor_data(actor_id):
    db = get_db()
    return db.execute('SELECT * FROM actors WHERE id = ?', (actor_id,)).fetchone()

def is_pair_used(pair):
    db = get_db()
    pair.sort()
    return db.execute(
        'SELECT * FROM pairs WHERE actor1_id = ? AND actor2_id = ?',
        (pair[0], pair[1])
    ).fetchone() is not None

def get_pair_by_date(date):
    print('getting db...')
    db = get_db()
    print('got db...')
    return db.execute(
        'SELECT actor1_id, actor2_id FROM pairs WHERE date = ?',
        (date,)
    ).fetchone()

