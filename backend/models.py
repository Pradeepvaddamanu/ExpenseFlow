from sqlalchemy import Column, Integer, String, DateTime
from database import Base
from datetime import datetime


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False)

    email = Column(String, unique=True, nullable=False)

    password_hash = Column(String, nullable=False)
    
from sqlalchemy import Column, Integer, String


class Group(Base):
    __tablename__ = "groups"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False)

    created_by = Column(Integer, nullable=False)
    
class GroupMember(Base):
    __tablename__ = "group_members"

    id = Column(Integer, primary_key=True, index=True)

    group_id = Column(Integer, nullable=False)

    member_name = Column(String, nullable=False)

class Expense(Base):
    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True, index=True)

    group_id = Column(Integer, nullable=False)

    paid_by = Column(String, nullable=False)

    amount = Column(Integer, nullable=False)

    description = Column(String, nullable=False)

class Activity(Base):
    __tablename__ = "activities"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, nullable=False)

    message = Column(String)

    created_at = Column(DateTime, default=datetime.utcnow)
    
