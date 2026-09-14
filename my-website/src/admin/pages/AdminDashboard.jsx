import React, { useEffect, useState } from 'react';
import {
  Users,
  Briefcase,
  MessageSquare,
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Plus,
  Zap,
  BarChart3,
  FileText
} from 'lucide-react';
import { apiFetch } from '../../utils/api';

const statColors = {
  blue: 'bg-blue-50 text-blue-600',
  purple: 'bg-purple-50 text-purple-600',
  amber: 'bg-amber-50 text-amber-600',
  emerald: 'bg-emerald-50 text-emerald-600',
  rose: 'bg-red-50 text-red-600',
  indigo: 'bg-indigo-50 text-indigo-600'
};

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    employees: 0,
    jobs: 0,
    applications: 0,
    projects: 0,
    tasks: 0,
    inquiries: 0,
    payroll: 0
  });
  const [recentApps, setRecentApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchStats = async () => {
      try {
        const response = await apiFetch('/api/dashboard/stats');
        const data = await response.json();

        if (isMounted && data.success && data.data) {
          setStats(data.data.counts || {});
          setRecentApps(data.data.recentApplications || []);
        }
      } catch (err) {
        console.error('Failed to fetch dashboard stats:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchStats();

    const interval = setInterval(fetchStats, 60000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const statCards = [
    { label: 'Core Personnel', value: stats.employees, icon: Users, color: 'blue', sub: 'Active workforce' },
    { label: 'Active Projects', value: stats.projects, icon: Clock, color: 'emerald', sub: 'Delivery roadmap' },
    { label: 'Live Vacancies', value: stats.jobs, icon: Briefcase, color: 'rose', sub: 'Hiring protocols' },
    { label: 'Pending Tasks', value: stats.tasks, icon: Zap, color: 'amber', sub: 'Tactical execution' },
    { label: 'Global Inquiries', value: stats.inquiries, icon: MessageSquare, color: 'purple', sub: 'Business leads' },
    { label: 'Strategic Spend', value: `Rs. ${(Number(stats.payroll || 0)).toLocaleString()}`, icon: TrendingUp, color: 'indigo', sub: 'Financial summary' },
  ];

  return (
    <div className="p-8 bg-slate-50 min-h-screen font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Real-Time Intelligence</h1>
          <p className="text-slate-500 font-medium mt-1">Live operational metrics from all RCS modules.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border border-emerald-100">
             <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
             Live Sync
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200 hover:border-blue-500/30 transition-all group hover:shadow-xl">
            <div className="flex justify-between items-start mb-6">
              <div className={`p-4 rounded-2xl ${statColors[stat.color] || 'bg-slate-50 text-slate-600'} group-hover:scale-110 transition-transform`}>
                <stat.icon size={28} />
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global</span>
            </div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1.5">{stat.label}</p>
            <h3 className="text-3xl font-black text-slate-900 mb-2">{loading ? '...' : stat.value}</h3>
            <p className="text-[11px] text-slate-400 font-medium">{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
         <div className="lg:col-span-2 bg-white rounded-[3rem] border border-slate-200 p-8 shadow-sm">
            <h2 className="text-xl font-black text-slate-900 mb-8 tracking-tight px-4 flex items-center gap-3">
               <FileText className="text-blue-600" /> Recent Talent Acquisition
            </h2>
            <div className="space-y-3">
               {recentApps.map((app, idx) => (
                 <div key={idx} className="flex items-center justify-between p-5 hover:bg-slate-50 rounded-2xl transition-colors border border-transparent hover:border-slate-100">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-400">{app.firstName.charAt(0)}</div>
                       <div>
                          <p className="text-sm font-black text-slate-900">{app.firstName} {app.lastName}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{app.job?.title || 'Applied Position'}</p>
                       </div>
                    </div>
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[9px] font-black uppercase tracking-widest">{app.status}</span>
                 </div>
               ))}
               {recentApps.length === 0 && <p className="text-center py-10 text-slate-300 font-black uppercase italic">No recent protocols detected</p>}
            </div>
         </div>

         <div className="space-y-6">
            <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden group border border-white/5 shadow-2xl">
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
                  <Zap size={100} />
               </div>
               <h3 className="text-xl font-black mb-3 relative z-10">System Integrity</h3>
               <p className="text-slate-400 text-sm mb-10 relative z-10 leading-relaxed font-medium">All infrastructure clusters and data pipelines are operating at optimized parameters.</p>
               <div className="flex items-center gap-3 bg-emerald-500/20 text-emerald-400 px-5 py-3 rounded-2xl border border-emerald-500/30 w-fit relative z-10 text-xs font-black uppercase tracking-widest">
                  <CheckCircle2 size={18} /> Protocol Verified
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
