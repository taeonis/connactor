import sqlite3
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

connection = sqlite3.connect('database.db')

with open('schema.sql') as f:
    connection.executescript(f.read())

cur = connection.cursor()

preset_actors = [
    {'id': 2037, 'name': 'Cillian Murphy', 'profile_path': '/ycZpLjHxsNPvsB6ndu2D9qsx94X.jpg'},
    {'id': 72466, 'name': 'Colin Farrell', 'profile_path': '/nqcU2IEpKbZlpmPsVQMbTN46psI.jpg'},
    {'id': 12982, 'name': 'Peter Capaldi', 'profile_path': '/uv5oQXq7uI6X82W6OowDM0l4qmD.jpg'},
    {'id': 3291, 'name': 'Hugh Grant', 'profile_path': '/hsSfxSHzkKJ6ZKq1Ofngcp7aAnT.jpg'}
]

for actor in preset_actors:
    cur.execute('''
                INSERT INTO actors (id, name, profile_path)
                VALUES (?, ?, ?)
                ''',
                (
                    actor['id'],
                    actor['name'],
                    actor['profile_path']
                )
    )

today = datetime.now(ZoneInfo("America/Los_Angeles")).strftime('%Y-%m-%d')
yesterday = (datetime.now(ZoneInfo("America/Los_Angeles")) - timedelta(days=1)).strftime('%Y-%m-%d')
preset_pairs = [
    {'actor1_id': 2037, 'actor2_id': 72466, 'date': today},
    {'actor1_id': 3291, 'actor2_id': 12982, 'date': yesterday},
]

for pair in preset_pairs:
    cur.execute('''
                INSERT INTO pairs (actor1_id, actor2_id, date)
                VALUES (?, ?, ?)
                ''',
                (
                    pair['actor1_id'],
                    pair['actor2_id'],
                    pair['date']
                )
    )

connection.commit()
connection.close()

print('database reset + initialized')
