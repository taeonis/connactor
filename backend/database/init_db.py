import sqlite3

connection = sqlite3.connect('database.db')

with open('schema.sql') as f:
    connection.executescript(f.read())

cur = connection.cursor()

cur.execute('''
            INSERT INTO actors (id, name, profile_path)
            VALUES (?, ?, ?)
            ''',
            (
                2037,
                'Cillian Murphy',
                '/ycZpLjHxsNPvsB6ndu2D9qsx94X.jpg'
            )
)

cur.execute('''
            INSERT INTO actors (id, name, profile_path)
            VALUES (?, ?, ?)
            ''',
            (
                72466,
                'Colin Farrell',
                '/nqcU2IEpKbZlpmPsVQMbTN46psI.jpg'
            )
)

cur.execute('''
            INSERT INTO pairs (actor1_id, actor2_id, date)
            VALUES (?, ?, ?)
            ''',
            (
                2037,
                72466,
                '2025-07-13'
            )
)

connection.commit()
connection.close()

print('database reset + initialized')
