import React, { useState } from 'react';
import {
  Settings,
  HardDrive,
  ShieldCheck,
  CheckCircle2,
  Sliders,
  Download,
  Upload,
  Clock,
  Calendar,
  Shield,
  Save,
} from 'lucide-react';
import { useRoster } from '../../context/RosterContext';

export const SettingsView: React.FC = () => {
  const {
    employees,
    pods,
    brands,
    processes,
    rosterCells,
    systemSettings,
    updateSystemSettings,
  } = useRoster();

  const [localSettings, setLocalSettings] = useState(systemSettings);
  const [saveToast, setSaveToast] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSystemSettings(localSettings);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  const handleExportJSON = () => {
    const data = {
      employees,
      pods,
      brands,
      processes,
      rosterCells,
      systemSettings,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rosterflow_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.employees && parsed.rosterCells) {
          localStorage.setItem('rf_employees', JSON.stringify(parsed.employees));
          localStorage.setItem('rf_pods', JSON.stringify(parsed.pods));
          localStorage.setItem('rf_brands', JSON.stringify(parsed.brands));
          localStorage.setItem('rf_processes', JSON.stringify(parsed.processes));
          localStorage.setItem('rf_roster_cells', JSON.stringify(parsed.rosterCells));
          alert('System configuration restored successfully! Reloading...');
          window.location.reload();
        } else {
          alert('Invalid backup file format.');
        }
      } catch (err) {
        alert('Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Settings className="w-5 h-5 text-indigo-600" />
            <span>System & Operational Rules Configuration</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure labor compliance thresholds, shift timings, weekly off models, and backup/restore data.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportJSON}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Backup</span>
          </button>
          <label className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer">
            <Upload className="w-3.5 h-3.5" />
            <span>Restore Backup</span>
            <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
          </label>
        </div>
      </div>

      {saveToast && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>Operational rules updated successfully! Scheduling engine will enforce these parameters.</span>
        </div>
      )}

      {/* Rules Config Form */}
      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Scheduling Constraints */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 border-b pb-3">
            <Sliders className="w-4 h-4 text-indigo-600" />
            <span>Workforce Scheduling & Rest Constraints</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Max Consecutive Working Days
              </label>
              <input
                type="number"
                min="3"
                max="7"
                value={localSettings.maxConsecutiveWorkingDays}
                onChange={(e) =>
                  setLocalSettings({
                    ...localSettings,
                    maxConsecutiveWorkingDays: Number(e.target.value),
                  })
                }
                className="w-full px-3 py-2 border rounded-lg bg-slate-50 font-bold text-slate-800"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                Triggers warning if an agent is scheduled for more than {localSettings.maxConsecutiveWorkingDays} days.
              </span>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Min Rest Hours Between Shifts
              </label>
              <input
                type="number"
                min="8"
                max="24"
                value={localSettings.minRestHoursBetweenShifts}
                onChange={(e) =>
                  setLocalSettings({
                    ...localSettings,
                    minRestHoursBetweenShifts: Number(e.target.value),
                  })
                }
                className="w-full px-3 py-2 border rounded-lg bg-slate-50 font-bold text-slate-800"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                Standard mandatory turnaround rest interval (Default: 12h).
              </span>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Max Consecutive Night Shifts
              </label>
              <input
                type="number"
                min="1"
                max="6"
                value={localSettings.maxConsecutiveNightShifts}
                onChange={(e) =>
                  setLocalSettings({
                    ...localSettings,
                    maxConsecutiveNightShifts: Number(e.target.value),
                  })
                }
                className="w-full px-3 py-2 border rounded-lg bg-slate-50 font-bold text-slate-800"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                Night shift rotations must trigger 48h rest after this limit.
              </span>
            </div>
          </div>

          <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
              <div>
                <span className="font-semibold text-slate-800 block">
                  Night Shift Female Transport Safety Policy
                </span>
                <span className="text-[11px] text-slate-500">
                  Enforces security compliance and escort transport for night rosters.
                </span>
              </div>
              <input
                type="checkbox"
                checked={localSettings.enforceFemaleNightSafety}
                onChange={(e) =>
                  setLocalSettings({
                    ...localSettings,
                    enforceFemaleNightSafety: e.target.checked,
                  })
                }
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
              />
            </div>

            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center">
              <div className="min-w-0">
                <span className="font-semibold text-slate-800 block">
                  Default Weekly Off Allocation
                </span>
                <span className="text-[11px] text-slate-500">
                  Fixed weekend day vs rotational distributed offs.
                </span>
              </div>
              <select
                value={localSettings.defaultWeeklyOffModel}
                onChange={(e) =>
                  setLocalSettings({
                    ...localSettings,
                    defaultWeeklyOffModel: e.target.value as any,
                  })
                }
                className="w-full max-w-full px-2 py-1 border rounded bg-white font-semibold text-slate-800 sm:w-auto"
              >
                <option value="FIXED">Fixed Designated Day</option>
                <option value="ROTATIONAL">Balanced Rotational</option>
              </select>
            </div>
          </div>
        </div>

        {/* Standard Shift Timings */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 border-b pb-3">
            <Clock className="w-4 h-4 text-indigo-600" />
            <span>Configurable Operational Shift Timings</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block font-semibold text-sky-700 mb-1">Morning Shift Window</label>
              <input
                type="text"
                value={localSettings.morningShiftHours}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, morningShiftHours: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg bg-sky-50 font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold text-amber-700 mb-1">Evening Shift Window</label>
              <input
                type="text"
                value={localSettings.eveningShiftHours}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, eveningShiftHours: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg bg-amber-50 font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold text-purple-700 mb-1">Night Shift Window</label>
              <input
                type="text"
                value={localSettings.nightShiftHours}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, nightShiftHours: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg bg-purple-50 font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold text-emerald-700 mb-1">General Shift Window</label>
              <input
                type="text"
                value={localSettings.generalShiftHours}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, generalShiftHours: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg bg-emerald-50 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3">
          <button
            type="submit"
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md shadow-indigo-600/20 flex items-center gap-2 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Operational Rules</span>
          </button>
        </div>
      </form>

    </div>
  );
};
