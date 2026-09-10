import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
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
  Shield,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

const AdminSidebar = () => {
  const location = useLocation();
  const [openSubmenu, setOpenSubmenu] = useState(location.pathname.includes('/admin/reports') ? 'Reports' : null);

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
    {
      label: 'Reports',
      icon: BarChart3,
      path: '/admin/reports',
      submenu: [
        { label: 'Company Report', path: '/admin/reports/company' },
        { label: 'HR Report', path: '/admin/reports/hr' },
        { label: 'Sales Report', path: '/admin/reports/sales' },
        { label: 'Project Report', path: '/admin/reports/projects' },
        { label: 'Finance Report', path: '/admin/reports/finance' },
        { label: 'Marketing Report', path: '/admin/reports/marketing' },
      ]
    },
    { label: 'Support', icon: Bell, path: '/admin/support' },
  ];

  const toggleSubmenu = (label) => {
    setOpenSubmenu(openSubmenu === label ? null : label);
  };

  return (
    <div className="w-64 h-screen bg-[#0B1020] text-slate-400 flex flex-col fixed left-0 top-0 z-30 shadow-2xl">
      {/* Logo */}
      <div className="p-6 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <Shield size={22} />
          </div>
          <div>
            <h1 className="font-bold text-xl text-white leading-tight tracking-tight uppercase">RCS Portal</h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-bold">System Admin</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-sidebar-scroll pb-20">
        <p className="px-4 py-3 text-[10px] font-bold text-slate-600 uppercase tracking-widest">Main Menu</p>
        {navItems.map((item) => (
          <div key={item.label}>
            {item.submenu ? (
              <div>
                <button
                  onClick={() => toggleSubmenu(item.label)}
                  className={`
                    w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group
                    ${location.pathname.includes(item.path) ? 'text-white bg-slate-800/30' : 'hover:bg-slate-800/50 hover:text-white'}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={20} className={location.pathname.includes(item.path) ? 'text-blue-500' : 'text-slate-500 group-hover:text-blue-400'} />
                    <span className="font-medium text-sm">{item.label}</span>
                  </div>
                  {openSubmenu === item.label ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </button>

                {openSubmenu === item.label && (
                  <div className="mt-1 ml-4 pl-4 border-l border-slate-800 space-y-1 animate-in slide-in-from-top-1 duration-200">
                    {item.submenu.map((sub) => (
                      <NavLink
                        key={sub.path}
                        to={sub.path}
                        className={({ isActive }) => `
                          block px-4 py-2 rounded-lg text-xs font-medium transition-all
                          ${isActive ? 'text-blue-500 bg-blue-500/5' : 'text-slate-500 hover:text-white hover:bg-slate-800/30'}
                        `}
                      >
                        {sub.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <NavLink
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
            )}
          </div>
        ))}
      </nav>

      {/* Profile Card & Logout */}
      <div className="p-4 border-t border-slate-800/50 bg-[#0B1020] mt-auto">
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
            localStorage.removeItem('rcs_user');
            window.location.href = '/login';
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
