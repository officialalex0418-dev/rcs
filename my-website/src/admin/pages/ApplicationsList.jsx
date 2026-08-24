import React, { useState, useEffect } from 'react';
import {
  Search, Eye, Mail, Phone, Calendar, Filter,
  CheckCircle2, User, FileText, Download, UserPlus,
  X, ShieldCheck, Briefcase, LayoutGrid, Send, Clock,
  ChevronDown, MoreVertical
} from 'lucide-react';

const ApplicationsList = () => {
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterJob, setFilterJob] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const [hiredCredentials, setHiredCredentials] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      let backendUrl = import.meta.env.VITE_API_URL || '';
      if (backendUrl.endsWith('/')) {
        backendUrl = backendUrl.slice(0, -1);
      }
      const token = localStorage.getItem('rcs_admin_token');

      const queryParams = new URLSearchParams();
      if (filterJob) queryParams.append('job', filterJob);
      if (filterStatus) queryParams.append('status', filterStatus);

      const [appRes, jobRes] = await Promise.all([
        fetch(`${backendUrl}/api/careers/applications?${queryParams.toString()}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${backendUrl}/api/careers/jobs?admin=true`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      const appData = await appRes.json();
      const jobData = await jobRes.json();

      if (appData.success) setApplications(appData.data);
      if (jobData.success) setJobs(jobData.data);
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filterJob, filterStatus]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      let backendUrl = import.meta.env.VITE_API_URL || '';
      if (backendUrl.endsWith('/')) {
        backendUrl = backendUrl.slice(0, -1);
      }
      const token = localStorage.getItem('rcs_admin_token');
      const response = await fetch(`${backendUrl}/api/careers/applications/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await response.json();

      if (data.success) {
        if (newStatus === 'HIRED' && data.credentials) {
          setHiredCredentials(data.credentials);
        }
        fetchData();
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'NEW': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'SHORTLISTED': return 'bg-purple-50 text-purple-700 border-purple-100';
      case 'SELECTED': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'HIRED': return 'bg-slate-900 text-white border-slate-900';
      case 'REJECTED': return 'bg-red-50 text-red-700 border-red-100';
      default: return 'bg-amber-50 text-amber-700 border-amber-100';
    }
  };

  const getResumeUrl = (url) => {
    if (!url) return '#';
    let base = import.meta.env.VITE_API_URL || '';
    if (base.endsWith('/')) {
      base = base.slice(0, -1);
    }
    // If the API URL ends with /api, strip it for static file access
    if (base.endsWith('/api')) {
      base = base.slice(0, -4);
    }
    const cleanUrl = url.startsWith('/') ? url : `/${url}`;
    return `${base}${cleanUrl}`;
  };

  const filteredApplications = applications.filter(app => {
    const fullName = `${app.firstName} ${app.lastName}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase()) ||
           app.email.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const stats = [
    { label: 'Total Vacancies', value: jobs.length, sub: 'All time posted', icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Active Vacancies', value: jobs.filter(j => j.status === 'Active').length, sub: 'Currently active', icon: LayoutGrid, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Applications Received', value: applications.length, sub: 'Total applications', icon: Send, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Expired Vacancies', value: jobs.filter(j => j.status === 'Closed' || j.status === 'Archived').length, sub: 'No longer active', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' }
  ];

  return (
    <div className="p-8 bg-slate-50 min-h-screen font-sans relative">
      {/* Hiring Success Modal */}
      {hiredCredentials && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[1000] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldCheck size={40} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">Personnel Onboarded!</h2>
              <p className="text-slate-500 font-medium mb-8">The candidate has been hired and a staff portal account has been provisioned.</p>

              <div className="bg-slate-50 rounded-2xl p-6 mb-8 space-y-4 text-left border border-slate-100">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Login Email</p>
                  <p className="font-bold text-slate-900">{hiredCredentials.email}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Temporary Password</p>
                  <p className="font-mono font-black text-blue-600 text-lg tracking-wider">{hiredCredentials.password}</p>
                </div>
              </div>

              <button
                onClick={() => setHiredCredentials(null)}
                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-slate-900/10 transition-transform active:scale-95"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Recruitment Pipeline</h1>
          <p className="text-slate-500 font-medium mt-1">Monitor candidate applications and manage onboarding.</p>
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

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search by candidate name..."
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 transition-all text-sm font-bold"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative">
          <select
            className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 transition-all text-sm font-bold appearance-none cursor-pointer"
            value={filterJob}
            onChange={(e) => setFilterJob(e.target.value)}
          >
            <option value="">All Job Vacancies</option>
            {jobs.map(job => <option key={job._id} value={job._id}>{job.title}</option>)}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
        </div>
        <div className="relative">
          <select
            className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 transition-all text-sm font-bold appearance-none cursor-pointer"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Pipeline Stages</option>
            <option value="NEW">New Application</option>
            <option value="SHORTLISTED">Shortlisted</option>
            <option value="INTERVIEW_ROUND_1">Interview Round 1</option>
            <option value="INTERVIEW_ROUND_2">Interview Round 2</option>
            <option value="INTERVIEW_ROUND_3">Interview Round 3</option>
            <option value="SELECTED">Final Selection</option>
            <option value="HIRED">Hired (Onboarded)</option>
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto text-left">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th className="px-8 py-5">Candidate Profile</th>
                <th className="px-8 py-5">Applied For</th>
                <th className="px-8 py-5">Current Stage</th>
                <th className="px-8 py-5 text-right">Pipeline Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan="4" className="px-8 py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">Scanning Applicant Pool...</td></tr>
              ) : filteredApplications.length === 0 ? (
                <tr><td colSpan="4" className="px-8 py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">No applicants found for this criteria</td></tr>
              ) : filteredApplications.map((app) => (
                <tr key={app._id} className="hover:bg-slate-50/50 transition-all group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center font-black text-lg">
                        {app.firstName.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900 leading-tight mb-1">{app.firstName} {app.lastName}</p>
                        <div className="flex items-center gap-3">
                           <span className="text-[11px] text-slate-400 font-bold flex items-center gap-1.5"><Mail size={12} /> {app.email}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-sm font-black text-slate-800 leading-snug">{app.job?.title || 'Unknown'}</p>
                    <span className="text-[11px] text-slate-400 font-bold flex items-center gap-1.5 mt-1.5"><Calendar size={12} /> {new Date(app.createdAt).toLocaleDateString()}</span>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1.5 inline-flex text-[10px] font-black uppercase tracking-widest rounded-xl border ${getStatusColor(app.status)}`}>
                      {app.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2">
                      <select
                        onChange={(e) => handleStatusChange(app._id, e.target.value)}
                        className="p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-black uppercase tracking-widest outline-none hover:border-blue-500 cursor-pointer"
                        value={app.status}
                      >
                        <option value="NEW">New</option>
                        <option value="SHORTLISTED">Shortlist</option>
                        <option value="INTERVIEW_ROUND_1">Interview R1</option>
                        <option value="INTERVIEW_ROUND_2">Interview R2</option>
                        <option value="INTERVIEW_ROUND_3">Interview R3</option>
                        <option value="SELECTED">Select</option>
                        <option value="HIRED">Hire (Onboard)</option>
                        <option value="REJECTED">Reject</option>
                      </select>
                      {app.resume?.url && (
                        <div className="flex gap-2">
                          <a
                            href={getResumeUrl(app.resume.url)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                            title="View Resume"
                          >
                            <Eye size={18} />
                          </a>
                          <a
                            href={getResumeUrl(app.resume.url)}
                            download={app.resume.fileName || 'resume'}
                            className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                            title="Download Resume"
                          >
                            <Download size={18} />
                          </a>
                        </div>
                      )}
                      <button className="p-2 text-slate-400 hover:text-slate-900 transition-all rounded-lg hover:bg-slate-100">
                        <MoreVertical size={18} />
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

export default ApplicationsList;
