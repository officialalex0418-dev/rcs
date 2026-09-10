import React, { useState, useEffect, useRef } from 'react';
import {
  Calendar, Download, RefreshCcw, TrendingUp, TrendingDown,
  Users, Briefcase, FileText, CheckCircle2, MessageSquare,
  Target, Globe, ShieldCheck, ArrowRight, ChevronDown, Filter,
  PieChart as PieIcon, BarChart3, Activity, Clock, X, AlertCircle
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie, Legend, LineChart, Line
} from 'recharts';
import { format, subDays, startOfMonth, endOfMonth, startOfYesterday, endOfYesterday, startOfToday, endOfToday, startOfWeek, endOfWeek, subMonths, startOfYear } from 'date-fns';
import { apiFetch } from '../../utils/api';
import Modal from '../components/Modal';
import { exportToPdf } from '../../utils/export';

const CompanyReport = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    preset: 'This Month',
    start: startOfMonth(new Date()),
    end: endOfMonth(new Date())
  });
  const [showDatePicker, setShowDatePicker] = useState(false);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const response = await apiFetch(`/api/reports/company?startDate=${dateRange.start.toISOString()}&endDate=${dateRange.end.toISOString()}`);
      const result = await response.json();
      if (result.success) setData(result.data);
    } catch (err) {
      console.error('Report fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [dateRange.start, dateRange.end]);

  const handlePresetChange = (preset) => {
    let start = new Date();
    let end = new Date();

    switch (preset) {
      case 'Today': start = startOfToday(); end = endOfToday(); break;
      case 'Yesterday': start = startOfYesterday(); end = endOfYesterday(); break;
      case 'This Week': start = startOfWeek(new Date()); end = endOfWeek(new Date()); break;
      case 'Last Month': start = startOfMonth(subMonths(new Date(), 1)); end = endOfMonth(subMonths(new Date(), 1)); break;
      case 'Last 3 Months': start = subMonths(new Date(), 3); break;
      case 'This Year': start = startOfYear(new Date()); break;
      default: start = startOfMonth(new Date()); end = endOfMonth(new Date());
    }
    setDateRange({ preset, start, end });
    setShowDatePicker(false);
  };

  if (!data && loading) return <LoadingSkeleton />;

  const { kpis, trends, departments, applicationAnalytics, recentHires, employeePerformance, projects, finance } = data || {};

  return (
    <div className="p-8 space-y-10 animate-in fade-in duration-700 bg-slate-50 min-h-screen">

      {/* Header Section */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                 <BarChart3 size={22} />
              </div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Company Analytics</h1>
           </div>
           <p className="text-slate-500 font-medium ml-1">Complete overview of business performance across all modules.</p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
           {/* Date Range Selector */}
           <div className="relative">
              <button
                onClick={() => setShowDatePicker(!showDatePicker)}
                className="flex items-center gap-3 px-5 py-3.5 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-blue-500 transition-all font-bold text-sm text-slate-700"
              >
                 <Calendar size={18} className="text-blue-600" />
                 <span>{format(dateRange.start, 'MMM dd, yyyy')} — {format(dateRange.end, 'MMM dd, yyyy')}</span>
                 <ChevronDown size={16} className={`transition-transform ${showDatePicker ? 'rotate-180' : ''}`} />
              </button>

              {showDatePicker && (
                <div className="absolute right-0 mt-3 w-64 bg-white rounded-3xl shadow-2xl border border-slate-100 p-4 z-50 grid grid-cols-1 gap-1">
                   {['Today', 'Yesterday', 'This Week', 'This Month', 'Last Month', 'Last 3 Months', 'This Year'].map(p => (
                     <button
                       key={p}
                       onClick={() => handlePresetChange(p)}
                       className={`text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-colors ${dateRange.preset === p ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-50'}`}
                     >
                       {p}
                     </button>
                   ))}
                </div>
              )}
           </div>

           <button onClick={fetchReport} className="p-3.5 bg-white border border-slate-200 rounded-2xl shadow-sm hover:bg-slate-50 transition-all text-slate-600">
              <RefreshCcw size={20} className={loading ? 'animate-spin' : ''} />
           </button>

           <button
             onClick={() => exportToPdf('report-content', `RCS-Report-${format(new Date(), 'yyyy-MM-dd')}.pdf`)}
             className="flex items-center gap-2 px-6 py-3.5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-slate-900/10 hover:bg-blue-600 transition-all"
           >
              <Download size={16} /> Export
           </button>
        </div>
      </div>

      <div id="report-content" className="space-y-10">
         {/* KPI Grid */}
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4">
            <KpiCard icon={Briefcase} label="Vacancies" value={kpis?.current?.jobs || 0} prevValue={kpis?.previous?.jobs || 0} color="purple" />
            <KpiCard icon={FileText} label="Apps" value={kpis?.current?.apps || 0} prevValue={kpis?.previous?.apps || 0} color="blue" />
            <KpiCard icon={ShieldCheck} label="Hired" value={kpis?.current?.hired || 0} prevValue={kpis?.previous?.hired || 0} color="emerald" />
            <KpiCard icon={MessageSquare} label="Leads" value={kpis?.current?.inquiries || 0} prevValue={kpis?.previous?.inquiries || 0} color="orange" />
            <KpiCard icon={TrendingUp} label="Sales" value={kpis?.current?.sales || 0} prevValue={kpis?.previous?.sales || 0} color="teal" />
            <KpiCard icon={Target} label="Projects" value={kpis?.current?.projects || 0} prevValue={kpis?.previous?.projects || 0} color="pink" />
            <KpiCard icon={Users} label="Clients" value={kpis?.current?.sales || 0} prevValue={kpis?.previous?.sales || 0} color="violet" />
            <KpiCard icon={AlertCircle} label="Lost" value={kpis?.current?.lost || 0} prevValue={kpis?.previous?.lost || 0} color="gray" />
         </div>

         {/* Main Trends & Depts */}
         <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12 xl:col-span-8 bg-white rounded-[2.5rem] p-8 border border-slate-200/60 shadow-sm">
               <h2 className="text-xl font-black text-slate-900 tracking-tight mb-10">Overall Business Growth</h2>
               <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                     <AreaChart data={trends}>
                        <defs>
                           <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                           </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="_id" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} />
                        <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                        <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={4} fill="url(#colorRev)" />
                        <Area type="monotone" dataKey="projects" stroke="#10b981" strokeWidth={4} fill="transparent" />
                     </AreaChart>
                  </ResponsiveContainer>
               </div>
            </div>

            <div className="col-span-12 xl:col-span-4 bg-white rounded-[2.5rem] p-8 border border-slate-200/60 shadow-sm flex flex-col">
               <h2 className="text-xl font-black text-slate-900 tracking-tight mb-8">Department Impact</h2>
               <div className="flex-1 h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                     <PieChart>
                        <Pie data={departments} innerRadius={70} outerRadius={100} paddingAngle={5} dataKey="count" nameKey="_id">
                           {departments?.map((_, i) => <Cell key={i} fill={['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][i % 5]} />)}
                        </Pie>
                        <Tooltip />
                     </PieChart>
                  </ResponsiveContainer>
               </div>
               <div className="grid grid-cols-2 gap-3 mt-6">
                  {departments?.slice(0, 4).map((d, i) => (
                    <div key={i} className="flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full" style={{backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'][i % 4]}}></div>
                       <span className="text-[10px] font-black text-slate-500 uppercase">{d._id || 'Misc'}</span>
                    </div>
                  ))}
               </div>
            </div>
         </div>

         {/* Middle Analytics Row */}
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200/60 shadow-sm">
               <h2 className="text-xl font-black text-slate-900 tracking-tight mb-8">Recruitment Efficiency</h2>
               <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={applicationAnalytics}>
                        <XAxis dataKey="title" hide />
                        <Tooltip />
                        <Bar dataKey="totalApps" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="hired" fill="#10b981" radius={[4, 4, 0, 0]} />
                     </BarChart>
                  </ResponsiveContainer>
               </div>
            </div>

            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200/60 shadow-sm overflow-hidden">
               <h2 className="text-xl font-black text-slate-900 tracking-tight mb-8">Recent Personnel Changes</h2>
               <div className="space-y-4">
                  {recentHires?.map((emp, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 overflow-hidden flex items-center justify-center text-xs font-black text-slate-400">
                             {emp.name.charAt(0)}
                          </div>
                          <div>
                             <p className="text-sm font-black text-slate-900 leading-none mb-1">{emp.name}</p>
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{emp.designation}</p>
                          </div>
                       </div>
                       <p className="text-[11px] font-black text-slate-700">{format(new Date(emp.joiningDate), 'MMM dd')}</p>
                    </div>
                  ))}
                  {(!recentHires || recentHires.length === 0) && <EmptyState label="No onboarding recorded" />}
               </div>
            </div>
         </div>

         {/* Performance Section */}
         <div className="bg-white rounded-[2.5rem] p-10 border border-slate-200/60 shadow-sm">
            <h2 className="text-xl font-black text-slate-900 tracking-tight mb-8 uppercase">Top Performers</h2>
            <div className="overflow-x-auto">
               <table className="w-full text-left">
                  <thead>
                     <tr className="border-b border-slate-100"><th className="pb-6 text-[10px] font-black text-slate-400 uppercase">Employee</th><th className="pb-6 text-[10px] font-black text-slate-400 uppercase">Tasks</th><th className="pb-6 text-[10px] font-black text-slate-400 uppercase">Efficiency</th></tr>
                  </thead>
                  <tbody>
                     {employeePerformance?.map((emp, i) => (
                       <tr key={i} className="border-b border-slate-50 last:border-0">
                          <td className="py-5 font-bold text-slate-700">{emp.name}</td>
                          <td className="py-5 font-black text-slate-900 text-sm">{emp.completedTasks} / {emp.taskCount}</td>
                          <td className="py-5">
                             <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-600 rounded-full" style={{width: `${emp.taskCount ? Math.round((emp.completedTasks/emp.taskCount)*100) : 0}%`}}></div>
                             </div>
                          </td>
                       </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>

         {/* Financial & Projects */}
         <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200/60 shadow-sm">
               <h2 className="text-xl font-black text-slate-900 tracking-tight mb-8">Financial Overview</h2>
               <div className="grid grid-cols-2 gap-4">
                  <div className="p-6 bg-blue-50 rounded-3xl">
                     <p className="text-[10px] font-black text-blue-400 uppercase mb-1">Total Revenue</p>
                     <h3 className="text-2xl font-black text-blue-600">Rs. {finance?.revenue?.toLocaleString()}</h3>
                  </div>
                  <div className="p-6 bg-red-50 rounded-3xl">
                     <p className="text-[10px] font-black text-red-400 uppercase mb-1">Outflow</p>
                     <h3 className="text-2xl font-black text-red-600">Rs. {finance?.expense?.toLocaleString()}</h3>
                  </div>
               </div>
            </div>

            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200/60 shadow-sm">
               <h2 className="text-xl font-black text-slate-900 tracking-tight mb-8">Project Pipeline</h2>
               <div className="space-y-4">
                  {projects?.slice(0, 4).map((p, i) => (
                    <div key={i} className="p-4 border border-slate-50 rounded-2xl">
                       <div className="flex justify-between mb-2"><span className="font-black text-slate-900">{p.name}</span><span className="text-[9px] font-black text-blue-600 uppercase">{p.status}</span></div>
                       <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-blue-600" style={{width: `${p.progress}%`}}></div></div>
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

const KpiCard = ({ icon: Icon, label, value, prevValue, color }) => {
  const percentChange = prevValue ? Math.round(((value - prevValue) / prevValue) * 100) : 100;
  const isUp = value >= prevValue;
  const colors = {
    purple: 'text-purple-600 bg-purple-50', blue: 'text-blue-600 bg-blue-50', emerald: 'text-emerald-600 bg-emerald-50', orange: 'text-orange-600 bg-orange-50',
    teal: 'text-teal-600 bg-teal-50', pink: 'text-pink-600 bg-pink-50', violet: 'text-violet-600 bg-violet-50', gray: 'text-slate-600 bg-slate-50',
  };
  return (
    <div className="bg-white p-4 rounded-3xl border border-slate-200/60 shadow-sm hover:shadow-xl transition-all">
       <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 border border-white/50 ${colors[color]}`}><Icon size={18} /></div>
       <p className="text-[9px] font-black text-slate-400 uppercase mb-1">{label}</p>
       <h3 className="text-lg font-black text-slate-900 mb-1">{value}</h3>
       <div className={`flex items-center gap-1 font-black text-[9px] ${isUp ? 'text-emerald-500' : 'text-red-500'}`}>{isUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />}{Math.abs(percentChange)}%</div>
    </div>
  );
};

const EmptyState = ({ label }) => (
  <div className="py-10 flex flex-col items-center justify-center text-center opacity-30"><Clock size={40} className="mb-2" /><p className="text-[10px] font-black uppercase">{label}</p></div>
);

const LoadingSkeleton = () => <div className="p-8 space-y-10 animate-pulse"><div className="h-20 bg-white rounded-[2.5rem] w-1/3"></div><div className="grid grid-cols-8 gap-4">{[...Array(8)].map((_, i) => <div key={i} className="h-32 bg-white rounded-3xl"></div>)}</div></div>;

export default CompanyReport;
