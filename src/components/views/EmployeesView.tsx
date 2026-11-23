import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Briefcase,
  Edit2,
  Trash2,
  X,
  Phone,
  Mail,
  Shield,
  Eye,
  Calendar,
  CheckCircle2,
  Power,
  Layers,
} from 'lucide-react';
import { useRoster } from '../../context/RosterContext';
import { Employee, Role, ShiftType, SHIFT_DETAILS } from '../../types';

export const EmployeesView: React.FC = () => {
  const {
    employees,
    pods,
    brands,
    processes,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    toggleEmployeeStatus,
  } = useRoster();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPodFilter, setSelectedPodFilter] = useState('ALL');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('ALL');

  // Modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [viewingEmployee, setViewingEmployee] = useState<Employee | null>(null);

  // Form State
  const [formData, setFormData] = useState<{
    employeeCode: string;
    fullName: string;
    email: string;
    phone: string;
    role: Role;
    podId: string;
    certifiedBrandIds: string[];
    certifiedProcessIds: string[];
    preferredShift: ShiftType;
    fixedWeeklyOffDay: number;
    isFemale: boolean;
    maxConsecutiveWorkingDays: number;
    status: 'ACTIVE' | 'INACTIVE';
  }>({
    employeeCode: '',
    fullName: '',
    email: '',
    phone: '',
    role: 'Agent',
    podId: pods[0]?.id || '',
    certifiedBrandIds: [],
    certifiedProcessIds: [],
    preferredShift: 'MORNING',
    fixedWeeklyOffDay: 0,
    isFemale: false,
    maxConsecutiveWorkingDays: 5,
    status: 'ACTIVE',
  });

  const openCreateModal = () => {
    setEditingEmployee(null);
    setFormData({
      employeeCode: `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
      fullName: '',
      email: '',
      phone: '',
      role: 'Agent',
      podId: pods[0]?.id || '',
      certifiedBrandIds: [brands[0]?.id || ''],
      certifiedProcessIds: [processes[0]?.id || ''],
      preferredShift: 'MORNING',
      fixedWeeklyOffDay: 0,
      isFemale: false,
      maxConsecutiveWorkingDays: 5,
      status: 'ACTIVE',
    });
    setIsFormModalOpen(true);
  };

  const openEditModal = (emp: Employee) => {
    setEditingEmployee(emp);
    setFormData({
      employeeCode: emp.employeeCode,
      fullName: emp.fullName,
      email: emp.email,
      phone: emp.phone,
      role: emp.role,
      podId: emp.podId,
      certifiedBrandIds: emp.certifiedBrandIds,
      certifiedProcessIds: emp.certifiedProcessIds,
      preferredShift: emp.preferredShift,
      fixedWeeklyOffDay: emp.fixedWeeklyOffDay ?? 0,
      isFemale: emp.isFemale,
      maxConsecutiveWorkingDays: emp.maxConsecutiveWorkingDays,
      status: emp.status === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE',
    });
    setIsFormModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim()) return;

    if (editingEmployee) {
      updateEmployee(editingEmployee.id, formData);
    } else {
      addEmployee(formData);
    }
    setIsFormModalOpen(false);
  };

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Filtered employees
  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.employeeCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPod = selectedPodFilter === 'ALL' || emp.podId === selectedPodFilter;
    const matchesRole = selectedRoleFilter === 'ALL' || emp.role === selectedRoleFilter;
    const matchesStatus =
      selectedStatusFilter === 'ALL' || emp.status === selectedStatusFilter;

    return matchesSearch && matchesPod && matchesRole && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            <span>Employee Directory & Skill Management ({filteredEmployees.length} staff)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage employee assignments, brand/process certifications, pod alignments, and shift preferences.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm flex items-center gap-2 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Employee</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search name, code, email..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-700"
          />
        </div>

        <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-slate-200 text-xs">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-slate-500 font-medium">Pod:</span>
          <select
            value={selectedPodFilter}
            onChange={(e) => setSelectedPodFilter(e.target.value)}
            className="w-full bg-transparent font-medium text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Pods ({pods.length})</option>
            {pods.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-slate-200 text-xs">
          <Briefcase className="w-4 h-4 text-slate-400" />
          <span className="text-slate-500 font-medium">Role:</span>
          <select
            value={selectedRoleFilter}
            onChange={(e) => setSelectedRoleFilter(e.target.value)}
            className="w-full bg-transparent font-medium text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Roles</option>
            <option value="Agent">Agent</option>
            <option value="Senior Specialist">Senior Specialist</option>
            <option value="Team Lead">Team Lead</option>
            <option value="Pod Lead">Pod Lead</option>
            <option value="Operations Manager">Operations Manager</option>
          </select>
        </div>

        <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-slate-200 text-xs">
          <Power className="w-4 h-4 text-slate-400" />
          <span className="text-slate-500 font-medium">Status:</span>
          <select
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
            className="w-full bg-transparent font-medium text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active Staff</option>
            <option value="INACTIVE">Deactivated Staff</option>
          </select>
        </div>
      </div>

      {/* Employees Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
              <tr>
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-3">Role</th>
                <th className="py-3 px-3">Pod & Lead</th>
                <th className="py-3 px-3">Certifications</th>
                <th className="py-3 px-3">Pref. Shift</th>
                <th className="py-3 px-3">Weekly Off</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEmployees.map((emp) => {
                const pod = pods.find((p) => p.id === emp.podId);
                const podLead = employees.find((e) => e.id === pod?.leadEmployeeId);
                const shiftDetail = SHIFT_DETAILS[emp.preferredShift];
                const certifiedBrands = brands.filter((b) =>
                  emp.certifiedBrandIds.includes(b.id)
                );

                return (
                  <tr key={emp.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-indigo-700 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                          {emp.fullName.split(' ').map((n) => n[0]).join('')}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{emp.fullName}</div>
                          <div className="text-[10px] text-indigo-600 font-mono">{emp.employeeCode}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3 text-slate-700 font-medium">{emp.role}</td>

                    <td className="py-3 px-3">
                      <div>
                        <span
                          className="px-2 py-0.5 rounded text-[10px] font-bold text-white shadow-xs"
                          style={{ backgroundColor: pod?.color || '#64748b' }}
                        >
                          {pod?.code || 'Unassigned'}
                        </span>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          Lead: {podLead ? podLead.fullName.split(' ')[0] : 'None'}
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <div className="flex flex-wrap gap-1 max-w-[160px]">
                        {certifiedBrands.slice(0, 2).map((b) => (
                          <span
                            key={b.id}
                            className="px-1.5 py-0.2 rounded text-[9px] font-semibold bg-slate-100 text-slate-700 border"
                          >
                            {b.code}
                          </span>
                        ))}
                        {certifiedBrands.length > 2 && (
                          <span className="text-[9px] text-slate-400 font-bold">
                            +{certifiedBrands.length - 2}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${shiftDetail.badgeBg}`}>
                        {shiftDetail.badgeText}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-slate-600 font-medium">
                      {emp.fixedWeeklyOffDay !== undefined
                        ? dayNames[emp.fixedWeeklyOffDay]
                        : 'Rotational'}
                    </td>

                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          emp.status === 'ACTIVE'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {emp.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right space-x-1">
                      <button
                        onClick={() => setViewingEmployee(emp)}
                        title="View Full Profile"
                        className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openEditModal(emp)}
                        title="Edit Details"
                        className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => toggleEmployeeStatus(emp.id)}
                        title={emp.status === 'ACTIVE' ? 'Deactivate Employee' : 'Activate Employee'}
                        className={`p-1 rounded ${
                          emp.status === 'ACTIVE'
                            ? 'text-slate-400 hover:text-amber-600 hover:bg-amber-50'
                            : 'text-emerald-600 hover:bg-emerald-50'
                        }`}
                      >
                        <Power className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Remove employee ${emp.fullName}?`)) deleteEmployee(emp.id);
                        }}
                        title="Delete"
                        className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Employee Profile Drawer */}
      {viewingEmployee && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white font-bold text-base flex items-center justify-center">
                  {viewingEmployee.fullName.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{viewingEmployee.fullName}</h3>
                  <div className="text-xs text-indigo-600 font-mono font-semibold">
                    {viewingEmployee.employeeCode} &bull; {viewingEmployee.role}
                  </div>
                </div>
              </div>
              <button onClick={() => setViewingEmployee(null)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl">
                <div>
                  <span className="text-[10px] text-slate-400 block">Email</span>
                  <span className="font-semibold text-slate-800">{viewingEmployee.email}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Phone</span>
                  <span className="font-semibold text-slate-800">{viewingEmployee.phone}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl">
                <div>
                  <span className="text-[10px] text-slate-400 block">Assigned Pod</span>
                  <span className="font-semibold text-slate-800">
                    {pods.find((p) => p.id === viewingEmployee.podId)?.name || 'Unassigned'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Preferred Shift</span>
                  <span className="font-semibold text-slate-800">{viewingEmployee.preferredShift}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-500 font-semibold block mb-1.5">
                  Certified Client Brands ({viewingEmployee.certifiedBrandIds.length}):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {brands
                    .filter((b) => viewingEmployee.certifiedBrandIds.includes(b.id))
                    .map((b) => (
                      <span
                        key={b.id}
                        className="px-2.5 py-1 rounded bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold"
                      >
                        {b.name} ({b.code})
                      </span>
                    ))}
                </div>
              </div>

              <div>
                <span className="text-slate-500 font-semibold block mb-1.5">
                  Certified Operational Processes ({viewingEmployee.certifiedProcessIds.length}):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {processes
                    .filter((p) => viewingEmployee.certifiedProcessIds.includes(p.id))
                    .map((proc) => (
                      <span
                        key={proc.id}
                        className="px-2.5 py-1 rounded bg-slate-100 border border-slate-200 text-slate-700 font-medium"
                      >
                        {proc.name}
                      </span>
                    ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t">
              <button
                onClick={() => setViewingEmployee(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Employee Modal */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between p-5 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-800">
                {editingEmployee ? 'Edit Employee' : 'Add New Employee'}
              </h3>
              <button onClick={() => setIsFormModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Employee Code</label>
                  <input
                    type="text"
                    required
                    value={formData.employeeCode}
                    onChange={(e) => setFormData({ ...formData, employeeCode: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-slate-50 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sameer Dixit"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone</label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as Role })}
                    className="w-full px-3 py-2 border rounded-lg bg-white"
                  >
                    <option value="Agent">Agent</option>
                    <option value="Senior Specialist">Senior Specialist</option>
                    <option value="Team Lead">Team Lead</option>
                    <option value="Pod Lead">Pod Lead</option>
                    <option value="Operations Manager">Operations Manager</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Assigned Pod</label>
                  <select
                    value={formData.podId}
                    onChange={(e) => setFormData({ ...formData, podId: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-white"
                  >
                    {pods.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Preferred Shift</label>
                  <select
                    value={formData.preferredShift}
                    onChange={(e) => setFormData({ ...formData, preferredShift: e.target.value as ShiftType })}
                    className="w-full px-3 py-2 border rounded-lg bg-white"
                  >
                    <option value="MORNING">Morning (07:00 - 15:30)</option>
                    <option value="EVENING">Evening (15:00 - 23:30)</option>
                    <option value="NIGHT">Night (23:00 - 07:30)</option>
                    <option value="GENERAL">General (09:30 - 18:00)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Fixed Weekly Off</label>
                  <select
                    value={formData.fixedWeeklyOffDay}
                    onChange={(e) => setFormData({ ...formData, fixedWeeklyOffDay: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg bg-white"
                  >
                    {dayNames.map((d, idx) => (
                      <option key={d} value={idx}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Certified Brands</label>
                <div className="flex flex-wrap gap-2">
                  {brands.map((b) => {
                    const isChecked = formData.certifiedBrandIds.includes(b.id);
                    return (
                      <label
                        key={b.id}
                        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border cursor-pointer ${
                          isChecked
                            ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                            : 'bg-slate-50 border-slate-200 text-slate-600'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({
                                ...formData,
                                certifiedBrandIds: [...formData.certifiedBrandIds, b.id],
                              });
                            } else {
                              setFormData({
                                ...formData,
                                certifiedBrandIds: formData.certifiedBrandIds.filter((id) => id !== b.id),
                              });
                            }
                          }}
                          className="rounded text-indigo-600 focus:ring-indigo-500"
                        />
                        <span>{b.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Certified Processes</label>
                <div className="flex flex-wrap gap-2">
                  {processes.map((proc) => {
                    const isChecked = formData.certifiedProcessIds.includes(proc.id);
                    return (
                      <label
                        key={proc.id}
                        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border cursor-pointer ${
                          isChecked
                            ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                            : 'bg-slate-50 border-slate-200 text-slate-600'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({
                                ...formData,
                                certifiedProcessIds: [...formData.certifiedProcessIds, proc.id],
                              });
                            } else {
                              setFormData({
                                ...formData,
                                certifiedProcessIds: formData.certifiedProcessIds.filter((id) => id !== proc.id),
                              });
                            }
                          }}
                          className="rounded text-indigo-600 focus:ring-indigo-500"
                        />
                        <span>{proc.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="px-4 py-2 border rounded-lg text-slate-600 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold"
                >
                  {editingEmployee ? 'Update Employee' : 'Save Employee'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
