import React, { useState, useEffect, useRef } from 'react';
import {
  UserCheck, Clock, Camera, Fingerprint, Calendar,
  AlertCircle, CheckCircle2, ChevronLeft, ChevronRight,
  MapPin, Loader2
} from 'lucide-react';
import { apiFetch } from '../utils/api';
import Button from '../admin/components/Button';

const AttendancePage = () => {
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({ PRESENT: 0, ABSENT: 0, LATE: 0, LEAVE: 0 });
  const [loading, setLoading] = useState(true);
  const [todayLog, setTodayLog] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [isBiometricActive, setIsBiometricActive] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const fetchLogs = async () => {
    try {
      const response = await apiFetch('/api/attendance/my-logs');
      const data = await response.json();
      if (data.success) {
        setLogs(data.data);
        setStats(data.stats);

        const today = new Date().toISOString().split('T')[0];
        const found = data.data.find(log => log.date === today);
        setTodayLog(found);
      }
    } catch (err) {
      console.error('Failed to fetch attendance logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const startCamera = async () => {
    setShowCamera(true);
    setCapturedImage(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Camera access denied:', err);
      alert('Please allow camera access for verification.');
      setShowCamera(false);
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);
      const dataUrl = canvas.toDataURL('image/jpeg');
      setCapturedImage(dataUrl);

      // Stop camera stream
      const stream = video.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      setShowCamera(false);
    }
  };

  const handleAttendance = async (type) => {
    if (!capturedImage) {
      alert('Selfie verification is mandatory.');
      return;
    }

    setIsCheckingIn(true);
    try {
      const blob = await (await fetch(capturedImage)).blob();
      const formData = new FormData();
      formData.append('selfie', blob, 'selfie.jpg');
      formData.append('biometricVerified', isBiometricActive);

      const endpoint = type === 'in' ? '/api/attendance/check-in' : '/api/attendance/check-out';

      // We use raw fetch here because apiFetch might not handle FormData perfectly depending on implementation
      // But let's assume apiFetch handles it or fallback to fetch
      const token = localStorage.getItem('rcs_admin_token');
      const backendUrl = import.meta.env.VITE_API_URL || 'https://rcs-ajbn.onrender.com';

      const response = await fetch(`${backendUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();
      if (data.success) {
        alert(`${type === 'in' ? 'Check-in' : 'Check-out'} successful!`);
        setCapturedImage(null);
        fetchLogs();
      } else {
        alert(data.message || 'Verification failed');
      }
    } catch (err) {
      console.error('Attendance error:', err);
      alert('Network error during verification.');
    } finally {
      setIsCheckingIn(false);
    }
  };

  const toggleBiometric = () => {
    // Mocking biometric verification
    if (!isBiometricActive) {
      if (window.confirm('Enable biometric verification for this session?')) {
        setIsBiometricActive(true);
      }
    } else {
      setIsBiometricActive(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
    </div>
  );

  return (
    <div className="animate-in fade-in duration-700 max-w-6xl mx-auto">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Attendance Terminal</h1>
        <p className="text-slate-500 font-medium">Verified check-in and monthly tracking.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Column: Actions */}
        <div className="lg:col-span-1 space-y-6">
           <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200/60 shadow-sm shadow-blue-500/5">
              <h2 className="text-xl font-black mb-6 flex items-center gap-3">
                <Fingerprint className="text-blue-600" /> Verify Identity
              </h2>

              <div className="space-y-6">
                 {/* Camera / Preview Area */}
                 <div className="aspect-square rounded-3xl bg-slate-100 border-2 border-dashed border-slate-200 overflow-hidden relative group">
                    {showCamera ? (
                      <div className="w-full h-full relative">
                        <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                        <button
                          onClick={capturePhoto}
                          className="absolute bottom-6 left-1/2 -translate-x-1/2 w-16 h-16 bg-white rounded-full border-4 border-blue-600 flex items-center justify-center shadow-xl active:scale-90 transition-transform"
                        >
                          <Camera className="text-blue-600" />
                        </button>
                      </div>
                    ) : capturedImage ? (
                      <div className="w-full h-full relative">
                        <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
                        <button
                          onClick={startCamera}
                          className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-xl backdrop-blur-md"
                        >
                          <Clock size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-slate-400 group-hover:text-blue-600 transition-colors">
                         <Camera size={48} />
                         <p className="text-xs font-black uppercase tracking-widest">Selfie Verification Mandatory</p>
                         <Button onClick={startCamera} variant="secondary" className="rounded-xl">Open Camera</Button>
                      </div>
                    )}
                    <canvas ref={canvasRef} className="hidden" />
                 </div>

                 {/* Biometric Toggle */}
                 <button
                   onClick={toggleBiometric}
                   className={`w-full p-4 rounded-2xl border flex items-center justify-between transition-all ${
                     isBiometricActive ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-slate-50 border-slate-100 text-slate-500'
                   }`}
                 >
                    <div className="flex items-center gap-3">
                       <Fingerprint size={20} />
                       <span className="text-sm font-black uppercase tracking-widest">Biometric Option</span>
                    </div>
                    <div className={`w-10 h-5 rounded-full relative transition-colors ${isBiometricActive ? 'bg-blue-600' : 'bg-slate-300'}`}>
                       <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${isBiometricActive ? 'left-6' : 'left-1'}`} />
                    </div>
                 </button>

                 {/* Action Buttons */}
                 <div className="grid grid-cols-2 gap-4">
                    <button
                      disabled={isCheckingIn || !!(todayLog && todayLog.checkIn)}
                      onClick={() => handleAttendance('in')}
                      className="py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-emerald-600/20 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale"
                    >
                       {isCheckingIn ? '...' : 'Check In'}
                    </button>
                    <button
                      disabled={isCheckingIn || !todayLog || !!todayLog.checkOut}
                      onClick={() => handleAttendance('out')}
                      className="py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-slate-900/20 active:scale-95 transition-all disabled:opacity-50"
                    >
                       {isCheckingIn ? '...' : 'Check Out'}
                    </button>
                 </div>

                 {todayLog && (
                   <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl text-blue-700 text-xs font-bold space-y-2">
                      <p className="flex justify-between">
                         <span>Check-in:</span>
                         <span>{new Date(todayLog.checkIn).toLocaleTimeString()}</span>
                      </p>
                      {todayLog.checkOut && (
                        <p className="flex justify-between">
                           <span>Check-out:</span>
                           <span>{new Date(todayLog.checkOut).toLocaleTimeString()}</span>
                        </p>
                      )}
                   </div>
                 )}
              </div>
           </div>
        </div>

        {/* Right Columns: Stats & Logs */}
        <div className="lg:col-span-2 space-y-8">
           {/* Stats Grid */}
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <LogStatCard label="Present" value={stats.PRESENT} color="emerald" />
              <LogStatCard label="Absent" value={stats.ABSENT} color="red" />
              <LogStatCard label="Late" value={stats.LATE} color="amber" />
              <LogStatCard label="Leave" value={stats.LEAVE} color="blue" />
           </div>

           {/* Detailed Log Table */}
           <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200/60 shadow-sm shadow-blue-500/5">
              <h2 className="text-xl font-black mb-8 text-slate-900">Attendance History</h2>

              <div className="overflow-x-auto">
                 <table className="w-full text-left border-collapse">
                    <thead>
                       <tr className="border-b border-slate-100">
                          <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                          <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                          <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Check In</th>
                          <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Check Out</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                       {logs.map((log, idx) => (
                         <tr key={idx} className="group hover:bg-slate-50/50 transition-colors">
                            <td className="py-5">
                               <p className="text-sm font-black text-slate-900">{new Date(log.date).toLocaleDateString('en-US', {month:'short', day:'numeric', year:'numeric'})}</p>
                            </td>
                            <td className="py-5">
                               <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                                 log.status === 'PRESENT' ? 'bg-emerald-50 text-emerald-600' :
                                 log.status === 'LATE' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'
                               }`}>
                                 {log.status}
                               </span>
                            </td>
                            <td className="py-5">
                               <p className="text-xs font-bold text-slate-600">{log.checkIn ? new Date(log.checkIn).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : '--:--'}</p>
                            </td>
                            <td className="py-5">
                               <p className="text-xs font-bold text-slate-600">{log.checkOut ? new Date(log.checkOut).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : '--:--'}</p>
                            </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

const LogStatCard = ({ label, value, color }) => (
  <div className={`p-6 rounded-[2rem] border bg-white shadow-sm flex flex-col items-center justify-center ${
    color === 'emerald' ? 'border-emerald-100 shadow-emerald-500/5' :
    color === 'red' ? 'border-red-100 shadow-red-500/5' :
    color === 'amber' ? 'border-amber-100 shadow-amber-500/5' :
    'border-blue-100 shadow-blue-500/5'
  }`}>
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{label}</p>
    <h3 className={`text-3xl font-black ${
      color === 'emerald' ? 'text-emerald-600' :
      color === 'red' ? 'text-red-600' :
      color === 'amber' ? 'text-amber-600' :
      'text-blue-600'
    }`}>{value}</h3>
  </div>
);

export default AttendancePage;
