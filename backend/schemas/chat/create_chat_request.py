from uuid import UUID
from pydantic import BaseModel

class CreateChatRequest(BaseModel):
    receiver_id: UUID