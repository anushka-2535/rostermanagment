import React, { useState } from 'react';
import {
  CalendarCheck,
  Filter,
  Users,
  Search,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useRoster } from '../../../context/RosterContext';
import { SHIFT_DETAILS, ShiftType } from '../../../types';

export const PodRosterView: React.FC = () => {
  const { currentUser } = useAuth();
  const { employees, pods, rosterCells, selectedMonth, selectedYear } = useRoster();

  const userPodId = currentUser?.podId || 'pod-alpha';
  const pod = pods.find((p) => p.id === userPodId) || pods[0];
  const podEmployees = employees.filter((e) => e.podId === userPodId);

  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredStaff = podEmployees.filter((e) =>
    e.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.employeeCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-indigo-600" />
            <span>{pod?.name} — Monthly Team Roster</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Scoped strictly to your pod members ({podEmployees.length} staff). November {selectedYear} schedule.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter pod member..."
              className="pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700"
            />
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-2 bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm text-xs">
        <span className="font-semibold text-slate-500 mr-1">Shift Legend:</span>
        {(['MORNING', 'EVENING', 'NIGHT', 'GENERAL', 'OFF', 'LEAVE'] as ShiftType[]).map((st) => {
          const detail = SHIFT_DETAILS[st];
          return (
            <span
              key={st}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${detail.badgeBg}`}
            >
              {detail.badgeText}: {detail.label.split(' ')[0]}
            </span>
          );
        })}
      </div>

      {/* Scoped Pod Roster Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto max-h-[600px]">
          <table className="w-full border-collapse text-xs select-none">
            <thead className="bg-slate-900 text-white sticky top-0 z-10">
              <tr>
                <th className="py-3 px-4 text-left font-bold w-52 sticky left-0 z-20 bg-slate-900 border-r border-slate-800">
                  Pod Member
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
              {filteredStaff.map((emp) => (
                <tr key={emp.id} className="hover:bg-indigo-50/20 transition-colors">
                  <td className="py-2.5 px-3 sticky left-0 z-10 bg-white hover:bg-indigo-50/20 border-r border-slate-200 shadow-sm">
                    <div className="font-bold text-slate-900 truncate max-w-[170px]">
                      {emp.fullName}
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-slate-400 font-mono">
                      <span>{emp.employeeCode}</span>
                      <span>&bull;</span>
                      <span className="text-slate-600">{emp.role}</span>
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
                          className={`w-full py-1 rounded text-[10px] font-bold border ${shiftDetail.badgeBg}`}
                          title={`${emp.fullName} - ${dateStr}: ${shiftDetail.label}`}
                        >
                          {shiftDetail.badgeText}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
