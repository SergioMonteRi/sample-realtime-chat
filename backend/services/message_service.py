from uuid import UUID
from sqlalchemy import select

from extensions import db

from models.chat import Chat
from models.message import Message
from models.chat_participant import ChatParticipant

class MessageService:

    @staticmethod
    def create_message(
        chat_id: UUID,
        sender_id: UUID,
        content: str
    ) -> Message:

        stmt = (
            select(Chat)
            .join(ChatParticipant)
            .where(
                Chat.id == chat_id,
                ChatParticipant.user_id == sender_id
            )
        )

        chat = db.session.scalar(stmt)

        if not chat:
            raise ValueError(
                "User is not a participant of this chat"
            )

        new_message = Message(
            chat_id=chat_id,
            sender_id=sender_id,
            content=content
        )

        db.session.add(new_message)
        db.session.commit()

        return new_message

    @staticmethod
    def get_messages(
        chat_id: UUID,
        current_user_id: UUID
    ) -> list[Message]:
        find_chat_stmt = (
            select(Chat)
            .join(ChatParticipant)
            .where(
                Chat.id == chat_id,
                ChatParticipant.user_id == current_user_id
            )
        )

        chat = db.session.scalar(find_chat_stmt)

        if not chat:
            raise ValueError(
                "User is not a participant of this chat"
            )

        get_messages_stmt = (
            select(Message)
            .where(
                Message.chat_id == chat_id
            )
            .order_by(
                Message.created_at.asc()
            )
        )

        messages = db.session.scalars(get_messages_stmt).all()

        return messages


    