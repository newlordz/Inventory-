import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import type { StaffMember } from '../types';
import { ShieldCheck, Plus, UserPlus, Edit2, Check, X } from 'lucide-react';
import './StaffManagement.css';

export const StaffManagement: React.FC = () => {
    const { staff, addStaff, updateStaffItem } = useAppContext();
    const [newStaffName, setNewStaffName] = useState('');
    const [newStaffNumber, setNewStaffNumber] = useState('');

    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState({ name: '', staffNumber: '' });

    const generateStaffNumber = () => {
        // Generates a random 5 digit string
        return Math.floor(10000 + Math.random() * 90000).toString();
    };

    const handleAddStaff = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newStaffName.trim()) return;

        const staffNumber = newStaffNumber.trim() || generateStaffNumber();
        addStaff(newStaffName, staffNumber);
        setNewStaffName('');
        setNewStaffNumber('');
    };

    const handleEditStart = (employee: StaffMember) => {
        setEditingId(employee.id);
        setEditForm({ name: employee.name, staffNumber: employee.staffNumber });
    };

    const handleEditSave = () => {
        if (editingId) {
            updateStaffItem(editingId, editForm);
            setEditingId(null);
        }
    };

    const handleEditCancel = () => {
        setEditingId(null);
    };

    return (
        <div className="animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
                <div className="bg-accent-blue p-2 rounded-lg text-white">
                    <ShieldCheck size={28} />
                </div>
                <div>
                    <h2 className="text-2xl font-bold">Staff Management</h2>
                    <p className="text-secondary text-sm">Assign and manage authorized system employees</p>
                </div>
            </div>

            <div className="staff-management-grid">
                {/* Add Staff Form */}
                <div className="glass-panel p-6 staff-form-panel">
                    <div className="flex items-center gap-2 mb-4">
                        <UserPlus size={20} className="text-accent-blue" />
                        <h3 className="text-lg font-bold">Create Staff Member</h3>
                    </div>

                    <form onSubmit={handleAddStaff}>
                        <div className="form-group mb-4">
                            <label>Employee Name</label>
                            <input
                                type="text"
                                value={newStaffName}
                                onChange={(e) => setNewStaffName(e.target.value)}
                                placeholder="Enter full name"
                                required
                            />
                        </div>

                        <div className="form-group mb-4">
                            <label>Staff Number (Optional)</label>
                            <input
                                type="text"
                                value={newStaffNumber}
                                onChange={(e) => setNewStaffNumber(e.target.value)}
                                placeholder="Leave blank to auto-generate"
                            />
                        </div>

                        <button type="submit" className="btn-primary w-full">
                            <Plus size={18} /> Add Employee
                        </button>
                    </form>
                    <p className="text-xs text-muted mt-4">
                        Upon creation, a unique secure 5-digit Staff Number will be generated allowing them access to the Sales Portal.
                    </p>
                </div>

                {/* Staff Roster List */}
                <div className="glass-panel p-6 staff-table-panel">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold">Authorized Employees</h3>
                        <span className="badge blue">{staff.length} Total</span>
                    </div>

                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Employee Name</th>
                                    <th>Secure Staff Number</th>
                                    <th>Role Permissions</th>
                                    <th>Date Added</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {staff.length > 0 ? (
                                    staff.map((employee) => {
                                        const isEditing = editingId === employee.id;
                                        return (
                                            <tr key={employee.id}>
                                                {isEditing ? (
                                                    <>
                                                        <td><input type="text" className="inset-input py-1 px-2 text-sm w-full" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} /></td>
                                                        <td><input type="text" className="inset-input py-1 px-2 text-sm max-w-[120px]" value={editForm.staffNumber} onChange={e => setEditForm({ ...editForm, staffNumber: e.target.value })} /></td>
                                                    </>
                                                ) : (
                                                    <>
                                                        <td className="font-medium text-white">{employee.name}</td>
                                                        <td>
                                                            <code className="bg-dark px-2 py-1 rounded text-accent-blue border border-light font-mono">
                                                                {employee.staffNumber}
                                                            </code>
                                                        </td>
                                                    </>
                                                )}
                                                <td><span className="badge warning">Sales Only</span></td>
                                                <td className="text-secondary">
                                                    {new Date(employee.dateJoined).toLocaleDateString()}
                                                </td>
                                                <td>
                                                    {isEditing ? (
                                                        <div className="flex gap-2">
                                                            <button onClick={handleEditSave} className="text-success hover:text-white"><Check size={16} /></button>
                                                            <button onClick={handleEditCancel} className="text-danger hover:text-white"><X size={16} /></button>
                                                        </div>
                                                    ) : (
                                                        <button onClick={() => handleEditStart(employee)} className="text-accent hover:text-white"><Edit2 size={16} /></button>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="text-center py-8 text-secondary">
                                            No staff members have been added yet
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};
