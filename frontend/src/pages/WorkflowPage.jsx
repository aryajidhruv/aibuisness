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

// 🔀 CUSTOM IF/ELSE NODE COMPONENT WITH "YES" & "NO" PORTS
// This matches your workfloe.jpeg perfectly
function CustomLogicNode({ data }) {
  return (
    <div style={{
      background: '#0f1622',
      color: '#fff',
      border: '2px solid #ea580c',
      borderRadius: '8px',
      padding: '12px',
      fontWeight: '600',
      fontSize: '13px',
      boxShadow: '0 10px 25px -5px rgba(0,0,0,0.7)',
      minWidth: '160px',
      textAlign: 'center',
      position: 'relative'
    }}>
      {/* Target Handle: Top Input for incoming data */}
      <Handle type="target" position={Position.Top} style={{ background: '#3b82f6', width: '8px', height: '8px' }} />
      
      <div>❓ LOGIC: If/Else Split</div>
      
      {/* Source Handle 1: Left side for "YES" path */}
      <div style={{ position: 'absolute', bottom: '-5px', left: '25%', transform: 'translateX(-50%)', fontSize: '9px', color: '#10b981' }}>yes</div>
      <Handle 
        type="source" 
        position={Position.Bottom} 
        id="yes" 
        style={{ left: '25%', background: '#10b981', width: '8px', height: '8px' }} 
      />

      {/* Source Handle 2: Right side for "NO" path */}
      <div style={{ position: 'absolute', bottom: '-5px', left: '75%', transform: 'translateX(-50%)', fontSize: '9px', color: '#ef4444' }}>no</div>
      <Handle 
        type="source" 
        position={Position.Bottom} 
        id="no" 
        style={{ left: '75%', background: '#ef4444', width: '8px', height: '8px' }} 
      />
    </div>
  );
}

const initialNodes = [];
const initialEdges = [];

export default function WorkflowPage({ navigate }) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  // Register our custom conditional node type mapping
  const nodeTypes = useMemo(() => ({ customLogic: CustomLogicNode }), []);

  // 1. Connection Engine setup
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ 
      ...params, 
      animated: true, 
      style: { stroke: '#3b82f6', strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' }
    }, eds)),
    [setEdges]
  );

  // Core function to allocate custom nodes safely
  const createCustomNode = (type, label, color, position) => {
    const id = `node_${Date.now()}`;
    
    // If it's our logic block, give it the registered custom component type
    if (type === 'LOGIC' && label === 'If/Else Split') {
      return {
        id,
        type: 'customLogic',
        position,
        data: { label }
      };
    }

    let flowType = 'default';
    if (type === 'TRIGGER') flowType = 'input';
    if (type === 'ACTION') flowType = 'output';

    return {
      id,
      type: flowType, 
      position,
      data: { label: `${type}: ${label}` },
      style: {
        background: '#0f1622',
        color: '#fff',
        border: `2px solid ${color}`,
        borderRadius: '8px',
        padding: '12px',
        fontWeight: '600',
        fontSize: '13px',
        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.7)',
        minWidth: '160px',
        textAlign: 'center'
      },
    };
  };

  // 2. Drag Handlers
  const onDragStart = (event, nodeType, label, color) => {
    event.dataTransfer.setData('application/reactflow/type', nodeType);
    event.dataTransfer.setData('application/reactflow/label', label);
    event.dataTransfer.setData('application/reactflow/color', color);
    event.dataTransfer.effectAllowed = 'move';
  };

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      if (!reactFlowWrapper.current || !reactFlowInstance) return;

      const type = event.dataTransfer.getData('application/reactflow/type');
      const label = event.dataTransfer.getData('application/reactflow/label');
      const color = event.dataTransfer.getData('application/reactflow/color');

      if (!type || !label) return;

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = createCustomNode(type, label, color, position);
      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  // 3. Fallback Click Handler
  const handleItemClick = (type, label, color) => {
    const offset = nodes.length * 25;
    const position = { x: 300 + offset, y: 150 + offset };
    const newNode = createCustomNode(type, label, color, position);
    setNodes((nds) => nds.concat(newNode));
  };

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#090d16', color: '#f8fafc', fontFamily: 'sans-serif', overflow: 'hidden' }}>
      
      {/* SIDEBAR DESIGN PANEL */}
      <div style={{ width: '260px', backgroundColor: '#0f1622', borderRight: '1px solid #1e293b', padding: '15px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '18px', zIndex: 10 }}>
        <div>
          <button onClick={() => navigate('dashboard')} style={{ background: '#1e293b', border: 'none', color: 'white', padding: '8px', borderRadius: '6px', width: '100%', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>
            ← Exit to Dashboard
          </button>
        </div>

        <div>
          <h4 style={{ fontSize: '11px', color: '#64748b', letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 8px 0' }}>Triggers</h4>
          <div draggable onDragStart={(e) => onDragStart(e, 'TRIGGER', 'Consumer List', '#2563eb')} onClick={() => handleItemClick('TRIGGER', 'Consumer List', '#2563eb')} style={sidebarItemStyle}>📁 Consumer List</div>
          <div draggable onDragStart={(e) => onDragStart(e, 'TRIGGER', 'Schedule', '#2563eb')} onClick={() => handleItemClick('TRIGGER', 'Schedule', '#2563eb')} style={sidebarItemStyle}>⏰ Schedule</div>
        </div>

        <div>
          <h4 style={{ fontSize: '11px', color: '#64748b', letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 8px 0' }}>AI Nodes</h4>
          <div draggable onDragStart={(e) => onDragStart(e, 'AI', 'Enrich Lead', '#a855f7')} onClick={() => handleItemClick('AI', 'Enrich Lead', '#a855f7')} style={sidebarItemStyle}>🔍 Enrich Lead</div>
          <div draggable onDragStart={(e) => onDragStart(e, 'AI', 'Score Lead', '#a855f7')} onClick={() => handleItemClick('AI', 'Score Lead', '#a855f7')} style={sidebarItemStyle}>⭐ Score Lead</div>
        </div>

        <div>
          <h4 style={{ fontSize: '11px', color: '#ea580c', letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 8px 0', fontWeight: 'bold' }}>Filters & Logic</h4>
          <div 
            draggable 
            onDragStart={(e) => onDragStart(e, 'LOGIC', 'If/Else Split', '#ea580c')} 
            onClick={() => handleItemClick('LOGIC', 'If/Else Split', '#ea580c')} 
            style={{ ...sidebarItemStyle, borderLeft: '3px solid #ea580c', background: 'rgba(234,88,12,0.05)', fontWeight: 'bold', color: '#fff' }}
          >
            🔀 If/Else Split (Dual Port)
          </div>
        </div>

        <div>
          <h4 style={{ fontSize: '11px', color: '#64748b', letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 8px 0' }}>Actions</h4>
          <div onClick={() => navigate('dialer')} style={{ ...sidebarItemStyle, color: '#10b981', fontWeight: 'bold', borderLeft: '3px solid #10b981' }}>📞 Voice Call (Twilio V1)</div>
          <div draggable onDragStart={(e) => onDragStart(e, 'ACTION', 'Send Email', '#059669')} onClick={() => handleItemClick('ACTION', 'Send Email', '#059669')} style={sidebarItemStyle}>✉️ Send Email</div>
          <div draggable onDragStart={(e) => onDragStart(e, 'ACTION', 'Webhook Out', '#0d9488')} onClick={() => handleItemClick('ACTION', 'Webhook Out', '#0d9488')} style={sidebarItemStyle}>🌐 Webhook Out</div>
        </div>
        
        <div style={{ marginTop: 'auto', padding: '10px', background: '#1e293b', borderRadius: '6px', fontSize: '11px', color: '#94a3b8' }}>
          💡 <strong>Tip:</strong> Click on any node or line and press <strong>Backspace</strong> / <strong>Delete</strong> on your keyboard to remove it!
        </div>
      </div>

      {/* CANVAS SECTION */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ height: '60px', borderBottom: '1px solid #1e293b', display: 'flex', alignItems: 'center', padding: '0 20px', backgroundColor: '#0f1622' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '16px', fontWeight: 'bold' }}>Protien Lead Pipeline</span>
            <span style={{ fontSize: '11px', background: 'rgba(16,185,129,0.15)', color: '#10b981', padding: '2px 8px', borderRadius: '10px', fontWeight: 'bold' }}>Custom Builder</span>
          </div>
          <button onClick={() => navigate('dialer')} style={{ background: '#2563eb', border: 'none', color: 'white', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', marginLeft: 'auto' }}>
            ⚡ Run Auto-Dialer Panel
          </button>
        </div>

        {/* CORE CANVAS WORKSPACE */}
        <div 
          className="reactflow-wrapper" 
          ref={reactFlowWrapper} 
          style={{ flex: 1, height: 'calc(100vh - 60px)', backgroundColor: '#090d16' }}
        >
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
            deleteKeyCode={["Backspace", "Delete"]} // Enable delete shortcuts natively!
            fitView
          >
            <Controls style={{ background: '#1e293b', border: 'none', color: '#fff' }} showInteractive={false} />
            <MiniMap style={{ background: '#0f1622', border: '1px solid #1e293b' }} nodeColor={() => '#1e293b'} maskColor="rgba(0, 0, 0, 0.4)" />
            <Background color="#1e293b" gap={20} size={1} />
          </ReactFlow>
        </div>
      </div>

    </div>
  );
}

const sidebarItemStyle = {
  background: '#1e293b',
  padding: '8px 12px',
  borderRadius: '6px',
  fontSize: '12px',
  marginBottom: '6px',
  cursor: 'grab',
  transition: 'all 0.2s ease',
  color: '#cbd5e1',
  userSelect: 'none',
  borderLeft: '3px solid #475569',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap'
};