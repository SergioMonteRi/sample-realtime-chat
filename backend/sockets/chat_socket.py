from flask_login import current_user
from flask_socketio import join_room

from extensions import socketio
from services.chat_service import ChatService

@socketio.on("connect")
def handle_connect():
    print("Cliente conectado ao Socket.IO")

@socketio.on("join-chat")
def join_chat(data):
    chat_id = data["chat_id"]
    current_user_id = current_user.id

    if not ChatService.ensure_user_is_participant(
        chat_id=chat_id,
        user_id=current_user_id,
    ):
        return


    room = f"chat:{chat_id}"

    join_room(room)
