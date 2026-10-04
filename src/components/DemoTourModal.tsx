import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  Shuffle,
  Smartphone,
  MapPin,
  Camera,
  Video,
  TrendingDown,
  LayoutDashboard,
  CheckCircle2,
  ArrowRight,
  X,
  Play,
} from 'lucide-react';

interface StepInfo {
  step: number;
  title: string;
  tag: string;
  roleNeeded: 'government' | 'inspector' | 'ngo';
  icon: any;
  summary: string;
  details: string;
  actionText: string;
}

const TOUR_STEPS: StepInfo[] = [
  {
    step: 1,
    title: '1. Automated & Random Inspection Assignment',
    tag: 'Feature #1',
    roleNeeded: 'government',
    icon: Shuffle,
    summary: 'Automated unpredictable selection of projects based on risk scores, elapsed time, and AI anomalies.',
    details: 'DoSJE cannot physically audit all 1,248 NGOs every day. The automated engine uses entropy seeds and risk weights to assign surprise duties to PMU teams, eliminating predictability and corruption.',
    actionText: 'Go to Assignment Engine & Run Dispatch',
  },
  {
    step: 2,
    title: '2. Inspector Mobile Inspection Companion',
    tag: 'Feature #2',
    roleNeeded: 'inspector',
    icon: Smartphone,
    summary: 'Field officers receive instant surprise inspection assignments on their mobile device.',
    details: 'Inspectors receive real-time notifications for unannounced inspections with project details, beneficiary headcount targets, and digital structured audit checklists.',
    actionText: 'Switch to Inspector Mobile View',
  },
  {
    step: 3,
    title: '3. GPS & Geolocation Perimeter Verification',
    tag: 'Feature #3',
    roleNeeded: 'inspector',
    icon: MapPin,
    summary: 'Strict anti-proxy enforcement: Inspector must physically be within 150m of facility coordinates.',
    details: 'If an inspector attempts to submit from home or a distant location, the system strictly blocks submission: "Location not verified — inspection cannot be submitted as completed."',
    actionText: 'Test Live GPS & Radius Verification',
  },
  {
    step: 4,
    title: '4. Geo-Tagged & Timestamped Evidence Capture',
    tag: 'Feature #4',
    roleNeeded: 'inspector',
    icon: Camera,
    summary: 'In-app photos and videos stamped with indelible watermarks (Lat/Long, Time, Inspector ID).',
    details: 'Photos captured within the app cannot be forged or picked from gallery. Live GPS coordinates, inspection ID, altitude, and timestamps are directly embedded into the evidence dossier.',
    actionText: 'Capture Geo-stamped Evidence Photo',
  },
  {
    step: 5,
    title: '5. Central Live CCTV Monitoring Demo',
    tag: 'Feature #5',
    roleNeeded: 'government',
    icon: Video,
    summary: 'Integrated live CCTV feeds from Heavy Fabrication Bays, Scaffolding Grids, Logistics Warehouses and Freight Gates.',
    details: 'Existing institute cameras are connected without needing costly hardware replacement. Department officials can view real-time operations, glitch diagnostics, and zoom in on facilities.',
    actionText: 'View Live CCTV Feeds & Camera Grid',
  },
  {
    step: 6,
    title: '6. AI Attendance Anomaly Detection',
    tag: 'Feature #6',
    roleNeeded: 'government',
    icon: TrendingDown,
    summary: 'Statistical Z-score & pattern analytics flag abnormal drops without making premature accusations.',
    details: 'Historical attendance baseline is 48 beneficiaries. When reported attendance suddenly plunges to 18, AI flags: "Unusual attendance pattern — requires review" as a decision-support alert.',
    actionText: 'View AI Attendance Analytics Chart',
  },
  {
    step: 7,
    title: '7. Government Monitoring & Issue Resolution',
    tag: 'Feature #7',
    roleNeeded: 'government',
    icon: LayoutDashboard,
    summary: 'End-to-end governance: Review dossiers, issue show-cause notices, track Action Taken Reports (ATR).',
    details: 'When violations are flagged (e.g. blocked fire exit or attendance discrepancy), a tracked compliance workflow (Issue → Notice → Action Required → Corrected → Verified → Resolved) ensures accountability.',
    actionText: 'Inspect Reports & Compliance Tracker',
  },
];

export const DemoTourModal: React.FC = () => {
  const { isTourActive, setIsTourActive, tourStep, setTourStep, setRole } = useApp();

  if (!isTourActive) return null;

  const currentStep = TOUR_STEPS[tourStep - 1] || TOUR_STEPS[0];
  const StepIcon = currentStep.icon;

  const handleStepSelect = (stepNum: number) => {
    setTourStep(stepNum);
    const target = TOUR_STEPS[stepNum - 1];
    if (target) {
      setRole(target.roleNeeded);
    }
  };

  const handleNextStep = () => {
    if (tourStep < 7) {
      handleStepSelect(tourStep + 1);
    } else {
      setIsTourActive(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col text-slate-100 max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                Official System Presentation Walkthrough
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Step {tourStep} of 7
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                End-to-End demonstration of the 7 core DoSJE monitoring features
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsTourActive(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Horizontal Steps Progress Bar */}
        <div className="px-6 py-3 bg-slate-800/60 border-b border-slate-800/80 overflow-x-auto">
          <div className="flex items-center gap-1.5 min-w-max">
            {TOUR_STEPS.map((s) => (
              <button
                key={s.step}
                onClick={() => handleStepSelect(s.step)}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  tourStep === s.step
                    ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                    : tourStep > s.step
                    ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/60'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {tourStep > s.step ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <span className="w-4 h-4 rounded-full bg-slate-700 text-[10px] flex items-center justify-center">
                    {s.step}
                  </span>
                )}
                <span>{s.tag}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Current Step Body */}
        <div className="p-6 space-y-4 overflow-y-auto">
          <div className="flex items-start gap-4">
            <div className="p-3.5 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400">
              <StepIcon className="w-8 h-8" />
            </div>
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider font-bold text-amber-400">
                  {currentStep.tag}
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  Target Role: <strong className="text-white capitalize">{currentStep.roleNeeded}</strong>
                </span>
              </div>
              <h4 className="text-xl font-bold text-white">{currentStep.title}</h4>
              <p className="text-sm font-medium text-slate-300">{currentStep.summary}</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/70 border border-slate-700/80 text-sm text-slate-300 leading-relaxed">
            <p className="font-semibold text-white mb-1.5">How it solves the problem statement:</p>
            <p>{currentStep.details}</p>
          </div>

          {/* Quick instructions for the evaluator */}
          <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-600/30 text-xs text-amber-200 flex items-start gap-2.5">
            <span className="text-base">💡</span>
            <div>
              <span className="font-semibold text-amber-300">Live Interactive Action: </span>
              Clicking the button below will immediately switch to the{' '}
              <strong className="text-white capitalize">{currentStep.roleNeeded}</strong> view so you can interact with this feature directly.
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 bg-slate-800/80 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={() => handleStepSelect(Math.max(1, tourStep - 1))}
            disabled={tourStep === 1}
            className="px-3.5 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            ← Previous
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setRole(currentStep.roleNeeded);
                setIsTourActive(false);
              }}
              className="px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 text-amber-400" />
              <span>Explore in UI</span>
            </button>

            <button
              onClick={handleNextStep}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <span>{tourStep === 7 ? 'Finish Tour' : 'Next Step'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
