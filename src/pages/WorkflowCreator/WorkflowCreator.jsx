import React, { useState, useRef, useEffect } from 'react';
import { Plus, Save, Settings, Trash2, Copy, ZoomIn, ZoomOut, GitBranch, Mail, Database, Calendar, Users, FileText, CheckCircle, Play, Sparkles, Clock, X } from 'lucide-react';

const WorkflowCreatorMockup = () => {
  const [selectedNode, setSelectedNode] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [workflowName, setWorkflowName] = useState('Untitled Workflow');
  const [canvasNodes, setCanvasNodes] = useState([
    { id: 1, type: 'trigger', label: 'Start', x: 100, y: 50, icon: 'Play', config: {} },
    { id: 2, type: 'action', label: 'Send Email', x: 100, y: 200, icon: 'Mail', config: { template: 'Welcome Email', recipients: [] } },
    { id: 3, type: 'condition', label: 'If Response?', x: 100, y: 350, icon: 'GitBranch', config: {} }
  ]);
  const [connections, setConnections] = useState([
    { from: 1, to: 2, type: 'default' },
    { from: 2, to: 3, type: 'default' }
  ]);
  const [dragging, setDragging] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showAIModal, setShowAIModal] = useState(false);
  const [showCustomElementModal, setShowCustomElementModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [customElement, setCustomElement] = useState({ label: '', type: 'action', color: 'bg-blue-500', icon: 'CheckCircle' });
  const [connectingFrom, setConnectingFrom] = useState(null);
  const [connectionType, setConnectionType] = useState('default');
  const [recipientInput, setRecipientInput] = useState('');
  const [savedWorkflows, setSavedWorkflows] = useState([]);
  const [nodeTypes, setNodeTypes] = useState([
    { type: 'trigger', label: 'Trigger', icon: 'Play', color: 'bg-green-500' },
    { type: 'action', label: 'Action', icon: 'CheckCircle', color: 'bg-blue-500' },
    { type: 'condition', label: 'Condition', icon: 'GitBranch', color: 'bg-yellow-500' },
    { type: 'delay', label: 'Delay', icon: 'Clock', color: 'bg-purple-500' },
    { type: 'database', label: 'Database', icon: 'Database', color: 'bg-red-500' },
    { type: 'notification', label: 'Notification', icon: 'Mail', color: 'bg-indigo-500' },
    { type: 'approval', label: 'Approval', icon: 'Users', color: 'bg-orange-500' },
    { type: 'document', label: 'Document', icon: 'FileText', color: 'bg-teal-500' }
  ]);
  const canvasRef = useRef(null);

  const iconMap = {
    'Play': Play,
    'Mail': Mail,
    'GitBranch': GitBranch,
    'Database': Database,
    'Calendar': Calendar,
    'Users': Users,
    'FileText': FileText,
    'CheckCircle': CheckCircle,
    'Clock': Clock
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 2));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.5));

  const handleSave = () => {
    if (!workflowName.trim()) {
      alert('Please enter a workflow name before saving.');
      return;
    }
    
    const newWorkflow = {
      id: Date.now(),
      name: workflowName,
      nodes: canvasNodes.length,
      updated: 'Just now',
      data: {
        nodes: canvasNodes,
        connections: connections
      }
    };
    setSavedWorkflows([newWorkflow, ...savedWorkflows]);
    alert(`Workflow "${workflowName}" saved successfully!`);
  };

  const handleDragStart = (e, nodeType) => {
    e.dataTransfer.setData('nodeType', JSON.stringify(nodeType));
  };

  const handleCanvasDrop = (e) => {
    e.preventDefault();
    const nodeType = JSON.parse(e.dataTransfer.getData('nodeType'));
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoom - 120;
    const y = (e.clientY - rect.top) / zoom - 40;
    
    const newNode = {
      id: Math.max(0, ...canvasNodes.map(n => n.id)) + 1,
      type: nodeType.type,
      label: nodeType.label,
      x: Math.max(0, x),
      y: Math.max(0, y),
      icon: nodeType.icon,
      config: {}
    };
    setCanvasNodes([...canvasNodes, newNode]);
  };

  const handleNodeMouseDown = (e, node) => {
    if (e.target.closest('button') || e.target.closest('.connection-dot')) return;
    setDragging(node.id);
    setSelectedNode(node.id);
    const rect = canvasRef.current.getBoundingClientRect();
    setDragOffset({
      x: (e.clientX - rect.left) / zoom - node.x,
      y: (e.clientY - rect.top) / zoom - node.y
    });
  };

  const handleMouseMove = (e) => {
    if (dragging) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / zoom - dragOffset.x;
      const y = (e.clientY - rect.top) / zoom - dragOffset.y;
      
      setCanvasNodes(canvasNodes.map(node => 
        node.id === dragging 
          ? { ...node, x: Math.max(0, x), y: Math.max(0, y) }
          : node
      ));
    }
  };

  const handleMouseUp = () => {
    setDragging(null);
  };

  const handleDeleteNode = (nodeId) => {
    setCanvasNodes(canvasNodes.filter(n => n.id !== nodeId));
    setConnections(connections.filter(c => c.from !== nodeId && c.to !== nodeId));
    if (selectedNode === nodeId) setSelectedNode(null);
  };

  const handleCopyNode = (node) => {
    const newNode = {
      ...node,
      id: Math.max(0, ...canvasNodes.map(n => n.id)) + 1,
      x: node.x + 50,
      y: node.y + 50
    };
    setCanvasNodes([...canvasNodes, newNode]);
  };

  const handleConnectionStart = (nodeId, type) => {
    setConnectingFrom(nodeId);
    setConnectionType(type);
  };

  const handleConnectionEnd = (toNodeId) => {
    if (connectingFrom && connectingFrom !== toNodeId) {
      const newConnection = {
        from: connectingFrom,
        to: toNodeId,
        type: connectionType
      };
      setConnections([...connections, newConnection]);
    }
    setConnectingFrom(null);
    setConnectionType('default');
  };

  const handleDeleteConnection = (index) => {
    setConnections(connections.filter((_, i) => i !== index));
  };

  const handleAIGenerate = () => {
    if (!aiPrompt.trim()) return;
    
    const generatedNodes = [
      { id: Date.now(), type: 'trigger', label: 'Form Submitted', x: 100, y: 50, icon: 'Play', config: {} },
      { id: Date.now() + 1, type: 'action', label: 'Validate Data', x: 100, y: 180, icon: 'CheckCircle', config: {} },
      { id: Date.now() + 2, type: 'condition', label: 'Is Valid?', x: 100, y: 310, icon: 'GitBranch', config: {} },
      { id: Date.now() + 3, type: 'action', label: 'Save to Database', x: 300, y: 380, icon: 'Database', config: {} },
      { id: Date.now() + 4, type: 'action', label: 'Send Error Email', x: -100, y: 380, icon: 'Mail', config: {} }
    ];
    
    const generatedConnections = [
      { from: Date.now(), to: Date.now() + 1, type: 'default' },
      { from: Date.now() + 1, to: Date.now() + 2, type: 'default' },
      { from: Date.now() + 2, to: Date.now() + 3, type: 'yes' },
      { from: Date.now() + 2, to: Date.now() + 4, type: 'no' }
    ];
    
    setCanvasNodes(generatedNodes);
    setConnections(generatedConnections);
    setWorkflowName(aiPrompt.slice(0, 30) + (aiPrompt.length > 30 ? '...' : ''));
    setShowAIModal(false);
    setAiPrompt('');
  };

  const handleAddCustomElement = () => {
    if (!customElement.label.trim()) return;
    
    const newElementType = {
      type: customElement.type,
      label: customElement.label,
      icon: customElement.icon,
      color: customElement.color
    };
    
    setNodeTypes([...nodeTypes, newElementType]);
    setShowCustomElementModal(false);
    setCustomElement({ label: '', type: 'action', color: 'bg-blue-500', icon: 'CheckCircle' });
  };

  const handleLoadWorkflow = (workflow) => {
    setWorkflowName(workflow.name);
    if (workflow.data) {
      setCanvasNodes(workflow.data.nodes);
      setConnections(workflow.data.connections);
      alert(`Loaded workflow: ${workflow.name}`);
    } else {
      alert(`Loading workflow: ${workflow.name} (no data available)`);
    }
  };

  const updateNodeConfig = (field, value) => {
    setCanvasNodes(canvasNodes.map(node => 
      node.id === selectedNode 
        ? { ...node, config: { ...node.config, [field]: value } }
        : node
    ));
  };

  const selectedNodeData = canvasNodes.find(n => n.id === selectedNode);

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging, dragOffset, canvasNodes]);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <h1 className="text-xl font-semibold text-gray-800">Workflow Creator</h1>
          <input 
            type="text" 
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1 max-w-md"
            placeholder="Enter workflow name..."
          />
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleZoomOut}
            className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded flex items-center gap-1"
          >
            <ZoomOut size={16} /> 
          </button>
          <span className="text-sm text-gray-600">{Math.round(zoom * 100)}%</span>
          <button 
            onClick={handleZoomIn}
            className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded flex items-center gap-1"
          >
            <ZoomIn size={16} />
          </button>
          <div className="w-px h-6 bg-gray-300 mx-2"></div>
          <button 
            onClick={handleSave}
            className="px-4 py-1.5 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded flex items-center gap-1"
          >
            <Save size={16} /> Save
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Workflow Elements</h2>
          
          <div className="space-y-2">
            {nodeTypes.map((node, idx) => {
              const Icon = iconMap[node.icon];
              return (
                <div
                  key={idx}
                  draggable
                  onDragStart={(e) => handleDragStart(e, node)}
                  className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded cursor-move border border-gray-200 transition-colors"
                >
                  <div className={`${node.color} p-2 rounded text-white`}>
                    <Icon size={18} />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{node.label}</span>
                </div>
              );
            })}
            
            <button 
              onClick={() => setShowCustomElementModal(true)}
              className="w-full flex items-center justify-center gap-2 p-3 bg-white hover:bg-gray-50 rounded border-2 border-dashed border-gray-300 hover:border-blue-400 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <Plus size={18} />
              <span className="text-sm font-medium">Add New Element</span>
            </button>
          </div>
        </div>

        {/* Canvas */}
        <div 
          ref={canvasRef}
          className="flex-1 bg-gray-100 overflow-auto relative"
          onDrop={handleCanvasDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <div 
            className="absolute inset-0" 
            style={{
              backgroundImage: 'radial-gradient(circle, #d1d5db 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }}
          ></div>

          <div 
            className="relative p-8"
            style={{ transform: `scale(${zoom})`, transformOrigin: '0 0', minWidth: '2000px', minHeight: '2000px' }}
          >
            {/* SVG for connections */}
            <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
              <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                  <polygon points="0 0, 10 3, 0 6" fill="#6b7280" />
                </marker>
                <marker id="arrowhead-yes" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                  <polygon points="0 0, 10 3, 0 6" fill="#22c55e" />
                </marker>
                <marker id="arrowhead-no" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                  <polygon points="0 0, 10 3, 0 6" fill="#ef4444" />
                </marker>
              </defs>
              {connections.map((conn, idx) => {
                const fromNode = canvasNodes.find(n => n.id === conn.from);
                const toNode = canvasNodes.find(n => n.id === conn.to);
                if (!fromNode || !toNode) return null;
                
                const strokeColor = conn.type === 'yes' ? '#22c55e' : conn.type === 'no' ? '#ef4444' : '#6b7280';
                const markerEnd = conn.type === 'yes' ? 'url(#arrowhead-yes)' : conn.type === 'no' ? 'url(#arrowhead-no)' : 'url(#arrowhead)';
                
                return (
                  <g key={idx}>
                    <line
                      x1={fromNode.x + 120}
                      y1={fromNode.y + 80}
                      x2={toNode.x + 120}
                      y2={toNode.y}
                      stroke={strokeColor}
                      strokeWidth="2"
                      markerEnd={markerEnd}
                    />
                    {/* Clickable invisible line for deletion */}
                    <line
                      x1={fromNode.x + 120}
                      y1={fromNode.y + 80}
                      x2={toNode.x + 120}
                      y2={toNode.y}
                      stroke="transparent"
                      strokeWidth="10"
                      className="pointer-events-auto cursor-pointer"
                      onClick={() => handleDeleteConnection(idx)}
                    />
                  </g>
                );
              })}
            </svg>

            {/* Nodes */}
            {canvasNodes.map((node) => {
              const Icon = iconMap[node.icon];
              const isSelected = selectedNode === node.id;
              const nodeTypeData = nodeTypes.find(nt => nt.type === node.type);
              const isCondition = node.type === 'condition';
              
              return (
                <div
                  key={node.id}
                  onMouseDown={(e) => handleNodeMouseDown(e, node)}
                  onClick={() => setSelectedNode(node.id)}
                  className={`absolute bg-white rounded-lg shadow-md border-2 ${
                    isSelected ? 'border-blue-500' : 'border-gray-300'
                  } cursor-move hover:shadow-lg transition-all`}
                  style={{
                    left: node.x,
                    top: node.y,
                    width: 240,
                    zIndex: isSelected ? 10 : 2
                  }}
                >
                  {/* Connection dots at top (input) */}
                  <div 
                    className="connection-dot absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-gray-400 hover:bg-blue-500 rounded-full border-2 border-white cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (connectingFrom) {
                        handleConnectionEnd(node.id);
                      }
                    }}
                  />
                  
                  <div className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`${nodeTypeData?.color || 'bg-gray-500'} p-2 rounded text-white`}>
                        <Icon size={20} />
                      </div>
                      <div className="flex-1">
                        <div className="text-xs text-gray-500 uppercase">{node.type}</div>
                        <div className="font-medium text-gray-800">{node.label}</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedNode(node.id);
                          setShowConfigModal(true);
                        }}
                        className="flex-1 px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
                      >
                        <Settings size={12} className="inline mr-1" />
                        Configure
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyNode(node);
                        }}
                        className="px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded"
                      >
                        <Copy size={12} />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteNode(node.id);
                        }}
                        className="px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                  
                  {/* Connection dots at bottom (output) */}
                  {isCondition ? (
                    <>
                      <div 
                        className="connection-dot absolute -bottom-3 left-1/4 -translate-x-1/2 w-6 h-6 bg-green-500 hover:bg-green-600 rounded-full border-2 border-white cursor-pointer"
                        title="If Yes"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleConnectionStart(node.id, 'yes');
                        }}
                      />
                      <div 
                        className="connection-dot absolute -bottom-3 right-1/4 translate-x-1/2 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full border-2 border-white cursor-pointer"
                        title="If No"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleConnectionStart(node.id, 'no');
                        }}
                      />
                    </>
                  ) : (
                    <div 
                      className="connection-dot absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-gray-400 hover:bg-blue-500 rounded-full border-2 border-white cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleConnectionStart(node.id, 'default');
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
          {/* Element Properties */}
          <div className="p-4 border-b border-gray-200">
            {selectedNodeData ? (
              <>
                <h2 className="text-sm font-semibold text-gray-700 mb-4">Element Properties</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Element Name</label>
                    <input 
                      type="text" 
                      value={selectedNodeData.label}
                      onChange={(e) => {
                        setCanvasNodes(canvasNodes.map(n => 
                          n.id === selectedNode ? { ...n, label: e.target.value } : n
                        ));
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                    />
                  </div>

                  {selectedNodeData.type === 'action' && (
                    <>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Email Template</label>
                        <select 
                          value={selectedNodeData.config.template || ''}
                          onChange={(e) => updateNodeConfig('template', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                        >
                          <option>Welcome Email</option>
                          <option>Notification</option>
                          <option>Custom</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Recipients</label>
                        <div className="text-xs text-gray-500 mb-1">
                          {(selectedNodeData.config.recipients || []).length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {(selectedNodeData.config.recipients || []).map((email, idx) => (
                                <span key={idx} className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-bold">
                                  {email}
                                </span>
                              ))}
                            </div>
                          ) : (
                            'No recipients added'
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center text-gray-400 mt-8">
                <Settings size={48} className="mx-auto mb-3 opacity-50" />
                <p className="text-sm">Select an element to view properties</p>
              </div>
            )}
          </div>

          {/* AI Creator */}
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">AI Workflow Creator</h3>
            <button
              onClick={() => setShowAIModal(true)}
              className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-sm rounded flex items-center justify-center gap-2"
            >
              <Sparkles size={16} /> Generate with AI
            </button>
          </div>

          {/* Saved Workflows */}
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Saved Workflows</h3>
            <div className="space-y-2">
              {savedWorkflows.map(workflow => (
                <div 
                  key={workflow.id}
                  className="p-3 bg-gray-50 hover:bg-gray-100 rounded border border-gray-200 group"
                >
                  <div className="flex items-start justify-between">
                    <div 
                      onClick={() => handleLoadWorkflow(workflow)}
                      className="flex-1 cursor-pointer"
                    >
                      <div className="font-medium text-sm text-gray-800">{workflow.name}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {workflow.nodes} nodes • {workflow.updated}
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Delete workflow "${workflow.name}"?`)) {
                          setSavedWorkflows(savedWorkflows.filter(w => w.id !== workflow.id));
                        }
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 text-red-600 hover:bg-red-50 rounded transition-opacity"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
              {savedWorkflows.length === 0 && (
                <div className="text-center text-gray-400 py-8">
                  <p className="text-sm">No saved workflows yet</p>
                  <p className="text-xs mt-1">Save your first workflow above</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Configure Modal */}
      {showConfigModal && selectedNodeData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Configure: {selectedNodeData.label}</h2>
              <button 
                onClick={() => {
                  setShowConfigModal(false);
                  setRecipientInput('');
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Element Name</label>
                <input
                  type="text"
                  value={selectedNodeData.label}
                  onChange={(e) => {
                    setCanvasNodes(canvasNodes.map(n => 
                      n.id === selectedNode ? { ...n, label: e.target.value } : n
                    ));
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {selectedNodeData.type === 'action' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Action Type</label>
                    <select
                      value={selectedNodeData.config.actionType || 'email'}
                      onChange={(e) => updateNodeConfig('actionType', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="email">Send Email</option>
                      <option value="api">API Call</option>
                      <option value="database">Database Operation</option>
                      <option value="notification">Send Notification</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Template</label>
                    <select
                      value={selectedNodeData.config.template || 'Welcome Email'}
                      onChange={(e) => updateNodeConfig('template', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option>Welcome Email</option>
                      <option>Notification</option>
                      <option>Reminder</option>
                      <option>Custom</option>
                    </select>
                  </div>

                  {selectedNodeData.config.template === 'Custom' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Subject</label>
                        <input
                          type="text"
                          value={selectedNodeData.config.customSubject || ''}
                          onChange={(e) => updateNodeConfig('customSubject', e.target.value)}
                          placeholder="Enter email subject"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Body</label>
                        <textarea
                          value={selectedNodeData.config.customBody || ''}
                          onChange={(e) => updateNodeConfig('customBody', e.target.value)}
                          placeholder="Enter email body content..."
                          rows="4"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Recipients</label>
                    <div className="space-y-2">
                      {/* Tags display */}
                      {(selectedNodeData.config.recipients || []).length > 0 && (
                        <div className="flex flex-wrap gap-2 p-2 border border-gray-200 rounded-lg bg-gray-50">
                          {(selectedNodeData.config.recipients || []).map((email, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-bold"
                            >
                              {email}
                              <button
                                onClick={() => {
                                  const newRecipients = selectedNodeData.config.recipients.filter((_, i) => i !== idx);
                                  updateNodeConfig('recipients', newRecipients);
                                }}
                                className="hover:bg-blue-200 rounded-full p-0.5"
                              >
                                <X size={14} />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                      {/* Input field */}
                      <div className="flex gap-2">
                        <input
                          type="email"
                          value={recipientInput}
                          onChange={(e) => setRecipientInput(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && recipientInput.trim()) {
                              e.preventDefault();
                              const currentRecipients = selectedNodeData.config.recipients || [];
                              updateNodeConfig('recipients', [...currentRecipients, recipientInput.trim()]);
                              setRecipientInput('');
                            }
                          }}
                          placeholder="user@example.com"
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          onClick={() => {
                            if (recipientInput.trim()) {
                              const currentRecipients = selectedNodeData.config.recipients || [];
                              updateNodeConfig('recipients', [...currentRecipients, recipientInput.trim()]);
                              setRecipientInput('');
                            }
                          }}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {selectedNodeData.type === 'condition' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Condition Type</label>
                    <select
                      value={selectedNodeData.config.conditionType || 'equals'}
                      onChange={(e) => updateNodeConfig('conditionType', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="equals">Equals</option>
                      <option value="notEquals">Not Equals</option>
                      <option value="contains">Contains</option>
                      <option value="greaterThan">Greater Than</option>
                      <option value="lessThan">Less Than</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Value to Check</label>
                    <input
                      type="text"
                      value={selectedNodeData.config.checkValue || ''}
                      onChange={(e) => updateNodeConfig('checkValue', e.target.value)}
                      placeholder="Enter value"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </>
              )}

              {selectedNodeData.type === 'delay' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Delay Duration</label>
                    <input
                      type="number"
                      value={selectedNodeData.config.duration || ''}
                      onChange={(e) => updateNodeConfig('duration', e.target.value)}
                      placeholder="5"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Time Unit</label>
                    <select
                      value={selectedNodeData.config.timeUnit || 'minutes'}
                      onChange={(e) => updateNodeConfig('timeUnit', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="seconds">Seconds</option>
                      <option value="minutes">Minutes</option>
                      <option value="hours">Hours</option>
                      <option value="days">Days</option>
                    </select>
                  </div>
                </>
              )}

              {selectedNodeData.type === 'database' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Operation</label>
                    <select
                      value={selectedNodeData.config.operation || 'insert'}
                      onChange={(e) => updateNodeConfig('operation', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="insert">Insert</option>
                      <option value="update">Update</option>
                      <option value="select">Select</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Table Name</label>
                    <input
                      type="text"
                      value={selectedNodeData.config.tableName || ''}
                      onChange={(e) => updateNodeConfig('tableName', e.target.value)}
                      placeholder="users"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </>
              )}

              {selectedNodeData.type === 'notification' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notification Type</label>
                    <select
                      value={selectedNodeData.config.notificationType || 'push'}
                      onChange={(e) => updateNodeConfig('notificationType', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="push">Push Notification</option>
                      <option value="sms">SMS</option>
                      <option value="slack">Slack Message</option>
                      <option value="teams">Microsoft Teams</option>
                      <option value="inapp">In-App Notification</option>
                      <option value="webhook">Webhook</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message Title</label>
                    <input
                      type="text"
                      value={selectedNodeData.config.notificationTitle || ''}
                      onChange={(e) => updateNodeConfig('notificationTitle', e.target.value)}
                      placeholder="Enter notification title"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message Content</label>
                    <textarea
                      value={selectedNodeData.config.notificationContent || ''}
                      onChange={(e) => updateNodeConfig('notificationContent', e.target.value)}
                      placeholder="Enter notification message..."
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                    <select
                      value={selectedNodeData.config.priority || 'normal'}
                      onChange={(e) => updateNodeConfig('priority', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="low">Low</option>
                      <option value="normal">Normal</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </>
              )}

              {selectedNodeData.type === 'approval' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Approval Type</label>
                    <select
                      value={selectedNodeData.config.approvalType || 'single'}
                      onChange={(e) => updateNodeConfig('approvalType', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="single">Single Approver</option>
                      <option value="multiple">Multiple Approvers</option>
                      <option value="majority">Majority Vote</option>
                      <option value="unanimous">Unanimous</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Approver(s)</label>
                    <input
                      type="text"
                      value={selectedNodeData.config.approvers || ''}
                      onChange={(e) => updateNodeConfig('approvers', e.target.value)}
                      placeholder="manager@example.com"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Approval Message</label>
                    <textarea
                      value={selectedNodeData.config.approvalMessage || ''}
                      onChange={(e) => updateNodeConfig('approvalMessage', e.target.value)}
                      placeholder="Please review and approve this request..."
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Timeout (hours)</label>
                    <input
                      type="number"
                      value={selectedNodeData.config.timeout || '24'}
                      onChange={(e) => updateNodeConfig('timeout', e.target.value)}
                      placeholder="24"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </>
              )}

              {selectedNodeData.type === 'trigger' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Trigger Type</label>
                    <select
                      value={selectedNodeData.config.triggerType || 'form'}
                      onChange={(e) => updateNodeConfig('triggerType', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="form">Form Submission</option>
                      <option value="webhook">Webhook</option>
                      <option value="schedule">Scheduled</option>
                      <option value="email">Email Received</option>
                      <option value="api">API Call</option>
                      <option value="manual">Manual Trigger</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Event Frequency</label>
                    <select
                      value={selectedNodeData.config.frequency || 'immediate'}
                      onChange={(e) => updateNodeConfig('frequency', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="immediate">Immediate</option>
                      <option value="hourly">Hourly</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="custom">Custom Schedule</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Source URL / Endpoint</label>
                    <input
                      type="text"
                      value={selectedNodeData.config.sourceUrl || ''}
                      onChange={(e) => updateNodeConfig('sourceUrl', e.target.value)}
                      placeholder="https://example.com/webhook"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Custom Parameters</label>
                    <textarea
                      value={selectedNodeData.config.customParams || ''}
                      onChange={(e) => updateNodeConfig('customParams', e.target.value)}
                      placeholder="Enter custom parameters (JSON format)"
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </>
              )}
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowConfigModal(false);
                  setRecipientInput('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowConfigModal(false);
                  setRecipientInput('');
                }}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
              >
                Save Configuration
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Modal */}
      {showAIModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">AI Workflow Generator</h2>
              <button 
                onClick={() => setShowAIModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            
            <textarea
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="Describe your workflow... e.g., 'Create a workflow that validates form data, saves it to database, and sends confirmation email'"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-32"
            />
            
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setShowAIModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAIGenerate}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded flex items-center justify-center gap-2"
              >
                <Sparkles size={16} /> Generate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Element Modal */}
      {showCustomElementModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Create Custom Element</h2>
              <button 
                onClick={() => setShowCustomElementModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Element Name</label>
                <input
                  type="text"
                  value={customElement.label}
                  onChange={(e) => setCustomElement({...customElement, label: e.target.value})}
                  placeholder="e.g., API Call, Custom Notification..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Element Type</label>
                <select
                  value={customElement.type}
                  onChange={(e) => setCustomElement({...customElement, type: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="trigger">Trigger</option>
                  <option value="action">Action</option>
                  <option value="condition">Condition</option>
                  <option value="delay">Delay</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                <select
                  value={customElement.icon}
                  onChange={(e) => setCustomElement({...customElement, icon: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Play">Play</option>
                  <option value="Mail">Mail</option>
                  <option value="Database">Database</option>
                  <option value="GitBranch">Branch</option>
                  <option value="CheckCircle">Check Circle</option>
                  <option value="Calendar">Calendar</option>
                  <option value="Users">Users</option>
                  <option value="FileText">File Text</option>
                  <option value="Clock">Clock</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                <div className="grid grid-cols-4 gap-2">
                  {['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500', 'bg-purple-500', 'bg-indigo-500', 'bg-orange-500', 'bg-teal-500'].map(color => (
                    <button
                      key={color}
                      onClick={() => setCustomElement({...customElement, color})}
                      className={`h-10 rounded ${color} ${customElement.color === color ? 'ring-2 ring-offset-2 ring-gray-900' : ''}`}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCustomElementModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCustomElement}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded flex items-center justify-center gap-2"
              >
                <Plus size={16} /> Add Element
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkflowCreatorMockup;