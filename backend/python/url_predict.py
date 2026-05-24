# url_predict.py

import sys
import json
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification

# Load model
MODEL_NAME = "ealvaradob/bert-finetuned-phishing"

tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model     = AutoModelForSequenceClassification.from_pretrained(MODEL_NAME)

def predict_url(url):
    inputs = tokenizer(
        url,
        return_tensors="pt",
        truncation=True,
        max_length=128,
        padding="max_length"
    )

    with torch.no_grad():
        outputs = model(**inputs)

    probs      = torch.softmax(outputs.logits, dim=1)
    label      = torch.argmax(probs).item()
    confidence = probs[0][label].item()

    return {
        "url"        : url,
        "prediction" : "PHISHING" if label == 1 else "LEGITIMATE",
        "confidence" : f"{confidence:.2%}"
    }

if __name__ == "__main__":
    url    = sys.argv[1]
    result = predict_url(url)
    print(json.dumps(result))  # ONLY print JSON nothing else