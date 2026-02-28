import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { ShieldCheck, Plus, UserPlus } from 'lucide-react';
import './StaffManagement.css';

export const StaffManagement: React.FC = () => {
    const { staff, addStaff } = useAppContext();
    const [newStaffName, setNewStaffName] = useState('');

    const generateStaffNumber = () => {
        // Generates a random 5 digit string
        return Math.floor(10000 + Math.random() * 90000).toString();
    };

    const handleAddStaff = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newStaffName.trim()) return;

        const staffNumber = generateStaffNumber();
        addStaff(newStaffName, staffNumber);
        setNewStaffName('');
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
                                </tr>
                            </thead>
                            <tbody>
                                {staff.length > 0 ? (
                                    staff.map((employee) => (
                                        <tr key={employee.id}>
                                            <td className="font-medium text-white">{employee.name}</td>
                                            <td>
                                                <code className="bg-dark px-2 py-1 rounded text-accent-blue border border-light font-mono">
                                                    {employee.staffNumber}
                                                </code>
                                            </td>
                                            <td><span className="badge warning">Sales Only</span></td>
                                            <td className="text-secondary">
                                                {new Date(employee.dateJoined).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))
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
