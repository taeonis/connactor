from flask import Flask, g
from flask_cors import CORS
from .routes import routes
from .daily_updater import update_starting_pair
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
import atexit

app = Flask(__name__, static_folder='../frontend/dist', static_url_path='/')
CORS(app)

TMDB_API_KEY = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1YTc0ZjUwMDJmOGQzNjRmMDIwN2ZiNzY4NWU0YjJiYiIsIm5iZiI6MTcxMzkxNTYxNS41Nzc5OTk4LCJzdWIiOiI2NjI4NDZkZjE3NmE5NDAxN2Y4MjQwN2MiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.jaZnUlZDZ-ymiHDFIBbgVJg4plv027Q1084Ut0XKkno'
headers = {
    'accept': 'application/json',
    'Authorization': TMDB_API_KEY
}

app.register_blueprint(routes)

scheduler = BackgroundScheduler()

def create_app():
    app = Flask(__name__)
    app.register_blueprint(routes)
    app.config['DATABASE'] = 'your.db'

    scheduler.add_job(
        func=update_starting_pair,
        trigger=CronTrigger(hour=0, minute=0),
        id='daily_updater',
        replace_existing=True
    )

    scheduler.start()
    atexit.register(lambda: scheduler.shutdown())

    @app.teardown_appcontext
    def close_connection(exception):
        db = g.pop('db', None)
        if db is not None:
            db.close()

    return app


if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=5001)
