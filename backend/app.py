from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import random

app = Flask(__name__)
CORS(app)

TMDB_API_KEY = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1YTc0ZjUwMDJmOGQzNjRmMDIwN2ZiNzY4NWU0YjJiYiIsIm5iZiI6MTcxMzkxNTYxNS41Nzc5OTk4LCJzdWIiOiI2NjI4NDZkZjE3NmE5NDAxN2Y4MjQwN2MiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.jaZnUlZDZ-ymiHDFIBbgVJg4plv027Q1084Ut0XKkno'

headers = {
    'accept': 'application/json',
    'Authorization': TMDB_API_KEY
}

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



    return


if __name__ == '__main__':
    app.run(debug=True, port=5000)
