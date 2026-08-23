import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus, Search, Edit2, Trash2, Eye, Briefcase, MapPin,
  Building2, ToggleLeft, ToggleRight, MoreVertical,
  ChevronDown, Send, Clock, LayoutGrid, List, Filter,
  ChevronLeft, ChevronRight
} from 'lucide-react';

const JobsList = () => {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [deptFilter, setDeptFilter] = useState('All Departments');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [activeMenu, setActiveMenu] = useState(null);

  const fetchData = async () => {
    try {
      let backendUrl = import.meta.env.VITE_API_URL || '';
      if (backendUrl.endsWith('/')) {
        backendUrl = backendUrl.slice(0, -1);
      }
      const token = localStorage.getItem('rcs_admin_token');

      const [jobsRes, appsRes] = await Promise.all([
        fetch(`${backendUrl}/api/careers/jobs?admin=true`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${backendUrl}/api/careers/applications`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      const jobsData = await jobsRes.json();
      const appsData = await appsRes.json();

      if (jobsData.success) setJobs(jobsData.data);
      if (appsData.success) setApplications(appsData.data);
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const handleClickOutside = () => setActiveMenu(null);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this vacancy? This action cannot be undone.')) return;

    try {
      let backendUrl = import.meta.env.VITE_API_URL || '';
      if (backendUrl.endsWith('/')) {
        backendUrl = backendUrl.slice(0, -1);
      }
      const token = localStorage.getItem('rcs_admin_token');
      const response = await fetch(`${backendUrl}/api/careers/jobs/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();

      if (response.ok) {
        alert('Vacancy deleted successfully');
        fetchData();
      } else {
        alert(data.message || 'Failed to delete vacancy');
      }
    } catch (err) {
      console.error('Failed to delete job:', err);
      alert('Network error');
    }
  };

  const handleStatusToggle = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'Active' ? 'Closed' : 'Active';
      let backendUrl = import.meta.env.VITE_API_URL || '';
      if (backendUrl.endsWith('/')) {
        backendUrl = backendUrl.slice(0, -1);
      }
      const token = localStorage.getItem('rcs_admin_token');
      const response = await fetch(`${backendUrl}/api/careers/jobs/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) fetchData();
    } catch (err) {
      console.error('Failed to toggle status:', err);
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All Status' || job.status === statusFilter;
    const matchesDept = deptFilter === 'All Departments' || job.department === deptFilter;
    return matchesSearch && matchesStatus && matchesDept;
  });

  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const paginatedJobs = filteredJobs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const stats = [
    { label: 'Total Vacancies', value: jobs.length, sub: 'All time posted', icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Active Vacancies', value: jobs.filter(j => j.status === 'Active').length, sub: 'Currently active', icon: LayoutGrid, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Applications Received', value: applications.length, sub: 'Total applications', icon: Send, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Expired Vacancies', value: jobs.filter(j => j.status === 'Closed' || j.status === 'Archived').length, sub: 'No longer active', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' }
  ];

  return (
    <div className="p-8 bg-slate-50 min-h-screen font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Vacancy Management</h1>
          <p className="text-slate-500 text-sm font-medium">Create and manage job postings for Royal Consultancy.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/admin/careers/new"
            className="flex items-center gap-2 bg-blue-600 px-5 py-2.5 rounded-xl text-sm font-bold text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
          >
            <Plus size={18} />
            Post New Vacancy
            <ChevronDown size={16} className="ml-1 opacity-60" />
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-5">
            <div className={`w-14 h-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
              <stat.icon size={28} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-900">{stat.value}</span>
                <span className="text-[10px] font-bold text-slate-400">{stat.sub}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden mb-8">
        <div className="p-6 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search by job title, role or department..."
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:flex-initial">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <select
                className="pl-10 pr-10 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none appearance-none cursor-pointer hover:border-slate-300 transition-all min-w-[180px]"
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
              >
                <option>All Departments</option>
                {[...new Set(jobs.map(j => j.department))].map(d => <option key={d}>{d}</option>)}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
            </div>
            <div className="relative flex-1 md:flex-initial">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <select
                className="pl-10 pr-10 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none appearance-none cursor-pointer hover:border-slate-300 transition-all min-w-[150px]"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option>All Status</option>
                <option>Active</option>
                <option>Draft</option>
                <option>Closed</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
            </div>
            <button className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:text-slate-600 transition-all">
              <List size={20} />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto text-left">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th className="px-8 py-4">Job Title <ChevronDown size={12} className="inline ml-1 opacity-40" /></th>
                <th className="px-8 py-4">Department <ChevronDown size={12} className="inline ml-1 opacity-40" /></th>
                <th className="px-8 py-4">Type <ChevronDown size={12} className="inline ml-1 opacity-40" /></th>
                <th className="px-8 py-4">Location <ChevronDown size={12} className="inline ml-1 opacity-40" /></th>
                <th className="px-8 py-4">Status <ChevronDown size={12} className="inline ml-1 opacity-40" /></th>
                <th className="px-8 py-4">Posted On <ChevronDown size={12} className="inline ml-1 opacity-40" /></th>
                <th className="px-8 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan="7" className="px-8 py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">Accessing Job Vault...</td></tr>
              ) : paginatedJobs.length === 0 ? (
                <tr><td colSpan="7" className="px-8 py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">No Vacancies Found</td></tr>
              ) : paginatedJobs.map((job, idx) => (
                <tr key={job._id} className="hover:bg-slate-50/50 transition-all group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        idx % 4 === 0 ? 'bg-blue-50 text-blue-600' :
                        idx % 4 === 1 ? 'bg-emerald-50 text-emerald-600' :
                        idx % 4 === 2 ? 'bg-purple-50 text-purple-600' :
                        'bg-orange-50 text-orange-600'
                      }`}>
                        <Briefcase size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 leading-tight mb-0.5">{job.title}</p>
                        <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">RC-{new Date(job.createdAt).getFullYear()}-{job._id.slice(-2)}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-sm font-medium text-slate-500">{job.department}</span>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      job.employmentType === 'Full-time' ? 'bg-blue-50 text-blue-600' :
                      job.employmentType === 'Part-time' ? 'bg-purple-50 text-purple-600' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {job.employmentType}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-sm font-medium text-slate-500 flex items-center gap-1.5">
                      <MapPin size={14} className="text-slate-300" /> {job.location}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        job.status === 'Active' ? 'bg-emerald-500' : 'bg-red-500'
                      }`}></div>
                      <span className={`text-[11px] font-bold ${
                        job.status === 'Active' ? 'text-emerald-600' : 'text-red-600'
                      }`}>
                        {job.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-sm font-medium text-slate-500">
                      {new Date(job.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right relative">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenu(activeMenu === job._id ? null : job._id);
                        }}
                        className="p-2 text-slate-400 hover:text-slate-900 transition-all rounded-lg hover:bg-slate-100"
                      >
                        <MoreVertical size={18} />
                      </button>

                      {activeMenu === job._id && (
                        <div className="absolute right-8 top-12 w-32 bg-white rounded-xl shadow-xl border border-slate-100 z-50 py-1 overflow-hidden">
                          <Link
                            to={`/admin/careers/edit/${job._id}`}
                            className="w-full flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-all"
                          >
                            <Edit2 size={14} /> Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(job._id)}
                            className="w-full flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all border-t border-slate-50"
                          >
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-6 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredJobs.length)} of {filteredJobs.length} results
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className="p-2 text-slate-400 hover:text-slate-900 disabled:opacity-30 transition-all"
              disabled={currentPage === 1}
            >
              <ChevronLeft size={18} />
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                  currentPage === i + 1
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                    : 'text-slate-500 hover:bg-slate-100'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              className="p-2 text-slate-400 hover:text-slate-900 disabled:opacity-30 transition-all"
              disabled={currentPage === totalPages}
            >
              <ChevronRight size={18} />
            </button>
          </div>
          <div className="flex items-center gap-3">
             <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Show</span>
             <select
               value={itemsPerPage}
               onChange={(e) => {
                 setItemsPerPage(Number(e.target.value));
                 setCurrentPage(1);
               }}
               className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold outline-none cursor-pointer hover:border-slate-300 transition-all"
             >
               <option value={10}>10</option>
               <option value={20}>20</option>
               <option value={50}>50</option>
             </select>
             <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">per page</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobsList;
