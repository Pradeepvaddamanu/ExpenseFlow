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
    
