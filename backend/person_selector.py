import random
import requests


url = 'https://api.themoviedb.org/3/discover/person'
TMDB_API_KEY = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1YTc0ZjUwMDJmOGQzNjRmMDIwN2ZiNzY4NWU0YjJiYiIsIm5iZiI6MTcxMzkxNTYxNS41Nzc5OTk4LCJzdWIiOiI2NjI4NDZkZjE3NmE5NDAxN2Y4MjQwN2MiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.jaZnUlZDZ-ymiHDFIBbgVJg4plv027Q1084Ut0XKkno'
headers = {
    'accept': 'application/json',
    'Authorization': TMDB_API_KEY
}
params = {
    'sort_by': 'popularity.desc',
    'include_adult': 'false',
    'language': 'en-US',
    'page': 0
}

def get_random_person():
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