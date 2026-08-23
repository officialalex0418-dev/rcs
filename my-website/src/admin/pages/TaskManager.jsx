import React, { useState, useEffect } from 'react';
import { Plus, Search, Calendar, CheckCircle2, Clock, Users, ArrowUpRight, Filter, ListChecks, Trash2, X, Save, ShieldCheck } from 'lucide-react';

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM',
    dueDate: '',
    subtasks: []
  });

  const fetchTasks = async () => {
    try {
      const backendUrl = import.meta.env.VITE_API_URL || '';
      const token = localStorage.getItem('rcs_admin_token');
      const response = await fetch(`${backendUrl}/api/tasks`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) setTasks(data.data);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
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

  const toggleSubtask = async (taskId, subtaskIndex) => {
    const task = tasks.find(t => t._id === taskId);
    if (!task) return;

    const updatedSubtasks = [...task.subtasks];
    updatedSubtasks[subtaskIndex].completed = !updatedSubtasks[subtaskIndex].completed;

    try {
      const backendUrl = import.meta.env.VITE_API_URL || '';
      const token = localStorage.getItem('rcs_admin_token');
      await fetch(`${backendUrl}/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ subtasks: updatedSubtasks })
      });
      fetchTasks();
    } catch (err) {
      console.error('Failed to toggle subtask:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const backendUrl = import.meta.env.VITE_API_URL || '';
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
        setFormData({ title: '', description: '', priority: 'MEDIUM', dueDate: '', subtasks: [] });
        fetchTasks();
      }
    } catch (err) {
      console.error('Failed to save task:', err);
    }
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen font-sans">
      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[1000] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
             <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h2 className="text-xl font-black text-slate-900 tracking-tight">Configure Task Protocol</h2>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all"><X size={20} /></button>
             </div>

             <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                <div className="space-y-1.5">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Task Objective</label>
                   <input required className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-bold" placeholder="What needs to be achieved?" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Priority Level</label>
                      <select className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none" value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})}>
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
                        <option value="CRITICAL">Critical</option>
                      </select>
                   </div>
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Deadline</label>
                      <input type="date" required className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-bold" value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} />
                   </div>
                </div>

                <div className="space-y-4">
                   <div className="flex justify-between items-center">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Breakdown Sub-tasks</label>
                      <button type="button" onClick={handleAddSubtask} className="text-[10px] font-black text-blue-600 uppercase flex items-center gap-1 hover:underline">
                         <Plus size={14} /> Add Step
                      </button>
                   </div>
                   <div className="space-y-3">
                      {formData.subtasks.map((st, idx) => (
                        <div key={idx} className="flex gap-2 items-center">
                           <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-[10px] font-black flex-shrink-0">{idx + 1}</div>
                           <input
                             className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-medium"
                             placeholder="Action item..."
                             value={st.title}
                             onChange={e => updateSubtask(idx, e.target.value)}
                           />
                           <button type="button" onClick={() => setFormData({...formData, subtasks: formData.subtasks.filter((_, i) => i !== idx)})} className="p-2 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                        </div>
                      ))}
                   </div>
                </div>

                <div className="flex justify-end gap-3 pt-6">
                   <button type="button" onClick={() => setShowModal(false)} className="px-8 py-4 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors">Discard</button>
                   <button type="submit" className="flex items-center gap-2 bg-slate-900 text-white px-10 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/10"><Save size={16} /> Deploy Task</button>
                </div>
             </form>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Task Orchestration</h1>
          <p className="text-slate-500 font-medium">Assign detailed workflows with sub-task tracking.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-blue-600 px-5 py-2.5 rounded-xl text-sm font-bold text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20">
          <Plus size={18} />
          Create New Module
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
           <div className="col-span-full py-20 text-center font-bold text-slate-400 uppercase tracking-widest text-xs">Synchronizing Task Engine...</div>
        ) : tasks.length === 0 ? (
           <div className="col-span-full py-20 text-center font-bold text-slate-400 uppercase tracking-widest text-xs">No active tasks found in the system</div>
        ) : tasks.map((task) => (
          <div key={task._id} className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 hover:border-blue-500/50 transition-all group relative overflow-hidden">
            <div className="flex justify-between items-start mb-6 relative z-10">
              <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all ${
                task.priority === 'CRITICAL' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-blue-50 text-blue-600 border-blue-100'
              }`}>
                {task.priority}
              </span>
              <div className="flex items-center gap-2">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{task.progress}%</p>
                 <div className={`p-1.5 rounded-lg ${task.progress === 100 ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
                    {task.progress === 100 ? <ShieldCheck size={16} /> : <Clock size={16} />}
                 </div>
              </div>
            </div>

            <h3 className="text-xl font-black text-slate-900 mb-2 leading-tight group-hover:text-blue-600 transition-colors relative z-10">{task.title}</h3>
            <p className="text-slate-400 text-sm font-medium mb-8 line-clamp-2 relative z-10">{task.description || 'No additional instructions provided.'}</p>

            {/* Real-time Progress Bar */}
            <div className="w-full bg-slate-100 h-2 rounded-full mb-8 relative z-10 overflow-hidden">
               <div
                 className={`h-full transition-all duration-700 ${task.progress === 100 ? 'bg-emerald-500' : 'bg-blue-600'}`}
                 style={{ width: `${task.progress}%` }}
               />
            </div>

            {/* Sub-tasks checklist */}
            <div className="space-y-3 mb-8 relative z-10">
               {task.subtasks.map((st, i) => (
                 <div key={i} className="flex items-center gap-3 cursor-pointer group/item" onClick={() => toggleSubtask(task._id, i)}>
                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${st.completed ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-200 group-hover/item:border-blue-400'}`}>
                       {st.completed && <CheckCircle2 size={12} />}
                    </div>
                    <span className={`text-xs font-bold transition-all ${st.completed ? 'text-slate-300 line-through' : 'text-slate-600'}`}>{st.title}</span>
                 </div>
               ))}
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-slate-100 relative z-10">
               <div className="flex items-center gap-2">
                 <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500 border-2 border-white">
                    {task.assignedTo?.name?.charAt(0) || '?'}
                 </div>
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">For: {task.assignedTo?.name || 'Open Pool'}</span>
               </div>
               <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <Calendar size={12} /> {new Date(task.dueDate).toLocaleDateString()}
               </div>
            </div>

            {/* Design Watermark */}
            <div className="absolute -right-4 -bottom-4 opacity-5 pointer-events-none rotate-12 group-hover:rotate-0 transition-transform">
               <ListChecks size={120} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskManager;
