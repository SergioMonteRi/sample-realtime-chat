from uuid import UUID

from sqlalchemy import select

from extensions import db
from models.user import User


class UserService:

    @staticmethod
    def get_users(current_user_id: UUID) -> list[User]:
        stmt = select(User).where(
            User.id != current_user_id
        )
        
        return list(db.session.scalars(stmt).all())