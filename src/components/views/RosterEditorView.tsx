import React, { useState } from 'react';
import {
  FileEdit,
  ArrowRightLeft,
  Users,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Calendar,
} from 'lucide-react';
import { useRoster } from '../../context/RosterContext';
import { ShiftType, SHIFT_DETAILS } from '../../types';

interface AuditLogEntry {
  id: string;
  timestamp: string;
  employeeName: string;
  date: string;
  oldShift: ShiftType;
  newShift: ShiftType;
  reason: string;
}

export const RosterEditorView: React.FC = () => {
  const {
    employees,
    rosterCells,
    updateRosterCell,
    selectedMonth,
    selectedYear,
  } = useRoster();

  const [selectedEmpId, setSelectedEmpId] = useState<string>(employees[0]?.id || '');
  const [selectedDate, setSelectedDate] = useState<string>('2026-11-25');
  const [targetShift, setTargetShift] = useState<ShiftType>('MORNING');
  const [reason, setReason] = useState<string>('Operational swap for peak coverage');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([
    {
      id: 'aud-1',
      timestamp: 'Today at 18:24',
      employeeName: 'Rahul Verma',
      date: '2026-11-23',
      oldShift: 'EVENING',
      newShift: 'MORNING',
      reason: 'Covering VIP client audit morning session.',
    },
    {
      id: 'aud-2',
      timestamp: 'Yesterday at 14:10',
      employeeName: 'Sneha Deshmukh',
      date: '2026-11-22',
      oldShift: 'MORNING',
      newShift: 'OFF',
      reason: 'Comp-off granted for Sunday on-call duty.',
    },
  ]);

  const selectedEmployee = employees.find((e) => e.id === selectedEmpId);
  const currentCell = rosterCells.find(
    (c) => c.employeeId === selectedEmpId && c.date === selectedDate
  );
  const currentShift = currentCell?.shift || 'OFF';

  // Backup suggestion: Find employees certified in same brand who have OFF on this date
  const eligibleBackups = employees.filter((emp) => {
    if (emp.id === selectedEmpId) return false;
    const isSameBrand = emp.certifiedBrandIds.some((b) =>
      selectedEmployee?.certifiedBrandIds.includes(b)
    );
    const empCell = rosterCells.find((c) => c.employeeId === emp.id && c.date === selectedDate);
    const isAvailable = empCell?.shift === 'OFF' || empCell?.shift === 'GENERAL';
    return isSameBrand && isAvailable;
  });

  const handleApplyShiftChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCell || !selectedEmployee) return;

    updateRosterCell(currentCell.id, targetShift, reason);

    const newLog: AuditLogEntry = {
      id: `aud-${Date.now()}`,
      timestamp: 'Just now',
      employeeName: selectedEmployee.fullName,
      date: selectedDate,
      oldShift: currentShift,
      newShift: targetShift,
      reason: reason,
    };

    setAuditLog([newLog, ...auditLog]);
    setSuccessToast(
      `Shift updated for ${selectedEmployee.fullName} to ${targetShift} on ${selectedDate}!`
    );
    setTimeout(() => setSuccessToast(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <FileEdit className="w-5 h-5 text-indigo-600" />
          <span>Roster Manual Adjustments & Change Handling</span>
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Execute manual shift swaps, assign emergency coverage, and review intelligent backup recommendations.
        </p>
      </div>

      {successToast && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Main Grid: Shift Editor Form + Backup Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Editor Form */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800 border-b pb-3">
            Modify Specific Employee Shift Assignment
          </h3>

          <form onSubmit={handleApplyShiftChange} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Employee</label>
                <select
                  value={selectedEmpId}
                  onChange={(e) => setSelectedEmpId(e.target.value)}
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
                <label className="block font-semibold text-slate-700 mb-1">Target Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>

            {/* Current Status Box */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400 block">Current Assigned Shift</span>
                <span className="font-bold text-slate-800 text-sm">
                  {SHIFT_DETAILS[currentShift]?.label || currentShift}
                </span>
                <span className="text-xs text-slate-500 block mt-0.5">
                  Time: {SHIFT_DETAILS[currentShift]?.timeWindow}
                </span>
              </div>
              <ArrowRightLeft className="w-5 h-5 text-indigo-500" />
              <div>
                <span className="text-[11px] text-slate-400 block">New Shift Assignment</span>
                <select
                  value={targetShift}
                  onChange={(e) => setTargetShift(e.target.value as ShiftType)}
                  className="mt-1 px-3 py-1.5 border rounded-lg font-bold text-indigo-700 bg-white"
                >
                  <option value="MORNING">Morning (07:00 - 15:30)</option>
                  <option value="EVENING">Evening (15:00 - 23:30)</option>
                  <option value="NIGHT">Night (23:00 - 07:30)</option>
                  <option value="GENERAL">General (09:30 - 18:00)</option>
                  <option value="OFF">Weekly Off (OFF)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Change Reason / Audit Note</label>
              <input
                type="text"
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. Backfill for emergency leave request"
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
            >
              Commit Shift Modification & Revalidate
            </button>
          </form>
        </div>

        {/* Intelligent Backup Suggestions */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Recommended Backups</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Cross-certified peers available on {selectedDate}
            </p>
          </div>

          <div className="space-y-3">
            {eligibleBackups.length === 0 ? (
              <div className="p-4 bg-slate-50 border rounded-lg text-xs text-slate-500 text-center">
                No off-duty peers certified for this brand found on this date.
              </div>
            ) : (
              eligibleBackups.slice(0, 4).map((backup) => (
                <div
                  key={backup.id}
                  className="p-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800">{backup.fullName}</span>
                    <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                      Available
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Role: {backup.role} &bull; {backup.employeeCode}
                  </div>
                  <button
                    onClick={() => {
                      setSelectedEmpId(backup.id);
                      setTargetShift('MORNING');
                      setReason(`Assigned as replacement backup for ${selectedEmployee?.fullName}`);
                    }}
                    className="w-full mt-1 py-1 rounded bg-white hover:bg-indigo-50 border border-slate-300 text-indigo-600 text-[11px] font-semibold transition-colors"
                  >
                    Select as Replacement
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Change Audit Trail */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-slate-800">Operational Audit Trail</h3>
        <div className="divide-y divide-slate-100 text-xs">
          {auditLog.map((log) => (
            <div key={log.id} className="py-2.5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-indigo-600"></div>
                <div>
                  <span className="font-semibold text-slate-800">{log.employeeName}</span>
                  <span className="text-slate-500 mx-1.5">on {log.date}:</span>
                  <span className="font-mono text-slate-600">
                    {log.oldShift} &rarr; <strong>{log.newShift}</strong>
                  </span>
                  <div className="text-[11px] text-slate-400 mt-0.5">{log.reason}</div>
                </div>
              </div>
              <span className="text-[11px] text-slate-400 whitespace-nowrap">{log.timestamp}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
