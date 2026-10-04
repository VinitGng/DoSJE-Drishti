import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Building2,
  MapPin,
  Users,
  Video,
  ShieldAlert,
  Calendar,
  Phone,
  Mail,
  User,
  AlertTriangle,
  CheckCircle2,
  Shuffle,
  PhoneCall,
  ExternalLink,
  Clock,
  Landmark,
  ShieldCheck,
  TrendingDown,
  Camera,
} from 'lucide-react';
import { Project } from '../../types';

interface Props {
  project: Project | null;
  onClose: () => void;
  onDispatchInspection?: (project: Project) => void;
}

export const ProjectDetailModal: React.FC<Props> = ({
  project,
  onClose,
  onDispatchInspection,
}) => {
  const { runRandomSurpriseAssignment, setRole, startVideoCall, inspections, issues } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'attendance' | 'cctv' | 'inspections'>('overview');

  if (!project) return null;

  const projectInspections = inspections.filter((i) => i.projectId === project.id);
  const projectIssues = issues.filter((i) => i.projectId === project.id);

  const handleDispatch = () => {
    if (onDispatchInspection) {
      onDispatchInspection(project);
    } else {
      runRandomSurpriseAssignment({ scheme: project.scheme, state: project.state });
      setRole('inspector');
    }
    onClose();
  };

  const getStatusBadge = (status: Project['status']) => {
    switch (status) {
      case 'flagged':
        return {
          label: 'Flagged for Anomaly / Risk',
          color: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
        };
      case 'under_inspection':
        return {
          label: 'Under Active Surprise Audit',
          color: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        };
      case 'action_pending':
        return {
          label: 'Compliance Action Required',
          color: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
        };
      case 'normal':
      default:
        return {
          label: 'Normal & Compliant',
          color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
        };
    }
  };

  const statusInfo = getStatusBadge(project.status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden flex flex-col text-slate-100 max-h-[90vh]">
        
        {/* Top Header Banner */}
        <div className="px-6 py-5 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-800 flex items-center justify-center font-bold text-white shadow-lg shrink-0 border border-indigo-400/30">
              <Building2 className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusInfo.color}`}>
                  {statusInfo.label}
                </span>
                <span className="font-mono text-xs text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                  {project.regNumber}
                </span>
                <span className="text-xs text-slate-400 font-mono">ID: {project.id}</span>
              </div>

              <h2 className="text-lg sm:text-xl font-bold text-white">{project.name}</h2>
              <p className="text-xs text-amber-400 font-medium">{project.scheme} • {project.ngoName}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4 Metric Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-4 bg-slate-950/60 border-b border-slate-800">
          
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-slate-400">Risk Matrix Score</span>
            <div className="flex items-center gap-2">
              <span
                className={`font-mono text-xl font-bold ${
                  project.riskScore > 70
                    ? 'text-rose-400'
                    : project.riskScore > 40
                    ? 'text-amber-400'
                    : 'text-emerald-400'
                }`}
              >
                {project.riskScore}/100
              </span>
              <span className="text-[10px] text-slate-400">
                {project.riskScore > 70 ? 'High Risk' : project.riskScore > 40 ? 'Moderate' : 'Low Risk'}
              </span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-slate-400">Beneficiary Attendance</span>
            <div className="font-mono text-xl font-bold text-white flex items-center gap-1.5">
              <span>{project.latestAttendance}</span>
              <span className="text-xs text-slate-400 font-normal">/ {project.beneficiaryCount}</span>
              {project.attendanceAnomaly && (
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              )}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-slate-400">Surveillance Feeds</span>
            <div className="font-mono text-xl font-bold text-emerald-400">
              {project.cctvFeeds.length} Feeds
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-slate-400">Sanctioned Grant</span>
            <div className="font-mono text-xs font-bold text-emerald-400 truncate mt-1">
              {project.grantAmountAnnual}
            </div>
          </div>

        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-800 bg-slate-900/90 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'border-indigo-500 text-white font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Institute Overview & Location
          </button>

          <button
            onClick={() => setActiveTab('attendance')}
            className={`pb-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'attendance'
                ? 'border-indigo-500 text-white font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Attendance & Anomaly Analytics</span>
            {project.attendanceAnomaly && (
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('cctv')}
            className={`pb-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'cctv'
                ? 'border-indigo-500 text-white font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            CCTV Streams ({project.cctvFeeds.length})
          </button>

          <button
            onClick={() => setActiveTab('inspections')}
            className={`pb-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'inspections'
                ? 'border-indigo-500 text-white font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Inspection Log</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-800 text-slate-300 font-mono">
              {projectInspections.length}
            </span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          
          {/* Tab 1: Overview & Location */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Physical Location Details */}
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center gap-2 font-bold text-white text-sm">
                    <MapPin className="w-4 h-4 text-indigo-400" />
                    <span>Physical Location & GPS Coordinates</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">{project.address}</p>
                  
                  <div className="pt-2 border-t border-slate-800/80 space-y-1 text-slate-400">
                    <div className="flex justify-between">
                      <span>District & State:</span>
                      <span className="font-semibold text-white">{project.district}, {project.state}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Geographic Coordinates:</span>
                      <span className="font-mono text-indigo-300 font-semibold">
                        {project.coordinates.lat.toFixed(4)}°N, {project.coordinates.lng.toFixed(4)}°E
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Geofence Perimeter:</span>
                      <span className="text-emerald-400 font-medium">150m Strict Radius</span>
                    </div>
                  </div>
                </div>

                {/* Authorized Incharge Details */}
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center gap-2 font-bold text-white text-sm">
                    <User className="w-4 h-4 text-emerald-400" />
                    <span>Authorized Project Head</span>
                  </div>
                  <p className="font-bold text-white text-sm">{project.incharge.name}</p>
                  <p className="text-slate-400">{project.incharge.designation}</p>
                  
                  <div className="pt-2 border-t border-slate-800/80 space-y-1 text-slate-400">
                    <div className="flex justify-between">
                      <span>Contact Phone:</span>
                      <span className="font-mono text-slate-200">{project.incharge.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Official Email:</span>
                      <span className="font-mono text-slate-200 truncate max-w-[180px]">{project.incharge.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Staff Strength:</span>
                      <span className="font-semibold text-white">{project.staffCount} Registered Specialists</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Status & Last Inspection Log */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Statutory Governance Status:</span>
                  <span className="font-mono text-slate-400">Last Audit: {project.lastInspectedDate}</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Project is monitored under Department of Social Justice & Empowerment guidelines. All CCTV feeds are connected through RTSP encrypted gateway. Daily attendance is synchronized via biometric terminal.
                </p>
              </div>

            </div>
          )}

          {/* Tab 2: Attendance & Anomaly Tracking */}
          {activeTab === 'attendance' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">7-Day Attendance Trend vs Baseline</span>
                  <span className="font-mono text-slate-400 text-xs">Historical Avg: {project.historicalAvgAttendance}</span>
                </div>

                <div className="grid grid-cols-7 gap-2 pt-2">
                  {project.weeklyAttendance.map((d, i) => {
                    const isToday = i === project.weeklyAttendance.length - 1;
                    const isDip = isToday && project.attendanceAnomaly;
                    return (
                      <div key={d.date} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-1">
                        <span className={`text-base font-bold font-mono block ${isDip ? 'text-rose-400' : 'text-white'}`}>
                          {d.present}
                        </span>
                        <span className="text-[10px] text-slate-400 block truncate">{d.date}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {project.attendanceAnomaly ? (
                <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/40 text-rose-200 space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                    <span>Active Attendance Outlier Detected (Z-Score: -3.84)</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Today's count of {project.latestAttendance} represents a 62.5% drop from the rolling average of {project.historicalAvgAttendance}. Flagged for human review. System recommends conducting an unannounced surprise inspection or spot video check.
                  </p>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 text-emerald-200 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Beneficiary attendance trend is consistent with historical operational records.</span>
                </div>
              )}
            </div>
          )}

          {/* Tab 3: CCTV Feeds */}
          {activeTab === 'cctv' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {project.cctvFeeds.map((feed) => (
                <div key={feed.id} className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2 overflow-hidden">
                  <div className="h-28 rounded-xl overflow-hidden relative bg-black border border-slate-800">
                    <img
                      src={feed.imageUrl || 'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f6?auto=format&fit=crop&w=800&q=80'}
                      alt={feed.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/40" />
                    <div className="absolute top-2 left-2 flex items-center gap-1 font-mono text-[10px] font-bold text-white bg-black/70 px-1.5 py-0.5 rounded border border-white/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                      <span>{feed.id}</span>
                    </div>
                    <span
                      className={`absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        feed.status === 'online'
                          ? 'bg-emerald-500/80 text-white'
                          : 'bg-rose-500/80 text-white'
                      }`}
                    >
                      {feed.status}
                    </span>
                    <div className="absolute bottom-2 left-2 right-2 flex justify-between text-[10px] font-mono text-white/90">
                      <span className="truncate">{feed.locationArea}</span>
                      <span>{feed.resolution}</span>
                    </div>
                  </div>
                  <p className="font-semibold text-white text-xs truncate">{feed.name}</p>
                  <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                    <span>HW: {feed.cameraModel}</span>
                    <span className="text-emerald-400 font-bold">{feed.uptimePercentage}% Uptime</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 4: Inspections & Compliance Issues */}
          {activeTab === 'inspections' && (
            <div className="space-y-3 text-xs">
              {projectInspections.length === 0 ? (
                <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800 text-center text-slate-400">
                  No previous surprise inspections recorded in this cycle.
                </div>
              ) : (
                projectInspections.map((insp) => (
                  <div key={insp.id} className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-indigo-400 font-mono">{insp.id}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-500/20 text-blue-300 border border-blue-500/30">
                        {insp.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-slate-300">Auditor: {insp.inspectorName} ({insp.assignedTeamId})</p>
                    <p className="text-[11px] text-slate-400">Date: {insp.assignedDate} | Trigger: {insp.triggerReason}</p>
                    {insp.overallRating && (
                      <span className="inline-block mt-1 font-semibold text-amber-300">
                        Result: {insp.overallRating}
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

        </div>

        {/* Modal Footer with Direct Actions */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                startVideoCall(
                  project.incharge.name,
                  'Project Incharge',
                  project.name
                )
              }
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 font-semibold text-xs border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Spot VC Call</span>
            </button>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
            >
              Close
            </button>

            <button
              onClick={handleDispatch}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold text-xs shadow-lg shadow-rose-950 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Shuffle className="w-4 h-4" />
              <span>Dispatch Surprise Inspection</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
