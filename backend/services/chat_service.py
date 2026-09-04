from uuid import UUID

from sqlalchemy import select

from extensions import db

from models.chat import Chat
from models.chat_participant import ChatParticipant

class ChatService():

    @staticmethod
    def create_chat(
        current_user_id: UUID, 
        receiver_user_id: UUID
    ) -> Chat:
        if current_user_id == receiver_user_id:
            raise ValueError("A user cannot create a chat with themselves")
        
        stmt = (
            select(Chat)
            .join(ChatParticipant)
            .where(
                ChatParticipant.user_id.in_([
                    current_user_id,
                    receiver_user_id
                ])
            )
            .group_by(Chat.id)
            .having(
                db.func.count(ChatParticipant.user_id) == 2
            )
        )

        chat = db.session.scalar(stmt)

        if chat:
            return chat

        chat = Chat()

        db.session.add(chat)
        db.session.flush()

        current_user_participant = ChatParticipant(
            chat_id=chat.id,
            user_id=current_user_id
        )

        receiver_user_participant = ChatParticipant(
            chat_id=chat.id,
            user_id=receiver_user_id
        )

        db.session.add_all([
            current_user_participant,
            receiver_user_participant
        ])

        db.session.commit()

        return chat

    @staticmethod
    def ensure_user_is_participant(
        chat_id: UUID,
        user_id: UUID,
    ) -> bool:
        stmt = (
            select(Chat)
            .join(ChatParticipant)
            .where(
                Chat.id == chat_id,
                ChatParticipant.user_id == user_id
            )
        )

        return db.session.scalar(stmt) is not None
