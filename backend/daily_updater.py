import threading
import time
from datetime import datetime, timedelta
import json
from helpers import get_valid_pair

def last_updated(update_to=[]):
    if (update_to):
        with open('last_updated.json', 'w') as f:
            json.dump(update_to, f, indent=4)
            return update_to[0]
    else:
        with open('last_updated.json', 'r') as f:
            return json.load(f)[0]


def update_starting_pair():
    print('updating....')

    today = datetime.today().strftime('%Y-%m-%d %H:%M')
    daily_pairs = {}
    with open('daily_pairs.json', 'r') as f:
        daily_pairs = json.load(f)

    if (last_updated() != today):
        new_pair = get_valid_pair()
        while is_pair_already_used(daily_pairs, new_pair):
            new_pair = get_valid_pair()

        daily_pairs[today] = new_pair

        with open('daily_pairs.json', 'w') as f:
            json.dump(daily_pairs, f, indent=4)
        
        last_updated(update_to=[today])
        print('updated')
    else:
        print('already updated this minute')

def is_pair_already_used(all_pairs, new_pair):
    for used_pair in all_pairs.values():
        if new_pair[0] in used_pair and new_pair[1] in used_pair:
            return True
    return False

# def midnight_checker():
#     while True:
#         now = datetime.now()
#         midnight = (now + timedelta(days=1)).replace(hour=0, minute=0, second=0, microsecond=0)
#         seconds_until_midnight = int((midnight - now).total_seconds())
#         time.sleep(seconds_until_midnight + 1)

#         today = datetime.today().strftime('%Y-%m-%d')
#         if today > last_update():
#             update_starting_pair()

# def start_background_task():
#     thread = threading.Thread(target=midnight_checker, daemon=True)
#     thread.start()