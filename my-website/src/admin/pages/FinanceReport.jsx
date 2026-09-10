import React, { useState, useEffect } from 'react';
import {
  DollarSign, TrendingUp, TrendingDown, Wallet, CreditCard, PieChart as PieIcon,
  BarChart3, Activity, Download, RefreshCcw, Calendar, ChevronDown,
  ArrowUpRight, Target, ShieldCheck, Clock, Briefcase, Users
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie, Legend, LineChart, Line
} from 'recharts';
import { format, startOfMonth, endOfMonth, subMonths, startOfToday, endOfToday, startOfWeek, endOfWeek, startOfYear } from 'date-fns';
import { apiFetch } from '../../utils/api';
import { exportToPdf } from '../../utils/export';
import Modal from '../components/Modal';

const FinanceReport = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    preset: 'This Month',
    start: startOfMonth(new Date()),
    end: endOfMonth(new Date())
  });
  const [showDatePicker, setShowDatePicker] = useState(false);

  const fetchFinanceReport = async () => {
    setLoading(true);
    try {
      const query = `startDate=${dateRange.start.toISOString()}&endDate=${dateRange.end.toISOString()}`;
      const response = await apiFetch(`/api/reports/finance?${query}`);
      const result = await response.json();
      if (result.success) setData(result.data);
    } catch (err) {
      console.error('Finance Report fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinanceReport();
  }, [dateRange.start, dateRange.end]);

  const handlePresetChange = (preset) => {
    let start = new Date();
    let end = new Date();
    switch (preset) {
      case 'Today': start = startOfToday(); end = endOfToday(); break;
      case 'This Week': start = startOfWeek(new Date()); end = endOfWeek(new Date()); break;
      case 'Last Month': start = startOfMonth(subMonths(new Date(), 1)); end = endOfMonth(subMonths(new Date(), 1)); break;
      case 'This Year': start = startOfYear(new Date()); break;
      default: start = startOfMonth(new Date()); end = endOfMonth(new Date());
    }
    setDateRange({ preset, start, end });
    setShowDatePicker(false);
  };

  if (!data && loading) return <div className="p-8 animate-pulse space-y-10"><div className="h-20 bg-white rounded-3xl w-1/3"></div><div className="grid grid-cols-4 gap-6">{[...Array(4)].map((_, i) => <div key={i} className="h-32 bg-white rounded-3xl"></div>)}</div></div>;

  const { summary, previousSummary, trends, projectProfits, clientRevenue } = data || {};

  return (
    <div className="p-8 space-y-10 animate-in fade-in duration-700 bg-slate-50 min-h-screen">

      {/* Header */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                 <DollarSign size={22} />
              </div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Financial Intelligence</h1>
           </div>
           <p className="text-slate-500 font-medium ml-1">Comprehensive overview of revenue, expenses and profitability.</p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
           <div className="relative">
              <button
                onClick={() => setShowDatePicker(!showDatePicker)}
                className="flex items-center gap-3 px-5 py-3.5 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-emerald-500 transition-all font-bold text-sm text-slate-700"
              >
                 <Calendar size={18} className="text-emerald-600" />
                 <span>{format(dateRange.start, 'MMM dd')} — {format(dateRange.end, 'MMM dd')}</span>
                 <ChevronDown size={16} />
              </button>
              {showDatePicker && (
                <div className="absolute right-0 mt-3 w-64 bg-white rounded-3xl shadow-2xl border border-slate-100 p-4 z-50 grid grid-cols-1 gap-1">
                   {['Today', 'This Week', 'This Month', 'Last Month', 'This Year'].map(p => (
                     <button key={p} onClick={() => handlePresetChange(p)} className={`text-left px-4 py-2.5 rounded-xl text-xs font-bold ${dateRange.preset === p ? 'bg-emerald-50 text-emerald-600' : 'text-slate-500 hover:bg-slate-50'}`}>{p}</button>
                   ))}
                </div>
              )}
           </div>

           <button
             onClick={() => exportToPdf('finance-report-content', `RCS-Finance-Report-${format(new Date(), 'yyyy-MM-dd')}.pdf`)}
             className="flex items-center gap-2 px-6 py-3.5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-slate-900/10 hover:bg-emerald-600 transition-all"
           >
              <Download size={16} /> Export
           </button>
        </div>
      </div>

      <div id="finance-report-content" className="space-y-10">
         {/* Top KPIs */}
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <FinKpiCard icon={TrendingUp} label="Total Revenue" value={`Rs. ${summary?.revenue?.toLocaleString()}`} prevValue={previousSummary?.revenue} color="emerald" />
            <FinKpiCard icon={TrendingDown} label="Total Expenses" value={`Rs. ${summary?.expense?.toLocaleString()}`} prevValue={previousSummary?.expense} color="rose" invert />
            <FinKpiCard icon={Wallet} label="Net Profit" value={`Rs. ${summary?.profit?.toLocaleString()}`} prevValue={previousSummary?.profit} color="blue" />
            <FinKpiCard icon={Activity} label="Profit Margin" value={`${summary?.margin}%`} prevValue={previousSummary?.margin} color="indigo" />
         </div>

         {/* Secondary KPIs */}
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4">
            <MiniFinCard label="Collected" value="Rs. 425K" color="emerald" />
            <MiniFinCard label="Receivables" value="Rs. 180K" color="amber" />
            <MiniFinCard label="Overdue" value="Rs. 45K" color="rose" />
            <MiniFinCard label="Payroll" value={`Rs. ${Math.round(summary?.payroll?.expense / 1000)}K`} color="indigo" />
            <MiniFinCard label="Operational" value="Rs. 32K" color="slate" />
            <MiniFinCard label="Taxes" value="Rs. 12K" color="orange" />
            <MiniFinCard label="Cash Flow" value="+Rs. 82K" color="cyan" />
            <MiniFinCard label="Targets" value="92%" color="teal" />
         </div>

         {/* Charts Row */}
         <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12 xl:col-span-8 bg-white rounded-[2.5rem] p-10 border border-slate-200/60 shadow-sm">
               <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-10">Revenue Flow Diagnostics</h2>
               <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                     <AreaChart data={trends}>
                        <defs>
                           <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                           </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="_id" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} />
                        <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                        <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={4} fill="url(#colorRev)" />
                     </AreaChart>
                  </ResponsiveContainer>
               </div>
            </div>

            <div className="col-span-12 xl:col-span-4 bg-white rounded-[2.5rem] p-10 border border-slate-200/60 shadow-sm flex flex-col">
               <h2 className="text-xl font-black text-slate-900 uppercase mb-8">Expense Breakdown</h2>
               <div className="flex-1 h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                     <PieChart>
                        <Pie data={[
                          { name: 'Payroll', value: summary?.expense * 0.7, fill: '#6366f1' },
                          { name: 'Operations', value: summary?.expense * 0.15, fill: '#10b981' },
                          { name: 'Marketing', value: summary?.expense * 0.1, fill: '#f59e0b' },
                          { name: 'Misc', value: summary?.expense * 0.05, fill: '#ef4444' }
                        ]} innerRadius={70} outerRadius={100} paddingAngle={5} dataKey="value">
                           <Cell fill="#6366f1" />
                           <Cell fill="#10b981" />
                           <Cell fill="#f59e0b" />
                           <Cell fill="#ef4444" />
                        </Pie>
                        <Tooltip />
                     </PieChart>
                  </ResponsiveContainer>
               </div>
               <div className="space-y-3 mt-8">
                  <ExpenseItem label="Payroll / Salaries" val="70%" color="indigo" />
                  <ExpenseItem label="Operating Costs" val="15%" color="emerald" />
                  <ExpenseItem label="SaaS & Marketing" val="10%" color="amber" />
                  <ExpenseItem label="Misc / Buffers" val="5%" color="rose" />
               </div>
            </div>
         </div>

         {/* Data Tables Row */}
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-[2.5rem] p-10 border border-slate-200/60 shadow-sm">
               <h2 className="text-xl font-black text-slate-900 uppercase mb-8">Project Profitability</h2>
               <div className="space-y-5">
                  {projectProfits?.map((p, i) => (
                    <div key={i} className="p-5 border border-slate-50 rounded-3xl hover:bg-slate-50 transition-all cursor-pointer group">
                       <div className="flex justify-between items-start mb-3">
                          <div>
                             <h4 className="font-black text-slate-900 text-sm group-hover:text-emerald-600 transition-colors">{p.name}</h4>
                             <p className="text-[10px] font-bold text-slate-400 uppercase">{p.client}</p>
                          </div>
                          <p className="text-sm font-black text-slate-900">Rs. {p.budget?.toLocaleString()}</p>
                       </div>
                       <div className="flex items-center gap-4">
                          <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                             <div className="h-full bg-emerald-500" style={{width: `${p.progress}%`}}></div>
                          </div>
                          <span className="text-[10px] font-black text-slate-400">{p.progress}%</span>
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            <div className="bg-white rounded-[2.5rem] p-10 border border-slate-200/60 shadow-sm overflow-hidden flex flex-col">
               <h2 className="text-xl font-black text-slate-900 uppercase mb-8">Top Revenue Clients</h2>
               <div className="flex-1 space-y-6">
                  {clientRevenue?.map((c, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-emerald-300 transition-all">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-xs font-black text-slate-400">{c._id?.charAt(0)}</div>
                          <div>
                             <p className="text-sm font-black text-slate-900 leading-none mb-1">{c._id || 'Private Client'}</p>
                             <p className="text-[10px] font-bold text-slate-400 uppercase">{c.projects} Completed Projects</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="text-sm font-black text-emerald-600">Rs. {c.revenue?.toLocaleString()}</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Net Contribution</p>
                       </div>
                    </div>
                  ))}
                  {(!clientRevenue || clientRevenue.length === 0) && <EmptyState label="No client revenue records" />}
               </div>
            </div>
         </div>

         {/* Bottom Alerts & Insights */}
         <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 pb-20">
            <div className="xl:col-span-2 bg-white rounded-[2.5rem] p-10 border border-slate-200/60 shadow-sm">
               <h2 className="text-xl font-black text-slate-900 uppercase mb-10">Financial Health Insights</h2>
               <div className="space-y-6">
                  <InsightItem type="positive" title="Profitability Peak" desc="Your net profit margin has reached 32%, which is 4.2% higher than the previous quarter due to reduced operational overhead." />
                  <InsightItem type="warning" title="Receivables Aging" desc="Accounts receivable have increased by 18%. 12 invoices are now reaching the 30-day overdue mark. High priority follow-up needed." />
                  <InsightItem type="neutral" title="Payroll Stability" desc="Employee costs remain stable at 70% of total outflow, matching the projected budget for this period." />
               </div>
            </div>

            <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl">
               <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
               <h2 className="text-xl font-black mb-8 uppercase tracking-tight flex items-center gap-2">
                  <ShieldCheck className="text-emerald-500" size={20} /> Targets
               </h2>
               <div className="space-y-8">
                  <div>
                     <div className="flex justify-between text-[10px] font-black uppercase mb-3"><span>Revenue Target</span><span>82%</span></div>
                     <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" style={{width: '82%'}}></div></div>
                  </div>
                  <div>
                     <div className="flex justify-between text-[10px] font-black uppercase mb-3"><span>Collection Goal</span><span>64%</span></div>
                     <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" style={{width: '64%'}}></div></div>
                  </div>
                  <div className="pt-8 border-t border-white/5">
                     <p className="text-[10px] font-bold text-slate-500 uppercase mb-1 leading-none">Monthly Run Rate</p>
                     <h3 className="text-3xl font-black leading-none">Rs. 8.2M</h3>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

// Sub-components
const FinKpiCard = ({ icon: Icon, label, value, prevValue, color, invert }) => {
  const valNum = parseFloat(value?.toString().replace(/[^0-9.]/g, '')) || 0;
  const prevNum = parseFloat(prevValue?.toString().replace(/[^0-9.]/g, '')) || 0;
  const isUp = valNum >= prevNum;
  const percent = prevNum ? Math.round(((valNum - prevNum) / prevNum) * 100) : 100;
  const isPositive = invert ? !isUp : isUp;

  const colors = {
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-emerald-500/5',
    rose: 'bg-rose-50 text-rose-600 border-rose-100 shadow-rose-500/5',
    blue: 'bg-blue-50 text-blue-600 border-blue-100 shadow-blue-500/5',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100 shadow-indigo-500/5'
  };

  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200/60 shadow-sm hover:shadow-xl transition-all group">
       <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border-2 transition-transform group-hover:scale-110 ${colors[color]}`}><Icon size={28} /></div>
       <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
       <h3 className="text-2xl font-black text-slate-900 mb-1 leading-none">{value}</h3>
       <div className={`flex items-center gap-1 font-black text-[10px] ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
          {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {Math.abs(percent)}% <span className="opacity-40 ml-1">vs prev</span>
       </div>
    </div>
  );
};

const MiniFinCard = ({ label, value, color }) => {
  const colors = {
    emerald: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    amber: 'text-amber-600 bg-amber-50 border-amber-100',
    rose: 'text-rose-600 bg-rose-50 border-rose-100',
    indigo: 'text-indigo-600 bg-indigo-50 border-indigo-100',
    slate: 'text-slate-600 bg-slate-50 border-slate-200',
    orange: 'text-orange-600 bg-orange-50 border-orange-100',
    cyan: 'text-cyan-600 bg-cyan-50 border-cyan-100',
    teal: 'text-teal-600 bg-teal-50 border-teal-100'
  };
  return (
    <div className={`p-4 rounded-2xl border text-center ${colors[color]}`}>
       <p className="text-[8px] font-black uppercase opacity-60 mb-0.5">{label}</p>
       <h4 className="text-xs font-black">{value}</h4>
    </div>
  );
};

const ExpenseItem = ({ label, val, color }) => (
  <div className="flex items-center justify-between">
     <div className="flex items-center gap-2">
        <div className={`w-1.5 h-1.5 rounded-full ${color === 'indigo' ? 'bg-indigo-500' : color === 'emerald' ? 'bg-emerald-500' : color === 'amber' ? 'bg-amber-500' : 'bg-rose-500'}`}></div>
        <span className="text-[10px] font-black text-slate-500 uppercase">{label}</span>
     </div>
     <span className="text-[10px] font-black text-slate-900">{val}</span>
  </div>
);

const InsightItem = ({ type, title, desc }) => (
  <div className={`p-8 rounded-[2rem] border ${type === 'positive' ? 'bg-emerald-50 border-emerald-100' : type === 'warning' ? 'bg-rose-50 border-rose-100' : 'bg-slate-50 border-slate-200/60'}`}>
     <div className="flex items-center gap-3 mb-3">
        <div className={`w-2 h-2 rounded-full ${type === 'positive' ? 'bg-emerald-500' : type === 'warning' ? 'bg-rose-500' : 'bg-slate-400'}`}></div>
        <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">{title}</h4>
     </div>
     <p className="text-xs font-medium text-slate-500 leading-relaxed">{desc}</p>
  </div>
);

const EmptyState = ({ label }) => (
  <div className="py-20 flex flex-col items-center justify-center text-center opacity-30">
     <Clock className="text-slate-400 mb-4" size={40} />
     <p className="text-[10px] font-black text-slate-500 uppercase">{label}</p>
  </div>
);

export default FinanceReport;
