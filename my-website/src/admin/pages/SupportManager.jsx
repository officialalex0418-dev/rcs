import React, { useState, useEffect } from 'react';
import {
  MessageSquare, AlertCircle, CheckCircle2, MoreVertical,
  Search, User, Mail, Zap, Clock, Info, X, Paperclip, Loader2
} from 'lucide-react';
import { apiFetch } from '../../utils/api';
import { getProfilePic } from '../../utils/auth';
import Modal from '../components/Modal';

const SupportManager = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchTickets = async () => {
    try {
      const response = await apiFetch('/api/support');
      const data = await response.json();
      if (data.success) setTickets(data.data);
    } catch (err) {
      console.error('Failed to fetch tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      const res = await apiFetch(`/api/support/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchTickets();
        if (selectedTicket?._id === id) {
          const updated = await res.json();
          setSelectedTicket(updated.data);
        }
      }
    } catch (err) {
      console.error("Status update failed", err);
    }
  };

  const filteredTickets = tickets.filter(t =>
    t.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.sender.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-20 text-center font-black text-slate-300 uppercase tracking-widest animate-pulse font-sans">Scanning Support Desk...</div>;

  return (
    <div className="p-8 bg-slate-50 min-h-screen font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Support Operations</h1>
          <p className="text-slate-500 font-medium">Monitor and audit all tactical support conversations.</p>
        </div>
        <div className="bg-white border border-slate-200 px-4 py-2 rounded-xl flex items-center gap-4 shadow-sm">
           <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-widest">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              {tickets.filter(t => t.status === 'OPEN').length} Protocols Active
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Directory */}
        <div className="lg:col-span-4 space-y-4">
           <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                 type="text"
                 placeholder="Search logs..."
                 className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl outline-none text-sm font-bold shadow-sm"
                 value={searchTerm}
                 onChange={e => setSearchTerm(e.target.value)}
              />
           </div>

           <div className="space-y-3 h-[65vh] overflow-y-auto pr-2 custom-scrollbar">
              {filteredTickets.map(ticket => (
                <div
                  key={ticket._id}
                  onClick={() => setSelectedTicket(ticket)}
                  className={`p-6 rounded-[2rem] border transition-all cursor-pointer group ${
                    selectedTicket?._id === ticket._id ? 'bg-slate-900 border-slate-900 text-white shadow-2xl' : 'bg-white border-slate-200 hover:border-blue-500'
                  }`}
                >
                   <div className="flex justify-between items-start mb-3">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${
                        ticket.status === 'RESOLVED' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                      }`}>{ticket.status}</span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase">{new Date(ticket.updatedAt).toLocaleDateString()}</span>
                   </div>
                   <h4 className="font-black text-sm mb-1 line-clamp-1">{ticket.subject}</h4>
                   <div className="flex items-center gap-2 mt-4">
                      <div className="w-6 h-6 rounded-lg bg-slate-100 overflow-hidden">
                         <img src={getProfilePic(ticket.sender)} className="w-full h-full object-cover" alt="S" />
                      </div>
                      <p className={`text-[10px] font-bold uppercase tracking-widest ${selectedTicket?._id === ticket._id ? 'text-blue-400' : 'text-slate-500'}`}>
                         {ticket.sender.name} ➔ {ticket.assignedTo.name}
                      </p>
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* Audit View */}
        <div className="lg:col-span-8">
           {selectedTicket ? (
             <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[75vh]">
                <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                   <div className="flex items-center gap-5">
                      <div className="flex -space-x-3">
                         <div className="w-12 h-12 rounded-2xl border-4 border-white overflow-hidden shadow-sm">
                            <img src={getProfilePic(selectedTicket.sender)} className="w-full h-full object-cover" alt="Sender" />
                         </div>
                         <div className="w-12 h-12 rounded-2xl border-4 border-white overflow-hidden shadow-sm">
                            <img src={getProfilePic(selectedTicket.assignedTo)} className="w-full h-full object-cover" alt="Receiver" />
                         </div>
                      </div>
                      <div>
                         <h2 className="text-lg font-black text-slate-900">{selectedTicket.subject}</h2>
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Protocol ID: {selectedTicket._id.slice(-8).toUpperCase()}</p>
                      </div>
                   </div>
                   <div className="flex gap-2">
                      {selectedTicket.status !== 'RESOLVED' && (
                        <button
                           onClick={() => handleStatusUpdate(selectedTicket._id, 'RESOLVED')}
                           className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20"
                        >
                           Close Ticket
                        </button>
                      )}
                      <button onClick={() => setSelectedTicket(null)} className="p-2.5 hover:bg-slate-200 rounded-xl transition-colors"><X size={20}/></button>
                   </div>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
                   {/* Root Log */}
                   <div className="flex gap-5">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0 text-slate-400 font-black">R</div>
                      <div className="space-y-4 flex-1">
                         <div className="bg-slate-50 p-6 rounded-3xl rounded-tl-none border border-slate-100">
                            <p className="text-xs font-black text-blue-600 uppercase tracking-widest mb-3">Initial Report • {selectedTicket.topic}</p>
                            <p className="text-sm text-slate-700 leading-relaxed font-medium">{selectedTicket.description}</p>
                            {selectedTicket.attachment?.url && (
                               <a
                                  href={selectedTicket.attachment.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="mt-4 flex items-center gap-3 p-3 bg-white rounded-2xl border border-slate-200 hover:border-blue-500 transition-all"
                               >
                                  <Paperclip size={16} className="text-blue-600" />
                                  <span className="text-[11px] font-black text-slate-900 uppercase truncate">{selectedTicket.attachment.fileName}</span>
                               </a>
                            )}
                         </div>
                         <p className="text-[10px] font-bold text-slate-400 uppercase ml-1">{new Date(selectedTicket.createdAt).toLocaleString()}</p>
                      </div>
                   </div>

                   {/* Comm Chain */}
                   {(selectedTicket.replies || []).map((reply, i) => (
                      <div key={i} className={`flex gap-5 ${reply.sender._id === selectedTicket.sender._id ? '' : 'flex-row-reverse text-right'}`}>
                         <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 border border-slate-200">
                            <img src={getProfilePic(reply.sender)} className="w-full h-full object-cover" alt="P" />
                         </div>
                         <div className={`max-w-[80%] space-y-3 ${reply.sender._id === selectedTicket.sender._id ? '' : 'items-end'}`}>
                            <div className={`p-6 rounded-3xl shadow-sm ${
                               reply.sender._id === selectedTicket.sender._id ? 'bg-white border border-slate-200 rounded-tl-none' : 'bg-slate-900 text-white rounded-tr-none'
                            }`}>
                               <p className="text-sm leading-relaxed font-medium">{reply.message}</p>
                               {reply.attachment?.url && (
                                  <a
                                     href={reply.attachment.url}
                                     target="_blank"
                                     rel="noopener noreferrer"
                                     className={`mt-4 flex items-center gap-3 p-3 rounded-2xl border transition-all ${
                                        reply.sender._id === selectedTicket.sender._id ? 'bg-slate-50 border-slate-200 hover:border-blue-500' : 'bg-white/10 border-white/10 hover:bg-white/20'
                                     }`}
                                  >
                                     <Paperclip size={16} className={reply.sender._id === selectedTicket.sender._id ? 'text-blue-600' : 'text-blue-400'} />
                                     <span className={`text-[11px] font-black uppercase truncate ${reply.sender._id === selectedTicket.sender._id ? 'text-slate-900' : 'text-white'}`}>{reply.attachment.fileName}</span>
                                  </a>
                               )}
                            </div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">{new Date(reply.createdAt).toLocaleString()}</p>
                         </div>
                      </div>
                   ))}
                </div>

                <div className="p-8 bg-slate-50/50 border-t border-slate-100">
                   <div className="flex items-center gap-3 text-slate-400">
                      <Shield size={16} />
                      <p className="text-[10px] font-black uppercase tracking-widest">Administrative Audit Active • High Security Comm Channel</p>
                   </div>
                </div>
             </div>
           ) : (
             <div className="h-[75vh] bg-white rounded-[3rem] border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-center p-12">
                <Shield className="text-slate-100 mb-6" size={80} />
                <h3 className="text-xl font-black text-slate-300 uppercase">Operational Audit Standby</h3>
                <p className="text-slate-400 text-sm mt-2 max-w-sm">Select a tactical communication log from the directory to review the interaction history.</p>
             </div>
           )}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
      `}} />
    </div>
  );
};

export default SupportManager;
