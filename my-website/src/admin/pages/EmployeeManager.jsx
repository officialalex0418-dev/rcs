import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Shield, Mail, Phone, Calendar } from 'lucide-react';

const EmployeeManager = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const backendUrl = import.meta.env.VITE_API_URL || '';
        const token = localStorage.getItem('rcs_admin_token');
        const response = await fetch(`${backendUrl}/api/employees`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (data.success) setEmployees(data.data);
      } catch (err) {
        console.error('Failed to fetch employees:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  return (
    <div className="p-8 bg-slate-50 min-h-screen font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Staff Management</h1>
          <p className="text-slate-500 font-medium">Create, edit and manage employee access.</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 px-5 py-2.5 rounded-xl text-sm font-bold text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20">
          <Plus size={18} />
          Add Employee
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search staff by name or email..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Employee</th>
                <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Role & Designation</th>
                <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Contact</th>
                <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Joined</th>
                <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan="5" className="px-6 py-12 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">Loading Personnel Data...</td></tr>
              ) : employees.length === 0 ? (
                <tr><td colSpan="5" className="px-6 py-12 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">No Staff Records Found</td></tr>
              ) : employees.map((emp) => (
                <tr key={emp._id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                        {emp.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 leading-none">{emp.name}</p>
                        <p className="text-[11px] text-slate-400 mt-1 font-bold uppercase tracking-tighter">{emp._id.substring(0, 8)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="flex items-center gap-1.5 text-sm font-bold text-slate-700">
                        <Shield size={14} className="text-blue-500" />
                        {emp.role.replace('_', ' ')}
                      </span>
                      <span className="text-xs text-slate-400 mt-0.5">{emp.designation || 'Position Not Set'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                        <Mail size={12} className="text-slate-400" /> {emp.email}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                        <Phone size={12} className="text-slate-400" /> {emp.phone || 'N/A'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-bold uppercase tracking-tighter">
                      <Calendar size={14} className="text-slate-400" />
                      {new Date(emp.joiningDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Edit2 size={16} /></button>
                      <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EmployeeManager;
