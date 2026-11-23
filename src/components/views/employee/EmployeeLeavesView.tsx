import React, { useState } from 'react';
import {
  CalendarOff,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Send,
  Calendar,
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useRoster } from '../../../context/RosterContext';
import { LeaveType } from '../../../types';

export const EmployeeLeavesView: React.FC = () => {
  const { currentUser } = useAuth();
  const { employees, leaves, addLeave } = useRoster();

  const empId = currentUser?.employeeId || 'emp-002';
  const employee = employees.find((e) => e.id === empId) || employees[1];

  const [leaveType, setLeaveType] = useState<LeaveType>('CASUAL');
  const [startDate, setStartDate] = useState('2026-11-28');
  const [endDate, setEndDate] = useState('2026-11-29');
  const [reason, setReason] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filter this employee's leave requests
  const myLeaves = leaves.filter((l) => l.employeeId === empId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;

    addLeave({
      employeeId: empId,
      type: leaveType,
      startDate,
      endDate,
      reason,
      status: 'PENDING',
    });

    setReason('');
    setToastMessage('Leave request submitted successfully! Your Pod Lead has been notified.');
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <CalendarOff className="w-5 h-5 text-indigo-600" />
            <span>My Leave & Time-Off Portal</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Submit time-off requests, check approval progress, and review your annual leave entitlements.
          </p>
        </div>
      </div>

      {toastMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Grid: Request Form + History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Submit Form */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800 border-b pb-3 flex items-center gap-2">
            <Plus className="w-4 h-4 text-indigo-600" />
            <span>Apply for Time-Off</span>
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Leave Category</label>
              <select
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value as LeaveType)}
                className="w-full px-3 py-2 border rounded-lg bg-white"
              >
                <option value="CASUAL">Casual Leave (CL)</option>
                <option value="SICK">Sick / Medical Leave (SL)</option>
                <option value="EARNED">Earned Privilege Leave (PL)</option>
                <option value="COMP_OFF">Compensatory Off</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">From</label>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">To</label>
                <input
                  type="date"
                  required
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Reason for Absence</label>
              <textarea
                rows={3}
                required
                placeholder="State reason for requested time-off..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Submit to Pod Lead</span>
            </button>
          </form>
        </div>

        {/* Leave Requests Pipeline History */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-800">My Leave Applications History</h3>
              <p className="text-xs text-slate-500 mt-0.5">Track status of past and current requests</p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
              {myLeaves.length} Records
            </span>
          </div>

          <div className="space-y-3">
            {myLeaves.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed">
                You haven't submitted any leave requests yet.
              </div>
            ) : (
              myLeaves.map((lve) => (
                <div
                  key={lve.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors flex items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800">{lve.type} Leave</span>
                      <span className="text-slate-400 font-mono text-[11px]">
                        {lve.startDate} &rarr; {lve.endDate}
                      </span>
                    </div>
                    <p className="text-slate-600 text-xs">{lve.reason}</p>
                    {lve.approvedBy && (
                      <span className="text-[10px] text-emerald-700 block">
                        Reviewed & Approved by {lve.approvedBy}
                      </span>
                    )}
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-[11px] font-bold flex-shrink-0 ${
                      lve.status === 'APPROVED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : lve.status === 'PENDING'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {lve.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
