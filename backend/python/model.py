# model.py

from transformers import AutoTokenizer, AutoModelForSequenceClassification

def load_model():
    print("Loading model...")

    MODEL_NAME = "ealvaradob/bert-finetuned-phishing"  # ✅ correct

    tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
    model = AutoModelForSequenceClassification.from_pretrained(MODEL_NAME)

    print("✅ Model loaded successfully!")
    return tokenizer, model