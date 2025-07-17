from flask import Blueprint, request, jsonify, send_from_directory
from .helpers import *
from .database.db_utils import get_pair_by_date, fetch_actor_data, get_num_pairs
import os
from definitions import ROOT_DIR


static_folder = os.path.join(ROOT_DIR, 'frontend/dist')
routes = Blueprint('routes', __name__, static_folder=static_folder, static_url_path='/')

@routes.route('/')
def home():
    return send_from_directory(routes.static_folder, 'index.html')

# @routes.route('/<path:path>')
# def serve_react_app(path):
#     # If the requested file exists in the static folder, serve it
#     if os.path.exists(os.path.join(static_folder, path)):
#         return send_from_directory(static_folder, path)

#     return home()

@routes.route('/health')
def health():
    return 'ok', 200

@routes.route('/api/search', methods=['GET'])
def route_search():
    try:
        search_type = request.args.get('type', '').lower()
        query = request.args.get('query', '').lower()

        results = search(search_type, query)

        return jsonify(results)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

    
@routes.route('/api/get-credits', methods=['GET'])
def route_credits():
    try:
        search_type = request.args.get('type', '').lower()
        id = request.args.get('id', '').lower()

        results = get_credits(search_type, id)

        return jsonify(results)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@routes.route('/api/get-starting-pair', methods=['GET'])
def get_daily_pair_test():
    try:
        starting_pair = get_starting_pair()

        print(starting_pair)
        return jsonify({
            'starting_person': starting_pair[0],
            'ending_person': starting_pair[1]
        })

    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 500

@routes.route('/db/get-pair', methods=['GET'])
def get_archived_pair():
    date = request.args.get('date', '').lower()
    pair_ids = get_pair_by_date(date)

    actor1 = fetch_actor_data(pair_ids[0])
    actor2 = fetch_actor_data(pair_ids[1])
    #return [dict(actor1), dict(actor2)]
    finalDict = {
        'starting_person': dict(actor1),
        'ending_person': dict(actor2)
    }
    return jsonify(finalDict)

    #return jsonify({'results': results})

@routes.route('/db/get-num-connactors', methods=['GET'])
def get_num_connactors():
    return jsonify({'total_num': get_num_pairs()[0]})