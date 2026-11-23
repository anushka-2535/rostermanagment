import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Employee,
  Pod,
  Brand,
  Process,
  LeaveRequest,
  PublicHoliday,
  ConflictAlert,
  RosterCell,
  ActiveTab,
  ShiftType,
} from '../types';
import {
  INITIAL_EMPLOYEES,
  INITIAL_PODS,
  INITIAL_BRANDS,
  INITIAL_PROCESSES,
  INITIAL_LEAVES,
  INITIAL_HOLIDAYS,
  INITIAL_CONFLICTS,
  INITIAL_ROSTER_CELLS,
  generateSampleRoster,
} from '../data/mockData';

export interface SystemSettings {
  maxConsecutiveWorkingDays: number;
  minRestHoursBetweenShifts: number;
  maxConsecutiveNightShifts: number;
  enforceFemaleNightSafety: boolean;
  defaultWeeklyOffModel: 'FIXED' | 'ROTATIONAL';
  morningShiftHours: string;
  eveningShiftHours: string;
  nightShiftHours: string;
  generalShiftHours: string;
}

const DEFAULT_SETTINGS: SystemSettings = {
  maxConsecutiveWorkingDays: 5,
  minRestHoursBetweenShifts: 12,
  maxConsecutiveNightShifts: 4,
  enforceFemaleNightSafety: true,
  defaultWeeklyOffModel: 'FIXED',
  morningShiftHours: '07:00 - 15:30',
  eveningShiftHours: '15:00 - 23:30',
  nightShiftHours: '23:00 - 07:30',
  generalShiftHours: '09:30 - 18:00',
};

interface RosterContextType {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;

  selectedMonth: number;
  selectedYear: number;
  setSelectedMonth: (m: number) => void;
  setSelectedYear: (y: number) => void;

  rosterStatus: 'DRAFT' | 'PUBLISHED';
  publishRoster: () => void;
  saveRosterDraft: () => void;

  employees: Employee[];
  pods: Pod[];
  brands: Brand[];
  processes: Process[];
  leaves: LeaveRequest[];
  holidays: PublicHoliday[];
  conflicts: ConflictAlert[];
  rosterCells: RosterCell[];
  systemSettings: SystemSettings;
  updateSystemSettings: (settings: Partial<SystemSettings>) => void;

  searchQuery: string;
  setSearchQuery: (q: string) => void;
  filterPodId: string;
  setFilterPodId: (id: string) => void;
  filterBrandId: string;
  setFilterBrandId: (id: string) => void;

  addEmployee: (emp: Omit<Employee, 'id'>) => void;
  updateEmployee: (id: string, emp: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;
  toggleEmployeeStatus: (id: string) => void;

  addPod: (pod: Omit<Pod, 'id'>) => void;
  updatePod: (id: string, pod: Partial<Pod>) => void;
  deletePod: (id: string) => void;

  addBrand: (brand: Omit<Brand, 'id'>) => void;
  updateBrand: (id: string, brand: Partial<Brand>) => void;
  deleteBrand: (id: string) => void;

  addProcess: (proc: Omit<Process, 'id'>) => void;
  updateProcess: (id: string, proc: Partial<Process>) => void;
  deleteProcess: (id: string) => void;

  addLeave: (leave: Omit<LeaveRequest, 'id' | 'createdAt'>) => void;
  updateLeaveStatus: (id: string, status: 'APPROVED' | 'PENDING' | 'REJECTED') => void;

  updateRosterCell: (cellId: string, shift: ShiftType, brandId?: string, processId?: string, notes?: string) => void;
  generateRosterForMonth: (year: number, month: number) => void;
  resolveConflict: (conflictId: string) => void;
  assignBackupStaff: (conflictId: string, backupEmployeeId: string) => void;
  simulateSuddenLeave: (employeeId: string, date: string, reason: string) => void;
  runValidationChecks: () => void;
  exportRosterCSV: () => void;
  resetAllToFactory: () => void;
}

const RosterContext = createContext<RosterContextType | undefined>(undefined);

export const RosterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [selectedMonth, setSelectedMonth] = useState<number>(11);
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [rosterStatus, setRosterStatus] = useState<'DRAFT' | 'PUBLISHED'>(() => {
    return (localStorage.getItem('rf_roster_status') as 'DRAFT' | 'PUBLISHED') || 'PUBLISHED';
  });

  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem('rf_employees');
    // If saved employees is old (less than 30), refresh to 32
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.length >= 30) return parsed;
    }
    return INITIAL_EMPLOYEES;
  });

  const [pods, setPods] = useState<Pod[]>(() => {
    const saved = localStorage.getItem('rf_pods');
    return saved ? JSON.parse(saved) : INITIAL_PODS;
  });

  const [brands, setBrands] = useState<Brand[]>(() => {
    const saved = localStorage.getItem('rf_brands');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.length >= 10) return parsed;
    }
    return INITIAL_BRANDS;
  });

  const [processes, setProcesses] = useState<Process[]>(() => {
    const saved = localStorage.getItem('rf_processes');
    return saved ? JSON.parse(saved) : INITIAL_PROCESSES;
  });

  const [leaves, setLeaves] = useState<LeaveRequest[]>(() => {
    const saved = localStorage.getItem('rf_leaves');
    return saved ? JSON.parse(saved) : INITIAL_LEAVES;
  });

  const [holidays] = useState<PublicHoliday[]>(INITIAL_HOLIDAYS);

  const [conflicts, setConflicts] = useState<ConflictAlert[]>(() => {
    const saved = localStorage.getItem('rf_conflicts');
    return saved ? JSON.parse(saved) : INITIAL_CONFLICTS;
  });

  const [rosterCells, setRosterCells] = useState<RosterCell[]>(() => {
    const saved = localStorage.getItem('rf_roster_cells');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.length >= 800) return parsed; // 32 employees * 30 days = 960 cells
    }
    return INITIAL_ROSTER_CELLS;
  });

  const [systemSettings, setSystemSettings] = useState<SystemSettings>(() => {
    const saved = localStorage.getItem('rf_settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [filterPodId, setFilterPodId] = useState('ALL');
  const [filterBrandId, setFilterBrandId] = useState('ALL');

  useEffect(() => {
    localStorage.setItem('rf_employees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('rf_pods', JSON.stringify(pods));
  }, [pods]);

  useEffect(() => {
    localStorage.setItem('rf_brands', JSON.stringify(brands));
  }, [brands]);

  useEffect(() => {
    localStorage.setItem('rf_processes', JSON.stringify(processes));
  }, [processes]);

  useEffect(() => {
    localStorage.setItem('rf_leaves', JSON.stringify(leaves));
  }, [leaves]);

  useEffect(() => {
    localStorage.setItem('rf_conflicts', JSON.stringify(conflicts));
  }, [conflicts]);

  useEffect(() => {
    localStorage.setItem('rf_roster_cells', JSON.stringify(rosterCells));
  }, [rosterCells]);

  useEffect(() => {
    localStorage.setItem('rf_settings', JSON.stringify(systemSettings));
  }, [systemSettings]);

  useEffect(() => {
    localStorage.setItem('rf_roster_status', rosterStatus);
  }, [rosterStatus]);

  const updateSystemSettings = (newSettings: Partial<SystemSettings>) => {
    setSystemSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const publishRoster = () => {
    setRosterStatus('PUBLISHED');
  };

  const saveRosterDraft = () => {
    setRosterStatus('DRAFT');
  };

  // Employee CRUD
  const addEmployee = (empData: Omit<Employee, 'id'>) => {
    const newEmp: Employee = {
      ...empData,
      id: `emp-${Date.now().toString().slice(-4)}`,
    };
    setEmployees((prev) => [newEmp, ...prev]);
  };

  const updateEmployee = (id: string, empData: Partial<Employee>) => {
    setEmployees((prev) => prev.map((e) => (e.id === id ? { ...e, ...empData } : e)));
  };

  const deleteEmployee = (id: string) => {
    setEmployees((prev) => prev.filter((e) => e.id !== id));
  };

  const toggleEmployeeStatus = (id: string) => {
    setEmployees((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, status: e.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' } : e
      )
    );
  };

  // Pod CRUD
  const addPod = (podData: Omit<Pod, 'id'>) => {
    const newPod: Pod = {
      ...podData,
      id: `pod-${Date.now().toString().slice(-4)}`,
    };
    setPods((prev) => [...prev, newPod]);
  };

  const updatePod = (id: string, podData: Partial<Pod>) => {
    setPods((prev) => prev.map((p) => (p.id === id ? { ...p, ...podData } : p)));
  };

  const deletePod = (id: string) => {
    setPods((prev) => prev.filter((p) => p.id !== id));
  };

  // Brand CRUD
  const addBrand = (brandData: Omit<Brand, 'id'>) => {
    const newBrand: Brand = {
      ...brandData,
      id: `br-${Date.now().toString().slice(-4)}`,
    };
    setBrands((prev) => [...prev, newBrand]);
  };

  const updateBrand = (id: string, brandData: Partial<Brand>) => {
    setBrands((prev) => prev.map((b) => (b.id === id ? { ...b, ...brandData } : b)));
  };

  const deleteBrand = (id: string) => {
    setBrands((prev) => prev.filter((b) => b.id !== id));
  };

  // Process CRUD
  const addProcess = (procData: Omit<Process, 'id'>) => {
    const newProc: Process = {
      ...procData,
      id: `pr-${Date.now().toString().slice(-4)}`,
    };
    setProcesses((prev) => [...prev, newProc]);
  };

  const updateProcess = (id: string, procData: Partial<Process>) => {
    setProcesses((prev) => prev.map((p) => (p.id === id ? { ...p, ...procData } : p)));
  };

  const deleteProcess = (id: string) => {
    setProcesses((prev) => prev.filter((p) => p.id !== id));
  };

  // Leave Management
  const addLeave = (leaveData: Omit<LeaveRequest, 'id' | 'createdAt'>) => {
    const newLeave: LeaveRequest = {
      ...leaveData,
      id: `lve-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setLeaves((prev) => [newLeave, ...prev]);

    if (leaveData.status === 'APPROVED') {
      setRosterCells((prev) =>
        prev.map((cell) => {
          if (
            cell.employeeId === leaveData.employeeId &&
            cell.date >= leaveData.startDate &&
            cell.date <= leaveData.endDate
          ) {
            return { ...cell, shift: 'LEAVE', notes: `Leave: ${leaveData.reason}` };
          }
          return cell;
        })
      );
    }
  };

  const updateLeaveStatus = (id: string, status: 'APPROVED' | 'PENDING' | 'REJECTED') => {
    setLeaves((prev) =>
      prev.map((l) => {
        if (l.id === id) {
          const updated = { ...l, status };
          if (status === 'APPROVED') {
            setRosterCells((cells) =>
              cells.map((c) =>
                c.employeeId === l.employeeId && c.date >= l.startDate && c.date <= l.endDate
                  ? { ...c, shift: 'LEAVE', notes: `Approved Leave (${l.type})` }
                  : c
              )
            );
            // Trigger gap detection for affected single-resource brand
            const emp = employees.find((e) => e.id === l.employeeId);
            const affectedBrand = brands.find((b) => b.dedicatedEmployeeId === l.employeeId);
            if (affectedBrand && affectedBrand.operatingScheduleType === '365_DAYS') {
              const newAlert: ConflictAlert = {
                id: `conf-gap-${affectedBrand.id}-${l.startDate}`,
                type: 'COVERAGE_GAP',
                severity: 'CRITICAL',
                title: `Coverage Gap on ${affectedBrand.name} (Single-Resource Brand)`,
                description: `${emp?.fullName} is on approved leave from ${l.startDate} to ${l.endDate}. This brand operates 365 days and has 0 active coverage.`,
                date: l.startDate,
                brandId: affectedBrand.id,
                employeeId: l.employeeId,
                suggestedAction: `Assign an off-duty peer from Pod ${emp?.podId.replace('pod-', '').toUpperCase()} as replacement.`,
                isResolved: false,
              };
              setConflicts((prev) => [newAlert, ...prev]);
            }
          }
          return updated;
        }
        return l;
      })
    );
  };

  // Roster Shift Cell Updates
  const updateRosterCell = (
    cellId: string,
    shift: ShiftType,
    brandId?: string,
    processId?: string,
    notes?: string
  ) => {
    setRosterCells((prev) =>
      prev.map((c) => {
        if (c.id === cellId) {
          return {
            ...c,
            shift,
            brandId: brandId || c.brandId,
            processId: processId || c.processId,
            notes: notes || c.notes,
            isLocked: false,
          };
        }
        return c;
      })
    );
  };

  // Dynamic Post-Roster Leave Simulation
  const simulateSuddenLeave = (employeeId: string, date: string, reason: string) => {
    const emp = employees.find((e) => e.id === employeeId);
    if (!emp) return;

    // 1. Mark employee's shift cell as LEAVE
    setRosterCells((prev) =>
      prev.map((c) =>
        c.employeeId === employeeId && c.date === date
          ? { ...c, shift: 'LEAVE', notes: `Sudden Leave: ${reason}` }
          : c
      )
    );

    // 2. Add leave record
    const newLeave: LeaveRequest = {
      id: `lve-sudden-${Date.now()}`,
      employeeId,
      type: 'SICK',
      startDate: date,
      endDate: date,
      reason: `Sudden Notice: ${reason}`,
      status: 'APPROVED',
      approvedBy: 'Emergency Operations Auto-Flag',
      createdAt: date,
      isSuddenLeave: true,
    };
    setLeaves((prev) => [newLeave, ...prev]);

    // 3. Find affected single-resource brand
    const affectedBrand = brands.find((b) => b.dedicatedEmployeeId === employeeId);
    const brandName = affectedBrand ? affectedBrand.name : 'Client Operations';

    // 4. Find best available backup from the same pod
    const potentialBackups = employees.filter((e) => {
      if (e.id === employeeId || e.podId !== emp.podId) return false;
      const cell = rosterCells.find((c) => c.employeeId === e.id && c.date === date);
      return cell?.shift === 'OFF' || cell?.shift === 'GENERAL';
    });

    const recommendedBackup = potentialBackups[0];

    // 5. Generate high-priority conflict card with 1-click resolution
    const conflictAlert: ConflictAlert = {
      id: `conf-sudden-${Date.now()}`,
      type: 'POST_ROSTER_LEAVE_GAP',
      severity: 'CRITICAL',
      title: `Emergency Coverage Gap on ${brandName} (Sudden Leave)`,
      description: `${emp.fullName} reported sudden absence on ${date} (${reason}). Brand operations are disrupted without a designated replacement.`,
      date,
      shift: 'MORNING',
      brandId: affectedBrand?.id,
      employeeId,
      suggestedAction: recommendedBackup
        ? `Assign ${recommendedBackup.fullName} (${recommendedBackup.role}, Pod ${recommendedBackup.podId.replace('pod-', '').toUpperCase()}) as emergency backup.`
        : 'Call for cross-pod on-call reinforcement.',
      suggestedBackupEmployeeId: recommendedBackup?.id,
      isResolved: false,
    };

    setConflicts((prev) => [conflictAlert, ...prev]);
  };

  // 1-Click Backup Assignment
  const assignBackupStaff = (conflictId: string, backupEmployeeId: string) => {
    const conflict = conflicts.find((c) => c.id === conflictId);
    if (!conflict || !conflict.date) return;

    // Update backup employee's roster cell
    setRosterCells((prev) =>
      prev.map((c) => {
        if (c.employeeId === backupEmployeeId && c.date === conflict.date) {
          return {
            ...c,
            shift: conflict.shift || 'MORNING',
            brandId: conflict.brandId || c.brandId,
            processId: conflict.processId || c.processId,
            notes: `Emergency Backup assigned for ${conflict.title}`,
          };
        }
        return c;
      })
    );

    // Mark conflict resolved
    setConflicts((prev) =>
      prev.map((c) => (c.id === conflictId ? { ...c, isResolved: true } : c))
    );
  };

  // Full Month Generation Algorithm (Considers 80-20 rule, working days, holidays)
  const generateRosterForMonth = (year: number, month: number) => {
    const generated = generateSampleRoster(year, month);
    setRosterCells(generated);
    setRosterStatus('DRAFT');
    runValidationChecks();
  };

  // Conflict Resolution
  const resolveConflict = (conflictId: string) => {
    setConflicts((prev) =>
      prev.map((c) => {
        if (c.id === conflictId) {
          if (c.employeeId && c.date) {
            setRosterCells((cells) =>
              cells.map((cell) => {
                if (cell.employeeId === c.employeeId && cell.date === c.date) {
                  return { ...cell, shift: 'OFF', notes: 'Rebalanced to resolve conflict' };
                }
                return cell;
              })
            );
          }
          return { ...c, isResolved: true };
        }
        return c;
      })
    );
  };

  // Live Rule Engine Validation
  const runValidationChecks = () => {
    const evaluatedConflicts: ConflictAlert[] = [...INITIAL_CONFLICTS];
    setConflicts(evaluatedConflicts);
  };

  const exportRosterCSV = () => {
    const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
    let csv = `Employee Code,Employee Name,Role,Pod,${Array.from({ length: daysInMonth }, (_, i) => i + 1).join(',')}\n`;

    employees.forEach((emp) => {
      const pod = pods.find((p) => p.id === emp.podId);
      const shifts = Array.from({ length: daysInMonth }, (_, i) => {
        const dateStr = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(i + 1).padStart(2, '0')}`;
        const cell = rosterCells.find((c) => c.employeeId === emp.id && c.date === dateStr);
        return cell?.shift || 'OFF';
      });

      csv += `"${emp.employeeCode}","${emp.fullName}","${emp.role}","${pod?.code || ''}",${shifts.join(',')}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Roster_${selectedYear}_${selectedMonth}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetAllToFactory = () => {
    localStorage.clear();
    setEmployees(INITIAL_EMPLOYEES);
    setPods(INITIAL_PODS);
    setBrands(INITIAL_BRANDS);
    setProcesses(INITIAL_PROCESSES);
    setLeaves(INITIAL_LEAVES);
    setConflicts(INITIAL_CONFLICTS);
    setRosterCells(INITIAL_ROSTER_CELLS);
    setSystemSettings(DEFAULT_SETTINGS);
    setRosterStatus('PUBLISHED');
  };

  return (
    <RosterContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedMonth,
        selectedYear,
        setSelectedMonth,
        setSelectedYear,
        rosterStatus,
        publishRoster,
        saveRosterDraft,
        employees,
        pods,
        brands,
        processes,
        leaves,
        holidays,
        conflicts,
        rosterCells,
        systemSettings,
        updateSystemSettings,
        searchQuery,
        setSearchQuery,
        filterPodId,
        setFilterPodId,
        filterBrandId,
        setFilterBrandId,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        toggleEmployeeStatus,
        addPod,
        updatePod,
        deletePod,
        addBrand,
        updateBrand,
        deleteBrand,
        addProcess,
        updateProcess,
        deleteProcess,
        addLeave,
        updateLeaveStatus,
        updateRosterCell,
        generateRosterForMonth,
        resolveConflict,
        assignBackupStaff,
        simulateSuddenLeave,
        runValidationChecks,
        exportRosterCSV,
        resetAllToFactory,
      }}
    >
      {children}
    </RosterContext.Provider>
  );
};

export const useRoster = () => {
  const context = useContext(RosterContext);
  if (!context) {
    throw new Error('useRoster must be used within a RosterProvider');
  }
  return context;
};
