import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, CheckSquare, Layers, Timer, BarChart3,
  Wallet, PieChart, Calendar, FileStack, Settings,
  ChevronDown, Star, UserCheck, LogOut
} from 'lucide-react';
import { getProfilePic } from '../utils/auth';

const EmployeeSidebar = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('rcs_user')) || {});

  useEffect(() => {
    const handleUpdate = (e) => setUser(e.detail);
    window.addEventListener('rcs_user_update', handleUpdate);
    return () => window.removeEventListener('rcs_user_update', handleUpdate);
  }, []);

  return (
    <aside className="w-72 bg-white border-r border-slate-200/60 hidden xl:flex flex-col fixed top-0 h-screen p-8 z-20">
      <div className="flex items-center gap-3 mb-12">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20 font-black text-xs">
           RCS
        </div>
        <span className="text-2xl font-black tracking-tighter uppercase">RCS</span>
      </div>

      <nav className="flex-1 space-y-2 text-slate-500">
        <SidebarLink to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
        <SidebarLink to="/attendance" icon={UserCheck} label="Attendance" />
        <SidebarLink to="/tasks" icon={CheckSquare} label="My Tasks" badge="4" />
        <SidebarLink to="/projects" icon={Layers} label="Projects" />
        <SidebarLink to="/time-tracking" icon={Timer} label="Time Tracking" />
        <SidebarLink to="/performance" icon={BarChart3} label="Performance" />
        <SidebarLink to="/payroll" icon={Wallet} label="Payroll" />
        <SidebarLink to="/settings" icon={Settings} label="Settings" />
      </nav>

      {/* Bottom User Card */}
      <div className="mt-auto pt-8 border-t border-slate-100">
         <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 overflow-hidden border border-slate-200">
                <img src={getProfilePic(user)} alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <div className="max-w-[120px]">
                <p className="text-sm font-black leading-none mb-1 truncate">{user.name || 'Employee'}</p>
                <p className="text-[10px] font-bold text-slate-400 truncate">{user.designation || 'Staff'}</p>
              </div>
            </div>
            <ChevronDown size={16} className="text-slate-300" />
         </div>
         <button
           onClick={() => {
             localStorage.removeItem('rcs_admin_token');
             localStorage.removeItem('rcs_user');
             window.location.href = '/login';
           }}
           className="w-full flex items-center justify-center gap-2 py-3 bg-red-50 text-red-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all group"
         >
            <LogOut size={14} className="group-hover:rotate-12 transition-transform" />
            Sign Out
         </button>
      </div>
    </aside>
  );
};

const SidebarLink = ({ to, icon: Icon, label, badge }) => (
  <NavLink
    to={to}
    className={({ isActive }) => `flex items-center justify-between p-3 rounded-2xl transition-all group ${
      isActive ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'hover:bg-slate-50 hover:text-slate-900'
    }`}
  >
    <div className="flex items-center gap-3">
       <Icon size={20} className="group-hover:scale-110 transition-transform" />
       <span className="text-sm font-bold">{label}</span>
    </div>
    {badge && (
      <span className="w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-[10px] font-black">{badge}</span>
    )}
  </NavLink>
);

export default EmployeeSidebar;
