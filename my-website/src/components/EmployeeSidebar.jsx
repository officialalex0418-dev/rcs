import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, CheckSquare, Layers, Timer, BarChart3,
  Wallet, PieChart, Calendar, FileStack, Settings,
  ChevronDown, Star, UserCheck
} from 'lucide-react';

const EmployeeSidebar = () => {
  const user = JSON.parse(localStorage.getItem('rcs_user')) || {};

  return (
    <aside className="w-72 bg-white border-r border-slate-200/60 hidden xl:flex flex-col fixed top-0 h-screen p-8 z-20">
      <div className="flex items-center gap-3 mb-12">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
           <span className="font-black text-xs">RCS</span>
        </div>
        <span className="text-xl font-black tracking-tighter uppercase">RCS Solutions</span>
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

      {/* Upgrade Pro Card */}
      <div className="mt-8 p-6 bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2rem] text-white relative overflow-hidden">
         <div className="absolute top-0 right-0 p-4 opacity-10">
            <Star size={60} />
         </div>
         <h4 className="text-sm font-bold mb-2 flex items-center gap-2">
           <Star size={14} className="text-blue-400" /> Upgrade to Pro
         </h4>
         <p className="text-[10px] text-slate-400 mb-4 leading-relaxed">Unlock advanced features and analytical reports.</p>
         <button className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Upgrade Now</button>
      </div>

      {/* Bottom User Card */}
      <div className="mt-8 pt-8 border-t border-slate-100 flex items-center justify-between">
         <div className="flex items-center gap-3">
           <div className="w-10 h-10 rounded-xl bg-slate-100 overflow-hidden border border-slate-200">
             <img src={user.profilePicture ? `https://rcs-ajbn.onrender.com${user.profilePicture}` : `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name || 'User'}`} alt="Avatar" className="w-full h-full object-cover" />
           </div>
           <div className="max-w-[120px]">
             <p className="text-sm font-black leading-none mb-1 truncate">{user.name || 'Employee'}</p>
             <p className="text-[10px] font-bold text-slate-400 truncate">{user.designation || 'Staff'}</p>
           </div>
         </div>
         <ChevronDown size={16} className="text-slate-300" />
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
