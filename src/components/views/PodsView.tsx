import React, { useState } from 'react';
import {
  Boxes,
  Plus,
  Edit2,
  Trash2,
  X,
  Users,
  Crown,
  Target,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { useRoster } from '../../context/RosterContext';
import { Pod } from '../../types';

/* ─── Main Component ─────────────────────────────────────────────────────── */
export const PodsView: React.FC = () => {
  const { pods, employees, addPod, updatePod, deletePod } = useRoster();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPod, setEditingPod] = useState<Pod | null>(null);
  const [expandedPodId, setExpandedPodId] = useState<string | null>(null);

  const [formData, setFormData] = useState<{
    code: string;
    name: string;
    description: string;
    leadEmployeeId: string;
    color: string;
    targetHeadcount: number;
  }>({
    code: '',
    name: '',
    description: '',
    leadEmployeeId: '',
    color: '#6366f1',
    targetHeadcount: 8,
  });

  const openCreateModal = () => {
    setEditingPod(null);
    setFormData({
      code: `POD-${String.fromCharCode(65 + pods.length)}`,
      name: '',
      description: '',
      leadEmployeeId: employees[0]?.id || '',
      color: '#6366f1',
      targetHeadcount: 8,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (pod: Pod) => {
    setEditingPod(pod);
    setFormData({
      code: pod.code,
      name: pod.name,
      description: pod.description,
      leadEmployeeId: pod.leadEmployeeId,
      color: pod.color,
      targetHeadcount: pod.targetHeadcount,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;
    if (editingPod) {
      updatePod(editingPod.id, formData);
    } else {
      addPod(formData);
    }
    setIsModalOpen(false);
  };

  const totalEmployees = employees.length;
  const totalCapacity = pods.reduce((sum, p) => sum + p.targetHeadcount, 0);
  const overallFill = totalCapacity > 0 ? Math.min(Math.round((totalEmployees / totalCapacity) * 100), 100) : 0;

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Boxes className="w-5 h-5 text-indigo-600" />
            <span>Pod Management &amp; Structure</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Organize your workforce into agile operational pods with dedicated pod leads and staffing targets.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm flex items-center gap-2 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Pod</span>
        </button>
      </div>

      {/* ── Summary Stats Row ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
            <Boxes className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Total Pods</div>
            <div className="text-2xl font-black text-slate-900">{pods.length}</div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
            <Users className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Total Staff</div>
            <div className="text-2xl font-black text-slate-900">
              {totalEmployees}{' '}
              <span className="text-sm font-normal text-slate-400">/ {totalCapacity} capacity</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Overall Fill Rate</div>
            <span
              className={`text-sm font-black ${
                overallFill >= 90 ? 'text-emerald-600' : overallFill >= 70 ? 'text-amber-600' : 'text-rose-600'
              }`}
            >
              {overallFill}%
            </span>
          </div>
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${overallFill}%`,
                backgroundColor:
                  overallFill >= 90 ? '#10b981' : overallFill >= 70 ? '#f59e0b' : '#ef4444',
              }}
            />
          </div>
          <div className="mt-1 text-[10px] text-slate-400">
            {overallFill >= 90 ? 'Fully staffed' : overallFill >= 70 ? 'Nearing target' : 'Below target'}
          </div>
        </div>
      </div>

      {/* ── Pod Cards Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {pods.map((pod) => {
          const allPodEmployees = employees.filter((e) => e.podId === pod.id);
          const activePodEmployees = allPodEmployees.filter((e) => e.status === 'ACTIVE');
          const lead = employees.find((e) => e.id === pod.leadEmployeeId);
          const target = pod.targetHeadcount || 1;
          const rawPct = Math.round((allPodEmployees.length / target) * 100);
          const displayPct = Math.min(rawPct, 100); // always cap at 100 for bar display
          const isExpanded = expandedPodId === pod.id;

          const healthColor =
            displayPct >= 90 ? '#10b981' : displayPct >= 70 ? '#f59e0b' : '#ef4444';
          const healthLabel =
            displayPct >= 90 ? 'Fully Staffed' : displayPct >= 70 ? 'Near Target' : 'Under Staffed';
          const healthBg =
            displayPct >= 90
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : displayPct >= 70
              ? 'bg-amber-50 text-amber-700 border-amber-200'
              : 'bg-rose-50 text-rose-700 border-rose-200';

          const openSlots = Math.max(target - allPodEmployees.length, 0);

          return (
            <div
              key={pod.id}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all"
            >
              {/* Card Header */}
              <div className="p-5 border-b border-slate-100">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center font-black text-indigo-700 text-sm flex-shrink-0">
                      {pod.code.replace('POD-', '')}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm leading-tight">{pod.name}</h3>
                      <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2 max-w-xs">
                        {pod.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => openEditModal(pod)}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="Edit Pod"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete pod "${pod.name}"?`)) deletePod(pod.id);
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete Pod"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Pod Lead Row */}
              <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {lead ? lead.fullName.charAt(0) : '?'}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800 flex items-center gap-1">
                      <Crown className="w-3 h-3 text-amber-500" />
                      {lead ? lead.fullName : 'No Lead Assigned'}
                    </div>
                    <div className="text-[10px] text-slate-500">{lead?.role || 'Unassigned'}</div>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${healthBg}`}>
                  {healthLabel}
                </span>
              </div>

              {/* Staffing Progress */}
              <div className="px-5 pt-4 pb-3 space-y-3">
                {/* Header row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-xs font-semibold text-slate-600">Staffing Progress</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">
                      {allPodEmployees.length} / {target} staff
                    </span>
                    <span className="text-sm font-black" style={{ color: healthColor }}>
                      {displayPct}%
                    </span>
                  </div>
                </div>

                {/* Progress Bar — always 0-100% */}
                <div className="w-full h-5 bg-slate-100 rounded-full overflow-hidden relative">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${displayPct}%`,
                      backgroundColor: healthColor,
                    }}
                  />
                  {displayPct > 15 && (
                    <span className="absolute inset-0 flex items-center pl-3 text-[10px] font-black text-white select-none">
                      {displayPct}%
                    </span>
                  )}
                </div>

                {/* 0 — 100 scale labels */}
                <div className="flex items-center justify-between text-[9px] text-slate-400 -mt-1">
                  <span>0%</span>
                  <span>25%</span>
                  <span>50%</span>
                  <span>75%</span>
                  <span>100%</span>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-2 pt-1">
                  <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-2 text-center">
                    <div className="text-base font-black text-emerald-700">{activePodEmployees.length}</div>
                    <div className="text-[9px] text-emerald-600 font-semibold">Active</div>
                  </div>
                  <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-2 text-center">
                    <div className="text-base font-black text-indigo-700">{target}</div>
                    <div className="text-[9px] text-indigo-600 font-semibold">Target</div>
                  </div>
                  <div
                    className={`${
                      openSlots > 0
                        ? 'bg-amber-50 border-amber-100'
                        : 'bg-slate-50 border-slate-100'
                    } border rounded-lg p-2 text-center`}
                  >
                    <div
                      className={`text-base font-black ${
                        openSlots > 0 ? 'text-amber-700' : 'text-slate-400'
                      }`}
                    >
                      {openSlots > 0 ? openSlots : <CheckCircle2 className="w-5 h-5 mx-auto text-emerald-500" />}
                    </div>
                    <div
                      className={`text-[9px] font-semibold ${
                        openSlots > 0 ? 'text-amber-600' : 'text-slate-400'
                      }`}
                    >
                      {openSlots > 0 ? 'Open Slots' : 'Full'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Members List (Collapsible) */}
              <div className="px-5 pb-4">
                <button
                  onClick={() => setExpandedPodId(isExpanded ? null : pod.id)}
                  className="w-full flex items-center justify-between py-2 border-t border-slate-100 mt-1 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    <span>Team Members ({allPodEmployees.length})</span>
                  </div>
                  <span className="text-[10px]">{isExpanded ? '▲ Hide' : '▼ Show'}</span>
                </button>

                {isExpanded && (
                  <div className="mt-2 flex flex-wrap gap-1.5 max-h-44 overflow-y-auto pr-1">
                    {allPodEmployees.map((member) => {
                      const isLead = member.id === pod.leadEmployeeId;
                      return (
                        <div
                          key={member.id}
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs border ${
                            isLead
                              ? 'bg-amber-50 border-amber-200 text-amber-800'
                              : member.status === 'ACTIVE'
                              ? 'bg-slate-50 border-slate-200 text-slate-700'
                              : 'bg-rose-50 border-rose-200 text-rose-600'
                          }`}
                        >
                          {isLead ? (
                            <Crown className="w-2.5 h-2.5 text-amber-500 flex-shrink-0" />
                          ) : (
                            <span
                              className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                                member.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-rose-400'
                              }`}
                            />
                          )}
                          <span className="font-medium leading-tight">{member.fullName}</span>
                          <span className="text-[9px] opacity-60 font-mono leading-tight">
                            {member.role === 'Pod Lead' ? 'Lead' : member.role.split(' ')[0]}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Footer status bar */}
              <div className="px-5 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-medium">
                <span>Pod ID: {pod.id.toUpperCase()}</span>
                <span className="flex items-center gap-1">
                  {displayPct >= 90 ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                  )}
                  {displayPct >= 90 ? 'Target Met' : `${openSlots} slots remaining`}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Create / Edit Modal (no color picker) ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200">
            <div className="p-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <Boxes className="w-4 h-4 text-indigo-600" />
                  {editingPod ? 'Edit Pod' : 'Create Operational Pod'}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
                {/* Pod Name */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Pod Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pod Alpha (FinTech Core)"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                </div>

                {/* Code + Headcount */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Pod Code *</label>
                    <input
                      type="text"
                      required
                      value={formData.code}
                      onChange={(e) =>
                        setFormData({ ...formData, code: e.target.value.toUpperCase() })
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg uppercase font-mono focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Target Headcount *</label>
                    <input
                      type="number"
                      min="1"
                      max="50"
                      required
                      value={formData.targetHeadcount}
                      onChange={(e) =>
                        setFormData({ ...formData, targetHeadcount: Number(e.target.value) })
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                  </div>
                </div>

                {/* Pod Lead */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Designated Pod Lead</label>
                  <select
                    value={formData.leadEmployeeId}
                    onChange={(e) =>
                      setFormData({ ...formData, leadEmployeeId: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  >
                    <option value="">— Select Lead —</option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.fullName} ({emp.role})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Description / Mandate
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. High-volume e-commerce orders and live chat rapid response."
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
                  />
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 font-medium hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold shadow-sm transition-colors"
                  >
                    {editingPod ? 'Update Pod' : 'Create Pod'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
