import React from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldAlert,
  Smartphone,
  Building2,
  PlayCircle,
  RotateCcw,
  Sparkles,
  LogOut,
  User,
  KeyRound,
  Lock,
  Landmark,
  UserCheck,
} from 'lucide-react';
import { UserRole } from '../types';

export const Header: React.FC = () => {
  const {
    role,
    setRole,
    currentUser,
    logoutUser,
    inspections,
    aiAlerts,
    resetAllData,
    setIsTourActive,
    isPhoneFrame,
    setIsPhoneFrame,
  } = useApp();

  const assignedInspectionsCount = inspections.filter(
    (i) => i.status === 'assigned' || i.status === 'in_progress'
  ).length;

  const activeAlertsCount = aiAlerts.filter((a) => a.status === 'active').length;

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-lg">
      {/* Tricolor Government of India Top Stripe */}
      <div className="h-1 w-full bg-gradient-to-r from-amber-500 via-white to-emerald-600" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between py-3 gap-3">
          {/* Logo & Portal Identity */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 via-orange-600 to-indigo-900 flex items-center justify-center font-bold text-lg text-white shadow-md border border-white/20">
                दृ
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                    Govt. of India • DoSJE
                  </span>
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse mr-1" />
                    LIVE PORTAL
                  </span>
                </div>
                <h1 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                  Project DRISHTI
                  <span className="text-xs font-normal text-slate-300 hidden sm:inline">
                    | Centralized Surprise Inspection & CCTV Monitoring
                  </span>
                </h1>
              </div>
            </div>

            {/* Quick action buttons for mobile */}
            <div className="flex md:hidden items-center gap-1.5">
              {currentUser && (
                <button
                  onClick={() => logoutUser(role)}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300"
                  title="Sign Out"
                >
                  <LogOut className="w-3 h-3 text-rose-400" />
                  <span>Sign Out</span>
                </button>
              )}

              <button
                onClick={() => setIsTourActive(true)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-xs font-semibold text-white shadow"
              >
                <PlayCircle className="w-3.5 h-3.5" />
                <span>Tour</span>
              </button>
            </div>
          </div>

          {/* Center Context Bar: Single Dedicated Dashboard Identity (No multi-role tab mixing) */}
          {currentUser ? (
            <div className="flex items-center gap-2">
              {role === 'government' && (
                <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-800/90 border border-indigo-500/40 text-xs shadow-inner">
                  <Landmark className="w-4 h-4 text-indigo-400" />
                  <span className="font-bold text-white">Central Government Command Dashboard</span>
                  <span className="text-[10px] text-indigo-300 font-mono hidden sm:inline">· DoSJE Directorate</span>
                </div>
              )}
              {role === 'inspector' && (
                <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-800/90 border border-amber-500/40 text-xs shadow-inner">
                  <Smartphone className="w-4 h-4 text-amber-400" />
                  <span className="font-bold text-white">Field Inspector Mobile Portal</span>
                  <span className="text-[10px] text-amber-300 font-mono hidden sm:inline">· PMU Division 4</span>
                </div>
              )}
              {role === 'ngo' && (
                <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-800/90 border border-emerald-500/40 text-xs shadow-inner">
                  <Building2 className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold text-white">Welfare Institute Director Portal</span>
                  <span className="text-[10px] text-emerald-300 font-mono hidden sm:inline">· Grantee Centre</span>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs text-amber-300 font-mono">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>Authentication Gateway • Select Role Below to Access</span>
            </div>
          )}

          {/* Right Action Controls: Officer Profile & Logout / Demo Actions */}
          <div className="hidden md:flex items-center gap-2.5">
            {currentUser ? (
              <div className="flex items-center gap-2">
                {/* Officer Profile Badge */}
                <div className="flex items-center gap-2 bg-slate-800/90 py-1 px-3 rounded-xl border border-slate-700 text-xs">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <div className="text-left">
                    <span className="text-white font-semibold text-[11px] block truncate max-w-[140px]" title={currentUser.name}>
                      {currentUser.name}
                    </span>
                    <span className="text-[10px] text-amber-400 font-mono block uppercase">
                      {role === 'government' ? 'Govt Official' : role === 'inspector' ? 'Field Inspector' : 'NGO Director'}
                    </span>
                  </div>
                </div>

                {/* Logout / Switch Role Button: Redirects back to Separate LoginPage */}
                <button
                  onClick={() => logoutUser(role)}
                  title="Sign out and return to Login Gateway"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700 hover:border-slate-600 text-xs font-semibold transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-400" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-950/60 border border-indigo-500/40 text-indigo-300 text-xs font-mono">
                <UserCheck className="w-3.5 h-3.5" />
                <span>Single Sign-On</span>
              </div>
            )}

            {role === 'inspector' && currentUser && (
              <button
                onClick={() => setIsPhoneFrame(!isPhoneFrame)}
                title="Toggle Mobile Simulator Frame"
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                  isPhoneFrame
                    ? 'bg-slate-700 border-indigo-500 text-indigo-300'
                    : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>{isPhoneFrame ? 'Exit Bezel' : 'Phone Bezel'}</span>
              </button>
            )}

            <button
              onClick={() => setIsTourActive(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-xs font-semibold text-white shadow-sm hover:from-amber-600 hover:to-orange-600 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>Guided Demo Tour</span>
            </button>

            <button
              onClick={resetAllData}
              title="Reset Demo State"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
