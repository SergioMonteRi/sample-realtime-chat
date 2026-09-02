from uuid import UUID

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from extensions import Base
from custom_types.uuid import UUIDType


class ChatParticipant(Base):
    __tablename__ = "chat_participant"

    chat_id: Mapped[UUID] = mapped_column(
        UUIDType(),
        ForeignKey("chat.id"),
        primary_key=True
    )

    user_id: Mapped[UUID] = mapped_column(
        UUIDType(),
        ForeignKey("user.id"),
        primary_key=True
    )

    chat: Mapped["Chat"] = relationship(
        back_populates="participants"
    )

    user: Mapped["User"] = relationship(
        back_populates="chat_participations"
    )