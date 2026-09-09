import React, { useState, useEffect } from 'react';
import {
  CheckSquare, Clock, AlertCircle, Timer,
  Play, Pause, CheckCircle2, FileText, Upload,
  MoreVertical, ChevronDown, LayoutGrid, List,
  Image as ImageIcon, Loader2
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
      const user = JSON.parse(localStorage.getItem('rcs_user'));
      const response = await apiFetch(`/api/tasks?assignedTo=${user.id}`);
      const data = await response.json();
      if (data.success) {
        setTasks(data.data);
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
    const updatedSubtasks = [...subtasks];
    updatedSubtasks[idx].completed = !updatedSubtasks[idx].completed;

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

    setIsUpdating(true);
    try {
      const formData = new FormData();
      formData.append('screenshot', screenshot);
      formData.append('status', 'COMPLETED');

      const token = localStorage.getItem('rcs_admin_token');
      const backendUrl = import.meta.env.VITE_API_URL || 'https://rcs-ajbn.onrender.com';

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
           <button className="p-2.5 text-slate-400 hover:text-slate-600"><List size={18} /></button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {tasks.map((task) => (
          <div key={task._id} className="bg-white rounded-[2.5rem] p-8 border border-slate-200/60 shadow-sm shadow-blue-500/5 hover:shadow-xl transition-all group flex flex-col">

             {/* Header */}
             <div className="flex justify-between items-start mb-6">
                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                  task.priority === 'CRITICAL' ? 'bg-red-50 text-red-600' :
                  task.priority === 'HIGH' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'
                }`}>
                  {task.priority} Priority
                </span>
                <button className="p-1 text-slate-300 hover:text-slate-600"><MoreVertical size={16} /></button>
             </div>

             <div className="flex-1">
                <h3 className="text-xl font-black text-slate-900 mb-2 leading-tight group-hover:text-blue-600 transition-colors">{task.title}</h3>
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-6 flex items-center gap-2">
                   <Timer size={12} /> {task.project?.name || 'Internal'}
                </p>
                <p className="text-xs text-slate-500 line-clamp-2 mb-8">{task.description}</p>

                {/* Subtasks */}
                {task.subtasks?.length > 0 && (
                  <div className="mb-8 space-y-3">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Milestones</p>
                     {task.subtasks.map((st, idx) => (
                       <button
                         key={idx}
                         disabled={task.status === 'COMPLETED'}
                         onClick={() => handleSubtaskToggle(task._id, task.subtasks, idx)}
                         className="w-full flex items-center gap-3 text-left group/st"
                       >
                          <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all ${
                            st.completed ? 'bg-emerald-500 border-emerald-500' : 'border-slate-200 bg-white'
                          }`}>
                             {st.completed && <CheckCircle2 size={12} className="text-white" />}
                          </div>
                          <span className={`text-xs font-bold transition-all ${st.completed ? 'text-slate-400 line-through' : 'text-slate-600'}`}>
                             {st.title}
                          </span>
                       </button>
                     ))}
                  </div>
                )}
             </div>

             {/* Footer / Controls */}
             <div className="mt-auto pt-8 border-t border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                   {task.status !== 'COMPLETED' ? (
                     <>
                       {task.status !== 'IN_PROGRESS' ? (
                         <TaskControlBtn onClick={() => handleStatusChange(task._id, 'IN_PROGRESS')} icon={Play} label="Start" color="blue" />
                       ) : (
                         <TaskControlBtn onClick={() => handleStatusChange(task._id, 'PAUSED')} icon={Pause} label="Pause" color="amber" />
                       )}
                       <TaskControlBtn onClick={() => handleStatusChange(task._id, 'COMPLETED', task)} icon={CheckCircle2} label="Complete" color="emerald" />
                     </>
                   ) : (
                     <div className="flex items-center gap-2 text-emerald-600">
                        <CheckCircle2 size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Finished</span>
                     </div>
                   )}
                </div>

                <div className="text-right">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Progress</p>
                   <p className="text-sm font-black text-slate-900">{task.progress}%</p>
                </div>
             </div>
          </div>
        ))}
      </div>

      {/* Completion Modal */}
      <Modal
        isOpen={showCompleteModal}
        onClose={() => !isUpdating && setShowCompleteModal(false)}
        title="Complete Task Verification"
      >
         <form onSubmit={handleCompleteTask} className="space-y-6">
            <p className="text-sm font-medium text-slate-500">
              Please upload a screenshot of your finished work or output for <strong>{selectedTask?.title}</strong>.
            </p>

            <div className="aspect-video rounded-3xl bg-slate-50 border-2 border-dashed border-slate-200 overflow-hidden relative group">
               {screenshotPreview ? (
                 <div className="w-full h-full relative">
                    <img src={screenshotPreview} alt="Preview" className="w-full h-full object-contain" />
                    <button
                      type="button"
                      onClick={() => { setScreenshot(null); setScreenshotPreview(null); }}
                      className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-xl shadow-lg active:scale-90 transition-transform"
                    >
                       <AlertCircle size={18} />
                    </button>
                 </div>
               ) : (
                 <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer group-hover:bg-slate-100 transition-all">
                    <Upload size={40} className="text-slate-300 group-hover:text-blue-500 mb-4 transition-colors" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-blue-600">Upload Screenshot</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} required />
                 </label>
               )}
            </div>

            <div className="flex gap-3 pt-6">
               <Button
                 type="button"
                 variant="secondary"
                 className="flex-1 rounded-xl"
                 onClick={() => setShowCompleteModal(false)}
                 disabled={isUpdating}
               >
                 Cancel
               </Button>
               <Button
                 type="submit"
                 className="flex-1 rounded-xl"
                 disabled={isUpdating || !screenshot}
               >
                 {isUpdating ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Finalize Task'}
               </Button>
            </div>
         </form>
      </Modal>
    </div>
  );
};

const TaskControlBtn = ({ onClick, icon: Icon, label, color }) => {
  const colors = {
    blue: 'bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white',
    amber: 'bg-amber-50 text-amber-600 hover:bg-amber-600 hover:text-white',
    emerald: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white'
  };

  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-xl flex items-center gap-2 transition-all active:scale-95 ${colors[color]}`}
    >
       <Icon size={14} />
       <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
    </button>
  );
};

export default MyTasksPage;
