const express = require('express');
const cors = require('cors');
const multer = require('multer');
const csvParser = require('csv-parser');
const fs = require('fs');
const twilio = require('twilio');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({ origin: '*' }));

const upload = multer({ dest: 'uploads/' });

// In-Memory DB
let leadsDb = []; 
let currentScript = "Hi {{firstName}}, this is an automated outbound check from our platform.";

// Twilio Setup
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = accountSid && authToken ? twilio(accountSid, authToken) : null;

// ==========================================
// 🔐 GOOGLE AUTH ROUTE (MISSING THA, AB ADDED HAI)
// ==========================================
app.post('/api/auth/google', (req, res) => {
  console.log("📥 Auth Token received from frontend.");
  // Yahan tumhara logic ayega (user ko DB mein check karna/save karna)
  res.json({
    success: true,
    message: "Authentication successful",
    token: "mock-token-123"
  });
});

// ==========================================
// 1. CSV PARSE ROUTE
// ==========================================
app.post('/api/voice/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'File missing!' });

  const results = [];
  let idCounter = 1;

  fs.createReadStream(req.file.path)
    .pipe(csvParser())
    .on('data', (data) => {
      const name = data.name || data.firstName || 'Customer';
      const phone = data.phone || data.Phone || '';
      if (phone) {
        results.push({ id: idCounter++, name: name.trim(), phone: phone.trim(), status: 'pending' });
      }
    })
    .on('end', () => {
      leadsDb = results;
      fs.unlinkSync(req.file.path);
      res.json({ success: true, message: "List imported successfully! 🎉", leads: leadsDb });
    });
});

// ==========================================
// 2. RUN CAMPAIGN
// ==========================================
app.post('/api/voice/run-campaign', async (req, res) => {
  if (req.body.scriptTemplate) currentScript = req.body.scriptTemplate;
  
  if (!twilioClient) return res.status(500).json({ success: false, message: 'Twilio invalid' });

  res.json({ success: true, message: 'Campaign triggered! 📞' });

  for (let lead of leadsDb) {
    if (lead.status === 'called') continue;
    try {
      lead.status = 'queued';
      const cleanPhone = lead.phone.replace(/[\s-]/g, '');
      
      await twilioClient.calls.create({
        to: cleanPhone,
        from: process.env.TWILIO_PHONE_NUMBER,
        url: `${process.env.PUBLIC_BASE_URL}/api/voice/twiml/start/${lead.id}`,
        method: 'POST',
      });
      console.log(`📡 Call fired to: ${cleanPhone}`);
    } catch (err) {
      console.error(`❌ Fail ID ${lead.id}:`, err.message);
      lead.status = 'failed';
    }
  }
});

// ==========================================
// 3. TWILIO WEBHOOK
// ==========================================
app.post('/api/voice/twiml/start/:id', (req, res) => {
  const leadId = parseInt(req.params.id);
  const lead = leadsDb.find(l => l.id === leadId);
  
  const personalizedText = lead ? currentScript.replace('{{firstName}}', lead.name) : currentScript;

  console.log(`📞 Serving TwiML for Lead ID: ${leadId}`);

  const twiml = new twilio.twiml.VoiceResponse();
  twiml.say({ voice: 'Polly.Joanna-Neural', language: 'en-US' }, personalizedText);
  twiml.pause({ length: 1 });
  twiml.say('Thank you, goodbye!');

  if (lead) lead.status = 'called';

  res.set('Content-Type', 'text/xml');
  res.send(twiml.toString());
});

app.get('/api/voice/leads', (req, res) => res.json({ success: true, leads: leadsDb }));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server online on port ${PORT}`));