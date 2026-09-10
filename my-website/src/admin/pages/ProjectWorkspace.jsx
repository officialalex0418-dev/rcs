import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Folder, Users, Target, Layout, CheckCircle2, Clock, AlertTriangle,
  DollarSign, Activity, FileText, ChevronRight, ArrowLeft, MoreVertical,
  Plus, Search, Filter, Edit2, Zap, Calendar, TrendingUp
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { apiFetch } from '../../utils/api';

const ProjectWorkspace = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Overview');

  const tabs = [
    'Overview', 'Requirements', 'Scope', 'Tasks', 'Milestones', 'Team', 'Budget', 'Risks', 'Activity'
  ];

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await apiFetch(`/api/projects/${id}`);
        const data = await response.json();
        if (data.success) setProject(data.data);
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  if (loading) return <div className="p-20 text-center font-black text-slate-300 uppercase tracking-widest animate-pulse">Syncing Workspace...</div>;
  if (!project) return <div className="p-20 text-center">Project not found</div>;

  return (
    <div className="p-8 bg-slate-50 min-h-screen font-sans space-y-8 animate-in fade-in duration-700">

      {/* Workspace Header */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
        <div className="flex items-center gap-6">
           <button onClick={() => navigate('/admin/projects')} className="p-3 bg-white border border-slate-200 rounded-2xl hover:border-blue-500 transition-all text-slate-400 hover:text-blue-600 shadow-sm">
              <ArrowLeft size={20} />
           </button>
           <div>
              <div className="flex items-center gap-3 mb-1">
                 <h1 className="text-3xl font-black text-slate-900 tracking-tight">{project.name}</h1>
                 <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                    project.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                 }`}>{project.status}</span>
              </div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-tighter">{project.client} • {project.code}</p>
           </div>
        </div>

        <div className="flex items-center gap-3">
           <button onClick={() => navigate(`/admin/projects/edit/${id}`)} className="flex items-center gap-2 bg-white px-6 py-3.5 rounded-2xl text-[10px] font-black uppercase border border-slate-200 hover:bg-slate-50 transition-all">
              <Edit2 size={14} /> Refine Strategy
           </button>
           <button className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all">
              <Plus size={16} /> Add Task
           </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 p-1.5 bg-white border border-slate-200 rounded-[2rem] shadow-sm overflow-x-auto scrollbar-hide">
         {tabs.map(tab => (
           <button
             key={tab}
             onClick={() => setActiveTab(tab)}
             className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
               activeTab === tab ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
             }`}
           >
              {tab}
           </button>
         ))}
      </div>

      {/* Main Content Area */}
      <div className="animate-in slide-in-from-bottom-4 duration-500">
         {activeTab === 'Overview' && <OverviewTab project={project} />}
         {activeTab === 'Requirements' && <RequirementsTab project={project} />}
         {activeTab === 'Scope' && <ScopeTab project={project} />}
         {activeTab === 'Budget' && <BudgetTab project={project} />}
         {activeTab === 'Team' && <TeamTab project={project} />}
         {activeTab === 'Tasks' && <TasksTab project={project} />}
         {activeTab === 'Milestones' && <MilestonesTab project={project} />}
         {activeTab === 'Risks' && <RisksTab project={project} />}
         {activeTab === 'Activity' && <ActivityTab project={project} />}
      </div>

    </div>
  );
};

// Tabs Components
const OverviewTab = ({ project }) => (
  <div className="grid grid-cols-12 gap-8">
     <div className="col-span-12 xl:col-span-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
           <KpiCard label="Global Progress" val={`${project.progress}%`} color="blue" />
           <KpiCard label="Budget Consumed" val="62%" color="indigo" />
           <KpiCard label="Tasks Done" val="42 / 60" color="emerald" />
           <KpiCard label="Time Elapsed" val="45 Days" color="purple" />
        </div>
        <div className="bg-white rounded-[2.5rem] border border-slate-200/60 p-10">
           <h3 className="text-xl font-black text-slate-900 uppercase mb-8">Performance Trajectory</h3>
           <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={[
                    { name: 'Jan', progress: 10, budget: 15 },
                    { name: 'Feb', progress: 25, budget: 30 },
                    { name: 'Mar', progress: 45, budget: 45 },
                    { name: 'Apr', progress: 70, budget: 60 },
                 ]}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" hide />
                    <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                    <Area type="monotone" dataKey="progress" stroke="#2563eb" strokeWidth={4} fill="#2563eb" fillOpacity={0.1} />
                 </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>
     </div>
     <div className="col-span-12 xl:col-span-4 space-y-8">
        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
           <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
           <h3 className="text-lg font-black uppercase mb-6 flex items-center gap-2"><Activity className="text-emerald-400" /> Strategic Health</h3>
           <div className="space-y-6">
              <HealthRow label="Schedule Adherence" val="92%" />
              <HealthRow label="Budget Discipline" val="84%" />
              <HealthRow label="Quality Standard" val="100%" />
           </div>
        </div>
        <div className="bg-white rounded-[2.5rem] border border-slate-200/60 p-8">
           <h3 className="text-lg font-black text-slate-900 uppercase mb-6">Execution Squad</h3>
           <div className="space-y-4">
              {project.team?.slice(0, 5).map((mem, i) => (
                <div key={i} className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400">?</div>
                   <div className="flex-1">
                      <p className="text-xs font-black text-slate-900 leading-none mb-0.5">Member {i+1}</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{mem.role || 'Specialist'}</p>
                   </div>
                </div>
              ))}
           </div>
        </div>
     </div>
  </div>
);

const RequirementsTab = ({ project }) => (
  <div className="bg-white rounded-[3rem] border border-slate-200/60 p-10">
     <h3 className="text-xl font-black text-slate-900 uppercase mb-10">Requirement Traceability</h3>
     <div className="space-y-4">
        {project.requirements?.map((req, i) => (
          <div key={i} className="p-6 bg-slate-50 border border-slate-100 rounded-3xl flex items-center justify-between group hover:bg-white hover:border-blue-200 transition-all">
             <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${
                   req.priority === 'CRITICAL' ? 'bg-rose-100 text-rose-600' : 'bg-blue-100 text-blue-600'
                }`}>{i+1}</div>
                <div>
                   <h4 className="font-black text-slate-900 leading-none mb-1">{req.title}</h4>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{req.type} • {req.priority} PRIORITY</p>
                </div>
             </div>
             <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[9px] font-black uppercase text-slate-400">{req.status}</span>
          </div>
        ))}
        {(!project.requirements || project.requirements.length === 0) && <div className="text-center py-20 opacity-20"><Target size={48} className="mx-auto mb-2"/><p className="text-xs font-black uppercase">No requirements defined</p></div>}
     </div>
  </div>
);

const ScopeTab = ({ project }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
     <div className="bg-white rounded-[3rem] border border-slate-200/60 p-10">
        <h3 className="text-lg font-black text-blue-600 uppercase mb-8">In-Scope Deliverables</h3>
        <div className="space-y-4">
           {project.inScope?.map((s, i) => (
             <div key={i} className="flex items-center gap-3 p-4 bg-blue-50/50 rounded-2xl border border-blue-100 text-xs font-bold text-blue-900">
                <CheckCircle2 size={16} className="text-blue-500" /> {s}
             </div>
           ))}
        </div>
     </div>
     <div className="bg-white rounded-[3rem] border border-slate-200/60 p-10">
        <h3 className="text-lg font-black text-slate-400 uppercase mb-8">Exclusion Boundaries</h3>
        <div className="space-y-4">
           {project.outOfScope?.map((s, i) => (
             <div key={i} className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs font-bold text-slate-500">
                <Zap size={16} className="text-slate-300" /> {s}
             </div>
           ))}
        </div>
     </div>
  </div>
);

const TasksTab = ({ project }) => (
  <div className="bg-white rounded-[3rem] border border-slate-200/60 p-10">
     <div className="flex justify-between items-center mb-10">
        <h3 className="text-xl font-black text-slate-900 uppercase">Strategic Tasks</h3>
        <div className="flex gap-2">
           <button className="p-2 bg-slate-50 rounded-lg"><Layout size={18} /></button>
           <button className="p-2 bg-slate-50 rounded-lg text-slate-300"><TrendingUp size={18} /></button>
        </div>
     </div>
     <div className="text-center py-20 opacity-20"><Zap size={48} className="mx-auto mb-2"/><p className="text-xs font-black uppercase tracking-widest">Connect Project to Task Module</p></div>
  </div>
);

const BudgetTab = ({ project }) => (
   <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 bg-white rounded-[3rem] border border-slate-200/60 p-10">
         <h3 className="text-xl font-black text-slate-900 uppercase mb-10">Investment Breakdown</h3>
         <div className="grid grid-cols-2 gap-8">
            <BudgetItem label="Human Capital" val={project.budget?.breakdown?.employee} color="blue" />
            <BudgetItem label="Infrastructure" val={project.budget?.breakdown?.infrastructure} color="indigo" />
            <BudgetItem label="Software" val={project.budget?.breakdown?.software} color="purple" />
            <BudgetItem label="Contingency" val={project.budget?.breakdown?.contingency} color="rose" />
         </div>
      </div>
      <div className="p-10 bg-slate-900 rounded-[3rem] text-white flex flex-col justify-center text-center relative overflow-hidden shadow-2xl">
         <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
         <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2">Total Strategy Value</p>
         <h4 className="text-4xl font-black mb-2">Rs. {project.budget?.total?.toLocaleString()}</h4>
         <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
            <div className="flex justify-between text-[10px] font-black uppercase"><span>Spent</span><span>Rs. 0</span></div>
            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-emerald-500" style={{width: '0%'}}></div></div>
         </div>
      </div>
   </div>
);

const TeamTab = () => <div className="p-20 text-center text-slate-300 font-black uppercase tracking-widest">Team Dynamics View Coming Soon</div>;
const MilestonesTab = () => <div className="p-20 text-center text-slate-300 font-black uppercase tracking-widest">Milestone Tracker Coming Soon</div>;
const RisksTab = () => <div className="p-20 text-center text-slate-300 font-black uppercase tracking-widest">Risk Management Grid Coming Soon</div>;
const ActivityTab = () => <div className="p-20 text-center text-slate-300 font-black uppercase tracking-widest">Project Activity Feed Coming Soon</div>;

// Mini Components
const KpiCard = ({ label, val, color }) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm flex flex-col items-center text-center group hover:scale-105 transition-all">
     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
     <h4 className={`text-xl font-black text-${color}-600`}>{val}</h4>
  </div>
);

const HealthRow = ({ label, val }) => (
  <div className="space-y-2">
     <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400"><span>{label}</span><span>{val}</span></div>
     <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-emerald-500" style={{width: val}}></div></div>
  </div>
);

const BudgetItem = ({ label, val, color }) => (
  <div className="space-y-2 p-6 bg-slate-50 rounded-3xl border border-slate-100">
     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</p>
     <h4 className={`text-lg font-black text-${color}-600`}>Rs. {val?.toLocaleString() || 0}</h4>
  </div>
);

export default ProjectWorkspace;
