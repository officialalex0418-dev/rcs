import React, { useState, useEffect } from 'react';
import {
  User, Mail, Phone, MapPin, Briefcase, Building2,
  Camera, Loader2, Save, Lock, AlertCircle
} from 'lucide-react';
import { apiFetch } from '../utils/api';
import Button from '../admin/components/Button';
import Input from '../admin/components/Input';

import { syncUserData, getProfilePic } from '../utils/auth';

const EmployeeSettings = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);
  const [formData, setFormData] = useState({
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
          phone: data.data.user.phone || '',
          address: data.data.user.address || '',
          profilePicture: null
        });
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err);
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
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
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
    <div className="animate-in fade-in duration-700 max-w-4xl mx-auto pb-20">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">My Settings</h1>
        <p className="text-slate-500 font-medium">Manage your professional identity and contact information.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Profile Header Card */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200/60 shadow-sm shadow-blue-500/5">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative group">
              <div className="w-32 h-32 rounded-[2rem] overflow-hidden bg-slate-100 border-4 border-white shadow-xl">
                <img
                  src={profilePreview || getProfilePic(user)}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <label className="absolute bottom-0 right-0 w-10 h-10 bg-blue-600 text-white rounded-xl border-4 border-white flex items-center justify-center cursor-pointer shadow-lg hover:bg-blue-700 transition-colors">
                 <Camera size={18} />
                 <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
              </label>
            </div>

            <div className="text-center md:text-left">
              <h2 className="text-2xl font-black text-slate-900 mb-1">{user.name}</h2>
              <p className="text-blue-600 font-bold text-xs uppercase tracking-widest mb-4">{user.designation} • ID: {user.employeeId}</p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                 <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                    <Building2 size={14} /> {user.department}
                 </div>
                 <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                    <Mail size={14} /> {user.email}
                 </div>
              </div>
            </div>
          </div>
        </div>

        {message && (
          <div className={`p-4 rounded-2xl flex items-center gap-3 text-sm font-bold ${
            message.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'
          }`}>
            <AlertCircle size={18} />
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {/* Information Edit Section */}
           <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200/60 shadow-sm space-y-6">
              <h3 className="text-lg font-black text-slate-900 mb-2">Update Information</h3>

              <div className="space-y-4">
                 <Input
                   label="Phone Number"
                   icon={Phone}
                   value={formData.phone}
                   onChange={(e) => setFormData({...formData, phone: e.target.value})}
                   placeholder="+977-XXXXXXXXXX"
                 />
                 <Input
                   label="Residential Address"
                   icon={MapPin}
                   value={formData.address}
                   onChange={(e) => setFormData({...formData, address: e.target.value})}
                   placeholder="Street, City, Country"
                 />
              </div>

              <Button
                type="submit"
                className="w-full py-4 rounded-2xl mt-4"
                disabled={isUpdating}
                icon={Save}
              >
                {isUpdating ? 'Saving Changes...' : 'Save Profile'}
              </Button>
           </div>

           {/* Non-Editable Details */}
           <div className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100 space-y-6">
              <h3 className="text-lg font-black text-slate-400 mb-2">System Records</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase mb-4 italic">These fields can only be modified by HR Admin.</p>

              <div className="space-y-6">
                 <ReadOnlyField icon={Mail} label="Official Email" value={user.email} />
                 <ReadOnlyField icon={Briefcase} label="Designation" value={user.designation} />
                 <ReadOnlyField icon={Building2} label="Department" value={user.department} />
                 <ReadOnlyField icon={User} label="Employee ID" value={user.employeeId} />
              </div>

              <div className="pt-6 border-t border-slate-200">
                 <Button variant="secondary" className="w-full py-4 rounded-2xl bg-white" icon={Lock}>
                    Request Data Change
                 </Button>
              </div>
           </div>
        </div>
      </form>
    </div>
  );
};

const ReadOnlyField = ({ icon: Icon, label, value }) => (
  <div className="space-y-1.5">
     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
        <Icon size={10} /> {label}
     </p>
     <p className="text-sm font-bold text-slate-500 bg-slate-100/50 p-3 rounded-xl border border-slate-200/30">{value}</p>
  </div>
);

export default EmployeeSettings;
