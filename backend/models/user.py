from uuid import UUID, uuid7
from datetime import datetime, timezone

from sqlalchemy import String
from flask_login import UserMixin
from sqlalchemy.orm import Mapped, mapped_column, relationship

from extensions import Base
from custom_types.uuid import UUIDType
from custom_types.utc_datetime import UTCDateTime

class User(Base, UserMixin):
    __tablename__ = "user"

    id: Mapped[UUID] = mapped_column(
        UUIDType(),
        primary_key=True,
        default=uuid7
    )

    email: Mapped[str] = mapped_column(
        String(80), 
        nullable=False, 
        unique=True
    )

    password: Mapped[str] = mapped_column(
        String(255), 
        nullable=False
    )

    created_at: Mapped[datetime] = mapped_column(
        UTCDateTime(),
        nullable=False,
        default=lambda: datetime.now(timezone.utc)
    )

    chat_participations: Mapped[list["ChatParticipant"]] = relationship(
        back_populates="user"
    )

    messages: Mapped[list["Message"]] = relationship(
        back_populates="sender"
    )