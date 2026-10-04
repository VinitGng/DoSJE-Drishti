import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Building2,
  Users,
  Calendar,
  Video,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Upload,
  Send,
  Sparkles,
  MapPin,
  Clock,
  Phone,
  Mail,
  ShieldAlert,
} from 'lucide-react';

export const NGODashboard: React.FC = () => {
  const {
    projects,
    authUsers,
    updateBeneficiaryAttendance,
    issues,
    submitATR,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'attendance' | 'staff' | 'cctv' | 'atr'>('attendance');
  const [atrExplanation, setAtrExplanation] = useState<string>('');
  const [selectedIssueId, setSelectedIssueId] = useState<string>('');
  const [showAtrSuccess, setShowAtrSuccess] = useState<boolean>(false);

  // Fetch project strictly based on the logged-in email ID (no global selector!)
  const loggedInNgoEmail = authUsers.ngo?.email?.toLowerCase().trim() || '';

  const currentProject = React.useMemo(() => {
    // 1. Direct match by incharge email
    const matchByEmail = projects.find(
      (p) => p.incharge.email.toLowerCase().trim() === loggedInNgoEmail
    );
    if (matchByEmail) return matchByEmail;

    // 2. Bound project ID in auth user record
    if (authUsers.ngo?.projectId) {
      const matchById = projects.find((p) => p.id === authUsers.ngo?.projectId);
      if (matchById) return matchById;
    }

    // 3. Email keyword mapping for demo emails
    if (
      loggedInNgoEmail.includes('matru') ||
      loggedInNgoEmail.includes('milind') ||
      loggedInNgoEmail.includes('avyay') ||
      loggedInNgoEmail.includes('pune')
    ) {
      return projects.find((p) => p.id === 'PRJ-002') || projects[0];
    }
    if (
      loggedInNgoEmail.includes('nav') ||
      loggedInNgoEmail.includes('saxena') ||
      loggedInNgoEmail.includes('napddr') ||
      loggedInNgoEmail.includes('lucknow')
    ) {
      return projects.find((p) => p.id === 'PRJ-003') || projects[0];
    }
    if (
      loggedInNgoEmail.includes('prerana') ||
      loggedInNgoEmail.includes('sundaram') ||
      loggedInNgoEmail.includes('daksh') ||
      loggedInNgoEmail.includes('madurai')
    ) {
      return projects.find((p) => p.id === 'PRJ-004') || projects[0];
    }
    if (
      loggedInNgoEmail.includes('asha') ||
      loggedInNgoEmail.includes('tiwari') ||
      loggedInNgoEmail.includes('bhopal')
    ) {
      return projects.find((p) => p.id === 'PRJ-005') || projects[0];
    }

    // Default to PRJ-001 (ABC Welfare Centre)
    return projects[0];
  }, [projects, loggedInNgoEmail, authUsers.ngo]);

  const [attendanceCount, setAttendanceCount] = useState<number>(currentProject.latestAttendance);

  // Synchronize attendance count when project changes
  React.useEffect(() => {
    setAttendanceCount(currentProject.latestAttendance);
  }, [currentProject.id, currentProject.latestAttendance]);

  const projectIssues = issues.filter((i) => i.projectId === currentProject.id);

  const handleUpdateAttendance = (newCount: number) => {
    setAttendanceCount(newCount);
    updateBeneficiaryAttendance(currentProject.id, newCount);
  };

  const handleSubmitATR = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIssueId || !atrExplanation) return;
    submitATR(selectedIssueId, atrExplanation);
    setShowAtrSuccess(true);
    setAtrExplanation('');
    setTimeout(() => setShowAtrSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12 max-w-6xl mx-auto px-4">
      {/* NGO Institute Profile Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border border-emerald-600/40 rounded-3xl p-6 text-white shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center font-bold text-2xl text-white shadow-lg shrink-0">
              <Building2 className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Registered Welfare Institute
                </span>
                <span className="font-mono text-xs text-slate-300">Reg: {currentProject.regNumber}</span>
              </div>
              <h2 className="text-xl font-bold text-white mt-1">{currentProject.name}</h2>
              <p className="text-xs text-emerald-300 font-medium">{currentProject.scheme}</p>
              <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-500" />
                {currentProject.address}
              </p>
            </div>
          </div>

          {/* Logged in Institute Auth Badge */}
          <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800 text-xs space-y-1 w-full md:w-auto">
            <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">
              Logged in Institute Account:
            </span>
            <div className="font-bold text-emerald-300 font-mono text-xs truncate max-w-[240px]">
              {loggedInNgoEmail || currentProject.incharge.email}
            </div>
            <p className="text-[11px] text-slate-400">
              Project Head: <span className="text-slate-200 font-medium">{currentProject.incharge.name}</span> ({currentProject.regNumber})
            </p>
          </div>
        </div>
      </div>

      {/* Portal Tabs */}
      <div className="flex items-center gap-2 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 overflow-x-auto">
        <button
          onClick={() => setActiveTab('attendance')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'attendance'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/30'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Daily Attendance Logging</span>
          {currentProject.attendanceAnomaly && (
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('staff')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'staff'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/30'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Staff & Biometric Roster</span>
        </button>

        <button
          onClick={() => setActiveTab('cctv')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'cctv'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/30'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Video className="w-4 h-4" />
          <span>CCTV Feed Configuration</span>
        </button>

        <button
          onClick={() => setActiveTab('atr')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'atr'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/30'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Action Taken Reports (ATR)</span>
          {projectIssues.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500 text-slate-950 font-bold font-mono">
              {projectIssues.length}
            </span>
          )}
        </button>
      </div>

      {/* Tab 1: Daily Attendance & Interactive Anomaly Testing */}
      {activeTab === 'attendance' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Attendance Card */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white space-y-6 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="font-bold text-base text-white">Daily Beneficiary Headcount Submission</h3>
                <p className="text-xs text-slate-400">
                  Mandatory under DoSJE grant guidelines. Biometric sync performed daily at 09:30 IST.
                </p>
              </div>
              <span className="font-mono text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/20">
                Capacity: {currentProject.beneficiaryCount} Residents
              </span>
            </div>

            {/* + and - Stepper for Beneficiary Headcount */}
            <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    Live Headcount Counter
                  </span>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Update current verified resident attendance using the plus and minus controls
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 font-mono">Capacity: {currentProject.beneficiaryCount}</span>
                </div>
              </div>

              {/* Stepper with - and + buttons */}
              <div className="flex items-center justify-center gap-4 py-2">
                <button
                  type="button"
                  onClick={() => handleUpdateAttendance(Math.max(0, attendanceCount - 1))}
                  className="w-14 h-14 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-2xl border border-slate-700 transition-all flex items-center justify-center cursor-pointer shadow-lg active:scale-95"
                  title="Decrease headcount (-1)"
                >
                  −
                </button>

                <div className="flex flex-col items-center bg-slate-900 border-2 border-emerald-500/50 rounded-2xl px-6 py-2 shadow-inner min-w-[140px]">
                  <input
                    type="number"
                    min="0"
                    max={currentProject.beneficiaryCount}
                    value={attendanceCount}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0;
                      handleUpdateAttendance(Math.min(currentProject.beneficiaryCount, Math.max(0, val)));
                    }}
                    className="w-24 text-center font-mono font-bold text-3xl text-white bg-transparent outline-none"
                  />
                  <span className="text-[11px] text-slate-400 font-mono">Present Today</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleUpdateAttendance(Math.min(currentProject.beneficiaryCount, attendanceCount + 1))}
                  className="w-14 h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-2xl border border-emerald-500 transition-all flex items-center justify-center cursor-pointer shadow-lg active:scale-95 shadow-emerald-950"
                  title="Increase headcount (+1)"
                >
                  +
                </button>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
                <span>Sanctioned Capacity: <strong className="text-slate-200">{currentProject.beneficiaryCount}</strong></span>
                <span>Historical Baseline Average: <strong className="text-emerald-400">{currentProject.historicalAvgAttendance}</strong></span>
              </div>
            </div>

            {/* Current Status Assessment */}
            <div
              className={`p-4 rounded-2xl border text-xs space-y-1.5 ${
                currentProject.attendanceAnomaly
                  ? 'bg-rose-950/30 border-rose-600/40 text-rose-200'
                  : 'bg-emerald-950/20 border-emerald-600/40 text-emerald-200'
              }`}
            >
              <div className="flex items-center gap-2 font-bold">
                {currentProject.attendanceAnomaly ? (
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                )}
                <span>
                  {currentProject.attendanceAnomaly
                    ? 'AI Anomaly Detected by DoSJE Headquarters'
                    : 'Attendance Synchronized Within Normal Parameters'}
                </span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                {currentProject.attendanceAnomaly
                  ? `Reported count of ${attendanceCount} deviates by > 60% from the historical average of ${currentProject.historicalAvgAttendance}. The central system has queued this facility for an unannounced surprise inspection.`
                  : `Reported count of ${attendanceCount} matches expected historical patterns. No anomalous deviation detected.`}
              </p>
            </div>
          </div>

          {/* Right Col: Scheme Grant Information */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 text-white space-y-4 shadow-xl">
            <h4 className="font-bold text-sm text-white">Grant-in-Aid Compliance</h4>
            
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[11px]">Sanctioned Annual Grant:</span>
                <p className="font-bold text-emerald-400 font-mono text-sm">{currentProject.grantAmountAnnual}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[11px]">Authorized Project Incharge:</span>
                <p className="font-bold text-white">{currentProject.incharge.name}</p>
                <p className="text-slate-400 text-[11px]">{currentProject.incharge.designation}</p>
                <p className="text-slate-400 text-[11px]">{currentProject.incharge.phone}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[11px]">Mandatory CCTV Cameras:</span>
                <p className="font-semibold text-white">{currentProject.cctvCount} Units Configured & Active</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Staff & Biometric Roster */}
      {activeTab === 'staff' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white space-y-5 shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="font-bold text-base text-white">Registered Qualified Personnel & Staff</h3>
              <p className="text-xs text-slate-400">
                Staff mandatory under DDRS norms (Special Educators, Physiotherapists, Caregivers)
              </p>
            </div>
            <span className="font-mono text-xs text-emerald-400">
              {currentProject.staffCount} Registered Employees
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { name: 'Dr. Anita Rao', role: 'Project Director & Psychologist', status: 'Present (08:45 IST)', bio: 'Verified' },
              { name: 'Shri Sudhir Shenoy', role: 'Senior Special Educator (RCI Reg)', status: 'Present (08:52 IST)', bio: 'Verified' },
              { name: 'Smt. Kavitha Prabhu', role: 'Physiotherapist', status: 'Present (09:10 IST)', bio: 'Verified' },
              { name: 'Shri Ganesh Bhat', role: 'Vocational Instructor', status: 'Present (08:58 IST)', bio: 'Verified' },
              { name: 'Smt. Radhika Kamath', role: 'Resident Nurse', status: 'Present (08:30 IST)', bio: 'Verified' },
              { name: 'Shri Someshwar Naik', role: 'Kitchen & Nutrition Supervisor', status: 'Present (07:15 IST)', bio: 'Verified' },
            ].map((staff) => (
              <div key={staff.name} className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">{staff.name}</span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                    {staff.bio}
                  </span>
                </div>
                <p className="text-slate-400 text-[11px]">{staff.role}</p>
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-300">
                  <span className="text-slate-400">Biometric:</span>
                  <span className="text-emerald-400 font-semibold">{staff.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: CCTV Feed Configuration */}
      {activeTab === 'cctv' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white space-y-5 shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="font-bold text-base text-white">Registered IP CCTV Streams</h3>
              <p className="text-xs text-slate-400">
                Connected to DoSJE National Video Monitoring Gateway via secure RTSP tunnel
              </p>
            </div>
            <span className="text-xs text-emerald-400 font-semibold">
              All {currentProject.cctvFeeds.length} Streams Active
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {currentProject.cctvFeeds.map((feed) => (
              <div key={feed.id} className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3 text-xs overflow-hidden">
                <div className="h-28 rounded-xl overflow-hidden relative bg-black border border-slate-800">
                  <img
                    src={feed.imageUrl || 'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f6?auto=format&fit=crop&w=800&q=80'}
                    alt={feed.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
                  <div className="absolute top-2 left-2 flex items-center gap-1 font-mono text-[10px] font-bold text-white bg-black/70 px-1.5 py-0.5 rounded border border-white/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                    <span>{feed.id}</span>
                  </div>
                  <span
                    className={`absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
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

                <div className="space-y-1 text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Stream Label:</span>
                    <span className="font-semibold text-white truncate max-w-[200px]">{feed.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Model:</span>
                    <span className="font-mono text-slate-200">{feed.cameraModel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Monthly Uptime:</span>
                    <span className="text-emerald-400 font-bold">{feed.uptimePercentage}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Action Taken Reports (ATR) */}
      {activeTab === 'atr' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white space-y-6 shadow-xl">
          <div>
            <h3 className="font-bold text-base text-white">Show-Cause Notices & Action Taken Reports (ATR)</h3>
            <p className="text-xs text-slate-400">
              Submit formal photographic proof and explanations for any compliance non-conformities raised by PMU inspection teams.
            </p>
          </div>

          {projectIssues.length === 0 ? (
            <div className="p-8 rounded-2xl bg-slate-950/60 border border-slate-800 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <h4 className="font-bold text-sm text-white">Clean Compliance Record</h4>
              <p className="text-xs text-slate-400">
                No active show-cause notices or pending rectification orders for this institute.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {projectIssues.map((iss) => (
                <div key={iss.id} className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-amber-400">{iss.id}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {iss.stage.replace('_', ' ')}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-sm text-white">{iss.title}</h4>
                    <p className="text-slate-300 mt-1">{iss.description}</p>
                    <p className="text-[11px] text-slate-400 mt-1">Deadline for Response: {iss.deadlineDate}</p>
                  </div>

                  {iss.ngoResponse ? (
                    <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-xs text-emerald-200 space-y-1">
                      <div className="font-bold text-emerald-300">ATR Submitted on {iss.ngoResponse.date}:</div>
                      <p className="text-slate-200">"{iss.ngoResponse.explanation}"</p>
                    </div>
                  ) : (
                    <div className="pt-2 border-t border-slate-800">
                      <button
                        onClick={() => setSelectedIssueId(iss.id)}
                        className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
                      >
                        Draft & Upload Action Taken Report (ATR)
                      </button>
                    </div>
                  )}

                  {selectedIssueId === iss.id && !iss.ngoResponse && (
                    <form onSubmit={handleSubmitATR} className="p-4 rounded-2xl bg-slate-900 border border-slate-700 space-y-3 animate-in fade-in duration-150">
                      <h5 className="font-bold text-xs text-white">Submit Rectification for Docket {iss.id}</h5>
                      <textarea
                        required
                        value={atrExplanation}
                        onChange={(e) => setAtrExplanation(e.target.value)}
                        placeholder="Provide detailed explanation of corrective actions taken (e.g. fire exit cleared, new fire extinguishers installed, updated attendance register)..."
                        rows={3}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white outline-none focus:ring-2 focus:ring-emerald-500"
                      />

                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-slate-400 flex items-center gap-1">
                          <Upload className="w-3.5 h-3.5" />
                          Photographic verification proof will be enclosed automatically.
                        </span>

                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedIssueId('')}
                            className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white text-xs"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Submit ATR to DoSJE</span>
                          </button>
                        </div>
                      </div>
                    </form>
                  )}
                </div>
              ))}
            </div>
          )}

          {showAtrSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-2 animate-in zoom-in-95 duration-150">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>Action Taken Report submitted! PMU verification cell notified.</span>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
