import React, { useState, useEffect } from 'react';
import {
  TrendingUp, TrendingDown, DollarSign, Target, Users, MessageSquare,
  Filter, Calendar, Download, RefreshCcw, ChevronDown, ArrowRight,
  PieChart as PieIcon, BarChart3, Activity, Briefcase, Zap, AlertCircle
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie, Legend, Funnel, FunnelChart, LabelList
} from 'recharts';
import { format, startOfMonth, endOfMonth, subMonths, startOfToday, endOfToday, startOfYesterday, startOfWeek, endOfWeek, startOfYear } from 'date-fns';
import { apiFetch } from '../../utils/api';
import { exportToPdf } from '../../utils/export';
import Modal from '../components/Modal';

const SalesReport = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    preset: 'This Month',
    start: startOfMonth(new Date()),
    end: endOfMonth(new Date())
  });
  const [selectedPerson, setSelectedPerson] = useState('All');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const fetchSalesReport = async () => {
    setLoading(true);
    try {
      const response = await apiFetch(`/api/reports/sales?startDate=${dateRange.start.toISOString()}&endDate=${dateRange.end.toISOString()}&salesperson=${selectedPerson}`);
      const result = await response.json();
      if (result.success) setData(result.data);
    } catch (err) {
      console.error('Sales Report fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalesReport();
  }, [dateRange.start, dateRange.end, selectedPerson]);

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

  const { summary, previousSummary, revenueTrend, leadSources, teamPerformance, funnel } = data || {};

  const funnelData = [
    { name: 'Leads', value: funnel?.leads, fill: '#6366f1' },
    { name: 'Qualified', value: funnel?.qualified, fill: '#4f46e5' },
    { name: 'Proposal', value: funnel?.proposal, fill: '#4338ca' },
    { name: 'Won', value: funnel?.won, fill: '#10b981' }
  ];

  return (
    <div className="p-8 space-y-10 animate-in fade-in duration-700 bg-slate-50 min-h-screen">

      {/* Header */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                 <TrendingUp size={22} />
              </div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Sales Intelligence</h1>
           </div>
           <p className="text-slate-500 font-medium ml-1">Complete overview of revenue, leads and pipeline health.</p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
           <select
             className="px-5 py-3.5 bg-white border border-slate-200 rounded-2xl shadow-sm font-bold text-sm text-slate-700 outline-none hover:border-emerald-500 transition-all"
             value={selectedPerson}
             onChange={(e) => setSelectedPerson(e.target.value)}
           >
              <option value="All">All Salespersons</option>
              {teamPerformance?.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
           </select>

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
             onClick={() => exportToPdf('sales-report-content', `RCS-Sales-Report-${format(new Date(), 'yyyy-MM-dd')}.pdf`)}
             className="flex items-center gap-2 px-6 py-3.5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-slate-900/10 hover:bg-emerald-600 transition-all"
           >
              <Download size={16} /> Export
           </button>
        </div>
      </div>

      <div id="sales-report-content" className="space-y-10">
         {/* KPI Summary */}
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4">
            <SalesKpiCard icon={DollarSign} label="Revenue" value={`Rs. ${summary?.revenue?.toLocaleString()}`} prevValue={previousSummary?.revenue} color="emerald" money />
            <SalesKpiCard icon={Zap} label="Won Deals" value={summary?.won} prevValue={previousSummary?.won} color="blue" />
            <SalesKpiCard icon={MessageSquare} label="Leads" value={summary?.leads} prevValue={previousSummary?.leads} color="indigo" />
            <SalesKpiCard icon={Target} label="Qualified" value={summary?.qualified} prevValue={previousSummary?.qualified} color="purple" />
            <SalesKpiCard icon={AlertCircle} label="Lost" value={summary?.lost} prevValue={previousSummary?.lost} color="rose" invert />
            <SalesKpiCard icon={Users} label="Clients" value={summary?.won} prevValue={previousSummary?.won} color="cyan" />
            <SalesKpiCard icon={Activity} label="Conv. Rate" value={`${summary?.leads ? ((summary.won/summary.leads)*100).toFixed(1) : 0}%`} prevValue={0} color="orange" />
            <SalesKpiCard icon={Briefcase} label="Pipeline" value={`Rs. ${summary?.qualified * 50000}`} prevValue={0} color="teal" money />
         </div>

         {/* Revenue Trend */}
         <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12 xl:col-span-8 bg-white rounded-[2.5rem] p-10 border border-slate-200/60 shadow-sm">
               <h2 className="text-xl font-black text-slate-900 tracking-tight mb-10 uppercase">Revenue Generation Flow</h2>
               <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                     <AreaChart data={revenueTrend}>
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
                        <Area type="monotone" dataKey="total" stroke="#10b981" strokeWidth={4} fill="url(#colorRev)" />
                     </AreaChart>
                  </ResponsiveContainer>
               </div>
            </div>

            <div className="col-span-12 xl:col-span-4 bg-white rounded-[2.5rem] p-10 border border-slate-200/60 shadow-sm flex flex-col">
               <h2 className="text-xl font-black text-slate-900 tracking-tight mb-10 uppercase text-center">Sales Funnel</h2>
               <div className="flex-1 h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                     <FunnelChart>
                        <Tooltip />
                        <Funnel dataKey="value" data={funnelData} isAnimationActive>
                           <LabelList position="right" fill="#64748b" stroke="none" dataKey="name" />
                        </Funnel>
                     </FunnelChart>
                  </ResponsiveContainer>
               </div>
               <div className="pt-6 grid grid-cols-2 gap-3 border-t border-slate-50 mt-6">
                  <div className="p-4 bg-slate-50 rounded-2xl text-center">
                     <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Win Rate</p>
                     <h4 className="text-lg font-black text-slate-900">{funnel?.leads ? ((funnel.won/funnel.leads)*100).toFixed(1) : 0}%</h4>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl text-center">
                     <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Avg Deal</p>
                     <h4 className="text-lg font-black text-slate-900">Rs. 42K</h4>
                  </div>
               </div>
            </div>
         </div>

         {/* Team & Sources */}
         <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <div className="bg-white rounded-[2.5rem] p-10 border border-slate-200/60 shadow-sm">
               <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-8">Top Sales Performers</h2>
               <div className="space-y-6">
                  {teamPerformance?.slice(0, 5).map((p, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl group hover:bg-emerald-50 transition-all">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center font-black text-emerald-600 shadow-sm">{i+1}</div>
                          <div>
                             <p className="text-sm font-black text-slate-900 mb-0.5">{p.name}</p>
                             <p className="text-[10px] font-bold text-slate-400 uppercase">{p.totalDeals} Total Deals</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="text-sm font-black text-emerald-600">{p.wonDeals} Won</p>
                          <p className="text-[10px] font-bold text-slate-400">Success: {p.totalDeals ? Math.round((p.wonDeals/p.totalDeals)*100) : 0}%</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            <div className="bg-white rounded-[2.5rem] p-10 border border-slate-200/60 shadow-sm flex flex-col">
               <h2 className="text-xl font-black text-slate-900 uppercase mb-8">Lead Source Impact</h2>
               <div className="flex-1 h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                     <PieChart>
                        <Pie data={leadSources} innerRadius={70} outerRadius={100} paddingAngle={5} dataKey="count" nameKey="_id">
                           {leadSources?.map((_, i) => <Cell key={i} fill={['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'][i % 5]} />)}
                        </Pie>
                        <Tooltip />
                     </PieChart>
                  </ResponsiveContainer>
               </div>
               <div className="grid grid-cols-2 gap-4 mt-8">
                  {leadSources?.slice(0, 4).map((s, i) => (
                    <div key={i} className="flex items-center gap-3">
                       <div className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'][i % 4]}}></div>
                       <span className="text-[10px] font-black text-slate-500 uppercase">{s._id || 'Organic'} ({s.count})</span>
                    </div>
                  ))}
               </div>
            </div>
         </div>

         {/* Sales Insights */}
         <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2 bg-white rounded-[2.5rem] p-10 border border-slate-200/60 shadow-sm">
               <h2 className="text-xl font-black text-slate-900 uppercase mb-10">Sales Health & Insights</h2>
               <div className="space-y-6">
                  <InsightItem
                    type="positive"
                    title="Revenue Growth"
                    desc={`Your revenue is up ${summary?.revenue > previousSummary?.revenue ? '+' : ''}${previousSummary?.revenue ? Math.round(((summary.revenue - previousSummary.revenue)/previousSummary.revenue)*100) : 0}% compared to the previous period.`}
                  />
                  <InsightItem
                    type="neutral"
                    title="Lead Quality"
                    desc={`${summary?.qualified} out of ${summary?.leads} leads were qualified this period. Qualified leads are the backbone of your pipeline.`}
                  />
                  <InsightItem
                    type="warning"
                    title="Lost Opportunities"
                    desc={`You've lost ${summary?.lost} potential deals. Reviewing 'Lost Reasons' in CRM could help improve the closing rate.`}
                  />
               </div>
            </div>

            <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl">
               <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
               <h2 className="text-xl font-black mb-8 uppercase tracking-tight flex items-center gap-2">
                  <Target className="text-emerald-500" size={20} /> Targets
               </h2>
               <div className="space-y-8">
                  <div>
                     <div className="flex justify-between text-[10px] font-black uppercase mb-3"><span>Monthly Target</span><span>82%</span></div>
                     <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-emerald-500 rounded-full" style={{width: '82%'}}></div></div>
                  </div>
                  <div>
                     <div className="flex justify-between text-[10px] font-black uppercase mb-3"><span>Quarterly Goal</span><span>64%</span></div>
                     <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-blue-500 rounded-full" style={{width: '64%'}}></div></div>
                  </div>
                  <div className="pt-6 border-t border-white/5">
                     <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Expected Revenue</p>
                     <h3 className="text-2xl font-black">Rs. 1,250,000</h3>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

// Sub-components
const SalesKpiCard = ({ icon: Icon, label, value, prevValue, color, invert, money }) => {
  const diff = value?.toString().replace(/[^0-9.-]/g, '') - prevValue?.toString().replace(/[^0-9.-]/g, '');
  const percentChange = prevValue ? Math.round((diff / prevValue) * 100) : 100;
  const isUp = diff >= 0;
  const isPositive = invert ? !isUp : isUp;

  const colors = {
    emerald: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    blue: 'text-blue-600 bg-blue-50 border-blue-100',
    indigo: 'text-indigo-600 bg-indigo-50 border-indigo-100',
    purple: 'text-purple-600 bg-purple-50 border-purple-100',
    rose: 'text-rose-600 bg-rose-50 border-rose-100',
    cyan: 'text-cyan-600 bg-cyan-50 border-cyan-100',
    orange: 'text-orange-600 bg-orange-50 border-orange-100',
    teal: 'text-teal-600 bg-teal-50 border-teal-100',
  };

  return (
    <div className="bg-white p-5 rounded-3xl border border-slate-200/60 shadow-sm hover:shadow-xl transition-all flex flex-col items-center text-center">
       <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 border ${colors[color]}`}><Icon size={18} /></div>
       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
       <h3 className="text-xl font-black text-slate-900 leading-none mb-1">{value || 0}</h3>
       <div className={`flex items-center gap-0.5 font-black text-[9px] ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
          {isUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
          {Math.abs(percentChange)}%
       </div>
    </div>
  );
};

const InsightItem = ({ type, title, desc }) => (
  <div className={`p-6 rounded-3xl border ${type === 'positive' ? 'bg-emerald-50 border-emerald-100' : type === 'warning' ? 'bg-rose-50 border-rose-100' : 'bg-slate-50 border-slate-100'}`}>
     <div className="flex items-center gap-2 mb-2">
        <div className={`w-2 h-2 rounded-full ${type === 'positive' ? 'bg-emerald-500' : type === 'warning' ? 'bg-rose-500' : 'bg-slate-400'}`}></div>
        <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">{title}</h4>
     </div>
     <p className="text-xs font-medium text-slate-500 leading-relaxed">{desc}</p>
  </div>
);

export default SalesReport;
