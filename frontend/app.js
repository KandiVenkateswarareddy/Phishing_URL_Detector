// app.js

const API = 'http://localhost:3000/api';

function handleKey(event) {
    if (event.key === 'Enter') scanURL();
}

function setURL(url) {
    document.getElementById('urlInput').value = url;
    scanURL();
}

async function scanURL() {
    const url    = document.getElementById('urlInput').value.trim();
    const btn    = document.getElementById('scanBtn');
    const result = document.getElementById('result');

    if (!url) {
        alert('Please enter a URL!');
        return;
    }

    // Show loading
    btn.disabled = true;
    btn.textContent = 'Scanning...';
    document.getElementById('loading').style.display = 'block';
    result.style.display = 'none';

    try {
        const res  = await fetch(`${API}/scan/url`, {
            method  : 'POST',
            headers : { 'Content-Type': 'application/json' },
            body    : JSON.stringify({ url })
        });

        const data = await res.json();
        showResult(data);

    } catch (err) {
        alert('Error! Make sure server is running.\nRun: node server.js');
    }

    // Hide loading
    document.getElementById('loading').style.display = 'none';
    btn.disabled    = false;
    btn.textContent = 'Scan URL';
}

function showResult(data) {
    const isPhishing = data.prediction === 'PHISHING';
    const resultDiv  = document.getElementById('result');
    const type       = isPhishing ? 'phishing' : 'legitimate';
    const confidence = parseFloat(data.confidence);

    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `
        <div class="result-card">

            <div class="result-header ${type}">
                <div class="result-icon">
                    ${isPhishing ? '🚨' : '✅'}
                </div>
                <div>
                    <div class="result-title ${type}">
                        ${isPhishing ? 'Phishing Link Detected!' : 'URL is Safe'}
                    </div>
                    <div class="result-url">${data.url}</div>
                </div>
            </div>

            <div class="result-details">
                <div class="detail">
                    <label>Prediction</label>
                    <span>${data.prediction}</span>
                </div>
                <div class="detail">
                    <label>Confidence</label>
                    <span>${data.confidence}</span>
                </div>
                <div class="detail">
                    <label>Status</label>
                    <span>${isPhishing ? '⚠️ Dangerous' : '🟢 Safe'}</span>
                </div>
            </div>

            <div class="confidence-bar-wrap">
                <div class="bar-label">Confidence Level</div>
                <div class="bar-bg">
                    <div class="bar-fill ${type}"
                         style="width: ${confidence}%">
                    </div>
                </div>
            </div>

        </div>`;
}