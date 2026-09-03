from uuid import UUID

from datetime import datetime
from pydantic import BaseModel, EmailStr

class UserResponse(BaseModel):
    id: UUID
    email: EmailStr
    created_at: datetime

class GetUsersResponse(BaseModel):
    users: list[UserResponse]