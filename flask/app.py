import torch
import torch.nn as nn
from flask import Flask, request, jsonify
from PIL import Image
import torchvision.transforms as transforms
from huggingface_hub import snapshot_download
from transformers import pipeline
import os
import sys

app = Flask(__name__)

repo_path = snapshot_download("SoloScript/SmartGovModel")

sys.path.append(repo_path)

from model import build_model

model = build_model(4)
model.load_state_dict(torch.load(os.path.join(repo_path, "ImageModel.pth"), map_location="cpu"))
model.eval()

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(
        [0.485, 0.456, 0.406],
        [0.229, 0.224, 0.225]
    )
])

text_classifier = pipeline(
    "zero-shot-classification",
    model="valhalla/distilbart-mnli-12-3"
)

classnames = ["Drainage", "Road_Damage", "Street_Light", "Trash"]

@app.route("/classify-image", methods=["POST"])
def classify_image():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    image = Image.open(file).convert("RGB")
    image = transform(image).unsqueeze(0)

    with torch.no_grad():
        outputs = model(image)
        _, predicted = torch.max(outputs, 1)

    return jsonify({"classification": classname[int(predicted.item())]})


@app.route("/classify-text", methods=["POST"])
def classify_text():
    data = request.get_json()

    if not data or "text" not in data:
        return jsonify({"error": "Send JSON with 'text' field"}), 400

    text = data["text"]
    candidate_labels = classnames

    result = text_classifier(text, candidate_labels)

    return jsonify({"classification": result["labels"][0]})

