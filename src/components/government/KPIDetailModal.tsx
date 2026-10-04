import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Search,
  Building2,
  CalendarCheck,
  Clock,
  AlertTriangle,
  Video,
  MapPin,
  Users,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  ExternalLink,
} from 'lucide-react';
import { Project, Inspection, AIAlert, CCTVFeed } from '../../types';
import { ProjectDetailModal } from './ProjectDetailModal';

export type KPIType = 'projects' | 'inspections' | 'pending' | 'alerts' | 'cctv' | null;

interface Props {
  kpiType: KPIType;
  onClose: () => void;
  onSelectProject?: (projectId: string) => void;
  onSelectInspection?: (inspectionId: string) => void;
}

export const KPIDetailModal: React.FC<Props> = ({
  kpiType,
  onClose,
  onSelectProject,
  onSelectInspection,
}) => {
  const { projects, inspections, aiAlerts, setRole } = useApp();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedProjectForDetail, setSelectedProjectForDetail] = useState<Project | null>(null);

  if (!kpiType) return null;

  // Filtered lists based on search
  const filteredProjects = projects.filter((p) => {
    const term = searchTerm.toLowerCase().trim();
    const statusText = p.status.replace(/_/g, ' ').toLowerCase();
    return (
      !term ||
      p.name.toLowerCase().includes(term) ||
      p.ngoName.toLowerCase().includes(term) ||
      p.regNumber.toLowerCase().includes(term) ||
      p.scheme.toLowerCase().includes(term) ||
      p.status.toLowerCase().includes(term) ||
      statusText.includes(term) ||
      p.district.toLowerCase().includes(term) ||
      p.state.toLowerCase().includes(term) ||
      (p.address && p.address.toLowerCase().includes(term))
    );
  });

  const inspectionsToday = inspections;
  const filteredInspectionsToday = inspectionsToday.filter(
    (i) =>
      i.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.inspectorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.assignedTeamId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pendingInspections = inspections.filter(
    (i) => i.status === 'assigned' || i.status === 'in_progress'
  );
  const filteredPending = pendingInspections.filter(
    (i) =>
      i.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.inspectorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.assignedTeamId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAlerts = aiAlerts.filter(
    (a) =>
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Flatten all CCTV feeds across projects
  const allCCTVFeeds = projects.flatMap((p) =>
    p.cctvFeeds.map((feed) => ({
      ...feed,
      projectName: p.name,
      projectId: p.id,
      state: p.state,
    }))
  );
  const filteredCCTV = allCCTVFeeds.filter(
    (f) =>
      f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.locationArea.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.cameraModel.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getModalTitle = () => {
    switch (kpiType) {
      case 'projects':
        return {
          title: 'Total Registered Welfare Projects (1,248 Pan-India)',
          sub: 'Directory of all active grant-in-aid institutes under DoSJE schemes',
          icon: Building2,
          color: 'text-indigo-400 bg-indigo-500/20 border-indigo-500/30',
        };
      case 'inspections':
        return {
          title: 'Inspections Scheduled & Conducted Today (32 Audits)',
          sub: 'Live audit log of PMU surprise inspections and routine compliance visits',
          icon: CalendarCheck,
          color: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30',
        };
      case 'pending':
        return {
          title: 'Pending Field Inspection Duties (18 Pending Audits)',
          sub: 'Surprise inspection duties assigned to field teams awaiting on-site GPS check-in',
          icon: Clock,
          color: 'text-amber-400 bg-amber-500/20 border-amber-500/30',
        };
      case 'alerts':
        return {
          title: 'AI Anomaly & Outlier Telemetry (7 Active System Alerts)',
          sub: 'Statistical attendance drops, biometric discrepancies, and CCTV interruptions',
          icon: AlertTriangle,
          color: 'text-rose-400 bg-rose-500/20 border-rose-500/30',
        };
      case 'cctv':
        return {
          title: 'National CCTV Surveillance Feeds (4,890 Cameras - 94.8% Online)',
          sub: 'Live telemetry and ping diagnostics for integrated cameras across all projects',
          icon: Video,
          color: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30',
        };
    }
  };

  const meta = getModalTitle();
  const Icon = meta.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden flex flex-col text-slate-100 max-h-[88vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-indigo-950/50 to-slate-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-2xl border ${meta.color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">{meta.title}</h3>
              <p className="text-xs text-slate-400">{meta.sub}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 bg-slate-950/60 border-b border-slate-800">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              autoFocus
              placeholder="Search by name, scheme, district, inspector, status, ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 overflow-y-auto space-y-3">
          
          {/* 1. Projects View */}
          {kpiType === 'projects' && (
            <div className="space-y-2.5">
              {filteredProjects.map((p) => (
                <div
                  key={p.id}
                  onClick={() => setSelectedProjectForDetail(p)}
                  className="p-4 rounded-2xl bg-slate-950/70 hover:bg-slate-900 border border-slate-800 hover:border-indigo-500/70 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs cursor-pointer group shadow-sm hover:shadow-indigo-950/30"
                  title="Click to view full project details, telemetry & status"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm group-hover:text-indigo-400 transition-colors">
                        {p.name}
                      </span>
                      <span className="font-mono text-[10px] text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded">
                        {p.regNumber}
                      </span>
                      <span className="text-[10px] text-indigo-400 font-semibold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
                        <span>View Details</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                    <p className="text-slate-400">{p.ngoName} • {p.scheme}</p>
                    <p className="text-slate-400 text-[11px] flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      {p.district}, {p.state} | Incharge: {p.incharge.name} ({p.incharge.phone})
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <span className="font-mono font-bold text-white">{p.latestAttendance}/{p.beneficiaryCount}</span>
                      <p className="text-[10px] text-slate-400">Beneficiaries</p>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase ${
                        p.attendanceAnomaly
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}
                    >
                      {p.attendanceAnomaly ? 'Anomaly' : 'Normal'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 2. Inspections Today */}
          {kpiType === 'inspections' && (
            <div className="space-y-2.5">
              {filteredInspectionsToday.map((insp) => (
                <div
                  key={insp.id}
                  className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-indigo-400">{insp.id}</span>
                      <span className="font-bold text-white">{insp.projectName}</span>
                    </div>
                    <p className="text-slate-400">{insp.scheme} • {insp.type}</p>
                    <p className="text-[11px] text-slate-400">
                      Inspector: <strong className="text-slate-200">{insp.inspectorName}</strong> ({insp.assignedTeamId}) | Assigned: {insp.assignedDate}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase ${
                        insp.status === 'submitted'
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          : insp.status === 'approved'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {insp.status.replace('_', ' ')}
                    </span>
                    {insp.gpsVerification.verified && (
                      <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 font-mono">
                        GPS Verified
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 3. Pending Duties */}
          {kpiType === 'pending' && (
            <div className="space-y-2.5">
              {filteredPending.map((insp) => (
                <div
                  key={insp.id}
                  className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-amber-400">{insp.id}</span>
                      <span className="font-bold text-white">{insp.projectName}</span>
                    </div>
                    <p className="text-slate-400">Trigger: {insp.triggerReason}</p>
                    <p className="text-[11px] text-amber-300">
                      Assigned: {insp.assignedTeamId} ({insp.inspectorName}) • Scheduled: {insp.scheduledDate}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Awaiting On-Site Check-in
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 4. AI Outlier Alerts */}
          {kpiType === 'alerts' && (
            <div className="space-y-2.5">
              {filteredAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-all space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          alert.severity === 'high'
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {alert.type.replace('_', ' ')}
                      </span>
                      <span className="font-bold text-white text-sm">{alert.title}</span>
                    </div>
                    <span className="font-mono text-[11px] text-slate-400">{alert.timestamp}</span>
                  </div>

                  <p className="text-slate-300">{alert.description}</p>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                    <span className="font-mono text-indigo-400">Score: {alert.dataMetrics.anomalyScore}</span>
                    <span className="text-amber-400">{alert.recommendedAction}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 5. CCTV Surveillance Feeds */}
          {kpiType === 'cctv' && (
            <div className="space-y-2.5">
              {filteredCCTV.map((feed) => (
                <div
                  key={`${feed.projectId}-${feed.id}`}
                  className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-16 h-12 rounded-lg overflow-hidden shrink-0 bg-black border border-slate-800 relative">
                      <img
                        src={feed.imageUrl || 'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f6?auto=format&fit=crop&w=400&q=80'}
                        alt={feed.name}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-1 left-1 w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                    </div>

                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-white">{feed.id}</span>
                        <span className="font-semibold text-slate-200 truncate">{feed.name}</span>
                      </div>
                      <p className="text-slate-400 truncate">{feed.projectName} • {feed.locationArea}</p>
                      <p className="text-[10px] text-slate-500 font-mono truncate">
                        {feed.cameraModel} · {feed.resolution} @ {feed.fps}fps
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-mono text-emerald-400 font-bold">{feed.uptimePercentage}% Uptime</span>
                    <span
                      className={`px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase ${
                        feed.status === 'online'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : feed.status === 'glitch'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {feed.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>

      {/* Nested Project Details & Status Dossier */}
      <ProjectDetailModal
        project={selectedProjectForDetail}
        onClose={() => setSelectedProjectForDetail(null)}
      />
    </div>
  );
};
