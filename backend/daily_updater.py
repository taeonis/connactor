
from datetime import datetime
from helpers import get_valid_pair
from database.db_utils import is_pair_used, add_pair, fetch_actor_data, add_actor

    
def update_starting_pair():
    today = datetime.today().strftime('%Y-%m-%d')
    print('updating.... @ ', today)

    new_pair = get_valid_pair()
    pair_ids = [new_pair[0].get('id'), new_pair[1].get('id')]
    print('chosen pair ids: ', pair_ids)

    while is_pair_used(pair_ids):
        new_pair = get_valid_pair()
        pair_ids = [new_pair[0].get('id'), new_pair[1].get('id')]

    for idx in range(2):
        if (fetch_actor_data(pair_ids[idx]) is None):
            add_actor(new_pair[idx])

    add_pair(pair_ids, today)

    



