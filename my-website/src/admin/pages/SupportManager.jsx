import React, { useState, useEffect } from 'react';
import { MessageSquare, AlertCircle, CheckCircle2, MoreVertical, Search, User, Mail, Zap } from 'lucide-react';

const SupportManager = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const backendUrl = import.meta.env.VITE_API_URL || '';
        const token = localStorage.getItem('rcs_admin_token');
        const response = await fetch(`${backendUrl}/api/support`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (data.success) setTickets(data.data);
      } catch (err) {
        console.error('Failed to fetch tickets:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  return (
    <div className="p-8 bg-slate-50 min-h-screen font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Support Desk</h1>
          <p className="text-slate-500 font-medium">Manage and resolve tickets from employees and customers.</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-white border border-slate-200 px-4 py-2 rounded-xl flex items-center gap-4 shadow-sm">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-widest border-r border-slate-100 pr-4">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              {tickets.filter(t => t.status === 'OPEN').length} Open
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-widest border-r border-slate-100 pr-4">
              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
              {tickets.filter(t => t.status === 'IN_PROGRESS').length} Active
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-widest">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              {tickets.filter(t => t.status === 'RESOLVED').length} Done
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search by subject or ticket ID..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none"
            />
          </div>
          <button className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-slate-900/10">
            <Zap size={16} />
            Quick Resolve
          </button>
        </div>

        <div className="divide-y divide-slate-100 text-left">
          {loading ? (
             <div className="py-20 text-center font-bold text-slate-400 uppercase tracking-widest text-xs">Scanning Support Database...</div>
          ) : tickets.length === 0 ? (
             <div className="py-20 text-center font-bold text-slate-400 uppercase tracking-widest text-xs">No active support tickets found</div>
          ) : tickets.map((ticket) => (
            <div key={ticket._id} className="p-6 hover:bg-slate-50/50 transition-colors group cursor-pointer">
              <div className="flex justify-between items-start gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${
                      ticket.type === 'EMPLOYEE' ? 'bg-indigo-50 text-indigo-600' : 'bg-orange-50 text-orange-600'
                    }`}>
                      {ticket.type}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${
                      ticket.priority === 'URGENT' ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {ticket.priority}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">{ticket.subject}</h3>
                  <p className="text-slate-500 text-sm line-clamp-1 mb-4">{ticket.description}</p>

                  <div className="flex flex-wrap items-center gap-6">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center">
                        <User size={12} className="text-slate-500" />
                      </div>
                      <span className="text-xs font-bold text-slate-700">{ticket.sender.name}</span>
                      <span className="text-xs text-slate-400 font-medium ml-1 flex items-center gap-1"><Mail size={10} /> {ticket.sender.email}</span>
                    </div>
                    <div className="h-4 w-px bg-slate-200"></div>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-tighter">
                      <MessageSquare size={14} className="text-slate-400" />
                      {ticket.replies?.length || 0} Replies
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-4">
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest border ${
                    ticket.status === 'RESOLVED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                    ticket.status === 'IN_PROGRESS' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                    'bg-blue-50 text-blue-600 border-blue-100'
                  }`}>
                    {ticket.status === 'RESOLVED' ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                    {ticket.status}
                  </div>
                  <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
                    <MoreVertical size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SupportManager;
