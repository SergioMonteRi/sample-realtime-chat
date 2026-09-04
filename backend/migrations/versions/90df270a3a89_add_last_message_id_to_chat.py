"""add last_message_id to chat

Revision ID: 90df270a3a89
Revises: 63f2eb40e7dc
Create Date: 2026-09-04 10:55:38.741401

"""
from alembic import op
import sqlalchemy as sa

import custom_types.uuid

# revision identifiers, used by Alembic.
revision = '90df270a3a89'
down_revision = '63f2eb40e7dc'
branch_labels = None
depends_on = None

# A FK precisa de nome: sem ele o MySQL inventa um e o downgrade nao tem
# como dropar a constraint.
FK_NAME = 'fk_chat_last_message_id_message'


def upgrade():
    with op.batch_alter_table('chat', schema=None) as batch_op:
        batch_op.add_column(
            sa.Column(
                'last_message_id',
                custom_types.uuid.UUIDType(length=36),
                nullable=True
            )
        )
        batch_op.create_foreign_key(
            FK_NAME, 'message', ['last_message_id'], ['id']
        )


def downgrade():
    with op.batch_alter_table('chat', schema=None) as batch_op:
        batch_op.drop_constraint(FK_NAME, type_='foreignkey')
        batch_op.drop_column('last_message_id')
