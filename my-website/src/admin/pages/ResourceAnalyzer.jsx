import React, { useState, useEffect } from 'react';
import {
  Users, BarChart2, AlertCircle, CheckCircle2,
  ChevronRight, Search, Filter, Activity, Zap
} from 'lucide-react';
import { apiFetch } from '../../utils/api';

const ResourceAnalyzer = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchResourceData = async () => {
    try {
      const [empRes, projRes] = await Promise.all([
        apiFetch('/api/employees'),
        apiFetch('/api/projects')
      ]);
      const emps = await empRes.json();
      const projs = await projRes.json();

      if (emps.success && projs.success) {
        // Calculate allocation for each employee
        const analyzerData = emps.data.map(emp => {
          const assignments = projs.data.filter(p =>
            p.team?.some(m => (m.user?._id || m.user) === emp._id) ||
            (p.manager?._id || p.manager) === emp._id
          ).map(p => {
             const teamEntry = p.team?.find(m => (m.user?._id || m.user) === emp._id);
             return {
                projectName: p.name,
                role: teamEntry?.role || (p.manager?._id === emp._id ? 'Project Strategist' : 'Support'),
                allocation: teamEntry?.allocation || 100
             };
          });

          const totalAllocation = assignments.reduce((acc, curr) => acc + curr.allocation, 0);

          return {
            ...emp,
            assignments,
            totalAllocation,
            status: totalAllocation > 100 ? 'OVERLOADED' : totalAllocation === 0 ? 'AVAILABLE' : 'STABLE'
          };
        });
        setData(analyzerData);
      }
    } catch (err) {
      console.error('Resource fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResourceData();
  }, []);

  const filteredData = data.filter(d =>
    d.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-20 text-center font-black text-slate-300 uppercase tracking-widest animate-pulse">Analyzing Resource Density...</div>;

  return (
    <div className="p-8 bg-slate-50 min-h-screen font-sans space-y-10 animate-in fade-in duration-700">

      {/* Header */}
      <div className="flex justify-between items-center">
         <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
               <Activity className="text-blue-600" size={32} /> Resource Intelligence
            </h1>
            <p className="text-slate-500 font-medium">Real-time visibility into team capacity and mission density.</p>
         </div>
         <div className="relative group max-w-xs w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
            <input
               type="text"
               placeholder="Filter by name or unit..."
               className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/5 transition-all text-sm font-bold"
               value={searchTerm}
               onChange={e => setSearchTerm(e.target.value)}
            />
         </div>
      </div>

      {/* Analyzer Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
         {filteredData.map(res => (
           <div key={res._id} className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col hover:shadow-xl transition-all">
              <div className="p-8 flex items-center gap-6 border-b border-slate-50">
                 <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl font-black shadow-inner">
                    {res.name?.charAt(0)}
                 </div>
                 <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                       <h3 className="text-lg font-black text-slate-900">{res.name}</h3>
                       <span className={`px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border ${
                          res.status === 'OVERLOADED' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                          res.status === 'AVAILABLE' ? 'bg-slate-50 text-slate-400 border-slate-200' :
                          'bg-emerald-50 text-emerald-600 border-emerald-100'
                       }`}>{res.status}</span>
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{res.designation} • {res.department}</p>
                 </div>
              </div>

              <div className="p-8 bg-slate-50/50 flex-1 space-y-6">
                 <div>
                    <div className="flex justify-between items-end mb-3">
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Aggregate Workload</p>
                       <p className={`text-sm font-black ${res.totalAllocation > 100 ? 'text-rose-600' : 'text-slate-900'}`}>{res.totalAllocation}%</p>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                       <div
                          className={`h-full transition-all duration-1000 ${res.totalAllocation > 100 ? 'bg-rose-500' : 'bg-blue-600'}`}
                          style={{ width: `${Math.min(res.totalAllocation, 100)}%` }}
                       ></div>
                    </div>
                 </div>

                 <div className="space-y-3">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4">Active Assignments</p>
                    {res.assignments.map((as, idx) => (
                       <div key={idx} className="flex justify-between items-center p-4 bg-white border border-slate-200 rounded-2xl">
                          <div className="flex items-center gap-3">
                             <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                             <p className="text-xs font-black text-slate-800">{as.projectName}</p>
                          </div>
                          <div className="text-right">
                             <p className="text-[10px] font-bold text-slate-400 uppercase">{as.role}</p>
                             <p className="text-[10px] font-black text-blue-600">{as.allocation}%</p>
                          </div>
                       </div>
                    ))}
                    {res.assignments.length === 0 && <p className="text-xs text-slate-400 italic py-4 text-center">No tactical assignments detected.</p>}
                 </div>
              </div>
           </div>
         ))}
      </div>

    </div>
  );
};

export default ResourceAnalyzer;
