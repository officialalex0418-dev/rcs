import React from 'react';
import {
  Users,
  Briefcase,
  MessageSquare,
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

const AdminDashboard = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Business Overview</h1>
          <p className="text-gray-500">Welcome to the RCS Management Platform</p>
        </div>
        <div className="flex gap-3">
          <div className="text-right">
            <p className="text-xs text-gray-400 uppercase font-bold">System Status</p>
            <div className="flex items-center gap-1 text-green-600 font-medium">
              <CheckCircle2 size={14} />
              <span>All Systems Operational</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Active Projects', value: '12', icon: <Clock className="text-blue-600" />, trend: '+2 this month', color: 'blue' },
          { label: 'New Applications', value: '45', icon: <Users className="text-purple-600" />, trend: '12 pending review', color: 'purple' },
          { label: 'Open Inquiries', value: '08', icon: <MessageSquare className="text-yellow-600" />, trend: '3 high priority', color: 'yellow' },
          { label: 'Conversion Rate', value: '24%', icon: <TrendingUp className="text-green-600" />, trend: '+4.5% vs last month', color: 'green' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-lg bg-${stat.color}-50`}>
                {stat.icon}
              </div>
            </div>
            <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
              <span className="text-xs text-gray-400">{stat.trend}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
            <button className="text-sm text-blue-600 font-semibold hover:underline">View All</button>
          </div>
          <div className="divide-y divide-gray-100">
            {[
              { type: 'APPLICATION', user: 'John Doe', action: 'applied for', target: 'Senior React Developer', time: '2 hours ago' },
              { type: 'INQUIRY', user: 'Tech Solutions', action: 'sent a new inquiry regarding', target: 'Cloud Migration', time: '5 hours ago' },
              { type: 'PROJECT', user: 'Admin', action: 'updated status of', target: 'E-commerce Redesign', time: '1 day ago' },
              { type: 'JOB', user: 'HR Manager', action: 'published new job', target: 'UI/UX Designer', time: '2 days ago' },
            ].map((activity, i) => (
              <div key={i} className="p-4 flex items-start gap-4 hover:bg-gray-50 transition">
                <div className="mt-1">
                  {activity.type === 'APPLICATION' && <Users size={16} className="text-purple-500" />}
                  {activity.type === 'INQUIRY' && <MessageSquare size={16} className="text-yellow-500" />}
                  {activity.type === 'PROJECT' && <Clock size={16} className="text-blue-500" />}
                  {activity.type === 'JOB' && <Briefcase size={16} className="text-green-500" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">
                    <span className="font-bold">{activity.user}</span> {activity.action} <span className="font-medium text-blue-600">{activity.target}</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Project Health / Alerts */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Attention Required</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg border border-red-100">
              <AlertCircle size={20} className="text-red-600 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-red-900">Project at Risk</p>
                <p className="text-xs text-red-700">Mobile Banking App is delayed by 4 days.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg border border-yellow-100">
              <AlertCircle size={20} className="text-yellow-600 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-yellow-900">Pending Approval</p>
                <p className="text-xs text-yellow-700">3 gallery items waiting for content review.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <Clock size={20} className="text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-blue-900">Interview Today</p>
                <p className="text-xs text-blue-700">14:00 - Technical Interview with Jane Smith.</p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <h3 className="text-sm font-bold text-gray-900 mb-4">Quick Links</h3>
            <div className="grid grid-cols-2 gap-2">
              <button className="p-2 text-xs text-center bg-gray-50 rounded hover:bg-gray-100 transition font-medium">Add Project</button>
              <button className="p-2 text-xs text-center bg-gray-50 rounded hover:bg-gray-100 transition font-medium">Post Job</button>
              <button className="p-2 text-xs text-center bg-gray-50 rounded hover:bg-gray-100 transition font-medium">Upload Media</button>
              <button className="p-2 text-xs text-center bg-gray-50 rounded hover:bg-gray-100 transition font-medium">User Audit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
