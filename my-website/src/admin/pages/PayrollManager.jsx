import React, { useState, useEffect } from 'react';
import { IndianRupee, Download, CheckCircle2, Clock, Filter, Search, Plus, X, Save, Calculator, User } from 'lucide-react';

const PayrollManager = () => {
  const [payrolls, setPayrolls] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    employee: '',
    month: 'August',
    year: 2026,
    baseSalary: 0,
    dailyAllowance: 0,
    daysWorked: 30,
    bonus: 0,
    leaveDeductions: 0,
    taxDeductions: 0,
    otherAllowances: 0,
    manualTotalPaid: 0
  });

  const fetchPayrolls = async () => {
    try {
      const backendUrl = import.meta.env.VITE_API_URL || '';
      const token = localStorage.getItem('rcs_admin_token');
      const response = await fetch(`${backendUrl}/api/payroll`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) setPayrolls(data.data);
    } catch (err) {
      console.error('Failed to fetch payrolls:', err);
    } finally {
      setLoading(false);
    }
  };

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
    }
  };

  useEffect(() => {
    fetchPayrolls();
    fetchEmployees();
  }, []);

  // Live Auto-Calculation
  useEffect(() => {
    const allowanceTotal = (formData.dailyAllowance * formData.daysWorked) + formData.otherAllowances;
    const deductionsTotal = formData.leaveDeductions + formData.taxDeductions;
    const calculated = (formData.baseSalary + allowanceTotal + formData.bonus) - deductionsTotal;
    setFormData(prev => ({ ...prev, manualTotalPaid: calculated }));
  }, [formData.baseSalary, formData.dailyAllowance, formData.daysWorked, formData.bonus, formData.leaveDeductions, formData.taxDeductions, formData.otherAllowances]);

  const handleEmployeeChange = (id) => {
    const emp = employees.find(e => e._id === id);
    if (emp) {
      setFormData({
        ...formData,
        employee: id,
        baseSalary: emp.basicSalary || 0,
        dailyAllowance: emp.dailyAllowance || 0
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const backendUrl = import.meta.env.VITE_API_URL || '';
      const token = localStorage.getItem('rcs_admin_token');
      const response = await fetch(`${backendUrl}/api/payroll`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setShowModal(false);
        fetchPayrolls();
      }
    } catch (err) {
      console.error('Failed to process payroll:', err);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
     try {
      const backendUrl = import.meta.env.VITE_API_URL || '';
      const token = localStorage.getItem('rcs_admin_token');
      await fetch(`${backendUrl}/api/payroll/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      fetchPayrolls();
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen font-sans">
      {/* Process Payroll Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[1000] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
               <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                 <Calculator size={20} className="text-blue-600" />
                 Financial Audit & Disbursement
               </h2>
               <button onClick={() => setShowModal(false)} className="p-2 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all"><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 max-h-[75vh] overflow-y-auto custom-scrollbar">
               {/* Left: Identifiers */}
               <div className="space-y-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Employee Selection</label>
                    <div className="relative">
                       <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                       <select required className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-bold appearance-none cursor-pointer" value={formData.employee} onChange={e => handleEmployeeChange(e.target.value)}>
                          <option value="">Select Personnel</option>
                          {employees.map(emp => <option key={emp._id} value={emp._id}>{emp.name} ({emp.employeeId})</option>)}
                       </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Period Month</label>
                        <select className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none" value={formData.month} onChange={e => setFormData({...formData, month: e.target.value})}>
                          {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                     </div>
                     <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Fiscal Year</label>
                        <input type="number" className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none" value={formData.year} onChange={e => setFormData({...formData, year: Number(e.target.value)})} />
                     </div>
                  </div>
                  <div className="p-6 bg-slate-900 rounded-3xl text-white">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Final Disbursable Amount</p>
                     <div className="flex items-center gap-2">
                        <IndianRupee size={24} className="text-blue-400" />
                        <input
                          type="number"
                          className="bg-transparent border-none outline-none text-3xl font-black text-white w-full"
                          value={formData.manualTotalPaid}
                          onChange={e => setFormData({...formData, manualTotalPaid: Number(e.target.value)})}
                        />
                     </div>
                     <p className="text-[10px] text-slate-500 mt-4 font-bold italic">* This field is editable for final manual override.</p>
                  </div>
               </div>

               {/* Right: Calculations */}
               <div className="space-y-6 p-6 bg-blue-50/30 rounded-3xl border border-blue-100/50">
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Base Salary</label>
                        <input type="number" className="w-full px-4 py-2.5 bg-white border border-blue-100 rounded-xl outline-none text-sm font-bold" value={formData.baseSalary} onChange={e => setFormData({...formData, baseSalary: Number(e.target.value)})} />
                     </div>
                     <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Daily Allowance</label>
                        <input type="number" className="w-full px-4 py-2.5 bg-white border border-blue-100 rounded-xl outline-none text-sm font-bold" value={formData.dailyAllowance} onChange={e => setFormData({...formData, dailyAllowance: Number(e.target.value)})} />
                     </div>
                     <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Days Worked</label>
                        <input type="number" className="w-full px-4 py-2.5 bg-white border border-blue-100 rounded-xl outline-none text-sm font-bold" value={formData.daysWorked} onChange={e => setFormData({...formData, daysWorked: Number(e.target.value)})} />
                     </div>
                     <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Performance Bonus</label>
                        <input type="number" className="w-full px-4 py-2.5 bg-white border border-blue-100 rounded-xl outline-none text-sm font-bold" value={formData.bonus} onChange={e => setFormData({...formData, bonus: Number(e.target.value)})} />
                     </div>
                  </div>
                  <div className="h-px bg-blue-100"></div>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-red-600 uppercase tracking-widest">Leave Deductions</label>
                        <input type="number" className="w-full px-4 py-2.5 bg-white border border-red-100 rounded-xl outline-none text-sm font-bold" value={formData.leaveDeductions} onChange={e => setFormData({...formData, leaveDeductions: Number(e.target.value)})} />
                     </div>
                     <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-red-600 uppercase tracking-widest">Tax/TDS</label>
                        <input type="number" className="w-full px-4 py-2.5 bg-white border border-red-100 rounded-xl outline-none text-sm font-bold" value={formData.taxDeductions} onChange={e => setFormData({...formData, taxDeductions: Number(e.target.value)})} />
                     </div>
                  </div>
                  <div className="flex justify-end gap-3 pt-4">
                     <button type="submit" className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20">
                        <Save size={16} /> Finalize & Save
                     </button>
                  </div>
               </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Payroll Management</h1>
          <p className="text-slate-500 font-medium">Coordinate monthly salary disbursement and financial records.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
            <Download size={18} />
            Export Records
          </button>
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-blue-600 px-5 py-2.5 rounded-xl text-sm font-bold text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20">
            <Plus size={18} />
            Process Salary
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto text-left">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th className="px-8 py-5">Personnel</th>
                <th className="px-8 py-5">Period</th>
                <th className="px-8 py-5">Calculation Summary</th>
                <th className="px-8 py-5">Disbursement Status</th>
                <th className="px-8 py-5 text-right">Audit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan="5" className="px-8 py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">Accessing Financial Vault...</td></tr>
              ) : payrolls.length === 0 ? (
                <tr><td colSpan="5" className="px-8 py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">No payroll records detected</td></tr>
              ) : payrolls.map((pay) => (
                <tr key={pay._id} className="hover:bg-slate-50/50 transition-all group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center font-black">
                        {pay.employee?.name?.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900 leading-tight mb-1">{pay.employee?.name}</p>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ID: {pay.employee?.employeeId}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-sm font-black text-slate-700">{pay.month}</p>
                    <p className="text-xs text-slate-400 font-bold">{pay.year}</p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                       <span className="text-sm font-black text-slate-900 flex items-center gap-1"><IndianRupee size={14} className="text-slate-400" /> {pay.totalPaid.toLocaleString()}</span>
                       <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Gross Payable</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    {pay.status === 'PAID' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                        <CheckCircle2 size={12} /> Paid
                      </span>
                    ) : (
                      <button onClick={() => handleStatusUpdate(pay._id, 'PAID')} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-amber-100 hover:bg-amber-600 hover:text-white transition-all">
                        <Clock size={12} /> Mark as Paid
                      </button>
                    )}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">
                      Review Payslip
                    </button>
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

export default PayrollManager;
