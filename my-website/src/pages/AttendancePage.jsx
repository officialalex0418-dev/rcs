import React, { useState, useEffect, useRef } from 'react';
import {
  UserCheck, Clock, Camera, Calendar,
  AlertCircle, CheckCircle2, Loader2, X
} from 'lucide-react';
import { apiFetch } from '../utils/api';
import { getProfilePic } from '../utils/auth';
import Button from '../admin/components/Button';
import Modal from '../admin/components/Modal';

const AttendancePage = () => {
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({ PRESENT: 0, ABSENT: 0, LATE: 0, LEAVE: 0 });
  const [loading, setLoading] = useState(true);
  const [todayLog, setTodayLog] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Camera Modal State
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [attendanceType, setAttendanceType] = useState(null); // 'in' or 'out'
  const [capturedImage, setCapturedImage] = useState(null);
  const [cameraStream, setCameraStream] = useState(null);

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
        setTodayLog(data.data.find(log => log.date === today));
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

  const handleActionClick = async (type) => {
    setAttendanceType(type);
    setShowCameraModal(true);
    setCapturedImage(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      setCameraStream(stream);
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      alert('Camera access is required for verification.');
      setShowCameraModal(false);
    }
  };

  const captureAndSubmit = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL('image/jpeg');
    setCapturedImage(dataUrl);

    // Stop stream
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }

    setIsProcessing(true);
    try {
      const blob = await (await fetch(dataUrl)).blob();
      const formData = new FormData();
      formData.append('selfie', blob, 'selfie.jpg');

      const endpoint = attendanceType === 'in' ? '/api/attendance/check-in' : '/api/attendance/check-out';
      const token = localStorage.getItem('rcs_admin_token');
      const backendUrl = 'https://rcs-ajbn.onrender.com';

      const response = await fetch(`${backendUrl}${endpoint}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      const data = await response.json();
      if (data.success) {
        alert(`${attendanceType === 'in' ? 'Check-in' : 'Check-out'} Successful!`);
        setShowCameraModal(false);
        fetchLogs();
      } else {
        alert(data.message || 'Verification Failed');
        setCapturedImage(null);
        handleActionClick(attendanceType); // Restart camera
      }
    } catch (err) {
      alert('Network error. Check connection.');
    } finally {
      setIsProcessing(false);
    }
  };

  const closeCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setShowCameraModal(false);
    setCapturedImage(null);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]"><Loader2 className="animate-spin text-blue-600" size={40} /></div>
  );

  return (
    <div className="animate-in fade-in duration-700 max-w-6xl mx-auto">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Attendance Terminal</h1>
        <p className="text-slate-500 font-medium">Verified check-in and monthly tracking.</p>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white rounded-[2.5rem] p-10 border border-slate-200/60 shadow-sm flex flex-col items-center text-center">
             <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mb-6 border border-emerald-100">
                <Clock size={40} />
             </div>
             <h2 className="text-2xl font-black mb-2">Shift Check-In</h2>
             <p className="text-slate-400 text-sm font-medium mb-8">Ready to start your day? Take a quick selfie to verify.</p>
             <button
               disabled={!!(todayLog && todayLog.checkIn)}
               onClick={() => handleActionClick('in')}
               className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-emerald-500/20 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale"
             >
                {todayLog?.checkIn ? `Checked In: ${new Date(todayLog.checkIn).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}` : 'Capture & Check In'}
             </button>
          </div>

          <div className="bg-white rounded-[2.5rem] p-10 border border-slate-200/60 shadow-sm flex flex-col items-center text-center">
             <div className="w-20 h-20 bg-slate-100 text-slate-900 rounded-3xl flex items-center justify-center mb-6 border border-slate-200">
                <LogOut size={40} />
             </div>
             <h2 className="text-2xl font-black mb-2">End of Shift</h2>
             <p className="text-slate-400 text-sm font-medium mb-8">Finished your tasks? Clock out for the day.</p>
             <button
               disabled={!todayLog || !!todayLog.checkOut}
               onClick={() => handleActionClick('out')}
               className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-slate-900/20 active:scale-95 transition-all disabled:opacity-50"
             >
                {todayLog?.checkOut ? `Checked Out: ${new Date(todayLog.checkOut).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}` : 'Capture & Check Out'}
             </button>
          </div>
      </div>

      {/* Stats & History */}
      <div className="space-y-8">
         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <LogStatCard label="Present" value={stats.PRESENT} color="emerald" />
            <LogStatCard label="Absent" value={stats.ABSENT} color="red" />
            <LogStatCard label="Late" value={stats.LATE} color="amber" />
            <LogStatCard label="Leave" value={stats.LEAVE} color="blue" />
         </div>

         <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200/60 shadow-sm">
            <h2 className="text-xl font-black mb-8">Monthly Attendance Log</h2>
            <div className="overflow-x-auto">
               <table className="w-full text-left">
                  <thead>
                     <tr className="border-b border-slate-100">
                        <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                        <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                        <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Verification</th>
                        <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Timings</th>
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
                               log.status === 'PRESENT' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                             }`}>{log.status}</span>
                          </td>
                          <td className="py-5">
                             <div className="flex -space-x-2">
                                {log.checkInSelfie && <img src={getProfilePic({ profilePicture: log.checkInSelfie })} className="w-8 h-8 rounded-full border-2 border-white object-cover" alt="In" />}
                                {log.checkOutSelfie && <img src={getProfilePic({ profilePicture: log.checkOutSelfie })} className="w-8 h-8 rounded-full border-2 border-white object-cover" alt="Out" />}
                             </div>
                          </td>
                          <td className="py-5">
                             <p className="text-xs font-bold text-slate-600">
                               {log.checkIn ? new Date(log.checkIn).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : '--:--'} -
                               {log.checkOut ? new Date(log.checkOut).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : '--:--'}
                             </p>
                          </td>
                       </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
      </div>

      {/* Camera Modal */}
      <Modal isOpen={showCameraModal} onClose={closeCamera} title="Identity Verification">
         <div className="space-y-6">
            <div className="aspect-square rounded-3xl bg-slate-900 overflow-hidden relative border-4 border-white shadow-2xl">
               {capturedImage ? (
                  <img src={capturedImage} className="w-full h-full object-cover" alt="Verification" />
               ) : (
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover scale-x-[-1]" />
               )}
               {isProcessing && (
                 <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-white gap-4">
                    <Loader2 className="animate-spin" size={40} />
                    <p className="font-black uppercase tracking-widest text-[10px]">Processing...</p>
                 </div>
               )}
            </div>

            <div className="flex gap-4">
               <button onClick={closeCamera} className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-200 transition-all">Cancel</button>
               {!capturedImage && (
                 <button
                   onClick={captureAndSubmit}
                   className="flex-2 min-w-[200px] py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 active:scale-95 transition-all"
                 >
                    Capture & Verify
                 </button>
               )}
            </div>
            <canvas ref={canvasRef} className="hidden" />
         </div>
      </Modal>
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
      color === 'emerald' ? 'text-emerald-600' : color === 'red' ? 'text-red-600' : color === 'amber' ? 'text-amber-600' : 'text-blue-600'
    }`}>{value}</h3>
  </div>
);

const LogOut = ({ size, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

export default AttendancePage;
