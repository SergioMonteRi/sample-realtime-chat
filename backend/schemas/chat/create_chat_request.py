from uuid import UUID
from datetime import datetime

from pydantic import BaseModel, EmailStr, ConfigDict

class ChatParticipantResponse(BaseModel):
    id: UUID
    email: EmailStr

class ChatResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    participant: ChatParticipantResponse
    created_at: datetime

class CreateChatRequest(BaseModel):
    receiver_id: UUID

class GetChatsResponse(BaseModel):
    chats: list[ChatResponse]