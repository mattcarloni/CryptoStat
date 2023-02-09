from flask import Flask
from .extentions import mongo
from .main import main
from .auth import auth


def create_app(config_object="app.settings"):
    app = Flask(__name__)
    app.config.from_object(config_object)
    mongo.init_app(app)

    app.register_blueprint(main)
    app.register_blueprint(auth)

    return app
