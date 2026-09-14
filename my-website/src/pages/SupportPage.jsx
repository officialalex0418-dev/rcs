import React, { useState, useEffect } from 'react';
import {
  MessageSquare, Plus, Send, Paperclip, Loader2,
  CheckCircle2, Clock, X, User, Shield, Info, Image as ImageIcon, FileText
} from 'lucide-react';
import { apiFetch } from '../utils/api';
import { getAuthUser, getProfilePic } from '../utils/auth';
import Modal from '../admin/components/Modal';
import Button from '../admin/components/Button';
import Input from '../admin/components/Input';

const SupportPage = () => {
  const [tickets, setTickets] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  // Create Ticket Form
  const [formData, setFormData] = useState({
    assignedTo: '',
    subject: '',
    topic: 'Technical Issue',
    description: '',
    attachment: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reply Form
  const [replyMsg, setReplyMsg] = useState('');
  const [replyFile, setReplyFile] = useState(null);
  const [isReplying, setIsReplying] = useState(false);

  const fetchData = async () => {
    try {
      const [ticketRes, empRes] = await Promise.all([
        apiFetch('/api/support'),
        apiFetch('/api/employees')
      ]);
      const ticketData = await ticketRes.json();
      const empData = await empRes.json();

      if (ticketData.success) setTickets(ticketData.data);
      if (empData.success) setEmployees(empData.data);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const data = new FormData();
      data.append('assignedTo', formData.assignedTo);
      data.append('subject', formData.subject);
      data.append('topic', formData.topic);
      data.append('description', formData.description);
      if (formData.attachment) data.append('attachment', formData.attachment);

      const token = localStorage.getItem('rcs_admin_token');
      const backendUrl = import.meta.env.VITE_API_URL || 'https://rcs-ajbn.onrender.com';

      const res = await fetch(`${backendUrl}/api/support`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: data
      });

      if (res.ok) {
        setShowCreateModal(false);
        setFormData({ assignedTo: '', subject: '', topic: 'Technical Issue', description: '', attachment: null });
        fetchData();
      }
    } catch (err) {
      console.error('Create ticket error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyMsg.trim() && !replyFile) return;
    setIsReplying(true);

    try {
      const data = new FormData();
      data.append('message', replyMsg);
      if (replyFile) data.append('attachment', replyFile);

      const token = localStorage.getItem('rcs_admin_token');
      const backendUrl = import.meta.env.VITE_API_URL || 'https://rcs-ajbn.onrender.com';

      const res = await fetch(`${backendUrl}/api/support/${selectedTicket._id}/reply`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: data
      });

      if (res.ok) {
        const result = await res.json();
        setSelectedTicket(result.data);
        setReplyMsg('');
        setReplyFile(null);
        fetchData();
      }
    } catch (err) {
      console.error('Reply error:', err);
    } finally {
      setIsReplying(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-[60vh]"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;

  const currentUser = getAuthUser();

  return (
    <div className="animate-in fade-in duration-700 max-w-6xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Support Protocol</h1>
          <p className="text-slate-500 font-medium">Initialize support tickets or coordinate with specialists.</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} icon={Plus} className="rounded-2xl px-8 shadow-xl shadow-blue-500/20">Initialize Ticket</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Ticket List */}
        <div className="lg:col-span-4 space-y-4">
           {tickets.length === 0 ? (
             <div className="bg-white rounded-[2rem] p-12 text-center border border-slate-100">
                <Info className="mx-auto text-slate-200 mb-4" size={40} />
                <p className="text-xs font-black text-slate-400 uppercase">No active protocols</p>
             </div>
           ) : (
             tickets.map(ticket => (
               <div
                 key={ticket._id}
                 onClick={() => setSelectedTicket(ticket)}
                 className={`p-6 rounded-[2rem] border transition-all cursor-pointer group ${
                   selectedTicket?._id === ticket._id ? 'bg-slate-900 border-slate-900 text-white shadow-2xl' : 'bg-white border-slate-200 hover:border-blue-500'
                 }`}
               >
                  <div className="flex justify-between items-start mb-3">
                     <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${
                       selectedTicket?._id === ticket._id ? 'bg-white/10 text-white' : 'bg-blue-50 text-blue-600'
                     }`}>{ticket.status}</span>
                     <span className={`text-[9px] font-bold ${selectedTicket?._id === ticket._id ? 'text-slate-400' : 'text-slate-400'}`}>
                        {new Date(ticket.updatedAt).toLocaleDateString()}
                     </span>
                  </div>
                  <h4 className="font-black text-sm mb-1 leading-tight line-clamp-1">{ticket.subject}</h4>
                  <p className={`text-[10px] font-bold uppercase tracking-widest ${selectedTicket?._id === ticket._id ? 'text-blue-400' : 'text-slate-400'}`}>
                     {ticket.sender._id === currentUser?._id ? `To: ${ticket.assignedTo.name}` : `From: ${ticket.sender.name}`}
                  </p>
               </div>
             ))
           )}
        </div>

        {/* Conversation Area */}
        <div className="lg:col-span-8">
           {selectedTicket ? (
             <div className="bg-white rounded-[2.5rem] border border-slate-200/60 shadow-sm overflow-hidden flex flex-col h-[70vh]">
                {/* Chat Header */}
                <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-200">
                         <img src={getProfilePic(selectedTicket.sender._id === currentUser?._id ? selectedTicket.assignedTo : selectedTicket.sender)} className="w-full h-full object-cover" alt="User" />
                      </div>
                      <div>
                         <h3 className="text-sm font-black text-slate-900">{selectedTicket.subject}</h3>
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{selectedTicket.topic}</p>
                      </div>
                   </div>
                   <button onClick={() => setSelectedTicket(null)} className="p-2 hover:bg-slate-200 rounded-xl transition-colors"><X size={18}/></button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                   {/* Initial Ticket Body */}
                   <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0">
                         <img src={getProfilePic(selectedTicket.sender)} className="w-full h-full object-cover" alt="Sender" />
                      </div>
                      <div className="max-w-[80%] space-y-2">
                         <div className="bg-slate-100 p-4 rounded-2xl rounded-tl-none">
                            <p className="text-xs text-slate-700 leading-relaxed">{selectedTicket.description}</p>
                            {selectedTicket.attachment?.url && (
                               <a
                                  href={selectedTicket.attachment.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="mt-3 flex items-center gap-2 p-2 bg-white rounded-xl border border-slate-200 hover:border-blue-500 transition-all"
                               >
                                  <Paperclip size={14} className="text-blue-600" />
                                  <span className="text-[10px] font-black text-slate-900 uppercase truncate">{selectedTicket.attachment.fileName}</span>
                               </a>
                            )}
                         </div>
                         <p className="text-[9px] font-bold text-slate-400 uppercase">{new Date(selectedTicket.createdAt).toLocaleString()}</p>
                      </div>
                   </div>

                   {/* Replies */}
                   {(selectedTicket.replies || []).map((reply, i) => (
                      <div key={i} className={`flex gap-4 ${reply.sender._id === currentUser?._id ? 'flex-row-reverse text-right' : ''}`}>
                         <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0">
                            <img src={getProfilePic(reply.sender)} className="w-full h-full object-cover" alt="Avatar" />
                         </div>
                         <div className={`max-w-[80%] space-y-2 ${reply.sender._id === currentUser?._id ? 'items-end' : ''}`}>
                            <div className={`p-4 rounded-2xl ${
                               reply.sender._id === currentUser?._id ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-slate-100 text-slate-700 rounded-tl-none'
                            }`}>
                               <p className="text-xs leading-relaxed">{reply.message}</p>
                               {reply.attachment?.url && (
                                  <a
                                     href={reply.attachment.url}
                                     target="_blank"
                                     rel="noopener noreferrer"
                                     className={`mt-3 flex items-center gap-2 p-2 rounded-xl border transition-all ${
                                        reply.sender._id === currentUser?._id ? 'bg-blue-700 border-blue-500 hover:bg-blue-800' : 'bg-white border-slate-200 hover:border-blue-500'
                                     }`}
                                  >
                                     <Paperclip size={14} />
                                     <span className="text-[10px] font-black uppercase truncate">{reply.attachment.fileName}</span>
                                  </a>
                               )}
                            </div>
                            <p className="text-[9px] font-bold text-slate-400 uppercase">{new Date(reply.createdAt).toLocaleString()}</p>
                         </div>
                      </div>
                   ))}
                </div>

                {/* Reply Input */}
                <form onSubmit={handleReply} className="p-6 border-t border-slate-100 bg-slate-50/30">
                   <div className="flex gap-4">
                      <div className="flex-1 relative">
                         <input
                           type="text"
                           placeholder="Type your response..."
                           className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl outline-none text-sm font-medium focus:ring-4 focus:ring-blue-500/5 transition-all"
                           value={replyMsg}
                           onChange={e => setReplyMsg(e.target.value)}
                         />
                         <label className="absolute left-4 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400 hover:text-blue-600 transition-colors">
                            <Paperclip size={20} />
                            <input type="file" className="hidden" onChange={e => setReplyFile(e.target.files[0])} />
                         </label>
                         {replyFile && (
                           <div className="absolute -top-10 left-0 bg-blue-600 text-white text-[9px] px-3 py-1 rounded-full flex items-center gap-2">
                              {replyFile.name} <X size={10} className="cursor-pointer" onClick={() => setReplyFile(null)} />
                           </div>
                         )}
                      </div>
                      <button
                        type="submit"
                        disabled={isReplying}
                        className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/20 active:scale-95 transition-all disabled:opacity-50"
                      >
                         {isReplying ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                      </button>
                   </div>
                </form>
             </div>
           ) : (
             <div className="h-[70vh] bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center text-center p-12">
                <MessageSquare className="text-slate-200 mb-4" size={64} />
                <h3 className="text-xl font-black text-slate-400 uppercase">Comm Center Standby</h3>
                <p className="text-slate-400 text-sm mt-2">Select a tactical ticket from the directory to examine the situation.</p>
             </div>
           )}
        </div>
      </div>

      {/* Create Ticket Modal */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Initialize Support Protocol">
         <form onSubmit={handleCreateTicket} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contact Person</label>
                  <select
                    required
                    className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none"
                    value={formData.assignedTo}
                    onChange={e => setFormData({...formData, assignedTo: e.target.value})}
                  >
                     <option value="">Select Personnel</option>
                     {employees.map(emp => (
                       <option key={emp._id} value={emp._id}>{emp.name} ({emp.designation})</option>
                     ))}
                  </select>
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Topic</label>
                  <select
                    className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none"
                    value={formData.topic}
                    onChange={e => setFormData({...formData, topic: e.target.value})}
                  >
                     <option value="Technical Issue">Technical Issue</option>
                     <option value="HR / Payroll">HR / Payroll</option>
                     <option value="Project Query">Project Query</option>
                     <option value="Other Protocol">Other Protocol</option>
                  </select>
               </div>
            </div>

            <Input
               label="Subject"
               placeholder="Brief summary of the issue..."
               value={formData.subject}
               onChange={e => setFormData({...formData, subject: e.target.value})}
               required
            />

            <div className="space-y-2">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Detailed Description</label>
               <textarea
                 required
                 rows="4"
                 className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-medium focus:border-blue-500 transition-all"
                 placeholder="Provide full context for the support mission..."
                 value={formData.description}
                 onChange={e => setFormData({...formData, description: e.target.value})}
               />
            </div>

            <div className="space-y-2">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tactical Attachment (Up to 5MB)</label>
               <div className="flex items-center gap-4">
                  <label className="flex-1 border-2 border-dashed border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-all">
                     <Upload size={24} className="text-slate-300 mb-2" />
                     <span className="text-[10px] font-black text-slate-400 uppercase">{formData.attachment ? formData.attachment.name : 'Select Screenshot, Zip or PDF'}</span>
                     <input type="file" className="hidden" accept=".jpg,.jpeg,.png,.pdf,.zip" onChange={e => setFormData({...formData, attachment: e.target.files[0]})} />
                  </label>
               </div>
            </div>

            <div className="flex gap-4 pt-6">
               <button type="button" onClick={() => setShowCreateModal(false)} className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all">Abort</button>
               <button type="submit" disabled={isSubmitting} className="flex-2 min-w-[200px] py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 active:scale-95 transition-all">
                  {isSubmitting ? <Loader2 className="animate-spin mx-auto" /> : 'Execute Protocol'}
               </button>
            </div>
         </form>
      </Modal>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
      `}} />
    </div>
  );
};

export default SupportPage;
