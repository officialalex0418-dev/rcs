import React, { useState, useEffect } from 'react';
import { Search, Eye, Mail, Phone, Calendar, MoreVertical, Filter } from 'lucide-react';

const InquiriesList = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // simulate API delay
    setTimeout(() => {
      setInquiries([
        {
          _id: '1',
          name: 'Alex Sharma',
          email: 'alex@example.com',
          phone: '+977-9800000000',
          subject: 'Website Development',
          status: 'NEW',
          priority: 'HIGH',
          createdAt: '2026-08-22'
        },
        {
          _id: '2',
          name: 'Business Corp',
          email: 'contact@bizcorp.com',
          phone: '+977-9811111111',
          subject: 'SEO Services Inquiry',
          status: 'CONTACTED',
          priority: 'MEDIUM',
          createdAt: '2026-08-21'
        },
        {
          _id: '3',
          name: 'Rita Rai',
          email: 'rita@gmail.com',
          phone: '+977-9822222222',
          subject: 'Mobile App Project',
          status: 'QUALIFIED',
          priority: 'URGENT',
          createdAt: '2026-08-20'
        },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'NEW': return 'bg-blue-100 text-blue-800';
      case 'CONTACTED': return 'bg-yellow-100 text-yellow-800';
      case 'QUALIFIED': return 'bg-green-100 text-green-800';
      case 'WON': return 'bg-emerald-100 text-emerald-800';
      case 'LOST': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'URGENT': return 'text-red-600';
      case 'HIGH': return 'text-orange-600';
      case 'MEDIUM': return 'text-yellow-600';
      case 'LOW': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Inquiry CRM</h1>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50">
            <Filter size={18} />
            Filter
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition">
            Export Leads
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
              <Search size={18} />
            </span>
            <input
              type="text"
              placeholder="Search leads by name, email or subject..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md sm:text-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <select className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white">
            <option>All Sources</option>
            <option>Website Form</option>
            <option>Project Inquiry</option>
            <option>Direct Email</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lead Info</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan="6" className="px-6 py-4 text-center text-gray-500">Loading inquiries...</td></tr>
              ) : inquiries.map((lead) => (
                <tr key={lead._id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-900">{lead.name}</span>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                        <Mail size={12} /> {lead.email}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-500">
                        <Phone size={12} /> {lead.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                    {lead.subject}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold">
                    <span className={getPriorityColor(lead.priority)}>{lead.priority}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded ${getStatusColor(lead.status)}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex items-center gap-1">
                    <Calendar size={14} />
                    {lead.createdAt}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <button className="p-1 hover:bg-blue-50 text-blue-600 rounded" title="View Details">
                        <Eye size={18} />
                      </button>
                      <button className="p-1 hover:bg-gray-100 text-gray-600 rounded">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">1</span> to <span className="font-medium">3</span> of <span className="font-medium">3</span> results
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50" disabled>Previous</button>
            <button className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50" disabled>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InquiriesList;
