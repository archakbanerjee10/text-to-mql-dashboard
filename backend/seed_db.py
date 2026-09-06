import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "analytics_db")

client = MongoClient(MONGO_URI)
db = client[DATABASE_NAME]

# Sample E-commerce Sales Data
sample_sales = [
    {"product": "Wireless Mouse", "category": "Electronics", "price": 25.99, "quantity": 3, "status": "completed"},
    {"product": "Mechanical Keyboard", "category": "Electronics", "price": 89.99, "quantity": 1, "status": "completed"},
    {"product": "Gaming Monitor", "category": "Electronics", "price": 299.99, "quantity": 2, "status": "completed"},
    {"product": "Running Shoes", "category": "Footwear", "price": 120.00, "quantity": 1, "status": "completed"},
    {"product": "Leather Jacket", "category": "Apparel", "price": 199.50, "quantity": 1, "status": "pending"},
    {"product": "Desk Mat", "category": "Electronics", "price": 15.00, "quantity": 4, "status": "completed"},
]

# Insert sample data into "sales" collection
db.sales.drop()  # Reset collection if it exists
result = db.sales.insert_many(sample_sales)
print(f"✅ Inserted {len(result.inserted_ids)} documents into the 'sales' collection of database '{DATABASE_NAME}'!")

client.close()