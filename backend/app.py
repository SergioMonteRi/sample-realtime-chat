import os

from dotenv import load_dotenv
from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate

from extensions import db, socketio, login_manager

load_dotenv()

def create_app():
    app = Flask(__name__)

    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv(
        "SQLALCHEMY_DATABASE_URI"
    )

    CORS(
        app,
        origins=["http://localhost:5173"]
    )

    db.init_app(app)
    login_manager.init_app(app)

    Migrate(app=app, db=db)

    socketio.init_app(
        app,
        cors_allowed_origins="http://localhost:5173"
    )

    from models.chat import Chat
    from models.chat_participant import ChatParticipant
    from models.message import Message
    from models.user import User

    from routes.auth import auth
    from routes.user import user
    from routes.chat import chat

    app.register_blueprint(auth)
    app.register_blueprint(user)
    app.register_blueprint(chat)

    return app

app = create_app()

if __name__ == "__main__":
    socketio.run(app, debug=True)