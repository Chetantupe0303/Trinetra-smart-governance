from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
from dotenv import load_dotenv

from utils.facenet_engine import FaceNetEngine
  
load_dotenv()

app = Flask(__name__)
# Allow requests from the Vite dev server if needed
CORS(app, supports_credentials=True , resources={r"/*": {"origins": ["http://localhost:5173", "http://127.0.0.1:5173"]}})

engine = FaceNetEngine()


# -------------------------
# Register Face
# -------------------------
@app.route("/register-face", methods=["POST"])
def register_face():
    user_id = request.form.get("userId")
    file = request.files.get("image")

    if not user_id or not file:
        return jsonify({"error": "userId and image required"}), 400

    image_bytes = file.read()

    np_img = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(np_img, cv2.IMREAD_COLOR)
    rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

    success, message = engine.register_face(user_id, rgb)

    if not success:
        return jsonify({"error": message}), 400

    return jsonify({"message": message})


# -------------------------
# Recognize Face
# -------------------------
@app.route("/recognize", methods=["POST"])
def recognize():
    file = request.files.get("image")

    if not file:
        return jsonify({"error": "Image required"}), 400

    image_bytes = file.read()

    np_img = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(np_img, cv2.IMREAD_COLOR)
    rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

    name, error = engine.recognize(rgb)
    
    if error:
        return jsonify({"recognized": False, "error": error})

    return jsonify({"recognized": True, "name": name})


# -------------------------
# Set Unavailable
# -------------------------
@app.route("/set-unavailable", methods=["POST"])
def set_unavailable():
    data = request.json
    user_id = data.get("userId")

    if not user_id:
        return jsonify({"error": "userId required"}), 400

    engine.set_unavailable(user_id)
    return jsonify({"message": "User set to Unavailable"})


# -------------------------
# Get Status
# -------------------------
@app.route("/status", methods=["GET"])
def status():
    return jsonify(engine.get_status())



if __name__ == "__main__":
    app.run(debug=True)