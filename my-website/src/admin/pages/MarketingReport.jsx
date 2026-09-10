import React, { useState, useEffect } from 'react';
import {
  Zap, TrendingUp, TrendingDown, Target, MousePointer2, Megaphone,
  Filter, Calendar, Download, RefreshCcw, ChevronDown, ArrowRight,
  PieChart as PieIcon, BarChart3, Activity, Briefcase, Globe, Mail,
  Facebook, Instagram, Linkedin, Youtube, Share2, AlertCircle, Clock
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie, Legend, Funnel, FunnelChart, LabelList
} from 'recharts';
import { format, startOfMonth, endOfMonth, subMonths, startOfToday, endOfToday, startOfWeek, endOfWeek, startOfYear } from 'date-fns';
import { apiFetch } from '../../utils/api';
import { exportToPdf } from '../../utils/export';
import Modal from '../components/Modal';

const MarketingReport = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    preset: 'This Month',
    start: startOfMonth(new Date()),
    end: endOfMonth(new Date())
  });
  const [selectedChannel, setSelectedChannel] = useState('All');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const fetchMarketingReport = async () => {
    setLoading(true);
    try {
      const query = `startDate=${dateRange.start.toISOString()}&endDate=${dateRange.end.toISOString()}&channel=${selectedChannel}`;
      const response = await apiFetch(`/api/reports/marketing?${query}`);
      const result = await response.json();
      if (result.success) setData(result.data);
    } catch (err) {
      console.error('Marketing Report fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketingReport();
  }, [dateRange.start, dateRange.end, selectedChannel]);

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

  const { summary, previousSummary, leadSources, campaigns, funnel } = data || {};

  const funnelData = [
    { name: 'Leads', value: funnel?.leads || 0, fill: '#6366f1' },
    { name: 'Qualified', value: funnel?.qualified || 0, fill: '#4f46e5' },
    { name: 'Conversions', value: funnel?.converted || 0, fill: '#10b981' }
  ];

  const getChannelIcon = (channel) => {
    switch (channel?.toLowerCase()) {
      case 'facebook': return <Facebook size={16} />;
      case 'instagram': return <Instagram size={16} />;
      case 'google': return <Globe size={16} />;
      case 'linkedin': return <Linkedin size={16} />;
      case 'email': return <Mail size={16} />;
      default: return <Share2 size={16} />;
    }
  };

  return (
    <div className="p-8 space-y-10 animate-in fade-in duration-700 bg-slate-50 min-h-screen">

      {/* Header */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                 <Megaphone size={22} />
              </div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Marketing Intelligence</h1>
           </div>
           <p className="text-slate-500 font-medium ml-1">Analytical view of campaigns, channels and marketing ROI.</p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
           <div className="relative">
              <button
                onClick={() => setShowDatePicker(!showDatePicker)}
                className="flex items-center gap-3 px-5 py-3.5 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-blue-500 transition-all font-bold text-sm text-slate-700"
              >
                 <Calendar size={18} className="text-blue-600" />
                 <span>{format(dateRange.start, 'MMM dd')} — {format(dateRange.end, 'MMM dd')}</span>
                 <ChevronDown size={16} />
              </button>
              {showDatePicker && (
                <div className="absolute right-0 mt-3 w-64 bg-white rounded-3xl shadow-2xl border border-slate-100 p-4 z-50 grid grid-cols-1 gap-1">
                   {['Today', 'This Week', 'This Month', 'Last Month', 'This Year'].map(p => (
                     <button key={p} onClick={() => handlePresetChange(p)} className={`text-left px-4 py-2.5 rounded-xl text-xs font-bold ${dateRange.preset === p ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-50'}`}>{p}</button>
                   ))}
                </div>
              )}
           </div>

           <button
             onClick={() => exportToPdf('marketing-report-content', `RCS-Marketing-Report-${format(new Date(), 'yyyy-MM-dd')}.pdf`)}
             className="flex items-center gap-2 px-6 py-3.5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-slate-900/10 hover:bg-blue-600 transition-all"
           >
              <Download size={16} /> Export
           </button>
        </div>
      </div>

      <div id="marketing-report-content" className="space-y-10">
         {/* Top KPIs */}
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4">
            <MkKpiCard icon={Megaphone} label="Campaigns" value={summary?.campaigns} prevValue={previousSummary?.campaigns} color="blue" />
            <MkKpiCard icon={Zap} label="Active" value={summary?.active} prevValue={previousSummary?.active} color="emerald" />
            <MkKpiCard icon={DollarSign} label="Spend" value={`Rs. ${Math.round(summary?.spend / 1000)}K`} prevValue={Math.round(previousSummary?.spend / 1000)} color="indigo" />
            <MkKpiCard icon={MousePointer2} label="Leads" value={summary?.leads} prevValue={previousSummary?.leads} color="purple" />
            <MkKpiCard icon={Target} label="Qualified" value={summary?.qualified} prevValue={previousSummary?.qualified} color="cyan" />
            <MkKpiCard icon={TrendingUp} label="Converted" value={summary?.converted} prevValue={previousSummary?.converted} color="teal" />
            <MkKpiCard icon={Activity} label="Conv. Rate" value={`${summary?.conversionRate}%`} prevValue={previousSummary?.conversionRate} color="orange" />
            <MkKpiCard icon={Briefcase} label="CPL" value={`Rs. ${summary?.cpl}`} prevValue={previousSummary?.cpl} color="rose" invert />
         </div>

         {/* Trends & Funnel */}
         <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12 xl:col-span-8 bg-white rounded-[2.5rem] p-10 border border-slate-200/60 shadow-sm">
               <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-10">Marketing Acquisition Flow</h2>
               <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                     <AreaChart data={[
                        { name: 'Week 1', leads: 42, conversions: 8, spend: 1500 },
                        { name: 'Week 2', leads: 58, conversions: 12, spend: 2200 },
                        { name: 'Week 3', leads: 49, conversions: 10, spend: 1800 },
                        { name: 'Week 4', leads: 72, conversions: 15, spend: 3000 }
                     ]}>
                        <defs>
                           <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                           </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} />
                        <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                        <Area type="monotone" dataKey="leads" stroke="#3b82f6" strokeWidth={4} fill="url(#colorLeads)" />
                        <Area type="monotone" dataKey="conversions" stroke="#10b981" strokeWidth={4} fill="transparent" />
                     </AreaChart>
                  </ResponsiveContainer>
               </div>
            </div>

            <div className="col-span-12 xl:col-span-4 bg-white rounded-[2.5rem] p-10 border border-slate-200/60 shadow-sm flex flex-col">
               <h2 className="text-xl font-black text-slate-900 uppercase mb-10 text-center">Conversion Funnel</h2>
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
                     <p className="text-[10px] font-black text-slate-400 uppercase mb-1">ROI</p>
                     <h4 className="text-lg font-black text-slate-900">248%</h4>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl text-center">
                     <p className="text-[10px] font-black text-slate-400 uppercase mb-1">CAC</p>
                     <h4 className="text-lg font-black text-slate-900">Rs. 1.2K</h4>
                  </div>
               </div>
            </div>
         </div>

         {/* Channels & Sources */}
         <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <div className="bg-white rounded-[2.5rem] p-10 border border-slate-200/60 shadow-sm flex flex-col">
               <h2 className="text-xl font-black text-slate-900 uppercase mb-8">Channel Contribution</h2>
               <div className="flex-1 h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                     <PieChart>
                        <Pie data={leadSources} innerRadius={70} outerRadius={100} paddingAngle={5} dataKey="count" nameKey="_id">
                           {leadSources?.map((_, i) => <Cell key={i} fill={['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][i % 5]} />)}
                        </Pie>
                        <Tooltip />
                     </PieChart>
                  </ResponsiveContainer>
               </div>
               <div className="grid grid-cols-2 gap-4 mt-8">
                  {leadSources?.slice(0, 4).map((s, i) => (
                    <div key={i} className="flex items-center gap-3">
                       <div className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'][i % 4]}}></div>
                       <span className="text-[10px] font-black text-slate-500 uppercase">{s._id || 'Organic'} ({s.count})</span>
                    </div>
                  ))}
               </div>
            </div>

            <div className="bg-white rounded-[2.5rem] p-10 border border-slate-200/60 shadow-sm overflow-hidden">
               <h2 className="text-xl font-black text-slate-900 uppercase mb-8">Campaign Performance</h2>
               <div className="space-y-4">
                  {campaigns?.map((c, i) => (
                    <div key={i} className="p-5 bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-between group hover:bg-blue-50 transition-all cursor-pointer">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-blue-600 shadow-sm">
                             {getChannelIcon(c.platform)}
                          </div>
                          <div>
                             <h4 className="font-black text-slate-900 text-sm">{c.name}</h4>
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{c.platform} • {c.status}</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="text-[11px] font-black text-slate-700">Rs. {c.actualSpend?.toLocaleString()}</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Actual Spend</p>
                       </div>
                    </div>
                  ))}
                  {(!campaigns || campaigns.length === 0) && <EmptyState label="No active campaigns recorded" />}
               </div>
            </div>
         </div>

         {/* Insights & Targets */}
         <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 pb-20">
            <div className="xl:col-span-2 bg-white rounded-[2.5rem] p-10 border border-slate-200/60 shadow-sm">
               <h2 className="text-xl font-black text-slate-900 uppercase mb-10">Smart Marketing Insights</h2>
               <div className="space-y-6">
                  <InsightItem type="positive" title="Organic Growth" desc="Website traffic conversion has improved by 14% this period due to enhanced landing page SEO optimization." />
                  <InsightItem type="warning" title="Channel Fatigue" desc="Facebook Ad CPL has increased by 22%. Frequency metrics suggest audience fatigue; consider refreshing creative assets." />
                  <InsightItem type="neutral" title="Leads Volume" desc="Weekly lead generation volume remains steady at an average of 48 leads per week, meeting 95% of the target." />
               </div>
            </div>

            <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl">
               <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
               <h2 className="text-xl font-black mb-8 uppercase tracking-tight flex items-center gap-2">
                  <Target className="text-blue-500" size={20} /> Targets
               </h2>
               <div className="space-y-8">
                  <div>
                     <div className="flex justify-between text-[10px] font-black uppercase mb-3"><span>Lead Goal</span><span>78%</span></div>
                     <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-blue-500 rounded-full" style={{width: '78%'}}></div></div>
                  </div>
                  <div>
                     <div className="flex justify-between text-[10px] font-black uppercase mb-3"><span>Conv. Target</span><span>92%</span></div>
                     <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-emerald-500 rounded-full" style={{width: '92%'}}></div></div>
                  </div>
                  <div className="pt-8 border-t border-white/5">
                     <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Expected MQLs</p>
                     <h3 className="text-3xl font-black">2,450</h3>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

// Sub-components
const MkKpiCard = ({ icon: Icon, label, value, prevValue, color, invert }) => {
  const valNum = parseFloat(value?.toString().replace(/[^0-9.]/g, '')) || 0;
  const prevNum = parseFloat(prevValue?.toString().replace(/[^0-9.]/g, '')) || 0;
  const isUp = valNum >= prevNum;
  const percent = prevNum ? Math.round(((valNum - prevNum) / prevNum) * 100) : 100;
  const isPositive = invert ? !isUp : isUp;

  const colors = {
    blue: 'text-blue-600 bg-blue-50 border-blue-100',
    emerald: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    indigo: 'text-indigo-600 bg-indigo-50 border-indigo-100',
    purple: 'text-purple-600 bg-purple-50 border-purple-100',
    cyan: 'text-cyan-600 bg-cyan-50 border-cyan-100',
    teal: 'text-teal-600 bg-teal-50 border-teal-100',
    orange: 'text-orange-600 bg-orange-50 border-orange-100',
    rose: 'text-rose-600 bg-rose-50 border-rose-100',
  };

  return (
    <div className="bg-white p-4 rounded-3xl border border-slate-200/60 shadow-sm hover:shadow-xl transition-all flex flex-col items-center text-center">
       <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 border ${colors[color]}`}><Icon size={18} /></div>
       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
       <h3 className="text-xl font-black text-slate-900 leading-none mb-1">{value || 0}</h3>
       <div className={`flex items-center gap-0.5 font-black text-[9px] ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
          {isUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
          {Math.abs(percent)}%
       </div>
    </div>
  );
};

const InsightItem = ({ type, title, desc }) => (
  <div className={`p-8 rounded-[2rem] border ${type === 'positive' ? 'bg-emerald-50 border-emerald-100' : type === 'warning' ? 'bg-rose-50 border-rose-100' : 'bg-slate-50 border-slate-200/60'}`}>
     <div className="flex items-center gap-3 mb-3">
        <div className={`w-2 h-2 rounded-full ${type === 'positive' ? 'bg-emerald-500' : type === 'warning' ? 'bg-rose-500' : 'bg-slate-400'}`}></div>
        <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">{title}</h4>
     </div>
     <p className="text-xs font-medium text-slate-500 leading-relaxed">{desc}</p>
  </div>
);

const DollarSign = ({ size, className }) => <span className={className} style={{fontSize: size}}>Rs.</span>;

const EmptyState = ({ label }) => (
  <div className="py-10 flex flex-col items-center justify-center text-center opacity-30">
     <Clock className="text-slate-400 mb-2" size={32} />
     <p className="text-[10px] font-black text-slate-500 uppercase">{label}</p>
  </div>
);

export default MarketingReport;
