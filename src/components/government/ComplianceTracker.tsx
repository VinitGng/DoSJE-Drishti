import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldAlert,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  FileText,
  UserCheck,
  Building,
  Check,
  X,
  Sparkles,
} from 'lucide-react';
import { IssueCompliance } from '../../types';

export const ComplianceTracker: React.FC = () => {
  const { issues, verifyATR } = useApp();
  const [selectedIssueId, setSelectedIssueId] = useState<string>(issues[0]?.id || '');
  const [verificationNotes, setVerificationNotes] = useState<string>('');

  const selectedIssue = issues.find((i) => i.id === selectedIssueId) || issues[0];

  const handleVerify = (accepted: boolean) => {
    if (!selectedIssue) return;
    verifyATR(
      selectedIssue.id,
      accepted,
      verificationNotes || (accepted ? 'Corrective action verified on-site by PMU.' : 'Explanation insufficient. Re-inspection ordered.')
    );
    setVerificationNotes('');
  };

  const getStageColor = (stage: IssueCompliance['stage']) => {
    switch (stage) {
      case 'issue_found':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      case 'notice_issued':
      case 'action_required':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'corrected':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'verified':
      case 'resolved':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl text-white">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <ShieldAlert className="w-4 h-4" />
            </span>
            <h2 className="font-bold text-lg text-white">Issue & Action Taken Report (ATR) Tracking</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            End-to-end audit lifecycle: Issue Found → Notice Issued → NGO Action Required → Corrected → Verified → Resolved
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Active Issues:</span>
          <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 font-mono font-bold text-xs border border-amber-500/30">
            {issues.filter((i) => i.stage !== 'resolved').length} Open
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Issues List */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
            Compliance Dockets
          </h3>

          <div className="space-y-2.5">
            {issues.map((iss) => {
              const isSelected = iss.id === selectedIssue?.id;
              return (
                <div
                  key={iss.id}
                  onClick={() => setSelectedIssueId(iss.id)}
                  className={`p-4 rounded-2xl border text-xs cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-800 border-amber-500 ring-2 ring-amber-500/30 shadow-md text-white'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono font-bold text-[11px] text-amber-400">{iss.id}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getStageColor(iss.stage)}`}>
                      {iss.stage.replace('_', ' ')}
                    </span>
                  </div>

                  <h4 className="font-bold text-white text-xs mb-1 line-clamp-1">{iss.title}</h4>
                  <p className="text-[11px] text-slate-400 truncate">{iss.projectName}</p>

                  <div className="pt-2 mt-2 border-t border-slate-700/50 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Deadline: {iss.deadlineDate}</span>
                    <span className="font-mono text-indigo-400">{iss.inspectionId}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 2 Cols: Issue Lifecycle & Action */}
        {selectedIssue && (
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white space-y-5">
              
              {/* Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                    Compliance Investigation Docket
                  </span>
                  <h3 className="font-bold text-base text-white mt-1">{selectedIssue.title}</h3>
                  <p className="text-xs text-slate-400">{selectedIssue.projectName} • {selectedIssue.scheme}</p>
                </div>
                <div className="text-right">
                  <span className="font-mono text-xs font-bold text-amber-400">{selectedIssue.id}</span>
                  <p className="text-[11px] text-slate-400">Issued: {selectedIssue.issuedDate}</p>
                </div>
              </div>

              {/* Visual 5-Stage Stepper */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Audit Resolution Progress
                </div>

                <div className="grid grid-cols-5 gap-2 text-center text-[10px] font-medium">
                  {[
                    { key: 'issue_found', label: '1. Issue Found' },
                    { key: 'notice_issued', label: '2. Notice Issued' },
                    { key: 'action_required', label: '3. Action Required' },
                    { key: 'corrected', label: '4. Corrected (ATR)' },
                    { key: 'resolved', label: '5. Resolved' },
                  ].map((st, idx) => {
                    const stages = ['issue_found', 'notice_issued', 'action_required', 'corrected', 'resolved'];
                    const currentIdx = stages.indexOf(selectedIssue.stage);
                    const isDone = currentIdx >= idx;
                    const isCurrent = stages[idx] === selectedIssue.stage;

                    return (
                      <div key={st.key} className="space-y-1">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            isCurrent
                              ? 'bg-amber-400 shadow-md shadow-amber-500/50'
                              : isDone
                              ? 'bg-emerald-500'
                              : 'bg-slate-800'
                          }`}
                        />
                        <span
                          className={`block truncate ${
                            isCurrent
                              ? 'text-amber-400 font-bold'
                              : isDone
                              ? 'text-emerald-400'
                              : 'text-slate-500'
                          }`}
                        >
                          {st.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5 text-xs">
                <span className="font-bold text-slate-300">Observation Recorded by Inspector:</span>
                <p className="p-3 rounded-xl bg-slate-800/60 border border-slate-700 text-slate-200 leading-relaxed">
                  {selectedIssue.description}
                </p>
              </div>

              {/* NGO ATR Response Section */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  NGO Action Taken Report (ATR)
                </h4>

                {selectedIssue.ngoResponse ? (
                  <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3 text-xs">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span className="text-emerald-400 font-semibold">Submitted by Project Head</span>
                      <span className="font-mono">{selectedIssue.ngoResponse.date}</span>
                    </div>

                    <p className="text-slate-200 leading-relaxed">
                      "{selectedIssue.ngoResponse.explanation}"
                    </p>

                    {selectedIssue.ngoResponse.evidenceImageUrl && (
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-400 font-semibold uppercase">
                          Rectification Photographic Evidence:
                        </span>
                        <div className="w-48 h-32 rounded-lg overflow-hidden border border-slate-700 bg-black">
                          <img
                            src={selectedIssue.ngoResponse.evidenceImageUrl}
                            alt="Rectification"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-600/30 text-amber-200 text-xs">
                    <p className="font-semibold">Awaiting NGO Rectification Submission</p>
                    <p className="text-[11px] text-amber-300 mt-0.5">
                      Deadline expires on {selectedIssue.deadlineDate}. The NGO can upload their ATR with photographic proof via the NGO Portal.
                    </p>
                  </div>
                )}
              </div>

              {/* PMU Final Verification Cell */}
              {selectedIssue.stage === 'corrected' && (
                <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-600/40 space-y-3">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-indigo-400" />
                    <h4 className="font-bold text-xs text-white uppercase tracking-wider">
                      PMU Final Verification & Closure Decision
                    </h4>
                  </div>

                  <input
                    type="text"
                    value={verificationNotes}
                    onChange={(e) => setVerificationNotes(e.target.value)}
                    placeholder="Enter verification comments (e.g. Physical re-inspection confirmed fire exit is clear)..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:ring-2 focus:ring-indigo-500"
                  />

                  <div className="flex items-center justify-end gap-2.5">
                    <button
                      onClick={() => handleVerify(false)}
                      className="px-3 py-1.5 rounded-lg bg-rose-600/80 hover:bg-rose-600 text-white font-bold text-xs transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Reject ATR (Re-inspection)</span>
                    </button>

                    <button
                      onClick={() => handleVerify(true)}
                      className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors flex items-center gap-1 cursor-pointer shadow"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Verify & Mark Resolved</span>
                    </button>
                  </div>
                </div>
              )}

              {/* If resolved */}
              {selectedIssue.stage === 'resolved' && (
                <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-xs text-emerald-200 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    <strong>Resolved:</strong> Rectification certified by PMU Verification Cell. Compliance dossier archived.
                  </span>
                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
