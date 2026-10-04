import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  Landmark,
  Smartphone,
  Building2,
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Eye,
  EyeOff,
  UserCheck,
  ShieldAlert,
  Fingerprint,
} from 'lucide-react';
import { BiometricAuthModal } from './BiometricAuthModal';

interface Props {
  initialRole?: UserRole;
  onSuccess?: () => void;
}

interface DemoAccount {
  email: string;
  role: UserRole;
  name: string;
  designation: string;
  password: string;
  projectId?: string;
  badge: string;
}

const DEMO_ACCOUNTS: DemoAccount[] = [
  // Government Directorate
  {
    email: 'dosje.director@gov.in',
    role: 'government',
    name: 'Dr. Alok Verma, IAS',
    designation: 'Director General, DoSJE',
    password: 'Director@2026',
    badge: 'Govt Central Directorate',
  },
  {
    email: 'pmu.head@gov.in',
    role: 'government',
    name: 'S. Khurana',
    designation: 'Director, Central PMU Surveillance Command',
    password: 'Director@2026',
    badge: 'Govt Surveillance Division',
  },
  // Field Inspectors
  {
    email: 'rajesh.sharma.pmu@gmail.com',
    role: 'inspector',
    name: 'Inspector Rajesh Sharma',
    designation: 'Lead Inspection Officer (PMU Team 4)',
    password: 'Inspector@2026',
    badge: 'Field Inspector (Assigned Audits)',
  },
  {
    email: 'priya.singh.pmu@gmail.com',
    role: 'inspector',
    name: 'Inspector Priya Singh',
    designation: 'Surprise Audit Officer (PMU Team 2)',
    password: 'Inspector@2026',
    badge: 'Field Inspector (Team 2)',
  },
  {
    email: 'amit.patel.pmu@gmail.com',
    role: 'inspector',
    name: 'Inspector Amit Patel',
    designation: 'Field Compliance Officer (PMU Team 7)',
    password: 'Inspector@2026',
    badge: 'Field Inspector (Western Zone)',
  },
  // NGO Institute Incharges
  {
    email: 'anita.rao.ddrs@gmail.com',
    role: 'ngo',
    name: 'Dr. Anita Rao',
    designation: 'Project Director (Aarogya Seva Samiti)',
    password: 'NGO@2026',
    projectId: 'PRJ-001',
    badge: 'NGO Director (PRJ-001 DDRS)',
  },
  {
    email: 'm.kulkarni@matruseva.org',
    role: 'ngo',
    name: 'Shri Milind Kulkarni',
    designation: 'Superintendent (Matru Seva Foundation)',
    password: 'NGO@2026',
    projectId: 'PRJ-002',
    badge: 'NGO Director (PRJ-002 AVYAY)',
  },
  {
    email: 'saxena.navchetna@gmail.com',
    role: 'ngo',
    name: 'Dr. Virendra Saxena',
    designation: 'Chief Medical Officer (Samarpan Mission)',
    password: 'NGO@2026',
    projectId: 'PRJ-003',
    badge: 'NGO Director (PRJ-003 NAPDDR)',
  },
  {
    email: 'm.sundaram@vidyajyoti.org',
    role: 'ngo',
    name: 'Ms. Meenakshi Sundaram',
    designation: 'Center Head (Vidya Jyoti Educational Trust)',
    password: 'NGO@2026',
    projectId: 'PRJ-004',
    badge: 'NGO Director (PRJ-004 PM-DAKSH)',
  },
  {
    email: 'tiwari.manas@mpngo.org',
    role: 'ngo',
    name: 'Shri R.K. Tiwari',
    designation: 'Managing Trustee (Manas Kalyan Samiti)',
    password: 'NGO@2026',
    projectId: 'PRJ-005',
    badge: 'NGO Director (PRJ-005 DDRS)',
  },
];

export const LoginPage: React.FC<Props> = ({ initialRole, onSuccess }) => {
  const { role, setRole, loginUser, loginWithGoogle, projects } = useApp();

  // Role selector state: 'government' (Govt), 'inspector' (Inspector), 'ngo' (NGO)
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole || role || 'government');
  
  // Credentials
  const [email, setEmail] = useState<string>('dosje.director@gov.in');
  const [password, setPassword] = useState<string>('Director@2026');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [selectedNgoProjectId, setSelectedNgoProjectId] = useState<string>('PRJ-001');

  // UI status
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);
  const [isBiometricModalOpen, setIsBiometricModalOpen] = useState<boolean>(false);

  // When role selection changes, update default email/password hints
  const handleSelectRole = (newRole: UserRole) => {
    setSelectedRole(newRole);
    setErrorMessage(null);
    if (newRole === 'government') {
      setEmail('dosje.director@gov.in');
      setPassword('Director@2026');
    } else if (newRole === 'inspector') {
      setEmail('rajesh.sharma.pmu@gmail.com');
      setPassword('Inspector@2026');
    } else {
      setEmail('anita.rao.ddrs@gmail.com');
      setPassword('NGO@2026');
    }
  };

  // When user selects an email from the Pull Down Bar
  const handleSelectDemoAccount = (selectedEmail: string) => {
    const account = DEMO_ACCOUNTS.find((a) => a.email === selectedEmail);
    if (!account) return;
    setSelectedRole(account.role);
    setEmail(account.email);
    setPassword(account.password);
    if (account.projectId) {
      setSelectedNgoProjectId(account.projectId);
    }
    setErrorMessage(null);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !password) {
      setErrorMessage('Please provide your statutory officer credentials.');
      return;
    }

    setIsSubmitting(true);
    try {
      setRole(selectedRole);
      loginUser(
        selectedRole,
        email,
        password,
        selectedRole === 'ngo' ? selectedNgoProjectId : undefined
      );

      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMessage(null);
    setIsGoogleLoading(true);
    try {
      setRole(selectedRole);
      await loginWithGoogle(selectedRole);
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      console.warn('Google Sign-in failed or cancelled:', err);
      loginUser(
        selectedRole,
        email,
        password,
        selectedRole === 'ngo' ? selectedNgoProjectId : undefined
      );
      if (onSuccess) {
        onSuccess();
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const roleMeta = {
    government: {
      title: 'Govt Official Portal',
      badge: 'DoSJE Directorate & PMU Command',
      description: 'Nationwide CCTV surveillance, automated surprise dispatch, AI anomaly analytics & ATR monitoring.',
      icon: Landmark,
      color: 'indigo',
      officer: 'Dr. Alok Verma, IAS (Director General)',
    },
    inspector: {
      title: 'PMU Field Inspector Portal',
      badge: 'Surprise Field Inspection Unit',
      description: 'On-site GPS geofence check-in, digital audit checklist, tamper-evident camera with baked telemetry & Gemini AI analysis.',
      icon: Smartphone,
      color: 'amber',
      officer: 'Inspector Rajesh Sharma (PMU Team 4)',
    },
    ngo: {
      title: 'NGO / Institute Portal',
      badge: 'Grantee Welfare Facility',
      description: 'CCTV uptime monitoring, beneficiary muster biometric records, show-cause ATR compliance & audit logs.',
      icon: Building2,
      color: 'emerald',
      officer: 'Dr. Anita Rao (Project Director)',
    },
  };

  const activeMeta = roleMeta[selectedRole];
  const ActiveIcon = activeMeta.icon;

  const currentInspectorAccount =
    DEMO_ACCOUNTS.find((a) => a.email === email && a.role === 'inspector') ||
    DEMO_ACCOUNTS.find((a) => a.role === 'inspector');

  return (
    <div className="min-h-[82vh] flex flex-col items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl space-y-6">
        
        {/* National Portal Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-mono text-amber-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Ministry of Social Justice & Empowerment • Govt of India</span>
          </div>

          <div className="flex items-center justify-center gap-3 pt-1">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-600 to-indigo-900 flex items-center justify-center font-bold text-2xl text-white shadow-xl shadow-amber-950/40 border border-white/20">
              दृ
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-black tracking-tight text-white">Project DRISHTI</h1>
              <p className="text-xs text-slate-400 font-medium">
                Centralized Surprise Inspection, CCTV Monitoring & Anomaly Detection System
              </p>
            </div>
          </div>
        </div>

        {/* Card: Selection of Options (Govt, Inspector, NGO) */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white space-y-6 shadow-2xl backdrop-blur-xl">
          
          <div className="space-y-1">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              <span>Step 1: Select Your Access Portal</span>
            </h2>
            <p className="text-xs text-slate-400">
              Choose your administrative role to access the inner monitoring dashboard or field app.
            </p>
          </div>

          {/* 3 Interactive Role Selection Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Option 1: Govt */}
            <div
              onClick={() => handleSelectRole('government')}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                selectedRole === 'government'
                  ? 'bg-indigo-950/50 border-indigo-500 shadow-lg shadow-indigo-950/50 scale-[1.02]'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-950/90'
              }`}
            >
              <div className="flex items-center justify-between">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    selectedRole === 'government'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  <Landmark className="w-5 h-5" />
                </div>
                {selectedRole === 'government' && (
                  <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                )}
              </div>

              <div>
                <span className="font-bold text-sm text-white block">Govt Official</span>
                <span className="text-[10px] text-indigo-300 font-mono font-medium block">
                  DoSJE Directorate
                </span>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  Surprise dispatch, live CCTV feeds & AI anomaly analytics.
                </p>
              </div>
            </div>

            {/* Option 2: Inspector */}
            <div
              onClick={() => handleSelectRole('inspector')}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                selectedRole === 'inspector'
                  ? 'bg-amber-950/50 border-amber-500 shadow-lg shadow-amber-950/50 scale-[1.02]'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-950/90'
              }`}
            >
              <div className="flex items-center justify-between">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    selectedRole === 'inspector'
                      ? 'bg-amber-600 text-white'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  <Smartphone className="w-5 h-5" />
                </div>
                {selectedRole === 'inspector' && (
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                )}
              </div>

              <div>
                <span className="font-bold text-sm text-white block">Field Inspector</span>
                <span className="text-[10px] text-amber-300 font-mono font-medium block">
                  PMU Audit Officer
                </span>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  GPS verified check-in, watermarked evidence & Gemini AI notes.
                </p>
              </div>
            </div>

            {/* Option 3: NGO */}
            <div
              onClick={() => handleSelectRole('ngo')}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                selectedRole === 'ngo'
                  ? 'bg-emerald-950/50 border-emerald-500 shadow-lg shadow-emerald-950/50 scale-[1.02]'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-950/90'
              }`}
            >
              <div className="flex items-center justify-between">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    selectedRole === 'ngo'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  <Building2 className="w-5 h-5" />
                </div>
                {selectedRole === 'ngo' && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                )}
              </div>

              <div>
                <span className="font-bold text-sm text-white block">NGO / Institute</span>
                <span className="text-[10px] text-emerald-300 font-mono font-medium block">
                  Facility Incharge
                </span>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  CCTV health telemetry, muster records & ATR compliance filing.
                </p>
              </div>
            </div>
          </div>

          {/* Step 2: Sign-In Credentials Form */}
          <div className="border-t border-slate-800 pt-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ActiveIcon className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Step 2: Sign In to {activeMeta.title}
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
                {activeMeta.badge}
              </span>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/50 text-xs text-rose-200 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Step 2A: Pull Down Bar for All Available Demo Accounts */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-indigo-500/40 space-y-2 shadow-inner">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-amber-300 flex items-center gap-1.5 uppercase font-mono">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Available Demo Accounts (Pull Down Bar):</span>
                </label>
                <span className="text-[10px] font-mono text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Shared Live State
                </span>
              </div>

              <select
                value={email}
                onChange={(e) => handleSelectDemoAccount(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 hover:border-indigo-400 text-white rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer font-medium"
              >
                <optgroup label="🏛️ Government Directorate & Surveillance Command">
                  {DEMO_ACCOUNTS.filter((a) => a.role === 'government').map((acc) => (
                    <option key={acc.email} value={acc.email}>
                      {acc.email} — {acc.name} ({acc.designation})
                    </option>
                  ))}
                </optgroup>

                <optgroup label="📱 PMU Field Inspectors (On-site Surprise Audits)">
                  {DEMO_ACCOUNTS.filter((a) => a.role === 'inspector').map((acc) => (
                    <option key={acc.email} value={acc.email}>
                      {acc.email} — {acc.name} ({acc.designation})
                    </option>
                  ))}
                </optgroup>

                <optgroup label="🏢 NGO / Institute Directors & Facility Incharges">
                  {DEMO_ACCOUNTS.filter((a) => a.role === 'ngo').map((acc) => (
                    <option key={acc.email} value={acc.email}>
                      {acc.email} — {acc.name} ({acc.designation})
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            {/* Step 2B: Biometric Authentication Layer for Field Officers */}
            <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-500/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5 uppercase font-mono">
                  <Fingerprint className="w-4 h-4 text-amber-400 animate-pulse" />
                  <span>Biometric Passkey Layer (FIDO2 / WebAuthn):</span>
                </span>
                <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30 font-bold">
                  Rule 7-C Secured
                </span>
              </div>

              <p className="text-[11px] text-slate-300">
                Authenticate with on-device hardware biometric sensor (fingerprint, Touch ID, or face passkey) to unlock the assigned field inspection workflow.
              </p>

              <button
                type="button"
                onClick={() => setIsBiometricModalOpen(true)}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                title="Authenticate with fingerprint or WebAuthn passkey to enter field inspection workflow"
              >
                <Fingerprint className="w-4 h-4" />
                <span>[ Authenticate via Biometric Passkey / Fingerprint ]</span>
              </button>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {/* If NGO role is selected, offer specific institute binding */}
              {selectedRole === 'ngo' && (
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-300">
                    Registered Grantee Facility:
                  </label>
                  <select
                    value={selectedNgoProjectId}
                    onChange={(e) => setSelectedNgoProjectId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                  >
                    {projects.map((proj) => (
                      <option key={proj.id} value={proj.id}>
                        {proj.name} ({proj.scheme.split('(')[1]?.replace(')', '') || proj.district})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Email */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">Official Email / ID:</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="officer@dosje.gov.in"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">Password / Access Key:</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* One-Click Quick Login Preset Button */}
              <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">
                    Demo Officer Profile:
                  </span>
                  <div className="font-semibold text-slate-200 text-[11px] truncate max-w-[280px]">
                    {activeMeta.officer}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    handleSelectRole(selectedRole);
                    loginUser(
                      selectedRole,
                      email,
                      password,
                      selectedRole === 'ngo' ? selectedNgoProjectId : undefined
                    );
                    setRole(selectedRole);
                    if (onSuccess) onSuccess();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-indigo-300 text-[11px] font-bold border border-slate-700 transition-colors cursor-pointer flex items-center gap-1 shrink-0"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Instant Login</span>
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  selectedRole === 'government'
                    ? 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white shadow-indigo-950/40'
                    : selectedRole === 'inspector'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 shadow-amber-950/40 font-black'
                    : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-950/40'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                <span>Sign In & Access Inner {activeMeta.title}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Google Sign In Alternative */}
            <div className="pt-2 text-center">
              <div className="relative my-3">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-800" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase font-mono">
                  <span className="bg-slate-900 px-2 text-slate-500">
                    Or Authenticate via Firebase SSO
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isGoogleLoading}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-950 hover:bg-slate-850 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span>{isGoogleLoading ? 'Connecting to Google...' : 'Sign In with Google Account'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Security Disclaimers */}
        <p className="text-[11px] text-slate-500 text-center">
          Statutory Notice: Authorized government and grantee access only. All actions are logged and subject to Section 43 of the IT Act.
        </p>

      </div>

      {/* Biometric Passkey / Fingerprint Authentication Layer Modal */}
      <BiometricAuthModal
        isOpen={isBiometricModalOpen}
        onClose={() => setIsBiometricModalOpen(false)}
        officerName={currentInspectorAccount?.name || 'Inspector Rajesh Sharma (PMU Team 4)'}
        officerEmail={currentInspectorAccount?.email || 'rajesh.sharma.pmu@gmail.com'}
        onAuthenticated={(verifiedEmail) => {
          setSelectedRole('inspector');
          setRole('inspector');
          loginUser('inspector', verifiedEmail || 'rajesh.sharma.pmu@gmail.com', 'Inspector@2026');
          if (onSuccess) onSuccess();
        }}
      />
    </div>
  );
};
