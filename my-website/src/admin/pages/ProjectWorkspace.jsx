import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Folder, Users, Target, Layout, CheckCircle2, Clock, AlertTriangle,
  DollarSign as DollarIcon, Activity, FileText, ChevronRight, ArrowLeft, MoreVertical,
  Plus, Search, Filter, Edit2, Zap, Calendar, TrendingUp, Trash2, X
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { apiFetch } from '../../utils/api';
import Modal from '../components/Modal';

const ProjectWorkspace = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Overview');
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    assignedTo: '',
    priority: 'MEDIUM',
    dueDate: '',
    subtasks: []
  });

  const tabs = [
    'Overview', 'Requirements', 'Scope', 'Tasks', 'Milestones', 'Team', 'Budget', 'Risks', 'Activity'
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
                 }`}>{project.status || 'DRAFT'}</span>
              </div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-tighter">{project.client} • {project.code}</p>
           </div>
        </div>

        <div className="flex items-center gap-3">
           <button onClick={() => navigate(`/admin/projects/edit/${id}`)} className="flex items-center gap-2 bg-white px-6 py-3.5 rounded-2xl text-[10px] font-black uppercase border border-slate-200 hover:bg-slate-50 transition-all">
              <Edit2 size={14} /> Refine Strategy
           </button>
           <button
             onClick={() => setShowTaskModal(true)}
             className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all"
           >
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
         {activeTab === 'Overview' && <OverviewTab project={project} tasks={tasks} />}
         {activeTab === 'Requirements' && <RequirementsTab project={project} />}
         {activeTab === 'Scope' && <ScopeTab project={project} />}
         {activeTab === 'Budget' && <BudgetTab project={project} />}
         {activeTab === 'Team' && <TeamTab project={project} />}
         {activeTab === 'Tasks' && <TasksTab tasks={tasks} />}
         {activeTab === 'Milestones' && <MilestonesTab project={project} />}
         {activeTab === 'Risks' && <RisksTab project={project} />}
         {activeTab === 'Activity' && <ActivityTab project={project} />}
      </div>

      {/* Add Task Modal */}
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
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setTaskData({...taskData, priority: lvl})}
                      className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                        taskData.priority === lvl ? 'bg-slate-900 text-white border-slate-900 shadow-lg' : 'bg-white text-slate-400 border-slate-200 hover:border-blue-400'
                      }`}
                    >
                       {lvl}
                    </button>
                  ))}
               </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-100">
               <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Protocol Breakdown (Steps)</label>
                  <button type="button" onClick={handleAddSubtask} className="text-[10px] font-black text-blue-600 uppercase flex items-center gap-1 hover:underline">
                     <Plus size={14} /> Add Segment
                  </button>
               </div>
               <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                  {(taskData.subtasks || []).map((st, idx) => (
                    <div key={idx} className="flex gap-2 animate-in slide-in-from-top-2 duration-200">
                       <input
                         className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-xs font-bold focus:border-blue-500"
                         placeholder={`Execution Step ${idx+1}...`}
                         value={st.title || ''}
                         onChange={e => updateSubtask(idx, e.target.value)}
                       />
                       <button type="button" onClick={() => removeSubtask(idx)} className="p-3 text-slate-300 hover:text-red-500 transition-colors">
                          <Trash2 size={16}/>
                       </button>
                    </div>
                  ))}
                  {taskData.subtasks.length === 0 && (
                    <div className="text-center py-6 border-2 border-dashed border-slate-100 rounded-2xl">
                       <p className="text-[10px] font-bold text-slate-300 uppercase">No segments defined</p>
                    </div>
                  )}
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

// Tabs Components
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
          <div className="bg-white rounded-[2.5rem] border border-slate-200/60 p-10">
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
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
             <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
             <h3 className="text-lg font-black uppercase mb-6 flex items-center gap-2"><Activity className="text-emerald-400" /> Strategic Health</h3>
             <div className="space-y-6">
                <HealthRow label="Schedule Adherence" val={project?.health === 'ON_TRACK' ? '100%' : '75%'} />
                <HealthRow label="Budget Discipline" val="100%" />
                <HealthRow label="Task Velocity" val={safeTasks.length ? `${Math.round((completedTasks/safeTasks.length)*100)}%` : '0%'} />
             </div>
          </div>
          <div className="bg-white rounded-[2.5rem] border border-slate-200/60 p-8">
             <h3 className="text-lg font-black text-slate-900 uppercase mb-6">Execution Squad</h3>
             <div className="space-y-4">
                {safeTeam.filter(m => m).map((mem, i) => (
                  <div key={i} className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400">
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

const RequirementsTab = ({ project }) => {
  const safeReqs = Array.isArray(project?.requirements) ? project.requirements : [];

  return (
    <div className="bg-white rounded-[3rem] border border-slate-200/60 p-10">
       <h3 className="text-xl font-black text-slate-900 uppercase mb-10">Requirement Traceability</h3>
       <div className="space-y-4">
          {safeReqs.filter(r => r).map((req, i) => (
            <div key={i} className="p-6 bg-slate-50 border border-slate-100 rounded-3xl flex items-center justify-between group hover:bg-white hover:border-blue-200 transition-all">
               <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${
                     req.priority === 'CRITICAL' ? 'bg-rose-100 text-rose-600' : 'bg-blue-100 text-blue-600'
                  }`}>{i+1}</div>
                  <div>
                     <h4 className="font-black text-slate-900 leading-none mb-1">{req.title || 'Untitled Requirement'}</h4>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{req.type || 'FUNCTIONAL'} • {req.priority || 'MEDIUM'} PRIORITY</p>
                  </div>
               </div>
               <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[9px] font-black uppercase text-slate-400">{req.status || 'PENDING'}</span>
            </div>
          ))}
          {safeReqs.length === 0 && <div className="text-center py-20 opacity-20"><Target size={48} className="mx-auto mb-2"/><p className="text-xs font-black uppercase">No requirements defined</p></div>}
       </div>
    </div>
  );
};

const ScopeTab = ({ project }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
     <div className="bg-white rounded-[3rem] border border-slate-200/60 p-10">
        <h3 className="text-lg font-black text-blue-600 uppercase mb-8">In-Scope Deliverables</h3>
        <div className="space-y-4">
           {(project.inScope || []).filter(s => s && s.trim() !== '').map((s, i) => (
             <div key={i} className="flex items-center gap-3 p-4 bg-blue-50/50 rounded-2xl border border-blue-100 text-xs font-bold text-blue-900">
                <CheckCircle2 size={16} className="text-blue-500" /> {s}
             </div>
           ))}
           {(!project.inScope || project.inScope.filter(s => s && s.trim() !== '').length === 0) && <p className="text-xs text-slate-400 italic">No in-scope items defined</p>}
        </div>
     </div>
     <div className="bg-white rounded-[3rem] border border-slate-200/60 p-10">
        <h3 className="text-lg font-black text-slate-400 uppercase mb-8">Exclusion Boundaries</h3>
        <div className="space-y-4">
           {(project.outOfScope || []).filter(s => s && s.trim() !== '').map((s, i) => (
             <div key={i} className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs font-bold text-slate-500">
                <Zap size={16} className="text-slate-300" /> {s}
             </div>
           ))}
           {(!project.outOfScope || project.outOfScope.filter(s => s && s.trim() !== '').length === 0) && <p className="text-xs text-slate-400 italic">No exclusions defined</p>}
        </div>
     </div>
  </div>
);

const TasksTab = ({ tasks = [] }) => {
  const safeTasks = Array.isArray(tasks) ? tasks : [];

  return (
    <div className="bg-white rounded-[3rem] border border-slate-200/60 p-10">
       <div className="flex justify-between items-center mb-10">
          <h3 className="text-xl font-black text-slate-900 uppercase">Strategic Tasks</h3>
       </div>
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {safeTasks.filter(t => t).map(task => (
            <div key={task._id} className="p-6 bg-slate-50 border border-slate-100 rounded-[2rem] space-y-4">
               <div className="flex justify-between items-start">
                  <span className={`px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase ${
                    task.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                  }`}>{task.status || 'TODO'}</span>
                  <span className="text-[10px] font-black text-slate-400 uppercase">{task.priority || 'MEDIUM'}</span>
               </div>
               <h4 className="font-black text-slate-900">{task.title || 'Untitled Task'}</h4>
               <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">{task.assignedTo?.name || 'Unassigned'}</span>
                  <span className="text-[10px] font-black text-slate-900">{task.progress || 0}%</span>
               </div>
            </div>
          ))}
          {safeTasks.length === 0 && <div className="col-span-full text-center py-20 opacity-20"><Zap size={48} className="mx-auto mb-2"/><p className="text-xs font-black uppercase">No tasks created yet</p></div>}
       </div>
    </div>
  );
};

const BudgetTab = ({ project }) => {
  const breakdown = project?.budget?.breakdown || {};
  return (
     <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-[3rem] border border-slate-200/60 p-10">
           <h3 className="text-xl font-black text-slate-900 uppercase mb-10">Investment Breakdown</h3>
           <div className="grid grid-cols-2 gap-8">
              <BudgetItem label="Human Capital" val={breakdown.employee} color="blue" />
              <BudgetItem label="Infrastructure" val={breakdown.infrastructure} color="indigo" />
              <BudgetItem label="Software" val={breakdown.software} color="purple" />
              <BudgetItem label="Contingency" val={breakdown.contingency} color="rose" />
           </div>
        </div>
        <div className="p-10 bg-slate-900 rounded-[3rem] text-white flex flex-col justify-center text-center relative overflow-hidden shadow-2xl">
           <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
           <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2">Total Strategy Value</p>
           <h4 className="text-4xl font-black mb-2">Rs. {(Number(project?.budget?.total || project?.budget || 0)).toLocaleString()}</h4>
        </div>
     </div>
  );
};

const TeamTab = ({ project }) => {
  const safeTeam = Array.isArray(project?.team) ? project.team : [];

  return (
    <div className="bg-white rounded-[3rem] border border-slate-200/60 p-10">
       <div className="flex justify-between items-center mb-10">
          <h3 className="text-xl font-black text-slate-900 uppercase">Execution Squad</h3>
       </div>
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {safeTeam.filter(m => m).map((mem, i) => (
            <div key={i} className="p-8 bg-slate-50 border border-slate-100 rounded-[2.5rem] flex items-center gap-6 group hover:bg-white hover:border-blue-200 transition-all hover:shadow-xl hover:shadow-blue-500/5">
               <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-xl font-black text-white shadow-lg">
                  {mem.user?.name?.charAt(0) || '?'}
               </div>
               <div>
                  <h4 className="text-lg font-black text-slate-900 leading-tight mb-1">{mem.user?.name || 'Unknown Specialist'}</h4>
                  <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-3">{mem.role || 'Project Specialist'}</p>
                  <div className="flex items-center gap-4">
                     <div className="flex items-center gap-1.5">
                        <Activity size={12} className="text-slate-400" />
                        <span className="text-[10px] font-black text-slate-400 uppercase">{mem.allocation || 100}% Allocation</span>
                     </div>
                  </div>
               </div>
            </div>
          ))}
          {safeTeam.length === 0 && <div className="col-span-full text-center py-20 opacity-20"><Users size={48} className="mx-auto mb-2"/><p className="text-xs font-black uppercase">No squad members assigned</p></div>}
       </div>
    </div>
  );
};

const MilestonesTab = ({ project }) => {
  const safeMilestones = Array.isArray(project?.milestones) ? project.milestones : [];

  return (
    <div className="bg-white rounded-[3rem] border border-slate-200/60 p-10">
       <h3 className="text-xl font-black text-slate-900 uppercase mb-10">Project Milestones</h3>
       <div className="space-y-6 relative before:absolute before:left-8 before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-100">
          {safeMilestones.map((ms, i) => (
            <div key={i} className="relative pl-20 flex items-center group">
               <div className={`absolute left-5 w-6 h-6 rounded-full border-4 border-white shadow-sm z-10 transition-colors ${
                  ms.status === 'COMPLETED' ? 'bg-emerald-500' : 'bg-slate-200 group-hover:bg-blue-500'
               }`}></div>
               <div className="flex-1 p-6 bg-slate-50 border border-slate-100 rounded-3xl group-hover:bg-white group-hover:border-blue-200 transition-all group-hover:shadow-lg">
                  <div className="flex justify-between items-start mb-2">
                     <h4 className="font-black text-slate-900">{ms.title || 'Strategic Milestone'}</h4>
                     <span className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${
                        ms.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                     }`}>{ms.status || 'UPCOMING'}</span>
                  </div>
                  <p className="text-xs font-medium text-slate-500 line-clamp-2">{ms.description}</p>
                  <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-100">
                     <div className="flex items-center gap-1.5 text-slate-400">
                        <Calendar size={12} />
                        <span className="text-[10px] font-bold uppercase">{ms.dueDate ? new Date(ms.dueDate).toLocaleDateString() : 'TBD'}</span>
                     </div>
                     <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600" style={{ width: `${ms.progress || 0}%` }}></div>
                     </div>
                     <span className="text-[10px] font-black text-slate-900">{ms.progress || 0}%</span>
                  </div>
               </div>
            </div>
          ))}
          {safeMilestones.length === 0 && <div className="text-center py-20 opacity-20"><Calendar size={48} className="mx-auto mb-2"/><p className="text-xs font-black uppercase">No milestones defined</p></div>}
       </div>
    </div>
  );
};

const RisksTab = ({ project }) => {
  const safeRisks = Array.isArray(project?.risks) ? project.risks : [];

  return (
    <div className="bg-white rounded-[3rem] border border-slate-200/60 p-10">
       <h3 className="text-xl font-black text-slate-900 uppercase mb-10">Risk Management Matrix</h3>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {safeRisks.map((risk, i) => (
            <div key={i} className="p-8 bg-slate-50 border border-slate-100 rounded-[2.5rem] space-y-6">
               <div className="flex justify-between items-start">
                  <div className={`p-2 rounded-xl ${
                     risk.impact === 'CRITICAL' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'
                  }`}><AlertTriangle size={20} /></div>
                  <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                     risk.impact === 'CRITICAL' ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                  }`}>{risk.impact} IMPACT</span>
               </div>
               <div>
                  <h4 className="text-lg font-black text-slate-900 leading-tight mb-2">{risk.title || 'Operational Risk'}</h4>
                  <p className="text-xs font-medium text-slate-500 leading-relaxed">{risk.mitigationPlan}</p>
               </div>
               <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200">
                  <div>
                     <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Probability</p>
                     <p className="text-xs font-black text-slate-700">{risk.probability || 'MEDIUM'}</p>
                  </div>
                  <div>
                     <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Category</p>
                     <p className="text-xs font-black text-slate-700">{risk.category || 'TECHNICAL'}</p>
                  </div>
               </div>
            </div>
          ))}
          {safeRisks.length === 0 && <div className="col-span-full text-center py-20 opacity-20"><AlertTriangle size={48} className="mx-auto mb-2"/><p className="text-xs font-black uppercase">No active risks identified</p></div>}
       </div>
    </div>
  );
};

const ActivityTab = ({ project }) => {
  return (
    <div className="bg-white rounded-[3rem] border border-slate-200/60 p-10">
       <h3 className="text-xl font-black text-slate-900 uppercase mb-10">Project Intelligence Feed</h3>
       <div className="space-y-8">
          <ActivityItem
            user={project?.manager?.name || 'System'}
            action="Protocol Initialized"
            detail={`Project ${project.name} successfully deployed to RCS ecosystem.`}
            time={new Date(project.createdAt).toLocaleString()}
          />
          <ActivityItem
            user="RCS Engine"
            action="Infrastructure Synced"
            detail="Strategic workspace linked to personnel and financial modules."
            time={new Date(project.updatedAt).toLocaleString()}
          />
       </div>
    </div>
  );
};

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
     <h4 className={`text-lg font-black text-${color}-600`}>Rs. {(Number(val || 0)).toLocaleString()}</h4>
  </div>
);

const CurrencySign = ({ size, className }) => <span className={className} style={{fontSize: size}}>Rs.</span>;

export default ProjectWorkspace;
