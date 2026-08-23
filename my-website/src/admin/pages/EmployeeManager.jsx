import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Shield, Mail, Phone, Calendar, MapPin, CreditCard, Wallet, X, UserPlus, Save } from 'lucide-react';

const EmployeeManager = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'STAFF',
    designation: '',
    phone: '',
    address: '',
    panNumber: '',
    basicSalary: 0,
    dailyAllowance: 0,
  });

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

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const backendUrl = import.meta.env.VITE_API_URL || '';
      const token = localStorage.getItem('rcs_admin_token');
      const url = editingId ? `${backendUrl}/api/employees/${editingId}` : `${backendUrl}/api/employees`;
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setShowModal(false);
        setFormData({ name: '', email: '', role: 'STAFF', designation: '', phone: '', address: '', panNumber: '', basicSalary: 0, dailyAllowance: 0 });
        setId(null);
        fetchEmployees();
      }
    } catch (err) {
      console.error('Failed to save employee:', err);
    }
  };

  const handleEdit = (emp) => {
    setFormData(emp);
    setId(emp._id);
    setShowModal(true);
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen font-sans">
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[1000] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
               <h2 className="text-xl font-black text-slate-900 tracking-tight">{editingId ? 'Refine Staff Profile' : 'Onboard New Employee'}</h2>
               <button onClick={() => { setShowModal(false); setId(null); }} className="p-2 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all"><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Identity</label>
                    <input required className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 transition-all text-sm font-bold" placeholder="e.g. Ramesh Thapa" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Corporate Email</label>
                    <input required type="email" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 transition-all text-sm font-bold" placeholder="name@rcs.com.np" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Assigned Role</label>
                    <select className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                      <option value="STAFF">Staff</option>
                      <option value="DEVELOPER">Developer</option>
                      <option value="DESIGNER">Designer</option>
                      <option value="PROJECT_MANAGER">Project Manager</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </div>
                  <div className="space-y-1.5 col-span-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Current Designation</label>
                    <input className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-bold" placeholder="e.g. Senior Backend Engineer" value={formData.designation} onChange={e => setFormData({...formData, designation: e.target.value})} />
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Permanent Address</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-bold" placeholder="City, Country" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">PAN Identifier</label>
                    <div className="relative">
                      <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-bold" placeholder="9-digit PAN" value={formData.panNumber} onChange={e => setFormData({...formData, panNumber: e.target.value})} />
                    </div>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-blue-50/50 rounded-3xl border border-blue-100/50">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest ml-1">Basic Salary (Monthly)</label>
                    <div className="relative">
                      <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400" size={16} />
                      <input type="number" className="w-full pl-11 pr-4 py-3.5 bg-white border border-blue-100 rounded-2xl outline-none text-sm font-black text-blue-900" value={formData.basicSalary} onChange={e => setFormData({...formData, basicSalary: Number(e.target.value)})} />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest ml-1">Daily Allowance</label>
                    <div className="relative">
                      <Plus className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400" size={16} />
                      <input type="number" className="w-full pl-11 pr-4 py-3.5 bg-white border border-blue-100 rounded-2xl outline-none text-sm font-black text-blue-900" value={formData.dailyAllowance} onChange={e => setFormData({...formData, dailyAllowance: Number(e.target.value)})} />
                    </div>
                  </div>
               </div>

               <div className="flex justify-end gap-3 pt-4">
                  <button type="button" onClick={() => setShowModal(false)} className="px-8 py-4 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors">Discard</button>
                  <button type="submit" className="flex items-center gap-2 bg-slate-900 text-white px-10 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/10"><Save size={16} /> Finalize Profile</button>
               </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Staff Ecosystem</h1>
          <p className="text-slate-500 font-medium">Coordinate and manage the heartbeat of RCS.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-blue-600 px-5 py-2.5 rounded-xl text-sm font-bold text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20">
          <UserPlus size={18} />
          Onboard Personnel
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search staff database..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>

        <div className="overflow-x-auto text-left">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th className="px-8 py-5">Personnel Profile</th>
                <th className="px-8 py-5">Role & Identity</th>
                <th className="px-8 py-5">Compensation</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan="4" className="px-8 py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">Scanning Personnel Database...</td></tr>
              ) : employees.length === 0 ? (
                <tr><td colSpan="4" className="px-8 py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">No personnel records detected</td></tr>
              ) : employees.map((emp) => (
                <tr key={emp._id} className="hover:bg-slate-50/50 transition-all group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 flex items-center justify-center font-black text-lg">
                        {emp.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900 leading-tight mb-1">{emp.name}</p>
                        <span className="text-xs text-slate-400 font-bold flex items-center gap-1.5"><Mail size={12} /> {emp.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-1">
                       <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 w-fit px-2 py-0.5 rounded">{emp.role}</span>
                       <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">ID: {emp.employeeId || 'N/A'}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                       <span className="text-sm font-black text-slate-900">Rs. {emp.basicSalary?.toLocaleString()}</span>
                       <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Base Monthly</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button onClick={() => handleEdit(emp)} className="p-2.5 bg-slate-50 text-slate-500 rounded-xl hover:bg-slate-900 hover:text-white transition-all shadow-sm">
                        <Edit2 size={18} />
                      </button>
                      <button className="p-2.5 bg-slate-50 text-red-500 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm">
                        <Trash2 size={18} />
                      </button>
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
