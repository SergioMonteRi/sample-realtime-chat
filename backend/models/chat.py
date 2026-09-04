from uuid import UUID, uuid7
from datetime import datetime, timezone

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from extensions import Base
from custom_types.uuid import UUIDType
from custom_types.utc_datetime import UTCDateTime

class Chat(Base):
    __tablename__ = "chat"

    id: Mapped[UUID] = mapped_column(
        UUIDType(),
        primary_key=True,
        default=uuid7
    )

    created_at: Mapped[datetime] = mapped_column(
        UTCDateTime(),
        nullable=False,
        default=lambda: datetime.now(timezone.utc)
    )

    last_message_at: Mapped[datetime | None] = mapped_column(
        UTCDateTime(),
        nullable=True,
        index=True,
    )

    last_message_id: Mapped[UUID | None] = mapped_column(
        UUIDType(),
        ForeignKey("message.id"),
        nullable=True,
    )

    participants: Mapped[list["ChatParticipant"]] = relationship(
        back_populates="chat"
    )

    messages: Mapped[list["Message"]] = relationship(
        back_populates="chat",
        foreign_keys="Message.chat_id"
    )

    last_message: Mapped["Message | None"] = relationship(
        foreign_keys=[last_message_id],
    )