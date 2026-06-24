import React, { useState, useEffect } from 'react';
import axios from 'axios';

// =========================================================================
// ⚠️ IMPORTANT: Ensure this matches your active ngrok tunnel URL
// =========================================================================
const API_BASE = 'https://reverend-research-elude.ngrok-free.dev/api/voice';

export default function CallCampaignDashboard() {
  const [file, setFile] = useState(null);
  const [leads, setLeads] = useState([]);
  const [scriptTemplate, setScriptTemplate] = useState('Hi {{firstName}}, this is a quick validation call from CallIQ setup framework.');
  const [isUploading, setIsUploading] = useState(false);
  const [isCampaignRunning, setIsCampaignRunning] = useState(false);

  // 1. Leads real-time sync polling mechanism setup
  const fetchLeadsStatus = async () => {
    try {
      const response = await axios.get(`${API_BASE}/leads`);
      if (response.data.success) {
        setLeads(response.data.leads || []);
      }
    } catch (err) {
      console.error("Status check update sync failed:", err.message);
    }
  };

  // Poll server state every 3 seconds to update statuses dynamically
  useEffect(() => {
    fetchLeadsStatus(); // Initial load
    
    const interval = setInterval(() => {
      fetchLeadsStatus();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // 2. CSV File selected state tracking
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      console.log("📁 File selected in memory:", e.target.files[0].name);
    }
  };

  // 3. Backend handler to trigger bulk parser processing logic
  const handleUpload = async (e) => {
    if (e) e.preventDefault(); 
    if (!file) return alert("Bhai, pehle koi acchi si CSV file select toh karo!");

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${API_BASE}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.success) {
        // Now fully compatible with backend explicit message response!
        alert(response.data.message || "List imported successfully! 🎉");
        setLeads(response.data.leads || []);
      }
    } catch (err) {
      console.error("Upload error context:", err);
      alert("CSV upload failure. Ensure ngrok server tunnel is up and listening.");
    } finally {
      setIsUploading(false);
    }
  };

  // 4. Trigger dialer campaign across dynamic lists
  const handleRunCampaign = async () => {
    if (leads.length === 0) return alert("List completely khali hai! Pehle CSV populate karo.");
    if (!scriptTemplate.trim()) return alert("Bhai, script text area khali nahi rakh sakte!");

    setIsCampaignRunning(true);
    try {
      const response = await axios.post(`${API_BASE}/run-campaign`, { scriptTemplate });
      if (response.data.success) {
        alert(response.data.message || "Campaign successfully fired up! Sabhi numbers par calls jaa rahi hain. 📞");
      }
    } catch (err) {
      console.error("Campaign run error:", err);
      alert("Campaign runtime processing execution failed.");
    } finally {
      setIsCampaignRunning(false);
    }
  };

  return (
    <div style={{ padding: '30px', fontFamily: 'sans-serif', backgroundColor: '#0f172a', color: '#f8fafc', minHeight: '100vh' }}>
      <h1 style={{ borderBottom: '2px solid #334155', paddingBottom: '10px' }}>📞 CallIQ Auto-Dialer Platform Engine v1</h1>
      
      {/* SECTION A: CSV FILE CONTROLLER */}
      <div style={{ background: '#1e293b', padding: '20px', borderRadius: '8px', margin: '20px 0' }}>
        <h3>Step 1: Upload Contact CSV Dataset</h3>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginTop: '15px' }}>
          <input 
            type="file" 
            accept=".csv" 
            onChange={handleFileChange} 
            style={{ 
              color: '#94a3b8',
              background: '#0f172a',
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid #475569',
              cursor: 'pointer'
            }} 
          />
          <button 
            type="button" 
            onClick={handleUpload} 
            disabled={isUploading} 
            style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            {isUploading ? 'Uploading & Parsing...' : 'Parse File & Add List'}
          </button>
        </div>
        <p style={{ fontSize: '12px', color: '#64748b', marginTop: '8px' }}>* Tip: File must contain headers like: <strong>name, phone</strong></p>
      </div>

      {/* SECTION B: SCRIPT ENGINE EDIT AREA */}
      <div style={{ background: '#1e293b', padding: '20px', borderRadius: '8px', margin: '20px 0' }}>
        <h3>Step 2: Script Speech Engine Customizer</h3>
        <textarea
          value={scriptTemplate}
          onChange={(e) => setScriptTemplate(e.target.value)}
          rows="4"
          style={{ width: '100%', padding: '10px', background: '#0f172a', border: '1px solid #475569', color: 'white', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box' }}
        />
        <p style={{ fontSize: '13px', color: '#38bdf8', marginTop: '5px' }}>
          Use <strong>{"{{firstName}}"}</strong> dynamic tags internally. System calls dynamically pick row contexts on execution.
        </p>
      </div>

      {/* ACTION ENGINE TOGGLE TRIGGER */}
      <div style={{ margin: '25px 0' }}>
        <button
          onClick={handleRunCampaign}
          disabled={isCampaignRunning || leads.length === 0}
          style={{ 
            width: '100%', 
            background: leads.length === 0 ? '#475569' : '#10b981', 
            color: 'white', 
            border: 'none', 
            padding: '15px', 
            borderRadius: '6px', 
            fontSize: '16px', 
            fontWeight: 'bold', 
            cursor: leads.length === 0 ? 'not-allowed' : 'pointer', 
            transition: '0.2s opacity' 
          }}
        >
          {isCampaignRunning ? 'Dialer Engine System Live Running...' : '🚀 Fire Outbound Dialer Script List'}
        </button>
      </div>

      {/* SECTION C: LIVE CONTEXT POLLING TRACKER */}
      <div style={{ background: '#1e293b', padding: '20px', borderRadius: '8px' }}>
        <h3>Live Activity Tracking Monitor Panel</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px', fontSize: '14px' }}>
          <thead>
            <tr style={{ background: '#334155', textAlign: 'left' }}>
              <th style={{ padding: '12px' }}>Lead Internal ID</th>
              <th style={{ padding: '12px' }}>Customer Name</th>
              <th style={{ padding: '12px' }}>Assigned Phone Number</th>
              <th style={{ padding: '12px', textAlign: 'center' }}>Live Outbound State Status</th>
            </tr>
          </thead>
          <tbody>
            {leads.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>Bhai koi data nahi mila, pehle top side se CSV compile karo!</td>
              </tr>
            ) : (
              leads.map((lead) => (
                <tr key={lead.id} style={{ borderBottom: '1px solid #334155' }}>
                  <td style={{ padding: '12px', color: '#94a3b8' }}>{lead.id}</td>
                  <td style={{ padding: '12px', fontWeight: 'bold' }}>{lead.name}</td>
                  <td style={{ padding: '12px' }}>{lead.phone}</td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      background: lead.status === 'called' ? '#065f46' : lead.status === 'failed' ? '#991b1b' : lead.status === 'queued' ? '#854d0e' : '#475569',
                      color: 'white'
                    }}>
                      {lead.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}