from flask import Blueprint, request, jsonify, send_from_directory
import requests
from datetime import datetime
from helpers import *

routes = Blueprint('routes', __name__, static_folder='../../frontend/dist', static_url_path='/')

@routes.route('/')
def home():
    return send_from_directory(routes.static_folder, 'index.html')

@routes.route('/api/health')
def health():
    return 'ok', 200

@routes.route('/api/search-person', methods=['GET'])
def get_people():
    try:
        query = request.args.get('query', '').lower()
        results = search('person', query)

        return jsonify(results)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@routes.route('/api/search-movie', methods=['GET'])
def get_movies():
    try:
        query = request.args.get('query', '').lower()
        results = search('movie', query)

        return jsonify(results)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

    
@routes.route('/api/person-credits', methods=['GET'])
def get_person_credits():
    try:
        person_id = request.args.get('person_id', '')
        results = get_credits('person', person_id)
        
        return jsonify(results)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

@routes.route('/api/movie-credits', methods=['GET'])
def get_movie_credits():
    try:
        movie_id = request.args.get('movie_id', '')
        results = get_credits('movie', movie_id)

        return jsonify(results)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@routes.route('/api/test-pair', methods=['GET'])
def get_daily_pair_test():
    try:
        starting_pair = get_starting_pair()

        return jsonify({
            'starting_person': starting_pair[0],
            'ending_person': starting_pair[1]
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@routes.route('/api/min-path', methods=['GET'])
def get_min_path():
    start_id = request.args.get('start_id', '')
    end_id = request.args.get('end_id', '')
    print('calculating...')
    shortest_path = find_shortest_path(start_id, end_id)
    print('shortest path: ', shortest_path)

    return jsonify({'shortest_path': shortest_path})


# @routes.route('/api/daily-pair', methods=['GET'])
# def get_daily_pair():
#     try:
#         url = 'https://api.themoviedb.org/3/person/popular'
#         params = {
#                 'language': 'en-US',
#                 'page': 1
#             }

#         starting_person = get_random_person(url, params)
#         ending_person = get_random_person(url, params)
#         while (ending_person.get('id') == starting_person.get('id')):
#             ending_person = get_random_person(url, params)

            
#         return jsonify({
#             'starting_person': starting_person,
#             'ending_person': ending_person
#         })

#     except Exception as e:
#         return jsonify({'error': str(e)}), 500