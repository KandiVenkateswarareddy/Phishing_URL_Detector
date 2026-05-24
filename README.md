# 🛡️ PhishGuard — Phishing URL Detector

A full-stack web application that uses a fine-tuned BERT model to detect whether a URL is a **phishing link** or **legitimate**. Paste any URL into the browser interface and get an instant prediction with a confidence score.


---

## 📁 Project Structure

```
Phishing_URL_Detector/
├── backend/
│   ├── server.js           # Node.js Express server
│   ├── package.json        # Node dependencies (express, cors)
│   └── python/
│       ├── url_predict.py  # Main prediction script
│       ├── model.py        # Model loader
│       └── predict.py      # Prediction logic
│
├── frontend/
│   ├── index.html          # Main UI
│   ├── style.css           # Styling
│   └── app.js              # Frontend logic
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v16 or higher
- **Python** 3.8 or higher
- **pip**

---

### 1. Install Python Dependencies

```bash
pip install torch transformers accelerate
```

> **Note:** The BERT model (`ealvaradob/bert-finetuned-phishing`) is downloaded automatically from HuggingFace on first run (~440 MB). It is cached locally after that.

---

### 2. Install Node.js Dependencies

```bash
cd backend
npm install
```

---

### 3. Start the Server

```bash
cd backend
npm start
# or
node server.js
```

The server starts on **http://localhost:3000**.

Open your browser and go to **http://localhost:3000** — the frontend is served automatically.

---

## 🔍 How It Works

```
Browser  →  POST /api/scan/url  →  Express (server.js)
                                        ↓
                               spawn Python process
                                        ↓
                            url_predict.py <url>
                                        ↓
                       Load BERT model (cached after first run)
                       Tokenize URL → Run inference → Softmax
                                        ↓
                          Print JSON result to stdout
                                        ↓
                         Express parses last stdout line
                                        ↓
                         Return JSON response to browser
```

1. The user enters a URL in the browser and clicks **Scan URL**.
2. `app.js` sends a `POST` request to `http://localhost:3000/api/scan/url` with `{ url }` in the body.
3. `server.js` spawns `url_predict.py` as a child process, passing the URL as a command-line argument.
4. `url_predict.py` tokenizes the URL with BERT's tokenizer (max 128 tokens), runs a forward pass, applies softmax, and prints a single JSON line to stdout.
5. The Express server reads the last line of stdout, parses it as JSON, and returns it to the browser.
6. `app.js` renders a **result card** showing the prediction, confidence score, and a color-coded confidence bar.

---


## 🖥️ Frontend

The UI is a single-page dark-themed interface:

- **Navbar** — branding with "🛡️ PhishGuard" logo
- **Input box** — URL text field with Enter-key support and a Scan button
- **Loading spinner** — shown while the model runs
- **Result card** — displays prediction, confidence, status, and an animated confidence bar
  - 🚨 Red card for phishing, ✅ green card for legitimate
- **Example buttons** — one-click test URLs (google.com, github.com, a suspicious URL)

---

## 🤖 ML Model

The model used is **[`ealvaradob/bert-finetuned-phishing`](https://huggingface.co/ealvaradob/bert-finetuned-phishing)** — a BERT model fine-tuned on a phishing URL dataset for binary sequence classification.

| Label | Index | Meaning    |
|-------|-------|------------|
| 0     | 0     | LEGITIMATE |
| 1     | 1     | PHISHING   |

The Python files are organized as follows:

| File             | Purpose |
|------------------|---------|
| `url_predict.py` | Entry point called by the Node server via `spawn`. Loads the model, runs prediction, outputs JSON. |
| `model.py`       | `load_model()` helper that downloads and returns the tokenizer + model from HuggingFace. |
| `predict.py`     | Reusable `predict_url()` function containing the core tokenization and inference logic. |

---

## ⚠️ Known Behaviour

- **First scan is slow** — the BERT model (~440 MB) is downloaded and loaded on the first request. Subsequent scans in the same session are much faster.
- The Node server spawns a **new Python process per request**, which means the model is reloaded each time. For production use, consider running a persistent Python API (e.g. with FastAPI or Flask) and proxying to it.
- Python stderr output (model loading info from `transformers`) is intentionally ignored by the server — this is expected behaviour.



---

## 📄 License

This project is open source. Feel free to use, modify, and distribute it.
