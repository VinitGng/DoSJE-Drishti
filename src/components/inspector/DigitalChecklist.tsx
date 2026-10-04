import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ClipboardCheck,
  Check,
  X,
  AlertTriangle,
  Camera,
  MessageSquare,
} from 'lucide-react';
import { Inspection, ChecklistItem } from '../../types';

interface Props {
  inspection: Inspection;
}

export const DigitalChecklist: React.FC<Props> = ({ inspection }) => {
  const { updateChecklistItem } = useApp();

  // Group items by category
  const categories = Array.from(
    new Set(inspection.checklist.map((item) => item.category))
  );

  const completedCount = inspection.checklist.filter(
    (item) => item.status !== 'pending'
  ).length;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 text-white space-y-4 shadow-xl">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <ClipboardCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white">Digital Audit Checklist</h3>
            <p className="text-[11px] text-slate-400">
              Structured statutory parameters under DoSJE scheme guidelines
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="font-mono text-xs font-bold text-emerald-400">
            {completedCount}/{inspection.checklist.length} Completed
          </span>
          <div className="w-20 h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1">
            <div
              className="h-full bg-emerald-500 transition-all duration-300"
              style={{
                width: `${(completedCount / inspection.checklist.length) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Checklist items by category */}
      <div className="space-y-4 pt-1">
        {categories.map((category) => {
          const items = inspection.checklist.filter((i) => i.category === category);
          return (
            <div key={category} className="space-y-2">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-amber-400 font-mono">
                {category}
              </h4>

              <div className="space-y-2.5">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/90 space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-xs font-medium text-slate-200 leading-snug">
                        {item.question}
                      </p>
                      {item.requiredPhoto && (
                        <span
                          title="Mandatory Photo Evidence Required"
                          className="p-1 rounded bg-indigo-500/20 text-indigo-300 shrink-0"
                        >
                          <Camera className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>

                    {/* Status Toggle Buttons */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateChecklistItem(inspection.id, item.id, 'pass')}
                        className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                          item.status === 'pass'
                            ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40 ring-1 ring-emerald-400'
                            : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Pass</span>
                      </button>

                      <button
                        onClick={() => updateChecklistItem(inspection.id, item.id, 'flagged')}
                        className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                          item.status === 'flagged'
                            ? 'bg-amber-600 text-white shadow-md shadow-amber-900/40 ring-1 ring-amber-400'
                            : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                        }`}
                      >
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Flagged</span>
                      </button>

                      <button
                        onClick={() => updateChecklistItem(inspection.id, item.id, 'fail')}
                        className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                          item.status === 'fail'
                            ? 'bg-rose-600 text-white shadow-md shadow-rose-900/40 ring-1 ring-rose-400'
                            : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                        }`}
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Fail</span>
                      </button>
                    </div>

                    {/* Optional Item Remark */}
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Add on-site observation or discrepancy remark..."
                        value={item.remarks}
                        onChange={(e) =>
                          updateChecklistItem(
                            inspection.id,
                            item.id,
                            item.status === 'pending' ? 'flagged' : item.status,
                            e.target.value
                          )
                        }
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-[11px] text-slate-300 placeholder-slate-500 outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
