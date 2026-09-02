import os

from dotenv import load_dotenv
from flask import Flask

def create_app():
    app = Flask(__name__)

    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv(
        "SQLALCHEMY_DATABASE_URI"
    )

    return app

app = create_app()

if __name__ == "__main__":
    app.run(debug=True)