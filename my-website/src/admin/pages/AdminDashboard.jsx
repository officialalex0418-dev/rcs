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
  TrendingDown
} from 'lucide-react';

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
    activeProjects: 0,
    totalInquiries: 0,
    openVacancies: 0,
    totalApplications: 0,
    activeTasks: 0,
    totalPaidPayroll: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const backendUrl = import.meta.env.VITE_API_URL || '';
        const token = localStorage.getItem('rcs_admin_token');
        const response = await fetch(`${backendUrl}/api/dashboard/stats`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (data.success) {
          setStats(data.data);
        }
      } catch (err) {
        console.error('Failed to fetch dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();

    // Efficient Polling: Refresh stats every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const statCards = [
    { label: 'Active Projects', value: stats.activeProjects, icon: Clock, color: 'blue', sub: 'Delivery in progress' },
    { label: 'Open Inquiries', value: stats.totalInquiries, icon: MessageSquare, color: 'amber', sub: 'Awaiting response' },
    { label: 'Live Vacancies', value: stats.openVacancies, icon: Briefcase, color: 'rose', sub: 'Hiring active' },
    { label: 'Applications', value: stats.totalApplications, icon: Users, color: 'purple', sub: 'In recruitment funnel' },
    { label: 'Pending Tasks', value: stats.activeTasks, icon: Zap, color: 'emerald', sub: 'Team execution' },
    { label: 'Payroll Paid', value: `Rs. ${stats.totalPaidPayroll.toLocaleString()}`, icon: TrendingUp, color: 'indigo', sub: 'Financial summary' },
  ];

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
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
          <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 hover:border-blue-500/30 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl ${statColors[stat.color]} group-hover:scale-110 transition-transform`}>
                <stat.icon size={24} />
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global</span>
            </div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-3xl font-black text-slate-900 mb-2">{loading ? '...' : stat.value}</h3>
            <p className="text-[11px] text-slate-400 font-medium">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Placeholder for Recent Activity and System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-8">
            <h2 className="text-xl font-black text-slate-900 mb-6 tracking-tight">Operations Stream</h2>
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
               <BarChart3 size={48} className="mb-4 opacity-20" />
               <p className="text-sm font-bold uppercase tracking-widest text-xs">Activity Feed coming in next update</p>
            </div>
         </div>
         <div className="space-y-6">
            <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
                  <Zap size={80} />
               </div>
               <h3 className="text-lg font-black mb-2 relative z-10">System Integrity</h3>
               <p className="text-slate-400 text-sm mb-8 relative z-10">API endpoints and database clusters are operating at peak performance.</p>
               <div className="flex items-center gap-2 bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-xl border border-emerald-500/30 w-fit relative z-10 text-xs font-black uppercase tracking-widest">
                  <CheckCircle2 size={16} /> Verified
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
