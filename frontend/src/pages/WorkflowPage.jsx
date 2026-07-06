import React, { useState, useCallback, useRef, useMemo } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType,
  Handle,
  Position
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

function TriggerNode({ data, selected }) {
  return (
    <div style={{
      background: '#0f1622', border: `2px solid ${selected ? '#f59e0b' : '#2563eb'}`,
      borderRadius: '10px', padding: '0', minWidth: '200px',
      boxShadow: '0 10px 25px -5px rgba(0,0,0,0.7)', cursor: 'pointer'
    }}>
      <div style={{ background: 'rgba(37,99,235,0.15)', padding: '6px 12px', borderRadius: '8px 8px 0 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{ fontSize: '10px', color: '#60a5fa', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>⚡ Trigger</span>
      </div>
      <div style={{ padding: '10px 12px' }}>
        <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#fff', marginBottom: '4px' }}>{data.label}</div>
        {data.config?.fileName && (
          <div style={{ fontSize: '11px', color: '#64748b' }}>📁 {data.config.fileName}</div>
        )}
        {!data.config?.fileName && (
          <div style={{ fontSize: '11px', color: '#475569' }}>Click to configure</div>
        )}
      </div>
      <Handle type="source" position={Position.Right} style={{ background: '#2563eb', width: '10px', height: '10px', right: '-6px' }} />
    </div>
  );
}

function VoiceCallNode({ data, selected }) {
  return (
    <div style={{
      background: '#0f1622', border: `2px solid ${selected ? '#f59e0b' : '#10b981'}`,
      borderRadius: '10px', padding: '0', minWidth: '200px',
      boxShadow: '0 10px 25px -5px rgba(0,0,0,0.7)', cursor: 'pointer'
    }}>
      <Handle type="target" position={Position.Left} style={{ background: '#10b981', width: '10px', height: '10px', left: '-6px' }} />
      <div style={{ background: 'rgba(16,185,129,0.15)', padding: '6px 12px', borderRadius: '8px 8px 0 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{ fontSize: '10px', color: '#10b981', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>📞 Action</span>
      </div>
      <div style={{ padding: '10px 12px' }}>
        <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#fff', marginBottom: '4px' }}>Voice Call</div>
        <div style={{ fontSize: '11px', color: '#64748b' }}>{data.config?.script ? data.config.script.substring(0, 30) + '...' : 'Click to configure'}</div>
      </div>
      <Handle type="source" position={Position.Right} style={{ background: '#10b981', width: '10px', height: '10px', right: '-6px' }} />
    </div>
  );
}

function IfElseNode({ data, selected }) {
  return (
    <div style={{
      background: '#0f1622', border: `2px solid ${selected ? '#f59e0b' : '#ea580c'}`,
      borderRadius: '10px', padding: '0', minWidth: '200px',
      boxShadow: '0 10px 25px -5px rgba(0,0,0,0.7)', cursor: 'pointer', position: 'relative'
    }}>
      <Handle type="target" position={Position.Left} style={{ background: '#ea580c', width: '10px', height: '10px', left: '-6px' }} />
      <div style={{ background: 'rgba(234,88,12,0.15)', padding: '6px 12px', borderRadius: '8px 8px 0 0' }}>
        <span style={{ fontSize: '10px', color: '#fb923c', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>❓ Logic</span>
      </div>
      <div style={{ padding: '10px 12px' }}>
        <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#fff', marginBottom: '4px' }}>If/Else</div>
        <div style={{ fontSize: '11px', color: '#64748b' }}>minScore: {data.config?.minScore || 70}</div>
      </div>
      <div style={{ position: 'absolute', right: '-30px', top: '35%', fontSize: '9px', color: '#10b981', fontWeight: 'bold' }}>yes</div>
      <Handle type="source" position={Position.Right} id="yes" style={{ background: '#10b981', width: '10px', height: '10px', right: '-6px', top: '35%' }} />
      <div style={{ position: 'absolute', right: '-24px', top: '65%', fontSize: '9px', color: '#ef4444', fontWeight: 'bold' }}>no</div>
      <Handle type="source" position={Position.Right} id="no" style={{ background: '#ef4444', width: '10px', height: '10px', right: '-6px', top: '65%' }} />
    </div>
  );
}

function WebhookNode({ data, selected }) {
  return (
    <div style={{
      background: '#0f1622', border: `2px solid ${selected ? '#f59e0b' : '#0d9488'}`,
      borderRadius: '10px', padding: '0', minWidth: '200px',
      boxShadow: '0 10px 25px -5px rgba(0,0,0,0.7)', cursor: 'pointer'
    }}>
      <Handle type="target" position={Position.Left} style={{ background: '#0d9488', width: '10px', height: '10px', left: '-6px' }} />
      <div style={{ background: 'rgba(13,148,136,0.15)', padding: '6px 12px', borderRadius: '8px 8px 0 0' }}>
        <span style={{ fontSize: '10px', color: '#2dd4bf', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>🌐 Action</span>
      </div>
      <div style={{ padding: '10px 12px' }}>
        <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#fff', marginBottom: '4px' }}>Webhook</div>
        <div style={{ fontSize: '11px', color: '#64748b' }}>{data.config?.url ? data.config.url.substring(0, 25) + '...' : 'Click to configure'}</div>
      </div>
    </div>
  );
}

function EnrichLeadNode({ data, selected }) {
  return (
    <div style={{
      background: '#0f1622', border: `2px solid ${selected ? '#f59e0b' : '#a855f7'}`,
      borderRadius: '10px', padding: '0', minWidth: '200px',
      boxShadow: '0 10px 25px -5px rgba(0,0,0,0.7)', cursor: 'pointer'
    }}>
      <Handle type="target" position={Position.Left} style={{ background: '#a855f7', width: '10px', height: '10px', left: '-6px' }} />
      <div style={{ background: 'rgba(168,85,247,0.15)', padding: '6px 12px', borderRadius: '8px 8px 0 0' }}>
        <span style={{ fontSize: '10px', color: '#c084fc', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>🔍 AI Node</span>
      </div>
      <div style={{ padding: '10px 12px' }}>
        <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#fff', marginBottom: '4px' }}>Enrich Lead</div>
        <div style={{ fontSize: '11px', color: '#64748b' }}>AI powered enrichment</div>
      </div>
      <Handle type="source" position={Position.Right} style={{ background: '#a855f7', width: '10px', height: '10px', right: '-6px' }} />
    </div>
  );
}

function ConfigPanel({ node, onUpdate, onClose }) {
  const [config, setConfig] = useState(node.data.config || {});

  const handleSave = () => {
    onUpdate(node.id, config);
    onClose();
  };

  const inputStyle = {
    width: '100%', padding: '8px 10px', background: '#06080F',
    border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#f8fafc',
    fontSize: '12px', boxSizing: 'border-box', marginTop: '4px'
  };

  const labelStyle = { fontSize: '11px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' };

  return (
    <div style={{
      width: '280px', background: 'rgba(6,8,15,0.85)', backdropFilter: 'blur(20px)',
      borderLeft: '1px solid rgba(255,255,255,0.05)',
      padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontWeight: '900', fontSize: '14px', fontFamily: 'Space Grotesk, sans-serif' }}>Configure Node</span>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '18px' }}>✕</button>
      </div>

      {node.data.nodeType === 'trigger-csv' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <div style={labelStyle}>Workflow Name</div>
            <input style={inputStyle} placeholder="e.g. Protein Lead Pipeline"
              value={config.name || ''} onChange={e => setConfig({ ...config, name: e.target.value })} />
          </div>
          <div>
            <div style={labelStyle}>Upload CSV File</div>
            <input type="file" accept=".csv" style={{ ...inputStyle, padding: '6px' }}
              onChange={e => setConfig({ ...config, fileName: e.target.files[0]?.name, file: e.target.files[0] })} />
          </div>
          {config.fileName && (
            <div style={{ fontSize: '11px', color: '#10b981' }}>✅ {config.fileName}</div>
          )}
        </div>
      )}

      {node.data.nodeType === 'action-voice' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <div style={labelStyle}>First Message</div>
            <input style={inputStyle} placeholder="Hi {{firstName}}, calling from..."
              value={config.firstMessage || ''} onChange={e => setConfig({ ...config, firstMessage: e.target.value })} />
          </div>
          <div>
            <div style={labelStyle}>System Prompt (AI Behavior)</div>
            <textarea rows="5" style={inputStyle} placeholder="Tu ek sales rep hai. Lead se poochho..."
              value={config.script || ''} onChange={e => setConfig({ ...config, script: e.target.value })} />
          </div>
          <div>
            <div style={labelStyle}>Language</div>
            <select style={inputStyle} value={config.language || 'Hindi'} onChange={e => setConfig({ ...config, language: e.target.value })}>
              <option>Hindi</option>
              <option>English</option>
              <option>Hinglish</option>
            </select>
          </div>
        </div>
      )}

      {node.data.nodeType === 'logic-ifelse' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <div style={labelStyle}>Condition</div>
            <select style={inputStyle} value={config.condition || 'sentiment'} onChange={e => setConfig({ ...config, condition: e.target.value })}>
              <option value="sentiment">Call Outcome (Interested/Not)</option>
              <option value="score">AI Score</option>
              <option value="duration">Call Duration</option>
            </select>
          </div>
          {config.condition === 'score' && (
            <div>
              <div style={labelStyle}>Min Score (YES path)</div>
              <input type="number" style={inputStyle} placeholder="70"
                value={config.minScore || ''} onChange={e => setConfig({ ...config, minScore: e.target.value })} />
            </div>
          )}
          {config.condition === 'duration' && (
            <div>
              <div style={labelStyle}>Min Duration (seconds)</div>
              <input type="number" style={inputStyle} placeholder="30"
                value={config.minDuration || ''} onChange={e => setConfig({ ...config, minDuration: e.target.value })} />
            </div>
          )}
          <div style={{ fontSize: '11px', color: '#94a3b8', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', padding: '8px', borderRadius: '8px' }}>
            <div style={{ color: '#10b981', marginBottom: '4px' }}>✅ YES → Interested leads</div>
            <div style={{ color: '#ef4444' }}>❌ NO → Not interested leads</div>
          </div>
        </div>
      )}

      {node.data.nodeType === 'action-webhook' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <div style={labelStyle}>Webhook URL</div>
            <input style={inputStyle} placeholder="https://your-crm.com/webhook"
              value={config.url || ''} onChange={e => setConfig({ ...config, url: e.target.value })} />
          </div>
          <div>
            <div style={labelStyle}>Method</div>
            <select style={inputStyle} value={config.method || 'POST'} onChange={e => setConfig({ ...config, method: e.target.value })}>
              <option>POST</option>
              <option>GET</option>
            </select>
          </div>
          <div>
            <div style={labelStyle}>Payload Mode</div>
            <select style={inputStyle} value={config.payloadMode || 'custom_json'} onChange={e => setConfig({ ...config, payloadMode: e.target.value })}>
              <option value="custom_json">Custom JSON</option>
              <option value="lead_data">Lead Data Only</option>
            </select>
          </div>
        </div>
      )}

      {node.data.nodeType === 'ai-enrich' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ fontSize: '12px', color: '#94a3b8' }}>AI will automatically enrich lead data before the call — adding context, company info, and personalization hints.</div>
        </div>
      )}

      <button onClick={handleSave} style={{
        background: '#ffffff', border: 'none', color: '#000', padding: '10px',
        borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '13px', marginTop: 'auto'
      }}>
        💾 Save Config
      </button>
    </div>
  );
}

const initialNodes = [];
const initialEdges = [];

export default function WorkflowPage({ navigate }) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState(null);
  const [workflowName, setWorkflowName] = useState('My Campaign Workflow');
  const [isRunning, setIsRunning] = useState(false);
  const [runLog, setRunLog] = useState([]);
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const nodeTypes = useMemo(() => ({
    triggerCsv:    TriggerNode,
    actionVoice:   VoiceCallNode,
    logicIfelse:   IfElseNode,
    actionWebhook: WebhookNode,
    aiEnrich:      EnrichLeadNode,
  }), []);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({
      ...params,
      animated: true,
      style: { stroke: '#3b82f6', strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' }
    }, eds)),
    [setEdges]
  );

  const createNode = (nodeType, label, position) => {
    const id = `node_${Date.now()}`;
    const typeMap = {
      'trigger-csv':    'triggerCsv',
      'action-voice':   'actionVoice',
      'logic-ifelse':   'logicIfelse',
      'action-webhook': 'actionWebhook',
      'ai-enrich':      'aiEnrich',
    };
    return {
      id,
      type: typeMap[nodeType],
      position,
      data: { label, nodeType, config: {} }
    };
  };

  const onDragStart = (event, nodeType, label) => {
    event.dataTransfer.setData('nodeType', nodeType);
    event.dataTransfer.setData('nodeLabel', label);
    event.dataTransfer.effectAllowed = 'move';
  };

  const onDrop = useCallback((event) => {
    event.preventDefault();
    if (!reactFlowWrapper.current || !reactFlowInstance) return;
    const nodeType = event.dataTransfer.getData('nodeType');
    const label = event.dataTransfer.getData('nodeLabel');
    if (!nodeType) return;
    const position = reactFlowInstance.screenToFlowPosition({ x: event.clientX, y: event.clientY });
    setNodes((nds) => nds.concat(createNode(nodeType, label, position)));
  }, [reactFlowInstance, setNodes]);

  const handleItemClick = (nodeType, label) => {
    const offset = nodes.length * 30;
    const position = { x: 250 + offset, y: 200 + offset };
    setNodes((nds) => nds.concat(createNode(nodeType, label, position)));
  };

  const onNodeClick = useCallback((_, node) => {
    setSelectedNode(node);
  }, []);

  const handleConfigUpdate = (nodeId, newConfig) => {
    setNodes((nds) => nds.map(n =>
      n.id === nodeId ? { ...n, data: { ...n.data, config: newConfig } } : n
    ));
    setSelectedNode(null);
  };

  const handleRunWorkflow = async () => {
    setIsRunning(true);
    setRunLog([]);

    const log = (msg, color = '#94a3b8') => {
      setRunLog(prev => [...prev, { msg, color, time: new Date().toLocaleTimeString() }]);
    };

    try {
      const triggerNode = nodes.find(n => n.data.nodeType === 'trigger-csv');
      if (!triggerNode?.data.config?.file) {
        log('❌ CSV file upload nahi ki trigger node mein!', '#ef4444'); return;
      }

      log('📁 CSV upload ho rahi hai...', '#60a5fa');
      const formData = new FormData();
      formData.append('file', triggerNode.data.config.file);
      const uploadRes = await axios.post(`${API_BASE}/api/voice/upload`, formData);
      const leads = uploadRes.data.leads;
      log(`✅ ${leads.length} leads parsed!`, '#10b981');

      const voiceNode = nodes.find(n => n.data.nodeType === 'action-voice');
      if (!voiceNode) { log('❌ Voice Call node nahi mila!', '#ef4444'); return; }

      log('📞 Calls fire ho rahi hain...', '#60a5fa');
      const campaignRes = await axios.post(`${API_BASE}/api/voice/run-campaign`, {
        scriptTemplate: voiceNode.data.config.firstMessage || 'Hi {{firstName}}, calling from CallIQ!',
        systemPrompt: voiceNode.data.config.script || '',
        language: voiceNode.data.config.language || 'Hindi'
      });
      log(`✅ Campaign fired! ${leads.length} calls queued.`, '#10b981');

      const ifElseNode = nodes.find(n => n.data.nodeType === 'logic-ifelse');
      if (ifElseNode) {
        log('⏳ Call results ka wait kar rahe hain (30 sec)...', '#f59e0b');
        await new Promise(r => setTimeout(r, 30000));

        const resultsRes = await axios.get(`${API_BASE}/api/voice/results`);
        const results = resultsRes.data.results;
        log(`📊 ${results.length} call results mile`, '#60a5fa');

        const webhookNode = nodes.find(n => n.data.nodeType === 'action-webhook');
        const condition = ifElseNode.data.config?.condition || 'sentiment';

        const yesLeads = results.filter(r => {
          if (condition === 'sentiment') return r.status === 'called';
          if (condition === 'score') return (r.score || 0) >= (ifElseNode.data.config?.minScore || 70);
          if (condition === 'duration') return (r.duration || 0) >= (ifElseNode.data.config?.minDuration || 30);
          return false;
        });

        const noLeads = results.filter(r => !yesLeads.includes(r));
        log(`✅ YES path: ${yesLeads.length} leads | ❌ NO path: ${noLeads.length} leads`, '#10b981');

        const yesEdge = edges.find(e => e.source === ifElseNode.id && e.sourceHandle === 'yes');
        if (yesEdge && webhookNode?.data.config?.url) {
          try {
            await axios.post(webhookNode.data.config.url, {
              leads: yesLeads,
              campaign: workflowName,
              outcome: 'interested'
            });
            log(`🌐 Webhook hit! ${yesLeads.length} interested leads bheje.`, '#10b981');
          } catch (e) {
            log(`⚠️ Webhook failed: ${e.message}`, '#f59e0b');
          }
        }
      }

      log('🎉 Workflow complete!', '#10b981');
    } catch (err) {
      log(`❌ Error: ${err.message}`, '#ef4444');
    } finally {
      setIsRunning(false);
    }
  };

  const sidebarItems = [
    { section: 'TRIGGERS', items: [
      { type: 'trigger-csv', label: 'Upload List', icon: '📁', color: '#2563eb' },
      { type: 'trigger-csv', label: 'Schedule', icon: '⏰', color: '#2563eb' },
      { type: 'trigger-csv', label: 'Webhook', icon: '🔗', color: '#2563eb' },
    ]},
    { section: 'AI NODES', items: [
      { type: 'ai-enrich', label: 'Enrich Lead', icon: '🔍', color: '#a855f7' },
      { type: 'ai-enrich', label: 'Score Lead', icon: '⭐', color: '#a855f7' },
      { type: 'ai-enrich', label: 'Classify Lead', icon: '🏷️', color: '#a855f7' },
      { type: 'ai-enrich', label: 'Personalize Message', icon: '✍️', color: '#a855f7' },
    ]},
    { section: 'FILTERS', items: [
      { type: 'logic-ifelse', label: 'If/Else', icon: '❓', color: '#ea580c' },
      { type: 'logic-ifelse', label: 'Score Filter', icon: '📊', color: '#ea580c' },
      { type: 'logic-ifelse', label: 'Tag Filter', icon: '🏷️', color: '#ea580c' },
      { type: 'logic-ifelse', label: 'Split Segment', icon: '✂️', color: '#ea580c' },
    ]},
    { section: 'ACTIONS', items: [
      { type: 'action-voice', label: 'Voice Call', icon: '📞', color: '#10b981' },
      { type: 'action-webhook', label: 'Webhook', icon: '🌐', color: '#0d9488' },
      { type: 'action-voice', label: 'Send SMS', icon: '💬', color: '#10b981' },
      { type: 'action-webhook', label: 'Push to CRM', icon: '📋', color: '#0d9488' },
      { type: 'action-webhook', label: 'Slack Alert', icon: '🔔', color: '#0d9488' },
    ]},
  ];

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#090d16', color: '#f8fafc', fontFamily: 'Inter, sans-serif', overflow: 'hidden', flexDirection: 'column' }}>

      <div style={{
        height: '56px', background: 'rgba(6,8,15,0.85)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center',
        padding: '0 16px', gap: '12px', flexShrink: 0
      }}>
        <button onClick={() => navigate('dashboard')} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '18px' }}>←</button>
        <span style={{ fontWeight: '900', fontFamily: 'Space Grotesk, sans-serif', fontSize: '15px' }}>
          Call<span style={{ color: '#60a5fa' }}>IQ</span>
        </span>
        <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.08)' }} />
        <input
          value={workflowName}
          onChange={e => setWorkflowName(e.target.value)}
          style={{ background: 'none', border: 'none', color: '#f8fafc', fontSize: '14px', fontWeight: '600', outline: 'none', width: '220px', fontFamily: 'Space Grotesk, sans-serif' }}
        />
        <span style={{
          fontSize: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
          color: '#94a3b8', padding: '3px 10px', borderRadius: '999px', fontWeight: '700',
          textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '6px'
        }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} />
          Active
        </span>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px' }}>
            ↑ Upload
          </button>
          <button style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px' }}>
            ↓ Download
          </button>
          <button style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px' }}>
            💾 Save
          </button>
          <button
            onClick={handleRunWorkflow}
            disabled={isRunning}
            style={{
              background: isRunning ? 'rgba(255,255,255,0.05)' : '#ffffff',
              border: 'none', color: isRunning ? '#64748b' : '#000', padding: '7px 18px',
              borderRadius: '8px', cursor: isRunning ? 'default' : 'pointer', fontSize: '13px',
              fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px'
            }}
          >
            {isRunning ? '⏳ Running...' : '▶ Run'}
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        <div style={{
          width: '175px', background: 'rgba(6,8,15,0.85)', backdropFilter: 'blur(20px)',
          borderRight: '1px solid rgba(255,255,255,0.05)', overflowY: 'auto', padding: '12px 0', flexShrink: 0
        }}>
          <div style={{ padding: '4px 12px 8px', fontSize: '10px', color: '#475569', fontWeight: '700', letterSpacing: '0.1em', fontFamily: 'Space Grotesk, sans-serif' }}>NODE LIBRARY</div>
          {sidebarItems.map(section => (
            <div key={section.section}>
              <div style={{ padding: '8px 12px 4px', fontSize: '9px', color: '#475569', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase' }}>{section.section}</div>
              {section.items.map(item => (
                <div
                  key={item.label}
                  draggable
                  onDragStart={(e) => onDragStart(e, item.type, item.label)}
                  onClick={() => handleItemClick(item.type, item.label)}
                  style={{
                    padding: '7px 12px', fontSize: '12px', color: '#cbd5e1', cursor: 'grab',
                    display: 'flex', alignItems: 'center', gap: '8px',
                    transition: 'background 0.15s', userSelect: 'none',
                    borderLeft: '2px solid transparent',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderLeftColor = item.color; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.borderLeftColor = 'transparent'; }}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div ref={reactFlowWrapper} style={{ flex: 1, position: 'relative' }}>
          {runLog.length > 0 && (
            <div style={{
              position: 'absolute', bottom: '20px', left: '20px', zIndex: 10,
              background: 'rgba(6,8,15,0.9)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px',
              padding: '12px', maxWidth: '350px', maxHeight: '200px', overflowY: 'auto'
            }}>
              <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '6px', fontWeight: 'bold' }}>WORKFLOW LOG</div>
              {runLog.map((log, i) => (
                <div key={i} style={{ fontSize: '11px', color: log.color, marginBottom: '3px' }}>
                  <span style={{ color: '#334155' }}>{log.time} </span>{log.msg}
                </div>
              ))}
            </div>
          )}

          {nodes.length === 0 && (
            <div style={{
              position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
              textAlign: 'center', color: '#334155', zIndex: 5, pointerEvents: 'none'
            }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>⚡</div>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#475569' }}>Drag nodes from the left panel</div>
              <div style={{ fontSize: '12px', color: '#334155', marginTop: '6px' }}>Start with "Upload List" trigger</div>
            </div>
          )}

          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={(e) => e.preventDefault()}
            onNodeClick={onNodeClick}
            deleteKeyCode={['Backspace', 'Delete']}
            fitView
          >
            <Controls style={{ background: '#1e293b', border: '1px solid #334155' }} showInteractive={false} />
            <MiniMap style={{ background: '#0f1622', border: '1px solid #1e293b' }} nodeColor={() => '#1e293b'} maskColor="rgba(0,0,0,0.5)" />
            <Background color="#1e293b" gap={20} size={1} />
          </ReactFlow>
        </div>

        {selectedNode ? (
          <ConfigPanel
            node={selectedNode}
            onUpdate={handleConfigUpdate}
            onClose={() => setSelectedNode(null)}
          />
        ) : (
          <div style={{
            width: '280px', background: 'rgba(6,8,15,0.85)', backdropFilter: 'blur(20px)',
            borderLeft: '1px solid rgba(255,255,255,0.05)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#334155', fontSize: '13px', textAlign: 'center', padding: '20px'
          }}>
            Click a node on the canvas to configure it
          </div>
        )}
      </div>
    </div>
  );
}