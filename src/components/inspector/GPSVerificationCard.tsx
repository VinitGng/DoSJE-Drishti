import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  MapPin,
  Compass,
  CheckCircle2,
  AlertTriangle,
  Navigation,
  RotateCw,
  Crosshair,
  ShieldCheck,
  ShieldAlert,
} from 'lucide-react';
import { Inspection } from '../../types';

interface Props {
  inspection: Inspection;
}

export const GPSVerificationCard: React.FC<Props> = ({ inspection }) => {
  const { verifyInspectorGPS } = useApp();
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ message: string; verified: boolean } | null>(null);

  const isVerified = inspection.gpsVerification.verified;

  // Real browser geolocation attempt
  const handleVerifyRealLocation = () => {
    setIsLocating(true);
    setFeedback(null);

    if (!navigator.geolocation) {
      // Fallback to simulation
      handleSimulateArrival();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const res = verifyInspectorGPS(inspection.id, {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setFeedback({ message: res.message, verified: res.verified });
      },
      (err) => {
        setIsLocating(false);
        // If permission denied or unavailable, prompt simulation
        setFeedback({
          message:
            'Browser location permission denied or timed out. Use the "Simulate On-Site Arrival" button to test the 150m perimeter verification.',
          verified: false,
        });
      },
      { timeout: 8000 }
    );
  };

  // One-click simulated arrival (for on-site testing when tester is not physically in Mangalore)
  const handleSimulateArrival = () => {
    setIsLocating(true);
    setTimeout(() => {
      setIsLocating(false);
      const res = verifyInspectorGPS(
        inspection.id,
        {
          lat: inspection.gpsVerification.targetCoords.lat,
          lng: inspection.gpsVerification.targetCoords.lng,
        },
        true // force simulation within 35 meters
      );
      setFeedback({ message: res.message, verified: true });
    }, 600);
  };

  // Simulate leaving site / distant location
  const handleSimulateDistant = () => {
    setIsLocating(true);
    setTimeout(() => {
      setIsLocating(false);
      const res = verifyInspectorGPS(
        inspection.id,
        {
          lat: inspection.gpsVerification.targetCoords.lat + 0.05,
          lng: inspection.gpsVerification.targetCoords.lng + 0.05,
        },
        false // distant location ~7.5km away
      );
      setFeedback({ message: res.message, verified: false });
    }, 400);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 text-white space-y-4 shadow-xl">
      
      {/* Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={`p-2 rounded-xl ${
              isVerified
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
            }`}
          >
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white">Geofence & Location Verification</h3>
            <p className="text-[11px] text-slate-400">
              Mandatory anti-proxy check: Inspector must be within 150m
            </p>
          </div>
        </div>

        <span
          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
            isVerified
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
          }`}
        >
          {isVerified ? (
            <>
              <CheckCircle2 className="w-3 h-3" /> VERIFIED ON-SITE
            </>
          ) : (
            <>
              <AlertTriangle className="w-3 h-3" /> PENDING CHECK-IN
            </>
          )}
        </span>
      </div>

      {/* Target Coordinates Box */}
      <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs">
        <div className="flex justify-between items-center text-slate-400">
          <span>Assigned Facility Coordinates:</span>
          <span className="font-mono text-indigo-400 font-bold">
            {inspection.gpsVerification.targetCoords.lat.toFixed(4)}°N,{' '}
            {inspection.gpsVerification.targetCoords.lng.toFixed(4)}°E
          </span>
        </div>

        {isVerified && inspection.gpsVerification.distanceMeters !== undefined && (
          <div className="flex justify-between items-center pt-2 border-t border-slate-800">
            <span className="text-slate-400">Verified Distance:</span>
            <span className="font-mono text-emerald-400 font-bold flex items-center gap-1">
              <Crosshair className="w-3 h-3" />
              {inspection.gpsVerification.distanceMeters} meters (Perimeter: &lt;150m)
            </span>
          </div>
        )}
      </div>

      {/* Visual Radar Animation & Status Banner */}
      <div
        className={`p-4 rounded-xl border text-xs transition-all ${
          isVerified
            ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
            : 'bg-rose-950/30 border-rose-600/40 text-rose-200'
        }`}
      >
        <div className="flex items-start gap-3">
          <div className="mt-0.5 shrink-0">
            {isVerified ? (
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            ) : (
              <ShieldAlert className="w-5 h-5 text-rose-400 animate-pulse" />
            )}
          </div>
          <div className="space-y-1">
            <p className="font-bold text-xs">
              {isVerified
                ? 'Location Confirmed: Inspector Is At The Assigned Site'
                : 'Anti-Proxy Rule: Location Not Verified'}
            </p>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              {isVerified
                ? `GPS timestamp recorded at ${inspection.gpsVerification.timestamp}. Digital inspection and evidence capture unlocked.`
                : '“Location not verified — inspection cannot be submitted as completed.” The system enforces on-site presence before report submission.'}
            </p>
          </div>
        </div>
      </div>

      {/* Feedback Alert from interaction */}
      {feedback && (
        <div
          className={`p-3 rounded-xl border text-xs ${
            feedback.verified
              ? 'bg-emerald-900/40 border-emerald-500 text-emerald-200'
              : 'bg-amber-900/40 border-amber-500 text-amber-200'
          }`}
        >
          {feedback.message}
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-2 pt-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {/* Real GPS check */}
          <button
            onClick={handleVerifyRealLocation}
            disabled={isLocating}
            className="py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>{isLocating ? 'Reading GPS...' : 'Scan Live GPS Location'}</span>
          </button>

          {/* Simulate Arrival on Site */}
          <button
            onClick={handleSimulateArrival}
            disabled={isLocating}
            className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow"
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span>Simulate On-Site Arrival (Test Mode)</span>
          </button>
        </div>

        {/* Test Off-site simulation */}
        {isVerified && (
          <button
            onClick={handleSimulateDistant}
            className="w-full text-center text-[11px] text-slate-400 hover:text-rose-400 py-1 cursor-pointer transition-colors"
          >
            [Test Case: Simulate Inspector Moving Away / Off-Site]
          </button>
        )}
      </div>

    </div>
  );
};
