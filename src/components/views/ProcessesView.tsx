import React, { useState } from 'react';
import {
  Layers,
  Plus,
  Clock,
  Briefcase,
  Users,
  Edit2,
  Trash2,
  X,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { useRoster } from '../../context/RosterContext';
import { Process, ProcessType } from '../../types';

export const ProcessesView: React.FC = () => {
  const { processes, brands, employees, addProcess, updateProcess, deleteProcess } = useRoster();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProcess, setEditingProcess] = useState<Process | null>(null);

  const [formData, setFormData] = useState<{
    brandId: string;
    name: string;
    type: ProcessType;
    slaResponseTarget: string;
    minStaffPerShift: {
      MORNING: number;
      EVENING: number;
      NIGHT: number;
      GENERAL: number;
    };
    workingDaysSchedule: {
      mon: boolean;
      tue: boolean;
      wed: boolean;
      thu: boolean;
      fri: boolean;
      sat: boolean;
      sun: boolean;
    };
    specialRequirements: string;
  }>({
    brandId: brands[0]?.id || '',
    name: 'Customer Support (CS)',
    type: 'Customer Support (CS)',
    slaResponseTarget: '< 45 seconds',
    minStaffPerShift: {
      MORNING: 2,
      EVENING: 2,
      NIGHT: 1,
      GENERAL: 1,
    },
    workingDaysSchedule: {
      mon: true,
      tue: true,
      wed: true,
      thu: true,
      fri: true,
      sat: true,
      sun: true,
    },
    specialRequirements: '',
  });

  const openCreateModal = () => {
    setEditingProcess(null);
    setFormData({
      brandId: brands[0]?.id || '',
      name: '',
      type: 'Customer Support (CS)',
      slaResponseTarget: '< 60 seconds',
      minStaffPerShift: {
        MORNING: 2,
        EVENING: 2,
        NIGHT: 1,
        GENERAL: 1,
      },
      workingDaysSchedule: {
        mon: true,
        tue: true,
        wed: true,
        thu: true,
        fri: true,
        sat: true,
        sun: true,
      },
      specialRequirements: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (proc: Process) => {
    setEditingProcess(proc);
    setFormData({
      brandId: proc.brandId,
      name: proc.name,
      type: proc.type,
      slaResponseTarget: proc.slaResponseTarget,
      minStaffPerShift: proc.minStaffPerShift,
      workingDaysSchedule: proc.workingDaysSchedule || {
        mon: true,
        tue: true,
        wed: true,
        thu: true,
        fri: true,
        sat: true,
        sun: true,
      },
      specialRequirements: proc.specialRequirements || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    if (editingProcess) {
      updateProcess(editingProcess.id, formData);
    } else {
      addProcess(formData);
    }
    setIsModalOpen(false);
  };

  const processExamples = [
    'Customer Support (CS)',
    'Abandoned Cart Conversion (ACC)',
    'Non-Delivery Report (NDR)',
    'Retention & Escalations',
    'VIP Instant Live Chat',
    'Payment Risk & Chargebacks',
  ];

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600" />
            <span>Process Management</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure CS, ACC, NDR, Retention and custom workflows with SLA response targets, shift minimums, and operating schedules.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm flex items-center gap-2 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Process</span>
        </button>
      </div>

      {/* Grid of Processes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {processes.map((proc) => {
          const brand = brands.find((b) => b.id === proc.brandId);
          const certifiedCount = employees.filter((e) =>
            e.certifiedProcessIds.includes(proc.id)
          ).length;

          return (
            <div
              key={proc.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{proc.name}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                        {proc.type}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-2">
                      <span>Brand:</span>
                      <span className="font-semibold text-slate-800">{brand?.name || 'Unassigned'}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(proc)}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete process ${proc.name}?`)) deleteProcess(proc.id);
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* SLA and Certified Staff */}
                <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 block">SLA Response Target</span>
                    <span className="font-bold text-indigo-700">{proc.slaResponseTarget}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 block">Certified Workforce</span>
                    <span className="font-bold text-slate-800">{certifiedCount} Agents</span>
                  </div>
                </div>

                {/* Shift Staffing Requirements Matrix */}
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">
                    Mandatory Shift Headcounts
                  </span>
                  <div className="grid grid-cols-4 gap-1.5 text-center text-xs">
                    <div className="bg-sky-50 border border-sky-100 p-1.5 rounded">
                      <span className="text-[10px] text-sky-600 block font-medium">MORN</span>
                      <span className="font-bold text-sky-900">{proc.minStaffPerShift.MORNING}</span>
                    </div>
                    <div className="bg-amber-50 border border-amber-100 p-1.5 rounded">
                      <span className="text-[10px] text-amber-600 block font-medium">EVE</span>
                      <span className="font-bold text-amber-900">{proc.minStaffPerShift.EVENING}</span>
                    </div>
                    <div className="bg-purple-50 border border-purple-100 p-1.5 rounded">
                      <span className="text-[10px] text-purple-600 block font-medium">NGHT</span>
                      <span className="font-bold text-purple-900">{proc.minStaffPerShift.NIGHT}</span>
                    </div>
                    <div className="bg-emerald-50 border border-emerald-100 p-1.5 rounded">
                      <span className="text-[10px] text-emerald-600 block font-medium">GEN</span>
                      <span className="font-bold text-emerald-900">{proc.minStaffPerShift.GENERAL}</span>
                    </div>
                  </div>
                </div>

                {proc.specialRequirements && (
                  <div className="mt-2.5 text-[11px] text-amber-800 bg-amber-50 p-2 rounded border border-amber-200">
                    <strong>Rule:</strong> {proc.specialRequirements}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Process Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-800">
                {editingProcess ? 'Edit Process' : 'Add New Process'}
              </h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Process Name</label>
                <input
                  type="text"
                  required
                  list="process-examples"
                  placeholder="e.g. Abandoned Cart Conversion (ACC)"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
                <datalist id="process-examples">
                  {processExamples.map((ex) => (
                    <option key={ex} value={ex} />
                  ))}
                </datalist>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Brand</label>
                  <select
                    value={formData.brandId}
                    onChange={(e) => setFormData({ ...formData, brandId: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-white"
                  >
                    {brands.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Process Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as ProcessType })}
                    className="w-full px-3 py-2 border rounded-lg bg-white"
                  >
                    <option value="Customer Support (CS)">Customer Support (CS)</option>
                    <option value="Non-Delivery Report (NDR)">Non-Delivery Report (NDR)</option>
                    <option value="Abandoned Cart (ACC)">Abandoned Cart (ACC)</option>
                    <option value="Customer Retention">Customer Retention</option>
                    <option value="Backoffice & QA">Backoffice & QA</option>
                    <option value="Technical Tier-2">Technical Tier-2</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Response SLA</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. < 45 seconds"
                  value={formData.slaResponseTarget}
                  onChange={(e) => setFormData({ ...formData, slaResponseTarget: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Mandatory Headcount Per Shift
                </label>
                <div className="grid grid-cols-4 gap-2">
                  <div>
                    <span className="text-[10px] text-slate-500 block mb-0.5">Morning</span>
                    <input
                      type="number"
                      min="0"
                      value={formData.minStaffPerShift.MORNING}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          minStaffPerShift: {
                            ...formData.minStaffPerShift,
                            MORNING: Number(e.target.value),
                          },
                        })
                      }
                      className="w-full px-2 py-1.5 border rounded-lg text-center font-bold"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block mb-0.5">Evening</span>
                    <input
                      type="number"
                      min="0"
                      value={formData.minStaffPerShift.EVENING}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          minStaffPerShift: {
                            ...formData.minStaffPerShift,
                            EVENING: Number(e.target.value),
                          },
                        })
                      }
                      className="w-full px-2 py-1.5 border rounded-lg text-center font-bold"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block mb-0.5">Night</span>
                    <input
                      type="number"
                      min="0"
                      value={formData.minStaffPerShift.NIGHT}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          minStaffPerShift: {
                            ...formData.minStaffPerShift,
                            NIGHT: Number(e.target.value),
                          },
                        })
                      }
                      className="w-full px-2 py-1.5 border rounded-lg text-center font-bold"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block mb-0.5">General</span>
                    <input
                      type="number"
                      min="0"
                      value={formData.minStaffPerShift.GENERAL}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          minStaffPerShift: {
                            ...formData.minStaffPerShift,
                            GENERAL: Number(e.target.value),
                          },
                        })
                      }
                      className="w-full px-2 py-1.5 border rounded-lg text-center font-bold"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Special Operational Rules</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Requires CRM certification or specific language fluency"
                  value={formData.specialRequirements}
                  onChange={(e) => setFormData({ ...formData, specialRequirements: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded-lg text-slate-600 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold"
                >
                  {editingProcess ? 'Update Process' : 'Save Process'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
