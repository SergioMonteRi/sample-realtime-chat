from flask_login import current_user
from flask_socketio import join_room

from extensions import socketio
from services.chat_service import ChatService

@socketio.on("connect")
def handle_connect():
    if not current_user.is_authenticated:
            return False

@socketio.on("join-chat")
def join_chat(data):
    chat_id = data["chat_id"]

    if not ChatService.ensure_user_is_participant(
        chat_id=chat_id,
        user_id=current_user.id,
    ):
        return

    room = f"chat:{chat_id}"

    join_room(room)
