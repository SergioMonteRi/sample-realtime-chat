from sqlalchemy import select
from werkzeug.security import generate_password_hash, check_password_hash

from extensions import db
from models.user import User


class AuthService:

    @staticmethod
    def create_user(email: str, password: str) -> User:
        user = User(
            email=email,
            password=generate_password_hash(password)
        )

        db.session.add(user)
        db.session.commit()

        return user

    @staticmethod
    def get_user_by_email(email: str) -> User | None:
        stmt = select(User).where(User.email == email)

        return db.session.scalar(stmt)

    @staticmethod
    def authenticate(email: str, password: str) -> User | None:
        user = AuthService.get_user_by_email(email)

        if user is None:
            return None

        if not check_password_hash(user.password, password):
            return None

        return user

    