from sqlalchemy import select
from flask import request, jsonify, Blueprint
from flask_login import login_user, logout_user, login_required
from werkzeug.security import generate_password_hash, check_password_hash

from uuid import UUID
from pydantic import ValidationError

from extensions import db, login_manager
from models.user import User

from schemas.auth.create_user_request import CreateUserRequest
from schemas.auth.login_request import LoginRequest

auth = Blueprint("auth", __name__)

@login_manager.user_loader
def load_user(user_id: str):
    stmt = select(User).where(
        User.id == UUID(user_id)
     )

    user = db.session.scalar(stmt)

    return user


@login_manager.unauthorized_handler
def unauthorized():
    return jsonify({
        "error": "Authentication required"
    }), 401


@auth.route("/auth/register", methods=["POST"])
def create_user():
    try:
        data = request.json
        create_user_data = CreateUserRequest.model_validate(data)
    except ValidationError as e:
        return jsonify({
            "error": "Invalid registration data",
            "details": e.errors()
        }), 400

    user = User(
        email=create_user_data.email,
        password=generate_password_hash(create_user_data.password)
    )

    db.session.add(user)
    db.session.commit()

    return jsonify({
            "message": "User created with success"
    }), 201


@auth.route("/auth/login", methods=["POST"])
def login():
    try:
        data = request.json

        login_data = LoginRequest.model_validate(data)
    except ValidationError as e:
        return jsonify({
            "error": "Invalid login data",
            "details": e.errors()
        }), 400

    email = login_data.email
    password = login_data.password

    stmt = select(User).where(
        User.email == email
    )

    user = db.session.scalar(stmt)

    if user is None or not check_password_hash(user.password, password):
         return jsonify({
            "error": "Invalid username or password"
        }), 401

    login_user(user)

    return jsonify({
        "message": "Successful login"
    }), 200


@auth.route("/auth/logout", methods=["POST"])
@login_required
def logout():
    logout_user()

    return jsonify({
        "message": "Successful logout"
    })