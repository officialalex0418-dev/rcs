import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit2, Trash2, Eye, Briefcase, MapPin, Building2, ToggleLeft, ToggleRight, MoreVertical } from 'lucide-react';

const JobsList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      const backendUrl = import.meta.env.VITE_API_URL || '';
      const token = localStorage.getItem('rcs_admin_token');
      const response = await fetch(`${backendUrl}/api/careers/jobs?admin=true`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) setJobs(data.data);
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleStatusToggle = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'Active' ? 'Closed' : 'Active';
      const backendUrl = import.meta.env.VITE_API_URL || '';
      const token = localStorage.getItem('rcs_admin_token');
      const response = await fetch(`${backendUrl}/api/careers/jobs/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) fetchJobs();
    } catch (err) {
      console.error('Failed to toggle status:', err);
    }
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Vacancy Management</h1>
          <p className="text-slate-500 font-medium">Create and manage job postings for Royal Consultancy.</p>
        </div>
        <Link
          to="/admin/careers/new"
          className="flex items-center gap-2 bg-blue-600 px-5 py-2.5 rounded-xl text-sm font-bold text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
        >
          <Plus size={18} />
          Post New Vacancy
        </Link>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search by role or department..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            {jobs.filter(j => j.status === 'Active').length} Active Roles
          </div>
        </div>

        <div className="overflow-x-auto text-left">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th className="px-8 py-5">Job Profile</th>
                <th className="px-8 py-5">Department & Type</th>
                <th className="px-8 py-5">Engagement Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan="4" className="px-8 py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">Accessing Job Vault...</td></tr>
              ) : jobs.length === 0 ? (
                <tr><td colSpan="4" className="px-8 py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">No Vacancies Found</td></tr>
              ) : jobs.map((job) => (
                <tr key={job._id} className="hover:bg-slate-50/50 transition-all group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                        <Briefcase size={24} />
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900 leading-tight mb-1">{job.title}</p>
                        <span className="text-xs text-slate-400 font-bold flex items-center gap-1.5"><MapPin size={12} /> {job.location}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5"><Building2 size={12} className="text-slate-400" /> {job.department}</span>
                      <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 w-fit px-2 py-0.5 rounded">{job.employmentType}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <button
                      onClick={() => handleStatusToggle(job._id, job.status)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                        job.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-100 text-slate-500 border-slate-200'
                      }`}
                    >
                      {job.status === 'Active' ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                      {job.status}
                    </button>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <Link to={`/admin/careers/edit/${job._id}`} className="p-2.5 bg-slate-50 text-slate-500 rounded-xl hover:bg-slate-900 hover:text-white transition-all shadow-sm">
                        <Edit2 size={18} />
                      </Link>
                      <button className="p-2.5 bg-slate-50 text-red-500 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm">
                        <Trash2 size={18} />
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

export default JobsList;
