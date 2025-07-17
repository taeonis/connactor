import sqlite3
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo
from definitions import ROOT_DIR, DATABASE
import os

#DATABASE = os.path.join(ROOT_DIR, 'backend/database/database.db')
connection = sqlite3.connect(DATABASE)

cur = connection.cursor()

def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row  # Enables name-based access
    return conn

def print_all_actors():
    db = get_db()
    actors = db.execute('SELECT * FROM actors').fetchall()
    for actor in actors:
        print(dict(actor))

print_all_actors()