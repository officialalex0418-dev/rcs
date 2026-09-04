import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  LogOut,
  MessageSquare,
  Briefcase,
  Image as ImageIcon,
  Folder,
  BarChart3,
  TrendingUp,
  Bell,
  Shield
} from 'lucide-react';

const AdminSidebar = () => {
  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { label: 'Projects', icon: Folder, path: '/admin/projects' },
    { label: 'Inquiries', icon: MessageSquare, path: '/admin/inquiries' },
    { label: 'Employees', icon: Users, path: '/admin/employees' },
    { label: 'Vacancy', icon: Briefcase, path: '/admin/careers' },
    { label: 'Applications', icon: FileText, path: '/admin/applications' },
    { label: 'Gallery', icon: ImageIcon, path: '/admin/gallery' },
    { label: 'Tasks', icon: Briefcase, path: '/admin/tasks' },
    { label: 'Payroll', icon: TrendingUp, path: '/admin/payroll' },
    { label: 'Reports', icon: BarChart3, path: '/admin/reports' },
    { label: 'Support', icon: Bell, path: '/admin/support' },
  ];

  return (
    <div className="w-64 h-screen bg-[#0B1020] text-slate-400 flex flex-col fixed left-0 top-0 z-30 shadow-2xl">
      {/* Logo */}
      <div className="p-6 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <Shield size={22} />
          </div>
          <div>
            <h1 className="font-bold text-xl text-white leading-tight tracking-tight">RCS Portal</h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-bold">Administrator</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-sidebar-scroll">
        <p className="px-4 py-3 text-[10px] font-bold text-slate-600 uppercase tracking-widest">Main Menu</p>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/admin'}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
              ${isActive
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                : 'hover:bg-slate-800/50 hover:text-white'}
            `}
          >
            <item.icon size={20} className={`transition-transform group-hover:scale-110 ${item.path !== '/admin' && 'text-slate-500 group-hover:text-blue-400'}`} />
            <span className="font-medium text-sm">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Profile Card & Logout */}
      <div className="p-4 border-t border-slate-800/50 bg-[#0B1020]">
        <NavLink
          to="/admin/settings"
          className={({ isActive }) => `
            flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 mb-2
            ${isActive ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'}
          `}
        >
          <Settings size={20} />
          <span className="font-medium text-sm">Settings</span>
        </NavLink>

        <button
          onClick={() => {
            localStorage.removeItem('rcs_admin_token');
            window.location.href = '/admin/login';
          }}
          className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:bg-red-400/10 rounded-xl transition-colors font-medium text-sm"
        >
          <LogOut size={20} />
          <span>Sign Out</span>
        </button>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-sidebar-scroll::-webkit-scrollbar { width: 4px; }
        .custom-sidebar-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-sidebar-scroll::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
      `}} />
    </div>
  );
};

export default AdminSidebar;
