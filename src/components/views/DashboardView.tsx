import React from 'react';
import {
  Users,
  Briefcase,
  CalendarCheck,
  CalendarOff,
  ShieldAlert,
  ChevronRight,
  TrendingUp,
  UserPlus,
  Building2,
  Clock,
  Layers,
  Calendar,
  Boxes,
  CheckCircle2,
  Activity,
  ArrowRight,
} from 'lucide-react';
import { useRoster } from '../../context/RosterContext';
import { SHIFT_DETAILS, ShiftType } from '../../types';

export const DashboardView: React.FC = () => {
  const {
    employees,
    pods,
    brands,
    processes,
    rosterCells,
    leaves,
    conflicts,
    setActiveTab,
    rosterStatus,
  } = useRoster();

  const totalEmployees = employees.length;
  const activeEmployees = employees.filter((e) => e.status === 'ACTIVE').length;
  const totalPods = pods.length;
  const totalBrands = brands.filter((b) => b.status === 'ACTIVE').length;
  const totalProcesses = processes.length;

  const todayStr = '2026-11-23';
  const todayShifts = rosterCells.filter((c) => c.date === todayStr);

  const shiftsCount: Record<ShiftType, number> = {
    MORNING: todayShifts.filter((c) => c.shift === 'MORNING').length,
    EVENING: todayShifts.filter((c) => c.shift === 'EVENING').length,
    NIGHT: todayShifts.filter((c) => c.shift === 'NIGHT').length,
    GENERAL: todayShifts.filter((c) => c.shift === 'GENERAL').length,
    OFF: todayShifts.filter((c) => c.shift === 'OFF').length,
    LEAVE: todayShifts.filter((c) => c.shift === 'LEAVE').length,
    COMP_OFF: todayShifts.filter((c) => c.shift === 'COMP_OFF').length,
  };

  const employeesWorkingToday =
    shiftsCount.MORNING + shiftsCount.EVENING + shiftsCount.NIGHT + shiftsCount.GENERAL;
  const employeesOnLeaveToday = shiftsCount.LEAVE;

  const criticalConflicts = conflicts.filter((c) => !c.isResolved && c.severity === 'CRITICAL');
  const upcomingLeaves = leaves.filter((l) => l.status === 'APPROVED');

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      {/* 1. Header Banner & Quick Actions */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">Operations Dashboard</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
              Roster: {rosterStatus}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Workforce overview for <strong className="text-slate-700">November 23, 2026</strong> &bull; {totalEmployees} employees across {totalPods} pods and {totalBrands} client brands.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('generator')}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-2 transition-colors cursor-pointer"
          >
            <CalendarCheck className="w-4 h-4" />
            <span>Generate Roster</span>
          </button>
          <button
            onClick={() => setActiveTab('employees')}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <UserPlus className="w-4 h-4 text-indigo-600" />
            <span>Add Employee</span>
          </button>
          <button
            onClick={() => setActiveTab('brands')}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Building2 className="w-4 h-4 text-emerald-600" />
            <span>Add Brand</span>
          </button>
          <button
            onClick={() => setActiveTab('conflicts')}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            <span>View Conflicts ({conflicts.filter((c) => !c.isResolved).length})</span>
          </button>
        </div>
      </div>

      {/* Critical Conflict Banner (if any) */}
      {criticalConflicts.length > 0 && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex min-w-0 items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center flex-shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-rose-900">
                {criticalConflicts.length} Critical Coverage Conflict Detected
              </div>
              <div className="text-xs text-rose-700 mt-0.5">
                {criticalConflicts[0].title} — {criticalConflicts[0].description}
              </div>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('conflicts')}
            className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1 transition-colors cursor-pointer flex-shrink-0"
          >
            <span>Resolve</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 2. Key Performance Indicators Row (Below Header) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div
          onClick={() => setActiveTab('employees')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-indigo-300 transition-all cursor-pointer"
        >
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Total Workforce
          </span>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900">{totalEmployees}</span>
            <span className="text-[10px] text-emerald-600 font-semibold">{activeEmployees} active</span>
          </div>
          <span className="text-[10px] text-slate-400 block mt-1">Staff directory</span>
        </div>

        <div
          onClick={() => setActiveTab('brands')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-indigo-300 transition-all cursor-pointer"
        >
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Client Brands
          </span>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900">{totalBrands}</span>
            <span className="text-[10px] text-indigo-600 font-semibold">{totalProcesses} procs</span>
          </div>
          <span className="text-[10px] text-slate-400 block mt-1">Single & Multi-res</span>
        </div>

        <div
          onClick={() => setActiveTab('pods')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-indigo-300 transition-all cursor-pointer"
        >
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Operational Pods
          </span>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900">{totalPods}</span>
            <span className="text-[10px] text-emerald-600 font-semibold">Active</span>
          </div>
          <span className="text-[10px] text-slate-400 block mt-1">Alpha through Delta</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Working Today
          </span>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-indigo-600">{employeesWorkingToday}</span>
            <span className="text-[10px] text-slate-500 font-medium">on duty</span>
          </div>
          <span className="text-[10px] text-slate-400 block mt-1">{todayStr}</span>
        </div>

        <div
          onClick={() => setActiveTab('leaves')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-indigo-300 transition-all cursor-pointer"
        >
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            On Leave Today
          </span>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-rose-600">{employeesOnLeaveToday}</span>
            <span className="text-[10px] text-slate-500 font-medium">{shiftsCount.OFF} off</span>
          </div>
          <span className="text-[10px] text-slate-400 block mt-1">Approved absences</span>
        </div>

        <div
          onClick={() => setActiveTab('conflicts')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-indigo-300 transition-all cursor-pointer"
        >
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Total Conflicts
          </span>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-amber-600">
              {conflicts.filter((c) => !c.isResolved).length}
            </span>
            <span className="text-[10px] text-amber-600 font-medium">Audit flags</span>
          </div>
          <span className="text-[10px] text-slate-400 block mt-1">Coverage check</span>
        </div>
      </div>

      {/* 3. Today's Shift Breakdown (Below KPIs) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-600" />
              <span>Today's Shift Floor Deployment ({todayStr})</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live headcount distribution across morning, evening, night, general shifts, and offs
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            Total Staff on Duty: <strong className="text-indigo-600">{employeesWorkingToday} Agents</strong>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {(['MORNING', 'EVENING', 'NIGHT', 'GENERAL', 'OFF', 'LEAVE'] as ShiftType[]).map((st) => {
            const details = SHIFT_DETAILS[st];
            const count = shiftsCount[st];
            return (
              <div
                key={st}
                className={`p-3.5 rounded-xl border flex flex-col justify-between ${details.badgeBg}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold">{details.label.split(' ')[0]}</span>
                  <span className="text-lg font-black">{count}</span>
                </div>
                <div className="text-[10px] opacity-75 mt-1 font-mono">{details.timeWindow}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Operational Pods (Below Shifts) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Boxes className="w-4 h-4 text-indigo-600" />
              <span>Operational Pods & Staffing Capacity</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Pod hierarchy, designated Pod Leads, and headcount targets
            </p>
          </div>
          <button
            onClick={() => setActiveTab('pods')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            <span>Manage All Pods</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {pods.map((pod) => {
            const podEmployees = employees.filter((e) => e.podId === pod.id);
            const lead = employees.find((e) => e.id === pod.leadEmployeeId);
            const fillPct = Math.round((podEmployees.length / (pod.targetHeadcount || 1)) * 100);

            return (
              <div
                key={pod.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span
                    className="px-2.5 py-0.5 rounded text-xs font-bold text-white shadow-xs"
                    style={{ backgroundColor: pod.color }}
                  >
                    {pod.code}
                  </span>
                  <span className="text-xs font-bold text-slate-600">
                    {podEmployees.length} / {pod.targetHeadcount} Staff ({fillPct}%)
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-900">{pod.name}</h4>
                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                    {pod.description}
                  </p>
                </div>

                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${Math.min(fillPct, 100)}%`, backgroundColor: pod.color }}
                  />
                </div>

                <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Pod Lead:</span>
                  <span className="font-bold text-slate-800">
                    {lead ? lead.fullName : 'Unassigned'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Client Brands & Processes (Below Pods) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-indigo-600" />
              <span>Client Brands & Operational Coverage</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Operating hours, single/multi-resource model, and certified workforce
            </p>
          </div>
          <button
            onClick={() => setActiveTab('brands')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            <span>View All Brands</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {brands.map((b) => {
            const brandProcesses = processes.filter((p) => p.brandId === b.id);
            const certifiedCount = employees.filter((e) =>
              e.certifiedBrandIds.includes(b.id)
            ).length;

            return (
              <div
                key={b.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-all space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">{b.name}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                    {b.resourceModel === 'SINGLE_RESOURCE' ? 'Single-Res' : 'Multi-Res'}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 space-y-1">
                  <div>Hours: <strong className="text-slate-700">{b.operatingHours}</strong></div>
                  <div>Processes: <strong className="text-slate-700">{brandProcesses.length} active</strong></div>
                  <div>Min Daily Staff: <strong className="text-slate-700">{b.minDailyHeadcount} agents</strong></div>
                </div>
                <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between">
                  <span className="text-slate-400">Certified Staff:</span>
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    {certifiedCount} Agents
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. Upcoming Approved Leaves (Below Brands) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CalendarOff className="w-4 h-4 text-rose-500" />
              <span>Upcoming Approved Leaves Pipeline</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Employees with scheduled time-offs reflected in the roster
            </p>
          </div>
          <button
            onClick={() => setActiveTab('leaves')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            <span>Leaves Hub</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {upcomingLeaves.slice(0, 4).map((lve) => {
            const emp = employees.find((e) => e.id === lve.employeeId);
            return (
              <div
                key={lve.id}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-slate-900">
                    {emp ? emp.fullName : 'Employee'} ({emp?.employeeCode})
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {lve.startDate} &rarr; {lve.endDate} &bull; {lve.reason}
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-rose-100 text-rose-700">
                  {lve.type}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
