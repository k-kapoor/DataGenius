from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
import datetime

# init SQLAlchemy so we can use it later in our models
db = SQLAlchemy()
login_manager = LoginManager()


def create_app():
    app = Flask(__name__)

    app.config['SECRET_KEY'] = 'secret-key-goes-here'
    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:postgres@db:5432/users'
    app.config['PERMANENT_SESSION_LIFETIME'] = datetime.timedelta(minutes=30)
    app.config['SESSION_REFRESH_EACH_REQUEST'] = True
    app.config['REMEMBER_COOKIE_REFRESH_EACH_REQUEST'] = True

    db.init_app(app)

    # The login     
    @login_manager.user_loader
    def user_loader(user_id):
        return User.get_user_flask(user_id)

    from .models import User, Data
    with app.app_context():
        # db.drop_all()  # <-- UNCOMMENT THIS WHEN UPDATING HOW THE DATABASE IS FORMATTED
        db.create_all()

    # blueprint for auth routes in our app
    from .auth import auth as auth_blueprint
    from .dataset import dataset as dataset_blueprint
    app.register_blueprint(auth_blueprint)
    app.register_blueprint(dataset_blueprint)
    login_manager.init_app(app)

    return app