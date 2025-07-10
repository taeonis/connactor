import threading
import time
import json
import os
from datetime import datetime, timedelta
from person_selector import get_random_person  # or import from wherever defined

PAIR_FILE_PATH = 'daily_pair.json'
daily_pair = {}

def save_daily_pair_to_file(pair_data):
    with open(PAIR_FILE_PATH, 'w') as f:
        json.dump(pair_data, f)


def load_daily_pair_from_file():
    if os.path.exists(PAIR_FILE_PATH):
        with open(PAIR_FILE_PATH, 'r') as f:
            return json.load(f)
    return None


def generate_daily_pair():
    first = get_random_person()
    second = get_random_person()
    while first['id'] == second['id']:
        second = get_random_person()

    pair = {
        'starting_person': first,
        'ending_person': second,
        'last_updated': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    }
    
    save_daily_pair_to_file(pair)
    return pair


def scheduler_loop():
    global daily_pair

    while True:
        now = datetime.now()
        next_midnight = (now + timedelta(days=1)).replace(hour=0, minute=0, second=0, microsecond=0)
        seconds_until_midnight = (next_midnight - now).total_seconds()
        time.sleep(seconds_until_midnight)

        daily_pair = generate_daily_pair()


def start_daily_pair_scheduler():
    global daily_pair

    stored = load_daily_pair_from_file()
    if stored:
        daily_pair = stored
    else:
        daily_pair = generate_daily_pair()

    t = threading.Thread(target=scheduler_loop)
    t.daemon = True
    t.start()
