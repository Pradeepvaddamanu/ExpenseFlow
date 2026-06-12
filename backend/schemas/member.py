from pydantic import BaseModel


class MemberCreate(BaseModel):
    member_name: str