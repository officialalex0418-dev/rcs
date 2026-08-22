import React, { useState, useEffect } from 'react';
import { Plus, Search, Calendar, CheckCircle2, Clock, Users, ArrowUpRight, Filter, AlertTriangle } from 'lucide-react';

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    fetchTasks();
  }, []);

  return (
    <div className="p-8 bg-slate-50 min-h-screen font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Task Orchestration</h1>
          <p className="text-slate-500 font-medium">Assign work, track progress, and monitor staff efficiency.</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 px-5 py-2.5 rounded-xl text-sm font-bold text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20">
          <Plus size={18} />
          Create Task
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
           <div className="col-span-full py-20 text-center font-bold text-slate-400 uppercase tracking-widest text-xs">Synchronizing Task Engine...</div>
        ) : tasks.length === 0 ? (
           <div className="col-span-full py-20 text-center font-bold text-slate-400 uppercase tracking-widest text-xs">No active tasks found in the system</div>
        ) : tasks.map((task) => (
          <div key={task._id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:border-blue-500/50 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${
                task.priority === 'CRITICAL' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
              }`}>
                {task.priority} Priority
              </span>
              <div className={`p-1.5 rounded-lg ${task.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                {task.status === 'COMPLETED' ? <CheckCircle2 size={16} /> : <Clock size={16} />}
              </div>
            </div>

            <h3 className="text-lg font-black text-slate-900 mb-2 leading-tight group-hover:text-blue-600 transition-colors">{task.title}</h3>
            <p className="text-slate-500 text-sm mb-6 line-clamp-2">{task.description}</p>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl mb-6">
               <div className="flex items-center gap-2">
                 <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center">
                    <Users size={14} className="text-slate-500" />
                 </div>
                 <div className="flex flex-col">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter leading-none">Assignee</p>
                   <p className="text-xs font-bold text-slate-900 mt-1">{task.assignedTo?.name || 'Unassigned'}</p>
                 </div>
               </div>
               <div className="h-6 w-px bg-slate-200"></div>
               <div className="flex flex-col items-end">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter leading-none">Deadline</p>
                 <p className="text-xs font-bold text-slate-900 mt-1">{new Date(task.dueDate).toLocaleDateString()}</p>
               </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
               <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{task.project?.name || 'General Task'}</span>
               <button className="text-xs font-black text-blue-600 flex items-center gap-1 hover:underline">
                  Project Hub <ArrowUpRight size={14} />
               </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskManager;
