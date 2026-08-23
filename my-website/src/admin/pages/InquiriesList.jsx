import React, { useState, useEffect } from 'react';
import {
  Search,
  Eye,
  Mail,
  Phone,
  Calendar,
  Filter,
  Send,
  MessageSquare,
  X,
  User,
  ArrowRight,
  ShieldCheck,
  Zap,
  MoreVertical
} from 'lucide-react';

const InquiriesList = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

  const fetchInquiries = async () => {
    try {
      const backendUrl = import.meta.env.VITE_API_URL || '';
      const token = localStorage.getItem('rcs_admin_token');
      const response = await fetch(`${backendUrl}/api/inquiries`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) setInquiries(data.data);
    } catch (err) {
      console.error('Failed to fetch inquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const openThread = async (id) => {
    try {
      const backendUrl = import.meta.env.VITE_API_URL || '';
      const token = localStorage.getItem('rcs_admin_token');
      const response = await fetch(`${backendUrl}/api/inquiries/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) setSelectedInquiry(data.data);
    } catch (err) {
      console.error('Failed to load thread:', err);
    }
  };

  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyMessage.trim()) return;

    setSendingReply(true);
    try {
      const backendUrl = import.meta.env.VITE_API_URL || '';
      const token = localStorage.getItem('rcs_admin_token');
      const response = await fetch(`${backendUrl}/api/inquiries/${selectedInquiry._id}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message: replyMessage })
      });

      const data = await response.json();
      if (data.success) {
        setSelectedInquiry(data.data);
        setReplyMessage('');
        fetchInquiries(); // Refresh status in list
      }
    } catch (err) {
      console.error('Failed to send reply:', err);
    } finally {
      setSendingReply(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'NEW': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'CONTACTED': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'WON': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      default: return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen font-sans relative">
      {/* Thread Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[1000] flex items-center justify-end">
          <div className="bg-white h-screen w-full max-w-2xl shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
               <div>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">{selectedInquiry.subject}</h2>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Ref: {selectedInquiry._id.substring(0, 8)}</p>
               </div>
               <button
                 onClick={() => setSelectedInquiry(null)}
                 className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-red-50 hover:text-red-500 transition-all"
               >
                 <X size={20} />
               </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-white custom-scrollbar">
               {selectedInquiry.thread.map((msg, idx) => (
                 <div key={idx} className={`flex flex-col ${msg.sender === 'ADMIN' ? 'items-end' : 'items-start'}`}>
                   <div className="flex items-center gap-2 mb-2">
                     <span className={`text-[10px] font-black uppercase tracking-widest ${msg.sender === 'ADMIN' ? 'text-blue-600' : 'text-emerald-600'}`}>
                        {msg.sender === 'ADMIN' ? 'RCS Management' : selectedInquiry.name}
                     </span>
                     <span className="text-[10px] text-slate-400 font-bold">{new Date(msg.timestamp).toLocaleString()}</span>
                   </div>
                   <div className={`max-w-[85%] p-5 rounded-3xl text-sm leading-relaxed ${
                     msg.sender === 'ADMIN'
                     ? 'bg-slate-900 text-white rounded-tr-none shadow-xl shadow-slate-900/10'
                     : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200/50'
                   }`}>
                      {msg.message}
                   </div>
                 </div>
               ))}
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-200">
               <form onSubmit={handleReply} className="space-y-4">
                  <div className="relative">
                    <textarea
                      rows="4"
                      className="w-full px-6 py-4 bg-white border border-slate-200 rounded-3xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-medium leading-relaxed"
                      placeholder="Compose your professional response..."
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                    />
                    <div className="absolute bottom-4 right-4">
                      <Zap size={18} className="text-yellow-500 opacity-20" />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={sendingReply || !replyMessage.trim()}
                    className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-[0.98] disabled:opacity-50"
                  >
                    {sendingReply ? 'Dispatching...' : <><Send size={18} /> Send Message</>}
                  </button>
               </form>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Lead Capture</h1>
          <p className="text-slate-500 font-medium">Manage project and contact inquiries with threaded history.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
            <Filter size={18} />
            Advanced Filter
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50/30 flex items-center gap-4">
          <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search leads by name, email, or intent..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto text-left">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th className="px-8 py-5">Prospect Profile</th>
                <th className="px-8 py-5">Engagement Status</th>
                <th className="px-8 py-5">Last Interaction</th>
                <th className="px-8 py-5 text-right">Conversation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan="4" className="px-8 py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">Scanning Inquiry Channels...</td></tr>
              ) : inquiries.length === 0 ? (
                <tr><td colSpan="4" className="px-8 py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">No active leads detected</td></tr>
              ) : inquiries.map((lead) => (
                <tr key={lead._id} className="hover:bg-slate-50/50 transition-all group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 text-slate-600 flex items-center justify-center font-black text-lg">
                        {lead.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900 leading-tight mb-1">{lead.name}</p>
                        <span className="text-xs text-slate-400 font-bold flex items-center gap-1.5"><Mail size={12} /> {lead.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1.5 inline-flex text-[10px] font-black uppercase tracking-widest rounded-xl border ${getStatusColor(lead.status)}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-bold">
                       <Calendar size={14} className="text-slate-400" />
                       {new Date(lead.lastContactedAt || lead.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button
                      onClick={() => openThread(lead._id)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-50 text-blue-600 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                    >
                      <MessageSquare size={16} /> View Thread
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InquiriesList;
