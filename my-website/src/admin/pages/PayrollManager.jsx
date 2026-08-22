import React, { useState, useEffect } from 'react';
import { IndianRupee, Download, CheckCircle2, Clock, Filter, Search, Plus } from 'lucide-react';

const PayrollManager = () => {
  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    fetchPayrolls();
  }, []);

  return (
    <div className="p-8 bg-slate-50 min-h-screen font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Payroll Management</h1>
          <p className="text-slate-500 font-medium">Review and process monthly salaries for RCS staff.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
            <Download size={18} />
            Export Slips
          </button>
          <button className="flex items-center gap-2 bg-blue-600 px-5 py-2.5 rounded-xl text-sm font-bold text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20">
            <Plus size={18} />
            Process Salary
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search by employee name..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none"
            />
          </div>
          <div className="flex gap-2">
            <select className="bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-600 outline-none">
              <option>All Months</option>
              <option>August 2026</option>
              <option>July 2026</option>
            </select>
            <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-blue-600 transition-colors">
              <Filter size={20} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Employee</th>
                <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Period</th>
                <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Amount</th>
                <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan="5" className="px-6 py-12 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">Accessing Financial Data...</td></tr>
              ) : payrolls.length === 0 ? (
                <tr><td colSpan="5" className="px-6 py-12 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">No Payroll Records for this period</td></tr>
              ) : payrolls.map((pay) => (
                <tr key={pay._id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center font-bold">
                        {pay.employee.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{pay.employee.name}</p>
                        <p className="text-[11px] text-slate-400 font-bold uppercase">{pay.employee.designation}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-700">{pay.month}</p>
                    <p className="text-xs text-slate-400">{pay.year}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 font-black text-slate-900">
                      <IndianRupee size={14} className="text-slate-400" />
                      {pay.totalPaid.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {pay.status === 'PAID' ? (
                      <span className="flex items-center gap-1.5 text-emerald-600 text-xs font-black uppercase tracking-widest">
                        <CheckCircle2 size={14} /> Paid
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-amber-500 text-xs font-black uppercase tracking-widest">
                        <Clock size={14} /> Pending
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-xs font-black text-blue-600 uppercase tracking-widest hover:underline">
                      View Slip
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
