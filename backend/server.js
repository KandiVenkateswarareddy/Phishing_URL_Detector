// server.js

const express   = require('express');
const cors      = require('cors');
const { spawn } = require('child_process');
const path      = require('path');

const app  = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

app.post('/api/scan/url', (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    const python = spawn('python', [
        path.join(__dirname, 'python/url_predict.py'),
        url
    ]);

    let output = '';
    let errors = '';

    python.stdout.on('data', (data) => {
        output += data.toString();
    });

    python.stderr.on('data', (data) => {
        errors += data.toString();
        // Normal — transformers prints loading info to stderr
    });

    python.on('close', (code) => {
        console.log('=== Python Output ===');
        console.log(output);
        console.log('=== Python Errors ===');
        console.log(errors);

        try {
            // Get last line — always the JSON result
            const lines      = output.trim().split('\n');
            const lastLine   = lines[lines.length - 1].trim();
            const prediction = JSON.parse(lastLine);
            res.json(prediction);

        } catch (e) {
            console.error('Parse error:', e);
            res.status(500).json({ error: 'Prediction failed' });
        }
    });
});

app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
});