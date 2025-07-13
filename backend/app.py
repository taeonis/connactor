from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import requests
from datetime import datetime
import random
from routes import routes

app = Flask(__name__, static_folder='../frontend/dist', static_url_path='/')
CORS(app)

TMDB_API_KEY = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1YTc0ZjUwMDJmOGQzNjRmMDIwN2ZiNzY4NWU0YjJiYiIsIm5iZiI6MTcxMzkxNTYxNS41Nzc5OTk4LCJzdWIiOiI2NjI4NDZkZjE3NmE5NDAxN2Y4MjQwN2MiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.jaZnUlZDZ-ymiHDFIBbgVJg4plv027Q1084Ut0XKkno'
headers = {
    'accept': 'application/json',
    'Authorization': TMDB_API_KEY
}

app.register_blueprint(routes)





if __name__ == '__main__':
    app.run(debug=True, port=5001)
