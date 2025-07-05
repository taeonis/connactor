from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import requests
from datetime import datetime
import random
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
static_dir = os.path.join(BASE_DIR, '..', 'frontend', 'dist')

app = Flask(__name__, static_folder=static_dir, static_url_path='/')
CORS(app)

TMDB_API_KEY = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1YTc0ZjUwMDJmOGQzNjRmMDIwN2ZiNzY4NWU0YjJiYiIsIm5iZiI6MTcxMzkxNTYxNS41Nzc5OTk4LCJzdWIiOiI2NjI4NDZkZjE3NmE5NDAxN2Y4MjQwN2MiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.jaZnUlZDZ-ymiHDFIBbgVJg4plv027Q1084Ut0XKkno'

headers = {
    'accept': 'application/json',
    'Authorization': TMDB_API_KEY
}

@app.route('/')
def home():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/api/health')
def health():
    return 'ok', 200

@app.route('/api/person', methods=['GET'])
def get_people():
    try:
        query = request.args.get('search', '').lower()
        results = []

        for page in range(1, 3):
            url = 'https://api.themoviedb.org/3/search/person'
            params = {
                'query': query,
                'include-adult': 'false',
                'language': 'en-US',
                'page': page
            }
            
            response = requests.get(url, headers=headers, params=params)
            response.raise_for_status()
            
            page_results = response.json().get('results', [])
            filtered = [
                person for person in page_results
                if person.get('known_for_department') in ['Acting', 'Directing'] and
                person.get('profile_path') is not None
            ]
            results.extend(filtered)

        results.sort(key=lambda x: x.get('popularity', 0), reverse=True)

        return jsonify(results)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/api/movie', methods=['GET'])
def get_movies():
    try:
        query = request.args.get('search', '').lower()
        results = []

        for page in range(1, 2):
            url = 'https://api.themoviedb.org/3/search/movie'
            params = {
                'query': query,
                'include-adult': 'false',
                'language': 'en-US',
                'page': page
            }
            
            response = requests.get(url, headers=headers, params=params)
            response.raise_for_status()
            
            page_results = response.json().get('results', [])
            filtered = [
                movie for movie in page_results if
                movie.get('popularity', 0) > 0 and
                movie.get('poster_path') is not None
            ]
            results.extend(filtered)

        results.sort(key=lambda x: x.get('popularity', 0), reverse=True)

        return jsonify(results)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/connection', methods=['GET'])
def determine_connection():
    try:
        person_id = request.args.get('person_id', '')
        movie_id = request.args.get('movie_id', '')
        url = f'https://api.themoviedb.org/3/person/{person_id}/movie_credits?language=en-US'
        
        response = requests.get(url, headers=headers)
        response.raise_for_status()

        cast = response.json().get('cast', [])
        crew = response.json().get('crew', [])

        for movie in cast:
            if movie.get('id') == int(movie_id):
                return jsonify({'result': True})

        for movie in crew:
            if movie.get('id') == int(movie_id) and movie.get('job') == 'Director':
                return jsonify({'result': True})

        return jsonify({'result': False})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/api/filmography', methods=['GET'])
def get_filmography():
    try:
        person_id = request.args.get('person_id', '')
        url = f'https://api.themoviedb.org/3/person/{person_id}/movie_credits?language=en-US'
        
        response = requests.get(url, headers=headers)
        response.raise_for_status()

        cast_in = response.json().get('cast', [])
        crew_for = response.json().get('crew', [])

        IDs = [movie.get('id') for movie in cast_in]
        IDs.extend([movie.get('id') for movie in crew_for if movie.get('job') == 'Director'])

        titles = [movie.get('title') for movie in cast_in]
        titles.extend(movie.get('title') for movie in crew_for if movie.get('job') == 'Director')

        return jsonify({'IDs': IDs, 'titles': titles})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/test-pair', methods=['GET'])
def get_daily_pair_test():
    try:
        url1 = 'https://api.themoviedb.org/3/search/person?query=ana%20de%20armas&include_adult=false&language=en-US&page=1'
        url2 = 'https://api.themoviedb.org/3/search/person?query=keanu%20reeves&include_adult=false&language=en-US&page=1'
        
        response1 = requests.get(url1, headers=headers)
        response1.raise_for_status()
        response2 = requests.get(url2, headers=headers)
        response2.raise_for_status()

        starting_person = response1.json().get('results', [])[0]# ana de armas
        ending_person = response2.json().get('results', [])[0]  # keanu reeves
        
        print(starting_person.get('name', 'Unknown'), f"(ID: {starting_person.get('id')})")

        return jsonify({
            'starting_person': starting_person,
            'ending_person': ending_person
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/daily-pair', methods=['GET'])
def get_daily_pair():
    try:
        url = 'https://api.themoviedb.org/3/person/popular'
        params = {
                'language': 'en-US',
                'page': 1
            }

        starting_person = get_random_person(url, params)
        print(f"Starting Person: {starting_person.get('name', 'Unknown')} (ID: {starting_person.get('id')})")

        ending_person = starting_person
        while (ending_person.get('id') == starting_person.get('id')):
            ending_person = get_random_person(url, params)
        print(f"Ending Person: {ending_person.get('name', 'Unknown')} (ID: {ending_person.get('id')})")
            
        return jsonify({
            'starting_person': starting_person,
            'ending_person': ending_person
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

def get_random_person(url, params):
    popularity_threshold = 2.5 # Minimum popularity for a person to be considered

    popularity = 0
    known_for_movies = False
    known_for_department = ''
    adult_content = True
    poster_path = ''
    chosen_person = {}
    while (popularity < popularity_threshold or not known_for_movies
            or known_for_department != 'Acting' or adult_content or not poster_path):
        params['page'] = random.randint(1, 100)
        
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()

        chosen_person = random.choice(response.json().get('results', []))

        popularity = chosen_person.get('popularity', 0)
    
        known_for_list = chosen_person.get('known_for', [])
        popular_media = sum(
            1 for media in known_for_list
            if media.get('media_type') == 'movie' and media.get('popularity', 0) > popularity_threshold
        )

        known_for_movies = True if popular_media >= (len(known_for_list) // 2 + 1) else False
        known_for_department = chosen_person.get('known_for_department', '')
        adult_content = chosen_person.get('adult', True)
        poster_path = chosen_person.get('profile_path', '')

    return chosen_person


if __name__ == '__main__':
    app.run()#debug=True, port=5000)
