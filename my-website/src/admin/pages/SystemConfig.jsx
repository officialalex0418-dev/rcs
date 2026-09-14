import React, { useState, useEffect } from 'react';
import {
  Settings, Building2, Clock, Plus, Trash2, Edit2,
  Check, X, Calendar, Save, AlertCircle
} from 'lucide-react';
import { apiFetch } from '../../utils/api';
import Modal from '../components/Modal';

const SystemConfig = () => {
  const [activeTab, setActiveTab] = useState('departments');
  const [departments, setDepartments] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState([]);

  // Modal states
  const [showDeptModal, setShowDeptModal] = useState(false);
  const [showShiftModal, setShowShiftModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [deptForm, setDeptForm] = useState({ name: '', description: '', head: '' });
  const [shiftForm, setShiftForm] = useState({
    name: '', startTime: '09:00', endTime: '18:00',
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  });

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const fetchData = async () => {
    setLoading(true);
    try {
      const [deptRes, shiftRes, empRes] = await Promise.all([
        apiFetch('/api/departments'),
        apiFetch('/api/shifts'),
        apiFetch('/api/employees')
      ]);

      const deptData = await deptRes.json();
      const shiftData = await shiftRes.json();
      const empData = await empRes.json();

      if (deptData.success) setDepartments(deptData.data);
      if (shiftData.success) setShifts(shiftData.data);
      if (empData.success) setEmployees(empData.data);
    } catch (err) {
      console.error('Error fetching config data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeptSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = editingItem ? 'PUT' : 'POST';
      const url = editingItem ? `/api/departments/${editingItem._id}` : '/api/departments';

      const res = await apiFetch(url, {
        method,
        body: JSON.stringify(deptForm)
      });

      if (res.ok) {
        setShowDeptModal(false);
        setEditingItem(null);
        setDeptForm({ name: '', description: '', head: '' });
        fetchData();
      }
    } catch (err) {
      console.error('Error saving department:', err);
    }
  };

  const handleShiftSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = editingItem ? 'PUT' : 'POST';
      const url = editingItem ? `/api/shifts/${editingItem._id}` : '/api/shifts';

      const res = await apiFetch(url, {
        method,
        body: JSON.stringify(shiftForm)
      });

      if (res.ok) {
        setShowShiftModal(false);
        setEditingItem(null);
        setShiftForm({
          name: '', startTime: '09:00', endTime: '18:00',
          workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
        });
        fetchData();
      }
    } catch (err) {
      console.error('Error saving shift:', err);
    }
  };

  const deleteItem = async (type, id) => {
    if (!window.confirm(`Are you sure you want to delete this ${type === 'departments' ? 'department' : 'shift'}?`)) return;
    try {
      const res = await apiFetch(`/api/${type}/${id}`, { method: 'DELETE' });
      if (res.ok) fetchData();
    } catch (err) {
      console.error('Error deleting item:', err);
    }
  };

  const toggleDay = (day) => {
    setShiftForm(prev => {
      const workingDays = prev.workingDays.includes(day)
        ? prev.workingDays.filter(d => d !== day)
        : [...prev.workingDays, day];
      return { ...prev, workingDays };
    });
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
              <Settings className="text-blue-600" size={32} /> System Configuration
            </h1>
            <p className="text-slate-500 font-medium">Manage organization structure and working protocols.</p>
          </div>
          <button
            onClick={() => {
              setEditingItem(null);
              if (activeTab === 'departments') {
                setDeptForm({ name: '', description: '', head: '' });
                setShowDeptModal(true);
              } else {
                setShiftForm({ name: '', startTime: '09:00', endTime: '18:00', workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] });
                setShowShiftModal(true);
              }
            }}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20"
          >
            <Plus size={18} /> Add {activeTab === 'departments' ? 'Department' : 'Shift'}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 p-1.5 bg-white border border-slate-200 rounded-[2rem] shadow-sm w-fit">
          <button
            onClick={() => setActiveTab('departments')}
            className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'departments' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}
          >
            <Building2 size={16} className="inline-block mr-2" /> Departments
          </button>
          <button
            onClick={() => setActiveTab('shifts')}
            className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'shifts' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}
          >
            <Clock size={16} className="inline-block mr-2" /> Shifts
          </button>
        </div>

        {loading ? (
          <div className="py-20 text-center text-slate-400 font-bold animate-pulse uppercase tracking-widest">Synchronizing Configuration...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
            {activeTab === 'departments' ? (
              departments.map(dept => (
                <div key={dept._id} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 hover:shadow-xl transition-all group relative">
                  <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => {
                        setEditingItem(dept);
                        setDeptForm({ name: dept.name, description: dept.description, head: dept.head?._id || dept.head || '' });
                        setShowDeptModal(true);
                      }}
                      className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-colors"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => deleteItem('departments', dept._id)}
                      className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
                    <Building2 size={24} />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-2">{dept.name}</h3>
                  <p className="text-xs text-slate-500 font-medium mb-6 line-clamp-2">{dept.description || 'Strategic organizational unit.'}</p>
                  <div className="pt-6 border-t border-slate-100">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Department Head</p>
                    <p className="text-xs font-bold text-slate-700">{dept.head?.name || 'Not Assigned'}</p>
                  </div>
                </div>
              ))
            ) : (
              shifts.map(shift => (
                <div key={shift._id} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 hover:shadow-xl transition-all group relative">
                  <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => {
                        setEditingItem(shift);
                        setShiftForm({ name: shift.name, startTime: shift.startTime, endTime: shift.endTime, workingDays: shift.workingDays });
                        setShowShiftModal(true);
                      }}
                      className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-colors"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => deleteItem('shifts', shift._id)}
                      className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mb-6">
                    <Clock size={24} />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-2">{shift.name}</h3>
                  <div className="flex gap-4 mb-6">
                    <div className="bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                      <p className="text-[8px] font-black text-slate-400 uppercase">Start</p>
                      <p className="text-xs font-bold">{shift.startTime}</p>
                    </div>
                    <div className="bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                      <p className="text-[8px] font-black text-slate-400 uppercase">End</p>
                      <p className="text-xs font-bold">{shift.endTime}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {days.map(day => (
                      <span
                        key={day}
                        className={`text-[8px] font-black px-2 py-0.5 rounded-md border ${shift.workingDays.includes(day) ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-300 border-slate-100'}`}
                      >
                        {day.substring(0, 3)}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Dept Modal */}
        <Modal isOpen={showDeptModal} onClose={() => setShowDeptModal(false)} title={editingItem ? "Refine Department" : "Protocol: New Department"}>
          <form onSubmit={handleDeptSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Department Identifier</label>
              <input
                required
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-bold focus:border-blue-500 transition-all"
                placeholder="e.g. Tactical Development"
                value={deptForm.name}
                onChange={e => setDeptForm({...deptForm, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Executive Summary</label>
              <textarea
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-medium focus:border-blue-500 transition-all"
                placeholder="Define the scope of this department..."
                rows="3"
                value={deptForm.description}
                onChange={e => setDeptForm({...deptForm, description: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Personnel Command (Head)</label>
              <select
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-bold"
                value={deptForm.head}
                onChange={e => setDeptForm({...deptForm, head: e.target.value})}
              >
                <option value="">Select Personnel</option>
                {employees.map(emp => <option key={emp._id} value={emp._id}>{emp.name}</option>)}
              </select>
            </div>
            <div className="flex gap-4 pt-6">
              <button type="button" onClick={() => setShowDeptModal(false)} className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all">Abort</button>
              <button type="submit" className="flex-1 py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 active:scale-95 transition-all">
                <Save size={16} className="inline mr-2" /> {editingItem ? 'Update' : 'Initialize'}
              </button>
            </div>
          </form>
        </Modal>

        {/* Shift Modal */}
        <Modal isOpen={showShiftModal} onClose={() => setShowShiftModal(false)} title={editingItem ? "Refine Shift Protocol" : "New Shift Protocol"}>
          <form onSubmit={handleShiftSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Shift Callsign</label>
              <input
                required
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-bold focus:border-blue-500 transition-all"
                placeholder="e.g. Standard Alpha"
                value={shiftForm.name}
                onChange={e => setShiftForm({...shiftForm, name: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Start Time</label>
                <input
                  type="time"
                  required
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-bold"
                  value={shiftForm.startTime}
                  onChange={e => setShiftForm({...shiftForm, startTime: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">End Time</label>
                <input
                  type="time"
                  required
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-bold"
                  value={shiftForm.endTime}
                  onChange={e => setShiftForm({...shiftForm, endTime: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Operational Days</label>
              <div className="grid grid-cols-4 gap-2">
                {days.map(day => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={`py-3 rounded-xl text-[9px] font-black uppercase border transition-all ${shiftForm.workingDays.includes(day) ? 'bg-slate-900 text-white border-slate-900 shadow-lg' : 'bg-white text-slate-400 border-slate-200 hover:border-blue-400'}`}
                  >
                    {day.substring(0, 3)}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-4 pt-6">
              <button type="button" onClick={() => setShowShiftModal(false)} className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all">Abort</button>
              <button type="submit" className="flex-1 py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 active:scale-95 transition-all">
                <Save size={16} className="inline mr-2" /> {editingItem ? 'Update' : 'Initialize'}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default SystemConfig;
