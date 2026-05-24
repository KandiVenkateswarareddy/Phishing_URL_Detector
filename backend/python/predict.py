# predict.py
# STEP 2 - Tokenize URL
# STEP 3 - Get Prediction

import torch
from model import load_model

# Load model once
tokenizer, model = load_model()

def predict_url(url):

    # STEP 2 - Tokenize
    inputs = tokenizer(
        url,
        return_tensors="pt",
        truncation=True,
        max_length=128,
        padding="max_length"
    )

    # STEP 3 - Predict
    with torch.no_grad():
        outputs = model(**inputs)

    probs = torch.softmax(outputs.logits, dim=1)
    label = torch.argmax(probs).item()
    confidence = probs[0][label].item()

    return {
        "url"        : url,
        "prediction" : "PHISHING" if label == 1 else "LEGITIMATE",
        "confidence" : f"{confidence:.2%}"
    }