import torch
import torch.nn as nn
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import torchvision.transforms as transforms
from huggingface_hub import snapshot_download
import os
import sys
import requests
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
# Allow requests from the Vite dev server if needed
CORS(app, supports_credentials=True , resources={r"/*": {"origins": ["http://localhost:5173", "http://127.0.0.1:5173"]}})

repo_path = snapshot_download("SoloScript/SmartGovModel")

sys.path.append(repo_path)

from model import build_model

model = build_model(4)
model.load_state_dict(torch.load(os.path.join(repo_path, "image_modelv2.pth"), map_location="cpu"))
model.eval()

transform = transforms.Compose([
    transforms.Resize((256, 256)),
    transforms.ToTensor(),
    transforms.Normalize(
        [0.485, 0.456, 0.406],
        [0.229, 0.224, 0.225]
    )
])

classnames = ["Drainage", "Road-Damage", "Street-Light", "Trash"]

@app.route("/classify-image", methods=["POST"])
def classify_image():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    image = Image.open(file).convert("RGB")
    image = transform(image).unsqueeze(0)

    with torch.no_grad():
        outputs = model(image)
        probabilities = torch.nn.functional.softmax(outputs, dim=1)
        confidence, predicted = torch.max(probabilities, 1)

    return jsonify({
        "classification": classnames[int(predicted.item())],
        "confidence": float(confidence.item())
    })


@app.route("/classify-text", methods=["POST"])
def classify_text():
    data = request.get_json()

    if not data or "text" not in data:
        return jsonify({"error": "Send JSON with 'text' field"}), 400

    text = data["text"]
    token = os.getenv("HF_TOKEN")

    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"

    try:
        # -------------------
        # CATEGORY PREDICTION
        # -------------------
        category_payload = {
            "inputs": text,
            "parameters": {
                "candidate_labels": ["Drainage", "Road-Damage", "Street-Light", "Trash"],
                "multi_label": False
            }
        }

        category_res = requests.post(
            "https://router.huggingface.co/hf-inference/models/facebook/bart-large-mnli",
            headers=headers,
            json=category_payload,
            timeout=30,
        )
        category_res.raise_for_status()
        category_result = category_res.json()

        if isinstance(category_result, list):
            category_result = category_result[0]
        print(category_result)

        category_label = category_result["label"]
        category_score = category_result["score"]   

        # -------------------
        # PRIORITY PREDICTION
        # -------------------
        priority_payload = {
            "inputs": f"Determine the urgency level of this municipal complaint. Complaint: {text}",
            "parameters": {
                "candidate_labels": ["Low Priority", "Medium Priority", "High Priority"],
                "multi_label": False
            }
        }

        priority_res = requests.post(
            "https://router.huggingface.co/hf-inference/models/facebook/bart-large-mnli",
            headers=headers,
            json=priority_payload,
            timeout=30,
        )
        priority_res.raise_for_status()
        priority_result = priority_res.json()
        if isinstance(priority_result, list):
            priority_result = priority_result[0]
        print(priority_result)

        priority_label = priority_result["label"]
        priority_score = priority_result["score"]

    except Exception as e:
        return jsonify({"error": f"Text classification failed: {str(e)}"}), 502

    return jsonify({
        "category": category_label,
        "category_confidence": float(category_score),
        "priority": priority_label,
        "priority_confidence": float(priority_score)
    })

if __name__ == "__main__":
    app.run(debug=True)
