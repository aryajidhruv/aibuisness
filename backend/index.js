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
app.use(cors());

// Ensure uploads directory exists
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

const upload = multer({ dest: 'uploads/' });

// In-Memory DB
let leadsDb = []; 
let currentScript = "Hi {{firstName}}, this is an automated outbound check from our platform.";

// Twilio Setup safely wrapped
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = accountSid && authToken ? twilio(accountSid, authToken) : null;

// ==========================================
// 🔐 GOOGLE AUTH ROUTE PASS-THROUGH (FIX)
// ==========================================
app.post('/api/auth/google', (req, res) => {
  console.log("📥 Auth Token received from frontend:", req.body.token ? "YES" : "NO");
  
  // Return successful dummy user response to unblock the frontend dashboard route instantly
  res.json({
    success: true,
    message: "Authentication successful",
    user: {
      name: "Dhruv Arya",
      email: "aryajiidhruv@gmail.com"
    },
    token: "dummy-jwt-token-for-v1"
  });
});


// 1. CSV Parse Route
app.post('/api/voice/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'File missing' });

  const results = [];
  let idCounter = 1;

  fs.createReadStream(req.file.path)
    .pipe(csvParser())
    .on('data', (data) => {
      const name = data.name || data.firstName || data.Name || '';
      const phone = data.phone || data.Phone || '';
      if (phone) {
        results.push({ id: idCounter++, name, phone: phone.trim(), status: 'pending' });
      }
    })
    .on('end', () => {
      leadsDb = results;
      try {
        fs.unlinkSync(req.file.path);
      } catch (e) { console.log("File cleanup bypass"); }
      res.json({ success: true, leads: leadsDb });
    })
    .on('error', (err) => {
      res.status(500).json({ success: false, message: 'CSV parse failed' });
    });
});

// 2. Poll Status
app.get('/api/voice/leads', (req, res) => {
  res.json({ success: true, leads: leadsDb });
});

// 3. Run Campaign
app.post('/api/voice/run-campaign', async (req, res) => {
  if (req.body.scriptTemplate) currentScript = req.body.scriptTemplate;
  
  if (!twilioClient) {
    return res.status(500).json({ success: false, message: 'Twilio env components are missing!' });
  }

  res.json({ success: true, message: 'Campaign started.' });

  for (let lead of leadsDb) {
    if (lead.status === 'called') continue;
    try {
      await twilioClient.calls.create({
        to: lead.phone,
        from: process.env.TWILIO_PHONE_NUMBER,
        url: `${process.env.PUBLIC_BASE_URL}/api/voice/twiml/start/${lead.id}`,
        method: 'POST',
      });
    } catch (err) {
      console.error(`Failed for entry ${lead.id}:`, err.message);
      lead.status = 'failed';
    }
  }
});

// 4. Twilio Webhook Instruction
app.post('/api/voice/twiml/start/:id', (req, res) => {
  const leadId = parseInt(req.params.id);
  const lead = leadsDb.find(l => l.id === leadId);
  
  let personalizedText = currentScript;
  if (lead) {
    personalizedText = currentScript.replace('{{firstName}}', lead.name);
  }

  const response = new twilio.twiml.VoiceResponse();
  response.say({ voice: 'Polly.Joanna-Neural' }, personalizedText);
  response.pause({ length: 1 });
  response.say('Goodbye!');

  if (lead) lead.status = 'called';

  res.type('text/xml');
  res.send(response.toString());
});

app.get('/', (req, res) => {
  res.send("Dialer Engine Online 🚀");
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Automated Dial Server is permanently online on port ${PORT}`);
});