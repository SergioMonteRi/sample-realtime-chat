from flask_login import current_user
from flask_socketio import join_room

from extensions import socketio

@socketio.on("join-chat")
def join_chat(data):
    chat_id = data["chat_id"]

    room = f"chat:{chat_id}"

    join_room(room)

    print(f"Usuário entrou na room {room}")