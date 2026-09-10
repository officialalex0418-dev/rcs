import React, { useState, useEffect } from 'react';
import {
  Users, UserPlus, UserMinus, ShieldCheck, Calendar, Briefcase, FileText,
  TrendingUp, TrendingDown, Clock, Activity, Download, RefreshCcw,
  ChevronDown, ArrowRight, Target, PieChart as PieIcon, BarChart3,
  Zap, AlertTriangle, CheckCircle2, MoreVertical, Heart
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie, Legend, ComposedChart, Line
} from 'recharts';
import { format, startOfMonth, endOfMonth, subMonths, startOfToday, endOfToday, startOfYesterday, startOfWeek, endOfWeek, startOfYear } from 'date-fns';
import { apiFetch } from '../../utils/api';
import { exportToPdf } from '../../utils/export';
import Modal from '../components/Modal';

const HRReport = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    preset: 'This Month',
    start: startOfMonth(new Date()),
    end: endOfMonth(new Date())
  });
  const [selectedDept, setSelectedDept] = useState('All');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const fetchHRReport = async () => {
    setLoading(true);
    try {
      const response = await apiFetch(`/api/reports/hr?startDate=${dateRange.start.toISOString()}&endDate=${dateRange.end.toISOString()}&department=${selectedDept}`);
      const result = await response.json();
      if (result.success) setData(result.data);
    } catch (err) {
      console.error('HR Report fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHRReport();
  }, [dateRange.start, dateRange.end, selectedDept]);

  const handlePresetChange = (preset) => {
    let start = new Date();
    let end = new Date();
    switch (preset) {
      case 'Today': start = startOfToday(); end = endOfToday(); break;
      case 'Yesterday': start = subMonths(new Date(), 1); break; // Simplified for this example
      case 'This Week': start = startOfWeek(new Date()); end = endOfWeek(new Date()); break;
      case 'Last Month': start = startOfMonth(subMonths(new Date(), 1)); end = endOfMonth(subMonths(new Date(), 1)); break;
      case 'This Year': start = startOfYear(new Date()); break;
      default: start = startOfMonth(new Date()); end = endOfMonth(new Date());
    }
    setDateRange({ preset, start, end });
    setShowDatePicker(false);
  };

  if (!data && loading) return <div className="p-8 animate-pulse space-y-10"><div className="h-20 bg-white rounded-3xl w-1/3"></div><div className="grid grid-cols-4 gap-6">{[...Array(4)].map((_, i) => <div key={i} className="h-32 bg-white rounded-3xl"></div>)}</div></div>;

  const { summary, previousSummary, trends, departments, funnel, payroll, probation, activities } = data || {};

  return (
    <div className="p-8 space-y-10 animate-in fade-in duration-700 bg-slate-50 min-h-screen">

      {/* Header */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                 <Users size={22} />
              </div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">HR Intelligence</h1>
           </div>
           <p className="text-slate-500 font-medium ml-1">Workforce, recruitment and performance diagnostics.</p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
           <select
             className="px-5 py-3.5 bg-white border border-slate-200 rounded-2xl shadow-sm font-bold text-sm text-slate-700 outline-none hover:border-indigo-500 transition-all"
             value={selectedDept}
             onChange={(e) => setSelectedDept(e.target.value)}
           >
              <option value="All">All Departments</option>
              {departments?.map(d => <option key={d._id} value={d._id}>{d._id}</option>)}
           </select>

           <div className="relative">
              <button
                onClick={() => setShowDatePicker(!showDatePicker)}
                className="flex items-center gap-3 px-5 py-3.5 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-indigo-500 transition-all font-bold text-sm text-slate-700"
              >
                 <Calendar size={18} className="text-indigo-600" />
                 <span>{format(dateRange.start, 'MMM dd')} — {format(dateRange.end, 'MMM dd')}</span>
                 <ChevronDown size={16} />
              </button>
              {showDatePicker && (
                <div className="absolute right-0 mt-3 w-64 bg-white rounded-3xl shadow-2xl border border-slate-100 p-4 z-50 grid grid-cols-1 gap-1">
                   {['Today', 'This Week', 'This Month', 'Last Month', 'This Year'].map(p => (
                     <button key={p} onClick={() => handlePresetChange(p)} className={`text-left px-4 py-2.5 rounded-xl text-xs font-bold ${dateRange.preset === p ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50'}`}>{p}</button>
                   ))}
                </div>
              )}
           </div>

           <button
             onClick={() => exportToPdf('hr-report-content', `RCS-HR-Report-${format(new Date(), 'yyyy-MM-dd')}.pdf`)}
             className="flex items-center gap-2 px-6 py-3.5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-slate-900/10 hover:bg-indigo-600 transition-all"
           >
              <Download size={16} /> Export
           </button>
        </div>
      </div>

      <div id="hr-report-content" className="space-y-10">
         {/* Top KPIs */}
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4">
            <HrKpiCard icon={Users} label="Workforce" value={summary?.total} prevValue={previousSummary?.total} color="indigo" />
            <HrKpiCard icon={UserPlus} label="New Hires" value={summary?.hired} prevValue={previousSummary?.hired} color="emerald" />
            <HrKpiCard icon={UserMinus} label="Exits" value={summary?.left} prevValue={previousSummary?.left} color="rose" invert />
            <HrKpiCard icon={ShieldCheck} label="Active" value={summary?.total - (summary?.left || 0)} prevValue={previousSummary?.total - (previousSummary?.left || 0)} color="blue" />
            <HrKpiCard icon={Clock} label="On Leave" value={summary?.onLeave} prevValue={previousSummary?.onLeave} color="amber" />
            <HrKpiCard icon={Briefcase} label="Vacancies" value={summary?.vacancies} prevValue={previousSummary?.vacancies} color="purple" />
            <HrKpiCard icon={FileText} label="Applications" value={summary?.apps} prevValue={previousSummary?.apps} color="cyan" />
            <HrKpiCard icon={CheckCircle2} label="Selected" value={funnel?.hired} prevValue={0} color="teal" />
         </div>

         {/* Health Score & Workforce Trend */}
         <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12 xl:col-span-4 bg-white rounded-[2.5rem] p-10 border border-slate-200/60 shadow-sm flex flex-col items-center text-center">
               <h2 className="text-lg font-black text-slate-900 mb-8 self-start">HR Health Score</h2>
               <div className="relative w-48 h-48 flex items-center justify-center mb-6">
                  <svg className="w-full h-full transform -rotate-90">
                     <circle cx="96" cy="96" r="84" stroke="#f1f5f9" strokeWidth="16" fill="transparent" />
                     <circle cx="96" cy="96" r="84" stroke="#4f46e5" strokeWidth="16" fill="transparent" strokeDasharray="527" strokeDashoffset={527 * (1 - 0.86)} strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                     <span className="text-4xl font-black text-slate-900">86</span>
                     <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Excellent</span>
                  </div>
               </div>
               <div className="grid grid-cols-2 gap-4 w-full text-left mt-4">
                  <HealthMetric label="Retention" val="92%" color="indigo" />
                  <HealthMetric label="Efficiency" val="84%" color="emerald" />
                  <HealthMetric label="Hiring" val="78%" color="blue" />
                  <HealthMetric label="Stability" val="90%" color="amber" />
               </div>
            </div>

            <div className="col-span-12 xl:col-span-8 bg-white rounded-[2.5rem] p-10 border border-slate-200/60 shadow-sm">
               <h2 className="text-xl font-black text-slate-900 tracking-tight mb-10 uppercase">Workforce Growth Trend</h2>
               <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                     <AreaChart data={trends?.joining}>
                        <defs>
                           <linearGradient id="colorHire" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                              <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                           </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="_id" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} />
                        <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                        <Area type="monotone" dataKey="count" stroke="#4f46e5" strokeWidth={4} fill="url(#colorHire)" />
                     </AreaChart>
                  </ResponsiveContainer>
               </div>
            </div>
         </div>

         {/* Recruitment Funnel & Depts */}
         <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <div className="bg-white rounded-[2.5rem] p-10 border border-slate-200/60 shadow-sm">
               <h2 className="text-xl font-black text-slate-900 mb-10 uppercase">Recruitment Funnel Efficiency</h2>
               <div className="space-y-6">
                  <FunnelStage label="Total Applications" val={funnel?.total} total={funnel?.total} color="slate" />
                  <FunnelStage label="Shortlisted" val={funnel?.shortlisted} total={funnel?.total} color="indigo" />
                  <FunnelStage label="Interviewed" val={funnel?.interviewed} total={funnel?.total} color="blue" />
                  <FunnelStage label="Hired" val={funnel?.hired} total={funnel?.total} color="emerald" />
                  <div className="pt-6 grid grid-cols-3 gap-4">
                     <div className="text-center p-4 bg-slate-50 rounded-2xl">
                        <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Conversion</p>
                        <h4 className="text-lg font-black text-slate-900">{funnel?.total ? ((funnel.hired / funnel.total) * 100).toFixed(1) : 0}%</h4>
                     </div>
                     <div className="text-center p-4 bg-slate-50 rounded-2xl">
                        <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Success</p>
                        <h4 className="text-lg font-black text-slate-900">{funnel?.interviewed ? ((funnel.hired / funnel.interviewed) * 100).toFixed(1) : 0}%</h4>
                     </div>
                     <div className="text-center p-4 bg-slate-50 rounded-2xl">
                        <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Time to Hire</p>
                        <h4 className="text-lg font-black text-slate-900">14 Days</h4>
                     </div>
                  </div>
               </div>
            </div>

            <div className="bg-white rounded-[2.5rem] p-10 border border-slate-200/60 shadow-sm flex flex-col">
               <h2 className="text-xl font-black text-slate-900 mb-10 uppercase">Workforce by Department</h2>
               <div className="flex-1 h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                     <PieChart>
                        <Pie data={departments} innerRadius={80} outerRadius={110} paddingAngle={5} dataKey="count" nameKey="_id">
                           {departments?.map((_, i) => <Cell key={i} fill={['#4f46e5', '#10b981', '#3b82f6', '#f59e0b', '#8b5cf6'][i % 5]} />)}
                        </Pie>
                        <Tooltip />
                     </PieChart>
                  </ResponsiveContainer>
               </div>
               <div className="grid grid-cols-2 gap-4 mt-8">
                  {departments?.slice(0, 4).map((d, i) => (
                    <div key={i} className="flex items-center gap-3">
                       <div className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: ['#4f46e5', '#10b981', '#3b82f6', '#f59e0b'][i % 4]}}></div>
                       <div className="flex flex-col">
                          <span className="text-[10px] font-black text-slate-900 uppercase leading-none">{d._id || 'General'}</span>
                          <span className="text-[9px] font-bold text-slate-400">{d.count} Members</span>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
         </div>

         {/* Payroll & Alerts */}
         <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            <div className="xl:col-span-8 bg-white rounded-[2.5rem] p-10 border border-slate-200/60 shadow-sm">
               <div className="flex justify-between items-center mb-10">
                  <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Payroll Outflow Overview</h2>
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl font-black text-[10px] uppercase">Month: {format(new Date(), 'MMMM')}</div>
               </div>
               <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-10">
                  <PayrollBox label="Total Paid" val={`Rs. ${payroll?.total?.toLocaleString()}`} color="indigo" />
                  <PayrollBox label="Base Salary" val={`Rs. ${payroll?.base?.toLocaleString()}`} color="slate" />
                  <PayrollBox label="Allowances" val={`Rs. ${payroll?.allowance?.toLocaleString()}`} color="emerald" />
                  <PayrollBox label="Deductions" val={`Rs. ${payroll?.deductions?.toLocaleString()}`} color="rose" />
               </div>
               <div className="h-40 flex items-end justify-between gap-3">
                  {[40, 70, 45, 90, 65, 80, 55, 30, 60, 85].map((h, i) => (
                    <div key={i} className="flex-1 bg-slate-50 rounded-xl relative group overflow-hidden">
                       <div className="absolute bottom-0 left-0 right-0 bg-indigo-500 rounded-xl opacity-20 group-hover:opacity-100 transition-all duration-500" style={{height: `${h}%`}}></div>
                    </div>
                  ))}
               </div>
            </div>

            <div className="xl:col-span-4 bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl">
               <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
               <h2 className="text-xl font-black mb-8 uppercase tracking-tight flex items-center gap-2">
                  <AlertTriangle className="text-rose-500" size={20} /> HR Alerts
               </h2>
               <div className="space-y-6">
                  {probation?.map((p, i) => (
                    <div key={i} className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 group hover:bg-white/10 transition-all">
                       <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-500 flex items-center justify-center flex-shrink-0"><Zap size={20} /></div>
                       <div>
                          <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-1 leading-none">Probation Ending</p>
                          <h4 className="text-sm font-bold text-white mb-1 leading-tight">{p.name}</h4>
                          <p className="text-[9px] font-medium text-slate-400 uppercase leading-none">{format(new Date(p.probationUntil), 'MMM dd, yyyy')}</p>
                       </div>
                    </div>
                  ))}
                  {(!probation || probation.length === 0) && <div className="py-10 text-center text-slate-500 font-bold uppercase text-[10px]">No urgent alerts detected</div>}
               </div>
               <button className="w-full mt-10 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">View All Alerts</button>
            </div>
         </div>

         {/* Activity Timeline */}
         <div className="bg-white rounded-[2.5rem] p-10 border border-slate-200/60 shadow-sm">
            <div className="flex justify-between items-center mb-10">
               <h2 className="text-xl font-black text-slate-900 uppercase">Recent HR Activities</h2>
               <button className="p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all"><MoreVertical size={18} className="text-slate-400" /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               {activities?.map((a, i) => (
                 <div key={i} className="p-6 rounded-3xl bg-slate-50 border border-slate-100 group hover:bg-indigo-50 hover:border-indigo-100 transition-all">
                    <div className={`w-10 h-10 rounded-xl mb-6 flex items-center justify-center ${a.employmentStatus === 'ACTIVE' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                       {a.employmentStatus === 'ACTIVE' ? <UserPlus size={20} /> : <UserMinus size={20} />}
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">{a.employmentStatus}</p>
                    <h4 className="text-sm font-black text-slate-900 mb-4">{a.name}</h4>
                    <div className="flex justify-between items-center pt-4 border-t border-slate-200/50">
                       <span className="text-[9px] font-bold text-slate-400 uppercase">{a.department}</span>
                       <span className="text-[9px] font-black text-slate-600 uppercase tracking-tighter">{format(new Date(a.updatedAt), 'MMM dd')}</span>
                    </div>
                 </div>
               ))}
            </div>
         </div>

         {/* Quick Actions */}
         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 pb-20">
            <QuickBtn label="Employees" icon={Users} path="/admin/employees" color="indigo" />
            <QuickBtn label="Vacancies" icon={Briefcase} path="/admin/careers" color="purple" />
            <QuickBtn label="Applications" icon={FileText} path="/admin/applications" color="blue" />
            <QuickBtn label="Attendance" icon={Clock} path="/admin/attendance" color="amber" />
            <QuickBtn label="Payroll" icon={TrendingUp} path="/admin/payroll" color="emerald" />
            <QuickBtn label="Performance" icon={Activity} path="/admin/reports" color="rose" />
         </div>
      </div>
    </div>
  );
};

// Sub-components
const HrKpiCard = ({ icon: Icon, label, value, prevValue, color, invert }) => {
  const percentChange = prevValue ? Math.round(((value - prevValue) / prevValue) * 100) : 100;
  const isUp = value >= prevValue;
  const isPositive = invert ? !isUp : isUp;

  const colors = {
    indigo: 'text-indigo-600 bg-indigo-50 border-indigo-100',
    emerald: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    rose: 'text-rose-600 bg-rose-50 border-rose-100',
    blue: 'text-blue-600 bg-blue-50 border-blue-100',
    amber: 'text-amber-600 bg-amber-50 border-amber-100',
    purple: 'text-purple-600 bg-purple-50 border-purple-100',
    cyan: 'text-cyan-600 bg-cyan-50 border-cyan-100',
    teal: 'text-teal-600 bg-teal-50 border-teal-100',
  };

  return (
    <div className="bg-white p-4 rounded-3xl border border-slate-200/60 shadow-sm hover:shadow-xl transition-all flex flex-col items-center text-center">
       <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 border ${colors[color]}`}><Icon size={18} /></div>
       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
       <h3 className="text-xl font-black text-slate-900 leading-none mb-1">{value || 0}</h3>
       <div className={`flex items-center gap-0.5 font-black text-[9px] ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
          {isUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
          {Math.abs(percentChange)}%
       </div>
    </div>
  );
};

const HealthMetric = ({ label, val, color }) => (
  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
     <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
     <div className="flex items-center justify-between">
        <span className="text-xs font-black text-slate-900">{val}</span>
        <div className={`w-1.5 h-1.5 rounded-full ${color === 'indigo' ? 'bg-indigo-500' : color === 'emerald' ? 'bg-emerald-500' : color === 'blue' ? 'bg-blue-500' : 'bg-amber-500'}`}></div>
     </div>
  </div>
);

const FunnelStage = ({ label, val, total, color }) => {
  const width = total ? Math.round((val / total) * 100) : 0;
  return (
    <div className="space-y-1.5">
       <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
          <span className="text-slate-500">{label}</span>
          <span className="text-slate-900">{val}</span>
       </div>
       <div className="h-2.5 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
          <div className={`h-full rounded-full transition-all duration-1000 ${color === 'slate' ? 'bg-slate-400' : color === 'indigo' ? 'bg-indigo-500' : color === 'blue' ? 'bg-blue-500' : 'bg-emerald-500'}`} style={{width: `${width}%`}}></div>
       </div>
    </div>
  );
};

const PayrollBox = ({ label, val, color }) => (
  <div className={`p-5 rounded-3xl border ${color === 'indigo' ? 'bg-indigo-50 border-indigo-100 text-indigo-600' : color === 'emerald' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : color === 'rose' ? 'bg-rose-50 border-rose-100 text-rose-600' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
     <p className="text-[9px] font-black uppercase tracking-widest mb-1 opacity-70">{label}</p>
     <h4 className="text-sm font-black truncate">{val || 0}</h4>
  </div>
);

const QuickBtn = ({ label, icon: Icon, path, color }) => (
  <button
    onClick={() => window.location.href = path}
    className="flex flex-col items-center gap-3 p-4 bg-white border border-slate-200 rounded-3xl hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-500/5 transition-all group"
  >
     <div className={`w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform ${color === 'indigo' ? 'bg-indigo-50 text-indigo-600' : color === 'purple' ? 'bg-purple-50 text-purple-600' : color === 'blue' ? 'bg-blue-50 text-blue-600' : color === 'amber' ? 'bg-amber-50 text-amber-600' : color === 'emerald' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
        <Icon size={18} />
     </div>
     <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-slate-900">{label}</span>
  </button>
);

const EmptyState = ({ label }) => (
  <div className="py-10 flex flex-col items-center justify-center text-center opacity-30">
     <Clock className="text-slate-400 mb-2" size={32} />
     <p className="text-[10px] font-black text-slate-500 uppercase">{label}</p>
  </div>
);

export default HRReport;
