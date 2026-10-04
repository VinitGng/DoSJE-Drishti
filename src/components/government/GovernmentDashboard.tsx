import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Building2,
  CalendarCheck,
  Clock,
  AlertTriangle,
  Video,
  Shuffle,
  BrainCircuit,
  FileCheck,
  ShieldAlert,
  Search,
  Plus,
  RefreshCw,
  PhoneCall,
  Sparkles,
  Layers,
} from 'lucide-react';
import { CCTVMonitoring } from './CCTVMonitoring';
import { RandomAssignmentModal } from './RandomAssignmentModal';
import { AIAnomalyAnalytics } from './AIAnomalyAnalytics';
import { InspectionReportsViewer } from './InspectionReportsViewer';
import { ComplianceTracker } from './ComplianceTracker';
import { ProjectRegistry } from './ProjectRegistry';
import { InspectionQueueMonitor } from './InspectionQueueMonitor';
import { VideoCallModal } from './VideoCallModal';
import { KPIDetailModal, KPIType } from './KPIDetailModal';

type GovTab = 'cctv' | 'anomaly' | 'reports' | 'compliance' | 'registry' | 'queue';

export const GovernmentDashboard: React.FC = () => {
  const {
    projects,
    inspections,
    aiAlerts,
    issues,
    syncQueue,
    startVideoCall,
  } = useApp();

  const [activeTab, setActiveTab] = useState<GovTab>('cctv');
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState<boolean>(false);
  const [activeKPIType, setActiveKPIType] = useState<KPIType>(null);

  const pendingInspections = inspections.filter(
    (i) => i.status === 'assigned' || i.status === 'in_progress'
  ).length;
  const submittedReports = inspections.filter((i) => i.status === 'submitted').length;
  const activeAlerts = aiAlerts.filter((a) => a.status === 'active').length;
  const openIssues = issues.filter((i) => i.stage !== 'resolved').length;
  const pendingQueueCount = syncQueue.filter(
    (item) => item.status === 'queued_offline' || item.status === 'failed'
  ).length;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Stat KPI Metric Cards - Clickable to open detailed searchable list */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        
        {/* KPI 1 */}
        <div
          onClick={() => setActiveKPIType('projects')}
          className="bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-indigo-500/60 p-4 rounded-2xl text-white shadow-lg transition-all cursor-pointer group hover:-translate-y-0.5"
          title="Click to view full searchable list of all 1,248 registered projects"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider group-hover:text-indigo-400 transition-colors">
              Total Projects
            </span>
            <Building2 className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">1,248</div>
          <div className="text-[11px] text-emerald-400 mt-1 flex items-center justify-between font-medium">
            <span>● 5 schemes covered</span>
            <span className="text-[10px] text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">View List →</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div
          onClick={() => setActiveKPIType('inspections')}
          className="bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/60 p-4 rounded-2xl text-white shadow-lg transition-all cursor-pointer group hover:-translate-y-0.5"
          title="Click to view list of inspections conducted today"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider group-hover:text-emerald-400 transition-colors">
              Inspections Today
            </span>
            <CalendarCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">32</div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
            <span><strong className="text-emerald-400">14</strong> completed on-site</span>
            <span className="text-[10px] text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity">View List →</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div
          onClick={() => setActiveKPIType('pending')}
          className="bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-amber-500/60 p-4 rounded-2xl text-white shadow-lg transition-all cursor-pointer group hover:-translate-y-0.5"
          title="Click to view pending duties queue"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider group-hover:text-amber-400 transition-colors">
              Pending Duties
            </span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-400">{pendingInspections + 16}</div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
            <span>{pendingInspections} active in PMU field</span>
            <span className="text-[10px] text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity">View List →</span>
          </div>
        </div>

        {/* KPI 4 */}
        <div
          onClick={() => setActiveKPIType('alerts')}
          className="bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-rose-500/60 p-4 rounded-2xl text-white shadow-lg transition-all cursor-pointer group hover:-translate-y-0.5"
          title="Click to view all AI anomaly alerts"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider group-hover:text-rose-400 transition-colors">
              AI Outlier Alerts
            </span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-rose-400">{activeAlerts}</div>
          <div className="text-[11px] text-rose-400/90 mt-1 font-medium flex items-center justify-between">
            <span>3 attendance anomalies</span>
            <span className="text-[10px] text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity">View List →</span>
          </div>
        </div>

        {/* KPI 5 */}
        <div
          onClick={() => setActiveKPIType('cctv')}
          className="col-span-2 lg:col-span-1 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/60 p-4 rounded-2xl text-white shadow-lg transition-all cursor-pointer group hover:-translate-y-0.5"
          title="Click to view all nationwide CCTV streams"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider group-hover:text-emerald-400 transition-colors">
              CCTV Uptime
            </span>
            <Video className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400">94.8%</div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
            <span>4,890 active feeds</span>
            <span className="text-[10px] text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity">View List →</span>
          </div>
        </div>

      </div>

      {/* Main Tab Bar & Action Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-slate-900/90 p-2 rounded-2xl border border-slate-800">
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setActiveTab('cctv')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'cctv'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>CCTV Live Feeds</span>
          </button>

          <button
            onClick={() => setActiveTab('anomaly')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'anomaly'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <BrainCircuit className="w-4 h-4" />
            <span>AI Anomaly Analytics</span>
            {activeAlerts > 0 && (
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'reports'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FileCheck className="w-4 h-4" />
            <span>Inspection Reports</span>
            {submittedReports > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-blue-500 text-white font-mono">
                {submittedReports}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('compliance')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'compliance'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Compliance & ATR</span>
            {openIssues > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500 text-slate-900 font-bold font-mono">
                {openIssues}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('registry')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'registry'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Project Registry</span>
          </button>

          <button
            onClick={() => setActiveTab('queue')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'queue'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Inspection Queue Monitor</span>
            {pendingQueueCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-400 text-slate-950 font-bold font-mono">
                {pendingQueueCount}
              </span>
            )}
          </button>
        </div>

        {/* Global Action Trigger: Automated Surprise Dispatch & Project Search */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('registry')}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-indigo-300 font-semibold text-xs border border-slate-700/80 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
            title="Search registered projects by Name, Status, or Location"
          >
            <Search className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Search Projects</span>
          </button>

          <button
            onClick={() => setIsAssignmentModalOpen(true)}
            className="w-full md:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Shuffle className="w-4 h-4" />
            <span>Run Random Surprise Dispatch</span>
          </button>
        </div>

      </div>

      {/* Tab Viewport */}
      {activeTab === 'cctv' && <CCTVMonitoring />}
      {activeTab === 'anomaly' && <AIAnomalyAnalytics />}
      {activeTab === 'reports' && <InspectionReportsViewer />}
      {activeTab === 'compliance' && <ComplianceTracker />}
      {activeTab === 'registry' && <ProjectRegistry />}
      {activeTab === 'queue' && <InspectionQueueMonitor />}

      {/* Modals */}
      <RandomAssignmentModal
        isOpen={isAssignmentModalOpen}
        onClose={() => setIsAssignmentModalOpen(false)}
      />
      <VideoCallModal />
      <KPIDetailModal
        kpiType={activeKPIType}
        onClose={() => setActiveKPIType(null)}
      />
    </div>
  );
};
