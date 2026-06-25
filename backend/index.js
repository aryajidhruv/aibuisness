const express = require('express');
const cors = require('cors');
const multer = require('multer');
const csvParser = require('csv-parser');
const fs = require('fs');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors({ origin: '*' })); // Allow all origins for testing, update to specific URL later

const upload = multer({ dest: 'uploads/' });
let leadsDb = [];

// ==========================================
// 1. AUTH ROUTES (Fixing 404 Error)
// ==========================================
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    console.log("Login attempt for:", email);
    // Yahan apna DB logic add karo
    res.json({ success: true, message: "Login successful!", token: "mock-jwt-token" });
});

app.post('/api/auth/google', (req, res) => {
    console.log("Google Auth token received.");
    res.json({ success: true, message: "Google Auth successful!", token: "mock-google-token" });
});

// ==========================================
// 2. VOICE CAMPAIGN ROUTES
// ==========================================
app.post('/api/voice/upload', upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).json({ success: false, message: 'File missing!' });
    const results = [];
    fs.createReadStream(req.file.path)
        .pipe(csvParser({ mapHeaders: ({ header }) => header.trim().toLowerCase() }))
        .on('data', (data) => {
            const name = data.name || data.firstname || 'Customer';
            const phone = data.phone || data.number || '';
            if (phone) results.push({ id: Math.random().toString(36).substr(2, 9), name, phone, status: 'pending' });
        })
        .on('end', () => {
            leadsDb = results;
            fs.unlinkSync(req.file.path);
            res.json({ success: true, message: "Parsed!", leads: leadsDb });
        });
});

app.post('/api/voice/run-campaign', async (req, res) => {
    const { scriptTemplate, language } = req.body;
    
    // Asynchronous calls handling
    for (const lead of leadsDb) {
        try {
            await fetch('https://api.retellai.com/v2/create-phone-call', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.RETELL_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    from_number: process.env.TWILIO_PHONE_NUMBER,
                    to_number: lead.phone,
                    override_agent_id: process.env.RETELL_AGENT_ID,
                    retell_llm_dynamic_variables: { 
                        firstName: lead.name, 
                        custom_script: scriptTemplate, 
                        language 
                    }
                })
            });
            lead.status = 'called';
        } catch (err) { 
            console.error("Call error:", err);
            lead.status = 'failed'; 
        }
    }
    res.json({ success: true, message: "Campaign fired!" });
});

app.get('/api/voice/leads', (req, res) => res.json({ success: true, leads: leadsDb }));

const PORT = 5001;
app.listen(PORT, () => console.log(`🚀 Server running on ${PORT}`));