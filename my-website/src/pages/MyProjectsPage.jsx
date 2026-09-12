import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase, Users, Target, Layout, CheckCircle2, Clock,
  AlertTriangle, DollarSign, Activity, FileText, ChevronRight,
  Zap, Calendar, TrendingUp, Search, Filter, ShieldCheck, User
} from 'lucide-react';
import { apiFetch } from '../utils/api';
import Modal from '../admin/components/Modal';

const MyProjectsPage = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeTab, setActiveTab] = useState('Overview');

  const fetchMyProjects = async () => {
    try {
      const userStr = localStorage.getItem('rcs_user');
      if (!userStr) {
        setLoading(false);
        return;
      }

      let user;
      try {
        user = JSON.parse(userStr);
      } catch (e) {
        console.error("User parsing failed", e);
        setLoading(false);
        return;
      }

      if (!user) {
        setLoading(false);
        return;
      }

      const userId = user._id || user.id;
      if (!userId) {
        setLoading(false);
        return;
      }

      const response = await apiFetch(`/api/projects?employeeId=${userId}`);
      const data = await response.json();
      if (data.success) {
        setProjects(Array.isArray(data.data) ? data.data : []);
      }
    } catch (err) {
      console.error('Failed to fetch projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyProjects();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'IN_PROGRESS': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'ON_HOLD': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'AT_RISK': return 'bg-rose-50 text-rose-600 border-rose-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  if (loading) return (
    <div className="p-10 text-center space-y-4">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Syncing Project Hub...</p>
    </div>
  );

  const userStr = localStorage.getItem('rcs_user');
  const user = userStr ? JSON.parse(userStr) : null;

  return (
    <div className="p-8 bg-slate-50 min-h-screen font-sans space-y-10 animate-in fade-in duration-700">

      {/* Header */}
      <div>
         <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg">
               <Briefcase size={22} />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Collaboration Hub</h1>
         </div>
         <p className="text-slate-500 font-medium ml-1">View and contribute to your assigned company missions.</p>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
         {projects.length === 0 ? (
           <div className="col-span-full py-20 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
              <Zap size={48} className="mx-auto mb-4 text-slate-200" />
              <h3 className="text-lg font-black text-slate-400 uppercase tracking-widest">No Active Missions</h3>
              <p className="text-sm font-medium text-slate-400 mt-2">You aren't associated with any tactical projects yet.</p>
           </div>
         ) : projects.map((p) => {
            if (!user) return null;
            const userId = user._id || user.id;
            const myContribution = (p.team || []).find(m => (m.user?._id || m.user) === userId);

            return (
              <div key={p._id} className="bg-white rounded-[2.5rem] border border-slate-200/60 shadow-sm hover:shadow-xl hover:border-blue-500/30 transition-all group p-8 flex flex-col">
                 <div className="flex justify-between items-start mb-6">
                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${getStatusColor(p.status)}`}>
                       {p.status?.replace('_', ' ')}
                    </span>
                    <div className="flex items-center gap-1.5 text-slate-400">
                       <Clock size={14} />
                       <span className="text-[10px] font-black uppercase tracking-widest">{p.progress || 0}%</span>
                    </div>
                 </div>

                 <h3 className="text-xl font-black text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">{p.name}</h3>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">{p.client} • {p.code}</p>

                 {/* My Role Section */}
                 <div className="bg-blue-50 rounded-2xl p-4 mb-6 border border-blue-100/50">
                    <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest mb-1">Your Tactical Role</p>
                    <p className="text-sm font-black text-blue-900">{myContribution?.role || (p.manager?._id === userId ? 'Project Strategist' : 'Specialist')}</p>
                    <p className="text-[9px] font-bold text-blue-400 mt-1 uppercase tracking-tighter italic">{myContribution?.allocation || 100}% Mission Allocation</p>
                 </div>

                 <div className="space-y-4 flex-1">
                    <div className="flex justify-between items-end">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Progress</p>
                       <p className="text-[10px] font-black text-slate-900">{p.progress || 0}%</p>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                       <div className="h-full bg-blue-600" style={{ width: `${p.progress || 0}%` }}></div>
                    </div>
                 </div>

                 <button
                   onClick={() => navigate(`/projects/${p._id}`)}
                   className="mt-8 w-full py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg shadow-slate-900/10 flex items-center justify-center gap-2"
                 >
                    Examine Mission <ChevronRight size={14} />
                 </button>
              </div>
            );
         })}
      </div>

      {/* Project Intelligence Modal */}
      <Modal isOpen={!!selectedProject} onClose={() => setSelectedProject(null)} title="Mission Intelligence">
         {selectedProject && (
           <div className="space-y-8 max-w-4xl mx-auto">
              <div className="flex items-center gap-4 mb-8">
                 <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-black text-xl shadow-lg">
                    {selectedProject.name.charAt(0)}
                 </div>
                 <div>
                    <h2 className="text-2xl font-black text-slate-900 leading-tight">{selectedProject.name}</h2>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{selectedProject.client} • {selectedProject.code}</p>
                 </div>
              </div>

              {/* Internal Tabs */}
              <div className="flex gap-2 p-1 bg-slate-50 rounded-xl mb-8 overflow-x-auto scrollbar-hide">
                 {['Overview', 'Squad', 'Milestones', 'Objectives'].map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                         activeTab === tab ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                       {tab}
                    </button>
                 ))}
              </div>

              <div className="min-h-[300px]">
                 {activeTab === 'Overview' && (
                   <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <div className="grid grid-cols-2 gap-4">
                         <div className="p-5 bg-slate-50 rounded-[2rem] border border-slate-100">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Strategist Head</p>
                            <p className="text-sm font-black text-slate-900">{selectedProject.manager?.name || 'High-Command'}</p>
                         </div>
                         <div className="p-5 bg-slate-50 rounded-[2rem] border border-slate-100">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Target End</p>
                            <p className="text-sm font-black text-slate-900">{selectedProject.targetDate ? new Date(selectedProject.targetDate).toLocaleDateString() : 'Strategic TBD'}</p>
                         </div>
                      </div>
                      <div className="p-6 bg-blue-50 border border-blue-100 rounded-[2rem]">
                         <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest mb-2">Executive Summary</p>
                         <p className="text-xs font-medium text-blue-900 leading-relaxed italic">"{selectedProject.description || 'No public summary provided for this mission.'}"</p>
                      </div>
                   </div>
                 )}

                 {activeTab === 'Squad' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                       {(selectedProject.team || []).map((mem, i) => (
                         <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:bg-white hover:border-blue-200 transition-all">
                            <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-black text-slate-400 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all">
                               {mem.user?.name?.charAt(0) || '?'}
                            </div>
                            <div className="flex-1">
                               <h4 className="text-xs font-black text-slate-900 leading-none mb-0.5">{mem.user?.name || 'Specialist Unknown'}</h4>
                               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{mem.role || 'Mission Personnel'}</p>
                            </div>
                            <div className="text-right">
                               <span className="text-[10px] font-black text-blue-600 uppercase">{mem.allocation || 100}%</span>
                            </div>
                         </div>
                       ))}
                    </div>
                 )}

                 {activeTab === 'Milestones' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                       {(selectedProject.milestones || []).map((ms, i) => (
                         <div key={i} className="p-5 bg-slate-50 border border-slate-100 rounded-[2rem] flex items-center gap-4">
                            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                               ms.status === 'COMPLETED' ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-200 text-slate-300'
                            }`}>
                               <CheckCircle2 size={16} />
                            </div>
                            <div className="flex-1">
                               <div className="flex justify-between items-center mb-1">
                                  <h4 className="text-xs font-black text-slate-900">{ms.title}</h4>
                                  <span className="text-[9px] font-bold text-slate-400">{ms.dueDate ? new Date(ms.dueDate).toLocaleDateString() : ''}</span>
                               </div>
                               <div className="h-1 w-full bg-slate-200 rounded-full overflow-hidden">
                                  <div className="h-full bg-blue-600 transition-all duration-500" style={{width: `${ms.progress || 0}%`}}></div>
                               </div>
                            </div>
                         </div>
                       ))}
                       {(!selectedProject.milestones || selectedProject.milestones.length === 0) && <p className="text-center py-10 text-xs font-bold text-slate-300 uppercase italic">No tactical milestones logged</p>}
                    </div>
                 )}

                 {activeTab === 'Objectives' && (
                    <div className="grid grid-cols-1 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                       <div className="p-6 bg-slate-50 border border-slate-100 rounded-[2.5rem]">
                          <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-4 flex items-center gap-2"><Target size={14}/> Core Mission Clauses</h4>
                          <div className="space-y-3">
                             {(selectedProject.requirements || []).map((req, i) => (
                               <div key={i} className="flex gap-3">
                                  <div className="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                  <p className="text-xs font-bold text-slate-600 leading-snug">{req.title}</p>
                               </div>
                             ))}
                             {(!selectedProject.requirements || selectedProject.requirements.length === 0) && <p className="text-xs font-bold text-slate-300 uppercase italic">No clauses defined</p>}
                          </div>
                       </div>
                       <div className="p-6 bg-rose-50 border border-rose-100 rounded-[2.5rem]">
                          <h4 className="text-[10px] font-black text-rose-600 uppercase tracking-widest mb-4 flex items-center gap-2"><AlertTriangle size={14}/> Tactical Exclusions</h4>
                          <div className="space-y-3">
                             {(selectedProject.outOfScope || []).map((ex, i) => (
                               <div key={i} className="flex gap-3">
                                  <div className="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-rose-500"></div>
                                  <p className="text-xs font-bold text-rose-600 leading-snug">{ex}</p>
                               </div>
                             ))}
                             {(!selectedProject.outOfScope || selectedProject.outOfScope.length === 0) && <p className="text-xs font-bold text-rose-300 uppercase italic">No specific exclusions</p>}
                          </div>
                       </div>
                    </div>
                 )}
              </div>
           </div>
         )}
      </Modal>

    </div>
  );
};

export default MyProjectsPage;
