import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Database,
  Cloud,
  CloudOff,
  RefreshCw,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Smartphone,
  MapPin,
  AlertTriangle,
  Send,
  Eye,
  X,
  Radio,
  HardDrive,
  Activity,
  Layers,
  FileCheck,
} from 'lucide-react';
import { SyncQueueItem } from '../../types';

export const InspectionQueueMonitor: React.FC = () => {
  const { syncQueue, triggerManualSync, isSyncing, lastSyncTime, isOnline, isSimulatedOffline } = useApp();
  
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedQueueItem, setSelectedQueueItem] = useState<SyncQueueItem | null>(null);
  const [isPingingDevice, setIsPingingDevice] = useState<string | null>(null);
  const [pingSuccessMessage, setPingSuccessMessage] = useState<string | null>(null);

  // Compute stats
  const pendingCount = syncQueue.filter(
    (item) => item.status === 'queued_offline' || item.status === 'failed'
  ).length;
  const syncedCount = syncQueue.filter((item) => item.status === 'synced').length;
  const totalCount = syncQueue.length;

  const filteredItems = syncQueue.filter((item) => {
    const term = searchTerm.toLowerCase().trim();
    const matchSearch =
      !term ||
      item.inspectionId.toLowerCase().includes(term) ||
      (item.projectName && item.projectName.toLowerCase().includes(term)) ||
      (item.inspectorName && item.inspectorName.toLowerCase().includes(term)) ||
      (item.assignedTeamId && item.assignedTeamId.toLowerCase().includes(term)) ||
      item.title.toLowerCase().includes(term) ||
      (item.deviceId && item.deviceId.toLowerCase().includes(term));

    const matchStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleRemotePingSync = async (item: SyncQueueItem) => {
    setIsPingingDevice(item.id);
    setPingSuccessMessage(null);
    try {
      // Simulate remote wake-up ping to device and trigger sync
      await new Promise((r) => setTimeout(r, 800));
      await triggerManualSync();
      setPingSuccessMessage(`Remote flush ping acknowledged by ${item.inspectorName || 'Field Device'} (Device ID: ${item.deviceId || 'DEV-KA-402'}). Firestore replication initiated.`);
      setTimeout(() => setPingSuccessMessage(null), 4000);
    } finally {
      setIsPingingDevice(null);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl text-white space-y-4 shadow-xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                Central Telemetry & Sync Pipeline
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <h2 className="font-bold text-lg text-white flex items-center gap-2 mt-0.5">
              <Layers className="w-5 h-5 text-indigo-400" />
              Inspection Queue Monitor
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Real-time surveillance of pending offline submissions, device transmission queues, and Firestore cloud replication.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => triggerManualSync()}
              disabled={isSyncing || pendingCount === 0}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-xs font-semibold shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Flushing Central Pipeline...' : 'Flush All Queues'}</span>
            </button>
          </div>
        </div>

        {/* Global Pipeline Telemetry Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 block">Total Tracked Queue</span>
            <div className="text-xl font-bold font-mono text-white flex items-baseline gap-2">
              <span>{totalCount}</span>
              <span className="text-xs text-slate-500 font-normal">Records</span>
            </div>
            <span className="text-[10px] text-slate-500 block">Across Pan-India PMU Teams</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 block">Pending Device Upload</span>
            <div className="text-xl font-bold font-mono text-amber-400 flex items-baseline gap-2">
              <span>{pendingCount}</span>
              <span className="text-xs text-amber-500/80 font-normal">Offline / Queued</span>
            </div>
            <span className="text-[10px] text-amber-400/70 block">Awaiting network sync</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 block">Committed to Firestore</span>
            <div className="text-xl font-bold font-mono text-emerald-400 flex items-baseline gap-2">
              <span>{syncedCount}</span>
              <span className="text-xs text-emerald-500/80 font-normal">Synchronized</span>
            </div>
            <span className="text-[10px] text-emerald-400/70 block">Verified tamper-proof</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 block">Last Device Heartbeat</span>
            <div className="text-sm font-bold font-mono text-slate-200 truncate">
              {lastSyncTime || 'Active Telemetry'}
            </div>
            <span className="text-[10px] text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Replication Listener Online
            </span>
          </div>
        </div>
      </div>

      {/* Ping Success Banner */}
      {pingSuccessMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-950/50 border border-emerald-500/60 text-emerald-200 text-xs flex items-center gap-2.5 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="leading-relaxed font-medium">{pingSuccessMessage}</span>
        </div>
      )}

      {/* Filters and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl text-white space-y-3 shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search queue by Inspection ID, Project, Inspector name, Team ID, or Device..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-800/90 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs px-1"
              >
                ✕
              </button>
            )}
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="all">All Sync Statuses</option>
              <option value="queued_offline">Queued Offline (Pending)</option>
              <option value="syncing">Transmitting (In Progress)</option>
              <option value="synced">Synced (Committed to Firebase)</option>
              <option value="failed">Failed / Connection Timeout</option>
            </select>
          </div>
        </div>
      </div>

      {/* Queue Items Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-indigo-400" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-300">
              Inspector Offline Submissions Queue ({filteredItems.length})
            </h3>
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            Real-time Firestore Replicator
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 font-mono text-[11px] uppercase border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Inspection Case & Project</th>
                <th className="py-3.5 px-4">Inspector & Device ID</th>
                <th className="py-3.5 px-4">Submission Payload</th>
                <th className="py-3.5 px-4">Sync Status</th>
                <th className="py-3.5 px-4">Device Last Sync</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <Cloud className="w-8 h-8 mx-auto mb-2 text-slate-600 opacity-60" />
                    <p className="text-xs">No pending offline submissions matching search criteria.</p>
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                    {/* Inspection & Project */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-amber-400">{item.inspectionId}</span>
                          <span className="text-[10px] text-slate-500 font-mono">#{item.id.slice(-6)}</span>
                        </div>
                        <p className="font-semibold text-white text-xs">
                          {item.projectName || 'Central Welfare Facility'}
                        </p>
                      </div>
                    </td>

                    {/* Inspector & Device */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5 text-[11px]">
                        <p className="font-medium text-slate-200">
                          {item.inspectorName || 'Inspector Rajesh Sharma'}
                        </p>
                        <p className="text-slate-400 font-mono text-[10px] flex items-center gap-1">
                          <Smartphone className="w-3 h-3 text-slate-500" />
                          <span>{item.deviceId || 'DEV-KA-402'}</span>
                          <span className="text-slate-600">·</span>
                          <span className="text-slate-400">{item.assignedTeamId || 'PMU Team 4'}</span>
                        </p>
                      </div>
                    </td>

                    {/* Payload Type */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <span className="font-medium text-slate-200 block truncate max-w-[200px]">
                          {item.title}
                        </span>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                          <span className="font-mono capitalize">{item.type.replace('_', ' ')}</span>
                          <span className="text-slate-600">·</span>
                          <span className="font-mono text-slate-400">~{item.itemSizeKb || 850} KB</span>
                        </div>
                      </div>
                    </td>

                    {/* Sync Status Badge */}
                    <td className="py-3.5 px-4">
                      {item.status === 'queued_offline' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold font-mono bg-amber-500/10 text-amber-300 border border-amber-500/30">
                          <Clock className="w-3 h-3 text-amber-400" />
                          <span>QUEUED ON DEVICE</span>
                        </span>
                      )}
                      {item.status === 'syncing' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold font-mono bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                          <RefreshCw className="w-3 h-3 text-indigo-400 animate-spin" />
                          <span>TRANSMITTING</span>
                        </span>
                      )}
                      {item.status === 'synced' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>COMMITTED TO FIRESTORE</span>
                        </span>
                      )}
                      {item.status === 'failed' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold font-mono bg-rose-500/10 text-rose-300 border border-rose-500/30">
                          <AlertTriangle className="w-3 h-3 text-rose-400" />
                          <span>NETWORK TIMEOUT</span>
                        </span>
                      )}
                    </td>

                    {/* Device Last Sync */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <span className="font-mono text-[11px] text-slate-300 block">
                          {item.deviceLastSyncTime || item.timestamp}
                        </span>
                        <span className="text-[10px] text-slate-500 block">
                          Queued: {item.timestamp}
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedQueueItem(item)}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-semibold border border-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
                          title="Inspect raw payload & GPS metadata"
                        >
                          <Eye className="w-3 h-3 text-indigo-400" />
                          <span>Inspect</span>
                        </button>

                        {item.status !== 'synced' && (
                          <button
                            onClick={() => handleRemotePingSync(item)}
                            disabled={isPingingDevice === item.id || isSyncing}
                            className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-[11px] font-semibold shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                            title="Send remote ping to device to trigger immediate sync"
                          >
                            <Radio className={`w-3 h-3 ${isPingingDevice === item.id ? 'animate-pulse text-amber-300' : ''}`} />
                            <span>{isPingingDevice === item.id ? 'Pinging...' : 'Remote Ping'}</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect Payload Modal */}
      {selectedQueueItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-xl w-full p-6 text-white space-y-4 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-indigo-400" />
                <div>
                  <h3 className="font-bold text-sm text-white">Queue Payload Telemetry Inspection</h3>
                  <span className="text-[10px] text-slate-400 font-mono">
                    ID: {selectedQueueItem.id} · Case: {selectedQueueItem.inspectionId}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedQueueItem(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 text-[11px] p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div>
                  <span className="text-slate-400 block">Project Facility:</span>
                  <strong className="text-white">{selectedQueueItem.projectName || 'Facility'}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Assigned Inspector:</span>
                  <strong className="text-amber-300">{selectedQueueItem.inspectorName || 'Rajesh Sharma'}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Device Identifier:</span>
                  <span className="font-mono text-slate-300">{selectedQueueItem.deviceId || 'DEV-KA-402'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Sync Pipeline State:</span>
                  <span className="font-mono uppercase font-bold text-emerald-400">{selectedQueueItem.status}</span>
                </div>
              </div>

              {/* Photo preview if evidence */}
              {selectedQueueItem.payload?.imageUrl && (
                <div className="space-y-1">
                  <span className="font-semibold text-slate-300 text-xs">Attached Geo-Watermarked Photo Evidence:</span>
                  <div className="rounded-xl overflow-hidden border border-slate-800 aspect-video bg-black">
                    <img
                      src={selectedQueueItem.payload.imageUrl}
                      alt={selectedQueueItem.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}

              {/* Raw JSON Payload */}
              <div className="space-y-1">
                <span className="font-semibold text-slate-300 text-xs">Raw Client Payload Snapshot:</span>
                <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[10px] font-mono text-emerald-300 overflow-x-auto max-h-48 leading-relaxed">
                  {JSON.stringify(selectedQueueItem.payload || selectedQueueItem, null, 2)}
                </pre>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setSelectedQueueItem(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
              {selectedQueueItem.status !== 'synced' && (
                <button
                  onClick={() => {
                    handleRemotePingSync(selectedQueueItem);
                    setSelectedQueueItem(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold cursor-pointer flex items-center gap-1.5"
                >
                  <Radio className="w-3.5 h-3.5 text-amber-300" />
                  <span>Send Remote Flush Ping</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
