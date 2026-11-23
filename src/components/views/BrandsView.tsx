import React, { useState } from 'react';
import {
  Briefcase,
  Plus,
  Clock,
  ShieldCheck,
  Users,
  Edit2,
  Trash2,
  X,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useRoster } from '../../context/RosterContext';
import { Brand, Process, ProcessType, ResourceModel, OperatingScheduleType } from '../../types';

export const BrandsView: React.FC = () => {
  const { brands, processes, employees, addBrand, updateBrand, deleteBrand, addProcess, deleteProcess } = useRoster();
  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);
  const [isProcessModalOpen, setIsProcessModalOpen] = useState(false);
  const [selectedBrandForProcess, setSelectedBrandForProcess] = useState<Brand | null>(null);

  // New Brand Form
  const [brandForm, setBrandForm] = useState<{
    code: string;
    name: string;
    clientTier: 'Enterprise' | 'Strategic' | 'Standard' | 'D2C Brand';
    resourceModel: ResourceModel;
    operatingScheduleType: OperatingScheduleType;
    status: 'ACTIVE' | 'INACTIVE';
    color: string;
    operatingHours: string;
    weekendCoverageRequired: boolean;
    minDailyHeadcount: number;
    dedicatedEmployeeId?: string;
  }>({
    code: '',
    name: '',
    clientTier: 'D2C Brand',
    resourceModel: 'SINGLE_RESOURCE',
    operatingScheduleType: '365_DAYS',
    status: 'ACTIVE',
    color: '#0284c7',
    operatingHours: '24/7 All 365 Days',
    weekendCoverageRequired: true,
    minDailyHeadcount: 1,
    dedicatedEmployeeId: '',
  });

  // New Process Form
  const [processForm, setProcessForm] = useState<{
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
    specialRequirements: string;
  }>({
    brandId: '',
    name: '',
    type: 'Customer Support (CS)',
    slaResponseTarget: '< 45 seconds',
    minStaffPerShift: {
      MORNING: 1,
      EVENING: 0,
      NIGHT: 0,
      GENERAL: 0,
    },
    specialRequirements: '',
  });

  const handleBrandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandForm.name) return;
    addBrand(brandForm);
    setIsBrandModalOpen(false);
  };

  const handleProcessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!processForm.name || !processForm.brandId) return;
    addProcess(processForm);
    setIsProcessModalOpen(false);
  };

  const singleResourceBrands = brands.filter((b) => b.resourceModel === 'SINGLE_RESOURCE');
  const multiResourceBrands = brands.filter((b) => b.resourceModel === 'MULTI_RESOURCE');

  return (
    <div className="space-y-6">
      {/* Header Banner with 80-20 Rule Breakdown */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-indigo-600" />
              <span>D2C Brands Management ({brands.length} Brands)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Configured client working rules: 365 Days, Public Holidays OFF, Sundays + Holidays OFF, and 80-20 resource allocation.
            </p>
          </div>

          <button
            onClick={() => {
              setBrandForm({
                code: `BR-${Math.floor(10 + Math.random() * 90)}`,
                name: '',
                clientTier: 'D2C Brand',
                resourceModel: 'SINGLE_RESOURCE',
                operatingScheduleType: '365_DAYS',
                status: 'ACTIVE',
                color: '#3b82f6',
                operatingHours: '24/7 All 365 Days',
                weekendCoverageRequired: true,
                minDailyHeadcount: 1,
                dedicatedEmployeeId: employees[0]?.id || '',
              });
              setIsBrandModalOpen(true);
            }}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm flex items-center gap-2 transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Brand</span>
          </button>
        </div>

        {/* 80-20 Rule Telemetry Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-slate-100 text-xs">
          <div className="p-3 rounded-lg bg-indigo-50/70 border border-indigo-200/80 flex items-center justify-between">
            <div>
              <span className="font-bold text-indigo-900 block">80% Single-Resource Allocation</span>
              <span className="text-[11px] text-indigo-700">
                1 dedicated employee handles all processes for that brand.
              </span>
            </div>
            <span className="text-lg font-black text-indigo-700">
              {singleResourceBrands.length} Brands (80%)
            </span>
          </div>

          <div className="p-3 rounded-lg bg-emerald-50/70 border border-emerald-200/80 flex items-center justify-between">
            <div>
              <span className="font-bold text-emerald-900 block">20% Multi-Resource Allocation</span>
              <span className="text-[11px] text-emerald-700">
                2-3 cross-trained employees share or split processes.
              </span>
            </div>
            <span className="text-lg font-black text-emerald-700">
              {multiResourceBrands.length} Brands (20%)
            </span>
          </div>
        </div>
      </div>

      {/* Brands List with Nested Processes */}
      <div className="space-y-6">
        {brands.map((brand) => {
          const brandProcesses = processes.filter((p) => p.brandId === brand.id);
          const dedicatedEmp = employees.find((e) => e.id === brand.dedicatedEmployeeId);

          return (
            <div
              key={brand.id}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm"
            >
              {/* Brand Header */}
              <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-sm shadow-xs"
                    style={{ backgroundColor: brand.color }}
                  >
                    {brand.code}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900">{brand.name}</h3>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          brand.resourceModel === 'SINGLE_RESOURCE'
                            ? 'bg-indigo-100 text-indigo-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {brand.resourceModel === 'SINGLE_RESOURCE'
                          ? '1 Dedicated Agent (80%)'
                          : 'Multi-Agent (20%)'}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-200 text-slate-800">
                        {brand.operatingScheduleType === '365_DAYS'
                          ? '365 Days Operation'
                          : brand.operatingScheduleType === 'PUBLIC_HOLIDAYS_OFF'
                          ? 'Public Holidays OFF'
                          : 'Sundays + Holidays OFF'}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {brand.operatingHours}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        Min Daily Staff: <strong>{brand.minDailyHeadcount}</strong>
                      </span>
                      {dedicatedEmp && (
                        <span className="text-indigo-700 font-semibold bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                          Dedicated: {dedicatedEmp.fullName} ({dedicatedEmp.employeeCode})
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-auto">
                  <button
                    onClick={() => {
                      setSelectedBrandForProcess(brand);
                      setProcessForm({
                        brandId: brand.id,
                        name: '',
                        type: 'Customer Support (CS)',
                        slaResponseTarget: '< 45 seconds',
                        minStaffPerShift: { MORNING: 1, EVENING: 0, NIGHT: 0, GENERAL: 0 },
                        specialRequirements: '',
                      });
                      setIsProcessModalOpen(true);
                    }}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Add Process</span>
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Remove brand ${brand.name}?`)) deleteBrand(brand.id);
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Processes under this brand */}
              <div className="p-5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Configured Processes ({brandProcesses.length})
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {brandProcesses.map((proc) => (
                    <div
                      key={proc.id}
                      className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-indigo-300 transition-colors space-y-2 text-xs"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-bold text-slate-800">{proc.name}</div>
                          <span className="text-[10px] text-indigo-600 font-semibold">
                            SLA: {proc.slaResponseTarget}
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            if (confirm(`Delete process ${proc.name}?`)) deleteProcess(proc.id);
                          }}
                          className="text-slate-400 hover:text-rose-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-500">
                        <span>Staff Per Shift: </span>
                        <strong>{proc.minStaffPerShift.MORNING} Morn / {proc.minStaffPerShift.EVENING} Eve</strong>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Brand Modal */}
      {isBrandModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-800">Add D2C Brand</h3>
              <button onClick={() => setIsBrandModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleBrandSubmit} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Brand Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ZenFit Nutrition"
                  value={brandForm.name}
                  onChange={(e) => setBrandForm({ ...brandForm, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Brand Code</label>
                  <input
                    type="text"
                    required
                    value={brandForm.code}
                    onChange={(e) => setBrandForm({ ...brandForm, code: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Resource Model</label>
                  <select
                    value={brandForm.resourceModel}
                    onChange={(e) =>
                      setBrandForm({ ...brandForm, resourceModel: e.target.value as ResourceModel })
                    }
                    className="w-full px-3 py-2 border rounded-lg bg-white"
                  >
                    <option value="SINGLE_RESOURCE">1 Dedicated Agent (80%)</option>
                    <option value="MULTI_RESOURCE">2-3 Agents (20%)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Client Working Rules</label>
                <select
                  value={brandForm.operatingScheduleType}
                  onChange={(e) =>
                    setBrandForm({
                      ...brandForm,
                      operatingScheduleType: e.target.value as OperatingScheduleType,
                    })
                  }
                  className="w-full px-3 py-2 border rounded-lg bg-white font-semibold text-slate-800"
                >
                  <option value="365_DAYS">365 Days Operation (No Break)</option>
                  <option value="PUBLIC_HOLIDAYS_OFF">Public Holidays OFF</option>
                  <option value="SUNDAYS_AND_HOLIDAYS_OFF">Sundays + Public Holidays OFF</option>
                </select>
              </div>

              {brandForm.resourceModel === 'SINGLE_RESOURCE' && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Dedicated Single Employee (Handles all processes)
                  </label>
                  <select
                    value={brandForm.dedicatedEmployeeId}
                    onChange={(e) => setBrandForm({ ...brandForm, dedicatedEmployeeId: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-white font-medium text-slate-800"
                  >
                    <option value="">Select Employee...</option>
                    {employees.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.fullName} ({e.employeeCode})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsBrandModalOpen(false)}
                  className="px-4 py-2 border rounded-lg text-slate-600 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold"
                >
                  Create Brand
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Process Modal */}
      {isProcessModalOpen && selectedBrandForProcess && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-800">
                Add Process for {selectedBrandForProcess.name}
              </h3>
              <button onClick={() => setIsProcessModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleProcessSubmit} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Process Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Non-Delivery Report (NDR)"
                  value={processForm.name}
                  onChange={(e) => setProcessForm({ ...processForm, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Process Type</label>
                  <select
                    value={processForm.type}
                    onChange={(e) => setProcessForm({ ...processForm, type: e.target.value as ProcessType })}
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
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">SLA Response Target</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. < 45 seconds"
                    value={processForm.slaResponseTarget}
                    onChange={(e) => setProcessForm({ ...processForm, slaResponseTarget: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsProcessModalOpen(false)}
                  className="px-4 py-2 border rounded-lg text-slate-600 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold"
                >
                  Save Process
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
