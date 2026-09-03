from pydantic import ValidationError
from flask import jsonify, request, Blueprint
from flask_login import login_required, current_user

from schemas.chat.create_chat_request import CreateChatRequest
from services.chat_service import ChatService


chat = Blueprint("chat", __name__)

@chat.route("/chat", methods=["POST"])
@login_required
def create_chat():
    try:
        create_chat_data = CreateChatRequest.model_validate(request.json)

        current_user_id = current_user._get_current_object().id
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


    
