import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit2, Trash2, Eye } from 'lucide-react';

const JobsList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Placeholder data - will be replaced with API call
  useEffect(() => {
    const fetchJobs = async () => {
      // simulate API delay
      setTimeout(() => {
        setJobs([
          { _id: '1', title: 'Senior React Developer', department: 'Engineering', location: 'Remote', status: 'Published', createdAt: '2026-08-20' },
          { _id: '2', title: 'UI/UX Designer', department: 'Design', location: 'Kathmandu', status: 'Draft', createdAt: '2026-08-21' },
          { _id: '3', title: 'Project Manager', department: 'Operations', location: 'Hybrid', status: 'Published', createdAt: '2026-08-22' },
        ]);
        setLoading(true); // Wait, this should be false, but I'll fix it in the next step or keep as is for now if I just want to show UI
        setLoading(false);
      }, 500);
    };
    fetchJobs();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Job Openings</h1>
        <Link
          to="/admin/careers/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-700 transition"
        >
          <Plus size={20} />
          Add New Job
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center">
          <div className="relative flex-1 max-w-md">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
              <Search size={18} />
            </span>
            <input
              type="text"
              placeholder="Search jobs..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posted Date</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">Loading jobs...</td>
                </tr>
              ) : jobs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">No jobs found</td>
                </tr>
              ) : (
                jobs.map((job) => (
                  <tr key={job._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{job.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{job.department}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{job.location}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        job.status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(job.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                      <button className="text-gray-400 hover:text-blue-600"><Eye size={18} /></button>
                      <button className="text-gray-400 hover:text-green-600"><Edit2 size={18} /></button>
                      <button className="text-gray-400 hover:text-red-600"><Trash2 size={18} /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default JobsList;
