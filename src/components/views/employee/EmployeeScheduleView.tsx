import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Briefcase,
  Layers,
  ChevronLeft,
  ChevronRight,
  Shield,
  Coffee,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useRoster } from '../../../context/RosterContext';
import { SHIFT_DETAILS, ShiftType } from '../../../types';

export const EmployeeScheduleView: React.FC = () => {
  const { currentUser } = useAuth();
  const { employees, brands, processes, rosterCells, selectedMonth, selectedYear } = useRoster();

  // Scoped to current logged-in employee (e.g. Rahul Verma 'emp-002')
  const empId = currentUser?.employeeId || 'emp-002';
  const employee = employees.find((e) => e.id === empId) || employees[1];

  const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const dayOfWeekName = (day: number) => {
    const d = new Date(selectedYear, selectedMonth - 1, day);
    return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()];
  };

  const isWeekend = (day: number) => {
    const d = new Date(selectedYear, selectedMonth - 1, day).getDay();
    return d === 0 || d === 6;
  };

  // Calculate monthly stats for employee
  const myCells = rosterCells.filter((c) => c.employeeId === empId);
  const workingDaysCount = myCells.filter((c) =>
    ['MORNING', 'EVENING', 'NIGHT', 'GENERAL'].includes(c.shift)
  ).length;
  const offDaysCount = myCells.filter((c) => c.shift === 'OFF').length;
  const leaveDaysCount = myCells.filter((c) => c.shift === 'LEAVE').length;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 shadow-xl border border-indigo-900/40 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30">
              <Shield className="w-3.5 h-3.5 text-indigo-400" />
              <span>Personal Employee Portal: {employee.employeeCode}</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">
              Welcome, {employee.fullName}
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm max-w-xl">
              Role: <strong>{employee.role}</strong> &bull; Review your monthly shift assignments, weekly-offs, and client coverage details for November {selectedYear}.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/10">
              <span className="text-[10px] text-slate-300 block">Working Days</span>
              <span className="text-lg font-bold text-white">{workingDaysCount}</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/10">
              <span className="text-[10px] text-slate-300 block">Weekly Offs</span>
              <span className="text-lg font-bold text-emerald-400">{offDaysCount}</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/10">
              <span className="text-[10px] text-slate-300 block">Approved Leave</span>
              <span className="text-lg font-bold text-rose-300">{leaveDaysCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Certifications Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-indigo-600" />
          <span className="font-semibold text-slate-700">Certified Client Brands:</span>
          <div className="flex flex-wrap gap-1.5">
            {employee.certifiedBrandIds.map((bid) => {
              const b = brands.find((brand) => brand.id === bid);
              return (
                <span
                  key={bid}
                  className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold border border-indigo-100"
                >
                  {b?.name || bid}
                </span>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Coffee className="w-4 h-4 text-slate-400" />
          <span className="text-slate-500 font-medium">
            Preferred Shift: <strong>{employee.preferredShift}</strong>
          </span>
        </div>
      </div>

      {/* Personal Monthly Calendar Grid */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-600" />
            <span>Monthly Roster Calendar — November {selectedYear}</span>
          </h3>
          <span className="text-xs text-slate-400">
            Published Schedule (Official)
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
          {daysArray.map((day) => {
            const dateStr = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(
              day
            ).padStart(2, '0')}`;
            const cell = myCells.find((c) => c.date === dateStr);
            const shift = cell?.shift || 'OFF';
            const detail = SHIFT_DETAILS[shift];
            const dayName = dayOfWeekName(day);
            const weekend = isWeekend(day);
            const brand = brands.find((b) => b.id === cell?.brandId);
            const proc = processes.find((p) => p.id === cell?.processId);

            return (
              <div
                key={day}
                className={`p-3 rounded-xl border transition-all flex flex-col justify-between min-h-[115px] ${
                  shift === 'OFF'
                    ? 'bg-slate-50 border-slate-200 text-slate-500'
                    : shift === 'LEAVE'
                    ? 'bg-rose-50/50 border-rose-200 text-rose-800'
                    : 'bg-white border-slate-200 hover:border-indigo-300 shadow-sm'
                }`}
              >
                {/* Top: Day & Name */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-800">{day}</span>
                  <span
                    className={`text-[10px] uppercase font-mono font-bold ${
                      weekend ? 'text-amber-600' : 'text-slate-400'
                    }`}
                  >
                    {dayName}
                  </span>
                </div>

                {/* Center: Shift Badge */}
                <div className="my-1.5">
                  <span
                    className={`inline-block w-full text-center py-1 rounded text-[11px] font-bold border ${detail.badgeBg}`}
                  >
                    {detail.label.split(' ')[0]}
                  </span>
                  <span className="text-[10px] text-slate-400 block text-center mt-0.5">
                    {detail.timeWindow}
                  </span>
                </div>

                {/* Bottom: Brand or notes */}
                <div className="text-[10px] text-slate-500 truncate pt-1 border-t border-slate-100">
                  {shift !== 'OFF' && shift !== 'LEAVE' ? (
                    <span className="text-indigo-600 font-semibold">{brand?.name || 'Assigned Duty'}</span>
                  ) : (
                    <span className="italic">{detail.label}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
