import React, { useState, useEffect } from 'react';
import { Search, Eye, Mail, Phone, Calendar, MoreVertical, Filter, MessageCircle, Send } from 'lucide-react';

const InquiriesList = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    fetchInquiries();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'NEW': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'CONTACTED': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'QUALIFIED': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'WON': return 'bg-indigo-50 text-indigo-700 border-indigo-100';
      case 'LOST': return 'bg-red-50 text-red-700 border-red-100';
      default: return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Lead Capture</h1>
          <p className="text-slate-500 font-medium">Review and respond to project and contact inquiries.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
            <Filter size={18} />
            Advanced Filter
          </button>
          <button className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20">
            Export Data
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
                <th className="px-8 py-5">Project Intent</th>
                <th className="px-8 py-5">Engagement Status</th>
                <th className="px-8 py-5 text-right">Quick Response</th>
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
                        <div className="flex flex-col gap-0.5">
                           <span className="text-xs text-slate-400 font-bold flex items-center gap-1.5"><Mail size={12} /> {lead.email}</span>
                           <span className="text-xs text-slate-400 font-bold flex items-center gap-1.5"><Phone size={12} /> {lead.phone || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-sm font-black text-slate-800 leading-snug">{lead.subject}</p>
                    <div className="flex items-center gap-3 mt-2">
                       <span className="text-[10px] font-black text-slate-400 uppercase bg-slate-100 px-2 py-0.5 rounded tracking-widest">{lead.service || 'General'}</span>
                       <span className="text-[11px] text-slate-400 font-bold flex items-center gap-1.5"><Calendar size={12} /> {new Date(lead.createdAt).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1.5 inline-flex text-[10px] font-black uppercase tracking-widest rounded-xl border ${getStatusColor(lead.status)}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                      <button className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm" title="Reply Email">
                        <Send size={18} />
                      </button>
                      <button className="p-2.5 bg-slate-50 text-slate-500 rounded-xl hover:bg-slate-900 hover:text-white transition-all shadow-sm">
                        <Eye size={18} />
                      </button>
                    </div>
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
