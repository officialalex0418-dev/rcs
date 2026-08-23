import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Calendar, CheckCircle2, AlertCircle, Clock, Users, ChevronRight, Briefcase, Filter, ArrowUpRight, Edit2 } from 'lucide-react';

const ProjectManager = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const backendUrl = import.meta.env.VITE_API_URL || '';
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
    fetchProjects();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircle2 size={16} className="text-emerald-500" />;
      case 'IN_PROGRESS': return <Clock size={16} className="text-blue-500" />;
      case 'PLANNING': return <Calendar size={16} className="text-purple-500" />;
      default: return <AlertCircle size={16} className="text-slate-400" />;
    }
  };

  const getHealthColor = (health) => {
    switch (health) {
      case 'ON_TRACK': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'AT_RISK': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'DELAYED': return 'bg-red-50 text-red-600 border-red-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Active Projects</h1>
          <p className="text-slate-500 font-medium">Manage client engagements and delivery health.</p>
        </div>
        <Link
          to="/admin/projects/new"
          className="flex items-center gap-2 bg-blue-600 px-5 py-2.5 rounded-xl text-sm font-bold text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
        >
          <Plus size={20} />
          Create New Project
        </Link>
      </div>

      {/* Project Filters */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-8 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search projects by name, client, or manager..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm outline-none"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <select className="flex-1 md:flex-none bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-600 outline-none">
            <option>All Statuses</option>
            <option>Planning</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
          <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-blue-600 transition-colors">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-20 text-center font-bold text-slate-400 uppercase tracking-widest text-xs">Accessing Project Vault...</div>
        ) : projects.length === 0 ? (
          <div className="col-span-full py-20 text-center font-bold text-slate-400 uppercase tracking-widest text-xs">No active projects found</div>
        ) : projects.map((project) => (
          <div key={project._id} className="bg-white rounded-3xl shadow-sm border border-slate-200 hover:border-blue-500/50 transition-all group overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                       <Briefcase size={14} />
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{project.category || 'Consultancy'}</span>
                  </div>
                  <h3 className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">{project.name}</h3>
                  <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-tighter">{project.client}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${getHealthColor(project.health)}`}>
                  {project.health.replace('_', ' ')}
                </span>
              </div>

              <div className="mb-8">
                <div className="flex justify-between text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">
                  <span>Global Progress</span>
                  <span className="text-slate-900">{project.progress}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${project.progress === 100 ? 'bg-emerald-500' : 'bg-blue-600'}`}
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-8">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mb-1">State</p>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(project.status)}
                    <span className="text-xs font-bold text-slate-700 capitalize">{project.status.toLowerCase().replace('_', ' ')}</span>
                  </div>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mb-1">Squad</p>
                  <div className="flex items-center gap-2">
                    <Users size={14} className="text-slate-500" />
                    <span className="text-xs font-bold text-slate-700">{project.team?.length || 0} Members</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-5 border-t border-slate-100">
                <div className="flex flex-col">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter leading-none mb-1">Milestone</p>
                   <p className="text-xs font-bold text-slate-900">{project.targetDate ? new Date(project.targetDate).toLocaleDateString() : 'TBD'}</p>
                </div>
                <div className="flex gap-2">
                  <Link
                    to={`/admin/projects/edit/${project._id}`}
                    className="flex items-center gap-1 text-sm font-black text-blue-600 hover:text-blue-700 bg-blue-50 px-4 py-2 rounded-xl transition-all"
                  >
                    <Edit2 size={16} />
                  </Link>
                  <button className="flex items-center gap-1 text-sm font-black text-slate-600 hover:text-slate-900 bg-slate-100 px-4 py-2 rounded-xl transition-all">
                    Manage <ArrowUpRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectManager;
