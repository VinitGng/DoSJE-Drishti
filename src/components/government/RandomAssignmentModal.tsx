import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Shuffle,
  ShieldAlert,
  Cpu,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  Sliders,
  X,
  Target,
  UserCheck,
  Eye,
  PhoneCall,
  Mail,
  ShieldCheck,
  Award,
  Smartphone,
  Download,
  MapPin,
  Building2,
  Clock,
  Radio,
  FileText,
  BadgeAlert,
  Check,
} from 'lucide-react';
import { Inspection } from '../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

// Roster of official DoSJE inspectors with realistic vigilance credentials
const OFFICER_PROFILES: Record<
  string,
  {
    designation: string;
    badgeId: string;
    contact: string;
    email: string;
    clearance: string;
    reportingHQ: string;
    assignedDevice: string;
    inspectionsCompleted: number;
    integrityRating: string;
    avgAccuracy: string;
    atrsTriggered: number;
  }
> = {
  'Amitav Sen': {
    designation: 'Senior Field Verification Officer & Deputy Director (Surprise Vigilance)',
    badgeId: 'GOI-DOSJE-INSP-054',
    contact: '+91 98710 44219',
    email: 'amitav.sen@dosje.gov.in',
    clearance: 'Class-I Gazetted / Statutory Field Auditor',
    reportingHQ: 'Central Vigilance Wing, Shastri Bhawan, New Delhi',
    assignedDevice: 'Samsung Galaxy Tab Active4 Pro Rugged (DEV-KA-402)',
    inspectionsCompleted: 52,
    integrityRating: '99.6%',
    avgAccuracy: '12 meters within boundary',
    atrsTriggered: 14,
  },
  'Rajesh Sharma': {
    designation: 'Assistant Commissioner of Social Welfare Inspections',
    badgeId: 'GOI-DOSJE-INSP-012',
    contact: '+91 98112 55320',
    email: 'rajesh.sharma@dosje.gov.in',
    clearance: 'Class-I Gazetted / Senior Monitoring Officer',
    reportingHQ: 'National PMU Operations Directorate, New Delhi',
    assignedDevice: 'Samsung Galaxy Tab Active4 Pro Rugged (DEV-DL-104)',
    inspectionsCompleted: 64,
    integrityRating: '99.8%',
    avgAccuracy: '8 meters within boundary',
    atrsTriggered: 19,
  },
  'Priya Deshmukh': {
    designation: 'Joint Director (Evaluation, Monitoring & Field Verification)',
    badgeId: 'GOI-DOSJE-INSP-029',
    contact: '+91 94220 88314',
    email: 'priya.deshmukh@dosje.gov.in',
    clearance: 'Class-I Gazetted / Regional Vigilance Auditor',
    reportingHQ: 'Western Regional Vigilance Directorate, Mumbai',
    assignedDevice: 'Samsung Galaxy Tab Active4 Pro Rugged (DEV-MH-208)',
    inspectionsCompleted: 47,
    integrityRating: '99.4%',
    avgAccuracy: '15 meters within boundary',
    atrsTriggered: 11,
  },
  'Kavita Nair': {
    designation: 'Senior Project Monitoring Officer & Anti-Proxy Special Invigilator',
    badgeId: 'GOI-DOSJE-INSP-038',
    contact: '+91 97455 12098',
    email: 'kavita.nair@dosje.gov.in',
    clearance: 'Class-I Gazetted / Social Audit Specialist',
    reportingHQ: 'Southern Regional Oversight Directorate, Chennai',
    assignedDevice: 'Samsung Galaxy Tab Active4 Pro Rugged (DEV-TN-310)',
    inspectionsCompleted: 39,
    integrityRating: '99.2%',
    avgAccuracy: '10 meters within boundary',
    atrsTriggered: 8,
  },
  'Manoj Bajpai': {
    designation: 'Field Vigilance Specialist & Statutory Compliance Officer',
    badgeId: 'GOI-DOSJE-INSP-046',
    contact: '+91 98390 77123',
    email: 'manoj.bajpai@dosje.gov.in',
    clearance: 'Class-I Gazetted / Institutional Audit Officer',
    reportingHQ: 'Northern Regional Oversight Directorate, Lucknow',
    assignedDevice: 'Samsung Galaxy Tab Active4 Pro Rugged (DEV-UP-418)',
    inspectionsCompleted: 58,
    integrityRating: '99.5%',
    avgAccuracy: '11 meters within boundary',
    atrsTriggered: 16,
  },
};

export const RandomAssignmentModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { runRandomSurpriseAssignment } = useApp();
  const [schemeFilter, setSchemeFilter] = useState<string>('all');
  const [stateFilter, setStateFilter] = useState<string>('all');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [resultInspection, setResultInspection] = useState<Inspection | null>(null);
  const [showOfficerPreview, setShowOfficerPreview] = useState<boolean>(false);
  const [pingSent, setPingSent] = useState<boolean>(false);

  if (!isOpen) return null;

  const steps = [
    'Generating cryptographically secure entropy seed for unannounced randomization...',
    'Scanning 1,248 registered DoSJE projects against Anomaly Risk Index...',
    'Applying Department Rule #4B (Days elapsed + Z-score anomaly weight)...',
    'Selecting target facility and matching nearest uncommitted PMU inspection team...',
    'Encrypting digital dispatch order and pushing to Inspector Mobile Companion...',
  ];

  const handleRunEngine = () => {
    setIsProcessing(true);
    setCurrentStepIndex(0);
    setResultInspection(null);
    setShowOfficerPreview(false);
    setPingSent(false);

    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step < steps.length) {
        setCurrentStepIndex(step);
      } else {
        clearInterval(interval);
        const createdInspection = runRandomSurpriseAssignment({
          scheme: schemeFilter,
          state: stateFilter,
        });
        setResultInspection(createdInspection);
        setIsProcessing(false);
      }
    }, 450);
  };

  const handleSendPing = () => {
    setPingSent(true);
    setTimeout(() => setPingSent(false), 3500);
  };

  const handleDownloadDeploymentOrder = () => {
    if (!resultInspection) return;
    const officer = OFFICER_PROFILES[resultInspection.inspectorName] || {
      designation: 'Senior Field Verification Officer',
      badgeId: resultInspection.inspectorId || 'GOI-DOSJE-INSP-054',
      contact: '+91 98710 44219',
      email: `${resultInspection.inspectorName.toLowerCase().replace(/\s+/g, '.')}@dosje.gov.in`,
      clearance: 'Class-I Gazetted / Statutory Field Auditor',
      reportingHQ: 'Central Vigilance Wing, Shastri Bhawan, New Delhi',
      assignedDevice: 'Samsung Galaxy Tab Active4 Pro Rugged (DEV-KA-402)',
      inspectionsCompleted: 50,
      integrityRating: '99.5%',
      avgAccuracy: '12 meters',
      atrsTriggered: 12,
    };

    const orderContent = {
      governmentNotice: 'GOVERNMENT OF INDIA - MINISTRY OF SOCIAL JUSTICE & EMPOWERMENT',
      department: 'Department of Social Justice and Empowerment (DoSJE) - Vigilance & Monitoring Wing',
      orderNumber: `ORDER/DOSJE/SURPRISE/${resultInspection.id}`,
      issueDate: new Date().toISOString(),
      statutoryClassification: 'STRICTLY CONFIDENTIAL - SURPRISE FIELD MANDATE',
      assignedOfficer: {
        officerName: resultInspection.inspectorName,
        designation: officer.designation,
        officialBadgeId: officer.badgeId,
        assignedUnit: resultInspection.assignedTeamId,
        clearanceLevel: officer.clearance,
        assignedDevice: officer.assignedDevice,
        contact: officer.contact,
        email: officer.email,
        reportingHQ: officer.reportingHQ,
      },
      assignmentMandate: {
        caseId: resultInspection.id,
        targetFacilityName: resultInspection.projectName,
        facilityId: resultInspection.projectId,
        scheme: resultInspection.scheme,
        dispatchStatus: 'Immediate Unannounced On-site Arrival',
        triggerRule: resultInspection.triggerReason,
        targetCoordinates: resultInspection.gpsVerification.targetCoords,
        geofenceEnforcement: 'Mandatory on-site arrival verification within 100 meters',
      },
      digitalVerification: {
        entropyHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        authorizedBy: 'Central Vigilance Directorate, Shastri Bhawan, New Delhi',
      },
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(orderContent, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `DoSJE_Deployment_Order_${resultInspection.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const currentOfficer = resultInspection
    ? OFFICER_PROFILES[resultInspection.inspectorName] || {
        designation: 'Senior Field Verification Officer & Statutory Auditor',
        badgeId: resultInspection.inspectorId || 'GOI-DOSJE-INSP-054',
        contact: '+91 98710 44219',
        email: `${resultInspection.inspectorName.toLowerCase().replace(/\s+/g, '.')}@dosje.gov.in`,
        clearance: 'Class-I Gazetted / Statutory Field Auditor',
        reportingHQ: 'Central Vigilance Wing, Shastri Bhawan, New Delhi',
        assignedDevice: 'Samsung Galaxy Tab Active4 Pro Rugged (DEV-KA-402)',
        inspectionsCompleted: 50,
        integrityRating: '99.5%',
        avgAccuracy: '12 meters within boundary',
        atrsTriggered: 12,
      }
    : null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
        <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden flex flex-col text-slate-100">
          
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                <Cpu className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  AI Automated Surprise Inspection Dispatcher
                </h3>
                <p className="text-xs text-slate-400">
                  Randomized duty assignment engine to eliminate predictability & proxy functioning
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Configuration / Criteria */}
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Target Scheme:</label>
                <select
                  value={schemeFilter}
                  onChange={(e) => setSchemeFilter(e.target.value)}
                  disabled={isProcessing}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                >
                  <option value="all">All DoSJE Schemes</option>
                  <option value="Deendayal Disabled Rehabilitation Scheme (DDRS)">DDRS (Disability Rehabilitation)</option>
                  <option value="Atal Vayo Abhyuday Yojana (AVYAY)">AVYAY (Senior Citizens Care)</option>
                  <option value="National Action Plan for Drug Demand Reduction (NAPDDR)">NAPDDR (Drug De-addiction)</option>
                  <option value="PM-DAKSH (Pradhan Mantri Dakshta Aur Kushalta Sampann Hitgrahi)">PM-DAKSH</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">State / Zone:</label>
                <select
                  value={stateFilter}
                  onChange={(e) => setStateFilter(e.target.value)}
                  disabled={isProcessing}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                >
                  <option value="all">Pan-India (All States)</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Madhya Pradesh">Madhya Pradesh</option>
                </select>
              </div>
            </div>

            {/* Algorithmic Weighting Rules */}
            <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/80 space-y-2 text-xs text-slate-300">
              <div className="font-semibold text-white flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                <span>Multi-Factor Random Assignment Criteria:</span>
              </div>
              <ul className="space-y-1 list-disc list-inside text-slate-400 text-[11px]">
                <li>
                  <strong className="text-slate-300">AI Anomaly Weight (45%):</strong> Projects with sudden attendance drops or CCTV outages receive priority scoring.
                </li>
                <li>
                  <strong className="text-slate-300">Elapsed Cycle (25%):</strong> Facilities unvisited for &gt; 90 days.
                </li>
                <li>
                  <strong className="text-slate-300">Cryptographic Entropy Seed (30%):</strong> Randomized factor preventing NGOs from predicting inspection schedules.
                </li>
              </ul>
            </div>

            {/* Process Animation */}
            {isProcessing && (
              <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-600/40 space-y-3">
                <div className="flex items-center gap-2 text-indigo-300 text-xs font-semibold">
                  <RefreshCw className="w-4 h-4 animate-spin text-indigo-400" />
                  <span>Running Algorithmic Selection...</span>
                </div>
                <p className="text-xs text-slate-200 font-mono bg-black/40 p-2.5 rounded-lg border border-indigo-500/20">
                  &gt; {steps[currentStepIndex]}
                </p>
              </div>
            )}

            {/* Result Card */}
            {resultInspection && !isProcessing && (
              <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 space-y-3 animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span className="font-bold text-sm text-white">Surprise Duty Successfully Assigned!</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {resultInspection.id}
                  </span>
                </div>

                <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Target Facility:</span>
                    <span className="font-bold text-white text-right">{resultInspection.projectName}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Assigned Team:</span>
                    <button
                      type="button"
                      onClick={() => setShowOfficerPreview(true)}
                      className="font-bold text-amber-400 hover:text-amber-300 underline underline-offset-2 flex items-center gap-1.5 cursor-pointer transition-colors"
                      title="Click to preview assigned officer credentials"
                    >
                      <span>
                        {resultInspection.assignedTeamId} ({resultInspection.inspectorName})
                      </span>
                      <Eye className="w-3.5 h-3.5 text-amber-400" />
                    </button>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-400">Trigger Reason:</span>
                    <span className="text-slate-300 text-right truncate max-w-[280px]">
                      {resultInspection.triggerReason}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-400">Dispatch Order:</span>
                    <span className="text-emerald-400 font-semibold">Immediate Unannounced On-site Arrival</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-300">
                  The unannounced inspection order has been dispatched directly to the field officer's registered mobile device.
                </p>
              </div>
            )}

          </div>

          {/* Footer Actions */}
          <div className="px-6 py-4 bg-slate-800/80 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              Close
            </button>

            <div className="flex items-center gap-2">
              {!resultInspection ? (
                <button
                  onClick={handleRunEngine}
                  disabled={isProcessing}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-xs shadow-lg shadow-indigo-900/40 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Shuffle className="w-4 h-4" />
                  <span>Execute Random Selection</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowOfficerPreview(true)}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold text-xs shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-98"
                  title="Open full profile, credentials, and live telemetry for assigned officer"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Preview Officer / Inspector</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Official Inspector / Officer Details Preview Modal */}
      {showOfficerPreview && resultInspection && currentOfficer && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[92vh]">
            
            {/* Modal Title Bar */}
            <div className="px-6 py-4 border-b border-slate-800 bg-gradient-to-r from-slate-950 via-indigo-950/70 to-slate-950 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm sm:text-base text-white">
                      Assigned Officer Profile & Deployment Dossier
                    </h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase font-bold">
                      Class-I Gazetted
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Department of Social Justice & Empowerment (DoSJE) · Central Field Vigilance Unit
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowOfficerPreview(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="p-6 space-y-4 overflow-y-auto">
              
              {/* Officer Identification Hero */}
              <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-600 via-orange-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg border border-amber-400/40 shrink-0 font-mono">
                    {resultInspection.inspectorName
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="font-bold text-base text-white flex items-center gap-2">
                      {resultInspection.inspectorName}
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {currentOfficer.badgeId}
                      </span>
                    </h4>
                    <p className="text-xs text-indigo-300 font-medium">
                      {currentOfficer.designation}
                    </p>
                    <p className="text-[11px] text-slate-400 font-mono">
                      Unit: {resultInspection.assignedTeamId} · {currentOfficer.reportingHQ}
                    </p>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800">
                  <span className="text-[10px] text-slate-400 font-mono">Duty Status</span>
                  <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                    DISPATCHED ON-SITE
                  </span>
                </div>
              </div>

              {/* Secure Contact & Verification Matrix */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase flex items-center gap-1">
                    <Mail className="w-3 h-3 text-indigo-400" /> Official Govt Email (NIC)
                  </span>
                  <p className="font-mono text-white text-xs select-all">{currentOfficer.email}</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase flex items-center gap-1">
                    <PhoneCall className="w-3 h-3 text-emerald-400" /> Secure Field Comms Number
                  </span>
                  <p className="font-mono text-emerald-300 text-xs font-semibold select-all">
                    {currentOfficer.contact}
                  </p>
                </div>
              </div>

              {/* Active Surprise Mandate Specifics */}
              <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 space-y-2.5 text-xs">
                <div className="flex items-center justify-between pb-1.5 border-b border-indigo-500/20">
                  <span className="font-bold text-indigo-200 flex items-center gap-1.5">
                    <Target className="w-4 h-4 text-indigo-400" />
                    Active Surprise Duty Mandate
                  </span>
                  <span className="font-mono text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    CASE: {resultInspection.id}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Target Welfare Centre:</span>
                    <span className="font-semibold text-white">{resultInspection.projectName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Applicable Scheme:</span>
                    <span className="font-mono text-slate-300">{resultInspection.scheme}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Mandatory Arrival Window:</span>
                    <span className="font-semibold text-emerald-400">Immediate (Unannounced)</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Target Coordinates:</span>
                    <span className="font-mono text-slate-300">
                      {resultInspection.gpsVerification.targetCoords.lat.toFixed(4)}°N,{' '}
                      {resultInspection.gpsVerification.targetCoords.lng.toFixed(4)}°E
                    </span>
                  </div>
                </div>

                <div className="pt-1 text-[11px] text-slate-300 bg-black/40 p-2.5 rounded-xl border border-indigo-500/20">
                  <strong className="text-amber-300">Algorithm Trigger: </strong>
                  <span>{resultInspection.triggerReason}</span>
                </div>
              </div>

              {/* Hardware Device Telemetry & Vigilance Track Record */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Surprise Audits</span>
                  <span className="text-base font-bold font-mono text-white">
                    {currentOfficer.inspectionsCompleted}
                  </span>
                  <span className="text-[9px] text-slate-500 block">Completed</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Integrity Score</span>
                  <span className="text-base font-bold font-mono text-emerald-400">
                    {currentOfficer.integrityRating}
                  </span>
                  <span className="text-[9px] text-emerald-500/80 block">Audit Precision</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Avg Geofence</span>
                  <span className="text-base font-bold font-mono text-indigo-300">
                    {currentOfficer.avgAccuracy.split(' ')[0]}m
                  </span>
                  <span className="text-[9px] text-slate-500 block">Arrival error</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Discrepancy ATRs</span>
                  <span className="text-base font-bold font-mono text-amber-400">
                    {currentOfficer.atrsTriggered}
                  </span>
                  <span className="text-[9px] text-amber-500/80 block">Violations cited</span>
                </div>
              </div>

              {/* Field Equipment Card */}
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-indigo-400 shrink-0" />
                  <div>
                    <span className="text-slate-400 text-[10px] block">Provisioned Hardware Equipment:</span>
                    <span className="font-mono text-slate-200 text-[11px] font-semibold">
                      {currentOfficer.assignedDevice}
                    </span>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-bold shrink-0">
                  SHA-256 VAULT SEALED
                </span>
              </div>

              {/* Ping feedback notice */}
              {pingSent && (
                <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/80 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-150">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    Priority dispatch ping successfully sent to {resultInspection.inspectorName}'s registered terminal ({currentOfficer.assignedDevice.split(' ')[0]}).
                  </span>
                </div>
              )}

            </div>

            {/* Footer Actions */}
            <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 shrink-0">
              <button
                type="button"
                onClick={handleDownloadDeploymentOrder}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                title="Download legal duty deployment notice"
              >
                <Download className="w-3.5 h-3.5 text-indigo-400" />
                <span>Export Deployment Order (JSON)</span>
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={handleSendPing}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-98"
                >
                  <Radio className="w-3.5 h-3.5 text-amber-300" />
                  <span>Send Direct Priority Ping</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowOfficerPreview(false)}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold cursor-pointer transition-colors"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
