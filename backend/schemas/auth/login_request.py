from pydantic import BaseModel, Field, EmailStr

class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1)