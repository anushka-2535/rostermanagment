import React from 'react';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Layers,
  Boxes,
  CalendarOff,
  CalendarCheck,
  AlertTriangle,
  Settings,
  LogOut,
  ChevronRight,
  PanelLeftClose,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useRoster } from '../../context/RosterContext';
import { ActiveTab, UserRole } from '../../types';

interface NavItem {
  id: ActiveTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number | string;
  badgeColor?: string;
  description: string;
}

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const { currentUser, logout } = useAuth();
  const { activeTab, setActiveTab, conflicts, leaves, employees } = useRoster();

  const userRole: UserRole = currentUser?.role || 'ADMIN';
  const unresolvedConflictsCount = conflicts.filter((c) => !c.isResolved && c.severity === 'CRITICAL').length;

  // Pod lead scoped pending leaves count
  const podEmpIds = employees
    .filter((e) => e.podId === (currentUser?.podId || 'pod-alpha'))
    .map((e) => e.id);
  const podPendingLeavesCount = leaves.filter(
    (l) => podEmpIds.includes(l.employeeId) && l.status === 'PENDING'
  ).length;

  // Build role-based navigation items strictly
  const getNavItems = (): NavItem[] => {
    switch (userRole) {
      case 'ADMIN':
        return [
          {
            id: 'dashboard',
            label: 'Dashboard',
            icon: LayoutDashboard,
            description: 'Company-wide operations & metrics',
          },
          {
            id: 'employees',
            label: 'Employees',
            icon: Users,
            description: 'Staff directory & availability',
          },
          {
            id: 'brands',
            label: 'Brands',
            icon: Briefcase,
            description: 'Client coverage & SLAs',
          },
          {
            id: 'processes',
            label: 'Processes',
            icon: Layers,
            description: 'CS, ACC, NDR, Retention rules',
          },
          {
            id: 'pods',
            label: 'Pods',
            icon: Boxes,
            description: 'Pod leads & member clusters',
          },
          {
            id: 'leaves',
            label: 'Availability & Leaves',
            icon: CalendarOff,
            description: 'Holidays, weekly offs & approvals',
          },
          {
            id: 'generator',
            label: 'Roster Planner',
            icon: CalendarCheck,
            description: 'Monthly schedule & 5 perspectives',
          },
          {
            id: 'conflicts',
            label: 'Conflicts',
            icon: AlertTriangle,
            badge: unresolvedConflictsCount > 0 ? unresolvedConflictsCount : undefined,
            badgeColor: 'bg-rose-500 text-white',
            description: 'Gap checks & rule validations',
          },
          {
            id: 'settings',
            label: 'Settings',
            icon: Settings,
            description: 'System rules & database',
          },
        ];

      case 'POD_LEAD':
        return [
          {
            id: 'lead_dashboard',
            label: 'Pod Dashboard',
            icon: LayoutDashboard,
            description: 'Pod Alpha team metrics & floor state',
          },
          {
            id: 'lead_roster',
            label: 'Team Roster',
            icon: CalendarCheck,
            description: 'Monthly pod member schedule',
          },
          {
            id: 'lead_leaves',
            label: 'Leave & Requests',
            icon: CalendarOff,
            badge: podPendingLeavesCount > 0 ? podPendingLeavesCount : undefined,
            badgeColor: 'bg-amber-500 text-white',
            description: 'Review requests with coverage impact',
          },
        ];

      case 'EMPLOYEE':
        return [
          {
            id: 'employee_schedule',
            label: 'My Schedule',
            icon: CalendarCheck,
            description: 'Personal shift assignments & offs',
          },
          {
            id: 'employee_leaves',
            label: 'My Leaves',
            icon: CalendarOff,
            description: 'Submit & track time-off requests',
          },
        ];
    }
  };

  const navItems = getNavItems();

  const getRoleBadge = () => {
    switch (userRole) {
      case 'ADMIN':
        return { label: 'Admin / Ops', color: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' };
      case 'POD_LEAD':
        return { label: 'Pod Lead', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' };
      case 'EMPLOYEE':
        return { label: 'Employee', color: 'bg-sky-500/20 text-sky-400 border-sky-500/30' };
    }
  };

  const roleBadge = getRoleBadge();

  return (
    <aside className={`${collapsed ? 'w-14 sm:w-20' : 'w-72 max-sm:fixed max-sm:inset-y-0 max-sm:left-0 max-sm:z-50 max-sm:shadow-2xl'} flex flex-shrink-0 flex-col overflow-hidden border-r border-slate-800 bg-slate-900 text-slate-200 transition-[width] duration-300 ease-in-out select-none`}>
      {/* Brand Header */}
      <button
        type="button"
        onClick={onToggle}
        title={collapsed ? 'Open sidebar' : 'Close sidebar'}
        aria-label={collapsed ? 'Open sidebar' : 'Close sidebar'}
        aria-expanded={!collapsed}
        className={`flex h-16 w-full shrink-0 items-center border-b border-slate-800 transition-colors hover:bg-slate-800/60 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 ${
          collapsed ? 'justify-center px-0' : 'gap-3 px-6'
        }`}
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 text-lg font-bold text-white shadow-lg shadow-indigo-500/20">
          R
        </div>
        {!collapsed && (
          <div className="flex min-w-0 flex-1 items-center justify-between gap-2 text-left">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 whitespace-nowrap text-base font-bold tracking-tight text-white">
                RosterFlow
                <span className={`rounded border px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider ${roleBadge.color}`}>
                  {roleBadge.label}
                </span>
              </div>
              <div className="text-xs text-slate-400">Workforce Intelligence</div>
            </div>
            <PanelLeftClose className="h-4 w-4 shrink-0 text-slate-400" />
          </div>
        )}
      </button>

      {/* Navigation List */}
      <nav className={`flex-1 space-y-1 overflow-y-auto py-4 ${collapsed ? 'px-2' : 'px-3'}`}>
        {!collapsed && <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          {userRole === 'ADMIN'
            ? 'Admin Navigation'
            : userRole === 'POD_LEAD'
            ? 'Pod Lead Workspace'
            : 'Personal Workspace'}
        </div>}

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              title={collapsed ? item.label : item.description}
              aria-label={item.label}
              className={`group flex w-full items-center rounded-lg py-2.5 text-left transition-all cursor-pointer ${
                collapsed ? 'justify-center px-0' : 'justify-between px-3'
              } ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className={`flex min-w-0 items-center ${collapsed ? 'justify-center' : 'gap-3'}`}>
                <Icon
                  className={`h-5 w-5 flex-shrink-0 transition-colors ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                />
                {!collapsed && <div className="truncate">
                  <div className="text-sm font-medium leading-none">{item.label}</div>
                  <div
                    className={`text-[11px] truncate mt-1 ${
                      isActive ? 'text-indigo-200' : 'text-slate-400 group-hover:text-slate-300'
                    }`}
                  >
                    {item.description}
                  </div>
                </div>}
              </div>

              {!collapsed && item.badge !== undefined && (
                <span
                  className={`ml-2 text-xs font-bold px-2 py-0.5 rounded-full ${
                    item.badgeColor || 'bg-slate-700 text-white'
                  }`}
                >
                  {item.badge}
                </span>
              )}

              {!collapsed && isActive && <ChevronRight className="w-4 h-4 ml-1 text-indigo-200 flex-shrink-0" />}
            </button>
          );
        })}
      </nav>

      {/* User Profile Section with Role & Logout */}
      <div className={`border-t border-slate-800 bg-slate-950/80 ${collapsed ? 'p-2' : 'p-4'}`}>
        <div className={`rounded-xl border border-slate-800 bg-slate-900 ${collapsed ? 'p-2' : 'space-y-3 p-3'}`}>
          <div className={`flex items-center ${collapsed ? 'flex-col gap-2' : 'justify-between'}`}>
            <div className={`flex min-w-0 items-center ${collapsed ? 'justify-center' : 'gap-2.5'}`}>
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-indigo-700 text-white flex items-center justify-center font-bold text-xs ring-2 ring-indigo-500/30 flex-shrink-0">
                {currentUser?.avatarInitials || 'U'}
              </div>
              {!collapsed && <div className="truncate text-left">
                <div className="text-xs font-bold text-white truncate">
                  {currentUser?.name || 'User'}
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  {currentUser?.email}
                </div>
              </div>}
            </div>

            <button
              onClick={logout}
              title="Sign Out"
              aria-label="Sign Out"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors flex-shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </aside>
  );
};
