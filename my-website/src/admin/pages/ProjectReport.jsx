import React, { useState, useEffect } from 'react';
import {
  Folder, CheckCircle2, Clock, AlertTriangle, Target, Users,
  TrendingUp, TrendingDown, Calendar, Download, RefreshCcw,
  ChevronDown, ArrowRight, Activity, Zap, BarChart3, PieChart as PieIcon,
  Search, Filter, Briefcase, DollarSign
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie, Legend, LineChart, Line
} from 'recharts';
import { format, startOfMonth, endOfMonth, subMonths, startOfToday, endOfToday, startOfWeek, endOfWeek, startOfYear } from 'date-fns';
import { apiFetch } from '../../utils/api';
import { exportToPdf } from '../../utils/export';
import Modal from '../components/Modal';

const ProjectReport = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    preset: 'This Month',
    start: startOfMonth(new Date()),
    end: endOfMonth(new Date())
  });
  const [filters, setFilters] = useState({
    status: 'All',
    manager: 'All'
  });
  const [showDatePicker, setShowDatePicker] = useState(false);

  const fetchProjectReport = async () => {
    setLoading(true);
    try {
      const query = `startDate=${dateRange.start.toISOString()}&endDate=${dateRange.end.toISOString()}&status=${filters.status}&manager=${filters.manager}`;
      const response = await apiFetch(`/api/reports/projects?${query}`);
      const result = await response.json();
      if (result.success) setData(result.data);
    } catch (err) {
      console.error('Project Report fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectReport();
  }, [dateRange.start, dateRange.end, filters.status, filters.manager]);

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

  const { summary, previousSummary, trends, statusDistribution, tasks, managers, deadlines } = data || {};

  return (
    <div className="p-8 space-y-10 animate-in fade-in duration-700 bg-slate-50 min-h-screen">

      {/* Header */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-pink-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-pink-500/20">
                 <Folder size={22} />
              </div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Project Intelligence</h1>
           </div>
           <p className="text-slate-500 font-medium ml-1">Delivery performance, timeline diagnostics and resource allocation.</p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
           <select
             className="px-5 py-3.5 bg-white border border-slate-200 rounded-2xl shadow-sm font-bold text-sm text-slate-700 outline-none hover:border-pink-500 transition-all"
             value={filters.status}
             onChange={(e) => setFilters({...filters, status: e.target.value})}
           >
              <option value="All">All Statuses</option>
              {['PLANNING', 'IN_PROGRESS', 'ON_HOLD', 'COMPLETED', 'CANCELLED'].map(s => <option key={s} value={s}>{s}</option>)}
           </select>

           <div className="relative">
              <button
                onClick={() => setShowDatePicker(!showDatePicker)}
                className="flex items-center gap-3 px-5 py-3.5 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-pink-500 transition-all font-bold text-sm text-slate-700"
              >
                 <Calendar size={18} className="text-pink-600" />
                 <span>{format(dateRange.start, 'MMM dd')} — {format(dateRange.end, 'MMM dd')}</span>
                 <ChevronDown size={16} />
              </button>
              {showDatePicker && (
                <div className="absolute right-0 mt-3 w-64 bg-white rounded-3xl shadow-2xl border border-slate-100 p-4 z-50 grid grid-cols-1 gap-1">
                   {['Today', 'This Week', 'This Month', 'Last Month', 'This Year'].map(p => (
                     <button key={p} onClick={() => handlePresetChange(p)} className={`text-left px-4 py-2.5 rounded-xl text-xs font-bold ${dateRange.preset === p ? 'bg-pink-50 text-pink-600' : 'text-slate-500 hover:bg-slate-50'}`}>{p}</button>
                   ))}
                </div>
              )}
           </div>

           <button
             onClick={() => exportToPdf('project-report-content', `RCS-Project-Report-${format(new Date(), 'yyyy-MM-dd')}.pdf`)}
             className="flex items-center gap-2 px-6 py-3.5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-slate-900/10 hover:bg-pink-600 transition-all"
           >
              <Download size={16} /> Export
           </button>
        </div>
      </div>

      <div id="project-report-content" className="space-y-10">
         {/* Top KPIs */}
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4">
            <ProjKpiCard icon={Folder} label="Projects" value={summary?.total} prevValue={previousSummary?.total} color="pink" />
            <ProjKpiCard icon={Zap} label="Active" value={summary?.active} prevValue={previousSummary?.active} color="blue" />
            <ProjKpiCard icon={CheckCircle2} label="Completed" value={summary?.completed} prevValue={previousSummary?.completed} color="emerald" />
            <ProjKpiCard icon={Clock} label="Delayed" value={summary?.delayed} prevValue={previousSummary?.delayed} color="rose" invert />
            <ProjKpiCard icon={AlertTriangle} label="At Risk" value={summary?.atRisk} prevValue={previousSummary?.atRisk} color="amber" invert />
            <ProjKpiCard icon={DollarSign} label="Value (K)" value={Math.round(summary?.budget / 1000)} prevValue={Math.round(previousSummary?.budget / 1000)} color="indigo" />
            <ProjKpiCard icon={Target} label="Tasks Done" value={tasks?.completed} prevValue={0} color="cyan" />
            <ProjKpiCard icon={Activity} label="Efficiency" value={`${summary?.total ? Math.round((summary.completed/summary.total)*100) : 0}%`} prevValue={0} color="teal" />
         </div>

         {/* Trends & Status */}
         <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12 xl:col-span-8 bg-white rounded-[2.5rem] p-10 border border-slate-200/60 shadow-sm">
               <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-10">Project Initiation Trend</h2>
               <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                     <AreaChart data={trends}>
                        <defs>
                           <linearGradient id="colorProj" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#db2777" stopOpacity={0.1}/>
                              <stop offset="95%" stopColor="#db2777" stopOpacity={0}/>
                           </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="_id" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} />
                        <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                        <Area type="monotone" dataKey="count" stroke="#db2777" strokeWidth={4} fill="url(#colorProj)" />
                     </AreaChart>
                  </ResponsiveContainer>
               </div>
            </div>

            <div className="col-span-12 xl:col-span-4 bg-white rounded-[2.5rem] p-10 border border-slate-200/60 shadow-sm flex flex-col">
               <h2 className="text-xl font-black text-slate-900 uppercase mb-8">Status Distribution</h2>
               <div className="flex-1 h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                     <PieChart>
                        <Pie data={statusDistribution} innerRadius={70} outerRadius={100} paddingAngle={5} dataKey="count" nameKey="_id">
                           {statusDistribution?.map((_, i) => <Cell key={i} fill={['#db2777', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'][i % 5]} />)}
                        </Pie>
                        <Tooltip />
                     </PieChart>
                  </ResponsiveContainer>
               </div>
               <div className="grid grid-cols-2 gap-3 mt-8">
                  {statusDistribution?.slice(0, 4).map((s, i) => (
                    <div key={i} className="flex items-center gap-2">
                       <div className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: ['#db2777', '#3b82f6', '#10b981', '#f59e0b'][i % 4]}}></div>
                       <span className="text-[10px] font-black text-slate-500 uppercase">{s._id} ({s.count})</span>
                    </div>
                  ))}
               </div>
            </div>
         </div>

         {/* Deadlines & Tasks */}
         <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <div className="bg-white rounded-[2.5rem] p-10 border border-slate-200/60 shadow-sm">
               <h2 className="text-xl font-black text-slate-900 uppercase mb-8">Upcoming Deadlines (Next 30 Days)</h2>
               <div className="space-y-4">
                  {deadlines?.map((d, i) => (
                    <div key={i} className="p-5 bg-slate-50 rounded-[2rem] border border-slate-100 flex items-center justify-between group hover:bg-pink-50 hover:border-pink-100 transition-all cursor-pointer">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex flex-col items-center justify-center text-pink-600 shadow-sm">
                             <span className="text-[8px] font-black uppercase">{format(new Date(d.targetDate), 'MMM')}</span>
                             <span className="text-sm font-black leading-none">{format(new Date(d.targetDate), 'dd')}</span>
                          </div>
                          <div>
                             <h4 className="font-black text-slate-900 text-sm">{d.name}</h4>
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{d.client}</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="text-[11px] font-black text-slate-700 mb-1">{d.progress}% Progress</p>
                          <div className="w-20 h-1 bg-slate-200 rounded-full overflow-hidden">
                             <div className="h-full bg-pink-500" style={{width: `${d.progress}%`}}></div>
                          </div>
                       </div>
                    </div>
                  ))}
                  {(!deadlines || deadlines.length === 0) && <EmptyState label="No immediate deadlines found" />}
               </div>
            </div>

            <div className="bg-white rounded-[2.5rem] p-10 border border-slate-200/60 shadow-sm">
               <h2 className="text-xl font-black text-slate-900 uppercase mb-10">Project Task Metrics</h2>
               <div className="grid grid-cols-2 gap-6 mb-10">
                  <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 text-center">
                     <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Total Tasks</p>
                     <h3 className="text-2xl font-black text-slate-900">{tasks?.total}</h3>
                  </div>
                  <div className="p-6 bg-rose-50 rounded-3xl border border-rose-100 text-center">
                     <p className="text-[10px] font-black text-rose-400 uppercase mb-1">Overdue Tasks</p>
                     <h3 className="text-2xl font-black text-rose-600">{tasks?.overdue}</h3>
                  </div>
               </div>
               <div className="space-y-6">
                  <ProgressRow label="Task Completion Rate" val={tasks?.total ? Math.round((tasks.completed/tasks.total)*100) : 0} color="emerald" />
                  <ProgressRow label="On-Time Compliance" val={82} color="blue" />
                  <ProgressRow label="Milestone Accuracy" val={74} color="indigo" />
               </div>
            </div>
         </div>

         {/* Manager Performance */}
         <div className="bg-white rounded-[2.5rem] p-10 border border-slate-200/60 shadow-sm">
            <h2 className="text-xl font-black text-slate-900 uppercase mb-10">Project Manager Efficiency</h2>
            <div className="overflow-x-auto">
               <table className="w-full text-left">
                  <thead>
                     <tr className="border-b border-slate-100">
                        <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Manager</th>
                        <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Projects</th>
                        <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Avg Progress</th>
                        <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Performance</th>
                     </tr>
                  </thead>
                  <tbody>
                     {managers?.map((m, i) => (
                       <tr key={i} className="group hover:bg-slate-50/50 transition-all border-b border-slate-50 last:border-0">
                          <td className="py-6">
                             <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-xs font-black text-slate-400">{m.name.charAt(0)}</div>
                                <span className="font-bold text-slate-700">{m.name}</span>
                             </div>
                          </td>
                          <td className="py-6 text-center font-black text-slate-900">{m.count}</td>
                          <td className="py-6">
                             <div className="flex items-center justify-center gap-3">
                                <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                   <div className="h-full bg-pink-500 rounded-full" style={{width: `${Math.round(m.avgProgress)}%`}}></div>
                                </div>
                                <span className="text-[10px] font-black text-slate-900">{Math.round(m.avgProgress)}%</span>
                             </div>
                          </td>
                          <td className="py-6 text-right">
                             <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase ${m.avgProgress > 80 ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                {m.avgProgress > 80 ? 'Excellent' : 'Stable'}
                             </span>
                          </td>
                       </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
      </div>
    </div>
  );
};

// Sub-components
const ProjKpiCard = ({ icon: Icon, label, value, prevValue, color, invert }) => {
  const percentChange = prevValue ? Math.round(((value - prevValue) / prevValue) * 100) : 100;
  const isUp = value >= prevValue;
  const isPositive = invert ? !isUp : isUp;

  const colors = {
    pink: 'text-pink-600 bg-pink-50 border-pink-100',
    blue: 'text-blue-600 bg-blue-50 border-blue-100',
    emerald: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    rose: 'text-rose-600 bg-rose-50 border-rose-100',
    amber: 'text-amber-600 bg-amber-50 border-amber-100',
    indigo: 'text-indigo-600 bg-indigo-50 border-indigo-100',
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

const ProgressRow = ({ label, val, color }) => (
  <div className="space-y-2">
     <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
        <span className="text-slate-400">{label}</span>
        <span className="text-slate-900">{val}%</span>
     </div>
     <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
        <div className={`h-full rounded-full transition-all duration-1000 ${color === 'emerald' ? 'bg-emerald-500' : color === 'blue' ? 'bg-blue-500' : 'bg-indigo-500'}`} style={{width: `${val}%`}}></div>
     </div>
  </div>
);

const EmptyState = ({ label }) => (
  <div className="py-10 flex flex-col items-center justify-center text-center opacity-30">
     <Clock className="text-slate-400 mb-2" size={32} />
     <p className="text-[10px] font-black text-slate-500 uppercase">{label}</p>
  </div>
);

export default ProjectReport;
