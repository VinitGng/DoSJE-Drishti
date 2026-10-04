import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Video,
  Radio,
  Maximize2,
  RefreshCw,
  AlertTriangle,
  Camera,
  PhoneCall,
  Sliders,
  Eye,
  ShieldCheck,
  CheckCircle,
  Building,
} from 'lucide-react';
import { CCTVFeed, Project } from '../../types';

export const CCTVMonitoring: React.FC = () => {
  const { projects, startVideoCall, runRandomSurpriseAssignment, setRole } = useApp();
  const [selectedProjectId, setSelectedProjectId] = useState<string>('PRJ-001');
  const [activeCameraId, setActiveCameraId] = useState<string>('CAM-01');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<string>('');

  const currentProject = projects.find((p) => p.id === selectedProjectId) || projects[0];
  const feeds = currentProject?.cctvFeeds || [];
  const activeFeed = feeds.find((f) => f.id === activeCameraId) || feeds[0];

  // Industrial & Construction Site CCTV Imagery Helper with guaranteed unique images
  const getCCTVImageUrl = (feed?: CCTVFeed) => {
    if (feed?.imageUrl) return feed.imageUrl;
    // Guaranteed unique fallback mapping by feed ID
    if (feed?.id === 'CAM-01') {
      return 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80'; // Welding & Steel Fabrication
    }
    if (feed?.id === 'CAM-02') {
      return 'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f6?auto=format&fit=crop&w=1200&q=80'; // Scaffolding & Civil Grid
    }
    if (feed?.id === 'CAM-03') {
      return 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80'; // Logistics Warehouse
    }
    if (feed?.id === 'CAM-04') {
      return 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1200&q=80'; // Container Terminal & Gate
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

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) +
          ' ' +
          now.toLocaleTimeString('en-IN', { hour12: false }) +
          ' IST'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleDispatchSurprise = () => {
    runRandomSurpriseAssignment({ scheme: currentProject.scheme });
    setRole('inspector');
  };

  return (
    <div className="space-y-6">
      {/* CCTV Top Controls Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl text-white">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30">
              <Video className="w-4 h-4 animate-pulse" />
            </span>
            <h2 className="font-bold text-lg text-white">Central CCTV Surveillance Hub</h2>
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              94.8% Network Online
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time optical audit of registered DoSJE welfare facilities without requiring new hardware installation
          </p>
        </div>

        {/* Project Selector Dropdown */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <label className="text-xs text-slate-400 whitespace-nowrap">Select Project:</label>
          <select
            value={selectedProjectId}
            onChange={(e) => {
              setSelectedProjectId(e.target.value);
              const p = projects.find((proj) => proj.id === e.target.value);
              if (p?.cctvFeeds?.[0]) {
                setActiveCameraId(p.cctvFeeds[0].id);
              }
            }}
            className="bg-slate-800 border border-slate-700 text-white text-xs rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none w-full sm:w-72"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.state})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main CCTV Feed Grid & Viewport */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Active Video Viewport */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative bg-black rounded-2xl overflow-hidden border border-slate-800 shadow-2xl aspect-video group">
            {/* Simulated Live Scene Display */}
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
              {/* Dynamic Camera Background visual based on camera location */}
              <div
                className={`w-full h-full bg-cover bg-center transition-transform duration-700 ${
                  activeFeed?.status === 'glitch' ? 'filter blur-[1px] opacity-60' : 'opacity-90'
                }`}
                style={{
                  backgroundImage: `url('${getCCTVImageUrl(activeFeed)}')`,
                }}
              />

              {/* Scanline & video grain effect overlay */}
              <div className="absolute inset-0 cctv-scanline opacity-70 pointer-events-none" />
              {activeFeed?.status === 'glitch' && (
                <div className="absolute inset-0 bg-red-950/20 backdrop-filter backdrop-invert-[0.1] pointer-events-none animate-pulse" />
              )}
            </div>

            {/* OSD (On-Screen Display) Top Bar */}
            <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent flex items-center justify-between text-white font-mono text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
                <span className="font-bold tracking-wider text-red-500 uppercase">● LIVE REC</span>
                <span className="text-slate-300">|</span>
                <span className="text-amber-400 font-semibold">{currentProject.name}</span>
                <span className="text-slate-400">({getCleanLocationArea(activeFeed?.locationArea || '', activeFeed?.id || '')})</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-emerald-400">{activeFeed?.resolution}</span>
                <span className="text-slate-400">{activeFeed?.fps} FPS</span>
                <span className="text-white font-bold bg-black/50 px-2 py-0.5 rounded border border-white/20">
                  {currentTime}
                </span>
              </div>
            </div>

            {/* OSD Bottom Bar */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-center justify-between text-white text-xs">
              <div className="flex items-center gap-3 font-mono">
                <div className="px-2 py-0.5 rounded bg-black/60 border border-slate-700 text-slate-300">
                  CAM ID: <span className="text-white font-bold">{activeFeed?.id}</span>
                </div>
                <div className="text-slate-400">
                  HW: <span className="text-slate-200">{activeFeed?.cameraModel}</span>
                </div>
                {activeFeed?.status === 'glitch' ? (
                  <span className="px-2 py-0.5 rounded bg-red-500/20 border border-red-500 text-red-400 font-semibold flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Packet Loss (42%)
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500 text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Stream Healthy
                  </span>
                )}
              </div>

              {/* Viewport Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    startVideoCall(
                      currentProject.incharge.name,
                      'Project Incharge',
                      currentProject.name
                    )
                  }
                  className="px-2.5 py-1.5 rounded-lg bg-indigo-600/90 hover:bg-indigo-600 text-white font-medium flex items-center gap-1.5 transition-all text-xs cursor-pointer shadow"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-indigo-200" />
                  <span>Spot VC Call</span>
                </button>

                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-white transition-all text-xs"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Camera Selection Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {feeds.map((feed) => {
              const isSelected = feed.id === activeCameraId;
              return (
                <button
                  key={feed.id}
                  onClick={() => setActiveCameraId(feed.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden group ${
                    isSelected
                      ? 'bg-slate-800 border-indigo-500 shadow-md ring-2 ring-indigo-500/30'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="h-16 rounded-lg overflow-hidden relative mb-2 bg-black border border-slate-800">
                    <img
                      src={getCCTVImageUrl(feed)}
                      alt={feed.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
                    <div className="absolute top-1 left-1.5 flex items-center gap-1 font-mono text-[9px] font-bold text-white bg-black/60 px-1 rounded">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                      <span>{feed.id}</span>
                    </div>
                    <span
                      className={`absolute top-1.5 right-1.5 w-2 h-2 rounded-full ${
                        feed.status === 'online'
                          ? 'bg-emerald-400'
                          : feed.status === 'glitch'
                          ? 'bg-amber-400 animate-ping'
                          : 'bg-rose-500'
                      }`}
                    />
                  </div>
                  <p className="text-xs font-semibold text-slate-200 truncate">{getCleanLocationArea(feed.locationArea, feed.id)}</p>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5 truncate">{getCleanLabel(feed.name, feed.id)}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Col: Institute Surveillance Status & Actions */}
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                  Institute Telemetry
                </span>
                <h3 className="font-bold text-base text-white mt-1.5">{currentProject.name}</h3>
                <p className="text-xs text-slate-400">{currentProject.scheme}</p>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400">Risk Score</span>
                <div
                  className={`text-lg font-bold font-mono ${
                    currentProject.riskScore > 70
                      ? 'text-rose-400'
                      : currentProject.riskScore > 40
                      ? 'text-amber-400'
                      : 'text-emerald-400'
                  }`}
                >
                  {currentProject.riskScore}/100
                </div>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-3 space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Project Incharge:</span>
                <span className="font-medium text-white">{currentProject.incharge.name}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Contact:</span>
                <span className="font-mono text-slate-300">{currentProject.incharge.phone}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Location:</span>
                <span className="text-slate-300 truncate max-w-[180px]">{currentProject.district}, {currentProject.state}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">CCTV Coverage:</span>
                <span className="text-emerald-400 font-semibold">{feeds.length} Active Feeds</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Last Physical Inspection:</span>
                <span className="text-slate-300 font-mono">{currentProject.lastInspectedDate}</span>
              </div>
            </div>

            {/* Attendance Quick Banner */}
            <div className={`p-3 rounded-xl border text-xs ${
              currentProject.attendanceAnomaly
                ? 'bg-rose-950/30 border-rose-600/40 text-rose-200'
                : 'bg-emerald-950/20 border-emerald-700/40 text-emerald-200'
            }`}>
              <div className="flex items-center justify-between font-bold mb-1">
                <span>Today's Headcount</span>
                <span className="font-mono text-sm">{currentProject.latestAttendance} / {currentProject.beneficiaryCount}</span>
              </div>
              {currentProject.attendanceAnomaly ? (
                <p className="text-[11px] text-rose-300 flex items-center gap-1 mt-1">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  Severe drop vs historical avg ({currentProject.historicalAvgAttendance}). Triggering unannounced audit.
                </p>
              ) : (
                <p className="text-[11px] text-emerald-300 flex items-center gap-1 mt-1">
                  <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                  Attendance conforms to expected historical pattern.
                </p>
              )}
            </div>

            {/* Action buttons */}
            <div className="space-y-2 pt-2">
              <button
                onClick={handleDispatchSurprise}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold text-xs shadow-lg shadow-rose-900/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Dispatch Surprise Inspection Now</span>
              </button>

              <button
                onClick={() =>
                  startVideoCall(
                    currentProject.incharge.name,
                    'Project Incharge',
                    currentProject.name
                  )
                }
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <PhoneCall className="w-4 h-4 text-indigo-400" />
                <span>Initiate Random Video Conferencing (VC)</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
