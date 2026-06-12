from dotenv import load_dotenv

load_dotenv()
from routes.activity import router as activity_router

from fastapi import FastAPI
from database import engine
from models import Base
from routes.groups import router as group_router
from routes.auth import router as auth_router
from routes.ai import router as ai_router
from fastapi.middleware.cors import CORSMiddleware
Base.metadata.create_all(bind=engine)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(auth_router)
app.include_router(group_router)
app.include_router(ai_router)
app.include_router(activity_router)

@app.get("/")
def home():
    return {"message": "ExpenseFlow API Running"}