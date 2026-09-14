import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Folder, Users, Target, Layout, CheckCircle2, Clock, AlertTriangle,
  DollarSign as DollarIcon, Activity, FileText, ChevronRight, ArrowLeft, MoreVertical,
  Plus, Search, Filter, Edit2, Zap, Calendar, TrendingUp, Trash2, X,
  Shield, MessageSquare, Link as LinkIcon, Bug, RefreshCw, BarChart2, Check, Upload, User, Info
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { apiFetch } from '../../utils/api';
import { getAuthUser } from '../../utils/auth';
import Modal from '../components/Modal';

// --- ATOMIC COMPONENTS ---

const KpiCard = ({ label, val, color }) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm flex flex-col items-center text-center group hover:scale-105 transition-all">
     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
     <h4 className={`text-xl font-black text-${color}-600`}>{val}</h4>
  </div>
);

const HealthRow = ({ label, val }) => (
  <div className="space-y-2">
     <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400"><span>{label}</span><span>{val}</span></div>
     <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-emerald-500" style={{width: val || '0%'}}></div></div>
  </div>
);

const BudgetItem = ({ label, val, color }) => (
  <div className="space-y-2 p-6 bg-slate-50 rounded-3xl border border-slate-100">
     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</p>
     <h4 className={`text-lg font-black text-${color}-600`}>Rs. {(Number(val || 0)).toLocaleString()}</h4>
  </div>
);

const ProjectInput = ({ label, value, onChange, type = "text" }) => (
  <div className="space-y-1.5">
     <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
     <input type={type} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-bold focus:border-blue-500" value={value || ''} onChange={e => onChange(e.target.value)} />
  </div>
);

const ProjectTextarea = ({ label, value, onChange }) => (
  <div className="space-y-1.5">
     <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
     <textarea rows="3" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-medium focus:border-blue-500" value={value || ''} onChange={e => onChange(e.target.value)} />
  </div>
);

const ProjectSelect = ({ label, options, value, onChange }) => (
  <div className="space-y-1.5">
     <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
     <select className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none" value={value || ''} onChange={e => onChange(e.target.value)}>
        <option value="">Select</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
     </select>
  </div>
);

// --- TAB COMPONENTS ---

const OverviewTab = ({ project, tasks = [] }) => {
  const safeTasks = Array.isArray(tasks) ? tasks : [];
  const completedTasks = safeTasks.filter(t => t && t.status === 'COMPLETED').length;

  return (
    <div className="grid grid-cols-12 gap-8">
       <div className="col-span-12 xl:col-span-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
             <KpiCard label="Global Progress" val={`${project?.progress || 0}%`} color="blue" />
             <KpiCard label="Budget Consumed" val="0%" color="indigo" />
             <KpiCard label="Tasks Done" val={`${completedTasks} / ${safeTasks.length}`} color="emerald" />
             <KpiCard label="Health Status" val={project?.health || 'STABLE'} color="purple" />
          </div>
          <div className="bg-white rounded-[2.5rem] border border-slate-200/60 p-10 shadow-sm">
             <h3 className="text-xl font-black text-slate-900 uppercase mb-8">Performance Trajectory</h3>
             <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={[{name: 'A', p: 0}, {name: 'B', p: project?.progress || 0}]}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <Area type="monotone" dataKey="p" stroke="#2563eb" fill="#2563eb" fillOpacity={0.1} />
                   </AreaChart>
                </ResponsiveContainer>
             </div>
          </div>
       </div>
       <div className="col-span-12 xl:col-span-4 space-y-8">
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl border border-white/5">
             <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
             <h3 className="text-lg font-black uppercase mb-6 flex items-center gap-2"><Activity className="text-emerald-400" /> Strategic Health</h3>
             <div className="space-y-6">
                <HealthRow label="Schedule Adherence" val={project?.health === 'ON_TRACK' ? '100%' : '75%'} />
                <HealthRow label="Budget Discipline" val="100%" />
                <HealthRow label="Task Velocity" val={safeTasks.length ? `${Math.round((completedTasks/safeTasks.length)*100)}%` : '0%'} />
             </div>
          </div>
       </div>
    </div>
  );
};

const TimelineTab = ({ project, tasks = [] }) => {
  const safeTasks = Array.isArray(tasks) ? tasks : [];
  const safeMilestones = Array.isArray(project?.milestones) ? project.milestones : [];
  const timelineItems = [
    ...safeMilestones.map(m => ({ ...m, type: 'milestone' })),
    ...safeTasks.map(t => ({ ...t, type: 'task' }))
  ].sort((a, b) => {
    const dateA = a.dueDate ? new Date(a.dueDate) : new Date(0);
    const dateB = b.dueDate ? new Date(b.dueDate) : new Date(0);
    return dateA - dateB;
  });

  return (
    <div className="bg-white rounded-[3rem] border border-slate-200/60 p-10 shadow-sm">
       <h3 className="text-xl font-black text-slate-900 uppercase mb-10 flex items-center gap-3">
          <TrendingUp className="text-blue-600" /> Strategic Roadmap
       </h3>
       <div className="space-y-8 relative before:absolute before:left-8 before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-100">
          {timelineItems.map((item, i) => (
            <div key={i} className="relative pl-20 flex items-center group">
               <div className={`absolute left-5 w-6 h-6 rounded-full border-4 border-white shadow-sm z-10 ${
                  item.type === 'milestone' ? 'bg-blue-600 scale-110' : 'bg-slate-300'
               } ${item.status === 'COMPLETED' ? '!bg-emerald-500' : ''}`}></div>
               <div className="flex-1 p-6 bg-slate-50 border border-slate-100 rounded-3xl transition-all">
                  <div className="flex justify-between items-start mb-2">
                     <div className="flex items-center gap-3">
                        <h4 className="font-black text-slate-900">{item.title}</h4>
                        <span className="text-[8px] font-black uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-600">{item.type}</span>
                     </div>
                     <span className="text-[10px] font-black text-slate-400 uppercase">{item.dueDate ? new Date(item.dueDate).toLocaleDateString() : 'TBD'}</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden mt-4">
                     <div className="h-full bg-blue-600" style={{ width: `${item.progress || 0}%` }}></div>
                  </div>
               </div>
            </div>
          ))}
       </div>
    </div>
  );
};

const StakeholdersTab = ({ project, onAdd }) => (
  <div className="bg-white rounded-[3rem] border border-slate-200/60 p-10 shadow-sm">
     <div className="flex justify-between items-center mb-10">
        <h3 className="text-xl font-black text-slate-900 uppercase flex items-center gap-3"><Users size={20}/> Stakeholders</h3>
        <button onClick={onAdd} className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase shadow-lg shadow-slate-900/10 hover:bg-blue-600 transition-all"><Plus size={16} className="inline mr-1"/> Register</button>
     </div>
     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(project?.stakeholders || []).map((sh, i) => (
          <div key={i} className="p-8 bg-slate-50 border border-slate-100 rounded-[2.5rem] space-y-4">
             <h4 className="font-black text-slate-900">{sh.name}</h4>
             <p className="text-[10px] font-bold text-slate-400 uppercase">{sh.role} • {sh.organization}</p>
          </div>
        ))}
     </div>
  </div>
);

const DecisionsTab = ({ project, onAdd }) => (
  <div className="bg-white rounded-[3rem] border border-slate-200/60 p-10 shadow-sm">
     <div className="flex justify-between items-center mb-10">
        <h3 className="text-xl font-black text-slate-900 uppercase flex items-center gap-3"><MessageSquare size={20}/> Decisions</h3>
        <button onClick={onAdd} className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase shadow-lg hover:bg-blue-600 transition-all"><Plus size={16} className="inline mr-1"/> Log Decision</button>
     </div>
     <div className="space-y-6">
        {(project?.decisions || []).map((d, i) => (
          <div key={i} className="p-8 bg-slate-50 border border-slate-100 rounded-[2.5rem]">
             <div className="flex justify-between mb-4"><h4 className="font-black text-slate-900">{d.title}</h4><span className="text-[10px] text-slate-400 font-bold uppercase">{new Date(d.date).toLocaleDateString()}</span></div>
             <p className="text-sm font-bold text-slate-900">{d.outcome}</p>
          </div>
        ))}
     </div>
  </div>
);

const FilesTab = ({ project, onAdd }) => (
  <div className="bg-white rounded-[3rem] border border-slate-200/60 p-10 shadow-sm">
     <div className="flex justify-between items-center mb-10">
        <h3 className="text-xl font-black text-slate-900 uppercase flex items-center gap-3"><LinkIcon size={20}/> Assets</h3>
        <button onClick={onAdd} className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase hover:bg-blue-600 transition-all"><Upload size={16} className="inline mr-1"/> Upload</button>
     </div>
     <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {(project?.documents || []).map((doc, i) => (
          <div key={i} className="p-6 bg-slate-50 border border-slate-100 rounded-3xl text-center">
             <FileText size={32} className="mx-auto mb-2 text-slate-300" />
             <h4 className="font-black text-slate-900 text-xs truncate">{doc.name}</h4>
          </div>
        ))}
     </div>
  </div>
);

const QATab = ({ project, onAdd }) => (
  <div className="bg-white rounded-[3rem] border border-slate-200/60 p-10 shadow-sm">
     <div className="flex justify-between items-center mb-10">
        <h3 className="text-xl font-black text-slate-900 uppercase flex items-center gap-3"><Bug size={20}/> Quality Logs</h3>
        <button onClick={onAdd} className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase hover:bg-rose-600 transition-all"><Plus size={16} className="inline mr-1"/> Log Test</button>
     </div>
     <div className="space-y-4">
        {(project?.testLogs || []).map((log, i) => (
          <div key={i} className="p-6 bg-slate-50 border border-slate-100 rounded-3xl flex justify-between">
             <h4 className="font-black text-slate-900">{log.feature}</h4>
             <span className="text-[10px] font-black uppercase text-emerald-600">{log.status}</span>
          </div>
        ))}
     </div>
  </div>
);

const ChangeRequestTab = ({ project, onAdd }) => (
  <div className="bg-white rounded-[3rem] border border-slate-200/60 p-10 shadow-sm">
     <div className="flex justify-between items-center mb-10">
        <h3 className="text-xl font-black text-slate-900 uppercase flex items-center gap-3"><RefreshCw size={20}/> Changes</h3>
        <button onClick={onAdd} className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase hover:bg-amber-600 transition-all"><Plus size={16} className="inline mr-1"/> Request Change</button>
     </div>
     <div className="space-y-6">
        {(project?.changeRequests || []).map((cr, i) => (
          <div key={i} className="p-8 bg-slate-50 border border-slate-100 rounded-[2.5rem]">
             <h4 className="font-black text-slate-900 mb-2">{cr.title}</h4>
             <p className="text-xs text-slate-500">{cr.description}</p>
          </div>
        ))}
     </div>
  </div>
);

const IssuesTab = ({ project, onAdd }) => (
  <div className="bg-white rounded-[3rem] border border-slate-200/60 p-10 shadow-sm">
     <div className="flex justify-between items-center mb-10">
        <h3 className="text-xl font-black text-slate-900 uppercase flex items-center gap-3"><AlertCircle size={20}/> Blockers</h3>
        <button onClick={onAdd} className="bg-rose-600 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase hover:bg-rose-700 transition-all"><Plus size={16} className="inline mr-1"/> Log Blocker</button>
     </div>
     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(project?.issues || []).map((iss, i) => (
          <div key={i} className="p-8 bg-slate-50 border border-slate-100 rounded-[2.5rem]">
             <h4 className="font-black text-slate-900 mb-2">{iss.title}</h4>
             <p className="text-xs text-slate-500">{iss.description}</p>
          </div>
        ))}
     </div>
  </div>
);

const RisksTab = ({ risks = [] }) => (
  <div className="bg-white rounded-[3rem] border border-slate-200/60 p-10 shadow-sm">
     <h3 className="text-xl font-black text-slate-900 uppercase mb-10 flex items-center gap-3"><AlertTriangle size={20}/> Risks</h3>
     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(risks || []).map((risk, i) => (
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

const TasksTab = ({ tasks = [] }) => (
  <div className="bg-white rounded-[3rem] border border-slate-200/60 p-10 shadow-sm">
     <h3 className="text-xl font-black text-slate-900 uppercase mb-10">Strategic Tasks</h3>
     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {(tasks || []).map(task => (
          <div key={task?._id} className="p-6 bg-slate-50 border border-slate-100 rounded-[2rem] space-y-4">
             <span className="px-2 py-0.5 rounded-full text-[8px] font-black uppercase bg-blue-50 text-blue-600">{task?.status}</span>
             <h4 className="font-black text-slate-900 truncate">{task?.title}</h4>
             <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-[10px] font-bold text-slate-400">
                <span>{task?.assignedTo?.name || 'Unassigned'}</span>
                <span className="text-slate-900 font-black">{task?.progress || 0}%</span>
             </div>
          </div>
        ))}
     </div>
  </div>
);

const MilestonesTab = ({ project, onUpdateMilestone, canManage }) => (
  <div className="bg-white rounded-[3rem] border border-slate-200/60 p-10 shadow-sm">
     <h3 className="text-xl font-black text-slate-900 uppercase mb-10">Strategic Milestones</h3>
     <div className="space-y-6">
        {(project?.milestones || []).map((ms, i) => (
          <div key={i} className="p-6 bg-slate-50 border border-slate-100 rounded-[2rem] flex items-center gap-6">
             <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${ms?.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}><CheckCircle2 size={20} /></div>
             <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                   <h4 className="text-sm font-black text-slate-900">{ms?.title}</h4>
                   {ms.status !== 'COMPLETED' && canManage && <button onClick={() => onUpdateMilestone(i, 'COMPLETED')} className="text-[8px] font-black uppercase text-blue-600 hover:underline">Mark Done</button>}
                </div>
                <div className="h-1.5 w-full bg-white rounded-full overflow-hidden"><div className="h-full bg-blue-600" style={{width: `${ms?.progress || 0}%`}}></div></div>
             </div>
          </div>
        ))}
     </div>
  </div>
);

const SquadTab = ({ team = [] }) => (
  <div className="bg-white rounded-[3rem] border border-slate-200/60 p-10 shadow-sm">
     <h3 className="text-xl font-black text-slate-900 uppercase mb-10">Mission Squad</h3>
     <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {(team || []).map((mem, i) => (
          <div key={i} className="p-6 bg-slate-50 border border-slate-100 rounded-[2.5rem] text-center space-y-4">
             <div className="w-16 h-16 rounded-3xl bg-white border border-slate-200 flex items-center justify-center mx-auto text-xl font-black text-slate-400 shadow-sm">{mem?.user?.name?.charAt(0) || '?'}</div>
             <h4 className="text-sm font-black text-slate-900">{mem?.user?.name || 'Specialist'}</h4>
             <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{mem?.role}</p>
          </div>
        ))}
     </div>
  </div>
);

// --- MAIN PROJECT WORKSPACE ---

const ProjectWorkspace = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = getAuthUser();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Overview');
  const [modalType, setModalType] = useState(null);
  const [modalData, setModalData] = useState({});
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const tabs = ['Overview', 'Timeline', 'Tasks', 'Milestones', 'Squad', 'Stakeholders', 'Decisions', 'Files', 'QA', 'Change Requests', 'Issues', 'Risks'];

  const fetchProjectData = async () => {
    try {
      const [projRes, taskRes, empRes] = await Promise.all([
        apiFetch(`/api/projects/${id}`),
        apiFetch(`/api/projects/${id}/tasks`),
        apiFetch('/api/employees')
      ]);
      const proj = await projRes.json();
      const tsk = await taskRes.json();
      const emp = await empRes.json();
      if (proj.success) setProject(proj.data);
      if (tsk.success) setTasks(Array.isArray(tsk.data) ? tsk.data : []);
      if (emp.success) setEmployees(Array.isArray(emp.data) ? emp.data : []);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProjectData(); }, [id]);

  const handleUpdate = async (update) => {
    try {
      const res = await apiFetch(`/api/projects/${id}`, { method: 'PUT', body: JSON.stringify(update) });
      if (res.ok) fetchProjectData();
    } catch (err) { console.error('Update error:', err); }
  };

  const handleGovSubmit = async (e) => {
    e.preventDefault();
    let update = {};
    if (modalType === 'STAKEHOLDER') update = { stakeholders: [...(project?.stakeholders || []), modalData] };
    if (modalType === 'DECISION') update = { decisions: [...(project?.decisions || []), { ...modalData, date: new Date(), decidedBy: currentUser?.name }] };
    if (modalType === 'ISSUE') update = { issues: [...(project?.issues || []), { ...modalData, status: 'OPEN', owner: currentUser?._id }] };
    if (modalType === 'QA') update = { testLogs: [...(project?.testLogs || []), { ...modalData, tester: currentUser?._id }] };
    if (modalType === 'CHANGE') update = { changeRequests: [...(project?.changeRequests || []), { ...modalData, requestedBy: currentUser?._id }] };

    await handleUpdate(update);
    setModalType(null);
    setModalData({});
  };

  if (loading) return <div className="p-20 text-center font-black text-slate-300 uppercase tracking-widest animate-pulse font-sans">Syncing Workspace...</div>;
  if (!project) return <div className="p-20 text-center font-black text-slate-400 uppercase font-sans">Mission Intelligence Not Found</div>;

  const canManage = currentUser?.role === 'ADMIN' || currentUser?.role === 'SUPER_ADMIN' || (project?.manager?._id || project?.manager) === (currentUser?._id || currentUser?.id);

  return (
    <div className="p-8 bg-slate-50 min-h-screen font-sans space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
        <div className="flex items-center gap-6">
           <button onClick={() => navigate('/admin/projects')} className="p-3 bg-white border border-slate-200 rounded-2xl hover:border-blue-500 transition-all text-slate-400 hover:text-blue-600 shadow-sm"><ArrowLeft size={20} /></button>
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
           {canManage && (
             <>
                <button onClick={() => navigate(`/admin/projects/edit/${id}`)} className="flex items-center gap-2 bg-white px-6 py-3.5 rounded-2xl text-[10px] font-black uppercase border border-slate-200 hover:bg-slate-50 transition-all"><Edit2 size={14}/> Refine Strategy</button>
                <button onClick={() => setShowTaskModal(true)} className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase shadow-xl hover:bg-blue-700 transition-all"><Plus size={16}/> Add Task</button>
             </>
           )}
        </div>
      </div>

      <div className="flex gap-2 p-1.5 bg-white border border-slate-200 rounded-[2rem] shadow-sm overflow-x-auto scrollbar-hide">
         {tabs.map(tab => (
           <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${activeTab === tab ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}>{tab}</button>
         ))}
      </div>

      <div className="animate-in slide-in-from-bottom-4 duration-500 pb-20">
         {activeTab === 'Overview' && <OverviewTab project={project} tasks={tasks} />}
         {activeTab === 'Timeline' && <TimelineTab project={project} tasks={tasks} />}
         {activeTab === 'Tasks' && <TasksTab tasks={tasks} />}
         {activeTab === 'Milestones' && <MilestonesTab project={project} canManage={canManage} onUpdateMilestone={(i, s) => {
            const ms = [...(project?.milestones || [])]; ms[i].status = s; ms[i].progress = 100; handleUpdate({ milestones: ms });
         }} />}
         {activeTab === 'Squad' && <SquadTab team={project.team} />}
         {activeTab === 'Stakeholders' && <StakeholdersTab project={project} onAdd={() => setModalType('STAKEHOLDER')} />}
         {activeTab === 'Decisions' && <DecisionsTab project={project} onAdd={() => setModalType('DECISION')} />}
         {activeTab === 'Files' && <FilesTab project={project} onAdd={() => setModalType('FILE')} />}
         {activeTab === 'QA' && <QATab project={project} onAdd={() => setModalType('QA')} />}
         {activeTab === 'Change Requests' && <ChangeRequestTab project={project} onAdd={() => setModalType('CHANGE')} />}
         {activeTab === 'Issues' && <IssuesTab project={project} onAdd={() => setModalType('ISSUE')} />}
         {activeTab === 'Risks' && <RisksTab risks={project.risks} />}
      </div>

      <Modal isOpen={!!modalType} onClose={() => setModalType(null)} title={`New ${modalType} Protocol`}>
         <form onSubmit={handleGovSubmit} className="space-y-6">
            {modalType === 'STAKEHOLDER' && (
               <>
                  <ProjectInput label="Name" value={modalData.name} onChange={v => setModalData({...modalData, name: v})} />
                  <ProjectInput label="Organization" value={modalData.organization} onChange={v => setModalData({...modalData, organization: v})} />
                  <div className="grid grid-cols-2 gap-4">
                     <ProjectSelect label="Influence" options={['LOW', 'MEDIUM', 'HIGH']} value={modalData.influence} onChange={v => setModalData({...modalData, influence: v})} />
                     <ProjectSelect label="Interest" options={['LOW', 'MEDIUM', 'HIGH']} value={modalData.interest} onChange={v => setModalData({...modalData, interest: v})} />
                  </div>
                  <ProjectInput label="Contact / Prefs" value={modalData.preferences} onChange={v => setModalData({...modalData, preferences: v})} />
               </>
            )}
            {modalType === 'DECISION' && (
               <>
                  <ProjectInput label="Decision Title" value={modalData.title} onChange={v => setModalData({...modalData, title: v})} />
                  <ProjectTextarea label="Context" value={modalData.context} onChange={v => setModalData({...modalData, context: v})} />
                  <ProjectTextarea label="Final Outcome" value={modalData.outcome} onChange={v => setModalData({...modalData, outcome: v})} />
               </>
            )}
            {modalType === 'ISSUE' && (
               <>
                  <ProjectInput label="Blocker Headline" value={modalData.title} onChange={v => setModalData({...modalData, title: v})} />
                  <ProjectSelect label="Severity" options={['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']} value={modalData.severity} onChange={v => setModalData({...modalData, severity: v})} />
                  <ProjectTextarea label="Description" value={modalData.description} onChange={v => setModalData({...modalData, description: v})} />
               </>
            )}
            <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl">Commit to Strategy</button>
         </form>
      </Modal>

      {/* Task Modal remains... */}
      <Modal isOpen={showTaskModal} onClose={() => setShowTaskModal(false)} title="Configure Tactical Mission">
         <form onSubmit={async (e) => {
            e.preventDefault(); setIsSaving(true);
            try {
               const res = await apiFetch(`/api/projects/${id}/tasks`, { method: 'POST', body: JSON.stringify({...modalData, subtasks: (modalData.subtasks || []).filter(s => s.title?.trim())}) });
               if (res.ok) { setShowTaskModal(false); setModalData({}); fetchProjectData(); }
            } finally { setIsSaving(false); }
         }} className="space-y-6">
            <ProjectInput label="Task Headline" value={modalData.title} onChange={v => setModalData({...modalData, title: v})} />
            <ProjectTextarea label="Description" value={modalData.description} onChange={v => setModalData({...modalData, description: v})} />
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Assignee</label>
                  <select className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none" value={modalData.assignedTo || ''} onChange={e => setModalData({...modalData, assignedTo: e.target.value})}>
                     <option value="">Select Personnel</option>
                     {employees.map(emp => <option key={emp._id} value={emp._id}>{emp.name}</option>)}
                  </select>
               </div>
               <ProjectInput label="Deadline" type="date" value={modalData.dueDate} onChange={v => setModalData({...modalData, dueDate: v})} />
            </div>
            <button type="submit" disabled={isSaving} className="w-full py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl">Deploy Task</button>
         </form>
      </Modal>
    </div>
  );
};

export default ProjectWorkspace;
