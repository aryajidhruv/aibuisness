const express = require('express');
const router = express.Router();
const twilio = require('twilio');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');

// Multer temporary uploads storage location define kar raha hai
const upload = multer({ dest: 'uploads/' });

// Twilio Client setup
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;

// In-memory data store (MVP ke liye perfect hai)
const leadsDatabase = []; 
const callSessions = new Map(); 

/**
 * 1. CSV UPLOAD ROUTE
 * POST /api/voice/upload
 */
router.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: "Bhai, file upload karna bhool gaya!" });
    }

    const results = [];
    
    fs.createReadStream(req.file.path)
        .pipe(csv())
        .on('data', (data) => {
            const name = data.name || data.firstName || 'Customer';
            let phone = data.phone || '';

            phone = phone.trim().replace(/\s+/g, '');
            if (phone && !phone.startsWith('+')) {
                if (phone.length === 10) phone = '+91' + phone;
                else phone = '+' + phone;
            }

            if (phone) {
                results.push({
                    id: 'lead_' + Math.random().toString(36).substr(2, 9),
                    name: name,
                    phone: phone,
                    status: 'pending'
                });
            }
        })
        .on('end', () => {
            leadsDatabase.length = 0; // Purani leads clear karo
            leadsDatabase.push(...results);
            fs.unlinkSync(req.file.path); // Temp file delete karo

            return res.json({
                success: true,
                message: `${results.length} leads successfully upload ho gayi hain!`,
                leads: leadsDatabase
            });
        })
        .on('error', (err) => {
            return res.status(500).json({ success: false, error: err.message });
        });
});

/**
 * 2. GET CURRENT LEADS LIST
 * GET /api/voice/leads
 */
router.get('/leads', (req, res) => {
    return res.json({ success: true, leads: leadsDatabase });
});

/**
 * 3. RUN CAMPAIGN LOOP
 * POST /api/voice/run-campaign
 */
router.post('/run-campaign', async (req, res) => {
    const { scriptTemplate } = req.body;

    if (leadsDatabase.length === 0 || !scriptTemplate) {
        return res.status(400).json({ success: false, message: "Data incomplete hai boss!" });
    }

    const triggerReport = [];

    for (let lead of leadsDatabase) {
        const sessionId = 'sess_' + Math.random().toString(36).substr(2, 9);
        const customizedScript = scriptTemplate.replace(/\{\{firstName\}\}/g, lead.name);

        callSessions.set(sessionId, {
            leadId: lead.id,
            name: lead.name,
            phone: lead.phone,
            script: customizedScript,
            status: 'queued'
        });

        lead.status = 'queued';

        try {
            const publicUrl = process.env.PUBLIC_BASE_URL;

            const call = await client.calls.create({
                to: lead.phone,
                from: twilioNumber,
                url: `${publicUrl}/api/voice/twiml/start/${sessionId}`,
                method: 'POST',
                statusCallback: `${publicUrl}/api/voice/twiml/status/${sessionId}`,
                statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed', 'failed'],
                statusCallbackMethod: 'POST'
            });

            triggerReport.push({ leadId: lead.id, phone: lead.phone, status: 'queued', callSid: call.sid });
        } catch (err) {
            lead.status = 'failed';
            triggerReport.push({ leadId: lead.id, phone: lead.phone, status: 'failed', error: err.message });
        }
    }

    return res.json({ success: true, report: triggerReport });
});

/**
 * 4. TWIML WEBHOOK FOR START
 * POST /api/voice/twiml/start/:sessionId
 */
router.post('/twiml/start/:sessionId', (req, res) => {
    const { sessionId } = req.params;
    const session = callSessions.get(sessionId);

    res.type('text/xml');

    if (!session) {
        return res.send(`<Response><Say>Session error</Say><Hangup/></Response>`);
    }

    const twiml = `
        <Response>
            <Say voice="Polly.Joanna-Neural">${session.script}</Say>
            <Pause length="1"/>
            <Hangup/>
        </Response>
    `;

    session.status = 'in-progress';
    const originalLead = leadsDatabase.find(l => l.id === session.leadId);
    if (originalLead) originalLead.status = 'called';

    return res.send(twiml);
});

/**
 * 5. TWIML STATUS CALLBACK
 * POST /api/voice/twiml/status/:sessionId
 */
router.post('/twiml/status/:sessionId', (req, res) => {
    const { sessionId } = req.params;
    const { CallStatus } = req.body;

    const session = callSessions.get(sessionId);
    if (session) {
        session.status = CallStatus;
        const originalLead = leadsDatabase.find(l => l.id === session.leadId);
        if (originalLead) {
            if (CallStatus === 'completed') originalLead.status = 'called';
            else if (['failed', 'busy', 'no-answer'].includes(CallStatus)) originalLead.status = 'failed';
            else originalLead.status = CallStatus;
        }
    }
    return res.sendStatus(200);
});

module.exports = router;