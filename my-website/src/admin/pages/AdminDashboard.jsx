import React from 'react';
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
  Zap
} from 'lucide-react';

const statColors = {
  blue: 'bg-blue-50 text-blue-600',
  purple: 'bg-purple-50 text-purple-600',
  amber: 'bg-amber-50 text-amber-600',
  emerald: 'bg-emerald-50 text-emerald-600',
};

const activityColors = {
  purple: 'bg-purple-50 text-purple-500',
  amber: 'bg-amber-50 text-amber-500',
  blue: 'bg-blue-50 text-blue-500',
  emerald: 'bg-emerald-50 text-emerald-500',
};

const AdminDashboard = () => {
  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Business Intelligence</h1>
          <p className="text-slate-500 font-medium mt-1">Real-time performance and operational overview.</p>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
            <Zap size={16} className="text-yellow-500" />
            Quick Actions
          </button>
          <button className="flex items-center gap-2 bg-blue-600 px-5 py-2.5 rounded-xl text-sm font-bold text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20">
            <Plus size={16} />
            New Project
          </button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          { label: 'Active Projects', value: '12', icon: Clock, trend: '+2 this month', color: 'blue' },
          { label: 'New Applications', value: '45', icon: Users, trend: '12 pending review', color: 'purple' },
          { label: 'Open Inquiries', value: '08', icon: MessageSquare, trend: '3 high priority', color: 'amber' },
          { label: 'Conversion Rate', value: '24%', icon: TrendingUp, trend: '+4.5% vs last month', color: 'emerald' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 group hover:border-blue-500/50 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${statColors[stat.color] || 'bg-slate-50 text-slate-600'} group-hover:scale-110 transition-transform`}>
                <stat.icon size={24} />
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${statColors[stat.color] || 'bg-slate-50 text-slate-600'}`}>
                Live
              </span>
            </div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{stat.label}</p>
            <div className="flex items-baseline gap-2 mt-1">
              <h3 className="text-3xl font-black text-slate-900">{stat.value}</h3>
            </div>
            <p className="text-[11px] text-slate-400 font-medium mt-2 flex items-center gap-1">
              <TrendingUp size={12} className="text-emerald-500" />
              {stat.trend}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity Card */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Recent Activity Feed</h2>
            <button className="text-xs text-blue-600 font-bold hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1">
              View Audit Log <ArrowRight size={14} />
            </button>
          </div>
          <div className="divide-y divide-slate-50">
            {[
              { type: 'APPLICATION', user: 'John Doe', action: 'applied for', target: 'Senior React Developer', time: '2 hours ago', color: 'purple' },
              { type: 'INQUIRY', user: 'Tech Solutions', action: 'sent a new inquiry regarding', target: 'Cloud Migration', time: '5 hours ago', color: 'amber' },
              { type: 'PROJECT', user: 'Admin', action: 'updated status of', target: 'E-commerce Redesign', time: '1 day ago', color: 'blue' },
              { type: 'JOB', user: 'HR Manager', action: 'published new job', target: 'UI/UX Designer', time: '2 days ago', color: 'emerald' },
            ].map((activity, i) => (
              <div key={i} className="p-5 flex items-start gap-4 hover:bg-slate-50 transition group">
                <div className={`mt-1 p-2 rounded-lg ${activityColors[activity.color] || 'bg-slate-50 text-slate-500'} group-hover:scale-110 transition-transform`}>
                  {activity.type === 'APPLICATION' && <Users size={16} />}
                  {activity.type === 'INQUIRY' && <MessageSquare size={16} />}
                  {activity.type === 'PROJECT' && <Clock size={16} />}
                  {activity.type === 'JOB' && <Briefcase size={16} />}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-700 leading-snug">
                    <span className="font-bold text-slate-900">{activity.user}</span> {activity.action} <span className="font-bold text-blue-600 decoration-blue-200 underline-offset-4 hover:underline cursor-pointer">{activity.target}</span>
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1 font-bold uppercase tracking-tighter">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Intelligence / Alerts Panel */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-black text-slate-900 mb-6 tracking-tight flex items-center gap-2">
              <AlertCircle size={20} className="text-blue-600" />
              Intelligence
            </h2>
            <div className="space-y-4">
              <div className="p-4 bg-red-50 rounded-xl border border-red-100 group cursor-pointer hover:bg-red-100 transition-colors">
                <div className="flex items-center gap-2 mb-1">
                  <AlertCircle size={16} className="text-red-600" />
                  <p className="text-xs font-black text-red-900 uppercase tracking-widest">Project at Risk</p>
                </div>
                <p className="text-sm text-red-700 font-medium">Mobile Banking App is delayed by 4 days.</p>
              </div>

              <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 group cursor-pointer hover:bg-amber-100 transition-colors">
                <div className="flex items-center gap-2 mb-1">
                  <Clock size={16} className="text-amber-600" />
                  <p className="text-xs font-black text-amber-900 uppercase tracking-widest">Pending Review</p>
                </div>
                <p className="text-sm text-amber-700 font-medium">3 gallery items waiting for content review.</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-2xl shadow-xl p-6 text-white overflow-hidden relative group">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
               <Zap size={80} />
             </div>
             <h3 className="text-lg font-black mb-2 relative z-10">System Status</h3>
             <p className="text-slate-400 text-sm mb-6 relative z-10">All core engines are running optimally at 100% capacity.</p>
             <div className="flex items-center gap-2 bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-xl border border-emerald-500/30 w-fit relative z-10">
               <CheckCircle2 size={16} />
               <span className="text-xs font-black uppercase tracking-widest">Operational</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

export default AdminDashboard;
