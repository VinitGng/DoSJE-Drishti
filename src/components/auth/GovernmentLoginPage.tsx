import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldAlert,
  Lock,
  Mail,
  ArrowRight,
  Eye,
  EyeOff,
  Landmark,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface Props {
  onSuccess?: () => void;
}

export const GovernmentLoginPage: React.FC<Props> = ({ onSuccess }) => {
  const { loginUser, loginWithGoogle, setRole } = useApp();

  const [email, setEmail] = useState<string>('dosje.director@gov.in');
  const [password, setPassword] = useState<string>('Govt@DoSJE2026');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address (e.g. dosje.director@gov.in or .gmail.com)');
      return;
    }

    loginUser('government', email, password);
    setRole('government'); // Redirect to Government Portal
    if (onSuccess) onSuccess();
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setErrorMsg(null);
    try {
      await loginWithGoogle('government');
      setRole('government');
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Google Sign-in failed. Please try again or use email login.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const prefillDemo = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('Govt@DoSJE2026');
    setErrorMsg(null);
  };

  return (
    <div className="min-h-[75vh] flex flex-col justify-center items-center py-6 px-4">
      <div className="max-w-md w-full bg-slate-900 border border-indigo-700/50 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-white relative overflow-hidden">
        
        {/* Tricolor Government Stripe */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-white to-emerald-600" />

        {/* Portal Branding */}
        <div className="text-center space-y-2 pt-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-900 mx-auto flex items-center justify-center font-bold text-2xl text-white shadow-lg border border-indigo-400/40">
            <Landmark className="w-7 h-7 text-amber-400" />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block">
            Ministry of Social Justice & Empowerment • Govt. of India
          </span>
          <h2 className="text-xl font-bold tracking-tight text-white">
            DoSJE Directorate Central Login
          </h2>
          <p className="text-xs text-slate-400">
            Authorized access for Joint Secretaries, Directors, and Central Supervision Officials
          </p>
        </div>

        {/* Badge */}
        <div className="p-3 rounded-2xl bg-indigo-950/50 border border-indigo-600/40 text-xs text-indigo-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-indigo-400" />
            <span className="font-bold">Government Monitoring Directorate</span>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-black/40 text-indigo-300">
            Official Access
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex justify-between">
              <span>Department Official Email:</span>
              <span className="text-[10px] text-slate-500 font-mono">@gov.in / .gmail.com</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="officer@gov.in"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Security Password:
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-9 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-indigo-500"
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
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-xs shadow-lg shadow-indigo-950 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <KeyRound className="w-4 h-4" />
            <span>Sign In to DoSJE Directorate Portal</span>
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

        {/* Demo Quick Fills */}
        <div className="pt-2 border-t border-slate-800 space-y-2">
          <span className="text-[11px] text-slate-400 block text-center">Quick Demo Credentials:</span>
          <div className="flex gap-2 justify-center">
            <button
              type="button"
              onClick={() => prefillDemo('dosje.director@gov.in')}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 text-[11px] font-mono border border-slate-700 transition-colors cursor-pointer"
            >
              dosje.director@gov.in
            </button>
            <button
              type="button"
              onClick={() => prefillDemo('alok.verma.ias@gmail.com')}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 text-[11px] font-mono border border-slate-700 transition-colors cursor-pointer"
            >
              alok.verma.ias@gmail.com
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
