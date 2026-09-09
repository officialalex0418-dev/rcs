import React, { useState, useEffect } from 'react';
import {
  Calendar, Clock, Wallet, TrendingUp, User, MapPin, Mail, Phone,
  Briefcase, Building2, FileText, Bell, CheckCircle2, AlertCircle,
  Search, LayoutDashboard, CheckSquare, Layers, Timer, BarChart3,
  PieChart, FileStack, Settings, LogOut, ChevronDown, MoreVertical,
  Trophy, Star, ArrowUpRight, X, ExternalLink
} from 'lucide-react';
import { apiFetch } from '../utils/api';
import { getProfilePic } from '../utils/auth';
import Modal from '../admin/components/Modal';

const EmployeeDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('rcs_user')) || {});
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboardData, setLeaderboard) = useState([]);

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
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await apiFetch('/api/dashboard/leaderboard');
      const result = await response.json();
      if (result.success) {
        setLeaderboard(result.data);
        setShowLeaderboard(true);
      }
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
    }
  };

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

        {/* Welcome Header + Profile Card Top */}
        <div className="mb-12 flex flex-col xl:flex-row gap-8 items-stretch">
            {/* Greeting & Quick Tags */}
            <div className="flex-1 bg-white rounded-[2.5rem] p-8 border border-slate-200/60 shadow-sm shadow-blue-500/5 flex flex-col justify-center">
                <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-4">
                  {getGreeting()}, {user.name.split(' ')[0]}! 👋
                </h1>
                <div className="flex flex-wrap gap-3">
                   <span className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-[11px] font-black uppercase tracking-widest border border-blue-100">Portal ID: {user.employeeId}</span>
                   <span className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[11px] font-black uppercase tracking-widest border border-emerald-100 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                      Currently Online
                   </span>
                </div>
                <p className="mt-6 text-slate-500 font-medium leading-relaxed">
                  You've completed <span className="text-blue-600 font-black">{kpis.tasksCompleted} tasks</span> this week. <br/>
                  Your current performance rank is <span className="text-amber-500 font-black">{stats.rank}</span>. Keep it up!
                </p>
            </div>

            {/* Compact Profile Card (Top Right) */}
            <div className="w-full xl:w-[450px] bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden flex items-center gap-6 shadow-2xl shadow-slate-900/20 border border-white/5">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                <div className="w-24 h-24 rounded-3xl overflow-hidden border-4 border-white/10 shadow-2xl relative z-10 flex-shrink-0">
                    <img src={getProfilePic(user)} alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <div className="relative z-10">
                    <h2 className="text-2xl font-black mb-1">{user.name}</h2>
                    <p className="text-blue-400 font-bold text-xs uppercase tracking-widest mb-4">{user.designation}</p>
                    <div className="space-y-2">
                       <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          <Building2 size={12} className="text-slate-500" /> {user.department}
                       </div>
                       <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          <MapPin size={12} className="text-slate-500" /> Kathmandu, Nepal
                       </div>
                    </div>
                </div>
                <button
                  onClick={() => window.location.href = '/settings'}
                  className="absolute top-6 right-6 p-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/10"
                >
                   <Settings size={18} className="text-slate-400" />
                </button>
            </div>
        </div>

        {/* --- Top Metrics Row --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
           <MetricCard
             icon={CheckCircle2}
             color="emerald"
             label="Today's Attendance"
             value={stats.todayAttendance ? `Present (${new Date(stats.todayAttendance.checkIn).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})})` : "Not Checked In"}
             sub={stats.todayAttendance ? `Check-in: ${new Date(stats.todayAttendance.checkIn).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}` : 'Action Required'}
             alert={!stats.todayAttendance}
           />
           <MetricCard
             icon={Calendar}
             color="purple"
             label="Monthly Attendance"
             value={`${stats.monthlyAttendance.present} / ${stats.monthlyAttendance.total} Days`}
             sub={`${Math.round((stats.monthlyAttendance.present / stats.monthlyAttendance.total) * 100)}% Completion Rate`}
             progress={(stats.monthlyAttendance.present / stats.monthlyAttendance.total) * 100}
           />
           <MetricCard
             icon={Trophy}
             color="amber"
             label="Performance Scoreboard"
             value={stats.rank}
             sub="Click to view Leaderboard"
             onClick={fetchLeaderboard}
             clickable
           />
        </div>

        {/* --- Main Dashboard Grid --- */}
        <div className="grid grid-cols-12 gap-8">

          {/* Performance Scoreboard (Left Col) */}
          <div className="col-span-12 lg:col-span-5 space-y-8">
             <div
               onClick={fetchLeaderboard}
               className="bg-white rounded-[2.5rem] p-8 border border-slate-200/60 shadow-sm shadow-blue-500/5 cursor-pointer hover:border-blue-200 transition-all group"
             >
                <div className="flex justify-between items-center mb-10">
                   <h2 className="text-xl font-black tracking-tight text-slate-900 flex items-center gap-2">
                     Performance Analysis
                     <ArrowUpRight size={18} className="text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                   </h2>
                   <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black uppercase text-slate-400">
                      Current Metrics
                   </div>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-12">
                   <div className="relative w-44 h-44 flex items-center justify-center flex-shrink-0">
                      <svg className="w-full h-full transform -rotate-90">
                         <circle cx="88" cy="88" r="76" stroke="#f1f5f9" strokeWidth="12" fill="transparent" />
                         <circle
                           cx="88" cy="88" r="76" stroke="url(#dashGradient)" strokeWidth="12" fill="transparent"
                           strokeDasharray="477.5" strokeDashoffset={477.5 * (1 - scoreboard.score / 10)}
                           strokeLinecap="round"
                         />
                         <defs>
                            <linearGradient id="dashGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                               <stop offset="0%" stopColor="#3b82f6" />
                               <stop offset="100%" stopColor="#7c3aed" />
                            </linearGradient>
                         </defs>
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                         <span className="text-4xl font-black text-slate-900 leading-none">{scoreboard.score}</span>
                         <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Score</span>
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
                   <h2 className="text-xl font-black tracking-tight text-slate-900">Core Performance Indicators</h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                   <KPICard icon={CheckSquare} color="blue" label="Total Tasks" value={kpis.tasksCompleted} />
                   <KPICard icon={Timer} color="emerald" label="Avg Speed" value={kpis.onTimeDelivery} />
                   <KPICard icon={AlertCircle} color="red" label="Bug Reports" value={kpis.bugResolution} />
                   <KPICard icon={FileText} color="purple" label="Reviews" value={kpis.codeReviews} />
                </div>

                {/* KPI Line Chart - Improved Visualization */}
                <div className="relative h-40 w-full mt-6 bg-slate-50/50 rounded-2xl p-4">
                   <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 600 100">
                      <path
                        d="M0,80 C50,80 100,60 150,70 C200,80 250,30 300,50 C350,70 400,20 450,40 C500,60 550,10 600,10"
                        fill="none" stroke="url(#kpiLineGradient)" strokeWidth="4" strokeLinecap="round"
                      />
                      <defs>
                         <linearGradient id="kpiLineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#3b82f6" />
                            <stop offset="100%" stopColor="#7c3aed" />
                         </linearGradient>
                      </defs>
                   </svg>
                   <div className="flex justify-between mt-6 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                      <span>Week 1</span>
                      <span>Week 2</span>
                      <span>Week 3</span>
                      <span>Week 4</span>
                   </div>
                </div>
             </div>
          </div>

          {/* Progress & Task Columns */}
          <div className="col-span-12 lg:col-span-4 space-y-8">
             {/* Progress Card */}
             <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200/60 shadow-sm shadow-blue-500/5">
                <h2 className="text-xl font-black tracking-tight text-slate-900 mb-8">Deliverables Progress</h2>
                <div className="mb-10">
                   <div className="flex justify-between items-end mb-3">
                      <span className="text-sm font-bold text-slate-500 uppercase tracking-widest text-[10px]">Quarterly Goal</span>
                      <div className="text-right">
                         <span className="text-2xl font-black text-slate-900">{progress.overall}%</span>
                      </div>
                   </div>
                   <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all duration-1000" style={{ width: `${progress.overall}%` }}></div>
                   </div>
                </div>

                <div className="space-y-6">
                   {progress.projects.map((proj, idx) => (
                      <div key={idx} className="space-y-2.5">
                         <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                            <span className="text-slate-900 truncate max-w-[200px]">{proj.name}</span>
                            <span className="text-slate-400">{proj.progress}%</span>
                         </div>
                         <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-1000 ${idx % 3 === 0 ? 'bg-blue-500' : idx % 3 === 1 ? 'bg-indigo-500' : 'bg-purple-500'}`}
                              style={{ width: `${proj.progress}%` }}
                            ></div>
                         </div>
                      </div>
                   ))}
                </div>
                <button onClick={() => window.location.href='/projects'} className="w-full mt-10 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-100 transition-all">Go to Project Hub</button>
             </div>

             {/* Task Feed */}
             <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200/60 shadow-sm shadow-blue-500/5">
                <div className="flex justify-between items-center mb-8">
                   <h2 className="text-xl font-black tracking-tight text-slate-900">Priority Tasks</h2>
                   <button onClick={() => window.location.href='/tasks'} className="text-blue-600 text-[10px] font-black uppercase tracking-widest hover:underline">View All</button>
                </div>
                <div className="space-y-4">
                   {tasks.map((task, idx) => (
                      <div key={idx} className="flex items-center gap-4 p-4 bg-slate-50/50 rounded-2xl border border-transparent hover:border-slate-100 transition-all">
                         <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm text-blue-600 font-black text-xs">{(idx+1).toString().padStart(2,'0')}</div>
                         <div className="flex-1">
                            <h4 className="text-sm font-black text-slate-900 mb-1 truncate">{task.title}</h4>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{task.project?.name || 'Internal'}</p>
                         </div>
                      </div>
                   ))}
                   {tasks.length === 0 && <p className="text-center py-10 text-slate-400 font-bold uppercase text-[10px] tracking-widest">No pending tasks</p>}
                </div>
             </div>
          </div>

          {/* Feed Column (Right) */}
          <div className="col-span-12 lg:col-span-3 space-y-8">
             <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200/60 shadow-sm shadow-blue-500/5">
                <h2 className="text-sm font-black tracking-tight text-slate-900 mb-8 flex items-center justify-between">
                    Live Feed
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                </h2>
                <div className="space-y-6">
                   {upcomingEvents.map((event, i) => (
                      <div key={i} className="flex gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100">
                         <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                            event.type === 'DEADLINE' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
                         }`}>
                            {event.type === 'DEADLINE' ? <AlertCircle size={20}/> : <CheckCircle2 size={20}/>}
                         </div>
                         <div>
                            <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-tight mb-1">{event.title}</h4>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{event.date}</p>
                         </div>
                      </div>
                   ))}
                </div>
             </div>

             <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] p-8 text-white shadow-xl shadow-blue-500/20">
                <Star className="text-white/20 mb-6" size={40} />
                <h3 className="text-xl font-black mb-2 leading-tight">Achievement Unlocked</h3>
                <p className="text-white/70 text-xs font-medium mb-6 leading-relaxed">You've maintained a 98% on-time delivery rate this month. Exclusive bonus reward pending.</p>
                <button className="w-full py-4 bg-white/10 hover:bg-white/20 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/20 transition-all">Claim Reward</button>
             </div>
          </div>
        </div>

        {/* Leaderboard Modal */}
        <Modal isOpen={showLeaderboard} onClose={() => setShowLeaderboard(false)} title="Employee Leaderboard">
           <div className="space-y-4 py-4">
              <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">
                 <span>Member</span>
                 <span>Performance Score</span>
              </div>
              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                 {leaderboardData.map((emp, i) => (
                    <div key={i} className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                       emp.id === user.id ? 'bg-blue-50 border-blue-200' : 'bg-white border-slate-100'
                    }`}>
                       <div className="flex items-center gap-4">
                          <div className="relative">
                             <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100">
                                <img src={getProfilePic(emp)} alt="User" className="w-full h-full object-cover" />
                             </div>
                             <div className="absolute -top-2 -left-2 w-6 h-6 bg-slate-900 text-white rounded-lg flex items-center justify-center text-[10px] font-black shadow-lg">
                                {emp.rank}
                             </div>
                          </div>
                          <div>
                             <p className="text-sm font-black text-slate-900 leading-none mb-1">{emp.name} {emp.id === user.id && '(You)'}</p>
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{emp.designation}</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="text-lg font-black text-blue-600 leading-none">{emp.score}</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Efficiency</p>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </Modal>

        <style dangerouslySetInnerHTML={{ __html: `
            .custom-scrollbar::-webkit-scrollbar { width: 6px; }
            .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
            .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        `}} />
    </div>
  );
};

// --- Sub-components ---

const MetricCard = ({ icon: Icon, label, value, sub, color, progress, alert, onClick, clickable }) => (
  <div
    onClick={onClick}
    className={`bg-white p-8 rounded-[2.5rem] border border-slate-200/60 shadow-sm shadow-blue-500/5 transition-all relative overflow-hidden group ${
      clickable ? 'cursor-pointer hover:border-blue-200 hover:shadow-xl' : ''
    }`}
  >
    <div className={`w-14 h-14 rounded-[1.25rem] mb-6 flex items-center justify-center ${
      color === 'blue' ? 'bg-blue-50 text-blue-600' :
      color === 'purple' ? 'bg-purple-50 text-purple-600' :
      color === 'amber' ? 'bg-amber-50 text-amber-600' :
      'bg-emerald-50 text-emerald-600'
    }`}>
       <Icon size={28} />
    </div>
    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">{label}</p>
    <h3 className="text-2xl font-black text-slate-900 mb-1.5 truncate">{value}</h3>
    <div className="flex items-center gap-2">
       {alert && <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>}
       <p className={`text-[10px] font-bold uppercase tracking-tighter ${alert ? 'text-red-500' : 'text-slate-400'}`}>{sub}</p>
    </div>

    {progress && (
       <div className="mt-6 h-1 w-full bg-slate-50 rounded-full overflow-hidden">
          <div className="h-full bg-purple-500 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.4)]" style={{ width: `${progress}%` }}></div>
       </div>
    )}

    {clickable && <ArrowUpRight className="absolute top-8 right-8 text-slate-100 group-hover:text-blue-500 transition-colors" size={24} />}
  </div>
);

const ScoreBar = ({ label, value, max, color }) => (
  <div className="space-y-2">
     <div className="flex justify-between items-end text-[10px] font-black uppercase tracking-widest">
        <span className="text-slate-400">{label}</span>
        <span className="text-slate-900">{value}</span>
     </div>
     <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100/50">
        <div
          className={`h-full rounded-full shadow-sm transition-all duration-1000 ${
            color === 'blue' ? 'bg-blue-500' : color === 'indigo' ? 'bg-indigo-500' : color === 'purple' ? 'bg-purple-500' : 'bg-amber-500'
          }`}
          style={{ width: `${(value/max)*100}%` }}
        ></div>
     </div>
  </div>
);

const KPICard = ({ icon: Icon, color, label, value }) => (
  <div className="p-4 bg-white border border-slate-100 rounded-2xl flex flex-col items-center text-center shadow-sm">
     <div className={`w-10 h-10 rounded-xl mb-4 flex items-center justify-center ${
       color === 'blue' ? 'bg-blue-50 text-blue-600' :
       color === 'emerald' ? 'bg-emerald-50 text-emerald-600' :
       color === 'red' ? 'bg-red-50 text-red-600' :
       'bg-purple-50 text-purple-600'
     }`}>
        <Icon size={18} />
     </div>
     <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-tight">{label}</p>
     <h4 className="text-lg font-black text-slate-900 leading-none">{value}</h4>
  </div>
);

export default EmployeeDashboard;
