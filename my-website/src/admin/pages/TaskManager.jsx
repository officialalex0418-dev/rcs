import React, { useState, useEffect } from 'react';
import {
  Plus, Search, Calendar, CheckCircle2, Clock, Users, ArrowUpRight,
  Filter, ListChecks, Trash2, X, Save, ShieldCheck,
  BarChart3, Activity, FileText, ExternalLink, AlertCircle, Eye, ThumbsUp, ThumbsDown, MessageCircle
} from 'lucide-react';
import Modal from '../components/Modal';

const StatBox = ({ icon: Icon, label, value, sub, color }) => {
  const colors = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100 shadow-blue-500/5',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-emerald-500/5',
    red: 'bg-red-50 text-red-600 border-red-100 shadow-red-500/5',
    purple: 'bg-purple-50 text-purple-600 border-purple-100 shadow-purple-500/5'
  };
  return (
    <div className={`bg-white p-6 rounded-[2rem] border shadow-sm flex flex-col items-center text-center group hover:scale-105 transition-all ${colors[color] || colors.blue}`}>
       <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-all ${colors[color] || colors.blue} border-2`}>
          {Icon && <Icon size={24} />}
       </div>
       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 group-hover:text-slate-900 transition-colors">{label}</p>
       <h3 className="text-2xl font-black text-slate-900 mb-1">{value}</h3>
       <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter italic">{sub}</p>
    </div>
  );
};

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [reviewTask, setReviewTask] = useState(null);
  const [adminComment, setAdminComment] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM',
    dueDate: '',
    assignedTo: '',
    subtasks: []
  });

  const fetchEmployees = async () => {
    try {
      const backendUrl = 'https://rcs-ajbn.onrender.com';
      const token = localStorage.getItem('rcs_admin_token');
      const response = await fetch(`${backendUrl}/api/employees`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) setEmployees(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      console.error('Failed to fetch employees:', err);
    }
  };

  const fetchTasks = async () => {
    try {
      const backendUrl = 'https://rcs-ajbn.onrender.com';
      const token = localStorage.getItem('rcs_admin_token');
      const response = await fetch(`${backendUrl}/api/tasks`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) setTasks(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchEmployees();
  }, []);

  const handleAddSubtask = () => {
    setFormData({
      ...formData,
      subtasks: [...formData.subtasks, { title: '', completed: false }]
    });
  };

  const updateSubtask = (index, val) => {
    const newSubtasks = [...formData.subtasks];
    newSubtasks[index].title = val;
    setFormData({ ...formData, subtasks: newSubtasks });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const backendUrl = 'https://rcs-ajbn.onrender.com';
      const token = localStorage.getItem('rcs_admin_token');
      const url = editingTask ? `${backendUrl}/api/tasks/${editingTask._id}` : `${backendUrl}/api/tasks`;
      const method = editingTask ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setShowModal(false);
        setEditingTask(null);
        setFormData({ title: '', description: '', priority: 'MEDIUM', dueDate: '', assignedTo: '', subtasks: [] });
        fetchTasks();
      }
    } catch (err) {
      console.error('Failed to save task:', err);
    }
  };

  const handleReviewAction = async (status) => {
    try {
      const backendUrl = 'https://rcs-ajbn.onrender.com';
      const token = localStorage.getItem('rcs_admin_token');

      const payload = {
        status,
        adminComment,
        subtasks: reviewTask.subtasks
      };

      const response = await fetch(`${backendUrl}/api/tasks/${reviewTask._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setReviewTask(null);
        setAdminComment('');
        fetchTasks();
      }
    } catch (err) {
      console.error('Review failed:', err);
    }
  };

  const toggleReviewSubtask = (idx) => {
    const newSubtasks = [...reviewTask.subtasks];
    newSubtasks[idx].completed = !newSubtasks[idx].completed;
    setReviewTask({ ...reviewTask, subtasks: newSubtasks });
  };

  const deleteTask = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      const backendUrl = 'https://rcs-ajbn.onrender.com';
      const token = localStorage.getItem('rcs_admin_token');
      await fetch(`${backendUrl}/api/tasks/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchTasks();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  // Stats Calculation
  const totalTasks = tasks?.length || 0;
  const completedTasks = tasks?.filter(t => t?.status === 'COMPLETED').length || 0;
  const inReviewTasks = tasks?.filter(t => t?.status === 'IN_REVIEW').length || 0;
  const highPriority = tasks?.filter(t => t?.priority === 'CRITICAL' || t?.priority === 'HIGH').length || 0;
  const avgProgress = totalTasks ? Math.round(tasks.reduce((acc, t) => acc + (t?.progress || 0), 0) / totalTasks) : 0;

  return (
    <div className="p-8 bg-slate-50 min-h-screen font-sans space-y-10">

      {/* Dashboard Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         <StatBox icon={Activity} label="Task Volume" value={totalTasks} sub="Active Protocol" color="blue" />
         <StatBox icon={ShieldCheck} label="Approved" value={completedTasks} sub="Verification Done" color="emerald" />
         <StatBox icon={Eye} label="In Review" value={inReviewTasks} sub="Waiting Approval" color="purple" />
         <StatBox icon={BarChart3} label="Avg Progress" value={`${avgProgress}%`} sub="Engine Efficiency" color="blue" />
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Task Orchestration</h1>
          <p className="text-slate-500 font-medium italic">Manage workflows, approve completions, and provide feedback.</p>
        </div>
        <button
          onClick={() => {
            setEditingTask(null);
            setFormData({title: '', description: '', priority: 'MEDIUM', dueDate: '', assignedTo: '', subtasks: []});
            setShowModal(true);
          }}
          className="flex items-center gap-3 bg-slate-900 px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-white hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/10"
        >
          <Plus size={18} />
          Deploy New Module
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
           <div className="col-span-full py-20 text-center font-bold text-slate-400 uppercase tracking-widest text-xs">Synchronizing Task Engine...</div>
        ) : (tasks || []).length === 0 ? (
           <div className="col-span-full py-20 text-center font-bold text-slate-400 uppercase tracking-widest text-xs">No active tasks found in the system</div>
        ) : tasks.map((task) => (
          <div key={task?._id} className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200/60 p-8 hover:border-blue-500/30 transition-all group relative overflow-hidden flex flex-col">
            <div className="flex justify-between items-start mb-6 relative z-10">
              <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${
                task?.status === 'IN_REVIEW' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                task?.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                'bg-blue-50 text-blue-600 border-blue-100'
              }`}>
                {task?.status?.replace('_', ' ')}
              </span>
              <div className="flex items-center gap-2">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{task?.progress}%</p>
                 <div className={`p-1.5 rounded-lg ${task?.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
                    {task?.status === 'COMPLETED' ? <ShieldCheck size={16} /> : <Clock size={16} />}
                 </div>
              </div>
            </div>

            <h3 className="text-xl font-black text-slate-900 mb-2 leading-tight group-hover:text-blue-600 transition-colors relative z-10">{task?.title}</h3>

            {task.adminComment && (
              <div className="bg-amber-50 p-4 rounded-2xl mb-4 border border-amber-100">
                <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1 flex items-center gap-1"><MessageCircle size={10}/> Admin Feedback</p>
                <p className="text-[11px] text-amber-800 font-medium italic">"{task.adminComment}"</p>
              </div>
            )}

            <div className="space-y-2 mb-8 relative z-10 flex-1">
               {(task?.subtasks || []).slice(0, 3).map((st, i) => (
                 <div key={i} className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-md border-2 flex items-center justify-center ${st?.completed ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-200'}`}>
                       {st?.completed && <CheckCircle2 size={10} />}
                    </div>
                    <span className={`text-[10px] font-bold ${st?.completed ? 'text-slate-300 line-through' : 'text-slate-500'}`}>{st?.title}</span>
                 </div>
               ))}
               {(task?.subtasks?.length || 0) > 3 && <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest pl-7">+ {(task?.subtasks?.length || 0) - 3} More Steps</p>}
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-slate-100 relative z-10 mt-auto">
               <div className="flex items-center gap-2">
                 <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200">
                    {task?.assignedTo?.profilePicture ?
                      <img src={task.assignedTo.profilePicture} className="w-full h-full object-cover" alt="User" /> :
                      <span className="text-[10px] font-black text-slate-400 uppercase">{task?.assignedTo?.name?.charAt(0) || '?'}</span>
                    }
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-slate-900 leading-none mb-0.5">{task?.assignedTo?.name || 'Unassigned'}</p>
                    <p className="text-[8px] font-bold text-slate-400 uppercase">Personnel</p>
                 </div>
               </div>

               <div className="flex items-center gap-2">
                  {(task?.status === 'IN_REVIEW' || task?.status === 'COMPLETED') && (
                    <button onClick={() => setReviewTask(task)} className="p-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-600 hover:text-white transition-all flex items-center gap-1">
                       <Eye size={14} /> <span className="text-[9px] font-black uppercase">Review & Control</span>
                    </button>
                  )}
                  {task?.outputScreenshot && (
                    <a href={task.outputScreenshot} target="_blank" rel="noreferrer" className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all">
                       <ExternalLink size={14} />
                    </a>
                  )}
                  <button onClick={() => deleteTask(task?._id)} className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-600 hover:text-white transition-all">
                     <Trash2 size={14} />
                  </button>
               </div>
            </div>
          </div>
        ))}
      </div>

      {/* Review Modal */}
      <Modal isOpen={!!reviewTask} onClose={() => setReviewTask(null)} title="Examine Task Output">
         {reviewTask && (
           <div className="space-y-6">
              <div className="aspect-video bg-slate-100 rounded-3xl overflow-hidden border border-slate-200">
                 {reviewTask.outputScreenshot ? (
                   <img src={reviewTask.outputScreenshot} className="w-full h-full object-contain" alt="Work proof" />
                 ) : (
                   <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                      <FileText size={48} className="mb-2 opacity-20" />
                      <p className="text-[10px] font-black uppercase">No visual proof attached</p>
                   </div>
                 )}
              </div>

              <div className="space-y-4">
                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Verify Deliverables</h4>
                 <div className="space-y-2">
                    {reviewTask.subtasks.map((st, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group">
                         <span className={`text-xs font-bold ${st.completed ? 'text-slate-900' : 'text-slate-400'}`}>{st.title}</span>
                         <button
                           onClick={() => toggleReviewSubtask(i)}
                           className={`p-1.5 rounded-lg transition-all ${st.completed ? 'bg-emerald-500 text-white' : 'bg-white text-slate-300 border border-slate-200'}`}
                         >
                            <CheckCircle2 size={14} />
                         </button>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Admin Instructions / Comment</label>
                 <textarea
                   className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-medium focus:border-purple-500 transition-all"
                   placeholder="Provide feedback for the employee..."
                   rows="3"
                   value={adminComment}
                   onChange={e => setAdminComment(e.target.value)}
                 />
              </div>

              <div className="flex gap-4 pt-4">
                 <button
                   onClick={() => handleReviewAction('REJECTED')}
                   className="flex-1 flex items-center justify-center gap-2 py-4 bg-red-50 text-red-600 rounded-2xl text-[10px] font-black uppercase hover:bg-red-600 hover:text-white transition-all border border-red-100"
                 >
                    <ThumbsDown size={14} /> Reject & Reset
                 </button>
                 <button
                   onClick={() => handleReviewAction('IN_PROGRESS')}
                   className="flex-1 flex items-center justify-center gap-2 py-4 bg-amber-50 text-amber-600 rounded-2xl text-[10px] font-black uppercase hover:bg-amber-600 hover:text-white transition-all border border-amber-100"
                 >
                    <Clock size={14} /> Partial Review
                 </button>
                 <button
                   onClick={() => handleReviewAction('COMPLETED')}
                   className="flex-1 flex items-center justify-center gap-2 py-4 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-500/20"
                 >
                    <ThumbsUp size={14} /> Approve Task
                 </button>
              </div>
           </div>
         )}
      </Modal>

      {/* Deploy Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Configure Task Protocol">
         <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1.5">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Task Objective</label>
               <input required className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-bold focus:border-blue-500 transition-all" placeholder="What needs to be achieved?" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            </div>

            <div className="space-y-1.5">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Context / Instructions</label>
               <textarea rows="3" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-medium focus:border-blue-500 transition-all" placeholder="Provide detailed steps or context..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Assign Personnel</label>
                  <select required className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none" value={formData.assignedTo} onChange={e => setFormData({...formData, assignedTo: e.target.value})}>
                    <option value="">Select Employee</option>
                    {(employees || []).map(emp => <option key={emp?._id} value={emp?._id}>{emp?.name}</option>)}
                  </select>
               </div>
               <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Protocol Deadline</label>
                  <input type="date" required className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-bold" value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} />
               </div>
            </div>

            <div className="space-y-1.5">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Priority Classification</label>
               <div className="flex gap-2">
                  {['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map(lvl => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setFormData({...formData, priority: lvl})}
                      className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${formData.priority === lvl ? 'bg-slate-900 text-white border-slate-900 shadow-lg' : 'bg-white text-slate-400 border-slate-200 hover:border-blue-400'}`}
                    >
                      {lvl}
                    </button>
                  ))}
               </div>
            </div>

            <div className="space-y-4">
               <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Breakdown Sub-tasks</label>
                  <button type="button" onClick={handleAddSubtask} className="text-[10px] font-black text-blue-600 uppercase flex items-center gap-1 hover:underline"><Plus size={14} /> Add Step</button>
               </div>
               <div className="space-y-2">
                  {(formData?.subtasks || []).map((st, idx) => (
                    <div key={idx} className="flex gap-2">
                       <input className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-xs font-bold" placeholder={`Step ${idx+1} detail...`} value={st?.title} onChange={e => updateSubtask(idx, e.target.value)} />
                       <button type="button" onClick={() => setFormData({...formData, subtasks: formData.subtasks.filter((_, i) => i !== idx)})} className="p-3 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                    </div>
                  ))}
               </div>
            </div>

            <div className="flex gap-4 pt-6">
               <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all">Abort</button>
               <button type="submit" className="flex-1 py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 active:scale-95 transition-all">Deploy Task</button>
            </div>
         </form>
      </Modal>
    </div>
  );
};

export default TaskManager;
