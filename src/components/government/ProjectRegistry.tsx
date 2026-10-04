import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Filter,
  Building2,
  MapPin,
  Video,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  ShieldAlert,
  Shuffle,
  Users,
} from 'lucide-react';
import { Project } from '../../types';
import { ProjectDetailModal } from './ProjectDetailModal';

export const ProjectRegistry: React.FC = () => {
  const { projects, runRandomSurpriseAssignment, setRole } = useApp();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedScheme, setSelectedScheme] = useState<string>('all');
  const [selectedState, setSelectedState] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedProjectForDetail, setSelectedProjectForDetail] = useState<Project | null>(null);

  const filteredProjects = projects.filter((p) => {
    const term = searchTerm.toLowerCase().trim();
    
    // Status text mapping for natural queries (e.g. "normal", "flagged", "under inspection", "action pending")
    const statusText = p.status.replace(/_/g, ' ').toLowerCase();

    const matchSearch =
      !term ||
      // 1. By Name
      p.name.toLowerCase().includes(term) ||
      p.ngoName.toLowerCase().includes(term) ||
      p.regNumber.toLowerCase().includes(term) ||
      // 2. By Status
      p.status.toLowerCase().includes(term) ||
      statusText.includes(term) ||
      // 3. By Location (District, State, Address)
      p.district.toLowerCase().includes(term) ||
      p.state.toLowerCase().includes(term) ||
      (p.address && p.address.toLowerCase().includes(term));

    const matchScheme = selectedScheme === 'all' || p.scheme === selectedScheme;
    const matchState = selectedState === 'all' || p.state === selectedState;
    const matchStatus = selectedStatus === 'all' || p.status === selectedStatus;
    return matchSearch && matchScheme && matchState && matchStatus;
  });

  const handleDispatchProject = (proj: Project) => {
    runRandomSurpriseAssignment({ scheme: proj.scheme, state: proj.state });
    setRole('inspector');
  };

  return (
    <div className="space-y-6">
      {/* Header and Search Filters */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl text-white space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-bold text-lg text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-indigo-400" />
              Central Project & NGO Registry
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              1,248 Pan-India Welfare Institutes & De-Addiction Centres registered under DoSJE schemes
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-xl bg-slate-800 text-xs text-indigo-300 border border-slate-700 font-mono font-medium">
              Showing {filteredProjects.length} of {projects.length} Facilities
            </span>
          </div>
        </div>

        {/* Search Input Field & Filter Bars */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Search bar filtering by Name, Status, or Location */}
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Name, Status (e.g. Flagged), or Location (District/State)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-800/90 border border-slate-700 rounded-xl pl-9 pr-8 py-2.5 text-xs text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs px-1"
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="all">All Operational Statuses</option>
              <option value="normal">Normal (Compliant)</option>
              <option value="under_inspection">Under Active Inspection</option>
              <option value="flagged">Flagged (High Risk)</option>
              <option value="action_pending">Action Pending (Show Cause)</option>
            </select>
          </div>

          <div>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="all">All States & UTs</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
              <option value="Madhya Pradesh">Madhya Pradesh</option>
            </select>
          </div>
        </div>

        {/* Scheme Quick Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-0.5 text-xs text-slate-400">
          <span className="text-[11px] font-semibold text-slate-400 shrink-0 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3 text-indigo-400" /> Scheme:
          </span>
          {[
            { id: 'all', label: 'All Schemes' },
            { id: 'Deendayal Disabled Rehabilitation Scheme (DDRS)', label: 'DDRS' },
            { id: 'Atal Vayo Abhyuday Yojana (AVYAY)', label: 'AVYAY' },
            { id: 'National Action Plan for Drug Demand Reduction (NAPDDR)', label: 'NAPDDR' },
            { id: 'PM-DAKSH (Pradhan Mantri Dakshta Aur Kushalta Sampann Hitgrahi)', label: 'PM-DAKSH' },
          ].map((sch) => (
            <button
              key={sch.id}
              onClick={() => setSelectedScheme(sch.id)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all shrink-0 cursor-pointer ${
                selectedScheme === sch.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              {sch.label}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 font-mono text-[11px] uppercase border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Project & NGO Details</th>
                <th className="py-3.5 px-4">Scheme & Location</th>
                <th className="py-3.5 px-4">Beneficiaries</th>
                <th className="py-3.5 px-4">CCTV Streams</th>
                <th className="py-3.5 px-4">Risk Matrix</th>
                <th className="py-3.5 px-4 text-right">Surprise Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredProjects.map((p) => (
                <tr key={p.id} className="hover:bg-slate-800/50 transition-colors">
                  <td
                    onClick={() => setSelectedProjectForDetail(p)}
                    className="py-4 px-4 space-y-1 cursor-pointer group"
                    title="Click to view full details and status"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-xs group-hover:text-indigo-400 transition-colors">
                        {p.name}
                      </span>
                      <span className="font-mono text-[10px] text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded">
                        {p.regNumber}
                      </span>
                      <span className="text-[10px] text-indigo-400 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                        View Details →
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">{p.ngoName}</p>
                    <p className="text-[10px] text-slate-500">Incharge: {p.incharge.name} ({p.incharge.phone})</p>
                  </td>

                  <td
                    onClick={() => setSelectedProjectForDetail(p)}
                    className="py-4 px-4 space-y-1 cursor-pointer"
                  >
                    <span className="font-medium text-slate-200 block truncate max-w-[220px]">{p.scheme}</span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                      {p.district}, {p.state}
                    </span>
                  </td>

                  <td
                    onClick={() => setSelectedProjectForDetail(p)}
                    className="py-4 px-4 space-y-1 cursor-pointer"
                  >
                    <div className="flex items-center gap-1.5 font-bold font-mono text-white">
                      <Users className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{p.latestAttendance} / {p.beneficiaryCount}</span>
                    </div>
                    {p.attendanceAnomaly ? (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-rose-500/20 text-rose-400 border border-rose-500/30">
                        <AlertTriangle className="w-2.5 h-2.5" /> Anomaly (-62%)
                      </span>
                    ) : (
                      <span className="text-[10px] text-emerald-400 font-semibold">Normal Baseline</span>
                    )}
                  </td>

                  <td
                    onClick={() => setSelectedProjectForDetail(p)}
                    className="py-4 px-4 cursor-pointer"
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span className="font-semibold text-white">{p.cctvFeeds.length} Feeds</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {p.cctvFeeds.filter((f) => f.status === 'online').length}/{p.cctvFeeds.length} Active
                    </span>
                  </td>

                  <td
                    onClick={() => setSelectedProjectForDetail(p)}
                    className="py-4 px-4 cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            p.riskScore > 70 ? 'bg-rose-500' : p.riskScore > 40 ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${p.riskScore}%` }}
                        />
                      </div>
                      <span
                        className={`font-mono font-bold text-xs ${
                          p.riskScore > 70 ? 'text-rose-400' : p.riskScore > 40 ? 'text-amber-400' : 'text-emerald-400'
                        }`}
                      >
                        {p.riskScore}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400">Last: {p.lastInspectedDate}</span>
                  </td>

                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedProjectForDetail(p)}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs border border-slate-700 transition-all cursor-pointer"
                      >
                        Details & Status
                      </button>
                      <button
                        onClick={() => handleDispatchProject(p)}
                        className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-sm transition-all inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Shuffle className="w-3 h-3" />
                        <span>Dispatch</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Project Details & Status Modal */}
      <ProjectDetailModal
        project={selectedProjectForDetail}
        onClose={() => setSelectedProjectForDetail(null)}
      />
    </div>
  );
};
