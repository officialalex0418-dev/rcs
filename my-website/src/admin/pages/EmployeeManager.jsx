import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Wallet,
  Briefcase,
  Building2,
  Loader2,
  AlertCircle
} from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';
import Modal from '../components/Modal';

const EmployeeManager = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    panNumber: '',
    department: '',
    designation: '',
    basicSalary: '',
    dailyAllowance: '',
  });

  const fetchEmployees = async () => {
    try {
      const backendUrl = import.meta.env.VITE_API_URL || '';
      const token = localStorage.getItem('rcs_admin_token');
      const response = await fetch(`${backendUrl}/api/employees`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) setEmployees(data.data);
    } catch (err) {
      console.error('Failed to fetch employees:', err);
      setError('Could not load personnel data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.phone) return 'Primary details are required.';
    if (!/\S+@\S+\.\S+/.test(formData.email)) return 'Invalid email format.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const backendUrl = import.meta.env.VITE_API_URL || '';
      const token = localStorage.getItem('rcs_admin_token');
      const url = editingId ? `${backendUrl}/api/employees/${editingId}` : `${backendUrl}/api/employees`;
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (response.ok) {
        setShowModal(false);
        resetForm();
        fetchEmployees();
      } else {
        setError(data.message || 'Failed to save employee profile.');
      }
    } catch (err) {
      setError('Network error. Please check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (emp) => {
    setFormData({
      name: emp.name || '',
      email: emp.email || '',
      phone: emp.phone || '',
      address: emp.address || '',
      panNumber: emp.panNumber || '',
      department: emp.department || '',
      designation: emp.designation || '',
      basicSalary: emp.basicSalary || '',
      dailyAllowance: emp.dailyAllowance || '',
    });
    setEditingId(emp._id);
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      panNumber: '',
      department: '',
      designation: '',
      basicSalary: '',
      dailyAllowance: '',
    });
    setEditingId(null);
    setError(null);
  };

  const filteredEmployees = employees.filter(emp =>
    emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.designation?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Personnel Directory</h1>
          <p className="text-slate-500 font-medium">Manage and monitor the RCS core team.</p>
        </div>
        <Button
          onClick={() => { resetForm(); setShowModal(true); }}
          icon={Plus}
          className="rounded-2xl px-6 py-3 shadow-blue-500/20"
        >
          Add New Employee
        </Button>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200/60 overflow-hidden">
        {/* Search & Filter Bar */}
        <div className="p-6 border-b border-slate-100 bg-slate-50/30 flex items-center gap-4">
          <div className="relative flex-1 max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
            <input
              type="text"
              placeholder="Search by name, email, or role..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/20 transition-all font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Employee</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Position & Unit</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Compensation</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-8 py-20 text-center">
                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Accessing Database...</p>
                  </td>
                </tr>
              ) : filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-8 py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">
                    No personnel records match your search
                  </td>
                </tr>
              ) : filteredEmployees.map((emp) => (
                <tr key={emp._id} className="hover:bg-slate-50/80 transition-all group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 flex items-center justify-center font-black text-lg shadow-sm border border-white">
                        {emp.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900 leading-tight mb-1">{emp.name}</p>
                        <span className="text-xs text-slate-400 font-bold flex items-center gap-1.5 leading-none">
                          <Mail size={12} className="text-slate-300" /> {emp.email}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-1.5">
                       <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-100/50">
                         {emp.designation || 'Staff'}
                       </span>
                       <p className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                         <Building2 size={12} className="text-slate-300" /> {emp.department || 'General'}
                       </p>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                       <span className="text-sm font-black text-slate-900">Rs. {Number(emp.basicSalary || 0).toLocaleString()}</span>
                       <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Base Monthly</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
                      <button
                        onClick={() => handleEdit(emp)}
                        className="p-2.5 bg-white text-slate-500 rounded-xl hover:bg-slate-900 hover:text-white transition-all shadow-sm border border-slate-100"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button className="p-2.5 bg-white text-red-500 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm border border-slate-100">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Onboarding Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingId ? 'Refine Employee Profile' : 'Onboard New Personnel'}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-bold">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Full Name"
              placeholder="e.g. Ramesh Thapa"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <Input
              label="Email Address"
              type="email"
              placeholder="name@rcs.com.np"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <Input
              label="Contact Number"
              icon={Phone}
              placeholder="+977-XXXXXXXXXX"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
            <Input
              label="PAN Identifier"
              icon={CreditCard}
              placeholder="9-digit PAN"
              value={formData.panNumber}
              onChange={(e) => setFormData({ ...formData, panNumber: e.target.value })}
            />
            <div className="col-span-2">
              <Input
                label="Permanent Address"
                icon={MapPin}
                placeholder="Street name, City, Country"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
            <Input
              label="Department"
              icon={Building2}
              placeholder="e.g. Engineering"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            />
            <Input
              label="Designation"
              icon={Briefcase}
              placeholder="e.g. Senior Developer"
              value={formData.designation}
              onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
            />
            <Input
              label="Basic Salary"
              type="number"
              icon={Wallet}
              placeholder="Monthly Amount"
              value={formData.basicSalary}
              onChange={(e) => setFormData({ ...formData, basicSalary: e.target.value })}
            />
            <Input
              label="Daily Allowance"
              type="number"
              icon={Plus}
              placeholder="Per Day Amount"
              value={formData.dailyAllowance}
              onChange={(e) => setFormData({ ...formData, dailyAllowance: e.target.value })}
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-slate-100 mt-6">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowModal(false)}
              className="flex-1 rounded-xl"
            >
              Discard
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-2 min-w-[160px] rounded-xl"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : editingId ? 'Update Profile' : 'Save Employee'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default EmployeeManager;
