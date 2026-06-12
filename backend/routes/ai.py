from fastapi import APIRouter
from groq import Groq
import os

router = APIRouter()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

@router.post("/ai-insights")
def ai_insights(data: dict):

    prompt = f"""
Analyze the following expense data:

{data}

Generate a concise report with:

1. Highest spender
2. Total spending
3. Duplicate or suspicious expenses
4. Spending patterns
5. Budget observations
6. Settlement observations

Keep the response under 8 bullet points.
"""
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    return {
        "insight":
        response.choices[0].message.content
    }
    
def parse_expense_with_ai(text):

    prompt = f"""
Extract expense information from OCR text.

This may be:
- PhonePe
- GPay
- Paytm
- Bank transaction
- Receipt
- Invoice

Return ONLY valid JSON.

If amount is not explicit but patterns like:
%40
Rs40
INR40
40 paid
40 debited

appear, infer the amount.

Format:

{{
  "amount": 0,
  "merchant": "",
  "category": "",
  "description": ""
}}

OCR Text:

{text}
"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    result = response.choices[0].message.content

    result = result.replace(
        "```json",
        ""
    )

    result = result.replace(
        "```",
        ""
    )

    return result.strip()