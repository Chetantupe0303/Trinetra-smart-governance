import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = "trinetra"
COLLECTION_NAME = "users"

VECTOR_INDEX_NAME = "face_index"

# Face recognition threshold (tune after testing)
MATCH_THRESHOLD = 0.8