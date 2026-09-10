import React, { useState, useEffect } from 'react';
import {
  CheckSquare, Clock, AlertCircle, Timer,
  Play, Pause, CheckCircle2, FileText, Upload,
  MoreVertical, ChevronDown, LayoutGrid, List,
  Image as ImageIcon, Loader2, Calendar, Target, X
} from 'lucide-react';
import { apiFetch } from '../utils/api';
import Modal from '../admin/components/Modal';
import Button from '../admin/components/Button';

const MyTasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [screenshot, setScreenshot] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchTasks = async () => {
    try {
      const userStr = localStorage.getItem('rcs_user');
      if (!userStr) return;

      const user = JSON.parse(userStr);
      const response = await apiFetch(`/api/tasks?assignedTo=${user.id || user._id}`);
      const data = await response.json();
      if (data.success) {
        setTasks(Array.isArray(data.data) ? data.data : []);
      }
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleStatusChange = async (taskId, newStatus, currentTask) => {
    if (newStatus === 'COMPLETED') {
      setSelectedTask(currentTask);
      setShowCompleteModal(true);
      return;
    }

    try {
      const response = await apiFetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) fetchTasks();
    } catch (err) {
      console.error('Failed to update task status:', err);
    }
  };

  const handleSubtaskToggle = async (taskId, subtasks, idx) => {
    const updatedSubtasks = [...(subtasks || [])];
    if (updatedSubtasks[idx]) {
      updatedSubtasks[idx].completed = !updatedSubtasks[idx].completed;
    }

    try {
      const response = await apiFetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        body: JSON.stringify({ subtasks: updatedSubtasks })
      });
      if (response.ok) fetchTasks();
    } catch (err) {
      console.error('Failed to update subtask:', err);
    }
  };

  const handleCompleteTask = async (e) => {
    e.preventDefault();
    if (!screenshot) {
      alert('Proof of work (screenshot) is mandatory for completion.');
      return;
    }

    if (!selectedTask?._id) return;

    setIsUpdating(true);
    try {
      const formData = new FormData();
      formData.append('screenshot', screenshot);
      formData.append('status', 'COMPLETED');

      const token = localStorage.getItem('rcs_admin_token');
      const backendUrl = 'https://rcs-ajbn.onrender.com';

      const response = await fetch(`${backendUrl}/api/tasks/${selectedTask._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        setShowCompleteModal(false);
        setScreenshot(null);
        setScreenshotPreview(null);
        setSelectedTask(null);
        fetchTasks();
      }
    } catch (err) {
      console.error('Failed to complete task:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setScreenshot(file);
      const reader = new FileReader();
      reader.onloadend = () => setScreenshotPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
    </div>
  );

  return (
    <div className="animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">My Task Terminal</h1>
          <p className="text-slate-500 font-medium">Manage and track your assigned deliverables.</p>
        </div>
        <div className="flex gap-4 p-1 bg-white border border-slate-200 rounded-2xl shadow-sm">
           <button className="p-2.5 bg-slate-900 text-white rounded-xl shadow-lg shadow-slate-900/10"><LayoutGrid size={18} /></button>
           <button className="p-2.5 text-slate-400 hover:text-slate-600 transition-colors"><List size={18} /></button>
        </div>
      </div>

      {(tasks || []).length === 0 ? (
        <div className="bg-white rounded-[2.5rem] p-20 text-center border border-slate-100">
           <Target className="w-16 h-16 text-slate-200 mx-auto mb-6" />
           <h3 className="text-xl font-black text-slate-900 mb-2">All Clear!</h3>
           <p className="text-slate-400 font-medium">You don't have any active tasks assigned yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tasks.map((task) => (
            <div key={task?._id} className="bg-white rounded-[2.5rem] p-8 border border-slate-200/60 shadow-sm shadow-blue-500/5 hover:shadow-xl transition-all group flex flex-col">

               {/* Header */}
               <div className="flex justify-between items-start mb-6">
                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                    task?.priority === 'CRITICAL' ? 'bg-red-50 text-red-600' :
                    task?.priority === 'HIGH' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'
                  }`}>
                    {task?.priority || 'MEDIUM'} Priority
                  </span>
                  <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <Calendar size={12} className="text-slate-300" /> {task?.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}
                  </div>
               </div>

               <div className="flex-1">
                  <h3 className="text-xl font-black text-slate-900 mb-2 leading-tight group-hover:text-blue-600 transition-colors truncate">{task?.title}</h3>
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-6 flex items-center gap-2">
                     <Target size={12} /> {task?.project?.name || 'Administrative'}
                  </p>
                  <p className="text-xs text-slate-500 line-clamp-3 mb-8 leading-relaxed">{task?.description || 'Proceed with standard operational protocol for this task module.'}</p>

                  {/* Subtasks */}
                  {task?.subtasks?.length > 0 && (
                    <div className="mb-8 space-y-3 bg-slate-50/50 p-6 rounded-2xl border border-slate-100/50">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Milestones</p>
                       {task.subtasks.map((st, idx) => (
                         <button
                           key={idx}
                           disabled={task.status === 'COMPLETED'}
                           onClick={() => handleSubtaskToggle(task._id, task.subtasks, idx)}
                           className="w-full flex items-center gap-3 text-left group/st"
                         >
                            <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all ${
                              st?.completed ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 bg-white group-hover/st:border-emerald-400'
                            }`}>
                               {st?.completed && <CheckCircle2 size={12} className="text-white" />}
                            </div>
                            <span className={`text-xs font-bold transition-all ${st?.completed ? 'text-slate-400 line-through' : 'text-slate-600'}`}>
                               {st?.title}
                            </span>
                         </button>
                       ))}
                    </div>
                  )}
               </div>

               {/* Footer / Controls */}
               <div className="mt-auto pt-8 border-t border-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                     {task?.status !== 'COMPLETED' ? (
                       <>
                         {task?.status !== 'IN_PROGRESS' ? (
                           <TaskControlBtn onClick={() => handleStatusChange(task?._id, 'IN_PROGRESS')} icon={Play} label="Start" color="blue" />
                         ) : (
                           <TaskControlBtn onClick={() => handleStatusChange(task?._id, 'PAUSED')} icon={Pause} label="Pause" color="amber" />
                         )}
                         <TaskControlBtn onClick={() => handleStatusChange(task?._id, 'COMPLETED', task)} icon={CheckCircle2} label="Finish" color="emerald" />
                       </>
                     ) : (
                       <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100">
                          <CheckCircle2 size={16} />
                          <span className="text-[10px] font-black uppercase tracking-widest">Finalized</span>
                       </div>
                     )}
                  </div>

                  <div className="text-right">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Progress</p>
                     <p className="text-sm font-black text-slate-900">{task?.progress || 0}%</p>
                  </div>
               </div>
            </div>
          ))}
        </div>
      )}

      {/* Completion Modal */}
      <Modal
        isOpen={showCompleteModal}
        onClose={() => !isUpdating && setShowCompleteModal(false)}
        title="Protocol Completion Check"
      >
         <form onSubmit={handleCompleteTask} className="space-y-6">
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl flex gap-3">
               <AlertCircle className="text-blue-600 flex-shrink-0" size={20} />
               <p className="text-xs font-bold text-blue-700 leading-relaxed">
                 Proof of work is required to finalize this module. Please upload a clear screenshot of your output for <strong>{selectedTask?.title}</strong>.
               </p>
            </div>

            <div className="aspect-video rounded-3xl bg-slate-50 border-2 border-dashed border-slate-200 overflow-hidden relative group">
               {screenshotPreview ? (
                 <div className="w-full h-full relative">
                    <img src={screenshotPreview} alt="Preview" className="w-full h-full object-contain" />
                    <button
                      type="button"
                      onClick={() => { setScreenshot(null); setScreenshotPreview(null); }}
                      className="absolute top-4 right-4 p-2.5 bg-red-500 text-white rounded-xl shadow-lg active:scale-90 transition-transform"
                    >
                       <X size={20} />
                    </button>
                 </div>
               ) : (
                 <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer group-hover:bg-slate-100 transition-all">
                    <Upload size={48} className="text-slate-300 group-hover:text-blue-500 mb-4 transition-colors" />
                    <span className="text-[11px] font-black uppercase tracking-widest text-slate-400 group-hover:text-blue-600">Attach Deliverable (Max 5MB)</span>
                    <input type="file" accept="image/*,.pdf,.doc,.docx" className="hidden" onChange={handleFileChange} required />
                 </label>
               )}
            </div>

            <div className="flex gap-4 pt-6">
               <button
                 type="button"
                 className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
                 onClick={() => setShowCompleteModal(false)}
                 disabled={isUpdating}
               >
                 Abort
               </button>
               <button
                 type="submit"
                 className="flex-1 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-900/20 active:scale-95 transition-all disabled:opacity-50"
                 disabled={isUpdating || !screenshot}
               >
                 {isUpdating ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Confirm Deployment'}
               </button>
            </div>
         </form>
      </Modal>
    </div>
  );
};

const TaskControlBtn = ({ onClick, icon: Icon, label, color }) => {
  const colors = {
    blue: 'bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white border border-blue-100/50',
    amber: 'bg-amber-50 text-amber-600 hover:bg-amber-600 hover:text-white border border-amber-100/50',
    emerald: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white border border-emerald-100/50'
  };

  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all active:scale-95 ${colors[color] || colors.blue}`}
    >
       {Icon && <Icon size={14} />}
       <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
    </button>
  );
};

export default MyTasksPage;
