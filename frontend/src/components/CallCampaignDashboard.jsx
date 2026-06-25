import React, { useState } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:5001/api/voice';

export default function CallCampaignDashboard() {
  const [file, setFile] = useState(null);
  const [leads, setLeads] = useState([]);
  const [language, setLanguage] = useState('Bilingual');
  const [scriptTemplate, setScriptTemplate] = useState('Hi {{firstName}}, this is a quick validation call from CallIQ.');
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert("Select CSV first!");
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await axios.post(`${API_BASE}/upload`, formData);
      setLeads(res.data.leads || []);
      alert(`Loaded ${res.data.leads.length} leads.`);
    } catch (err) { alert("Upload failed."); }
    setIsUploading(false);
  };

  const handleRunCampaign = async () => {
    if (leads.length === 0) return alert("No leads to dial!");
    try {
      await axios.post(`${API_BASE}/run-campaign`, { 
        language, 
        scriptTemplate // Ye backend ko jana chahiye
      });
      alert("Campaign started successfully! 📞");
    } catch (err) { alert("Campaign start failed."); }
  };

  return (
    <div style={{ padding: '40px', background: '#0f172a', color: '#fff', minHeight: '100vh' }}>
      <h1>📞 CallIQ AI-Dialer</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button onClick={handleUpload} disabled={isUploading}>Upload</button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label>Language: </label>
        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option value="English">English</option>
          <option value="Hindi">Hindi</option>
          <option value="Bilingual">Bilingual</option>
        </select>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label>Script Template: </label>
        <textarea 
          value={scriptTemplate} 
          onChange={(e) => setScriptTemplate(e.target.value)}
          style={{ width: '100%', height: '80px', color: '#000' }}
        />
      </div>

      <button 
        onClick={handleRunCampaign} 
        disabled={leads.length === 0}
        style={{ padding: '10px 20px', background: '#10b981', border: 'none', color: '#fff', cursor: 'pointer' }}
      >
        🚀 Fire Campaign
      </button>

      <p style={{ marginTop: '20px' }}>Total Leads Loaded: {leads.length}</p>
    </div>
  );
}