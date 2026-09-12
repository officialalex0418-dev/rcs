import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Briefcase, Users, Target, Layout, CheckCircle2, Clock, AlertTriangle,
  Activity, FileText, ChevronRight, ArrowLeft, Zap, Calendar, TrendingUp
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { apiFetch } from '../utils/api';

const EmployeeProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Overview');

  const tabs = [
    'Overview', 'Requirements', 'Scope', 'Tasks', 'Milestones', 'Squad', 'Risks'
  ];

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const [projRes, taskRes] = await Promise.all([
          apiFetch(`/api/projects/${id}`),
          apiFetch(`/api/projects/${id}/tasks`)
        ]);
        const proj = await projRes.json();
        const tsk = await taskRes.json();
        if (proj.success) setProject(proj.data);
        if (tsk.success) setTasks(Array.isArray(tsk.data) ? tsk.data : []);
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjectData();
  }, [id]);

  if (loading) return (
    <div className="p-20 text-center space-y-4">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
      <p className="text-xs font-black text-slate-300 uppercase tracking-widest">Accessing Mission Intelligence...</p>
    </div>
  );

  if (!project) return <div className="p-20 text-center font-black text-slate-400 uppercase">Mission Protocol Not Found</div>;

  return (
    <div className="p-8 bg-slate-50 min-h-screen font-sans space-y-8 animate-in fade-in duration-700">

      {/* Header */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
        <div className="flex items-center gap-6">
           <button onClick={() => navigate('/projects')} className="p-3 bg-white border border-slate-200 rounded-2xl hover:border-blue-500 transition-all text-slate-400 hover:text-blue-600 shadow-sm">
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
        <div className="flex gap-4">
           <div className="px-6 py-3.5 bg-white border border-slate-200 rounded-2xl">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Strategist Head</p>
              <p className="text-xs font-black text-slate-900">{project.manager?.name || 'RCS Command'}</p>
           </div>
        </div>
      </div>

      {/* Tabs */}
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

      {/* Content */}
      <div className="animate-in slide-in-from-bottom-4 duration-500">
         {activeTab === 'Overview' && <OverviewTab project={project} tasks={tasks} />}
         {activeTab === 'Requirements' && <RequirementsTab requirements={project.requirements} />}
         {activeTab === 'Scope' && <ScopeTab project={project} />}
         {activeTab === 'Tasks' && <TasksTab tasks={tasks} />}
         {activeTab === 'Milestones' && <MilestonesTab milestones={project.milestones} />}
         {activeTab === 'Squad' && <SquadTab team={project.team} />}
         {activeTab === 'Risks' && <RisksTab risks={project.risks} />}
      </div>

    </div>
  );
};

// Internal Components
const OverviewTab = ({ project, tasks }) => {
  const completedTasks = tasks.filter(t => t.status === 'COMPLETED').length;

  return (
    <div className="grid grid-cols-12 gap-8">
       <div className="col-span-12 xl:col-span-8 space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             <KpiCard label="Global Progress" val={`${project.progress || 0}%`} color="blue" />
             <KpiCard label="Tasks Completed" val={`${completedTasks} / ${tasks.length}`} color="emerald" />
             <KpiCard label="Project Health" val={project.health || 'STABLE'} color="purple" />
             <KpiCard label="Squad Size" val={project.team?.length || 0} color="indigo" />
          </div>
          <div className="bg-white rounded-[2.5rem] border border-slate-200/60 p-10">
             <h3 className="text-xl font-black text-slate-900 uppercase mb-8">Mission Trajectory</h3>
             <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={[
                      { name: 'Start', progress: 0 },
                      { name: 'Current', progress: project.progress || 0 },
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
             <h3 className="text-lg font-black uppercase mb-6 flex items-center gap-2"><Activity className="text-emerald-400" /> Tactical Health</h3>
             <div className="space-y-6">
                <HealthRow label="Schedule Velocity" val={tasks.length ? `${Math.round((completedTasks/tasks.length)*100)}%` : '0%'} />
                <HealthRow label="Requirement Coverage" val="100%" />
                <HealthRow label="Execution Quality" val="STABLE" />
             </div>
          </div>
          <div className="bg-white rounded-[2.5rem] border border-slate-200/60 p-8">
             <h3 className="text-lg font-black text-slate-900 uppercase mb-6">Mission Head</h3>
             <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black">
                   {project.manager?.name?.charAt(0) || 'R'}
                </div>
                <div>
                   <p className="text-sm font-black text-slate-900">{project.manager?.name || 'RCS Command'}</p>
                   <p className="text-[10px] font-bold text-slate-400 uppercase">{project.manager?.designation || 'Project Strategist'}</p>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};

const RequirementsTab = ({ requirements = [] }) => (
  <div className="bg-white rounded-[3rem] border border-slate-200/60 p-10">
     <h3 className="text-xl font-black text-slate-900 uppercase mb-10">Mission Requirements</h3>
     <div className="space-y-4">
        {requirements.map((req, i) => (
          <div key={i} className="p-6 bg-slate-50 border border-slate-100 rounded-3xl flex items-center justify-between">
             <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-black">{i+1}</div>
                <div>
                   <h4 className="font-black text-slate-900 leading-none mb-1">{req.title}</h4>
                   <p className="text-[10px] font-bold text-slate-400 uppercase">{req.type} • {req.priority} PRIORITY</p>
                </div>
             </div>
             <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[9px] font-black uppercase text-slate-400">{req.status}</span>
          </div>
        ))}
        {requirements.length === 0 && <div className="text-center py-20 opacity-20"><Target size={48} className="mx-auto mb-2"/><p className="text-xs font-black uppercase">No clauses defined</p></div>}
     </div>
  </div>
);

const ScopeTab = ({ project }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
     <div className="bg-white rounded-[3rem] border border-slate-200/60 p-10">
        <h3 className="text-lg font-black text-blue-600 uppercase mb-8">Tactical In-Scope</h3>
        <div className="space-y-4">
           {(project.inScope || []).map((s, i) => (
             <div key={i} className="flex items-center gap-3 p-4 bg-blue-50/50 rounded-2xl border border-blue-100 text-xs font-bold text-blue-900">
                <CheckCircle2 size={16} className="text-blue-500" /> {s}
             </div>
           ))}
        </div>
     </div>
     <div className="bg-white rounded-[3rem] border border-slate-200/60 p-10">
        <h3 className="text-lg font-black text-rose-600 uppercase mb-8">Mission Exclusions</h3>
        <div className="space-y-4">
           {(project.outOfScope || []).map((s, i) => (
             <div key={i} className="flex items-center gap-3 p-4 bg-rose-50/50 rounded-2xl border border-rose-100 text-xs font-bold text-rose-900">
                <Zap size={16} className="text-rose-400" /> {s}
             </div>
           ))}
        </div>
     </div>
  </div>
);

const TasksTab = ({ tasks = [] }) => (
  <div className="bg-white rounded-[3rem] border border-slate-200/60 p-10">
     <h3 className="text-xl font-black text-slate-900 uppercase mb-10">Strategic Tasks</h3>
     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tasks.map(task => (
          <div key={task._id} className="p-6 bg-slate-50 border border-slate-100 rounded-[2rem] space-y-4">
             <div className="flex justify-between items-start">
                <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase ${
                  task.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                }`}>{task.status}</span>
                <span className="text-[10px] font-black text-slate-400 uppercase">{task.priority}</span>
             </div>
             <h4 className="font-black text-slate-900 leading-tight">{task.title}</h4>
             <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase">{task.assignedTo?.name || 'Unassigned'}</p>
                <p className="text-[10px] font-black text-slate-900">{task.progress}%</p>
             </div>
          </div>
        ))}
     </div>
  </div>
);

const MilestonesTab = ({ milestones = [] }) => (
  <div className="bg-white rounded-[3rem] border border-slate-200/60 p-10">
     <h3 className="text-xl font-black text-slate-900 uppercase mb-10">Tactical Milestones</h3>
     <div className="space-y-6">
        {milestones.map((ms, i) => (
          <div key={i} className="p-6 bg-slate-50 border border-slate-100 rounded-[2rem] flex items-center gap-6">
             <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${
                ms.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'
             }`}><CheckCircle2 size={20} /></div>
             <div className="flex-1">
                <h4 className="text-sm font-black text-slate-900 mb-1">{ms.title}</h4>
                <div className="h-1.5 w-full bg-white rounded-full overflow-hidden">
                   <div className="h-full bg-blue-600 transition-all duration-500" style={{width: `${ms.progress}%`}}></div>
                </div>
             </div>
             <span className="text-xs font-black text-slate-900">{ms.progress}%</span>
          </div>
        ))}
     </div>
  </div>
);

const SquadTab = ({ team = [] }) => (
  <div className="bg-white rounded-[3rem] border border-slate-200/60 p-10">
     <h3 className="text-xl font-black text-slate-900 uppercase mb-10">Mission Squad</h3>
     <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {team.map((mem, i) => (
          <div key={i} className="p-6 bg-slate-50 border border-slate-100 rounded-[2.5rem] text-center space-y-4">
             <div className="w-16 h-16 rounded-3xl bg-white border border-slate-200 flex items-center justify-center mx-auto text-xl font-black text-slate-400 shadow-sm">
                {mem.user?.name?.charAt(0) || '?'}
             </div>
             <div>
                <h4 className="text-sm font-black text-slate-900">{mem.user?.name || 'Specialist'}</h4>
                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{mem.role || 'Personnel'}</p>
             </div>
          </div>
        ))}
     </div>
  </div>
);

const RisksTab = ({ risks = [] }) => (
  <div className="bg-white rounded-[3rem] border border-slate-200/60 p-10">
     <h3 className="text-xl font-black text-slate-900 uppercase mb-10">Operational Risks</h3>
     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {risks.map((risk, i) => (
          <div key={i} className="p-8 bg-slate-50 border border-slate-100 rounded-[2.5rem] space-y-4">
             <div className="flex justify-between items-start">
                <div className="p-2 bg-rose-50 text-rose-600 rounded-xl"><AlertTriangle size={20} /></div>
                <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[9px] font-black uppercase text-rose-500">{risk.impact} IMPACT</span>
             </div>
             <h4 className="text-lg font-black text-slate-900 leading-tight">{risk.title}</h4>
             <p className="text-xs font-medium text-slate-500 leading-relaxed italic">"{risk.mitigationPlan}"</p>
          </div>
        ))}
     </div>
  </div>
);

const KpiCard = ({ label, val, color }) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm flex flex-col items-center text-center group hover:scale-105 transition-all">
     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
     <h4 className={`text-xl font-black text-${color}-600`}>{val}</h4>
  </div>
);

const HealthRow = ({ label, val }) => (
  <div className="space-y-2">
     <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400"><span>{label}</span><span>{val}</span></div>
     {typeof val === 'string' && val.includes('%') ? (
       <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-emerald-500" style={{width: val}}></div></div>
     ) : (
       <p className="text-xs font-black text-emerald-400">{val}</p>
     )}
  </div>
);

export default EmployeeProjectDetail;
