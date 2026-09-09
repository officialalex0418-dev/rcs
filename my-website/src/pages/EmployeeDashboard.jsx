import React, { useState, useEffect } from 'react';
import {
  Calendar, Clock, Wallet, TrendingUp, User, MapPin, Mail, Phone,
  Briefcase, Building2, FileText, Bell, CheckCircle2, AlertCircle,
  Search, LayoutDashboard, CheckSquare, Layers, Timer, BarChart3,
  PieChart, FileStack, Settings, LogOut, ChevronDown, MoreVertical,
  Trophy, Star, ArrowUpRight
} from 'lucide-react';
import { apiFetch } from '../utils/api';
import { getProfilePic } from '../utils/auth';

const EmployeeDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('rcs_user')) || {});

  useEffect(() => {
    const handleUpdate = (e) => {
      setUser(e.detail);
      if (data) setData({ ...data, user: e.detail });
    };
    window.addEventListener('rcs_user_update', handleUpdate);
    return () => window.removeEventListener('rcs_user_update', handleUpdate);
  }, [data]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await apiFetch('/api/dashboard/employee');
        const result = await response.json();
        if (result.success) {
          setData(result.data);
          setUser(result.data.user);
          syncUserData(result.data.user);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Syncing Workplace...</p>
        </div>
      </div>
    );
  }

  const { stats, scoreboard, progress, tasks, kpis, upcomingEvents } = data;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="animate-in fade-in duration-700">

        {/* Welcome Header */}
        <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-[1.5rem] overflow-hidden border-4 border-white shadow-xl bg-slate-100 flex-shrink-0">
                    <img src={getProfilePic(user)} alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-2">
                      {getGreeting()}, {user.name.split(' ')[0]}! 👋
                    </h1>
                    <div className="flex flex-wrap gap-3">
                       <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-blue-100/50">ID: {user.employeeId}</span>
                       <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-[10px] font-black uppercase tracking-widest border border-slate-200/50">{user.designation}</span>
                       <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-[10px] font-black uppercase tracking-widest border border-slate-200/50">{user.department}</span>
                    </div>
                </div>
            </div>
            <p className="text-slate-400 font-medium text-right max-w-xs hidden lg:block">You are doing great! Keep up the excellent work.</p>
        </div>

        {/* --- Top Metrics Row --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
           <MetricCard
             icon={CheckCircle2}
             color="emerald"
             label="Today's Attendance"
             value={stats.todayAttendance ? `Present (${new Date(stats.todayAttendance.checkIn).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})})` : "Absent"}
             sub={`Check-in: ${stats.todayAttendance ? new Date(stats.todayAttendance.checkIn).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'N/A'}`}
           />
           <MetricCard
             icon={Calendar}
             color="purple"
             label="Monthly Attendance"
             value={`${stats.monthlyAttendance.present} / ${stats.monthlyAttendance.total} Days`}
             sub={`${Math.round((stats.monthlyAttendance.present / stats.monthlyAttendance.total) * 100)}% Completion`}
             progress={(stats.monthlyAttendance.present / stats.monthlyAttendance.total) * 100}
           />
           <MetricCard
             icon={Wallet}
             color="emerald"
             label="Current Salary"
             value={`Rs. ${stats.salary.amount.toLocaleString()}`}
             sub={`Next Payout: ${stats.salary.nextPayout}`}
           />
           <MetricCard
             icon={Trophy}
             color="amber"
             label="Scoreboard Rank"
             value={stats.rank}
             sub="Top Performer"
           />
        </div>

        {/* --- Main Dashboard Grid --- */}
        <div className="grid grid-cols-12 gap-8">

          {/* Performance Scoreboard (Left Col) */}
          <div className="col-span-12 lg:col-span-5 space-y-8">
             <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200/60 shadow-sm shadow-blue-500/5">
                <div className="flex justify-between items-center mb-10">
                   <h2 className="text-xl font-black tracking-tight text-slate-900">Performance Scoreboard</h2>
                   <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black uppercase text-slate-400">
                      This Month <ChevronDown size={14} />
                   </div>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-12">
                   <div className="relative w-44 h-44 flex items-center justify-center flex-shrink-0">
                      {/* Gauge SVG */}
                      <svg className="w-full h-full transform -rotate-90">
                         <circle cx="88" cy="88" r="76" stroke="#f1f5f9" strokeWidth="12" fill="transparent" />
                         <circle
                           cx="88" cy="88" r="76" stroke="url(#gradient)" strokeWidth="12" fill="transparent"
                           strokeDasharray="477.5" strokeDashoffset={477.5 * (1 - scoreboard.score / 10)}
                           strokeLinecap="round"
                         />
                         <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                               <stop offset="0%" stopColor="#3b82f6" />
                               <stop offset="100%" stopColor="#7c3aed" />
                            </linearGradient>
                         </defs>
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                         <span className="text-4xl font-black text-slate-900 leading-none">{scoreboard.score}</span>
                         <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Out of 10</span>
                         <span className="mt-4 px-3 py-1 bg-emerald-100 text-emerald-600 text-[10px] font-black rounded-full uppercase">Excellent</span>
                      </div>
                   </div>

                   <div className="flex-1 w-full space-y-6">
                      <ScoreBar label="Code Quality" value={scoreboard.breakdown.codeQuality} max={10} color="blue" />
                      <ScoreBar label="Task Completion" value={scoreboard.breakdown.taskCompletion} max={10} color="indigo" />
                      <ScoreBar label="Collaboration" value={scoreboard.breakdown.collaboration} max={10} color="purple" />
                      <ScoreBar label="Innovation" value={scoreboard.breakdown.innovation} max={10} color="amber" />
                   </div>
                </div>
             </div>

             {/* KPI Section */}
             <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200/60 shadow-sm shadow-blue-500/5">
                <div className="flex justify-between items-center mb-8">
                   <h2 className="text-xl font-black tracking-tight text-slate-900">Key Performance Indicators</h2>
                   <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black uppercase text-slate-400">
                      This Month <ChevronDown size={14} />
                   </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                   <KPICard icon={CheckSquare} color="blue" label="Tasks Completed" value={kpis.tasksCompleted} trend="+15%" />
                   <KPICard icon={Timer} color="emerald" label="On-Time Delivery" value={kpis.onTimeDelivery} trend="+8%" />
                   <KPICard icon={AlertCircle} color="red" label="Bug Resolution" value={kpis.bugResolution} trend="+10%" />
                   <KPICard icon={FileText} color="purple" label="Code Reviews" value={kpis.codeReviews} trend="+20%" />
                </div>

                {/* KPI Line Chart SVG */}
                <div className="relative h-40 w-full mt-6">
                   <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
                      <path
                        d="M0,80 Q50,60 100,100 T200,40 T300,90 T400,20 T500,50 T600,10"
                        fill="none" stroke="url(#lineGradient)" strokeWidth="3"
                      />
                      <defs>
                         <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#3b82f6" />
                            <stop offset="100%" stopColor="#7c3aed" />
                         </linearGradient>
                      </defs>
                      <circle cx="0" cy="80" r="4" fill="#3b82f6" />
                      <circle cx="100" cy="100" r="4" fill="#3b82f6" />
                      <circle cx="200" cy="40" r="4" fill="#4f46e5" />
                      <circle cx="300" cy="90" r="4" fill="#4f46e5" />
                      <circle cx="400" cy="20" r="4" fill="#7c3aed" />
                      <circle cx="600" cy="10" r="4" fill="#7c3aed" />
                   </svg>
                   <div className="flex justify-between mt-4 text-[10px] font-bold text-slate-400 uppercase">
                      <span>Aug 1</span>
                      <span className="hidden sm:inline">Aug 6</span>
                      <span>Aug 11</span>
                      <span className="hidden sm:inline">Aug 16</span>
                      <span>Aug 21</span>
                      <span className="hidden sm:inline">Aug 26</span>
                      <span>Aug 31</span>
                   </div>
                </div>
             </div>
          </div>

          {/* Progress Overview & Task List (Middle Col) */}
          <div className="col-span-12 lg:col-span-4 space-y-8">
             <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200/60 shadow-sm shadow-blue-500/5">
                <div className="flex justify-between items-center mb-8">
                   <h2 className="text-xl font-black tracking-tight text-slate-900">Progress Overview</h2>
                </div>

                <div className="mb-10">
                   <div className="flex justify-between items-end mb-3">
                      <span className="text-sm font-bold text-slate-500">Overall Progress</span>
                      <div className="text-right">
                         <span className="text-2xl font-black text-slate-900">{progress.overall}%</span>
                         <span className="text-[10px] font-bold text-emerald-500 ml-2">+12% from last month</span>
                      </div>
                   </div>
                   <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 rounded-full" style={{ width: `${progress.overall}%` }}></div>
                   </div>
                </div>

                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Project Progress</p>
                <div className="space-y-6">
                   {progress.projects.map((proj, idx) => (
                      <div key={idx} className="space-y-2.5">
                         <div className="flex items-center justify-between text-xs font-bold">
                            <div className="flex items-center gap-2">
                               <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                               <span className="text-slate-900">{proj.name}</span>
                            </div>
                            <span className="text-slate-400">{proj.progress}%</span>
                         </div>
                         <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${idx % 3 === 0 ? 'bg-blue-500' : idx % 3 === 1 ? 'bg-indigo-500' : 'bg-amber-500'}`}
                              style={{ width: `${proj.progress}%` }}
                            ></div>
                         </div>
                      </div>
                   ))}
                </div>

                <button className="w-full mt-10 py-3 border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-blue-600 hover:bg-slate-50 transition-all">View All Projects</button>
             </div>

             {/* Uncompleted Tasks */}
             <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200/60 shadow-sm shadow-blue-500/5">
                <div className="flex justify-between items-center mb-8">
                   <h2 className="text-xl font-black tracking-tight text-slate-900">Uncompleted Tasks</h2>
                   <button className="text-blue-600 text-[10px] font-black uppercase tracking-widest hover:underline">View All</button>
                </div>

                <div className="space-y-4">
                   {tasks.map((task, idx) => (
                      <div key={idx} className="flex items-center gap-4 p-4 bg-slate-50/50 rounded-2xl border border-transparent hover:border-slate-100 transition-all group">
                         <div className="w-6 h-6 rounded-full border-2 border-slate-200 flex items-center justify-center bg-white group-hover:border-blue-500 transition-colors"></div>
                         <div className="flex-1">
                            <h4 className="text-sm font-bold text-slate-900 leading-none mb-1.5">{task.title}</h4>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{task.project?.name || 'Internal'}</p>
                         </div>
                         <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${
                            task.priority === 'HIGH' ? 'bg-red-50 text-red-600' :
                            task.priority === 'MEDIUM' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
                         }`}>
                           {task.priority}
                         </span>
                      </div>
                   ))}
                </div>
             </div>
          </div>

          {/* Right Section: Profile Card & Sidebar Feed */}
          <div className="col-span-12 lg:col-span-3 space-y-8">
             {/* Profile Card */}
             <div className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-200/60 shadow-sm shadow-blue-500/5">
                <div className="h-32 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-4 flex justify-end items-start relative">
                   <button className="w-8 h-8 bg-white/10 backdrop-blur-md rounded-lg flex items-center justify-center text-white"><MoreVertical size={16}/></button>
                   <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
                      <div className="w-24 h-24 rounded-3xl bg-white p-1.5 shadow-xl border border-slate-50">
                         <div className="w-full h-full rounded-[1.2rem] overflow-hidden bg-slate-100 border border-slate-200">
                           <img
                             src={getProfilePic(user)}
                             alt="User"
                             className="w-full h-full object-cover"
                           />
                         </div>
                         <div className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-4 border-white rounded-full"></div>
                      </div>
                   </div>
                </div>
                <div className="pt-14 pb-8 px-8 text-center">
                   <h3 className="text-xl font-black text-slate-900 mb-1">{user.name}</h3>
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-8">{user.designation}</p>

                   <div className="space-y-4 text-left border-t border-slate-50 pt-8">
                      <ProfileInfo icon={Mail} value={user.email} />
                      <ProfileInfo icon={Phone} value={user.phone || '+977-9841XXXXXX'} />
                      <ProfileInfo icon={Building2} value={user.department || 'Engineering'} />
                      <ProfileInfo icon={MapPin} value={user.address || 'Kathmandu, Nepal'} />
                      <ProfileInfo icon={Calendar} value={`Joined ${new Date(user.joiningDate).toLocaleDateString('en-US', {month:'short', day:'numeric', year:'numeric'})}`} />
                   </div>

                   <button className="w-full mt-8 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-900 hover:bg-slate-100 transition-all">View Full Profile</button>
                </div>
             </div>

             {/* Upcoming Events */}
             <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200/60 shadow-sm shadow-blue-500/5">
                <div className="flex justify-between items-center mb-8">
                   <h2 className="text-sm font-black tracking-tight text-slate-900">Upcoming Events</h2>
                   <button className="text-blue-600 text-[10px] font-black uppercase tracking-widest hover:underline">View Calendar</button>
                </div>

                <div className="space-y-6">
                   {upcomingEvents.map((event, i) => (
                      <div key={i} className="flex gap-4">
                         <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            event.type === 'DEADLINE' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'
                         }`}>
                            {event.type === 'DEADLINE' ? <FileText size={20}/> : <Building2 size={20}/>}
                         </div>
                         <div className="flex-1">
                            <h4 className="text-xs font-black text-slate-900 leading-none mb-1.5">{event.title}</h4>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Weekly Standup</p>
                         </div>
                         <div className="text-right">
                            <p className="text-[10px] font-black text-red-500 uppercase leading-none mb-1.5">{event.date.split(',')[0]}</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase leading-none">10:00 AM</p>
                         </div>
                      </div>
                   ))}
                </div>
             </div>

             {/* Recent Achievements */}
             <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200/60 shadow-sm shadow-blue-500/5">
                <div className="flex justify-between items-center mb-8">
                   <h2 className="text-sm font-black tracking-tight text-slate-900">Recent Achievements</h2>
                   <button className="text-blue-600 text-[10px] font-black uppercase tracking-widest hover:underline">View All</button>
                </div>

                <div className="flex gap-4">
                   <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
                      <Trophy size={20}/>
                   </div>
                   <div>
                      <h4 className="text-xs font-black text-slate-900 leading-none mb-1.5">Top Performer</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-2">Awarded for excellent performance</p>
                      <p className="text-[9px] font-black text-slate-400 uppercase leading-none">Aug 20, 2025</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
    </div>
  );
};

// --- Sub-components (Reused) ---

const MetricCard = ({ icon: Icon, label, value, sub, color, progress }) => (
  <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200/60 shadow-sm shadow-blue-500/5 hover:shadow-md transition-all relative overflow-hidden group">
    <div className={`w-12 h-12 rounded-2xl mb-5 flex items-center justify-center ${
      color === 'blue' ? 'bg-blue-50 text-blue-600' :
      color === 'purple' ? 'bg-purple-50 text-purple-600' :
      color === 'amber' ? 'bg-amber-50 text-amber-600' :
      'bg-emerald-50 text-emerald-600'
    }`}>
       <Icon size={24} />
    </div>
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">{label}</p>
    <h3 className="text-xl font-black text-slate-900 mb-1.5 truncate">{value}</h3>
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{sub}</p>

    {progress && (
       <div className="mt-4 h-1 w-full bg-slate-50 rounded-full overflow-hidden">
          <div className="h-full bg-purple-500 rounded-full" style={{ width: `${progress}%` }}></div>
       </div>
    )}

    <ArrowUpRight className="absolute top-6 right-6 text-slate-100 group-hover:text-slate-200 transition-colors" size={24} />
  </div>
);

const ScoreBar = ({ label, value, max, color }) => (
  <div className="space-y-2">
     <div className="flex justify-between items-end text-xs font-bold">
        <span className="text-slate-500">{label}</span>
        <span className="text-slate-900">{value}</span>
     </div>
     <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${
            color === 'blue' ? 'bg-blue-500' : color === 'indigo' ? 'bg-indigo-500' : color === 'purple' ? 'bg-purple-500' : 'bg-amber-500'
          }`}
          style={{ width: `${(value/max)*100}%` }}
        ></div>
     </div>
  </div>
);

const KPICard = ({ icon: Icon, color, label, value, trend }) => (
  <div className="p-4 bg-slate-50/50 border border-slate-100 rounded-2xl group hover:bg-white hover:shadow-xl hover:shadow-blue-500/5 transition-all">
     <div className={`w-10 h-10 rounded-xl mb-4 flex items-center justify-center border-2 border-white shadow-sm ${
       color === 'blue' ? 'bg-blue-50 text-blue-600' :
       color === 'emerald' ? 'bg-emerald-50 text-emerald-600' :
       color === 'red' ? 'bg-red-50 text-red-600' :
       'bg-purple-50 text-purple-600'
     }`}>
        <Icon size={18} />
     </div>
     <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5">{label}</p>
     <h4 className="text-lg font-black text-slate-900 mb-1 truncate">{value}</h4>
     <p className="text-[9px] font-bold text-emerald-500">{trend}</p>
  </div>
);

const ProfileInfo = ({ icon: Icon, value }) => (
  <div className="flex items-center gap-3 text-xs font-bold text-slate-600 overflow-hidden">
     <Icon size={16} className="text-slate-300 flex-shrink-0" />
     <span className="truncate">{value}</span>
  </div>
);

export default EmployeeDashboard;
