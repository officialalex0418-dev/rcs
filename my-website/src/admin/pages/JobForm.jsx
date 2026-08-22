import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';

const JobForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    department: 'Engineering',
    location: '',
    employmentType: 'Full-time',
    workMode: 'On-site',
    description: '',
    status: 'Draft',
    deadline: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Saving job:', formData);
    // Add logic to save to backend
    navigate('/admin/careers');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/careers')}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">
            {isEdit ? 'Edit Job Posting' : 'Create New Job Posting'}
          </h1>
        </div>
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-6 py-2 rounded-md flex items-center gap-2 hover:bg-blue-700 transition"
        >
          <Save size={20} />
          {isEdit ? 'Update Job' : 'Publish Job'}
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <form className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
              <input
                type="text"
                name="title"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g. Senior Backend Engineer"
                value={formData.title}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <select
                name="department"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={formData.department}
                onChange={handleChange}
              >
                <option>Engineering</option>
                <option>Design</option>
                <option>Marketing</option>
                <option>Sales</option>
                <option>Operations</option>
                <option>HR</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                name="location"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g. Kathmandu or Remote"
                value={formData.location}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Employment Type</label>
              <select
                name="employmentType"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={formData.employmentType}
                onChange={handleChange}
              >
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Contract</option>
                <option>Internship</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Work Mode</label>
              <select
                name="workMode"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={formData.workMode}
                onChange={handleChange}
              >
                <option>On-site</option>
                <option>Remote</option>
                <option>Hybrid</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Application Deadline</label>
              <input
                type="date"
                name="deadline"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={formData.deadline}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                name="status"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={formData.status}
                onChange={handleChange}
              >
                <option>Draft</option>
                <option>Published</option>
                <option>Closed</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Description</label>
              <textarea
                rows="8"
                name="description"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe the role, responsibilities, and requirements..."
                value={formData.description}
                onChange={handleChange}
              ></textarea>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobForm;
