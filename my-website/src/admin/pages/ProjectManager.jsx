import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Plus, Search, Calendar, CheckCircle2, AlertCircle, Clock, Users,
  ChevronRight, Briefcase, Filter, ArrowUpRight, Edit2,
  TrendingUp, DollarSign, Activity, MoreVertical, LayoutGrid, List
} from 'lucide-react';
import { apiFetch } from '../../utils/api';

const ProjectManager = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewViewMode] = useState('grid'); // 'grid' or 'list'

  const fetchProjects = async () => {
    try {
      const backendUrl = import.meta.env.VITE_API_URL || 'https://rcs-ajbn.onrender.com';
      const token = localStorage.getItem('rcs_admin_token');
      const response = await fetch(`${backendUrl}/api/projects`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) setProjects(data.data);
    } catch (err) {
      console.error('Failed to fetch projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'IN_PROGRESS': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'ON_HOLD': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'AT_RISK': return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'PLANNING': return 'bg-purple-50 text-purple-600 border-purple-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  // Stats Calculation
  const stats = {
    total: projects.length,
    inProgress: projects.filter(p => p.status === 'IN_PROGRESS').length,
    completed: projects.filter(p => p.status === 'COMPLETED').length,
    onHold: projects.filter(p => p.status === 'ON_HOLD').length,
    totalBudget: projects.reduce((acc, p) => acc + (p.budget?.total || p.budget || 0), 0),
    totalRevenue: projects.reduce((acc, p) => acc + (p.revenue || 0), 0)
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen font-sans space-y-10 animate-in fade-in duration-700">

      {/* Header */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                 <Briefcase size={22} />
              </div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Projects</h1>
           </div>
           <p className="text-slate-500 font-medium ml-1">Manage and track all company projects, progress, resources and deliverables.</p>
        </div>

        <div className="flex items-center gap-4">
           <div className="flex gap-2 p-1 bg-white border border-slate-200 rounded-2xl shadow-sm">
              <button
                onClick={() => setViewViewMode('grid')}
                className={`p-2 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/10' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <LayoutGrid size={18} />
              </button>
              <button
                onClick={() => setViewViewMode('list')}
                className={`p-2 rounded-xl transition-all ${viewMode === 'list' ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/10' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <List size={18} />
              </button>
           </div>
           <Link
             to="/admin/projects/new"
             className="flex items-center gap-3 bg-blue-600 px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-white hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20"
           >
             <Plus size={18} /> Create Project
           </Link>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
         <ProjStat icon={Briefcase} label="Total Projects" val={stats.total} color="blue" trend="+ 12%" />
         <ProjStat icon={Clock} label="In Progress" val={stats.inProgress} color="indigo" trend="+ 8%" />
         <ProjStat icon={CheckCircle2} label="Completed" val={stats.completed} color="emerald" trend="+ 25%" />
         <ProjStat icon={AlertCircle} label="On Hold" val={stats.onHold} color="amber" trend="vs last period" />
         <ProjStat icon={DollarSign} label="Total Budget" val={`Rs. ${(stats.totalBudget/1000).toFixed(0)}K`} color="purple" trend="+ 18%" />
         <ProjStat icon={TrendingUp} label="Total Revenue" val={`Rs. ${(stats.totalRevenue/1000).toFixed(0)}K`} color="teal" trend="+ 22%" />
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-12 gap-8">

         {/* Projects List/Table */}
         <div className="col-span-12 xl:col-span-8 bg-white rounded-[2.5rem] border border-slate-200/60 shadow-sm p-8 space-y-8 overflow-hidden">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
               <div>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">Active Portfolio</h2>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Live status of ongoing engagements</p>
               </div>
               <div className="flex items-center gap-3 w-full md:w-auto">
                  <div className="relative flex-1 md:w-64">
                     <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                     <input className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none focus:border-blue-500 transition-all" placeholder="Search projects..." />
                  </div>
                  <button className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-400 hover:text-blue-600 transition-all">
                     <Filter size={18} />
                  </button>
               </div>
            </div>

            <div className="overflow-x-auto">
               <table className="w-full text-left">
                  <thead>
                     <tr className="border-b border-slate-100 pb-4">
                        <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Project</th>
                        <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Client</th>
                        <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Manager</th>
                        <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Timeline</th>
                        <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                        <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Progress</th>
                        <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                     {loading ? (
                        [...Array(5)].map((_, i) => <tr key={i} className="animate-pulse"><td colSpan="7" className="py-8"><div className="h-12 bg-slate-50 rounded-2xl w-full"></div></td></tr>)
                     ) : projects.map((p) => (
                       <tr key={p._id} className="group hover:bg-slate-50/50 transition-all">
                          <td className="py-6">
                             <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black shadow-sm group-hover:scale-110 transition-transform">
                                   {p.name.charAt(0)}
                                </div>
                                <div className="max-w-[150px]">
                                   <p className="text-sm font-black text-slate-900 truncate mb-0.5">{p.name}</p>
                                   <p className="text-[10px] font-bold text-slate-400 uppercase">{p.code || 'PRJ-824'}</p>
                                </div>
                             </div>
                          </td>
                          <td className="py-6"><span className="text-xs font-bold text-slate-600">{p.client}</span></td>
                          <td className="py-6">
                             <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400">{p.manager?.name?.charAt(0) || 'U'}</div>
                                <span className="text-[11px] font-black text-slate-900 truncate">{p.manager?.name || 'Unassigned'}</span>
                             </div>
                          </td>
                          <td className="py-6">
                             <div className="flex flex-col">
                                <span className="text-[11px] font-black text-slate-700">{p.targetDate ? new Date(p.targetDate).toLocaleDateString() : 'N/A'}</span>
                                <span className="text-[9px] font-bold text-slate-400 uppercase">Deadline</span>
                             </div>
                          </td>
                          <td className="py-6">
                             <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${getStatusColor(p.status)}`}>
                                {p.status?.replace('_', ' ')}
                             </span>
                          </td>
                          <td className="py-6">
                             <div className="w-24">
                                <div className="flex justify-between items-center mb-1.5">
                                   <span className="text-[9px] font-black text-slate-900">{p.progress}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                   <div className="h-full bg-blue-600 rounded-full" style={{ width: `${p.progress}%` }}></div>
                                </div>
                             </div>
                          </td>
                          <td className="py-6 text-right">
                             <div className="flex justify-end gap-2">
                                <Link to={`/admin/projects/edit/${p._id}`} className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all border border-slate-100">
                                   <Edit2 size={16} />
                                </Link>
                                <button
                                  onClick={() => navigate(`/admin/projects/${p._id}`)}
                                  className="p-2.5 bg-slate-900 text-white rounded-xl hover:bg-blue-600 transition-all shadow-lg shadow-slate-900/10"
                                >
                                   <ArrowUpRight size={16} />
                                </button>
                             </div>
                          </td>
                       </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>

         {/* Sidebar / Secondary Analytics */}
         <div className="col-span-12 xl:col-span-4 space-y-8">

            {/* Status Chart Widget */}
            <div className="bg-white rounded-[2.5rem] border border-slate-200/60 shadow-sm p-8">
               <h3 className="text-xl font-black text-slate-900 tracking-tight mb-8">Status Overview</h3>
               <div className="flex justify-center mb-8">
                  <div className="w-48 h-48 rounded-full border-[12px] border-slate-50 flex flex-col items-center justify-center relative">
                     <div className="absolute inset-0 rounded-full border-[12px] border-blue-600 border-t-transparent border-r-transparent rotate-45 opacity-20"></div>
                     <span className="text-4xl font-black text-slate-900">{stats.total}</span>
                     <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Projects</span>
                  </div>
               </div>
               <div className="space-y-4">
                  <StatusRow label="In Progress" count={stats.inProgress} total={stats.total} color="bg-blue-500" />
                  <StatusRow label="Completed" count={stats.completed} total={stats.total} color="bg-emerald-500" />
                  <StatusRow label="On Hold" count={stats.onHold} total={stats.total} color="bg-amber-500" />
                  <StatusRow label="Cancelled" count={projects.filter(p => p.status === 'CANCELLED').length} total={stats.total} color="bg-rose-500" />
               </div>
            </div>

            {/* Department Breakdown */}
            <div className="bg-white rounded-[2.5rem] border border-slate-200/60 shadow-sm p-8">
               <h3 className="text-xl font-black text-slate-900 tracking-tight mb-8">Projects by Department</h3>
               <div className="space-y-6">
                  {['Development', 'Marketing', 'IT', 'Operations', 'Sales'].map((dept, i) => (
                    <div key={i} className="space-y-2">
                       <div className="flex justify-between items-end">
                          <span className="text-xs font-black text-slate-700 uppercase">{dept}</span>
                          <span className="text-[10px] font-bold text-slate-400">{Math.round(Math.random()*10)} Projects • {Math.round(Math.random()*100)}%</span>
                       </div>
                       <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full transition-all duration-1000 ${['bg-blue-500', 'bg-indigo-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500'][i]}`} style={{ width: `${Math.random()*100}%` }}></div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            {/* Activity Feed Widget */}
            <div className="bg-white rounded-[2.5rem] border border-slate-200/60 shadow-sm p-8">
               <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Recent Activity</h3>
                  <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">View All</button>
               </div>
               <div className="space-y-6">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex gap-4">
                       <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                          <Users size={14} className="text-slate-400" />
                       </div>
                       <div>
                          <p className="text-xs font-bold text-slate-900 leading-snug">John Doe updated project <span className="text-blue-600">Website Redesign</span></p>
                          <p className="text-[10px] font-medium text-slate-400 mt-1 uppercase tracking-tighter">2 hours ago</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

// Sub-components
const ProjStat = ({ icon: Icon, label, val, color, trend }) => {
  const colors = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100 shadow-blue-500/5',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100 shadow-indigo-500/5',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-emerald-500/5',
    amber: 'bg-amber-50 text-amber-600 border-amber-100 shadow-amber-500/5',
    purple: 'bg-purple-50 text-purple-600 border-purple-100 shadow-purple-500/5',
    teal: 'bg-teal-50 text-teal-600 border-teal-100 shadow-teal-500/5'
  };
  return (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-200/60 shadow-sm hover:shadow-xl transition-all group">
       <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 border-2 transition-transform group-hover:scale-110 ${colors[color]}`}>
          <Icon size={22} />
       </div>
       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
       <h3 className="text-xl font-black text-slate-900 mb-1 leading-none">{val}</h3>
       <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-tighter">{trend}</p>
    </div>
  );
};

const StatusRow = ({ label, count, total, color }) => (
  <div className="flex items-center justify-between">
     <div className="flex items-center gap-3">
        <div className={`w-2 h-2 rounded-full ${color}`}></div>
        <span className="text-[11px] font-black text-slate-500 uppercase">{label}</span>
     </div>
     <div className="flex items-center gap-3">
        <span className="text-xs font-black text-slate-900">{count}</span>
        <span className="text-[10px] font-bold text-slate-300 w-8 text-right">({total ? Math.round((count/total)*100) : 0}%)</span>
     </div>
  </div>
);

export default ProjectManager;
