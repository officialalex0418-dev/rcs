import React from 'react';
import {
  Calendar,
  Clock,
  Wallet,
  TrendingUp,
  User,
  MapPin,
  Mail,
  Phone,
  Briefcase,
  Building2,
  FileText,
  Bell,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const EmployeeDashboard = () => {
  // Mock User Data based on the model requirements
  const user = {
    name: 'Ramesh Thapa',
    email: 'ramesh.thapa@rcs.com.np',
    employeeId: 'EMP-2024-042',
    designation: 'Senior Full Stack Developer',
    department: 'Engineering & Innovation',
    location: 'Kathmandu, Nepal',
    contact: '+977-9841234567',
    joiningDate: 'Jan 15, 2024',
    basicSalary: 85000,
    allowance: 500,
    attendance: {
      today: 'Present (09:12 AM)',
      monthly: '22 / 24 Days',
      status: 'On-Time'
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8 lg:p-12 font-sans text-slate-900 animate-in fade-in duration-700">
      {/* Top Welcome Bar */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-2">Welcome Back, {user.name.split(' ')[0]}!</h1>
          <p className="text-slate-500 font-medium flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            You are currently clocked in. Have a productive day!
          </p>
        </div>
        <div className="flex gap-4">
          <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:text-blue-600 hover:border-blue-100 transition-all shadow-sm">
            <Bell size={20} />
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/10">
            <Clock size={18} />
            Clock Out
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Stats & Attendance */}
        <div className="lg:col-span-2 space-y-8">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              icon={CheckCircle2}
              label="Today's Attendance"
              value={user.attendance.today}
              trend="Check-in: 09:12 AM"
              color="blue"
            />
            <StatCard
              icon={Calendar}
              label="Monthly Attendance"
              value={user.attendance.monthly}
              trend="92% Completion"
              color="purple"
            />
            <StatCard
              icon={Wallet}
              label="Current Salary"
              value={`Rs. ${user.basicSalary.toLocaleString()}`}
              trend="Next Payout: Oct 01"
              color="green"
            />
          </div>

          {/* Activity/Task Section (Mock) */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200/60 shadow-sm shadow-blue-500/5">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-black tracking-tight">Assigned Projects</h2>
              <button className="text-blue-600 text-xs font-black uppercase tracking-widest hover:text-blue-700">View All</button>
            </div>
            <div className="space-y-4">
              <ProjectItem title="FinTech Dashboard Redesign" status="In Progress" priority="High" deadline="Sept 15" />
              <ProjectItem title="E-commerce API Integration" status="Review" priority="Medium" deadline="Sept 20" />
              <ProjectItem title="Mobile App Security Audit" status="Planning" priority="Urgent" deadline="Sept 10" />
            </div>
          </div>
        </div>

        {/* Right Column: Profile & Info */}
        <div className="space-y-8">
          {/* Profile Card */}
          <div className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-200/60 shadow-sm shadow-blue-500/5">
            <div className="h-24 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
            <div className="px-8 pb-8 -mt-12 text-center">
              <div className="w-24 h-24 rounded-[2rem] bg-white p-1.5 shadow-xl mx-auto mb-4 border border-slate-100">
                <div className="w-full h-full rounded-[1.7rem] bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center text-blue-600 font-black text-3xl overflow-hidden">
                  {user.name.charAt(0)}
                </div>
              </div>
              <h3 className="text-xl font-black text-slate-900">{user.name}</h3>
              <p className="text-blue-600 font-bold text-xs uppercase tracking-widest mb-6">{user.designation}</p>

              <div className="space-y-4 text-left border-t border-slate-50 pt-6">
                <InfoRow icon={Mail} text={user.email} />
                <InfoRow icon={Phone} text={user.contact} />
                <InfoRow icon={Building2} text={user.department} />
                <InfoRow icon={MapPin} text={user.location} />
                <InfoRow icon={Calendar} text={`Joined ${user.joiningDate}`} />
              </div>
            </div>
          </div>

          {/* Salary Breakdown (Mini) */}
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl shadow-slate-900/20">
             <div className="flex items-center gap-3 mb-6">
               <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                 <TrendingUp className="text-blue-400" size={20} />
               </div>
               <h4 className="font-bold text-lg">Payroll Snapshot</h4>
             </div>
             <div className="space-y-3">
               <div className="flex justify-between text-sm">
                 <span className="text-slate-400">Basic Pay</span>
                 <span className="font-bold">Rs. {user.basicSalary.toLocaleString()}</span>
               </div>
               <div className="flex justify-between text-sm">
                 <span className="text-slate-400">Allowances</span>
                 <span className="font-bold">Rs. {(user.allowance * 22).toLocaleString()}</span>
               </div>
               <div className="pt-3 border-t border-white/10 flex justify-between">
                 <span className="font-bold">Estimated Total</span>
                 <span className="text-blue-400 font-black">Rs. {(user.basicSalary + (user.allowance * 22)).toLocaleString()}</span>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, trend, color }) => {
  const colors = {
    blue: 'text-blue-600 bg-blue-50 border-blue-100',
    purple: 'text-purple-600 bg-purple-50 border-purple-100',
    green: 'text-emerald-600 bg-emerald-50 border-emerald-100'
  };

  return (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-200/60 shadow-sm hover:shadow-md transition-all">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 border ${colors[color]}`}>
        <Icon size={24} />
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <h3 className="text-xl font-black text-slate-900 mb-2">{value}</h3>
      <p className="text-xs font-bold text-slate-500">{trend}</p>
    </div>
  );
};

const InfoRow = ({ icon: Icon, text }) => (
  <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
    <Icon size={16} className="text-slate-300" />
    <span>{text}</span>
  </div>
);

const ProjectItem = ({ title, status, priority, deadline }) => (
  <div className="flex items-center justify-between p-4 bg-slate-50/50 hover:bg-slate-50 rounded-2xl border border-transparent hover:border-slate-100 transition-all group">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
        <FileText className="text-slate-400" size={18} />
      </div>
      <div>
        <h5 className="font-bold text-slate-900">{title}</h5>
        <p className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">Deadline: {deadline}</p>
      </div>
    </div>
    <div className="flex items-center gap-3">
      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
        priority === 'Urgent' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
      }`}>
        {priority}
      </span>
      <span className="text-xs font-bold text-slate-500">{status}</span>
    </div>
  </div>
);

export default EmployeeDashboard;
