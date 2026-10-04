import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Calendar,
  User,
  ShieldCheck,
  Camera,
  ExternalLink,
  Clock,
  Sparkles,
  Building,
  Check,
  X,
  FileCheck,
  AlertCircle,
} from 'lucide-react';
import { Inspection } from '../../types';

export const InspectionReportsViewer: React.FC = () => {
  const { inspections, reviewInspection } = useApp();
  const [selectedInspectionId, setSelectedInspectionId] = useState<string>(
    inspections.find((i) => i.status === 'submitted')?.id || inspections[0]?.id || ''
  );
  const [reviewComments, setReviewComments] = useState<string>('');
  const [showReviewActionSuccess, setShowReviewActionSuccess] = useState<boolean>(false);

  const selectedInsp = inspections.find((i) => i.id === selectedInspectionId) || inspections[0];

  const handleApprove = () => {
    if (!selectedInsp) return;
    reviewInspection(
      selectedInsp.id,
      'approved',
      reviewComments || 'Approved by Joint Secretary. Compliance satisfactory.'
    );
    setShowReviewActionSuccess(true);
    setTimeout(() => setShowReviewActionSuccess(false), 3000);
  };

  const handleIssueNotice = () => {
    if (!selectedInsp) return;
    reviewInspection(
      selectedInsp.id,
      'show_cause_issued',
      reviewComments || 'Show-cause notice issued under DoSJE guidelines. 7 days rectification window.'
    );
    setShowReviewActionSuccess(true);
    setTimeout(() => setShowReviewActionSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl text-white">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <FileCheck className="w-4 h-4" />
            </span>
            <h2 className="font-bold text-lg text-white">Digital Field Inspection Dossiers</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Tamper-proof reports submitted by PMU teams with geo-location coordinates and live watermarked photo evidence
          </p>
        </div>

        <div className="text-xs text-slate-300 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
          Total Dossiers: <strong className="text-white font-mono">{inspections.length}</strong>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Dossier Selection List */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
            Inspection Queue & History
          </h3>

          <div className="space-y-2.5">
            {inspections.map((insp) => {
              const isSelected = insp.id === selectedInsp?.id;
              return (
                <div
                  key={insp.id}
                  onClick={() => setSelectedInspectionId(insp.id)}
                  className={`p-4 rounded-2xl border text-xs cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-800 border-indigo-500 ring-2 ring-indigo-500/30 shadow-md text-white'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono font-bold text-[11px] text-indigo-400">{insp.id}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                        insp.status === 'submitted'
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          : insp.status === 'approved'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : insp.status === 'action_required'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {insp.status.replace('_', ' ')}
                    </span>
                  </div>

                  <h4 className="font-bold text-white text-xs mb-1 truncate">{insp.projectName}</h4>
                  <p className="text-[11px] text-slate-400 truncate">{insp.scheme}</p>

                  <div className="pt-2 mt-2 border-t border-slate-700/50 flex items-center justify-between text-[11px] text-slate-400">
                    <span>{insp.inspectorName} ({insp.assignedTeamId})</span>
                    <span className="flex items-center gap-1 font-mono">
                      {insp.gpsVerification.verified ? (
                        <span className="text-emerald-400 flex items-center gap-0.5">
                          <Check className="w-3 h-3" /> GPS Locked
                        </span>
                      ) : (
                        <span className="text-amber-400">Awaiting Check-in</span>
                      )}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 2 Cols: Full Dossier Detail */}
        {selectedInsp && (
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white space-y-5">
              
              {/* Dossier Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg text-white">{selectedInsp.projectName}</h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      {selectedInsp.type}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{selectedInsp.scheme}</p>
                </div>

                <div className="text-right">
                  <div className="text-xs text-slate-400">Official Dossier ID</div>
                  <div className="font-mono text-sm font-bold text-indigo-400">{selectedInsp.id}</div>
                </div>
              </div>

              {/* Geo-Verification & Officer Metadata Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                
                {/* GPS Status Card */}
                <div
                  className={`p-3 rounded-xl border text-xs ${
                    selectedInsp.gpsVerification.verified
                      ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                      : 'bg-amber-950/30 border-amber-500/40 text-amber-200'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold mb-1">
                    <MapPin className="w-4 h-4 shrink-0" />
                    <span>GPS Verification</span>
                  </div>
                  {selectedInsp.gpsVerification.verified ? (
                    <div className="space-y-0.5 text-[11px] text-emerald-300">
                      <p className="font-semibold">✅ Geofence Confirmed</p>
                      <p className="font-mono">Distance: {selectedInsp.gpsVerification.distanceMeters || 14}m from center</p>
                      <p className="truncate text-slate-300 text-[10px]">{selectedInsp.gpsVerification.verifiedAddress || 'On-site coordinates'}</p>
                    </div>
                  ) : (
                    <p className="text-[11px] text-amber-300">
                      ⚠️ Inspector has not yet performed perimeter verification.
                    </p>
                  )}
                </div>

                {/* Inspector Details Card */}
                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/80 text-xs text-slate-300 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-white">
                    <User className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Field Auditor</span>
                  </div>
                  <p className="font-semibold text-slate-200">{selectedInsp.inspectorName}</p>
                  <p className="text-slate-400 font-mono text-[11px]">{selectedInsp.assignedTeamId}</p>
                  <p className="text-slate-400 text-[10px]">{selectedInsp.assignedDate}</p>
                </div>

                {/* Rating Card */}
                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/80 text-xs text-slate-300 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-white">
                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Audit Finding</span>
                  </div>
                  <div
                    className={`font-bold text-xs ${
                      selectedInsp.overallRating === 'Critical Violations'
                        ? 'text-rose-400'
                        : selectedInsp.overallRating === 'Minor Discrepancies'
                        ? 'text-amber-400'
                        : selectedInsp.overallRating === 'Satisfactory'
                        ? 'text-emerald-400'
                        : 'text-slate-400'
                    }`}
                  >
                    {selectedInsp.overallRating || 'Audit In Progress'}
                  </div>
                  {selectedInsp.vcConducted && (
                    <p className="text-[10px] text-indigo-300">✓ Spot VC Call Conducted</p>
                  )}
                </div>

              </div>

              {/* Checklist Results Table */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Digital Checklist Evaluation ({selectedInsp.checklist.length} Checkpoints)
                </h4>

                <div className="bg-slate-950/60 rounded-xl border border-slate-800 divide-y divide-slate-800/80 overflow-hidden">
                  {selectedInsp.checklist.map((item) => (
                    <div key={item.id} className="p-3 text-xs flex items-start justify-between gap-3">
                      <div className="space-y-0.5 flex-1">
                        <span className="text-[10px] font-mono text-slate-400">{item.category}</span>
                        <p className="font-medium text-slate-200">{item.question}</p>
                        {item.remarks && (
                          <p className="text-[11px] text-amber-300/90 italic bg-amber-950/20 p-1.5 rounded border border-amber-900/30 mt-1">
                            Note: "{item.remarks}"
                          </p>
                        )}
                      </div>

                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase shrink-0 ${
                          item.status === 'pass'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : item.status === 'fail'
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : item.status === 'flagged'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Live Geo-Tagged Evidence Gallery */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-indigo-400" />
                    <span>In-App Watermarked Evidence ({selectedInsp.evidences.length} Artifacts)</span>
                  </h4>
                  <span className="text-[11px] text-slate-400 font-mono">Tamper-Evident GPS Stamp</span>
                </div>

                {selectedInsp.evidences.length === 0 ? (
                  <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 text-center text-xs text-slate-400">
                    No photo evidence submitted yet for this assignment.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedInsp.evidences.map((ev) => (
                      <div
                        key={ev.id}
                        className="group relative rounded-xl overflow-hidden border border-slate-700 bg-black aspect-video shadow-md"
                      >
                        <img
                          src={ev.imageUrl}
                          alt={ev.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />

                        {/* Indelible Watermark Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/60 p-3 flex flex-col justify-between text-white font-mono text-[10px]">
                          <div className="flex justify-between items-start">
                            <span className="bg-red-600/90 text-white font-bold px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wider">
                              DoSJE EVIDENCE SEAL
                            </span>
                            <span className="bg-black/60 px-1.5 py-0.5 rounded border border-white/20">
                              {ev.timestamp}
                            </span>
                          </div>

                          <div className="space-y-0.5 bg-black/70 p-2 rounded border border-white/10 backdrop-blur-xs">
                            <p className="font-bold text-amber-300 truncate font-sans text-xs">{ev.title}</p>
                            <p className="text-slate-300">
                              LAT: {ev.coordinates.lat.toFixed(5)}°N | LON: {ev.coordinates.lng.toFixed(5)}°E
                            </p>
                            <p className="text-slate-400 truncate">INSP: {ev.inspectorName} ({selectedInsp.id})</p>
                            {ev.note && <p className="text-emerald-300 font-sans text-[11px] mt-0.5 italic">"{ev.note}"</p>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Inspector Closing Remarks */}
              {selectedInsp.inspectorRemarks && (
                <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 text-xs space-y-1">
                  <span className="font-bold text-amber-400">Inspector's Official Summary:</span>
                  <p className="text-slate-200 leading-relaxed">{selectedInsp.inspectorRemarks}</p>
                </div>
              )}

              {/* Supervisor Review Action Box */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 to-indigo-950/60 border border-indigo-700/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    <h4 className="font-bold text-xs text-white uppercase tracking-wider">
                      Department Supervisor Audit Determination
                    </h4>
                  </div>
                  {showReviewActionSuccess && (
                    <span className="text-xs text-emerald-400 font-semibold animate-pulse">
                      Action Dispatched to State Registry!
                    </span>
                  )}
                </div>

                <textarea
                  value={reviewComments}
                  onChange={(e) => setReviewComments(e.target.value)}
                  placeholder="Enter supervisor directive or formal compliance note..."
                  rows={2}
                  className="w-full bg-slate-950/80 border border-slate-700 rounded-xl p-3 text-xs text-white outline-none focus:ring-2 focus:ring-indigo-500 placeholder-slate-500"
                />

                <div className="flex items-center justify-end gap-2.5">
                  <button
                    onClick={handleIssueNotice}
                    className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Issue Show-Cause Notice (Action Required)</span>
                  </button>

                  <button
                    onClick={handleApprove}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approve & Archive Report</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
