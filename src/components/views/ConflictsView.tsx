import React, { useState } from 'react';
import {
  AlertTriangle,
  ShieldAlert,
  AlertCircle,
  Info,
  CheckCircle2,
  RefreshCw,
  ArrowRight,
  Sparkles,
  Calendar,
  Briefcase,
} from 'lucide-react';
import { useRoster } from '../../context/RosterContext';
import { ConflictAlert } from '../../types';

export const ConflictsView: React.FC = () => {
  const {
    conflicts,
    employees,
    brands,
    processes,
    resolveConflict,
    assignBackupStaff,
    runValidationChecks,
  } = useRoster();

  const [activeSeverityFilter, setActiveSeverityFilter] = useState<'ALL' | 'CRITICAL' | 'WARNING' | 'INFO'>('ALL');
  const [justResolvedId, setJustResolvedId] = useState<string | null>(null);

  const criticalCount = conflicts.filter((c) => !c.isResolved && c.severity === 'CRITICAL').length;
  const warningCount = conflicts.filter((c) => !c.isResolved && c.severity === 'WARNING').length;
  const infoCount = conflicts.filter((c) => !c.isResolved && c.severity === 'INFO').length;

  const filteredConflicts = conflicts.filter((c) => {
    if (activeSeverityFilter === 'ALL') return true;
    return c.severity === activeSeverityFilter;
  });

  const handleResolve = (conflict: ConflictAlert) => {
    setJustResolvedId(conflict.id);
    if (conflict.suggestedBackupEmployeeId) {
      assignBackupStaff(conflict.id, conflict.suggestedBackupEmployeeId);
    } else {
      resolveConflict(conflict.id);
    }
    setTimeout(() => setJustResolvedId(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-600" />
            <span>Validation & Conflict Detection Engine</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated compliance verification against staffing SLAs, labor rest limits, and skill requirements.
          </p>
        </div>

        <button
          onClick={runValidationChecks}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm flex items-center gap-2 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Re-evaluate All Rules</span>
        </button>
      </div>

      {/* Severity Filter Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <button
          onClick={() => setActiveSeverityFilter('ALL')}
          className={`p-4 rounded-xl border text-left transition-all ${
            activeSeverityFilter === 'ALL'
              ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
          }`}
        >
          <span className="text-xs font-semibold opacity-70 block uppercase">All Alerts</span>
          <span className="text-2xl font-bold">{conflicts.length}</span>
          <span className="text-[11px] opacity-80 block mt-1">Audit status</span>
        </button>

        <button
          onClick={() => setActiveSeverityFilter('CRITICAL')}
          className={`p-4 rounded-xl border text-left transition-all ${
            activeSeverityFilter === 'CRITICAL'
              ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
              : 'bg-white text-slate-700 border-slate-200 hover:border-rose-300'
          }`}
        >
          <span className="text-xs font-semibold opacity-70 block uppercase">Critical Deficits</span>
          <span className="text-2xl font-bold text-rose-600 group-hover:text-rose-700">
            {criticalCount}
          </span>
          <span className="text-[11px] opacity-80 block mt-1">Immediate SLA risk</span>
        </button>

        <button
          onClick={() => setActiveSeverityFilter('WARNING')}
          className={`p-4 rounded-xl border text-left transition-all ${
            activeSeverityFilter === 'WARNING'
              ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
              : 'bg-white text-slate-700 border-slate-200 hover:border-amber-300'
          }`}
        >
          <span className="text-xs font-semibold opacity-70 block uppercase">Policy Warnings</span>
          <span className="text-2xl font-bold text-amber-600">{warningCount}</span>
          <span className="text-[11px] opacity-80 block mt-1">Rest or consecutive days</span>
        </button>

        <button
          onClick={() => setActiveSeverityFilter('INFO')}
          className={`p-4 rounded-xl border text-left transition-all ${
            activeSeverityFilter === 'INFO'
              ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
              : 'bg-white text-slate-700 border-slate-200 hover:border-sky-300'
          }`}
        >
          <span className="text-xs font-semibold opacity-70 block uppercase">Advisory</span>
          <span className="text-2xl font-bold text-sky-600">{infoCount}</span>
          <span className="text-[11px] opacity-80 block mt-1">Supervision suggestions</span>
        </button>
      </div>

      {/* Conflict Cards List */}
      <div className="space-y-4">
        {filteredConflicts.map((conflict) => {
          const emp = employees.find((e) => e.id === conflict.employeeId);
          const brand = brands.find((b) => b.id === conflict.brandId);
          const proc = processes.find((p) => p.id === conflict.processId);

          return (
            <div
              key={conflict.id}
              className={`p-5 rounded-xl border bg-white shadow-sm transition-all ${
                conflict.isResolved
                  ? 'border-emerald-200 bg-emerald-50/30 opacity-75'
                  : conflict.severity === 'CRITICAL'
                  ? 'border-rose-200 hover:border-rose-300'
                  : conflict.severity === 'WARNING'
                  ? 'border-amber-200 hover:border-amber-300'
                  : 'border-sky-200 hover:border-sky-300'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        conflict.severity === 'CRITICAL'
                          ? 'bg-rose-100 text-rose-800'
                          : conflict.severity === 'WARNING'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-sky-100 text-sky-800'
                      }`}
                    >
                      {conflict.severity}
                    </span>
                    <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {conflict.date}
                    </span>
                    {conflict.shift && (
                      <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
                        Shift: {conflict.shift}
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm">{conflict.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{conflict.description}</p>

                  {/* Impacted entities */}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
                    {emp && (
                      <span className="font-medium text-slate-700">
                        Employee: <strong>{emp.fullName}</strong> ({emp.employeeCode})
                      </span>
                    )}
                    {brand && (
                      <span className="font-medium text-slate-700">
                        Brand: <strong>{brand.name}</strong>
                      </span>
                    )}
                    {proc && (
                      <span className="font-medium text-slate-700">
                        Process: <strong>{proc.name}</strong>
                      </span>
                    )}
                  </div>

                  {/* Suggested Action Box */}
                  {conflict.suggestedAction && (
                    <div className="mt-2 p-3 rounded-lg bg-slate-50 border border-slate-200/80 text-xs text-slate-700 flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-indigo-900 block">Recommended Resolution:</span>
                        <span>{conflict.suggestedAction}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-end justify-center self-start md:self-center">
                  {conflict.isResolved ? (
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Resolved</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleResolve(conflict)}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-2 transition-all cursor-pointer hover:shadow-md"
                    >
                      <span>Apply Resolution</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
