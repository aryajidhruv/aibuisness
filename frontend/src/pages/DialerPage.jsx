import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}/api/voice`;

const EASE = [0.16, 1, 0.3, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
};

const staggerParent = (stagger = 0.08, delay = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren: delay } },
});

const STATUS_STYLE = {
  called:  'text-green-400 bg-green-400/10',
  queued:  'text-amber-400 bg-amber-400/10',
  failed:  'text-red-400 bg-red-400/10',
  pending: 'text-slate-400 bg-slate-400/10',
};

export default function DialerPage({ navigate }) {
  const [file, setFile] = useState(null);
  const [leads, setLeads] = useState([]);
  const [scriptTemplate, setScriptTemplate] = useState('Hi {{firstName}}, this is a quick validation call from CallIQ setup framework.');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isCampaignRunning, setIsCampaignRunning] = useState(false);

  const fetchLeadsStatus = async () => {
    try {
      const response = await axios.get(`${API_BASE}/leads`);
      if (response.data.success) {
        setLeads(response.data.leads);
      }
    } catch (err) {
      console.error("Status check update sync failed:", err.message);
    }
  };

  useEffect(() => {
    fetchLeadsStatus();
    const interval = setInterval(() => {
      fetchLeadsStatus();
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Bhai, pehle koi acchi si CSV file select toh karo!");

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${API_BASE}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.success) {
        alert(response.data.message);
        setLeads(response.data.leads);
      }
    } catch (err) {
      alert("CSV upload fail ho gaya. File format check karo bhai.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRunCampaign = async () => {
    if (leads.length === 0) return alert("List completely khali hai! Pehle CSV populate karo.");
    if (!scriptTemplate.trim()) return alert("Bhai, script text area khali nahi rakh sakte!");

    setIsCampaignRunning(true);
    try {
      const response = await axios.post(`${API_BASE}/run-campaign`, { scriptTemplate, systemPrompt });
      if (response.data.success) {
        alert("Campaign successfully fired up! Sabhi numbers par line se calls jaa rahi hain.");
      }
    } catch (err) {
      alert("Campaign runtime processing execution failed.");
    } finally {
      setIsCampaignRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080C14] text-white p-6 md:p-8" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="max-w-5xl mx-auto">

        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="flex items-center justify-between mb-8 flex-wrap gap-4"
        >
          <div>
            <button
              onClick={() => navigate('dashboard')}
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors mb-2 block"
            >
              ← Back to dashboard
            </button>
            <h1 className="text-2xl font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              📞 CallIQ Auto-Dialer
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">Upload contacts, script the call, fire the campaign.</p>
          </div>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="bg-[#0F1623] border border-white/5 rounded-2xl p-6 mb-5"
        >
          <h3 className="font-semibold mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Step 1 · Upload Contact CSV</h3>
          <p className="text-xs text-slate-500 mb-4">File must contain headers like <strong className="text-slate-300">name, phone</strong></p>
          <form onSubmit={handleUpload} className="flex items-center gap-3 flex-wrap">
            <label className="text-sm text-slate-400 bg-[#080C14] border border-white/10 rounded-xl px-4 py-2.5 cursor-pointer hover:border-white/20 transition-colors">
              {file ? file.name : 'Choose CSV file'}
              <input type="file" accept=".csv" onChange={handleFileChange} className="hidden" />
            </label>
            <motion.button
              type="submit"
              disabled={isUploading}
              whileHover={{ scale: isUploading ? 1 : 1.03 }}
              whileTap={{ scale: isUploading ? 1 : 0.97 }}
              className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors"
            >
              {isUploading ? 'Parsing...' : 'Parse File & Add List'}
            </motion.button>
          </form>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.05 }}
          className="bg-[#0F1623] border border-white/5 rounded-2xl p-6 mb-5"
        >
          <h3 className="font-semibold mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Step 2 · Opening Line (First Message)</h3>
          <p className="text-xs text-slate-500 mb-3">This is the AI's opening line — said before the conversation begins.</p>
          <textarea
            value={scriptTemplate}
            onChange={(e) => setScriptTemplate(e.target.value)}
            rows="3"
            className="w-full bg-[#080C14] border border-white/10 focus:border-blue-500/50 rounded-xl px-4 py-3 text-sm text-white outline-none transition-colors resize-none"
          />
          <p className="text-xs text-blue-400 mt-2">
            Use <strong>{"{{firstName}}"}</strong> — it's swapped per-row automatically when the campaign fires.
          </p>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.1 }}
          className="bg-[#0F1623] border border-white/5 rounded-2xl p-6 mb-5"
        >
          <h3 className="font-semibold mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Step 2.5 · AI Conversation Instructions</h3>
          <p className="text-xs text-slate-500 mb-3">Controls how the AI behaves for the rest of the call — not just the opening line.</p>
          <textarea
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            rows="5"
            placeholder="e.g. You're a sales rep. Ask about their needs, budget, and book a demo if they're interested. Leave blank to use the assistant's default prompt from the Vapi dashboard."
            className="w-full bg-[#080C14] border border-white/10 focus:border-blue-500/50 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none transition-colors resize-none"
          />
          <p className="text-xs text-amber-400 mt-2">
            ⚠️ Leave empty to keep the Vapi assistant's existing System Prompt.
          </p>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.15 }}
          className="mb-6"
        >
          <motion.button
            onClick={handleRunCampaign}
            disabled={isCampaignRunning || leads.length === 0}
            whileHover={{ scale: isCampaignRunning || leads.length === 0 ? 1 : 1.01 }}
            whileTap={{ scale: isCampaignRunning || leads.length === 0 ? 1 : 0.98 }}
            className="w-full bg-green-500 hover:bg-green-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-2xl transition-colors"
          >
            {isCampaignRunning ? 'Dialer running…' : '🚀 Fire Outbound Campaign'}
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: EASE, delay: 0.2 }}
          className="bg-[#0F1623] border border-white/5 rounded-2xl overflow-hidden"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
            <h2 className="font-semibold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Live Activity</h2>
            <span className="text-xs text-slate-500">{leads.length} lead{leads.length !== 1 ? 's' : ''}</span>
          </div>

          {leads.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-600 text-sm gap-1">
              <p>No leads yet.</p>
              <p className="text-xs">Upload a CSV above to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5">
                    {['ID', 'Name', 'Phone', 'Status'].map(h => (
                      <th key={h} className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <motion.tbody variants={staggerParent(0.04)} initial="hidden" animate="show">
                  <AnimatePresence>
                    {leads.map((lead) => (
                      <motion.tr
                        key={lead.id}
                        variants={fadeUp}
                        layout
                        className="border-b border-white/5 last:border-b-0 hover:bg-white/[0.01] transition-colors"
                      >
                        <td className="px-6 py-4 text-slate-500 font-mono text-xs">{lead.id}</td>
                        <td className="px-6 py-4 font-medium text-white">{lead.name}</td>
                        <td className="px-6 py-4 text-slate-400 font-mono text-xs">{lead.phone}</td>
                        <td className="px-6 py-4">
                          <motion.span
                            key={lead.status}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.2 }}
                            className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_STYLE[lead.status] || 'text-slate-400 bg-slate-400/10'}`}
                          >
                            {lead.status.toUpperCase()}
                          </motion.span>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </motion.tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}