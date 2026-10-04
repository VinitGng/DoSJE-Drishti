import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Smartphone,
  MapPin,
  Clock,
  ShieldAlert,
  ClipboardCheck,
  Camera,
  CheckCircle2,
  AlertTriangle,
  Send,
  Building2,
  ArrowLeft,
  PhoneCall,
  User,
  ShieldCheck,
  Check,
  X,
  Sparkles,
  Wifi,
  WifiOff,
  RefreshCw,
  Database,
  CloudOff,
  Lock,
  History,
  FileDown,
} from 'lucide-react';
import { GPSVerificationCard } from './GPSVerificationCard';
import { DigitalChecklist } from './DigitalChecklist';
import { LiveEvidenceCamera } from './LiveEvidenceCamera';
import { OfflineHistoryTab } from './OfflineHistoryTab';
import { Inspection } from '../../types';
import { exportInspectionReportPDF } from '../../utils/pdfExport';

export const InspectorApp: React.FC = () => {
  const {
    inspections,
    projects,
    isPhoneFrame,
    submitInspection,
    startVideoCall,
    setRole,
    isOnline,
    isSimulatedOffline,
    toggleSimulateOffline,
    syncQueue,
    isSyncing,
    syncProgress,
    lastSyncTime,
    triggerManualSync,
  } = useApp();

  const effectiveOnline = isOnline && !isSimulatedOffline;
  const pendingQueue = syncQueue.filter(
    (item) => item.status === 'queued_offline' || item.status === 'failed'
  );

  const [activeInspectionId, setActiveInspectionId] = useState<string>(
    inspections.find((i) => i.status === 'assigned' || i.status === 'in_progress')?.id ||
      inspections[0]?.id ||
      ''
  );

  const [selectedSubTab, setSelectedSubTab] = useState<'brief' | 'gps' | 'checklist' | 'evidence' | 'submit' | 'history'>('gps');
  const [overallRating, setOverallRating] = useState<'Satisfactory' | 'Minor Discrepancies' | 'Critical Violations'>('Minor Discrepancies');
  const [generalRemarks, setGeneralRemarks] = useState<string>('Physical headcount verified. Verified nutrition hygiene and student enrollment registers on-site.');
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [submissionSuccess, setSubmissionSuccess] = useState<boolean>(false);
  const [showQueueDetails, setShowQueueDetails] = useState<boolean>(false);
  const [workflowLockMessage, setWorkflowLockMessage] = useState<string | null>(null);

  const currentInspection = inspections.find((i) => i.id === activeInspectionId) || inspections[0];

  // Auto-sync active inspection to assigned tasks or when new surprise inspections are dispatched
  useEffect(() => {
    if (!inspections.some((i) => i.id === activeInspectionId)) {
      const latestAssigned = inspections.find((i) => i.status === 'assigned' || i.status === 'in_progress');
      setActiveInspectionId(latestAssigned?.id || inspections[0]?.id || '');
    }
  }, [inspections, activeInspectionId]);

  // Persistent local storage mechanism in the Inspector App to store inspection data when isOnline is false
  useEffect(() => {
    if (!effectiveOnline && currentInspection) {
      try {
        const offlineSnapshot = {
          inspectionId: currentInspection.id,
          savedAt: new Date().toISOString(),
          gpsVerified: currentInspection.gpsVerification.verified,
          checklist: currentInspection.checklist,
          evidences: currentInspection.evidences,
          generalRemarks,
          overallRating,
        };
        localStorage.setItem(`dosje_inspector_offline_${currentInspection.id}`, JSON.stringify(offlineSnapshot));
        localStorage.setItem('dosje_inspector_active_offline_queue', JSON.stringify(syncQueue));
      } catch (err) {
        console.warn('LocalStorage save error:', err);
      }
    }
  }, [effectiveOnline, currentInspection, generalRemarks, overallRating, syncQueue]);

  // Stage prerequisite calculations
  const isGpsVerified = Boolean(currentInspection?.gpsVerification?.verified);
  const checklistPendingCount = currentInspection?.checklist?.filter((c) => c.status === 'pending').length || 0;
  const isChecklistComplete = checklistPendingCount === 0 && (currentInspection?.checklist?.length || 0) > 0;
  const evidenceCount = currentInspection?.evidences?.length || 0;
  const hasEvidence = evidenceCount > 0;

  // Strict Stage Navigation Enforcement Handler
  // 1. Without GPS check -> Inspector cannot move to next step (Checklist)
  // 2. Without Checklist and upload of pics -> Inspector cannot move to next page (Evidence)
  // 3. Without Evidence -> No submit!
  const navigateToStep = (target: 'gps' | 'checklist' | 'evidence' | 'submit' | 'history') => {
    setWorkflowLockMessage(null);

    if (target === 'history') {
      setSelectedSubTab('history');
      return;
    }

    if (target === 'gps') {
      setSelectedSubTab('gps');
      return;
    }

    if (target === 'checklist') {
      if (!isGpsVerified) {
        setWorkflowLockMessage(
          '⛔ STEP LOCKED: Without on-site GPS verification, the inspector cannot move to the Digital Checklist. Confirm physical arrival inside the geofence first.'
        );
        return;
      }
      setSelectedSubTab('checklist');
      return;
    }

    if (target === 'evidence') {
      if (!isGpsVerified) {
        setWorkflowLockMessage('⛔ STEP LOCKED: Physical GPS check must be completed first.');
        return;
      }
      if (!isChecklistComplete) {
        setWorkflowLockMessage(
          `⛔ STEP LOCKED: Without completing all checklist points (${checklistPendingCount} item(s) pending), the inspector cannot move to Photo Evidence.`
        );
        return;
      }
      setSelectedSubTab('evidence');
      return;
    }

    if (target === 'submit') {
      if (!isGpsVerified) {
        setWorkflowLockMessage('⛔ STEP LOCKED: GPS verification is strictly required before report sign-off.');
        return;
      }
      if (!isChecklistComplete) {
        setWorkflowLockMessage('⛔ STEP LOCKED: All checklist inquiries must be reviewed before report submission.');
        return;
      }
      if (!hasEvidence) {
        setWorkflowLockMessage(
          '⛔ STEP LOCKED: Without evidence photo upload, no submit is permitted. At least 1 watermarked geo-tagged photograph must be captured.'
        );
        return;
      }
      setSelectedSubTab('submit');
      return;
    }
  };

  const handleSubmit = () => {
    setSubmissionError(null);
    if (!currentInspection) return;

    if (!isGpsVerified) {
      setSubmissionError('Without GPS check, report cannot be submitted.');
      return;
    }
    if (!isChecklistComplete) {
      setSubmissionError(`Checklist incomplete: ${checklistPendingCount} item(s) must be reviewed before submitting.`);
      return;
    }
    if (!hasEvidence) {
      setSubmissionError('Without evidence upload, report cannot be submitted.');
      return;
    }

    const res = submitInspection(currentInspection.id, generalRemarks, overallRating);
    if (!res.success) {
      setSubmissionError(res.error || 'Failed to submit inspection');
    } else {
      setSubmissionSuccess(true);
      setTimeout(() => {
        setSubmissionSuccess(false);
        setRole('government');
      }, 2000);
    }
  };

  const handleManualSyncClick = async () => {
    await triggerManualSync();
  };

  const content = (
    <div className="space-y-4 pb-12">
      {/* Mobile App Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center font-bold text-white shadow-md">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                  PMU Division 4 Field Officer
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <h2 className="font-bold text-sm text-white">Inspector Rajesh Sharma</h2>
              <p className="text-[11px] text-slate-400 font-mono">ID: INSP-KA-402 • Hub: Mangalore</p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase">Assigned Duties</span>
            <div className="font-mono text-base font-bold text-amber-400">
              {inspections.filter((i) => i.status === 'assigned' || i.status === 'in_progress').length} Active
            </div>
          </div>
        </div>
      </div>

      {/* Offline Sync & Firebase Database Connectivity Hub with Periodic Flush Worker */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 text-white space-y-3 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={`p-1.5 rounded-xl border ${
                effectiveOnline
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
              }`}
            >
              {effectiveOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4 animate-pulse" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold">
                  {effectiveOnline ? 'Central Database Connected' : 'Offline Field Audit Mode'}
                </span>
                <span
                  className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold uppercase ${
                    effectiveOnline
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}
                >
                  {effectiveOnline ? 'ONLINE' : 'OFFLINE LOCAL STORE'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                {effectiveOnline
                  ? 'Periodic background poller flushes queued records to Firebase every 10s.'
                  : 'Inspection data & geo-tagged photos stored in persistent local storage.'}
              </p>
            </div>
          </div>

          {/* Offline Simulation Toggle */}
          <button
            onClick={toggleSimulateOffline}
            className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-colors cursor-pointer flex items-center gap-1 ${
              isSimulatedOffline
                ? 'bg-amber-600/30 text-amber-300 border-amber-500/50 hover:bg-amber-600/40'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white hover:bg-slate-700'
            }`}
            title="Toggle simulated offline mode for field audit testing"
          >
            {isSimulatedOffline ? <CloudOff className="w-3.5 h-3.5 text-amber-400" /> : <Database className="w-3.5 h-3.5 text-slate-400" />}
            <span>{isSimulatedOffline ? 'Resume Online' : 'Simulate Offline'}</span>
          </button>
        </div>

        {/* Sync Queue Telemetry Status Bar */}
        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2.5 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Offline Vault Queue:</span>
              <span className="font-mono font-bold text-amber-400">
                {pendingQueue.length} Pending
              </span>
              <span className="text-slate-600">|</span>
              <span className="text-[11px] text-slate-400">Last Synced: {lastSyncTime || 'Pending'}</span>
            </div>

            <div className="flex items-center gap-2">
              {pendingQueue.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowQueueDetails(!showQueueDetails)}
                  className="text-[10px] text-indigo-400 hover:text-indigo-300 underline font-mono cursor-pointer"
                >
                  {showQueueDetails ? 'Hide Records' : `View (${pendingQueue.length})`}
                </button>
              )}

              <button
                disabled={!effectiveOnline || isSyncing || pendingQueue.length === 0}
                onClick={handleManualSyncClick}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-[11px] font-semibold flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Flushing...' : 'Flush Queue'}</span>
              </button>
            </div>
          </div>

          {/* Real-time Progress Bar for Flush Queue Action */}
          {isSyncing && (
            <div className="space-y-2 pt-2 border-t border-slate-800 animate-in fade-in duration-200">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-indigo-300 flex items-center gap-1.5">
                  <RefreshCw className="w-3 h-3 animate-spin text-amber-400" />
                  <span>Transmitting offline submissions to Firebase Firestore...</span>
                </span>
                <span className="font-mono font-bold text-emerald-400">
                  {syncProgress.percent}%
                </span>
              </div>

              {/* Progress Track */}
              <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-700">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 via-indigo-500 to-emerald-400 rounded-full transition-all duration-300 shadow-sm shadow-emerald-500/50"
                  style={{ width: `${Math.max(5, syncProgress.percent)}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span className="truncate max-w-[240px] text-slate-300">{syncProgress.currentStep}</span>
                <span className="shrink-0 text-emerald-400 font-bold">
                  {syncProgress.syncedItems} of {syncProgress.totalItems} synced
                </span>
              </div>
            </div>
          )}

          {/* Completed sync notification banner if queue just cleared */}
          {!isSyncing && pendingQueue.length === 0 && syncProgress.percent === 100 && (
            <div className="p-2 rounded-lg bg-emerald-950/40 border border-emerald-500/40 flex items-center gap-2 text-emerald-300 text-[11px] animate-in fade-in duration-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>All offline submissions and photos successfully committed to Firebase Firestore.</span>
            </div>
          )}

          {/* Expandable Queued Items Tray */}
          {showQueueDetails && pendingQueue.length > 0 && (
            <div className="space-y-1.5 pt-2 border-t border-slate-800 max-h-40 overflow-y-auto">
              {pendingQueue.map((item) => (
                <div
                  key={item.id}
                  className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-[11px]"
                >
                  <div className="truncate max-w-[220px]">
                    <span className="font-semibold text-slate-200 block truncate">{item.title}</span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {item.inspectionId} · {item.type}
                    </span>
                  </div>
                  <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 shrink-0">
                    QUEUED
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Active Assignment Selector */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white space-y-3 shadow-md">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-indigo-400" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-300">
              Assigned Inspection Case
            </h3>
          </div>
          <span className="font-mono text-xs text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
            {currentInspection.id}
          </span>
        </div>

        <div className="space-y-2">
          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Select Duty Case:</label>
            <select
              value={activeInspectionId}
              onChange={(e) => {
                setActiveInspectionId(e.target.value);
                setSelectedSubTab('gps');
                setWorkflowLockMessage(null);
              }}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              {inspections.map((insp) => (
                <option key={insp.id} value={insp.id}>
                  {insp.id} — {insp.projectName} ({insp.status.toUpperCase()})
                </option>
              ))}
            </select>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-400">Dispatch Trigger:</span>
              <span className="text-amber-300 font-medium text-right truncate max-w-[200px]">
                {currentInspection.triggerReason}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Scheduled:</span>
              <span className="font-mono text-slate-200">{currentInspection.scheduledDate}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stage Progression Warning Banner */}
      {workflowLockMessage && (
        <div className="p-3.5 rounded-2xl bg-amber-950/60 border border-amber-500/80 text-xs text-amber-200 flex items-start gap-2.5 shadow-lg animate-in fade-in duration-150">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-amber-300">Mandatory Prerequisite Unmet:</span>
            <p className="text-[11px] leading-relaxed">{workflowLockMessage}</p>
          </div>
        </div>
      )}

      {/* Strict Step Navigation Pills with Lock Badges */}
      <div className="grid grid-cols-5 gap-1 bg-slate-900 p-1.5 rounded-xl border border-slate-800">
        {/* 1. GPS Check */}
        <button
          onClick={() => navigateToStep('gps')}
          className={`py-2 px-1 rounded-lg text-xs font-bold transition-all flex flex-col items-center gap-1 cursor-pointer ${
            selectedSubTab === 'gps'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            {isGpsVerified && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
          </div>
          <span className="text-[10px] truncate max-w-full">1. GPS</span>
        </button>

        {/* 2. Checklist */}
        <button
          onClick={() => navigateToStep('checklist')}
          className={`py-2 px-1 rounded-lg text-xs font-bold transition-all flex flex-col items-center gap-1 cursor-pointer ${
            selectedSubTab === 'checklist'
              ? 'bg-indigo-600 text-white shadow-md'
              : isGpsVerified
              ? 'text-slate-300 hover:text-white'
              : 'text-slate-600 cursor-not-allowed opacity-60'
          }`}
        >
          <div className="flex items-center gap-1">
            {!isGpsVerified ? (
              <Lock className="w-3.5 h-3.5 text-slate-500" />
            ) : isChecklistComplete ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <ClipboardCheck className="w-3.5 h-3.5 text-amber-400" />
            )}
          </div>
          <span className="text-[10px] truncate max-w-full">2. Checklist</span>
        </button>

        {/* 3. Evidence */}
        <button
          onClick={() => navigateToStep('evidence')}
          className={`py-2 px-1 rounded-lg text-xs font-bold transition-all flex flex-col items-center gap-1 cursor-pointer ${
            selectedSubTab === 'evidence'
              ? 'bg-indigo-600 text-white shadow-md'
              : isGpsVerified && isChecklistComplete
              ? 'text-slate-300 hover:text-white'
              : 'text-slate-600 cursor-not-allowed opacity-60'
          }`}
        >
          <div className="flex items-center gap-1">
            {!isGpsVerified || !isChecklistComplete ? (
              <Lock className="w-3.5 h-3.5 text-slate-500" />
            ) : hasEvidence ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Camera className="w-3.5 h-3.5 text-amber-400" />
            )}
          </div>
          <span className="text-[10px] truncate max-w-full">3. Evidence</span>
        </button>

        {/* 4. Submit */}
        <button
          onClick={() => navigateToStep('submit')}
          className={`py-2 px-1 rounded-lg text-xs font-bold transition-all flex flex-col items-center gap-1 cursor-pointer ${
            selectedSubTab === 'submit'
              ? 'bg-indigo-600 text-white shadow-md'
              : isGpsVerified && isChecklistComplete && hasEvidence
              ? 'text-slate-300 hover:text-white'
              : 'text-slate-600 cursor-not-allowed opacity-60'
          }`}
        >
          <div className="flex items-center gap-1">
            {!isGpsVerified || !isChecklistComplete || !hasEvidence ? (
              <Lock className="w-3.5 h-3.5 text-slate-500" />
            ) : (
              <Send className="w-3.5 h-3.5 text-emerald-400" />
            )}
          </div>
          <span className="text-[10px] truncate max-w-full">4. Submit</span>
        </button>

        {/* 5. Offline History */}
        <button
          onClick={() => navigateToStep('history')}
          className={`py-2 px-1 rounded-lg text-xs font-bold transition-all flex flex-col items-center gap-1 cursor-pointer ${
            selectedSubTab === 'history'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-300 hover:text-white'
          }`}
          title="View submitted inspections audit trail & local vault"
        >
          <div className="flex items-center gap-1">
            <History className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-[9px] font-mono text-amber-400 font-bold">
              {inspections.filter((i) => i.status === 'submitted').length}
            </span>
          </div>
          <span className="text-[10px] truncate max-w-full">5. History</span>
        </button>
      </div>

      {/* Viewport for Active Step */}
      {selectedSubTab === 'gps' && (
        <div className="space-y-4">
          <GPSVerificationCard inspection={currentInspection} />

          <div className="flex justify-end">
            <button
              onClick={() => navigateToStep('checklist')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer shadow-md ${
                isGpsVerified
                  ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
                  : 'bg-slate-800 text-amber-400 border border-amber-500/40'
              }`}
            >
              <span>{isGpsVerified ? 'Continue to Digital Checklist →' : 'GPS Verification Required to Proceed'}</span>
              {!isGpsVerified ? <Lock className="w-3.5 h-3.5 text-amber-400" /> : <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />}
            </button>
          </div>
        </div>
      )}

      {selectedSubTab === 'checklist' && (
        <div className="space-y-4">
          <DigitalChecklist inspection={currentInspection} />

          <div className="flex justify-between items-center">
            <button
              onClick={() => navigateToStep('gps')}
              className="text-xs text-slate-400 hover:text-white"
            >
              ← Back to GPS
            </button>

            <button
              onClick={() => navigateToStep('evidence')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer shadow-md ${
                isChecklistComplete
                  ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
                  : 'bg-slate-800 text-amber-400 border border-amber-500/40'
              }`}
            >
              <span>{isChecklistComplete ? 'Continue to Photo Evidence →' : `Review ${checklistPendingCount} Pending Point(s) to Unlock Evidence`}</span>
              {!isChecklistComplete ? <Lock className="w-3.5 h-3.5 text-amber-400" /> : <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />}
            </button>
          </div>
        </div>
      )}

      {selectedSubTab === 'evidence' && (
        <div className="space-y-4">
          <LiveEvidenceCamera
            inspection={currentInspection}
            onApplyRemarks={(remarks, rating) => {
              setGeneralRemarks(remarks);
              setOverallRating(rating);
              if (isGpsVerified && isChecklistComplete && hasEvidence) {
                setSelectedSubTab('submit');
              }
            }}
          />

          {/* Random VC Spot check direct action */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-white space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-200">Optional: Random Spot VC Call</span>
              <PhoneCall className="w-4 h-4 text-indigo-400" />
            </div>
            <p className="text-[11px] text-slate-400">
              Directly connect with Project Incharge or beneficiaries to verify living conditions and records on call.
            </p>
            <button
              onClick={() =>
                startVideoCall(
                  'Dr. Anita Rao',
                  'Project Incharge',
                  currentInspection.projectName
                )
              }
              className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 font-semibold text-xs border border-slate-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Connect Random VC with Incharge</span>
            </button>
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={() => navigateToStep('checklist')}
              className="text-xs text-slate-400 hover:text-white"
            >
              ← Back to Checklist
            </button>

            <button
              onClick={() => navigateToStep('submit')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer shadow-md ${
                hasEvidence
                  ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
                  : 'bg-slate-800 text-amber-400 border border-amber-500/40'
              }`}
            >
              <span>{hasEvidence ? 'Proceed to Sign-off & Submit →' : 'Upload At Least 1 Photo Evidence to Unlock Submit'}</span>
              {!hasEvidence ? <Lock className="w-3.5 h-3.5 text-amber-400" /> : <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />}
            </button>
          </div>
        </div>
      )}

      {selectedSubTab === 'submit' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white space-y-5 shadow-xl">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Send className="w-5 h-5 text-indigo-400" />
            <div>
              <h3 className="font-bold text-sm text-white">Digital Sign-off & Central Submission</h3>
              <p className="text-[11px] text-slate-400">Submit completed inspection dossier to DoSJE Headquarters</p>
            </div>
          </div>

          {/* Submission Readiness Checklist Matrix */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2.5 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">1. On-site GPS Verification:</span>
              <span
                className={`font-bold flex items-center gap-1 ${
                  isGpsVerified ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {isGpsVerified ? 'VERIFIED ON-SITE ✅' : 'NOT VERIFIED ❌'}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-400">2. Statutory Checklist:</span>
              <span
                className={`font-mono font-bold ${
                  isChecklistComplete ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {isChecklistComplete
                  ? 'ALL COMPLETED ✅'
                  : `${checklistPendingCount} PENDING ❌`}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-400">3. Tamper-Evident Photo Proof:</span>
              <span
                className={`font-mono font-bold ${
                  hasEvidence ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {hasEvidence
                  ? `${evidenceCount} ARTIFACT(S) CAPTURED ✅`
                  : 'NO EVIDENCE UPLOADED ❌'}
              </span>
            </div>
          </div>

          {/* Overall Audit Assessment */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">
              Inspector's Overall Rating:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Satisfactory', 'Minor Discrepancies', 'Critical Violations'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setOverallRating(r)}
                  className={`py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    overallRating === r
                      ? r === 'Satisfactory'
                        ? 'bg-emerald-600 text-white shadow-md'
                        : r === 'Minor Discrepancies'
                        ? 'bg-amber-600 text-white shadow-md'
                        : 'bg-rose-600 text-white shadow-md'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Final Remarks */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Final Observations & Remarks:
            </label>
            <textarea
              value={generalRemarks}
              onChange={(e) => setGeneralRemarks(e.target.value)}
              rows={3}
              placeholder="Enter comprehensive findings, beneficiary interaction summary, and follow-up guidance..."
              className="w-full bg-slate-950/80 border border-slate-700 rounded-xl p-3 text-xs text-white outline-none focus:ring-2 focus:ring-indigo-500 placeholder-slate-500"
            />
          </div>

          {/* Hard Guard Error Display */}
          {submissionError && (
            <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/60 text-xs text-rose-200 flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold">Submission Blocked:</span>
                <p className="text-[11px] leading-relaxed">{submissionError}</p>
              </div>
            </div>
          )}

          {/* Success Banner & Direct PDF Export */}
          {(submissionSuccess || currentInspection.status === 'submitted') && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-2 animate-in zoom-in-95 duration-150">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>
                  {effectiveOnline
                    ? 'Report uploaded & synchronized to DoSJE Headquarters Firebase database!'
                    : 'Report saved to local offline sync queue! It will automatically transmit to Headquarters once connection is restored.'}
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  const proj = projects.find((p) => p.id === currentInspection.projectId);
                  exportInspectionReportPDF(currentInspection, proj);
                }}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                title="Download finalized statutory inspection report as PDF document directly on device"
              >
                <FileDown className="w-4 h-4" />
                <span>[ Export Completed Report as PDF Document ]</span>
              </button>
            </div>
          )}

          {/* Submit Action Button */}
          {currentInspection.status !== 'submitted' && (
            <button
              onClick={handleSubmit}
              disabled={!isGpsVerified || !isChecklistComplete || !hasEvidence}
              className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm shadow-xl transition-all flex items-center justify-center gap-2 ${
                isGpsVerified && isChecklistComplete && hasEvidence
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white cursor-pointer shadow-emerald-900/40'
                  : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-60'
              }`}
            >
              <Send className="w-4 h-4" />
              <span>
                {!isGpsVerified
                  ? 'Submission Locked: GPS Verification Required'
                  : !isChecklistComplete
                  ? 'Submission Locked: Incomplete Checklist'
                  : !hasEvidence
                  ? 'Submission Locked: Photo Evidence Required'
                  : 'Transmit Signed Inspection Report to Headquarters'}
              </span>
            </button>
          )}
        </div>
      )}

      {/* 5. Offline Audit History & Vault */}
      {selectedSubTab === 'history' && <OfflineHistoryTab />}
    </div>
  );

  // If Phone Bezel simulator mode is toggled, render in iPhone-like frame on desktop
  if (isPhoneFrame) {
    return (
      <div className="flex justify-center items-center py-6 px-4">
        <div className="w-full max-w-[420px] bg-slate-950 rounded-[44px] phone-shadow border-4 border-slate-800 p-4 relative overflow-hidden">
          {/* Speaker notch */}
          <div className="w-32 h-5 bg-slate-900 rounded-full mx-auto mb-4 flex items-center justify-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-950" />
            <div className="w-10 h-1.5 rounded-full bg-slate-950" />
          </div>

          <div className="max-h-[82vh] overflow-y-auto pr-1">
            {content}
          </div>

          {/* Bottom Home Indicator */}
          <div className="w-28 h-1 bg-slate-700 rounded-full mx-auto mt-3" />
        </div>
      </div>
    );
  }

  // Standard responsive view
  return <div className="max-w-3xl mx-auto px-4">{content}</div>;
};
