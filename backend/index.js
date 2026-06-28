const express = require('express');
const cors = require('cors');
const multer = require('multer');
const csvParser = require('csv-parser');
const fs = require('fs');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const passport = require('passport');

require('dotenv').config();
require('./config/passport'); // ✅ Google strategy load

const authRoutes = require('./routes/auth');

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize()); // ✅ Passport middleware

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

const upload = multer({ dest: 'uploads/' });
let leadsDb = [];

// ==========================================
// MONGODB CONNECTION
// ==========================================
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected!'))
    .catch((err) => console.error('❌ MongoDB Error:', err.message));

// ==========================================
// CALL RESULT SCHEMA
// ==========================================
const CallResultSchema = new mongoose.Schema({
    callId:       { type: String, required: true, unique: true },
    leadId:       { type: String },
    customerName: { type: String },
    phone:        { type: String },
    status:       { type: String },
    endedReason:  { type: String },
    duration:     { type: Number },
    transcript:   { type: String },
    recordingUrl: { type: String },
    summary:      { type: String },
    createdAt:    { type: Date, default: Date.now }
});

const CallResult = mongoose.model('CallResult', CallResultSchema);

// ==========================================
// 1. AUTH ROUTES
// ==========================================
app.use('/api/auth', authRoutes);

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
            console.log('PARSED LEADS:', JSON.stringify(leadsDb));
            res.json({ success: true, message: "Parsed!", leads: leadsDb });
        });
});

app.post('/api/voice/run-campaign', async (req, res) => {
    const { scriptTemplate, language, systemPrompt } = req.body;
    const triggerReport = [];

    for (const lead of leadsDb) {
        const personalizedFirstMessage = scriptTemplate
            ? scriptTemplate.replace(/\{\{firstName\}\}/g, lead.name)
            : undefined;

        try {
            const vapiRes = await fetch('https://api.vapi.ai/call', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.VAPI_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    assistantId: process.env.VAPI_ASSISTANT_ID,
                    phoneNumberId: process.env.VAPI_PHONE_NUMBER_ID,
                    customer: {
                        number: lead.phone,
                        name: lead.name
                    },
                    assistantOverrides: {
                        ...(personalizedFirstMessage ? { firstMessage: personalizedFirstMessage } : {}),
                        ...(systemPrompt ? {
                            model: {
                                provider: "openai",
                                model: "gpt-4o-mini",
                                messages: [
                                    { role: "system", content: systemPrompt }
                                ]
                            }
                        } : {}),
                        variableValues: {
                            firstName: lead.name,
                            language: language || 'Hindi'
                        }
                    }
                })
            });

            const data = await vapiRes.json();
            console.log('VAPI RESPONSE for', lead.phone, ':', vapiRes.status, JSON.stringify(data));

            if (!vapiRes.ok) {
                throw new Error(data.message || JSON.stringify(data));
            }

            lead.status = 'queued';
            lead.vapiCallId = data.id;
            triggerReport.push({ leadId: lead.id, phone: lead.phone, status: 'queued', callId: data.id });
        } catch (err) {
            console.error("Call error:", err.message);
            lead.status = 'failed';
            triggerReport.push({ leadId: lead.id, phone: lead.phone, status: 'failed', error: err.message });
        }
    }
    res.json({ success: true, message: "Campaign fired!", report: triggerReport });
});

app.get('/api/voice/leads', (req, res) => res.json({ success: true, leads: leadsDb }));

// ==========================================
// 3. VAPI WEBHOOK
// ==========================================
app.post('/api/voice/vapi-webhook', async (req, res) => {
    const message = req.body.message;
    if (!message) return res.sendStatus(200);

    const callId = message.call?.id;

    if (message.type === 'status-update') {
        const status = message.status;
        const lead = leadsDb.find(l => l.vapiCallId === callId);
        if (lead) {
            if (['failed', 'busy', 'no-answer'].includes(status)) {
                lead.status = 'failed';
            } else {
                lead.status = status || lead.status;
            }
        }
    }

    if (message.type === 'end-of-call-report') {
        const lead = leadsDb.find(l => l.vapiCallId === callId);
        if (lead) lead.status = 'called';

        try {
            await CallResult.findOneAndUpdate(
                { callId },
                {
                    callId,
                    leadId:       lead?.id,
                    customerName: message.call?.customer?.name,
                    phone:        message.call?.customer?.number,
                    status:       'called',
                    endedReason:  message.endedReason,
                    duration:     message.call?.endedAt
                                    ? Math.round((new Date(message.call.endedAt) - new Date(message.call.startedAt)) / 1000)
                                    : null,
                    transcript:   message.transcript,
                    recordingUrl: message.recordingUrl,
                    summary:      message.summary,
                },
                { upsert: true, new: true }
            );
            console.log('✅ Call result saved to MongoDB for callId:', callId);
        } catch (err) {
            console.error('❌ MongoDB save error:', err.message);
        }
    }

    res.sendStatus(200);
});

// ==========================================
// 4. RESULTS FETCH ROUTE
// ==========================================
app.get('/api/voice/results', async (req, res) => {
    try {
        const results = await CallResult.find().sort({ createdAt: -1 });
        res.json({ success: true, results });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

const PORT = 5001;
app.listen(PORT, () => console.log(`🚀 Server running on ${PORT}`));

// ==========================================
// 5. DASHBOARD STATS ROUTE
// ==========================================
app.get('/api/dashboard/stats', async (req, res) => {
  try {
      const results = await CallResult.find().sort({ createdAt: -1 });
      
      // Unique campaigns group karo
      const stats = {
          totalCalls: results.length,
          called: results.filter(r => r.status === 'called').length,
          failed: results.filter(r => r.status === 'failed').length,
          recentCalls: results.slice(0, 10) // last 10 calls
      };
      
      res.json({ success: true, stats });
  } catch (err) {
      res.status(500).json({ success: false, message: err.message });
  }
});