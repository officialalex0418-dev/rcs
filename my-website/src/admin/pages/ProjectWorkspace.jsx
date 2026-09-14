import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Folder, Users, Target, Layout, CheckCircle2, Clock, AlertTriangle,
  DollarSign as DollarIcon, Activity, FileText, ChevronRight, ArrowLeft, MoreVertical,
  Plus, Search, Filter, Edit2, Zap, Calendar, TrendingUp, Trash2, X,
  Shield, MessageSquare, Link, Bug, RefreshCw, BarChart2, Check, Upload, User, Info
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { apiFetch } from '../../utils/api';
import { getAuthUser } from '../../utils/auth';
import Modal from '../components/Modal';

// --- SMALL ATOMIC COMPONENTS ---

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

const ActivityItem = ({ user, action, detail, time }) => (
  <div className="flex gap-6 group">
     <div className="flex flex-col items-center gap-2">
        <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
           <Zap size={18} />
        </div>
        <div className="w-0.5 flex-1 bg-slate-100"></div>
     </div>
     <div className="pb-8">
        <div className="flex items-center gap-3 mb-1">
           <span className="text-sm font-black text-slate-900">{user}</span>
           <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[9px] font-black uppercase">{action}</span>
        </div>
        <p className="text-xs font-medium text-slate-500 mb-2 leading-relaxed">{detail}</p>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter italic">{time}</p>
     </div>
  </div>
);

// --- TAB COMPONENTS ---

const OverviewTab = ({ project, tasks = [] }) => {
  const safeTasks = Array.isArray(tasks) ? tasks : [];
  const completedTasks = safeTasks.filter(t => t && t.status === 'COMPLETED').length;
  const safeTeam = Array.isArray(project?.team) ? project.team : [];

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
                   <AreaChart data={[
                      { name: 'Start', progress: 0 },
                      { name: 'Current', progress: project?.progress || 0 },
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
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl border border-white/5">
             <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
             <h3 className="text-lg font-black uppercase mb-6 flex items-center gap-2"><Activity className="text-emerald-400" /> Strategic Health</h3>
             <div className="space-y-6">
                <HealthRow label="Schedule Adherence" val={project?.health === 'ON_TRACK' ? '100%' : '75%'} />
                <HealthRow label="Budget Discipline" val="100%" />
                <HealthRow label="Task Velocity" val={safeTasks.length ? `${Math.round((completedTasks/safeTasks.length)*100)}%` : '0%'} />
             </div>
          </div>
          <div className="bg-white rounded-[2.5rem] border border-slate-200/60 p-8 shadow-sm">
             <h3 className="text-lg font-black text-slate-900 uppercase mb-6">Execution Squad</h3>
             <div className="space-y-4">
                {safeTeam.filter(m => m).map((mem, i) => (
                  <div key={i} className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400 border border-slate-200">
                        {mem.user?.name?.charAt(0) || '?'}
                     </div>
                     <div className="flex-1">
                        <p className="text-xs font-black text-slate-900 leading-none mb-0.5">{mem.user?.name || 'Unknown'}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{mem.role || 'Specialist'}</p>
                     </div>
                  </div>
                ))}
                {safeTeam.length === 0 && <p className="text-xs text-slate-400 italic py-4">No team members assigned</p>}
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
  ].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

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
               <div className="flex-1 p-6 bg-slate-50 border border-slate-100 rounded-3xl group-hover:bg-white group-hover:border-blue-200 transition-all group-hover:shadow-lg">
                  <div className="flex justify-between items-start mb-2">
                     <div className="flex items-center gap-3">
                        <h4 className="font-black text-slate-900">{item.title}</h4>
                        <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${
                           item.type === 'milestone' ? 'bg-blue-50 text-blue-600' : 'bg-slate-200 text-slate-500'
                        }`}>{item.type}</span>
                     </div>
                     <span className="text-[10px] font-black text-slate-400 uppercase">{item.dueDate ? new Date(item.dueDate).toLocaleDateString() : 'TBD'}</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden mt-4">
                     <div className="h-full bg-blue-600" style={{ width: `${item.progress || 0}%` }}></div>
                  </div>
               </div>
            </div>
          ))}
          {timelineItems.length === 0 && <div className="text-center py-20 opacity-20"><Calendar size={48} className="mx-auto mb-2"/><p className="text-xs font-black uppercase">No strategic data points logged</p></div>}
       </div>
    </div>
  );
};

const StakeholdersTab = ({ project, onAdd }) => {
  const safeStakeholders = Array.isArray(project?.stakeholders) ? project.stakeholders : [];
  return (
    <div className="bg-white rounded-[3rem] border border-slate-200/60 p-10 shadow-sm">
       <div className="flex justify-between items-center mb-10">
          <h3 className="text-xl font-black text-slate-900 uppercase flex items-center gap-3">
             <Users className="text-blue-600" /> Stakeholder Register
          </h3>
          <button onClick={onAdd} className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase hover:bg-blue-600 transition-all shadow-lg shadow-slate-900/10">
             <Plus size={16} /> Register Stakeholder
          </button>
       </div>
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {safeStakeholders.map((sh, i) => (
            <div key={i} className="p-8 bg-slate-50 border border-slate-100 rounded-[2.5rem] space-y-4 hover:shadow-xl transition-all">
               <div className="flex justify-between items-start">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center font-black text-blue-600 shadow-sm border border-slate-200">
                     {sh.name?.charAt(0)}
                  </div>
                  <span className={`px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest ${
                    sh.influence === 'HIGH' ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-blue-600'
                  }`}>{sh.influence} Influence</span>
               </div>
               <div>
                  <h4 className="font-black text-slate-900 leading-tight">{sh.name}</h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">{sh.organization} • {sh.role}</p>
               </div>
               <div className="pt-4 border-t border-slate-200">
                  <p className="text-[10px] font-bold text-slate-500 italic">"{sh.preferences}"</p>
               </div>
            </div>
          ))}
          {safeStakeholders.length === 0 && <div className="col-span-full text-center py-20 opacity-20 font-black text-slate-300 uppercase">No stakeholders registered</div>}
       </div>
    </div>
  );
};

const DecisionsTab = ({ project, onAdd }) => {
  const safeDecisions = Array.isArray(project?.decisions) ? project.decisions : [];
  return (
    <div className="bg-white rounded-[3rem] border border-slate-200/60 p-10 shadow-sm">
       <div className="flex justify-between items-center mb-10">
          <h3 className="text-xl font-black text-slate-900 uppercase flex items-center gap-3">
             <MessageSquare className="text-blue-600" /> Decisions Log
          </h3>
          <button onClick={onAdd} className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase hover:bg-blue-600 transition-all shadow-lg shadow-slate-900/10">
             <Plus size={16} /> Log Decision
          </button>
       </div>
       <div className="space-y-6">
          {safeDecisions.map((d, i) => (
            <div key={i} className="p-8 bg-slate-50 border border-slate-100 rounded-[2.5rem] relative">
               <div className="flex justify-between items-start mb-4">
                  <h4 className="text-lg font-black text-slate-900 leading-tight">{d.title}</h4>
                  <span className="text-[10px] font-black text-slate-400 uppercase">{new Date(d.date).toLocaleDateString()}</span>
               </div>
               <p className="text-xs font-medium text-slate-600 mb-6 italic">Context: {d.context}</p>
               <div className="bg-white p-6 rounded-2xl border border-slate-200">
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2">Final Outcome</p>
                  <p className="text-sm font-bold text-slate-900">{d.outcome}</p>
               </div>
               <p className="text-[9px] font-black text-slate-400 uppercase mt-4">Authorized By: {d.decidedBy}</p>
            </div>
          ))}
          {safeDecisions.length === 0 && <div className="text-center py-20 opacity-20 font-black text-slate-300 uppercase">No strategic decisions recorded</div>}
       </div>
    </div>
  );
};

const FilesTab = ({ project, onAdd }) => {
  const safeDocs = Array.isArray(project?.documents) ? project.documents : [];
  return (
    <div className="bg-white rounded-[3rem] border border-slate-200/60 p-10 shadow-sm">
       <h3 className="text-xl font-black text-slate-900 uppercase mb-10 flex items-center gap-3">
          <Link className="text-blue-600" /> Tactical Assets
       </h3>
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {safeDocs.map((doc, i) => (
            <div key={i} className="p-6 bg-slate-50 border border-slate-100 rounded-3xl group hover:border-blue-200 transition-all cursor-pointer">
               <div className="w-full aspect-square bg-white rounded-2xl mb-4 flex items-center justify-center text-slate-300 group-hover:text-blue-500 transition-colors">
                  <FileText size={48} />
               </div>
               <h4 className="font-black text-slate-900 text-sm truncate">{doc.name}</h4>
               <p className="text-[9px] font-black text-slate-400 uppercase mt-1">{doc.type} • v{doc.version}</p>
            </div>
          ))}
          <div onClick={onAdd} className="p-6 border-2 border-dashed border-slate-100 rounded-3xl flex flex-col items-center justify-center text-slate-300 hover:border-blue-200 hover:text-blue-500 cursor-pointer transition-all">
             <Plus size={32} />
             <span className="text-[10px] font-black uppercase mt-2">Upload Asset</span>
          </div>
       </div>
    </div>
  );
};

const QATab = ({ project, onAdd }) => {
  const safeLogs = Array.isArray(project?.testLogs) ? project.testLogs : [];
  return (
    <div className="bg-white rounded-[3rem] border border-slate-200/60 p-10 shadow-sm">
       <div className="flex justify-between items-center mb-10">
          <h3 className="text-xl font-black text-slate-900 uppercase flex items-center gap-3">
             <Bug className="text-rose-500" /> Quality Assurance
          </h3>
          <button onClick={onAdd} className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase hover:bg-rose-600 transition-all shadow-lg shadow-slate-900/10">
             <Plus size={16} /> New Test Log
          </button>
       </div>
       <div className="space-y-4">
          {safeLogs.map((log, i) => (
            <div key={i} className="p-6 bg-slate-50 border border-slate-100 rounded-3xl flex items-center justify-between group hover:bg-white transition-all">
               <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${
                    log.status === 'PASSED' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
                  }`}>{log.status === 'PASSED' ? <CheckCircle2 size={20} /> : <AlertTriangle size={20} />}</div>
                  <div>
                     <h4 className="font-black text-slate-900 leading-none mb-1">{log.feature}</h4>
                     <p className="text-[10px] font-bold text-slate-400 uppercase">Tester: {log.tester?.name || 'System'}</p>
                  </div>
               </div>
               <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                  log.status === 'PASSED' ? 'text-emerald-500' : 'text-rose-500'
               }`}>{log.status}</span>
            </div>
          ))}
          {safeLogs.length === 0 && <div className="text-center py-20 opacity-20 font-black text-slate-300 uppercase">No QA logs found</div>}
       </div>
    </div>
  );
};

const ChangeRequestTab = ({ project, onAdd }) => {
  const safeRequests = Array.isArray(project?.changeRequests) ? project.changeRequests : [];
  return (
    <div className="bg-white rounded-[3rem] border border-slate-200/60 p-10 shadow-sm">
       <div className="flex justify-between items-center mb-10">
          <h3 className="text-xl font-black text-slate-900 uppercase flex items-center gap-3">
             <RefreshCw className="text-amber-500" /> Change Requests
          </h3>
          <button onClick={onAdd} className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase hover:bg-amber-600 transition-all shadow-lg shadow-slate-900/10">
             <Plus size={16} /> Initiate Change
          </button>
       </div>
       <div className="space-y-6">
          {safeRequests.map((cr, i) => (
            <div key={i} className="p-8 bg-slate-50 border border-slate-100 rounded-[2.5rem]">
               <div className="flex justify-between items-start mb-4">
                  <h4 className="text-lg font-black text-slate-900">{cr.title}</h4>
                  <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase border ${
                    cr.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                  }`}>{cr.status}</span>
               </div>
               <p className="text-xs font-medium text-slate-500 mb-6">{cr.description}</p>
               <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-200">
                  <div>
                     <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Impact: Timeline</p>
                     <p className="text-xs font-bold text-slate-900">{cr.impact?.timeline}</p>
                  </div>
                  <div>
                     <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Impact: Budget</p>
                     <p className="text-xs font-bold text-slate-900">Rs. {cr.impact?.budget?.toLocaleString()}</p>
                  </div>
                  <div>
                     <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Requested By</p>
                     <p className="text-xs font-bold text-slate-900">{cr.requestedBy?.name || 'Authorized Personnel'}</p>
                  </div>
               </div>
            </div>
          ))}
          {safeRequests.length === 0 && <div className="text-center py-20 opacity-20 font-black text-slate-300 uppercase">No active change requests</div>}
       </div>
    </div>
  );
};

const IssuesTab = ({ project, onAdd }) => {
  const safeIssues = Array.isArray(project?.issues) ? project.issues : [];
  return (
    <div className="bg-white rounded-[3rem] border border-slate-200/60 p-10 shadow-sm">
       <div className="flex justify-between items-center mb-10">
          <h3 className="text-xl font-black text-slate-900 uppercase flex items-center gap-3">
             <AlertCircle className="text-rose-600" /> Active Blockers
          </h3>
          <button onClick={onAdd} className="flex items-center gap-2 bg-rose-600 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase hover:bg-rose-700 transition-all shadow-lg shadow-rose-600/10">
             <Plus size={16} /> Log Blocker
          </button>
       </div>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {safeIssues.map((iss, i) => (
            <div key={i} className="p-8 bg-slate-50 border border-slate-100 rounded-[2.5rem] relative group">
               <div className="flex justify-between items-start mb-6">
                  <div className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                    iss.severity === 'CRITICAL' ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                  }`}>{iss.severity} Severity</div>
                  <span className="text-[10px] font-black text-slate-400 uppercase">{iss.status}</span>
               </div>
               <h4 className="text-lg font-black text-slate-900 mb-2 leading-tight">{iss.title}</h4>
               <p className="text-xs font-medium text-slate-500 mb-6">{iss.description}</p>
               <div className="pt-6 border-t border-slate-200 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                     <div className="w-6 h-6 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-[10px] font-black text-slate-400">
                        {iss.owner?.name?.charAt(0)}
                     </div>
                     <span className="text-[10px] font-bold text-slate-400 uppercase">{iss.owner?.name || 'Unassigned'}</span>
                  </div>
               </div>
            </div>
          ))}
          {safeIssues.length === 0 && <div className="col-span-full text-center py-20 opacity-20 font-black text-slate-300 uppercase">No active blockers logged</div>}
       </div>
    </div>
  );
};

// --- MAIN PROJECT WORKSPACE COMPONENT ---

const ProjectWorkspace = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = getAuthUser();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Overview');
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // New Modals State
  const [modalType, setModalType] = useState(null); // 'STAKEHOLDER', 'DECISION', 'ISSUE', 'QA', 'CHANGE'
  const [modalData, setModalData] = useState({});

  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    assignedTo: '',
    priority: 'MEDIUM',
    dueDate: '',
    subtasks: []
  });

  const tabs = [
    'Overview', 'Timeline', 'Tasks', 'Milestones', 'Squad', 'Stakeholders', 'Decisions', 'Files', 'QA', 'Change Requests', 'Issues', 'Budget', 'Risks'
  ];

  const handleAddSubtask = () => {
    setTaskData({
      ...taskData,
      subtasks: [...taskData.subtasks, { title: '', completed: false }]
    });
  };

  const updateSubtask = (index, val) => {
    const newSubtasks = [...taskData.subtasks];
    newSubtasks[index].title = val;
    setTaskData({ ...taskData, subtasks: newSubtasks });
  };

  const removeSubtask = (index) => {
    setTaskData({
      ...taskData,
      subtasks: taskData.subtasks.filter((_, i) => i !== index)
    });
  };

  const fetchProjectData = async () => {
    try {
      const [projRes, taskRes, empRes] = await Promise.all([
        apiFetch(`/api/projects/${id}`),
        apiFetch(`/api/projects/${id}/tasks`),
        apiFetch('/api/employees')
      ]);

      const proj = projRes.ok ? await projRes.json() : { success: false };
      const tsk = taskRes.ok ? await taskRes.json() : { success: false };
      const emp = empRes.ok ? await empRes.json() : { success: false };

      if (proj.success) setProject(proj.data);
      if (tsk.success) setTasks(Array.isArray(tsk.data) ? tsk.data : []);
      if (emp.success) setEmployees(Array.isArray(emp.data) ? emp.data : []);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateMilestone = async (index, newStatus) => {
     if (!project) return;
     const updatedMilestones = [...project.milestones];
     updatedMilestones[index] = {
        ...updatedMilestones[index],
        status: newStatus,
        progress: newStatus === 'COMPLETED' ? 100 : updatedMilestones[index].progress
     };
     await handleGlobalUpdate({ milestones: updatedMilestones });
  };

  const handleGlobalUpdate = async (updateData) => {
     try {
        const response = await apiFetch(`/api/projects/${id}`, {
           method: 'PUT',
           body: JSON.stringify(updateData)
        });
        if (response.ok) fetchProjectData();
     } catch (err) {
        console.error('Update error:', err);
     }
  };

  const handleGovernanceSubmit = async (e) => {
     e.preventDefault();
     let update = {};
     if (modalType === 'STAKEHOLDER') update = { stakeholders: [...(project.stakeholders || []), modalData] };
     if (modalType === 'DECISION') update = { decisions: [...(project.decisions || []), { ...modalData, date: new Date() }] };
     if (modalType === 'ISSUE') update = { issues: [...(project.issues || []), { ...modalData, status: 'OPEN' }] };
     if (modalType === 'QA') update = { testLogs: [...(project.testLogs || []), { ...modalData, tester: currentUser?._id }] };
     if (modalType === 'CHANGE') update = { changeRequests: [...(project.changeRequests || []), { ...modalData, status: 'SUBMITTED', requestedBy: currentUser?._id }] };

     await handleGlobalUpdate(update);
     setModalType(null);
     setModalData({});
  };

  useEffect(() => {
    fetchProjectData();
  }, [id]);

  const handleAddTask = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = {
        ...taskData,
        assignedTo: taskData.assignedTo || undefined,
        subtasks: taskData.subtasks.filter(st => st.title && st.title.trim() !== '')
      };

      const response = await apiFetch(`/api/projects/${id}/tasks`, {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        setShowTaskModal(false);
        setTaskData({ title: '', description: '', assignedTo: '', priority: 'MEDIUM', dueDate: '', subtasks: [] });
        fetchProjectData();
      }
    } catch (err) {
      console.error('Task save error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <div className="p-20 text-center font-black text-slate-300 uppercase tracking-widest animate-pulse font-sans">Syncing Workspace...</div>;
  if (!project) return <div className="p-20 text-center font-black text-slate-400 uppercase font-sans">Project protocol not found</div>;

  const canManage = currentUser?.role === 'ADMIN' || currentUser?.role === 'SUPER_ADMIN' || (project?.manager?._id || project?.manager) === (currentUser?._id || currentUser?.id);

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
                 }`}>{project.status || 'DRAFT'}</span>
              </div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-tighter">{project.client} • {project.code}</p>
           </div>
        </div>

        <div className="flex items-center gap-3">
           {canManage && (
             <>
               <button onClick={() => navigate(`/admin/projects/edit/${id}`)} className="flex items-center gap-2 bg-white px-6 py-3.5 rounded-2xl text-[10px] font-black uppercase border border-slate-200 hover:bg-slate-50 transition-all">
                  <Edit2 size={14} /> Refine Strategy
               </button>
               <button
                 onClick={() => setShowTaskModal(true)}
                 className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all"
               >
                  <Plus size={16} /> Add Task
               </button>
             </>
           )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 p-1.5 bg-white border border-slate-200 rounded-[2rem] shadow-sm overflow-x-auto scrollbar-hide">
         {tabs.map(tab => (
           <button
             key={tab}
             onClick={() => setActiveTab(tab)}
             className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
               activeTab === tab ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
             }`}
           >
              {tab}
           </button>
         ))}
      </div>

      {/* Main Content Area */}
      <div className="animate-in slide-in-from-bottom-4 duration-500 pb-20">
         {activeTab === 'Overview' && <OverviewTab project={project} tasks={tasks} />}
         {activeTab === 'Timeline' && <TimelineTab project={project} tasks={tasks} />}
         {activeTab === 'Tasks' && <TasksTab tasks={tasks} />}
         {activeTab === 'Milestones' && <MilestonesTab project={project} onUpdateMilestone={handleUpdateMilestone} canManage={canManage} />}
         {activeTab === 'Squad' && <TeamTab project={project} />}
         {activeTab === 'Stakeholders' && <StakeholdersTab project={project} onAdd={() => setModalType('STAKEHOLDER')} />}
         {activeTab === 'Decisions' && <DecisionsTab project={project} onAdd={() => setModalType('DECISION')} />}
         {activeTab === 'Files' && <FilesTab project={project} onAdd={() => setModalType('FILE')} />}
         {activeTab === 'QA' && <QATab project={project} onAdd={() => setModalType('QA')} />}
         {activeTab === 'Change Requests' && <ChangeRequestTab project={project} onAdd={() => setModalType('CHANGE')} />}
         {activeTab === 'Issues' && <IssuesTab project={project} onAdd={() => setModalType('ISSUE')} />}
         {activeTab === 'Budget' && <BudgetTab project={project} />}
         {activeTab === 'Risks' && <RisksTab project={project} />}
      </div>

      {/* Governance Modal */}
      <Modal isOpen={!!modalType} onClose={() => setModalType(null)} title={`New ${modalType} protocol`}>
         <form onSubmit={handleGovernanceSubmit} className="space-y-6">
            {modalType === 'STAKEHOLDER' && (
               <>
                  <Input label="Name" value={modalData.name} onChange={v => setModalData({...modalData, name: v})} />
                  <Input label="Organization" value={modalData.organization} onChange={v => setModalData({...modalData, organization: v})} />
                  <div className="grid grid-cols-2 gap-4">
                     <Select label="Influence" options={['LOW', 'MEDIUM', 'HIGH']} value={modalData.influence} onChange={v => setModalData({...modalData, influence: v})} />
                     <Select label="Interest" options={['LOW', 'MEDIUM', 'HIGH']} value={modalData.interest} onChange={v => setModalData({...modalData, interest: v})} />
                  </div>
                  <Input label="Contact / Prefs" value={modalData.preferences} onChange={v => setModalData({...modalData, preferences: v})} />
               </>
            )}
            {modalType === 'DECISION' && (
               <>
                  <Input label="Decision Title" value={modalData.title} onChange={v => setModalData({...modalData, title: v})} />
                  <Textarea label="Context" value={modalData.context} onChange={v => setModalData({...modalData, context: v})} />
                  <Textarea label="Final Outcome" value={modalData.outcome} onChange={v => setModalData({...modalData, outcome: v})} />
               </>
            )}
            {modalType === 'ISSUE' && (
               <>
                  <Input label="Blocker Headline" value={modalData.title} onChange={v => setModalData({...modalData, title: v})} />
                  <Select label="Severity" options={['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']} value={modalData.severity} onChange={v => setModalData({...modalData, severity: v})} />
                  <Textarea label="Description" value={modalData.description} onChange={v => setModalData({...modalData, description: v})} />
               </>
            )}
            <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl">Commit to Strategy</button>
         </form>
      </Modal>

      {/* Task Modal remains... */}
      <Modal isOpen={showTaskModal} onClose={() => setShowTaskModal(false)} title="Configure Tactical Mission">
         <form onSubmit={handleAddTask} className="space-y-6">
            <div className="space-y-2">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Task Headline</label>
               <input
                 required
                 className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-bold focus:border-blue-500 transition-all"
                 placeholder="Define the specific deliverable..."
                 value={taskData.title}
                 onChange={e => setTaskData({...taskData, title: e.target.value})}
               />
            </div>
            <div className="space-y-2">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Context / Description</label>
               <textarea
                 className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-medium focus:border-blue-500 transition-all"
                 placeholder="Provide technical context or requirements..."
                 rows="3"
                 value={taskData.description}
                 onChange={e => setTaskData({...taskData, description: e.target.value})}
               />
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Personnel Assignment</label>
                  <select
                    required
                    className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none"
                    value={taskData.assignedTo}
                    onChange={e => setTaskData({...taskData, assignedTo: e.target.value})}
                  >
                     <option value="">Select Specialist</option>
                     {employees.filter(e => e && e._id).map(emp => (
                       <option key={emp._id} value={emp._id}>{emp.name || 'Unknown'} ({emp.designation || emp.role || 'Personnel'})</option>
                     ))}
                  </select>
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Protocol Deadline</label>
                  <input
                    type="date"
                    required
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-bold"
                    value={taskData.dueDate}
                    onChange={e => setTaskData({...taskData, dueDate: e.target.value})}
                  />
               </div>
            </div>
            <div className="space-y-2">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Strategic Priority</label>
               <div className="flex gap-2">
                  {['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map(lvl => (
                    <button key={lvl} type="button" onClick={() => setTaskData({...taskData, priority: lvl})} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${taskData.priority === lvl ? 'bg-slate-900 text-white border-slate-900 shadow-lg' : 'bg-white text-slate-400 border-slate-200 hover:border-blue-400'}`}>
                       {lvl}
                    </button>
                  ))}
               </div>
            </div>
            <div className="space-y-4 pt-4 border-t border-slate-100">
               <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Protocol Breakdown</label>
                  <button type="button" onClick={handleAddSubtask} className="text-[10px] font-black text-blue-600 uppercase flex items-center gap-1 hover:underline">
                     <Plus size={14} /> Add Segment
                  </button>
               </div>
               <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                  {(taskData.subtasks || []).map((st, idx) => (
                    <div key={idx} className="flex gap-2">
                       <input className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-xs font-bold" placeholder={`Step ${idx+1}...`} value={st.title || ''} onChange={e => updateSubtask(idx, e.target.value)} />
                       <button type="button" onClick={() => removeSubtask(idx)} className="p-3 text-slate-300 hover:text-red-500"><Trash2 size={16}/></button>
                    </div>
                  ))}
               </div>
            </div>
            <div className="flex gap-4 pt-6">
               <button type="button" onClick={() => setShowTaskModal(false)} className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all">Abort</button>
               <button type="submit" disabled={isSaving} className="flex-1 py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 active:scale-95 transition-all">
                  {isSaving ? 'Initializing...' : 'Deploy Protocol'}
               </button>
            </div>
         </form>
      </Modal>

    </div>
  );
};

const Input = ({ label, value, onChange }) => (
  <div className="space-y-1.5">
     <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
     <input className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-bold focus:border-blue-500" value={value || ''} onChange={e => onChange(e.target.value)} />
  </div>
);

const Textarea = ({ label, value, onChange }) => (
  <div className="space-y-1.5">
     <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
     <textarea rows="3" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-medium focus:border-blue-500" value={value || ''} onChange={e => onChange(e.target.value)} />
  </div>
);

const Select = ({ label, options, value, onChange }) => (
  <div className="space-y-1.5">
     <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
     <select className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none" value={value || ''} onChange={e => onChange(e.target.value)}>
        <option value="">Select</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
     </select>
  </div>
);

export default ProjectWorkspace;
