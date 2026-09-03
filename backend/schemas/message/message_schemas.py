from uuid import UUID
from datetime import datetime

from pydantic import BaseModel, Field, ConfigDict

class CreateMessageRequest(BaseModel):
    content: str = Field(min_length=1)


class MessageResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    chat_id: UUID
    sender_id: UUID
    content: str
    created_at: datetime
    