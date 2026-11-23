import React, { useState } from 'react';
import {
  CalendarOff,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useRoster } from '../../../context/RosterContext';

export const PodLeavesView: React.FC = () => {
  const { currentUser } = useAuth();
  const { employees, pods, leaves, rosterCells, updateLeaveStatus } = useRoster();

  const userPodId = currentUser?.podId || 'pod-alpha';
  const pod = pods.find((p) => p.id === userPodId) || pods[0];
  const podEmployees = employees.filter((e) => e.podId === userPodId);
  const podEmpIds = podEmployees.map((e) => e.id);

  const [impactMessage, setImpactMessage] = useState<string | null>(null);

  // Filter leaves submitted by this pod's members
  const podLeaves = leaves.filter((l) => podEmpIds.includes(l.employeeId));

  const checkCoverageImpact = (empId: string, startDate: string, endDate: string) => {
    const emp = employees.find((e) => e.id === empId);
    // Find how many peers in the same pod are scheduled on that day
    const scheduledPeersCount = rosterCells.filter(
      (c) =>
        podEmpIds.includes(c.employeeId) &&
        c.employeeId !== empId &&
        c.date === startDate &&
        ['MORNING', 'EVENING', 'NIGHT', 'GENERAL'].includes(c.shift)
    ).length;

    if (scheduledPeersCount < 2) {
      setImpactMessage(
        `⚠️ High Coverage Warning: Approving leave for ${emp?.fullName} on ${startDate} reduces active pod floor strength to ${scheduledPeersCount} staff. Please ensure peer backup.`
      );
    } else {
      setImpactMessage(
        `✅ Safe to Approve: Pod Alpha maintains ${scheduledPeersCount} active staff on ${startDate}. SLA criteria satisfied.`
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <CalendarOff className="w-5 h-5 text-indigo-600" />
            <span>{pod?.name} — Leave Requests & Coverage Impact</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Review time-off requests from your pod members and evaluate real-time impact on shift coverage before approving.
          </p>
        </div>
      </div>

      {impactMessage && (
        <div className="p-4 rounded-xl bg-slate-900 text-white text-xs flex items-center justify-between border border-slate-800 shadow-md">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>{impactMessage}</span>
          </div>
          <button
            onClick={() => setImpactMessage(null)}
            className="text-slate-400 hover:text-white text-xs underline ml-4"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Pod Leave Requests Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-200">
          <h3 className="text-sm font-bold text-slate-800">
            Pod Member Requests Queue ({podLeaves.length})
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Decisions automatically update the live monthly roster
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
              <tr>
                <th className="py-3 px-4">Pod Member</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Dates</th>
                <th className="py-3 px-4">Reason</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Coverage Check</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {podLeaves.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No time-off requests pending for members of {pod?.name}.
                  </td>
                </tr>
              ) : (
                podLeaves.map((leave) => {
                  const emp = employees.find((e) => e.id === leave.employeeId);

                  return (
                    <tr key={leave.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4 font-medium text-slate-900">
                        <div className="font-bold text-slate-800">{emp?.fullName}</div>
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
                      <td className="py-3 px-4">
                        <button
                          onClick={() =>
                            checkCoverageImpact(leave.employeeId, leave.startDate, leave.endDate)
                          }
                          className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[11px] font-semibold rounded transition-colors"
                        >
                          Check Impact
                        </button>
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
                          <span className="text-[11px] text-slate-400 italic">Resolved</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
