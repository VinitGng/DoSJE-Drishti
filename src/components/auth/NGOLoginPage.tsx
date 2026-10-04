import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Building2,
  Lock,
  Mail,
  ArrowRight,
  Eye,
  EyeOff,
  Building,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  Info,
} from 'lucide-react';

interface Props {
  onSuccess?: () => void;
}

export const NGOLoginPage: React.FC<Props> = ({ onSuccess }) => {
  const { loginUser, loginWithGoogle, setRole, projects } = useApp();

  const [email, setEmail] = useState<string>('anita.rao.ddrs@gmail.com');
  const [password, setPassword] = useState<string>('ABCwelfare@2026');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address (e.g. anita.rao.ddrs@gmail.com)');
      return;
    }

    loginUser('ngo', email, password);
    setRole('ngo'); // Redirect to NGO Portal
    if (onSuccess) onSuccess();
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setErrorMsg(null);
    try {
      await loginWithGoogle('ngo');
      setRole('ngo');
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Google Sign-in failed. Please try again or use email login.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const prefillDemo = (demoEmail: string, pass = 'ABCwelfare@2026') => {
    setEmail(demoEmail);
    setPassword(pass);
    setErrorMsg(null);
  };

  return (
    <div className="min-h-[75vh] flex flex-col justify-center items-center py-6 px-4">
      <div className="max-w-md w-full bg-slate-900 border border-emerald-600/50 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-white relative overflow-hidden">
        
        {/* Tricolor Government Stripe */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-white to-emerald-600" />

        {/* Portal Branding */}
        <div className="text-center space-y-2 pt-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 mx-auto flex items-center justify-center font-bold text-2xl text-white shadow-lg border border-emerald-400/40">
            <Building2 className="w-7 h-7" />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block">
            DoSJE Grant-in-Aid Welfare Schemes
          </span>
          <h2 className="text-xl font-bold tracking-tight text-white">
            Registered NGO / Institute Portal Login
          </h2>
          <p className="text-xs text-slate-400">
            Sign in with your registered institute email to log beneficiary attendance, staff records & view compliance
          </p>
        </div>

        {/* Dynamic Project Mapping Info */}
        <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-600/40 text-xs text-emerald-200 space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-emerald-300">
            <Info className="w-3.5 h-3.5" />
            <span>Email-Scoped Institute Authorization</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-snug">
            Your login email uniquely authenticates and scopes your session to your assigned institute project data. No global selector is required.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex justify-between">
              <span>Institute Authorized Incharge Email:</span>
              <span className="text-[10px] text-slate-500 font-mono">.gmail.com / domain</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="project.head@gmail.com"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Institute Portal Password:
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-9 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-500 text-rose-300 text-xs">
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-950 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <KeyRound className="w-4 h-4" />
            <span>Sign In to Institute Portal</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Google Sign-in with Firebase Auth */}
          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-800"></div>
            <span className="flex-shrink mx-3 text-[10px] text-slate-500 uppercase font-mono">or authenticate with</span>
            <div className="flex-grow border-t border-slate-800"></div>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 text-white font-semibold text-xs border border-slate-700 transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-60"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{isGoogleLoading ? 'Connecting to Firebase...' : 'Sign In with Google (Firebase Auth)'}</span>
          </button>
        </form>

        {/* Demo Quick Fills for Different NGOs */}
        <div className="pt-2 border-t border-slate-800 space-y-2">
          <span className="text-[11px] text-slate-400 block text-center">Quick Demo Institute Accounts:</span>
          <div className="space-y-1.5">
            <button
              type="button"
              onClick={() => prefillDemo('anita.rao.ddrs@gmail.com')}
              className="w-full text-left p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-xs text-slate-300 transition-colors flex items-center justify-between cursor-pointer"
            >
              <div>
                <span className="font-bold text-white block">ABC Welfare Centre for Special Needs</span>
                <span className="text-[10px] text-emerald-400 font-mono">anita.rao.ddrs@gmail.com (DDRS Scheme)</span>
              </div>
              <span className="text-[10px] text-slate-400">Use →</span>
            </button>

            <button
              type="button"
              onClick={() => prefillDemo('milind.kulkarni.avyay@gmail.com')}
              className="w-full text-left p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-xs text-slate-300 transition-colors flex items-center justify-between cursor-pointer"
            >
              <div>
                <span className="font-bold text-white block">Sanjeevani Senior Citizen Care Home</span>
                <span className="text-[10px] text-emerald-400 font-mono">milind.kulkarni.avyay@gmail.com (AVYAY Scheme)</span>
              </div>
              <span className="text-[10px] text-slate-400">Use →</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
