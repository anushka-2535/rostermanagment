import React, { useState } from 'react';
import {
  CalendarOff,
  Plus,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  AlertCircle,
  Flag,
  User,
  X,
} from 'lucide-react';
import { useRoster } from '../../context/RosterContext';
import { LeaveType } from '../../types';

export const LeavesView: React.FC = () => {
  const {
    leaves,
    holidays,
    employees,
    addLeave,
    updateLeaveStatus,
  } = useRoster();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [leaveForm, setLeaveForm] = useState<{
    employeeId: string;
    type: LeaveType;
    startDate: string;
    endDate: string;
    reason: string;
    status: 'APPROVED' | 'PENDING' | 'REJECTED';
  }>({
    employeeId: employees[0]?.id || '',
    type: 'CASUAL',
    startDate: '2026-11-26',
    endDate: '2026-11-27',
    reason: '',
    status: 'PENDING',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveForm.reason.trim()) return;
    addLeave(leaveForm);
    setIsModalOpen(false);
  };

  const pendingLeaves = leaves.filter((l) => l.status === 'PENDING');
  const approvedLeaves = leaves.filter((l) => l.status === 'APPROVED');

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <CalendarOff className="w-5 h-5 text-indigo-600" />
            <span>Leave & Availability Management</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage employee time-off, public holidays, comp-offs, and operational blackout dates.
          </p>
        </div>

        <button
          onClick={() => {
            setLeaveForm({
              employeeId: employees[0]?.id || '',
              type: 'CASUAL',
              startDate: '2026-11-26',
              endDate: '2026-11-27',
              reason: '',
              status: 'PENDING',
            });
            setIsModalOpen(true);
          }}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm flex items-center gap-2 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Submit Leave Request</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 block uppercase">Pending Review</span>
            <span className="text-2xl font-bold text-amber-600">{pendingLeaves.length}</span>
            <span className="text-xs text-slate-500 block mt-1">Awaiting pod lead review</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 block uppercase">Approved This Month</span>
            <span className="text-2xl font-bold text-emerald-600">{approvedLeaves.length}</span>
            <span className="text-xs text-slate-500 block mt-1">Adjusted in roster grid</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 block uppercase">Public Holidays</span>
            <span className="text-2xl font-bold text-indigo-600">{holidays.length}</span>
            <span className="text-xs text-slate-500 block mt-1">Recognized company dates</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Flag className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Leave Requests Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Time-Off Requests Pipeline</h3>
            <p className="text-xs text-slate-500 mt-0.5">Approval instantly syncs with the monthly roster</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
              <tr>
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Leave Type</th>
                <th className="py-3 px-4">Duration & Dates</th>
                <th className="py-3 px-4">Reason</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leaves.map((leave) => {
                const emp = employees.find((e) => e.id === leave.employeeId);
                return (
                  <tr key={leave.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-medium text-slate-900">
                      <div className="font-bold text-slate-800">{emp ? emp.fullName : 'Unknown'}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{emp?.employeeCode}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700">
                        {leave.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">
                      {leave.startDate} &rarr; {leave.endDate}
                    </td>
                    <td className="py-3 px-4 max-w-xs text-slate-600 truncate">{leave.reason}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          leave.status === 'APPROVED'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : leave.status === 'PENDING'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {leave.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-1.5">
                      {leave.status === 'PENDING' && (
                        <>
                          <button
                            onClick={() => updateLeaveStatus(leave.id, 'APPROVED')}
                            className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] shadow-sm transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => updateLeaveStatus(leave.id, 'REJECTED')}
                            className="px-2.5 py-1 rounded bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-[11px] transition-colors"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {leave.status !== 'PENDING' && (
                        <span className="text-[11px] text-slate-400 italic">Completed</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Public Holidays Calendar */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-600" />
              <span>Public Holidays & Comp-Off Rules</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Employees rostered on mandatory holidays receive 2x compensatory off credit.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {holidays.map((h) => (
            <div
              key={h.id}
              className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 flex items-center justify-between"
            >
              <div>
                <div className="font-bold text-slate-800 text-xs">{h.name}</div>
                <div className="text-[11px] font-mono text-indigo-600 mt-0.5">{h.date}</div>
              </div>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  h.isMandatoryHoliday ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {h.isMandatoryHoliday ? 'Mandatory Off' : 'Comp-Off Rotation'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Submit Leave Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-800">Submit Time-Off Request</h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Employee</label>
                <select
                  value={leaveForm.employeeId}
                  onChange={(e) => setLeaveForm({ ...leaveForm, employeeId: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg bg-white"
                >
                  {employees.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.fullName} ({e.employeeCode})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Leave Type</label>
                <select
                  value={leaveForm.type}
                  onChange={(e) => setLeaveForm({ ...leaveForm, type: e.target.value as LeaveType })}
                  className="w-full px-3 py-2 border rounded-lg bg-white"
                >
                  <option value="CASUAL">Casual Leave (CL)</option>
                  <option value="SICK">Sick Leave (SL)</option>
                  <option value="EARNED">Earned Privilege Leave (PL)</option>
                  <option value="COMP_OFF">Compensatory Off</option>
                  <option value="UNPAID">Leave Without Pay (LWP)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={leaveForm.startDate}
                    onChange={(e) => setLeaveForm({ ...leaveForm, startDate: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={leaveForm.endDate}
                    onChange={(e) => setLeaveForm({ ...leaveForm, endDate: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Reason</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Provide context for the requested absence..."
                  value={leaveForm.reason}
                  onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
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
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
