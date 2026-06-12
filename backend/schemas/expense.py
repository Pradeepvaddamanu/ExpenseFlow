from pydantic import BaseModel


class ExpenseCreate(BaseModel):
    paid_by: str
    amount: int
    description: str