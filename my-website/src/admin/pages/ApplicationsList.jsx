import React, { useState, useEffect } from 'react';
import { Search, Eye, CheckCircle, XCircle, Clock } from 'lucide-react';

const ApplicationsList = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // simulate API delay
    setTimeout(() => {
      setApplications([
        { _id: '1', candidateName: 'John Doe', position: 'Senior React Developer', status: 'NEW', appliedDate: '2026-08-22' },
        { _id: '2', candidateName: 'Jane Smith', position: 'UI/UX Designer', status: 'SHORTLISTED', appliedDate: '2026-08-21' },
        { _id: '3', candidateName: 'Mike Johnson', position: 'Project Manager', status: 'REJECTED', appliedDate: '2026-08-20' },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'NEW': return <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">New</span>;
      case 'SHORTLISTED': return <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">Shortlisted</span>;
      case 'REJECTED': return <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium">Rejected</span>;
      default: return <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-medium">{status}</span>;
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Job Applications</h1>
        <div className="flex gap-2">
          <button className="bg-white border border-gray-300 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50">Export CSV</button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex gap-4">
          <div className="relative flex-1 max-w-md">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
              <Search size={18} />
            </span>
            <input
              type="text"
              placeholder="Search candidates..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md sm:text-sm"
            />
          </div>
          <select className="border border-gray-300 rounded-md px-3 py-2 text-sm">
            <option>All Statuses</option>
            <option>New</option>
            <option>Shortlisted</option>
            <option>Interview</option>
            <option>Hired</option>
            <option>Rejected</option>
          </select>
        </div>

        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied Date</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan="5" className="px-6 py-4 text-center">Loading...</td></tr>
            ) : applications.map((app) => (
              <tr key={app._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{app.candidateName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{app.position}</td>
                <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(app.status)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{app.appliedDate}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <button className="text-blue-600 hover:text-blue-900"><Eye size={18} /></button>
                  <button className="text-green-600 hover:text-green-900"><CheckCircle size={18} /></button>
                  <button className="text-red-600 hover:text-red-900"><XCircle size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApplicationsList;
