import React from 'react';
import { BarChart3, PieChart, TrendingUp, Download, Calendar } from 'lucide-react';

const Reports = () => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Reports & Analytics</h1>
          <p className="text-gray-500">Insights into recruitment, sales, and operations</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 transition">
            <Calendar size={18} />
            Last 30 Days
          </button>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition">
            <Download size={18} />
            Export PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {/* Recruitment Report Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Recruitment Funnel</h2>
            <PieChart className="text-purple-500" size={20} />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Total Applications</span>
              <span className="font-bold">128</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Shortlisted</span>
              <span className="font-bold text-blue-600">32 (25%)</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Interviews</span>
              <span className="font-bold text-yellow-600">12 (9%)</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Hired</span>
              <span className="font-bold text-green-600">3 (2%)</span>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="h-4 w-full bg-gray-100 rounded-full flex overflow-hidden">
              <div className="bg-green-500 h-full" style={{ width: '20%' }}></div>
              <div className="bg-blue-500 h-full" style={{ width: '30%' }}></div>
              <div className="bg-yellow-500 h-full" style={{ width: '50%' }}></div>
            </div>
          </div>
        </div>

        {/* Sales/Inquiry Report Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Inquiry Conversion</h2>
            <BarChart3 className="text-blue-500" size={20} />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">New Leads</span>
              <span className="font-bold">42</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Qualified</span>
              <span className="font-bold">18</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Won Projects</span>
              <span className="font-bold text-green-600">5</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Conversion Rate</span>
              <span className="font-bold text-blue-600">11.9%</span>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-400">
            <TrendingUp size={14} className="text-green-500" />
            <span>+1.2% since last month</span>
          </div>
        </div>

        {/* Project Delivery Report Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Project Delivery</h2>
            <TrendingUp className="text-green-500" size={20} />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Completed Projects</span>
              <span className="font-bold">8</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">On-Time Delivery</span>
              <span className="font-bold text-green-600">87.5%</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Average Duration</span>
              <span className="font-bold">42 Days</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Delayed Projects</span>
              <span className="font-bold text-red-600">1</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
        <h3 className="text-lg font-bold text-gray-900 mb-2">Detailed Monthly Audit</h3>
        <p className="text-gray-500 mb-6">Download the full operational report for August 2026 including financial summaries.</p>
        <button className="bg-gray-900 text-white px-8 py-3 rounded-lg font-bold hover:bg-gray-800 transition">
          Generate Full Report
        </button>
      </div>
    </div>
  );
};

export default Reports;
