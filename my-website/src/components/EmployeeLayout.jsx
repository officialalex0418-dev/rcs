import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Bell, Menu, X } from 'lucide-react';
import EmployeeSidebar from './EmployeeSidebar';

const EmployeeLayout = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-slate-900 font-sans">
      {/* Sidebar */}
      <EmployeeSidebar />

      {/* Mobile Menu Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-30 xl:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 xl:ml-72 min-h-screen flex flex-col">

        {/* Header */}
        <header className="h-24 px-8 lg:px-12 flex justify-between items-center sticky top-0 bg-[#F8FAFC]/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-4">
             <button
               onClick={() => setIsSidebarOpen(true)}
               className="p-2 bg-white border border-slate-200 rounded-xl xl:hidden text-slate-600"
             >
               <Menu size={20} />
             </button>
             <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest hidden sm:block">WorkHub Terminal</h2>
          </div>

          <div className="flex items-center gap-6">
            {/* Date & Time */}
            <div className="text-right hidden sm:block">
              <p className="text-sm font-black text-slate-900 leading-none mb-1">
                {currentTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
              <div className="flex items-center justify-end gap-2">
                <span className="text-sm font-bold text-slate-500">{currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[10px] font-black text-emerald-600 uppercase">Live</span>
              </div>
            </div>

            {/* Notification Button */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-3.5 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:border-blue-200 transition-all shadow-sm active:scale-95"
              >
                <Bell size={20} />
                <span className="absolute top-3 right-3 w-4 h-4 bg-red-500 text-white text-[8px] font-black rounded-full flex items-center justify-center border-2 border-white">3</span>
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-4 w-80 bg-white rounded-[2rem] shadow-2xl shadow-slate-900/10 border border-slate-100 p-6 animate-in fade-in slide-in-from-top-2 duration-300 z-50">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-black text-lg">Notifications</h3>
                    <button className="text-blue-600 text-[10px] font-black uppercase tracking-widest">Mark All Read</button>
                  </div>
                  <div className="space-y-4">
                     <NotificationItem
                       title="Task Assigned"
                       desc="New task 'FinTech Dashboard' assigned to you."
                       time="2m ago"
                     />
                     <NotificationItem
                       title="Project Update"
                       desc="E-commerce API progress reached 70%."
                       time="1h ago"
                     />
                     <NotificationItem
                       title="Salary Credited"
                       desc="Your basic salary for August has been processed."
                       time="5h ago"
                     />
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content Area */}
        <div className="flex-1 p-8 lg:p-12 pt-0 max-w-[1600px] mx-auto w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

const NotificationItem = ({ title, desc, time }) => (
  <div className="p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors cursor-pointer">
    <div className="flex justify-between items-start mb-1">
      <h4 className="text-sm font-black text-slate-900">{title}</h4>
      <span className="text-[9px] font-bold text-slate-400">{time}</span>
    </div>
    <p className="text-xs text-slate-500 leading-snug">{desc}</p>
  </div>
);

export default EmployeeLayout;
