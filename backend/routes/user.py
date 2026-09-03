from flask import jsonify, Blueprint
from flask_login import login_required, current_user

from services.user_service import UserService
from schemas.user.get_users_response import GetUsersResponse, UserResponse

user = Blueprint("user", __name__)

@user.route("/users", methods=["GET"])
@login_required
def get_users():
    user = current_user._get_current_object()

    users = UserService.get_users(current_user_id=user.id)

    response = GetUsersResponse(
        users=[
            UserResponse(
                id=user.id,
                email=user.email,
                created_at=user.created_at,
            )
            for user in users
        ]
    )

    return jsonify(response.model_dump(mode="json"))
