import React, { useState, useEffect } from 'react';
import {
  User, Mail, Phone, MapPin, Briefcase, Building2,
  Camera, Loader2, Save, Lock, AlertCircle, Shield
} from 'lucide-react';
import { apiFetch } from '../../utils/api';
import Button from '../components/Button';
import Input from '../components/Input';
import { syncUserData, getProfilePic } from '../../utils/auth';

const AdminSettings = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    profilePicture: null
  });

  const fetchProfile = async () => {
    try {
      const response = await apiFetch('/api/auth/me');
      const data = await response.json();
      if (data.success) {
        setUser(data.data.user);
        setFormData({
          name: data.data.user.name || '',
          phone: data.data.user.phone || '',
          address: data.data.user.address || '',
          profilePicture: null
        });
      }
    } catch (err) {
      console.error('Failed to fetch admin profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, profilePicture: file });
      const reader = new FileReader();
      reader.onloadend = () => setProfilePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setMessage(null);

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('phone', formData.phone);
      data.append('address', formData.address);
      if (formData.profilePicture) {
        data.append('profilePicture', formData.profilePicture);
      }

      const token = localStorage.getItem('rcs_admin_token');
      const backendUrl = import.meta.env.VITE_API_URL || 'https://rcs-ajbn.onrender.com';
      const cleanUrl = backendUrl.endsWith('/') ? backendUrl.slice(0, -1) : backendUrl;

      const response = await fetch(`${cleanUrl}/api/auth/update-me`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: data
      });

      const result = await response.json();
      if (result.success) {
        setMessage({ type: 'success', text: 'Admin profile updated successfully!' });
        setUser(result.data.user);
        syncUserData(result.data.user);
      } else {
        setMessage({ type: 'error', text: result.message || 'Update failed' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
    </div>
  );

  return (
    <div className="animate-in fade-in duration-700 max-w-5xl mx-auto p-8 font-sans">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Admin Settings</h1>
        <p className="text-slate-500 font-medium">Manage your administrative profile and portal preferences.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Profile Header Card */}
        <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden border border-white/5 shadow-2xl shadow-slate-900/20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
          <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
            <div className="relative group">
              <div className="w-40 h-40 rounded-[2.5rem] overflow-hidden bg-slate-800 border-4 border-white/10 shadow-2xl">
                <img
                  src={profilePreview || getProfilePic(user)}
                  alt="Admin Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <label className="absolute bottom-2 right-2 w-12 h-12 bg-blue-600 text-white rounded-2xl border-4 border-slate-900 flex items-center justify-center cursor-pointer shadow-lg hover:bg-blue-700 transition-colors">
                 <Camera size={22} />
                 <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
              </label>
            </div>

            <div className="text-center md:text-left space-y-4">
              <div>
                 <div className="flex items-center justify-center md:justify-start gap-3 mb-1">
                    <h2 className="text-3xl font-black">{user.name}</h2>
                    <span className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border border-blue-500/30">System {user.role}</span>
                 </div>
                 <p className="text-slate-400 font-bold text-sm tracking-tight">{user.designation} • Portal ID: {user.employeeId}</p>
              </div>
              <div className="flex flex-wrap gap-6 justify-center md:justify-start opacity-70">
                 <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                    <Building2 size={14} className="text-blue-400" /> {user.department}
                 </div>
                 <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                    <Mail size={14} className="text-blue-400" /> {user.email}
                 </div>
              </div>
            </div>
          </div>
        </div>

        {message && (
          <div className={`p-6 rounded-[2rem] flex items-center gap-4 text-sm font-black uppercase tracking-widest animate-in slide-in-from-top-4 ${
            message.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'
          }`}>
            <AlertCircle size={20} />
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
           <div className="xl:col-span-8 bg-white rounded-[3rem] p-10 border border-slate-200 shadow-sm space-y-8">
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                 <Shield size={24} className="text-blue-600" /> Personal Protocol
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <Input
                   label="Display Name"
                   value={formData.name}
                   onChange={(e) => setFormData({...formData, name: e.target.value})}
                   placeholder="Admin Name"
                 />
                 <Input
                   label="Tactical Contact"
                   icon={Phone}
                   value={formData.phone}
                   onChange={(e) => setFormData({...formData, phone: e.target.value})}
                   placeholder="+977-XXXXXXXXXX"
                 />
                 <div className="md:col-span-2">
                    <Input
                      label="Strategic Location (Address)"
                      icon={MapPin}
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      placeholder="Operational Base Address"
                    />
                 </div>
              </div>

              <div className="pt-6">
                 <Button
                   type="submit"
                   className="w-full xl:w-fit px-12 py-4 rounded-2xl shadow-xl shadow-blue-600/10"
                   disabled={isUpdating}
                   icon={Save}
                 >
                   {isUpdating ? 'Executing Update...' : 'Commit Profile Changes'}
                 </Button>
              </div>
           </div>

           <div className="xl:col-span-4 space-y-8">
              <div className="bg-slate-50 rounded-[3rem] p-8 border border-slate-200">
                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8">Access Level Details</h4>
                 <div className="space-y-6">
                    <ReadOnlyItem label="Core ID" val={user.employeeId} />
                    <ReadOnlyItem label="Security Role" val={user.role} />
                    <ReadOnlyItem label="Department" val={user.department} />
                    <ReadOnlyItem label="Official Email" val={user.email} />
                 </div>
                 <div className="mt-10 pt-8 border-t border-slate-200">
                    <Button variant="secondary" className="w-full py-4 rounded-2xl bg-white border-slate-200" icon={Lock}>
                       Reset Passphrase
                    </Button>
                 </div>
              </div>
           </div>
        </div>
      </form>
    </div>
  );
};

const ReadOnlyItem = ({ label, val }) => (
  <div className="space-y-1.5">
     <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</p>
     <p className="text-xs font-bold text-slate-900 bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">{val}</p>
  </div>
);

export default AdminSettings;
