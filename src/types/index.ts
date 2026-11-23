export type UserRole = 'ADMIN' | 'POD_LEAD' | 'EMPLOYEE';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  podId?: string; // Pod assigned to Lead or Employee
  employeeId?: string; // Linked employee ID
  avatarInitials: string;
}

export type Role = 'Agent' | 'Senior Specialist' | 'Team Lead' | 'Pod Lead' | 'Operations Manager';

export type ShiftType = 
  | 'MORNING'    // 07:00 - 15:30
  | 'EVENING'    // 15:00 - 23:30
  | 'NIGHT'      // 23:00 - 07:30
  | 'GENERAL'    // 09:30 - 18:00
  | 'OFF'        // Weekly Off
  | 'LEAVE'      // Approved Leave
  | 'COMP_OFF';  // Compensatory Off

export interface ShiftInfo {
  code: ShiftType;
  label: string;
  timeWindow: string;
  color: string;
  badgeBg: string;
  badgeText: string;
}

export const SHIFT_DETAILS: Record<ShiftType, ShiftInfo> = {
  MORNING: {
    code: 'MORNING',
    label: 'Morning Shift',
    timeWindow: '07:00 - 15:30',
    color: '#0284c7', // Sky
    badgeBg: 'bg-sky-50 text-sky-700 border-sky-200',
    badgeText: 'MORN'
  },
  EVENING: {
    code: 'EVENING',
    label: 'Evening Shift',
    timeWindow: '15:00 - 23:30',
    color: '#ea580c', // Orange
    badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
    badgeText: 'EVE'
  },
  NIGHT: {
    code: 'NIGHT',
    label: 'Night Shift',
    timeWindow: '23:00 - 07:30',
    color: '#7c3aed', // Purple
    badgeBg: 'bg-purple-50 text-purple-700 border-purple-200',
    badgeText: 'NGHT'
  },
  GENERAL: {
    code: 'GENERAL',
    label: 'General Shift',
    timeWindow: '09:30 - 18:00',
    color: '#059669', // Emerald
    badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    badgeText: 'GEN'
  },
  OFF: {
    code: 'OFF',
    label: 'Weekly Off',
    timeWindow: 'Off Duty',
    color: '#64748b', // Slate
    badgeBg: 'bg-slate-100 text-slate-600 border-slate-300',
    badgeText: 'OFF'
  },
  LEAVE: {
    code: 'LEAVE',
    label: 'On Leave',
    timeWindow: 'Out of Office',
    color: '#dc2626', // Red
    badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
    badgeText: 'LVE'
  },
  COMP_OFF: {
    code: 'COMP_OFF',
    label: 'Comp-Off',
    timeWindow: 'Earned Off',
    color: '#d97706', // Amber
    badgeBg: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    badgeText: 'COMP'
  }
};

export interface Employee {
  id: string;
  employeeCode: string;
  fullName: string;
  email: string;
  phone: string;
  role: Role;
  podId: string;
  certifiedBrandIds: string[];
  certifiedProcessIds: string[];
  preferredShift: ShiftType;
  fixedWeeklyOffDay?: number; // 0=Sun, 1=Mon, ..., 6=Sat
  isFemale: boolean; // night shift safety rules
  maxConsecutiveWorkingDays: number;
  status: 'ACTIVE' | 'ON_LEAVE' | 'TRANSITIONING' | 'INACTIVE';
  avatarUrl?: string;
}

export interface Pod {
  id: string;
  code: string;
  name: string;
  description: string;
  leadEmployeeId: string;
  color: string;
  targetHeadcount: number;
}

export type ResourceModel = 'SINGLE_RESOURCE' | 'MULTI_RESOURCE';
export type OperatingScheduleType = 
  | '365_DAYS'                   // Runs every day 24/7 without holiday breaks
  | 'PUBLIC_HOLIDAYS_OFF'        // Off on national/public holidays
  | 'SUNDAYS_AND_HOLIDAYS_OFF';  // Off on Sundays and public holidays

export interface Brand {
  id: string;
  code: string;
  name: string;
  clientTier: 'Enterprise' | 'Strategic' | 'Standard' | 'D2C Brand';
  resourceModel: ResourceModel;
  operatingScheduleType: OperatingScheduleType;
  color: string;
  operatingHours: string;
  weekendCoverageRequired: boolean;
  minDailyHeadcount: number;
  status: 'ACTIVE' | 'INACTIVE';
  dedicatedEmployeeId?: string; // For 80% single-resource brands where 1 employee manages all processes
}

export type ProcessType = 
  | 'Customer Support (CS)' 
  | 'Non-Delivery Report (NDR)' 
  | 'Abandoned Cart (ACC)' 
  | 'Customer Retention' 
  | 'Backoffice & QA' 
  | 'Technical Tier-2';

export interface Process {
  id: string;
  brandId: string;
  name: string;
  type: ProcessType;
  slaResponseTarget: string;
  minStaffPerShift: {
    MORNING: number;
    EVENING: number;
    NIGHT: number;
    GENERAL: number;
  };
  workingDaysSchedule?: {
    mon: boolean;
    tue: boolean;
    wed: boolean;
    thu: boolean;
    fri: boolean;
    sat: boolean;
    sun: boolean;
  };
  specialRequirements?: string;
}

export interface RosterCell {
  id: string;
  employeeId: string;
  date: string; // YYYY-MM-DD
  shift: ShiftType;
  brandId?: string;
  processId?: string;
  isLocked?: boolean;
  notes?: string;
  overriddenBy?: string;
}

export type LeaveType = 'CASUAL' | 'SICK' | 'EARNED' | 'COMP_OFF' | 'PATERNITY' | 'MATERNITY' | 'UNPAID';

export interface LeaveRequest {
  id: string;
  employeeId: string;
  type: LeaveType;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  reason: string;
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
  approvedBy?: string;
  createdAt: string;
  isSuddenLeave?: boolean; // For post-roster dynamic leave demo
}

export interface PublicHoliday {
  id: string;
  date: string; // YYYY-MM-DD
  name: string;
  type: 'NATIONAL' | 'REGIONAL' | 'RESTRICTED';
  isMandatoryHoliday: boolean;
}

export interface ConflictAlert {
  id: string;
  type: 
    | 'COVERAGE_GAP' 
    | 'RULE_VIOLATION' 
    | 'UNAVAILABLE_AGENT' 
    | 'REST_VIOLATION' 
    | 'LEAD_MISSING'
    | 'POST_ROSTER_LEAVE_GAP';
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  shift?: ShiftType;
  brandId?: string;
  processId?: string;
  employeeId?: string;
  suggestedAction?: string;
  suggestedBackupEmployeeId?: string; // 1-click recommended backup
  isResolved?: boolean;
}

export type ActiveTab = 
  // Admin Tabs
  | 'dashboard'
  | 'employees'
  | 'brands'
  | 'processes'
  | 'pods'
  | 'leaves'
  | 'generator'
  | 'editor'
  | 'conflicts'
  | 'settings'
  // Pod Lead Tabs
  | 'lead_dashboard'
  | 'lead_roster'
  | 'lead_leaves'
  // Employee Tabs
  | 'employee_schedule'
  | 'employee_leaves';
