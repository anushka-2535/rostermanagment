import React from 'react';
import {
  Boxes,
  Users,
  CalendarCheck,
  CalendarOff,
  AlertTriangle,
  Clock,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useRoster } from '../../../context/RosterContext';
import { SHIFT_DETAILS, ShiftType } from '../../../types';

export const PodDashboardView: React.FC = () => {
  const { currentUser } = useAuth();
  const { employees, pods, rosterCells, leaves, conflicts, setActiveTab } = useRoster();

  // Scope to the lead's assigned pod
  const userPodId = currentUser?.podId || 'pod-alpha';
  const pod = pods.find((p) => p.id === userPodId) || pods[0];
  const podEmployees = employees.filter((e) => e.podId === userPodId);
  const podEmpIds = podEmployees.map((e) => e.id);

  const todayStr = '2026-11-23';
  const todayPodCells = rosterCells.filter((c) => podEmpIds.includes(c.employeeId) && c.date === todayStr);

  const workingTodayCount = todayPodCells.filter((c) =>
    ['MORNING', 'EVENING', 'NIGHT', 'GENERAL'].includes(c.shift)
  ).length;

  const onLeaveTodayCount = todayPodCells.filter((c) => c.shift === 'LEAVE').length;

  const podPendingLeaves = leaves.filter(
    (l) => podEmpIds.includes(l.employeeId) && l.status === 'PENDING'
  );

  const podConflicts = conflicts.filter(
    (c) => c.employeeId && podEmpIds.includes(c.employeeId) && !c.isResolved
  );

  return (
    <div className="space-y-6">
      {/* Pod Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 shadow-xl border border-indigo-900/40 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30">
              <Boxes className="w-3.5 h-3.5 text-indigo-400" />
              <span>Pod Lead Operational Desk: {pod?.code}</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">
              {pod?.name} — Team Operations
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm max-w-xl">
              Welcome back, {currentUser?.name}. You are reviewing team schedules, real-time shift coverage, and pending leaves for your assigned pod.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('lead_roster')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md flex items-center gap-2 transition-all cursor-pointer"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>View Team Roster</span>
            </button>
            <button
              onClick={() => setActiveTab('lead_leaves')}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium border border-slate-700 transition-all cursor-pointer"
            >
              Review Leaves ({podPendingLeaves.length})
            </button>
          </div>
        </div>
      </div>

      {/* Pod KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Pod Members
            </span>
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{podEmployees.length}</span>
            <span className="text-xs font-medium text-slate-500">
              Target: {pod?.targetHeadcount}
            </span>
          </div>
          <div className="mt-2 text-xs text-emerald-600 font-medium">
            100% Core Certifications Met
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              On Duty Today
            </span>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{workingTodayCount}</span>
            <span className="text-xs font-medium text-slate-500">Scheduled</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Across Morning & Evening shifts
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Pending Time-Off
            </span>
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-amber-600">{podPendingLeaves.length}</span>
            <span className="text-xs font-medium text-slate-500">Requests</span>
          </div>
          <div className="mt-2 text-xs text-indigo-600 font-semibold cursor-pointer" onClick={() => setActiveTab('lead_leaves')}>
            Review & Approve &rarr;
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Pod Coverage Alerts
            </span>
            <div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-rose-600">{podConflicts.length}</span>
            <span className="text-xs font-medium text-slate-500">Flags</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Rest & consecutive days
          </div>
        </div>
      </div>

      {/* Pod Team Directory & Live Status */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {pod?.name} — Team Roster & Certifications
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Employees assigned to your pod hierarchy
            </p>
          </div>
          <button
            onClick={() => setActiveTab('lead_roster')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
          >
            Open Full Team Schedule &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {podEmployees.map((emp) => {
            const todayCell = todayPodCells.find((c) => c.employeeId === emp.id);
            const shift = todayCell?.shift || 'OFF';
            const shiftDetail = SHIFT_DETAILS[shift];

            return (
              <div
                key={emp.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                      {emp.fullName.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-800">{emp.fullName}</h4>
                      <span className="text-[10px] text-slate-400 font-mono">{emp.employeeCode}</span>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${shiftDetail.badgeBg}`}>
                    {shiftDetail.badgeText}
                  </span>
                </div>

                <div className="text-xs text-slate-500 space-y-1">
                  <div>Role: <strong className="text-slate-700">{emp.role}</strong></div>
                  <div>Pref. Shift: <strong className="text-slate-700">{emp.preferredShift}</strong></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
