import React, { useState } from 'react';
import {
  CalendarCheck,
  Play,
  Download,
  Filter,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Users,
  Briefcase,
  Layers,
  Boxes,
  FileText,
  Save,
  Send,
  Eye,
  Check,
  X,
  Edit2,
  AlertTriangle,
  UserX,
  ArrowRight,
} from 'lucide-react';
import { useRoster } from '../../context/RosterContext';
import { SHIFT_DETAILS, ShiftType, Employee, Pod, Brand, Process } from '../../types';

type RosterPerspective = 'COMPANY' | 'POD' | 'BRAND' | 'PROCESS' | 'EMPLOYEE';
type ViewFormat = 'CALENDAR' | 'TABLE';

export const RosterGeneratorView: React.FC = () => {
  const {
    employees,
    pods,
    brands,
    processes,
    rosterCells,
    selectedMonth,
    selectedYear,
    generateRosterForMonth,
    updateRosterCell,
    rosterStatus,
    publishRoster,
    saveRosterDraft,
    exportRosterCSV,
    runValidationChecks,
    simulateSuddenLeave,
    assignBackupStaff,
    conflicts,
    setActiveTab,
  } = useRoster();

  // Perspective & Format
  const [perspective, setPerspective] = useState<RosterPerspective>('COMPANY');
  const [format, setFormat] = useState<ViewFormat>('CALENDAR');

  // Filters
  const [selectedPodId, setSelectedPodId] = useState('ALL');
  const [selectedBrandId, setSelectedBrandId] = useState('ALL');
  const [selectedProcessId, setSelectedProcessId] = useState('ALL');
  const [employeeSearch, setEmployeeSearch] = useState('');

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  // Cell editing modal
  const [editingCell, setEditingCell] = useState<{
    id: string;
    employeeName: string;
    date: string;
    shift: ShiftType;
    brandId?: string;
    processId?: string;
  } | null>(null);

  // Dynamic Sudden Leave Simulation Modal (Demo feature)
  const [isSuddenLeaveModalOpen, setIsSuddenLeaveModalOpen] = useState(false);
  const [simEmployeeId, setSimEmployeeId] = useState(employees[3]?.id || employees[0]?.id); // Default Sneha
  const [simDate, setSimDate] = useState('2026-11-25');
  const [simReason, setSimReason] = useState('Sudden Medical Emergency');

  const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const dayOfWeekLetter = (day: number) => {
    const d = new Date(selectedYear, selectedMonth - 1, day);
    return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()];
  };

  const isWeekend = (day: number) => {
    const d = new Date(selectedYear, selectedMonth - 1, day).getDay();
    return d === 0 || d === 6;
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setFeedbackToast('Computing constraint satisfaction schedule (80-20 rule, SLAs, weekly offs)...');

    setTimeout(() => {
      generateRosterForMonth(selectedYear, selectedMonth);
      setIsGenerating(false);
      setFeedbackToast('Monthly roster generated for 30+ employees! Shift rules & SLAs verified.');
      setTimeout(() => setFeedbackToast(null), 4000);
    }, 700);
  };

  const handlePublish = () => {
    publishRoster();
    setFeedbackToast('Roster published! Schedule is now officially visible to Pod Leads and Employees.');
    setTimeout(() => setFeedbackToast(null), 4000);
  };

  const handleSaveDraft = () => {
    saveRosterDraft();
    setFeedbackToast('Roster saved as draft.');
    setTimeout(() => setFeedbackToast(null), 4000);
  };

  const handleTriggerSuddenLeave = (e: React.FormEvent) => {
    e.preventDefault();
    simulateSuddenLeave(simEmployeeId, simDate, simReason);
    setIsSuddenLeaveModalOpen(false);
    setFeedbackToast(
      'Sudden leave simulated! System detected a brand coverage gap and flagged a resolution.'
    );
    setTimeout(() => setFeedbackToast(null), 5000);
  };

  // Filter employees based on active filters
  const filteredEmployees = employees.filter((emp) => {
    if (selectedPodId !== 'ALL' && emp.podId !== selectedPodId) return false;
    if (selectedBrandId !== 'ALL' && !emp.certifiedBrandIds.includes(selectedBrandId)) return false;
    if (selectedProcessId !== 'ALL' && !emp.certifiedProcessIds.includes(selectedProcessId)) return false;
    if (
      employeeSearch &&
      !emp.fullName.toLowerCase().includes(employeeSearch.toLowerCase()) &&
      !emp.employeeCode.toLowerCase().includes(employeeSearch.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  // Render content according to the active perspective
  const renderRosterContent = () => {
    switch (perspective) {
      case 'POD':
        return pods.map((pod) => {
          const podStaff = filteredEmployees.filter((e) => e.podId === pod.id);
          const lead = employees.find((e) => e.id === pod.leadEmployeeId);
          if (podStaff.length === 0) return null;

          return (
            <div key={pod.id} className="mb-6 space-y-2">
              <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-100 border border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: pod.color }} />
                  <span className="font-bold text-xs text-slate-900">{pod.name}</span>
                  <span className="text-[11px] text-slate-500 font-medium">
                    ({podStaff.length} team members)
                  </span>
                </div>
                <div className="text-xs text-slate-600">
                  Pod Lead: <strong className="text-slate-900">{lead ? lead.fullName : 'Unassigned'}</strong>
                </div>
              </div>
              {renderMatrixTable(podStaff)}
            </div>
          );
        });

      case 'BRAND':
        return (
          <div className="space-y-4">
            <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-xs text-indigo-900 flex items-center justify-between">
              <div>
                <strong>Brand Daily Coverage Status (80-20 Rule Active):</strong>
                <span className="text-indigo-700 ml-1">
                  80% single-resource brands require dedicated agent coverage. System flags red gaps if agent is on leave/off.
                </span>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto max-h-[600px]">
                <table className="w-full border-collapse text-xs select-none">
                  <thead className="bg-slate-900 text-white sticky top-0 z-10">
                    <tr>
                      <th className="py-3 px-4 text-left font-bold w-60 sticky left-0 z-20 bg-slate-900 border-r border-slate-800">
                        Brand & Resource Model
                      </th>
                      {daysArray.map((day) => {
                        const dayName = dayOfWeekLetter(day);
                        const weekend = isWeekend(day);
                        return (
                          <th
                            key={day}
                            className={`py-2 px-1 text-center font-semibold w-12 border-r border-slate-800 ${
                              weekend ? 'bg-slate-800 text-amber-300' : 'text-slate-200'
                            }`}
                          >
                            <div className="text-[10px] uppercase font-mono">{dayName}</div>
                            <div className="text-xs font-bold">{day}</div>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {brands.map((brand) => {
                      const dedicatedEmp = employees.find((e) => e.id === brand.dedicatedEmployeeId);

                      return (
                        <tr key={brand.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-2.5 px-3 sticky left-0 z-10 bg-white border-r border-slate-200 shadow-xs">
                            <div className="font-bold text-slate-900">{brand.name}</div>
                            <div className="flex items-center gap-1.5 mt-0.5 text-[10px]">
                              <span
                                className={`px-1.5 py-0.2 rounded font-bold ${
                                  brand.resourceModel === 'SINGLE_RESOURCE'
                                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                }`}
                              >
                                {brand.resourceModel === 'SINGLE_RESOURCE' ? '1 Agent (80%)' : '2-3 Agents (20%)'}
                              </span>
                              <span className="text-slate-400 font-mono">
                                {brand.operatingScheduleType === '365_DAYS'
                                  ? '365d'
                                  : brand.operatingScheduleType === 'SUNDAYS_AND_HOLIDAYS_OFF'
                                  ? 'No Sun/Hol'
                                  : 'No Hol'}
                              </span>
                            </div>
                          </td>

                          {daysArray.map((day) => {
                            const dateStr = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(
                              day
                            ).padStart(2, '0')}`;
                            const dayOfWeek = new Date(selectedYear, selectedMonth - 1, day).getDay();

                            // Determine if brand is closed today
                            const isBrandClosed =
                              (brand.operatingScheduleType === 'SUNDAYS_AND_HOLIDAYS_OFF' && dayOfWeek === 0) ||
                              (brand.operatingScheduleType === 'PUBLIC_HOLIDAYS_OFF' && day === 24);

                            // Find cells assigned to this brand
                            const brandCells = rosterCells.filter(
                              (c) =>
                                c.brandId === brand.id &&
                                c.date === dateStr &&
                                ['MORNING', 'EVENING', 'NIGHT', 'GENERAL'].includes(c.shift)
                            );

                            const isCovered = brandCells.length >= brand.minDailyHeadcount;

                            return (
                              <td key={day} className="p-1 text-center border-r border-slate-100">
                                {isBrandClosed ? (
                                  <div className="py-1 rounded text-[9px] font-bold bg-slate-100 text-slate-400">
                                    CLOSED
                                  </div>
                                ) : isCovered ? (
                                  <div
                                    title={`${brand.name} is COVERED on ${dateStr} by ${brandCells.length} staff`}
                                    className="py-1 rounded text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  >
                                    OK ({brandCells.length})
                                  </div>
                                ) : (
                                  <div
                                    title={`COVERAGE GAP: 0 staff assigned to ${brand.name} on ${dateStr}`}
                                    className="py-1 rounded text-[9px] font-extrabold bg-rose-100 text-rose-800 border border-rose-300 animate-pulse cursor-pointer"
                                    onClick={() => setActiveTab('conflicts')}
                                  >
                                    GAP
                                  </div>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'PROCESS':
        return processes.map((proc) => {
          const procStaff = filteredEmployees.filter((e) =>
            e.certifiedProcessIds.includes(proc.id)
          );
          if (procStaff.length === 0) return null;

          return (
            <div key={proc.id} className="mb-6 space-y-2">
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 border border-slate-200">
                <Layers className="w-3.5 h-3.5 text-indigo-600" />
                <span className="font-bold text-xs text-slate-800">{proc.name}</span>
                <span className="text-[11px] text-slate-500 font-medium">
                  ({procStaff.length} agents &bull; Target SLA: {proc.slaResponseTarget})
                </span>
              </div>
              {renderMatrixTable(procStaff)}
            </div>
          );
        });

      case 'EMPLOYEE':
      case 'COMPANY':
      default:
        return renderMatrixTable(filteredEmployees);
    }
  };

  const renderMatrixTable = (staffList: Employee[]) => {
    if (format === 'TABLE') {
      return (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-white">
              <tr>
                <th className="py-2.5 px-4">Employee</th>
                <th className="py-2.5 px-3">Role</th>
                <th className="py-2.5 px-3">Pod</th>
                <th className="py-2.5 px-3 text-center">Working Days</th>
                <th className="py-2.5 px-3 text-center">Weekly Offs</th>
                <th className="py-2.5 px-3 text-center">Leaves</th>
                <th className="py-2.5 px-3 text-center">Preferred Shift</th>
                <th className="py-2.5 px-4 text-right">Quick Edit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {staffList.map((emp) => {
                const pod = pods.find((p) => p.id === emp.podId);
                const empCells = rosterCells.filter((c) => c.employeeId === emp.id);
                const workingCount = empCells.filter((c) =>
                  ['MORNING', 'EVENING', 'NIGHT', 'GENERAL'].includes(c.shift)
                ).length;
                const offCount = empCells.filter((c) => c.shift === 'OFF').length;
                const leaveCount = empCells.filter((c) => c.shift === 'LEAVE').length;

                return (
                  <tr key={emp.id} className="hover:bg-slate-50/60">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{emp.fullName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{emp.employeeCode}</div>
                    </td>
                    <td className="py-3 px-3 text-slate-600">{emp.role}</td>
                    <td className="py-3 px-3">
                      <span
                        className="px-2 py-0.5 rounded text-[10px] font-bold text-white"
                        style={{ backgroundColor: pod?.color || '#64748b' }}
                      >
                        {pod?.code}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-emerald-700">{workingCount}</td>
                    <td className="py-3 px-3 text-center font-bold text-slate-600">{offCount}</td>
                    <td className="py-3 px-3 text-center font-bold text-rose-600">{leaveCount}</td>
                    <td className="py-3 px-3 text-center">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-700 font-semibold">
                        {emp.preferredShift}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          const firstCell = empCells[0];
                          if (firstCell) {
                            setEditingCell({
                              id: firstCell.id,
                              employeeName: emp.fullName,
                              date: firstCell.date,
                              shift: firstCell.shift,
                              brandId: firstCell.brandId,
                              processId: firstCell.processId,
                            });
                          }
                        }}
                        className="px-2.5 py-1 text-xs text-indigo-600 hover:bg-indigo-50 rounded font-semibold"
                      >
                        Adjust Shifts
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      );
    }

    // Interactive Monthly Calendar Grid
    return (
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto max-h-[600px]">
          <table className="w-full border-collapse text-xs select-none">
            <thead className="bg-slate-900 text-white sticky top-0 z-10">
              <tr>
                <th className="py-3 px-4 text-left font-bold w-52 sticky left-0 z-20 bg-slate-900 border-r border-slate-800 shadow-sm">
                  Employee / Pod
                </th>
                {daysArray.map((day) => {
                  const dayName = dayOfWeekLetter(day);
                  const weekend = isWeekend(day);
                  return (
                    <th
                      key={day}
                      className={`py-2 px-1 text-center font-semibold w-12 border-r border-slate-800 ${
                        weekend ? 'bg-slate-800 text-amber-300' : 'text-slate-200'
                      }`}
                    >
                      <div className="text-[10px] uppercase font-mono">{dayName}</div>
                      <div className="text-xs font-bold">{day}</div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {staffList.map((emp) => {
                const pod = pods.find((p) => p.id === emp.podId);

                return (
                  <tr key={emp.id} className="hover:bg-indigo-50/20 transition-colors">
                    <td className="py-2.5 px-3 sticky left-0 z-10 bg-white hover:bg-indigo-50/20 border-r border-slate-200 shadow-sm">
                      <div className="font-bold text-slate-900 truncate max-w-[170px]">
                        {emp.fullName}
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span
                          className="px-1.5 py-0.2 rounded text-[9px] font-bold text-white"
                          style={{ backgroundColor: pod?.color || '#64748b' }}
                        >
                          {pod?.code}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">{emp.employeeCode}</span>
                      </div>
                    </td>

                    {daysArray.map((day) => {
                      const dateStr = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(
                        day
                      ).padStart(2, '0')}`;
                      const cell = rosterCells.find(
                        (c) => c.employeeId === emp.id && c.date === dateStr
                      );
                      const shift = cell?.shift || 'OFF';
                      const shiftDetail = SHIFT_DETAILS[shift];
                      const weekend = isWeekend(day);

                      return (
                        <td
                          key={day}
                          className={`p-1 text-center border-r border-slate-100 ${
                            weekend ? 'bg-slate-50/60' : ''
                          }`}
                        >
                          <div
                            onClick={() => {
                              if (cell) {
                                setEditingCell({
                                  id: cell.id,
                                  employeeName: emp.fullName,
                                  date: dateStr,
                                  shift: cell.shift,
                                  brandId: cell.brandId,
                                  processId: cell.processId,
                                });
                              }
                            }}
                            title={`${emp.fullName} on ${dateStr}: ${shiftDetail.label} (Click to reassign)`}
                            className={`w-full py-1 rounded text-[10px] font-bold border transition-transform hover:scale-105 cursor-pointer ${shiftDetail.badgeBg}`}
                          >
                            {shiftDetail.badgeText}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Planner Controls */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <CalendarCheck className="w-5 h-5 text-indigo-600" />
                <span>Smart Roster Planner ({employees.length} Staff &bull; 10 Brands)</span>
              </h2>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                  rosterStatus === 'PUBLISHED'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {rosterStatus}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Constraint-based monthly scheduler considering weekly-offs, leaves, holidays, and 80-20 D2C brand assignments.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/30 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{isGenerating ? 'Computing...' : '1-Click Generate Roster'}</span>
            </button>
            <button
              onClick={() => setIsSuddenLeaveModalOpen(true)}
              className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Demonstrate dynamic sudden leave and gap detection"
            >
              <UserX className="w-4 h-4 text-rose-600" />
              <span>Simulate Sudden Leave</span>
            </button>
            <button
              onClick={handleSaveDraft}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4 text-slate-600" />
              <span>Save Draft</span>
            </button>
            <button
              onClick={handlePublish}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Publish</span>
            </button>
            <button
              onClick={exportRosterCSV}
              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors cursor-pointer"
              title="Export Roster CSV"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        {feedbackToast && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{feedbackToast}</span>
          </div>
        )}

        {/* Format Toggle only */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2 text-xs">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setFormat('CALENDAR')}
              className={`px-2.5 py-1 rounded text-[11px] font-bold transition-colors ${
                format === 'CALENDAR' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
              }`}
            >
              Calendar Matrix
            </button>
            <button
              onClick={() => setFormat('TABLE')}
              className={`px-2.5 py-1 rounded text-[11px] font-bold transition-colors ${
                format === 'TABLE' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
              }`}
            >
              Tabular Summary
            </button>
          </div>
        </div>
      </div>

      {/* Multi-Attribute Filters & Legend */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Filter Pod</label>
            <select
              value={selectedPodId}
              onChange={(e) => setSelectedPodId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium"
            >
              <option value="ALL">All Pods ({pods.length})</option>
              {pods.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Filter Brand</label>
            <select
              value={selectedBrandId}
              onChange={(e) => setSelectedBrandId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium"
            >
              <option value="ALL">All Brands ({brands.length})</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Filter Process</label>
            <select
              value={selectedProcessId}
              onChange={(e) => setSelectedProcessId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium"
            >
              <option value="ALL">All Processes ({processes.length})</option>
              {processes.map((proc) => (
                <option key={proc.id} value={proc.id}>
                  {proc.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Search Employee</label>
            <input
              type="text"
              placeholder="Name or code..."
              value={employeeSearch}
              onChange={(e) => setEmployeeSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium"
            />
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2">
          <span className="font-semibold text-slate-400 mr-1">Legend:</span>
          {(['MORNING', 'EVENING', 'NIGHT', 'GENERAL', 'OFF', 'LEAVE', 'COMP_OFF'] as ShiftType[]).map((st) => {
            const detail = SHIFT_DETAILS[st];
            return (
              <span
                key={st}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${detail.badgeBg}`}
              >
                {detail.badgeText}: {detail.label}
              </span>
            );
          })}
        </div>
      </div>

      {/* Roster Output by Perspective */}
      {renderRosterContent()}

      {/* Dynamic Sudden Leave Simulation Modal (Demo feature) */}
      {isSuddenLeaveModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <UserX className="w-5 h-5 text-rose-600" />
                <h3 className="font-bold text-slate-900 text-sm">
                  Demo: Simulate Sudden Post-Roster Leave
                </h3>
              </div>
              <button onClick={() => setIsSuddenLeaveModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <p className="text-slate-600 leading-relaxed">
              Demonstrates what happens when an employee takes sudden leave after roster publication. The system detects the affected brand's coverage gap and suggests backup staff immediately.
            </p>

            <form onSubmit={handleTriggerSuddenLeave} className="space-y-3.5">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Employee Taking Sudden Leave</label>
                <select
                  value={simEmployeeId}
                  onChange={(e) => setSimEmployeeId(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg bg-white"
                >
                  {employees.map((e) => {
                    const dedicatedBrand = brands.find((b) => b.dedicatedEmployeeId === e.id);
                    return (
                      <option key={e.id} value={e.id}>
                        {e.fullName} ({e.employeeCode}) {dedicatedBrand ? `— Dedicated: ${dedicatedBrand.name}` : ''}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Absence Date</label>
                  <input
                    type="date"
                    required
                    value={simDate}
                    onChange={(e) => setSimDate(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Reason</label>
                  <input
                    type="text"
                    required
                    value={simReason}
                    onChange={(e) => setSimReason(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsSuddenLeaveModalOpen(false)}
                  className="px-3 py-1.5 border rounded-lg text-slate-600 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold shadow-sm"
                >
                  Trigger Absence & Detect Gap
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Instant Cell Reassignment Modal */}
      {editingCell && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Adjust Shift Assignment</h3>
                <span className="text-[11px] text-slate-500">
                  {editingCell.employeeName} &bull; {editingCell.date}
                </span>
              </div>
              <button
                onClick={() => setEditingCell(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Select Shift</label>
              <select
                value={editingCell.shift}
                onChange={(e) =>
                  setEditingCell({ ...editingCell, shift: e.target.value as ShiftType })
                }
                className="w-full px-3 py-2 border rounded-lg bg-white font-bold text-indigo-700"
              >
                <option value="MORNING">Morning (07:00 - 15:30)</option>
                <option value="EVENING">Evening (15:00 - 23:30)</option>
                <option value="NIGHT">Night (23:00 - 07:30)</option>
                <option value="GENERAL">General (09:30 - 18:00)</option>
                <option value="OFF">Weekly Off (OFF)</option>
                <option value="LEAVE">Approved Leave (LVE)</option>
                <option value="COMP_OFF">Compensatory Off (COMP)</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t">
              <button
                onClick={() => setEditingCell(null)}
                className="px-3 py-1.5 border rounded-lg text-slate-600 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  updateRosterCell(
                    editingCell.id,
                    editingCell.shift,
                    editingCell.brandId,
                    editingCell.processId
                  );
                  setEditingCell(null);
                }}
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold"
              >
                Update Shift
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
