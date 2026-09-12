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

  useEffect(() => {
    fetchProjectData();
  }, [id]);

  if (loading) return <div className="p-20 text-center font-black text-slate-300 uppercase tracking-widest animate-pulse">Syncing Mission Intelligence...</div>;
  if (!project) return <div className="p-20 text-center font-black text-slate-400 uppercase">Mission Protocol Not Found</div>;

  // Local View Components
  const KpiBox = ({ label, val, color }) => (
    <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm flex flex-col items-center text-center group hover:scale-105 transition-all">
       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
       <h4 className={`text-xl font-black text-${color}-600`}>{val}</h4>
    </div>
  );

  const HealthBar = ({ label, val }) => (
    <div className="space-y-2">
       <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400"><span>{label}</span><span>{val}</span></div>
       <div className="h-1.5 w-full bg-slate-100/10 rounded-full overflow-hidden">
          <div className="h-full bg-emerald-500" style={{width: typeof val === 'string' && val.includes('%') ? val : '100%'}}></div>
       </div>
    </div>
  );

  return (
    <div className="p-8 bg-slate-50 min-h-screen font-sans space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
        <div className="flex items-center gap-6">
           <button onClick={() => navigate('/my-projects')} className="p-3 bg-white border border-slate-200 rounded-2xl hover:border-blue-500 transition-all text-slate-400 hover:text-blue-600 shadow-sm">
              <ArrowLeft size={20} />
           </button>
           <div>
              <div className="flex items-center gap-3 mb-1">
                 <h1 className="text-3xl font-black text-slate-900 tracking-tight">{project.name}</h1>
                 <span className="px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border bg-blue-50 text-blue-600 border-blue-100">{project.status}</span>
              </div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-tighter">{project.client} • {project.code}</p>
           </div>
        </div>
      </div>

      <div className="flex gap-2 p-1.5 bg-white border border-slate-200 rounded-[2rem] shadow-sm overflow-x-auto scrollbar-hide">
         {['Overview', 'Tasks', 'Squad'].map(tab => (
           <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}>{tab}</button>
         ))}
      </div>

      {activeTab === 'Overview' && (
        <div className="grid grid-cols-12 gap-8">
           <div className="col-span-12 xl:col-span-8 space-y-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 <KpiBox label="Global Progress" val={`${project.progress || 0}%`} color="blue" />
                 <KpiBox label="Tasks Done" val={`${tasks.filter(t => t.status === 'COMPLETED').length} / ${tasks.length}`} color="emerald" />
                 <KpiBox label="Project Health" val={project.health || 'STABLE'} color="purple" />
                 <KpiBox label="Squad Size" val={project.team?.length || 0} color="indigo" />
              </div>
              <div className="bg-white rounded-[2.5rem] border border-slate-200/60 p-10">
                 <h3 className="text-xl font-black text-slate-900 uppercase mb-8">Mission trajectory</h3>
                 <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                       <AreaChart data={[{name: 'A', p: 0}, {name: 'B', p: project.progress}]}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <Area type="monotone" dataKey="p" stroke="#2563eb" fill="#2563eb" fillOpacity={0.1} />
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
                    <HealthBar label="Schedule Velocity" val="100%" />
                    <HealthBar label="Execution Quality" val="STABLE" />
                 </div>
              </div>
           </div>
        </div>
      )}

      {activeTab === 'Tasks' && (
        <div className="bg-white rounded-[3rem] border border-slate-200/60 p-10">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {tasks.map(task => (
                <div key={task._id} className="p-6 bg-slate-50 border border-slate-100 rounded-[2rem] space-y-4">
                   <span className="px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase bg-blue-50 text-blue-600">{task.status}</span>
                   <h4 className="font-black text-slate-900 leading-tight">{task.title}</h4>
                   <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">{task.assignedTo?.name || 'Unassigned'}</p>
                      <p className="text-[10px] font-black text-slate-900">{task.progress}%</p>
                   </div>
                </div>
              ))}
              {tasks.length === 0 && <p className="text-xs font-black text-slate-300 uppercase py-20 text-center col-span-full">No tasks logs</p>}
           </div>
        </div>
      )}

      {activeTab === 'Squad' && (
        <div className="bg-white rounded-[3rem] border border-slate-200/60 p-10">
           <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {project.team?.map((mem, i) => (
                <div key={i} className="p-6 bg-slate-50 border border-slate-100 rounded-[2.5rem] text-center space-y-4">
                   <div className="w-16 h-16 rounded-3xl bg-white border border-slate-200 flex items-center justify-center mx-auto text-xl font-black text-slate-400 shadow-sm">{mem.user?.name?.charAt(0) || '?'}</div>
                   <div>
                      <h4 className="text-sm font-black text-slate-900">{mem.user?.name || 'Specialist'}</h4>
                      <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{mem.role || 'Personnel'}</p>
                   </div>
                </div>
              ))}
           </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeProjectDetail;
