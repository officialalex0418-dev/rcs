import React, { useState, useEffect } from 'react';
import { Plus, Search, Calendar, CheckCircle2, AlertCircle, Clock, Users, ChevronRight } from 'lucide-react';

const ProjectManager = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // simulate API delay
    setTimeout(() => {
      setProjects([
        {
          _id: '1',
          name: 'E-commerce Redesign',
          client: 'RetailHub',
          status: 'IN_PROGRESS',
          progress: 65,
          health: 'ON_TRACK',
          dueDate: '2026-09-15',
          team: 4
        },
        {
          _id: '2',
          name: 'Mobile Banking App',
          client: 'Global Bank',
          status: 'PLANNING',
          progress: 15,
          health: 'AT_RISK',
          dueDate: '2026-10-30',
          team: 6
        },
        {
          _id: '3',
          name: 'Cloud Migration',
          client: 'Tech Solutions',
          status: 'COMPLETED',
          progress: 100,
          health: 'ON_TRACK',
          dueDate: '2026-08-15',
          team: 3
        },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircle2 size={16} className="text-green-500" />;
      case 'IN_PROGRESS': return <Clock size={16} className="text-blue-500" />;
      case 'PLANNING': return <Calendar size={16} className="text-purple-500" />;
      default: return <AlertCircle size={16} className="text-gray-500" />;
    }
  };

  const getHealthColor = (health) => {
    switch (health) {
      case 'ON_TRACK': return 'bg-green-100 text-green-700';
      case 'AT_RISK': return 'bg-yellow-100 text-yellow-700';
      case 'DELAYED': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Internal Project Tracker</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-700 transition">
          <Plus size={20} />
          Create Project
        </button>
      </div>

      {/* Project Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
            <Search size={18} />
          </span>
          <input
            type="text"
            placeholder="Search projects..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md sm:text-sm"
          />
        </div>
        <select className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white min-w-[150px]">
          <option>All Statuses</option>
          <option>Planning</option>
          <option>In Progress</option>
          <option>Completed</option>
        </select>
        <select className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white min-w-[150px]">
          <option>All Managers</option>
          <option>Self</option>
        </select>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-12 text-gray-500">Loading projects...</div>
        ) : projects.map((project) => (
          <div key={project._id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition group">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition">{project.name}</h3>
                  <p className="text-sm text-gray-500">{project.client}</p>
                </div>
                <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${getHealthColor(project.health)}`}>
                  {project.health.replace('_', ' ')}
                </span>
              </div>

              <div className="mb-6">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Progress</span>
                  <span>{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${project.progress === 100 ? 'bg-green-500' : 'bg-blue-500'}`}
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="p-1.5 bg-gray-50 rounded">
                    {getStatusIcon(project.status)}
                  </div>
                  <span className="capitalize">{project.status.toLowerCase().replace('_', ' ')}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="p-1.5 bg-gray-50 rounded">
                    <Users size={16} className="text-gray-500" />
                  </div>
                  <span>{project.team} Members</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Calendar size={14} />
                  <span>Due: {project.dueDate}</span>
                </div>
                <button className="flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700">
                  Manage <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectManager;
