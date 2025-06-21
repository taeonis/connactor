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

@app.route('/api/users', methods=['GET'])
def get_users():
    try:
        query = request.args.get('search', '').lower()
        results = []

        for page in range(1, 4):
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
    
if __name__ == '__main__':
    app.run(debug=True, port=5000)
