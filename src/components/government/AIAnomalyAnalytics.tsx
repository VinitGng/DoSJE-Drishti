import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  TrendingDown,
  AlertTriangle,
  BrainCircuit,
  Info,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Sparkles,
  PhoneCall,
  Search,
  ArrowUpRight,
  Filter,
} from 'lucide-react';
import { Project, AIAlert } from '../../types';
import { AnomalyInvestigationModal } from './AnomalyInvestigationModal';

export const AIAnomalyAnalytics: React.FC = () => {
  const {
    projects,
    aiAlerts,
    runRandomSurpriseAssignment,
    setRole,
    startVideoCall,
    updateAIAlertStatus,
  } = useApp();
  const [selectedProjectId, setSelectedProjectId] = useState<string>('PRJ-001');
  const [investigatingAlert, setInvestigatingAlert] = useState<AIAlert | null>(null);

  const selectedProject = projects.find((p) => p.id === selectedProjectId) || projects[0];
  const projectAlerts = aiAlerts.filter((a) => a.projectId === selectedProjectId);

  const handleDispatchSurprise = (project: Project) => {
    runRandomSurpriseAssignment({ scheme: project.scheme });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Decision-Support Philosophy */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 border border-indigo-700/40 rounded-2xl p-5 text-white shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <BrainCircuit className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-lg text-white">AI Anomaly & Attendance Analytics Engine</h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  STATISTICAL DECISION SUPPORT
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                Continuous baseline modeling compares daily attendance logs, biometric records, and CCTV uptime. Flags outliers for human officer audit.
              </p>
            </div>
          </div>

          {/* Ethics & Legal Governance Tag */}
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-300 max-w-sm">
            <div className="font-semibold text-amber-400 flex items-center gap-1.5 mb-1">
              <Info className="w-3.5 h-3.5 shrink-0" />
              <span>Responsible AI Governance Protocol</span>
            </div>
            <p className="text-slate-400 leading-tight">
              AI acts exclusively as an evidentiary early-warning sensor. The system flags: <em>"Unusual pattern requires review"</em> and never declares automated guilt.
            </p>
          </div>
        </div>
      </div>

      {/* Main Analysis Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Deep Dive Chart & Case Study */}
        <div className="lg:col-span-2 space-y-5">
          
          {/* Active Case Header */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                  Detailed Diagnostic View
                </span>
                <h3 className="font-bold text-base text-white mt-1">{selectedProject.name}</h3>
                <p className="text-xs text-slate-400">{selectedProject.scheme} • {selectedProject.district}</p>
              </div>

              {/* Project selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Switch:</span>
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="bg-slate-800 border border-slate-700 text-white text-xs rounded-xl px-3 py-1.5 outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} {p.attendanceAnomaly ? '(⚠️ Anomaly)' : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Attendance Chart Visualization */}
            <div className="mt-5 space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                  7-Day Attendance Trend vs. Sanctioned Capacity ({selectedProject.beneficiaryCount})
                </span>
                <div className="flex items-center gap-4 text-[11px]">
                  <span className="flex items-center gap-1 text-slate-400">
                    <span className="w-2.5 h-2.5 rounded-sm bg-indigo-500" /> Normal Baseline (Avg: {selectedProject.historicalAvgAttendance})
                  </span>
                  <span className="flex items-center gap-1 text-rose-400">
                    <span className="w-2.5 h-2.5 rounded-sm bg-rose-500" /> Anomaly Trigger Point
                  </span>
                </div>
              </div>

              {/* Bar Graphic */}
              <div className="bg-slate-950/60 p-5 rounded-xl border border-slate-800/80">
                <div className="h-44 flex items-end justify-between gap-2 sm:gap-4 pt-4 px-2">
                  {selectedProject.weeklyAttendance.map((day, idx) => {
                    const pct = Math.round((day.present / selectedProject.beneficiaryCount) * 100);
                    const isToday = idx === selectedProject.weeklyAttendance.length - 1;
                    const isDip = isToday && selectedProject.attendanceAnomaly;

                    return (
                      <div key={day.date} className="flex-1 flex flex-col items-center gap-2 group">
                        {/* Attendance Count Label */}
                        <span
                          className={`text-xs font-mono font-bold transition-all ${
                            isDip
                              ? 'text-rose-400 bg-rose-950/80 px-1.5 py-0.5 rounded border border-rose-500/50'
                              : 'text-slate-300'
                          }`}
                        >
                          {day.present}
                        </span>

                        {/* Bar */}
                        <div className="w-full max-w-[48px] h-32 bg-slate-800 rounded-t-lg relative overflow-hidden flex items-end">
                          {/* Baseline reference marker line */}
                          <div
                            className="absolute left-0 right-0 border-b border-dashed border-indigo-400/40 z-10"
                            style={{
                              bottom: `${(selectedProject.historicalAvgAttendance / selectedProject.beneficiaryCount) * 100}%`,
                            }}
                            title={`Historical Baseline: ${selectedProject.historicalAvgAttendance}`}
                          />
                          <div
                            className={`w-full rounded-t-lg transition-all duration-500 ${
                              isDip
                                ? 'bg-gradient-to-t from-rose-600 to-red-500 shadow-lg shadow-rose-900/50'
                                : 'bg-gradient-to-t from-indigo-700 to-indigo-500 hover:from-indigo-600 hover:to-indigo-400'
                            }`}
                            style={{ height: `${pct}%` }}
                          />
                        </div>

                        {/* Date Label */}
                        <span
                          className={`text-[10px] text-center truncate max-w-full ${
                            isToday ? 'font-bold text-white' : 'text-slate-400'
                          }`}
                        >
                          {day.date}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Statistical Z-Score Assessment Box */}
              <div
                className={`p-4 rounded-xl border text-xs space-y-2 ${
                  selectedProject.attendanceAnomaly
                    ? 'bg-rose-950/30 border-rose-600/40 text-rose-200'
                    : 'bg-emerald-950/20 border-emerald-700/40 text-emerald-200'
                }`}
              >
                <div className="flex items-center justify-between font-bold">
                  <div className="flex items-center gap-2">
                    {selectedProject.attendanceAnomaly ? (
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    )}
                    <span>
                      {selectedProject.attendanceAnomaly
                        ? 'Flagged Statistical Deviation: Z-Score = -3.84'
                        : 'Attendance Trend Conforms to Expected Range'}
                    </span>
                  </div>
                  <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-black/40">
                    Confidence: 96.2%
                  </span>
                </div>

                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {selectedProject.attendanceAnomaly
                    ? `Today's count of ${selectedProject.latestAttendance} represents a 62.5% decrease compared to the rolling 30-day mean of ${selectedProject.historicalAvgAttendance}. Normal seasonal variance is ± 8%. Flagged for PMU surprise inspection.`
                    : `Current attendance of ${selectedProject.latestAttendance} is within normal distribution parameters (Mean: ${selectedProject.historicalAvgAttendance}, StdDev: ±2.1).`}
                </p>

                {selectedProject.attendanceAnomaly && (
                  <div className="pt-2 flex flex-wrap gap-2">
                    <button
                      onClick={() => handleDispatchSurprise(selectedProject)}
                      className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Dispatch Surprise PMU Inspection</span>
                    </button>
                    <button
                      onClick={() =>
                        startVideoCall(
                          selectedProject.incharge.name,
                          'Project Incharge',
                          selectedProject.name
                        )
                      }
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <PhoneCall className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Conduct Spot Video Check</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>

        {/* Right Col: All Active AI Alerts Feed */}
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-white">Active System Anomaly Feeds</h3>
                <p className="text-xs text-slate-400">{aiAlerts.length} issues awaiting officer review</p>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                {aiAlerts.filter((a) => a.severity === 'high').length} HIGH
              </span>
            </div>

            <div className="space-y-3">
              {aiAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-3.5 rounded-xl border text-xs space-y-2 cursor-pointer transition-all ${
                    alert.projectId === selectedProjectId
                      ? 'bg-slate-800 border-indigo-500 ring-2 ring-indigo-500/30'
                      : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                  }`}
                  onClick={() => setSelectedProjectId(alert.projectId)}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        alert.severity === 'high'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : alert.severity === 'medium'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      }`}
                    >
                      {alert.type.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{alert.timestamp}</span>
                  </div>

                  <h4 className="font-bold text-white text-xs leading-snug">{alert.title}</h4>
                  <p className="text-[11px] text-slate-400 line-clamp-2">{alert.description}</p>

                  <div className="pt-1.5 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-300">
                    <span className="font-mono text-indigo-400">{alert.dataMetrics.anomalyScore}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProjectId(alert.projectId);
                        setInvestigatingAlert(alert);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 font-bold border border-amber-500/40 transition-all flex items-center gap-1 cursor-pointer active:scale-95 shadow-sm"
                      title="Open full statutory investigation and forensic diagnostics"
                    >
                      <span>Investigate</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Full Statutory Anomaly Investigation Modal */}
      {investigatingAlert && (
        <AnomalyInvestigationModal
          isOpen={Boolean(investigatingAlert)}
          onClose={() => setInvestigatingAlert(null)}
          alert={investigatingAlert}
          project={projects.find((p) => p.id === investigatingAlert.projectId) || selectedProject}
          onDispatchInspection={handleDispatchSurprise}
          onStartVideoCall={startVideoCall}
          onUpdateStatus={updateAIAlertStatus}
        />
      )}
    </div>
  );
};
