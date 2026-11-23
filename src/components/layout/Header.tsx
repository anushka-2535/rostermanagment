import React from 'react';
import {
  Search,
  Bell,
  Calendar,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useRoster } from '../../context/RosterContext';
import { ThemeToggle } from '../theme/ThemeToggle';

const TAB_TITLES: Record<string, { title: string; subtitle: string }> = {
  // Admin Tabs
  dashboard: { title: 'Company Overview Dashboard', subtitle: 'Global workforce deployment, SLA coverage & operational metrics' },
  employees: { title: 'Employee Management', subtitle: 'Manage agents, specialists, leads, and brand certifications' },
  brands: { title: 'Brand Management', subtitle: 'Single-resource and multi-resource brands, SLAs & working rules' },
  processes: { title: 'Process Management', subtitle: 'CS, ACC, NDR, Retention, shift minimums & operating days' },
  pods: { title: 'Pod Management', subtitle: 'Pod hierarchy, leads, member rosters, and operational clusters' },
  leaves: { title: 'Availability & Leaves', subtitle: 'Approved time-offs, public holidays, and weekly-off settings' },
  generator: { title: 'Roster Planner', subtitle: 'Generate shifts and optimize workforce distribution across 5 perspectives' },
  conflicts: { title: 'Validation & Conflicts', subtitle: 'Staffing deficits, SLA risks, and rest rule violations' },
  editor: { title: 'Roster Manual Adjustments', subtitle: 'Fine-tune daily assignments, shift swaps, and backup staff' },
  settings: { title: 'System & Operational Settings', subtitle: 'Database configuration, local storage state, and business rules' },

  // Pod Lead Tabs
  lead_dashboard: { title: 'Pod Lead Dashboard', subtitle: 'Real-time floor strength and operations for your assigned pod' },
  lead_roster: { title: 'Team Roster Calendar', subtitle: 'Monthly shift schedule scoped to your pod members' },
  lead_leaves: { title: 'Team Leave Requests', subtitle: 'Review time-off requests and verify shift coverage impact' },

  // Employee Tabs
  employee_schedule: { title: 'My Monthly Schedule', subtitle: 'Personal work shifts, assigned brand/process, weekly offs & holidays' },
  employee_leaves: { title: 'My Leaves & Requests', subtitle: 'Submit time-off requests and track approval status' },
};

export const Header: React.FC = () => {
  const { currentUser, logout, loginAsDemo } = useAuth();
  const {
    activeTab,
    selectedMonth,
    selectedYear,
    setSelectedMonth,
    setSelectedYear,
    searchQuery,
    setSearchQuery,
    conflicts,
    setActiveTab,
  } = useRoster();

  const userRole = currentUser?.role || 'ADMIN';
  const unresolvedAlerts = conflicts.filter((c) => !c.isResolved);
  const currentTabInfo = TAB_TITLES[activeTab] || { title: 'Workforce Operations', subtitle: '' };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  return (
    <header className="h-16 shrink-0 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Title & Tab Info */}
      <div className="flex min-w-0 flex-col">
        <h1 className="truncate text-lg font-bold leading-tight text-slate-800">
          {currentTabInfo.title}
        </h1>
        <p className="hidden text-xs text-slate-500 sm:block">
          {currentTabInfo.subtitle}
        </p>
      </div>

      {/* Middle & Right Controls */}
      <div className="flex items-center gap-3">
        {/* Search Bar (Admin & Lead) */}
        {userRole !== 'EMPLOYEE' && (
          <div className="relative w-56 hidden md:block">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Quick search..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>
        )}

        {/* Month Selector for Rostering */}
        <div className="flex items-center bg-slate-100 rounded-lg p-1 border border-slate-200 text-xs">
          <div className="flex items-center gap-1 px-2 text-slate-600 font-medium">
            <Calendar className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden sm:inline">Month:</span>
          </div>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="bg-white rounded px-2 py-1 text-slate-800 font-semibold border-none text-xs focus:ring-1 focus:ring-indigo-500 cursor-pointer"
          >
            {monthNames.map((name, idx) => (
              <option key={name} value={idx + 1}>
                {name}
              </option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="bg-white rounded px-2 py-1 text-slate-800 font-semibold border-none text-xs ml-1 focus:ring-1 focus:ring-indigo-500 cursor-pointer"
          >
            <option value={2026}>2026</option>
            <option value={2027}>2027</option>
          </select>
        </div>

        {/* Conflicts Alert Button (Admin only) */}
        {userRole === 'ADMIN' && (
          <button
            onClick={() => setActiveTab('conflicts')}
            title="Validation & Conflict Center"
            className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unresolvedAlerts.length > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-600 text-[10px] font-bold text-white items-center justify-center">
                  {unresolvedAlerts.length}
                </span>
              </span>
            )}
          </button>
        )}

        <ThemeToggle />

        {/* User Identity Pill */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs ring-2 ring-indigo-100">
            {currentUser?.avatarInitials || 'U'}
          </div>
          <div className="hidden lg:block text-left text-xs">
            <div className="font-semibold text-slate-800 leading-none">
              {currentUser?.name || 'User'}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5 font-medium">
              {currentUser?.role === 'ADMIN'
                ? 'Admin / Ops Manager'
                : currentUser?.role === 'POD_LEAD'
                ? 'Pod Alpha Lead'
                : 'Employee / Specialist'}
            </div>
          </div>

          <button
            onClick={logout}
            title="Sign Out"
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors ml-1"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
