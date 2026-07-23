import os
from pymongo import MongoClient
from pymongo.server_api import ServerApi

MONGO_URI = os.getenv("MONGO_URI", "MONGO_URI_PLACEHOLDER")
DB_NAME = os.getenv("MONGO_DB_NAME", "edupredict_ai")

client: MongoClient | None = None


def get_db():
    if client is None:
        raise RuntimeError("MongoDB not connected. Call connect_db() first.")
    return client[DB_NAME]


def connect_db():
    global client
    try:
        client = MongoClient(MONGO_URI, server_api=ServerApi("1"))
        client.admin.command("ping")
        print(f"Connected to MongoDB: {DB_NAME}")
        _seed_data()
        return client
    except Exception as e:
        print(f"MongoDB connection failed: {e}")
        print("Falling back to in-memory data generation.")
        client = None
        return None


def close_db():
    global client
    if client:
        client.close()
        client = None


def _seed_data():
    db = client[DB_NAME]
    if db.students.count_documents({}) > 0:
        return

    import random
    from api.routes.dataset import _generate_student

    students = [_generate_student(i) for i in range(500)]
    db.students.insert_many(students)
    print(f"Seeded {len(students)} students into MongoDB.")
