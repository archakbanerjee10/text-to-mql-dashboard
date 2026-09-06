from contextlib import asynccontextmanager
from typing import Generator
from fastapi import FastAPI
from pymongo import MongoClient
from pymongo.database import Database
from app.config import settings


#creating a class named dbmanager for handling the database related activites
class DBManager:
    client: MongoClient= None
    db: Database = None

db_manager = DBManager()

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("connecting to mongodb ")
    db_manager.client = MongoClient(settings.MONGO_URI)
    db_manager.db = db_manager.client[settings.DATABASE_NAME]

    try:
        db_manager.client.admin.command('ping')
        print(f"succesfully connected to the databse : {settings.DATABASE_NAME} ")
    except Exception as e:
        print(f"failed to load the database {e}")

    yield

    print("disconnecting from mongodb ")
    if db_manager.client:
        db_manager.client.close()

def get_db() -> Database:
    return db_manager.db

