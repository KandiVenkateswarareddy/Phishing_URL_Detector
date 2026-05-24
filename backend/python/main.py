# main.py

from predict import predict_url

print("=" * 50)
print("   🔍 Phishing URL Detector")
print("=" * 50)

while True:

    print("\nType 'exit' to quit")
    url = input("\nEnter URL : ").strip()

    # Exit
    if url.lower() == "exit":
        print("\nGoodbye! 👋")
        break

    # Empty check
    if url == "":
        print("\n⚠️  Please enter a URL!")
        continue

    # Check URL starts with http
    if not url.startswith("http"):
        print("\n⚠️  Please enter a valid URL starting with http:// or https://")
        continue

    # Predict
    result = predict_url(url)

    # Output
    print("\n" + "=" * 50)
    print(f"  URL        : {result['url']}")

    if result['prediction'] == "PHISHING":
        print(f"  Prediction : 🚨 PHISHING  (Dangerous!)")
    else:
        print(f"  Prediction : ✅ LEGITIMATE (Safe)")

    print(f"  Confidence : {result['confidence']}")
    print("=" * 50)