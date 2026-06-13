from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from models import Group, GroupMember
from schemas.member import MemberCreate
from database import get_db
from models import Group
from models import Expense
from fastapi import UploadFile, File
import re
from routes.ai import parse_expense_with_ai
import json
from groq import Groq
import os
from fastapi import HTTPException
from schemas.expense import ExpenseCreate
from collections import defaultdict
from utils.auth import get_current_user
from schemas.group import GroupCreate
from models import Activity
router = APIRouter()
client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)


@router.post("/groups")
def create_group(
    group_data: GroupCreate,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    group = Group(
        name=group_data.name,
        created_by=current_user["user_id"]
    )

    db.add(group)
    db.flush()

    activity = Activity(
    user_id=current_user["user_id"],
    message=f"Created group {group.name}"
    )

    db.add(activity)

    db.commit()
    db.refresh(group)

    return {
        "message": "Group Created Successfully",
        "group_id": group.id
    }

    
@router.get("/groups")
def get_groups(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    groups = db.query(Group).filter(
        Group.created_by == current_user["user_id"]
    ).all()

    return groups

@router.get("/dashboard-stats")
def dashboard_stats(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    groups = db.query(Group).filter(
        Group.created_by == current_user["user_id"]
    ).all()

    total_groups = len(groups)

    total_members = 0
    total_expenses = 0

    for group in groups:

        total_members += db.query(GroupMember).filter(
            GroupMember.group_id == group.id
        ).count()

        expenses = db.query(Expense).filter(
            Expense.group_id == group.id
        ).all()

        total_expenses += sum(
            expense.amount
            for expense in expenses
        )

    return {
        "groups": total_groups,
        "members": total_members,
        "expenses": total_expenses
    }

    


@router.post("/groups/{group_id}/members")
def add_member(
    group_id: int,
    member_data: MemberCreate,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    member = GroupMember(
        group_id=group_id,
        member_name=member_data.member_name
    )

    db.add(member)
    db.flush()

    activity = Activity(
        user_id=current_user["user_id"],
        message=f"Added member {member.member_name}"
    )

    db.add(activity)
    db.commit()
    return {
    "message": "Member Added Successfully"
}
@router.get("/groups/{group_id}/members")
def get_members(
    group_id: int,
    db: Session = Depends(get_db)
):

    members = db.query(GroupMember).filter(
        GroupMember.group_id == group_id
    ).all()

    return members

@router.post("/groups/{group_id}/expenses")
def add_expense(
    group_id: int,
    expense_data: ExpenseCreate,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    expense = Expense(
        group_id=group_id,
        paid_by=expense_data.paid_by,
        amount=expense_data.amount,
        description=expense_data.description
    )

    db.add(expense)
    db.flush()

    activity = Activity(
        user_id=current_user["user_id"],
        message=f"Added expense ₹{expense.amount}"
    )

    db.add(activity)
    db.commit()
    return {
    "message": "Expense Added Successfully"
}

@router.get("/groups/{group_id}/expenses")
def get_expenses(
    group_id: int,
    db: Session = Depends(get_db)
):

    expenses = db.query(Expense).filter(
        Expense.group_id == group_id
    ).all()

    return expenses
@router.put("/expenses/{expense_id}")
def update_expense(
    expense_id: int,
    expense_data: ExpenseCreate,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    expense = db.query(Expense).filter(
        Expense.id == expense_id
    ).first()

    if not expense:
        raise HTTPException(
            status_code=404,
            detail="Expense not found"
        )

    expense.paid_by = expense_data.paid_by
    expense.amount = expense_data.amount
    expense.description = expense_data.description

    activity = Activity(
    user_id=current_user["user_id"],
    message=f"Updated expense ₹{expense.amount}"
    )

    db.add(activity)
    db.commit()

    return {
        "message": "Expense Updated"
    }
@router.delete("/expenses/{expense_id}")
def delete_expense(
    expense_id: int,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    expense = db.query(Expense).filter(
        Expense.id == expense_id
    ).first()

    if not expense:
        raise HTTPException(
            status_code=404,
            detail="Expense not found"
        )
    amount = expense.amount
    db.delete(expense)
    db.commit()
    activity = Activity(
        user_id=current_user["user_id"],
    message=f"Deleted expense ₹{amount}"
    )

    db.add(activity)
    db.commit()

    return {
        "message": "Expense Deleted"
    }

@router.get("/groups/{group_id}/settlement")
def calculate_settlement(
    group_id: int,
    db: Session = Depends(get_db)
):

    members = db.query(GroupMember).filter(
        GroupMember.group_id == group_id
    ).all()

    expenses = db.query(Expense).filter(
        Expense.group_id == group_id
    ).all()

    total_expense = sum(
        expense.amount for expense in expenses
    )

    member_count = len(members)

    if member_count == 0:
        return {
            "message": "No members found"
    }

    share_per_person = total_expense / member_count 

    paid = defaultdict(float)

    for expense in expenses:
        paid[expense.paid_by] += expense.amount

    balances = {}

    for member in members:

        balances[member.member_name] = (
            paid[member.member_name]
            - share_per_person
        )

    return {
        "total_expense": total_expense,
        "share_per_person": share_per_person,
        "balances": balances
    }
    
@router.get("/groups/{group_id}/optimized-settlement")
def optimized_settlement(
    group_id: int,
    db: Session = Depends(get_db)
):

    members = db.query(GroupMember).filter(
        GroupMember.group_id == group_id
    ).all()

    expenses = db.query(Expense).filter(
        Expense.group_id == group_id
    ).all()

    total_expense = sum(
        expense.amount for expense in expenses
    )
    if len(members) == 0:
        return []

    share_per_person = (
        total_expense / len(members)
    )

    paid = defaultdict(float)

    for expense in expenses:
        paid[expense.paid_by] += expense.amount

    creditors = []
    debtors = []

    for member in members:

        balance = (
            paid[member.member_name]
            - share_per_person
        )

        if balance > 0:
            creditors.append(
                [member.member_name, balance]
            )

        elif balance < 0:
            debtors.append(
                [member.member_name, abs(balance)]
            )

    settlements = []

    i = 0
    j = 0

    while i < len(debtors) and j < len(creditors):

        debtor_name, debt = debtors[i]

        creditor_name, credit = creditors[j]

        amount = min(
            debt,
            credit
        )

        settlements.append({
            "from": debtor_name,
            "to": creditor_name,
            "amount": round(amount, 2)
        })

        debtors[i][1] -= amount

        creditors[j][1] -= amount

        if debtors[i][1] == 0:
            i += 1

        if creditors[j][1] == 0:
            j += 1

    return settlements