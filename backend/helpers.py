import requests
from datetime import datetime

TMDB_API_KEY = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1YTc0ZjUwMDJmOGQzNjRmMDIwN2ZiNzY4NWU0YjJiYiIsIm5iZiI6MTcxMzkxNTYxNS41Nzc5OTk4LCJzdWIiOiI2NjI4NDZkZjE3NmE5NDAxN2Y4MjQwN2MiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.jaZnUlZDZ-ymiHDFIBbgVJg4plv027Q1084Ut0XKkno'
headers = {
    'accept': 'application/json',
    'Authorization': TMDB_API_KEY
}

def search(type, query):
    try:
        url = f'https://api.themoviedb.org/3/search/{type}'
        results = []

        for page in range(1, 3):
            params = {
                'query': query,
                'include-adult': 'false',
                'language': 'en-US',
                'page': page
            }

            response = requests.get(url, headers=headers, params=params)
            response.raise_for_status()
            
            page_results = response.json().get('results', [])

            filtered = []
            if (type == 'person'):
                filtered = [
                    person for person in page_results
                    if person.get('known_for_department') in ['Acting', 'Directing'] and
                    person.get('popularity', 0) > 0 and
                    person.get('profile_path') is not None
                ]
            else:
                filtered = [
                    movie for movie in page_results if
                    movie.get('popularity', 0) > 0 and
                    movie.get('poster_path') is not None and
                    movie.get('release_date') != '' and 
                    movie.get('release_date') < datetime.today().strftime('%Y-%m-%d')
                ]
            results.extend(filtered)
        
        results.sort(key=lambda x: x.get('popularity', 0), reverse=True)
        return results
    
    except Exception as e:
        return e
    
def get_credits(type, id):
    url = f'https://api.themoviedb.org/3/person/{id}/{'movie_' if type == 'movie' else ''}credits?language=en-US'
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()

        cast = response.json().get('cast', [])
        crew = response.json().get('crew', [])

        ids = [credit.get('id') for credit in cast]
        ids.extend([credit.get('id') for credit in crew if credit.get('job') == 'Director'])


    except Exception as e:
        return e