from uuid import UUID

from datetime import datetime
from pydantic import BaseModel, ConfigDict, EmailStr

class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    email: EmailStr
    created_at: datetime

class GetUsersResponse(BaseModel):
    users: list[UserResponse]