import React, { useEffect, useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useAuth } from '../../context/AuthContext';
import { useRoster } from '../../context/RosterContext';

// Admin Views
import { DashboardView } from '../views/DashboardView';
import { EmployeesView } from '../views/EmployeesView';
import { BrandsView } from '../views/BrandsView';
import { ProcessesView } from '../views/ProcessesView';
import { PodsView } from '../views/PodsView';
import { LeavesView } from '../views/LeavesView';
import { RosterGeneratorView } from '../views/RosterGeneratorView';
import { ConflictsView } from '../views/ConflictsView';
import { RosterEditorView } from '../views/RosterEditorView';
import { SettingsView } from '../views/SettingsView';

// Pod Lead Views
import { PodDashboardView } from '../views/pod-lead/PodDashboardView';
import { PodRosterView } from '../views/pod-lead/PodRosterView';
import { PodLeavesView } from '../views/pod-lead/PodLeavesView';

// Employee Views
import { EmployeeScheduleView } from '../views/employee/EmployeeScheduleView';
import { EmployeeLeavesView } from '../views/employee/EmployeeLeavesView';

export const MainLayout: React.FC = () => {
  const { currentUser } = useAuth();
  const { activeTab, setActiveTab } = useRoster();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

  const userRole = currentUser?.role || 'ADMIN';

  // Role-Based Route Protection Guard
  useEffect(() => {
    if (userRole === 'POD_LEAD') {
      const allowedLeadTabs = ['lead_dashboard', 'lead_roster', 'lead_leaves'];
      if (!allowedLeadTabs.includes(activeTab)) {
        setActiveTab('lead_dashboard');
      }
    } else if (userRole === 'EMPLOYEE') {
      const allowedEmployeeTabs = ['employee_schedule', 'employee_leaves'];
      if (!allowedEmployeeTabs.includes(activeTab)) {
        setActiveTab('employee_schedule');
      }
    } else if (userRole === 'ADMIN') {
      const adminTabs = [
        'dashboard',
        'employees',
        'brands',
        'processes',
        'pods',
        'leaves',
        'generator',
        'editor',
        'conflicts',
        'settings',
      ];
      if (!adminTabs.includes(activeTab)) {
        setActiveTab('dashboard');
      }
    }
  }, [userRole, activeTab, setActiveTab]);

  const renderActiveView = () => {
    switch (activeTab) {
      // Admin Views
      case 'dashboard':
        return <DashboardView />;
      case 'employees':
        return <EmployeesView />;
      case 'brands':
        return <BrandsView />;
      case 'processes':
        return <ProcessesView />;
      case 'pods':
        return <PodsView />;
      case 'leaves':
        return <LeavesView />;
      case 'generator':
        return <RosterGeneratorView />;
      case 'editor':
        return <RosterEditorView />;
      case 'conflicts':
        return <ConflictsView />;
      case 'settings':
        return <SettingsView />;

      // Pod Lead Views
      case 'lead_dashboard':
        return <PodDashboardView />;
      case 'lead_roster':
        return <PodRosterView />;
      case 'lead_leaves':
        return <PodLeavesView />;

      // Employee Views
      case 'employee_schedule':
        return <EmployeeScheduleView />;
      case 'employee_leaves':
        return <EmployeeLeavesView />;

      default:
        return userRole === 'POD_LEAD' ? (
          <PodDashboardView />
        ) : userRole === 'EMPLOYEE' ? (
          <EmployeeScheduleView />
        ) : (
          <DashboardView />
        );
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100">
      {/* Dynamic Role-Based Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((collapsed) => !collapsed)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-6 bg-slate-50">
          <div className="max-w-7xl mx-auto space-y-6">
            {renderActiveView()}
          </div>
        </main>
      </div>
    </div>
  );
};
