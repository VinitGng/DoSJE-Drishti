import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  BrainCircuit,
  CheckCircle2,
  PhoneCall,
  Sparkles,
  X,
  Building2,
  MapPin,
  Calendar,
  Video,
  FileText,
  Clock,
  Send,
  Radio,
  UserCheck,
  Check,
  ArrowRight,
} from 'lucide-react';
import { AIAlert, Project, CCTVFeed } from '../../types';

interface AnomalyInvestigationModalProps {
  isOpen: boolean;
  onClose: () => void;
  alert: AIAlert;
  project: Project;
  onDispatchInspection: (project: Project) => void;
  onStartVideoCall: (name: string, role: 'Project Incharge' | 'Staff Member' | 'Beneficiary', project: string) => void;
  onUpdateStatus: (alertId: string, status: 'active' | 'investigating' | 'resolved') => void;
}

export const AnomalyInvestigationModal: React.FC<AnomalyInvestigationModalProps> = ({
  isOpen,
  onClose,
  alert,
  project,
  onDispatchInspection,
  onStartVideoCall,
  onUpdateStatus,
}) => {
  if (!isOpen || !alert || !project) return null;

  const [activeCameraIndex, setActiveCameraIndex] = useState<number>(0);
  const [currentStatus, setCurrentStatus] = useState<'active' | 'investigating' | 'resolved'>(alert.status || 'active');
  const [investigatorNotes, setInvestigatorNotes] = useState<string>(
    'Investigating statistical variance between biometric muster rolls and optical feeds.'
  );
  const [showDispatchSuccess, setShowDispatchSuccess] = useState<boolean>(false);
  const [showNoticeSuccess, setShowNoticeSuccess] = useState<boolean>(false);
  const [statusUpdatedFeedback, setStatusUpdatedFeedback] = useState<boolean>(false);

  const feeds = project.cctvFeeds || [];
  const activeFeed = feeds[activeCameraIndex] || feeds[0];

  // Industrial & Construction Site CCTV Imagery Helper with guaranteed unique images
  const getCCTVImageUrl = (feed?: CCTVFeed) => {
    if (feed?.imageUrl) return feed.imageUrl;
    if (feed?.id === 'CAM-01') {
      return 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80';
    }
    if (feed?.id === 'CAM-02') {
      return 'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f6?auto=format&fit=crop&w=1200&q=80';
    }
    if (feed?.id === 'CAM-03') {
      return 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80';
    }
    if (feed?.id === 'CAM-04') {
      return 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1200&q=80';
    }
    return 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=1200&q=80';
  };

  const getCleanLabel = (name: string, id: string) => {
    const raw = name.includes(':') ? name.split(':')[1]?.trim() : name;
    const lower = raw.toLowerCase();
    if (lower.includes('dining')) return 'Structural Steel Fabrication & Heavy Welding Yard';
    if (lower.includes('therapy') || lower.includes('classroom')) return 'Civil Construction & High-Rise Scaffolding Grid';
    if (lower.includes('dormitory') || lower.includes('lobby') || lower.includes('passage')) return 'Industrial Warehouse Logistics & High-Bay Depot';
    if (lower.includes('visitor') || lower.includes('gate') || lower.includes('entrance')) return 'Industrial Container Terminal & Heavy Freight Weighbridge';
    if (lower.includes('recreation')) return 'Pre-Engineered Steel Erection & Tower Crane Zone';
    if (lower.includes('kitchen')) return 'Industrial Automation & Heavy Machinery Floor';
    if (lower.includes('courtyard')) return 'Concrete Batching Plant & Cement Silo Yard';
    return raw;
  };

  const getCleanLocationArea = (area: string, id: string) => {
    const lower = area.toLowerCase();
    if (lower.includes('dining')) return 'Heavy Fabrication Yard A';
    if (lower.includes('therapy') || lower.includes('classroom')) return 'Sector-3 Concrete & Scaffolding Grid';
    if (lower.includes('dormitory') || lower.includes('lobby') || lower.includes('passage')) return 'Raw Material Inventory Bay B';
    if (lower.includes('gate') || lower.includes('visitor') || lower.includes('entrance')) return 'Main Freight Gate & Weighbridge';
    if (lower.includes('recreation') || lower.includes('common')) return 'Tower Crane Erection Sector B';
    if (lower.includes('kitchen')) return 'Manufacturing Unit 1 Assembly Line';
    if (lower.includes('courtyard')) return 'Batching Silo & Aggregate Hopper';
    return area;
  };

  const handleDispatch = () => {
    onDispatchInspection(project);
    setShowDispatchSuccess(true);
    setCurrentStatus('investigating');
    onUpdateStatus(alert.id, 'investigating');
    setTimeout(() => setShowDispatchSuccess(false), 5000);
  };

  const handleIssueNotice = () => {
    setShowNoticeSuccess(true);
    setCurrentStatus('investigating');
    onUpdateStatus(alert.id, 'investigating');
    setTimeout(() => setShowNoticeSuccess(false), 5000);
  };

  const handleStatusChange = (newStatus: 'active' | 'investigating' | 'resolved') => {
    setCurrentStatus(newStatus);
    onUpdateStatus(alert.id, newStatus);
    setStatusUpdatedFeedback(true);
    setTimeout(() => setStatusUpdatedFeedback(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-5 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-4xl w-full p-4 sm:p-6 text-white space-y-4 shadow-2xl max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base sm:text-lg text-white">
                  AI Anomaly Diagnostic & Statutory Investigation
                </h3>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${
                    alert.severity === 'high'
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  }`}
                >
                  {alert.severity} PRIORITY
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {alert.id}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Department of Social Justice & Empowerment (DoSJE) · Evidentiary Early-Warning Verification
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="space-y-4 overflow-y-auto pr-1">
          
          {/* Facility & Anomaly Summary Card */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-800/80">
              <div>
                <span className="text-[10px] font-mono text-indigo-400 uppercase font-bold tracking-wider">
                  Target Facility
                </span>
                <h4 className="font-bold text-base text-white">{project.name}</h4>
                <p className="text-xs text-slate-400">
                  {project.scheme} · {project.district}, {project.state}
                </p>
              </div>

              {/* Status Badge & Controller */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Investigation Status:</span>
                <select
                  value={currentStatus}
                  onChange={(e) => handleStatusChange(e.target.value as any)}
                  className="bg-slate-800 border border-slate-700 text-xs font-semibold rounded-xl px-3 py-1.5 outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer text-white"
                >
                  <option value="active">Active (Pending Action)</option>
                  <option value="investigating">Under Active Investigation</option>
                  <option value="resolved">Resolved & Cleared</option>
                </select>
              </div>
            </div>

            {/* In-Charge Details & Coordinates */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-slate-300">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-500 block uppercase font-mono">On-Site Incharge</span>
                <span className="font-semibold text-white block">{project.incharge.name}</span>
                <span className="text-[11px] text-slate-400">{project.incharge.phone}</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-500 block uppercase font-mono">Target Coordinates</span>
                <span className="font-mono text-white font-semibold block">
                  {project.coordinates.lat.toFixed(4)}°N, {project.coordinates.lng.toFixed(4)}°E
                </span>
                <span className="text-[11px] text-emerald-400 font-mono">Geofence Perimeter Active</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-500 block uppercase font-mono">Detection Time</span>
                <span className="font-mono text-amber-300 font-semibold block">{alert.timestamp}</span>
                <span className="text-[11px] text-slate-400">Automated Sensor Scan</span>
              </div>
            </div>
          </div>

          {/* Forensic Anomaly Comparison Matrix */}
          <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-indigo-400" />
                <h4 className="font-bold text-sm text-white">{alert.title}</h4>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold">
                Confidence: 96.2%
              </span>
            </div>

            <p className="text-xs text-slate-200 leading-relaxed bg-black/40 p-3 rounded-xl border border-indigo-500/20">
              {alert.description}
            </p>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-mono">Expected Normal Baseline</span>
                <span className="text-base font-bold font-mono text-white">{alert.dataMetrics.baseline}</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-mono">Current Sensor Reading</span>
                <span className="text-base font-bold font-mono text-rose-400">{alert.dataMetrics.current}</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-mono">Statistical Outlier Score</span>
                <span className="text-base font-bold font-mono text-amber-400">{alert.dataMetrics.anomalyScore}</span>
              </div>
            </div>
          </div>

          {/* Optical CCTV Surveillance Cross-Verification Feed (Industrial / Construction Sites) */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span className="font-bold text-xs text-white uppercase tracking-wider">
                  Real-Time Optical Surveillance Feed
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                {feeds.length} Active Industrial Streams
              </span>
            </div>

            {/* Active CCTV Player Viewport */}
            <div className="relative aspect-video rounded-2xl overflow-hidden border border-slate-800 bg-black shadow-lg">
              <img
                src={getCCTVImageUrl(activeFeed)}
                alt={activeFeed?.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/60 pointer-events-none" />
              <div className="absolute inset-0 cctv-scanline opacity-60 pointer-events-none" />

              {/* OSD Top Bar */}
              <div className="absolute top-2.5 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-white">
                <div className="flex items-center gap-2 bg-black/75 px-2 py-0.5 rounded-md border border-red-500/40">
                  <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
                  <span className="font-bold text-red-400">● LIVE OPTICAL REC</span>
                  <span className="text-slate-400">|</span>
                  <span className="text-amber-300 font-semibold">{getCleanLabel(activeFeed?.name || '', activeFeed?.id || '')}</span>
                </div>
                <span className="bg-black/75 px-2 py-0.5 rounded-md border border-white/20 text-emerald-300">
                  {activeFeed?.resolution} @ {activeFeed?.fps}fps
                </span>
              </div>

              {/* OSD Bottom Bar */}
              <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-white">
                <span className="bg-black/75 px-2 py-0.5 rounded border border-slate-700 text-slate-300">
                  Location: {getCleanLocationArea(activeFeed?.locationArea || '', activeFeed?.id || '')}
                </span>
                <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
                  Hardware: {activeFeed?.cameraModel}
                </span>
              </div>
            </div>

            {/* Mini Switcher for Multiple Industrial Cameras */}
            {feeds.length > 1 && (
              <div className="flex items-center gap-2 pt-1 overflow-x-auto">
                <span className="text-[10px] font-mono text-slate-400 uppercase shrink-0">Switch Camera:</span>
                {feeds.map((feed, idx) => (
                  <button
                    key={feed.id}
                    type="button"
                    onClick={() => setActiveCameraIndex(idx)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                      activeCameraIndex === idx
                        ? 'bg-indigo-600 text-white shadow'
                        : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {feed.id}: {getCleanLocationArea(feed.locationArea, feed.id)}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Investigator Notes */}
          <div className="space-y-1.5 text-xs">
            <label className="font-semibold text-slate-300 block">
              Official Vigilance Investigation Findings & Notes:
            </label>
            <textarea
              rows={2}
              value={investigatorNotes}
              onChange={(e) => setInvestigatorNotes(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Record investigative audit observations, cross-verification with biometric logs..."
            />
          </div>

          {/* Action Success Banners */}
          {showDispatchSuccess && (
            <div className="p-3 rounded-2xl bg-emerald-950/70 border border-emerald-500 text-emerald-300 text-xs font-semibold flex items-center gap-2.5 animate-in zoom-in-95 duration-150">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <p className="font-bold text-white">Surprise PMU Inspection Dispatched!</p>
                <p className="text-[11px] text-emerald-300">
                  Encrypted mandate assigned to the nearest unannounced field officer with immediate geofenced arrival order.
                </p>
              </div>
            </div>
          )}

          {showNoticeSuccess && (
            <div className="p-3 rounded-2xl bg-amber-950/70 border border-amber-500 text-amber-300 text-xs font-semibold flex items-center gap-2.5 animate-in zoom-in-95 duration-150">
              <FileText className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <p className="font-bold text-white">Statutory Show-Cause Notice Issued (Rule 18-A)</p>
                <p className="text-[11px] text-amber-300">
                  Formal notice delivered to {project.incharge.name} ({project.incharge.email}). 48-hour compliance explanation timer initiated.
                </p>
              </div>
            </div>
          )}

          {statusUpdatedFeedback && (
            <div className="p-2.5 rounded-xl bg-indigo-950/70 border border-indigo-500 text-indigo-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-150">
              <Check className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>Investigation record updated and synced with Central Directorate Audit Vault.</span>
            </div>
          )}

        </div>

        {/* Modal Actions Footer */}
        <div className="px-1 pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold cursor-pointer transition-colors"
          >
            Close
          </button>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={() => onStartVideoCall(project.incharge.name, 'Project Incharge', project.name)}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-indigo-300 hover:text-white border border-indigo-500/40 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
            >
              <PhoneCall className="w-3.5 h-3.5 text-indigo-400" />
              <span>Spot Video Call Check</span>
            </button>

            <button
              type="button"
              onClick={handleIssueNotice}
              className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Issue Show-Cause Notice</span>
            </button>

            <button
              type="button"
              onClick={handleDispatch}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-rose-950 active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Dispatch Surprise PMU Audit</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
