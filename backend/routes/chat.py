from uuid import UUID
from pydantic import ValidationError
from flask import jsonify, request, Blueprint
from flask_login import login_required, current_user

from services.chat_service import ChatService
from services.message_service import MessageService

from schemas.chat.create_chat_request import CreateChatRequest
from schemas.message.message_schemas import CreateMessageRequest, MessageResponse, GetMessagesResponse


chat = Blueprint("chat", __name__)

@chat.route("/chat", methods=["POST"])
@login_required
def create_chat():
    try:
        create_chat_data = CreateChatRequest.model_validate(request.json)

        current_user_id = current_user.id
        receiver_user_id =  create_chat_data.receiver_id
        
        chat = ChatService.create_chat(
            current_user_id, 
            receiver_user_id
        )
    except ValidationError as e:
        return jsonify({
            "error": "Invalid create chat data",
            "details": e.errors()
        }), 400

    except ValueError as e:
        return jsonify({
            "error": str(e)
        }), 400
    
    return jsonify({
        "chat_id": str(chat.id)
    }), 201

@chat.route("/chat/<uuid:chat_id>/messages", methods=["POST"])
@login_required
def create_message(chat_id: UUID):
    try:
        create_message_data = CreateMessageRequest.model_validate(request.json)

        message = MessageService.create_message(
            chat_id=chat_id,
            sender_id=current_user.id,
            content=create_message_data.content
        )
    except ValidationError as e:
        return jsonify({
            "error": "Invalid create message data",
            "details": e.errors()
        }), 400

    except ValueError as e:
        return jsonify({
            "error": str(e)
        }), 400

    response = MessageResponse.model_validate(message)

    return jsonify({
        "message": response.model_dump(mode="json")
    }), 201

@chat.route("/chat/<uuid:chat_id>/messages", methods=["GET"])
@login_required
def get_messages(chat_id: UUID):
    try:
        messages = MessageService.get_messages(
            chat_id=chat_id,
            current_user_id=current_user.id
        )
    except ValueError as e:
            return jsonify({
                "error": str(e)
            }), 400

    response = GetMessagesResponse(
        messages=[
            MessageResponse.model_validate(message) 
            for message in messages
        ]
    )

    return jsonify(response.model_dump(mode="json"))




    
