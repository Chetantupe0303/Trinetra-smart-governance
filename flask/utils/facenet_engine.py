import torch
from facenet_pytorch import MTCNN, InceptionResnetV1
from pymongo import MongoClient
from PIL import Image
from bson import ObjectId
import config


class FaceNetEngine:
    def __init__(self):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

        self.mtcnn = MTCNN(image_size=160, device=self.device)
        self.resnet = InceptionResnetV1(pretrained="vggface2").eval().to(self.device)

        # MongoDB Atlas connection
        self.client = MongoClient(config.MONGO_URI)
        self.db = self.client[config.DB_NAME]
        self.users = self.db[config.COLLECTION_NAME]

    # ------------------------
    # Generate Embedding
    # ------------------------
    def generate_embedding(self, image):
        img = Image.fromarray(image)
        face = self.mtcnn(img)

        if face is None:
            return None

        face = face.unsqueeze(0).to(self.device)
        embedding = self.resnet(face).detach().cpu()[0]

        return embedding.tolist()

    # ------------------------
    # Register Face
    # ------------------------
    def register_face(self, user_id, image):
        embedding = self.generate_embedding(image)

        if embedding is None:
            return False, "No face detected"

        result = self.users.update_one(
            {"_id": ObjectId(user_id)},
              {
              "$set": {
                "embedding": embedding,
                "faceRegistered": True,
                "status": "Unavailable"
              },
              "$currentDate": {
                "updatedAt": True
        }
    }
)

        if result.matched_count == 0:
            return False, "User not found"

        return True, "Face registered successfully"

    # ------------------------
    # Recognize Face (Model A)
    # ------------------------
    def recognize(self, image):
        embedding = self.generate_embedding(image)

        if embedding is None:
            return None, "No face detected"

        pipeline = [
            {
                "$vectorSearch": {
                    "index": config.VECTOR_INDEX_NAME,
                    "path": "embedding",
                    "queryVector": embedding,
                    "numCandidates": 100,
                    "limit": 1,
                    "filter": {
                        "faceRegistered": True,
                        "role": "worker"
                    }
                }
            }
        ]

        results = list(self.users.aggregate(pipeline))

        if len(results) == 0:
            return None, "No match found"

        best_match = results[0]
        score = best_match["score"]

        # Print for tuning
        print("Similarity Score:", score)

        if score < config.MATCH_THRESHOLD:
            self.users.update_one(
                {"_id": best_match["_id"]},
                {"$set": {"status": "Available"}}
            )
            return best_match["name"], None

        return None, "Face not recognized"

    # ------------------------
    # Set Unavailable
    # ------------------------
    def set_unavailable(self, user_id):
        self.users.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {"status": "Unavailable"}}
        )

    # ------------------------
    # Get All Status
    # ------------------------
    def get_status(self):
        users = list(self.users.find(
            {"faceRegistered": True},
            {"name": 1, "status": 1}
        ))

        for user in users:
            user["_id"] = str(user["_id"])

        return users