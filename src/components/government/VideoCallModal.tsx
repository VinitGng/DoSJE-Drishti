import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  PhoneOff,
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  Camera,
  Maximize2,
  Clock,
  Wifi,
  ShieldCheck,
  User,
  Sparkles,
} from 'lucide-react';

export const VideoCallModal: React.FC = () => {
  const { activeVC, endVideoCall, inspections, addInspectionEvidence } = useApp();
  const [seconds, setSeconds] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isVideoOff, setIsVideoOff] = useState<boolean>(false);
  const [snapshotTaken, setSnapshotTaken] = useState<boolean>(false);
  const [vcNotes, setVcNotes] = useState<string>('');

  useEffect(() => {
    if (!activeVC) return;
    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [activeVC]);

  if (!activeVC) return null;

  const formatDuration = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleCaptureSnapshot = () => {
    setSnapshotTaken(true);
    setTimeout(() => setSnapshotTaken(false), 2000);

    // If an inspection is in progress for this project, attach evidence
    const relatedInsp = inspections.find((i) => i.projectName === activeVC.projectName);
    if (relatedInsp) {
      addInspectionEvidence(relatedInsp.id, {
        id: `ev-vc-${Date.now()}`,
        inspectionId: relatedInsp.id,
        title: `VC Verification: ${activeVC.participantRole} Spot Check`,
        category: 'beneficiaries',
        imageUrl:
          'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=800&q=80',
        timestamp: new Date().toLocaleTimeString() + ' IST',
        coordinates: relatedInsp.gpsVerification.targetCoords,
        locationName: `${activeVC.projectName} (Direct Video Conference)`,
        inspectorId: 'DoSJE-HQ-VC',
        inspectorName: 'DoSJE Supervision Cell',
        note: `Unannounced live VC session verified presence of ${activeVC.participantName} (${activeVC.participantRole}).`,
      });
    }
  };

  const handleEndCall = () => {
    const relatedInsp = inspections.find((i) => i.projectName === activeVC.projectName);
    endVideoCall(
      relatedInsp?.id,
      vcNotes || `Video conference conducted with ${activeVC.participantName} (${activeVC.participantRole}). Visual identity confirmed.`
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden flex flex-col text-slate-100 aspect-video relative">
        
        {/* Main Remote Video Viewport */}
        <div className="relative w-full h-full bg-slate-950 flex items-center justify-center overflow-hidden">
          {/* Simulated Incharge / Beneficiary Feed */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                activeVC.participantRole === 'Beneficiary'
                  ? "url('https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80')"
                  : "url('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80')",
            }}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60 pointer-events-none" />

          {/* OSD Top Bar */}
          <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between text-white text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-bold tracking-wider font-mono">
                ENCRYPTED DoSJE SPOT VC
              </span>
              <span className="px-2 py-0.5 rounded bg-black/60 border border-slate-700 text-slate-300 font-mono">
                {formatDuration(seconds)}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-emerald-400 font-mono text-[11px]">
                <Wifi className="w-3.5 h-3.5" /> 38ms (HD 1080p)
              </span>
              <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-semibold">
                Official Audit Record
              </span>
            </div>
          </div>

          {/* Participant Banner Card */}
          <div className="absolute bottom-20 left-6 text-white space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold">{activeVC.participantName}</h3>
              <span className="px-2 py-0.5 rounded text-xs font-semibold bg-amber-500/30 text-amber-300 border border-amber-500/40">
                {activeVC.participantRole}
              </span>
            </div>
            <p className="text-xs text-slate-300">{activeVC.projectName}</p>
          </div>

          {/* Official Inspector / Officer Self-Picture-in-Picture */}
          <div className="absolute top-16 right-6 w-36 h-28 bg-slate-800 rounded-2xl border-2 border-indigo-500/70 overflow-hidden shadow-2xl flex items-center justify-center">
            {isVideoOff ? (
              <div className="text-slate-400 text-center text-xs">
                <VideoOff className="w-6 h-6 mx-auto mb-1 opacity-50" />
                <span>Cam Muted</span>
              </div>
            ) : (
              <div
                className="w-full h-full bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80')",
                }}
              />
            )}
            <div className="absolute bottom-1 left-2 text-[9px] font-bold text-white bg-black/70 px-1.5 py-0.5 rounded">
              DoSJE Official (HQ)
            </div>
          </div>

          {/* Snapshot Notification Toast */}
          {snapshotTaken && (
            <div className="absolute top-1/2 -translate-y-1/2 px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-2xl flex items-center gap-2 animate-bounce">
              <Camera className="w-4 h-4" />
              <span>Timestamped Snapshot Saved to Inspection Dossier!</span>
            </div>
          )}

          {/* Bottom Floating Control Bar */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-slate-900/90 backdrop-blur-md px-5 py-2.5 rounded-full border border-slate-700/80 shadow-2xl">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`p-3 rounded-full transition-all cursor-pointer ${
                isMuted ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setIsVideoOff(!isVideoOff)}
              className={`p-3 rounded-full transition-all cursor-pointer ${
                isVideoOff ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
              title={isVideoOff ? 'Enable Camera' : 'Disable Camera'}
            >
              {isVideoOff ? <VideoOff className="w-4 h-4" /> : <VideoIcon className="w-4 h-4" />}
            </button>

            <button
              onClick={handleCaptureSnapshot}
              className="p-3 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white transition-all cursor-pointer shadow"
              title="Capture Evidence Snapshot"
            >
              <Camera className="w-4 h-4" />
            </button>

            <button
              onClick={handleEndCall}
              className="px-5 py-3 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-rose-900/40"
            >
              <PhoneOff className="w-4 h-4" />
              <span>End Call</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
