import React, { useState } from 'react';
import { Search, Calendar, Building2, Users, FileText, Mail, Clock, Check, X, Plus, MoreHorizontal, ChevronLeft, ChevronRight, ChevronDown, AlertCircle, Bell, RefreshCw, Send, CheckCircle, XCircle, Pause, Play } from 'lucide-react';

export default function PLANetDocumentWorkflow() {
  const [activeTab, setActiveTab] = useState('All');
  const [selectedDoc, setSelectedDoc] = useState({
    id: '20000055747',
    subject: 'Service Agreement Q4-2024.pdf',
    startDate: 'Dec 15, 2024',
    endDate: 'Dec 15, 2025',
    startTime: '09:00 AM',
    endTime: '09:15 AM',
    type: 'Service Agreement',
    status: 'Active',
    class: 'Business',
    sender: 'contracts@acmecorp.com',
    entity: 'Acme Corp',
    entityId: 'E001',
    contact: 'John Smith',
    confidence: 95,
    value: '$45,000',
    renewalNotice: '30 days',
    aiDecision: 'Auto-Sign Approved'
  });

  const [workflowSteps, setWorkflowSteps] = useState([
    { id: 1, name: 'Document Received', status: 'completed', assignee: 'System', completedDate: '2024-12-15 09:00', duration: '0m' },
    { id: 2, name: 'Email Parsing & Extraction', status: 'completed', assignee: 'AI Engine', completedDate: '2024-12-15 09:01', duration: '1m' },
    { id: 3, name: 'Document Classification', status: 'completed', assignee: 'AI Engine', completedDate: '2024-12-15 09:02', duration: '1m' },
    { id: 4, name: 'Entity Matching', status: 'completed', assignee: 'AI Engine', completedDate: '2024-12-15 09:03', duration: '1m' },
    { 
      id: 5, 
      name: 'Contact Verification', 
      status: 'completed', 
      assignee: 'AI Engine', 
      completedDate: '2024-12-15 09:04', 
      duration: '1m',
      hasChanges: true,
      changedClauses: [
        'Section 3.2: Payment Terms - Changed from NET-30 to NET-45',
        'Section 5.1: Termination Notice - Changed from 30 days to 60 days',
        'Section 7.4: Liability Cap - Increased from $25,000 to $45,000'
      ]
    },
    { id: 6, name: 'Risk Assessment', status: 'completed', assignee: 'AI Engine', completedDate: '2024-12-15 09:05', duration: '1m' },
    { id: 7, name: 'Legal Review (Auto)', status: 'completed', assignee: 'AI Legal Check', completedDate: '2024-12-15 09:06', duration: '1m' },
    { id: 8, name: 'Approval Routing', status: 'completed', assignee: 'Workflow Engine', completedDate: '2024-12-15 09:07', duration: '1m' },
    { id: 9, name: 'Manager Approval', status: 'completed', assignee: 'Dean Bedford', completedDate: '2024-12-15 09:10', duration: '3m' },
    { id: 10, name: 'Digital Signature', status: 'completed', assignee: 'DocuSign API', completedDate: '2024-12-15 09:12', duration: '2m' },
    { id: 11, name: 'Document Storage', status: 'completed', assignee: 'System', completedDate: '2024-12-15 09:13', duration: '1m' },
    { id: 12, name: 'Activity Scheduling', status: 'pending', assignee: 'Calendar Engine', completedDate: '-', duration: '-' },
    { id: 13, name: 'Notification Sent', status: 'pending', assignee: 'Notification Service', completedDate: '-', duration: '-' }
  ]);

  const handleScheduleActivity = () => {
    setWorkflowSteps(steps => steps.map(step => 
      step.id === 12 
        ? { ...step, status: 'completed', completedDate: new Date().toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }), duration: '1m' }
        : step
    ));
  };

  const [workflowConfig] = useState({
    autoSignThreshold: 90,
    requireApprovalAbove: '$50,000',
    approvers: ['Dean Bedford', 'Mladen Dukic', 'Vladimir Dukic'],
    notifyOnComplete: ['legal@company.com', 'finance@company.com'],
    retentionPeriod: '7 years',
    versionControl: 'Enabled',
    auditTrail: 'Enabled'
  });

  const [approvalHistory] = useState([
    { step: 'Initial Review', approver: 'AI Engine', action: 'Approved', date: '2024-12-15 09:06', comments: 'All checks passed, confidence 95%' },
    { step: 'Manager Approval', approver: 'Dean Bedford', action: 'Approved', date: '2024-12-15 09:10', comments: 'Approved for execution' }
  ]);

  const tabs = ['All', 'Entity', 'Tags', 'Activities', 'Workflow', 'Transaction', 'Document', 'VYW'];

  const getStepIcon = (status) => {
    switch(status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'in_progress': return <Clock className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'pending': return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'failed': return <XCircle className="w-5 h-5 text-red-500" />;
      default: return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-gray-300 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <span className="font-semibold text-gray-700">PLANet</span>
            <span className="bg-blue-600 text-white px-2 py-1 rounded text-sm font-semibold">Contact</span>
          </div>
          <button className="px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded">HR Dashboard</button>
          <button className="px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded">MenuBar</button>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Enter Search Value" className="border border-gray-300 rounded px-3 py-1 text-sm w-64" />
          </div>
          <button className="text-sm text-gray-700">Advanced</button>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">Dean Bedford</span>
            <div className="w-8 h-8 rounded-full bg-blue-500"></div>
          </div>
        </div>
      </div>

      {/* Secondary Toolbar */}
      <div className="bg-gray-100 border-b border-gray-300 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 flex items-center gap-1">
            <Plus className="w-4 h-4" />
            New
          </button>
          <button className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50">Find</button>
          <button className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50">Delete</button>
          <button className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50">Duplicate</button>
        </div>
        <div className="flex items-center gap-4">
          <button className="px-4 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50">Active</button>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50">PLANet Comms</button>
          <button className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50">Create E-mail</button>
          <button className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50">Get Mail</button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Document Info */}
        <div className="w-1/2 bg-white border-r border-gray-300 overflow-y-auto">
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <FileText className="w-8 h-8 text-blue-600" />
                <Users className="w-8 h-8 text-gray-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Document Subject</h2>
              <div className="ml-auto text-sm text-gray-500">1 / 1</div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-2 mb-6">
              <button className="px-4 py-2 bg-blue-600 text-white rounded text-sm font-semibold">List</button>
              <button className="p-2 bg-blue-600 text-white rounded"><ChevronLeft className="w-4 h-4" /></button>
              <button className="p-2 bg-blue-600 text-white rounded"><ChevronRight className="w-4 h-4" /></button>
            </div>

            {/* Document Info Fields */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="w-32 text-sm font-semibold text-gray-700">Subject</label>
                <input type="text" value={selectedDoc.subject} className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm" readOnly />
              </div>

              <div className="flex gap-4">
                <div className="flex-1 flex items-center gap-4">
                  <label className="w-32 text-sm font-semibold text-gray-700">Start Date</label>
                  <input type="text" value={selectedDoc.startDate} className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm" readOnly />
                </div>
                <div className="flex-1 flex items-center gap-4">
                  <label className="w-24 text-sm font-semibold text-gray-700">End Date</label>
                  <input type="text" value={selectedDoc.endDate} className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm" readOnly />
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-1 flex items-center gap-4">
                  <label className="w-32 text-sm font-semibold text-gray-700">Type</label>
                  <input type="text" value={selectedDoc.type} className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm" readOnly />
                </div>
              </div>

              <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
                <label className="w-32 text-sm font-semibold text-gray-700">Status</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input type="radio" checked className="text-blue-600" readOnly />
                    <span className="text-sm">Active</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" className="text-blue-600" />
                    <span className="text-sm">Complete</span>
                  </label>
                </div>
              </div>

              {/* AI Analysis Section */}
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
                <h3 className="text-sm font-semibold text-gray-800 mb-3">AI Document Analysis</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Confidence Score:</span>
                    <span className="font-semibold text-gray-800">{selectedDoc.confidence}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Contract Value:</span>
                    <span className="font-semibold text-gray-800">{selectedDoc.value}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">AI Decision:</span>
                    <span className="font-semibold text-green-700">{selectedDoc.aiDecision}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Workflow Info */}
        <div className="flex-1 bg-white overflow-y-auto">
          <div className="border-b border-gray-300">
            {/* Tabs */}
            <div className="flex items-center gap-1 px-4 py-2 bg-gray-50">
              {tabs.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-sm font-medium rounded-t ${
                    activeTab === tab
                      ? 'bg-white text-blue-600 border-t-2 border-blue-600'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Entity Info Header */}
            <div className="p-4 bg-white border-b border-gray-300">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-semibold text-blue-600">{selectedDoc.entity}</span>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-6">
            {activeTab === 'All' && (
              <div className="space-y-6">
                {/* Workflow Steps */}
                <div className="border border-gray-300 rounded">
                  <div className="bg-gray-50 px-4 py-2 border-b border-gray-300">
                    <h3 className="font-semibold text-gray-800">Workflow Execution Timeline</h3>
                  </div>
                  <div className="p-4">
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {workflowSteps.map((step) => (
                        <div key={step.id}>
                          <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                            {getStepIcon(step.status)}
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-800">{step.name}</span>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-gray-500">{step.duration}</span>
                                  {step.id === 12 && step.status === 'pending' && (
                                    <button 
                                      onClick={handleScheduleActivity}
                                      className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 flex items-center gap-1"
                                    >
                                      <Calendar className="w-3 h-3" />
                                      Schedule
                                    </button>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                <span>{step.assignee}</span>
                                {step.completedDate !== '-' && (
                                  <>
                                    <span>•</span>
                                    <span>{step.completedDate}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          {step.hasChanges && (
                            <div className="ml-8 mt-1 mb-2 p-2 bg-orange-50 border border-orange-200 rounded text-xs">
                              <div className="flex items-center gap-1 mb-1">
                                <AlertCircle className="w-3 h-3 text-orange-600" />
                                <span className="font-semibold text-orange-800">Contract differs from previous version</span>
                              </div>
                              <div className="space-y-0.5 mb-1 text-gray-600">
                                {step.changedClauses.map((clause, i) => (
                                  <div key={i}>• {clause}</div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Approval History */}
                <div className="border border-gray-300 rounded">
                  <div className="bg-gray-50 px-4 py-2 border-b border-gray-300">
                    <h3 className="font-semibold text-gray-800">Approval History</h3>
                  </div>
                  <div className="p-4">
                    <div className="space-y-3">
                      {approvalHistory.map((approval, i) => (
                        <div key={i} className="p-3 bg-gray-50 border border-gray-200 rounded">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold text-gray-800">{approval.step}</span>
                            <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-700">
                              {approval.action}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600">By: {approval.approver} • {approval.date}</p>
                          <p className="text-xs text-gray-500 mt-1 italic">{approval.comments}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Workflow' && (
              <div className="space-y-6">
                <div className="border border-gray-300 rounded">
                  <div className="bg-gray-50 px-4 py-2 border-b border-gray-300">
                    <h3 className="font-semibold text-gray-800">Workflow Configuration</h3>
                  </div>
                  <div className="p-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <label className="text-gray-600 block mb-1">Auto-Sign Threshold</label>
                        <input type="number" value={workflowConfig.autoSignThreshold} className="w-full border border-gray-300 rounded px-3 py-2" readOnly />
                      </div>
                      <div>
                        <label className="text-gray-600 block mb-1">Require Approval Above</label>
                        <input type="text" value={workflowConfig.requireApprovalAbove} className="w-full border border-gray-300 rounded px-3 py-2" readOnly />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <label className="text-gray-600 block mb-1">Retention Period</label>
                        <input type="text" value={workflowConfig.retentionPeriod} className="w-full border border-gray-300 rounded px-3 py-2" readOnly />
                      </div>
                      <div>
                        <label className="text-gray-600 block mb-1">Version Control</label>
                        <input type="text" value={workflowConfig.versionControl} className="w-full border border-gray-300 rounded px-3 py-2" readOnly />
                      </div>
                    </div>
                    <div className="text-sm">
                      <label className="text-gray-600 block mb-1">Audit Trail</label>
                      <input type="text" value={workflowConfig.auditTrail} className="w-full border border-gray-300 rounded px-3 py-2" readOnly />
                    </div>
                    <div className="text-sm">
                      <label className="text-gray-600 block mb-2">Approvers</label>
                      <div className="flex flex-wrap gap-2">
                        {workflowConfig.approvers.map((approver, i) => (
                          <span key={i} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                            {approver}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-sm">
                      <label className="text-gray-600 block mb-2">Notify on Complete</label>
                      <div className="flex flex-wrap gap-2">
                        {workflowConfig.notifyOnComplete.map((email, i) => (
                          <span key={i} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                            {email}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Workflow Steps */}
                <div className="border border-gray-300 rounded">
                  <div className="bg-gray-50 px-4 py-2 border-b border-gray-300">
                    <h3 className="font-semibold text-gray-800">Workflow Execution Timeline</h3>
                  </div>
                  <div className="p-4">
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {workflowSteps.map((step) => (
                        <div key={step.id}>
                          <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                            {getStepIcon(step.status)}
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-800">{step.name}</span>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-gray-500">{step.duration}</span>
                                  {step.id === 12 && step.status === 'pending' && (
                                    <button 
                                      onClick={handleScheduleActivity}
                                      className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 flex items-center gap-1"
                                    >
                                      <Calendar className="w-3 h-3" />
                                      Schedule
                                    </button>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                <span>{step.assignee}</span>
                                {step.completedDate !== '-' && (
                                  <>
                                    <span>•</span>
                                    <span>{step.completedDate}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          {step.hasChanges && (
                            <div className="ml-8 mt-1 mb-2 p-2 bg-orange-50 border border-orange-200 rounded text-xs">
                              <div className="flex items-center gap-1 mb-1">
                                <AlertCircle className="w-3 h-3 text-orange-600" />
                                <span className="font-semibold text-orange-800">Contract differs from previous version</span>
                              </div>
                              <div className="space-y-0.5 mb-1 text-gray-600">
                                {step.changedClauses.map((clause, i) => (
                                  <div key={i}>• {clause}</div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-blue-700 border-t border-blue-800 px-4 py-2 flex items-center justify-between text-white text-sm">
        <div className="flex items-center gap-4">
          <span>PLANet Document Workflow Management System</span>
        </div>
        <div className="flex items-center gap-4">
          <span>Design by PLANet Systems Group | © PLANet CRM 2025</span>
        </div>
      </div>
    </div>
  );
}