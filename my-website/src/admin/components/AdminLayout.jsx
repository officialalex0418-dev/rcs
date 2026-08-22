import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  MessageSquare,
  Image as ImageIcon,
  Settings,
  LogOut,
  BarChart3,
  Folder
} from 'lucide-react';

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Basic logout logic
    localStorage.removeItem('rcs_admin_token');
    navigate('/admin/login');
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold">RCS Admin</h2>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link to="/admin" className="flex items-center space-x-3 p-3 rounded hover:bg-slate-800">
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>
          <Link to="/admin/projects" className="flex items-center space-x-3 p-3 rounded hover:bg-slate-800">
            <Folder size={20} />
            <span>Projects</span>
          </Link>
          <Link to="/admin/careers" className="flex items-center space-x-3 p-3 rounded hover:bg-slate-800">
            <Briefcase size={20} />
            <span>Careers</span>
          </Link>
          <Link to="/admin/applications" className="flex items-center space-x-3 p-3 rounded hover:bg-slate-800">
            <Users size={20} />
            <span>Applications</span>
          </Link>
          <Link to="/admin/inquiries" className="flex items-center space-x-3 p-3 rounded hover:bg-slate-800">
            <MessageSquare size={20} />
            <span>Inquiries</span>
          </Link>
          <Link to="/admin/gallery" className="flex items-center space-x-3 p-3 rounded hover:bg-slate-800">
            <ImageIcon size={20} />
            <span>Gallery</span>
          </Link>
          <Link to="/admin/reports" className="flex items-center space-x-3 p-3 rounded hover:bg-slate-800">
            <BarChart3 size={20} />
            <span>Reports</span>
          </Link>
          <Link to="/admin/settings" className="flex items-center space-x-3 p-3 rounded hover:bg-slate-800">
            <Settings size={20} />
            <span>Settings</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 p-3 w-full rounded hover:bg-red-600 transition-colors"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white shadow p-4 flex justify-between items-center">
          <div className="text-gray-500">Welcome back, Admin</div>
          <div className="flex items-center space-x-4">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">Super Admin</span>
          </div>
        </header>

        <div className="p-0">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
