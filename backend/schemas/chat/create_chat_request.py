from uuid import UUID
from datetime import datetime

from pydantic import BaseModel, EmailStr, ConfigDict

from schemas.message.message_schemas import MessageResponse

class ChatParticipantResponse(BaseModel):
    id: UUID
    email: EmailStr

class ChatResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    participant: ChatParticipantResponse
    created_at: datetime
    last_message_at: datetime | None = None
    last_message: MessageResponse | None

class CreateChatRequest(BaseModel):
    receiver_id: UUID

class GetChatsResponse(BaseModel):
    chats: list[ChatResponse]