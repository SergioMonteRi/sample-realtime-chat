from uuid import UUID, uuid7
from datetime import datetime, timezone

from sqlalchemy import ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from extensions import Base
from custom_types.uuid import UUIDType
from custom_types.utc_datetime import UTCDateTime


class Message(Base):
    __tablename__ = "message"

    id: Mapped[UUID] = mapped_column(
        UUIDType(),
        primary_key=True,
        default=uuid7
    )

    chat_id: Mapped[UUID] = mapped_column(
        UUIDType(),
        ForeignKey("chat.id"),
        nullable=False
    )

    sender_id: Mapped[UUID] = mapped_column(
        UUIDType(),
        ForeignKey("user.id"),
        nullable=False
    )

    content: Mapped[str] = mapped_column(
        Text,
        nullable=False
    )

    created_at: Mapped[datetime] = mapped_column(
        UTCDateTime(),
        nullable=False,
        default=lambda: datetime.now(timezone.utc)
    )

    chat: Mapped["Chat"] = relationship(
        back_populates="messages",
        foreign_keys=[chat_id]
    )

    sender: Mapped["User"] = relationship(
        back_populates="messages"
    )