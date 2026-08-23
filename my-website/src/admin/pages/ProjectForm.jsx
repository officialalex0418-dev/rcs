import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  Image as ImageIcon,
  Video as VideoIcon,
  Layout,
  Briefcase,
  User,
  Users,
  Calendar,
  Target
} from 'lucide-react';

const ProjectForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    client: '',
    description: '',
    status: 'PLANNING',
    priority: 'MEDIUM',
    health: 'ON_TRACK',
    progress: 0,
    startDate: '',
    targetDate: '',
    extraFields: [],
    mediaGallery: []
  });

  useEffect(() => {
    if (id) {
      const fetchProject = async () => {
        try {
          const backendUrl = import.meta.env.VITE_API_URL || '';
          const token = localStorage.getItem('rcs_admin_token');
          const response = await fetch(`${backendUrl}/api/projects/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const data = await response.json();
          if (data.success) {
            setFormData({
              ...data.data,
              startDate: data.data.startDate ? data.data.startDate.split('T')[0] : '',
              targetDate: data.data.targetDate ? data.data.targetDate.split('T')[0] : ''
            });
          }
        } catch (err) {
          console.error('Failed to fetch project:', err);
        }
      };
      fetchProject();
    }
  }, [id]);

  const addExtraField = () => {
    setFormData({
      ...formData,
      extraFields: [...formData.extraFields, { label: '', value: '' }]
    });
  };

  const removeExtraField = (index) => {
    const newFields = formData.extraFields.filter((_, i) => i !== index);
    setFormData({ ...formData, extraFields: newFields });
  };

  const updateExtraField = (index, key, val) => {
    const newFields = [...formData.extraFields];
    newFields[index][key] = val;
    setFormData({ ...formData, extraFields: newFields });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const backendUrl = import.meta.env.VITE_API_URL || '';
      const token = localStorage.getItem('rcs_admin_token');

      const url = id ? `${backendUrl}/api/projects/${id}` : `${backendUrl}/api/projects`;
      const method = id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        navigate('/admin/projects');
      }
    } catch (err) {
      console.error('Failed to save project:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen font-sans">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate('/admin/projects')}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold text-xs uppercase tracking-widest mb-6 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Projects
        </button>

        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              {id ? 'Refine Project' : 'Initiate New Project'}
            </h1>
            <p className="text-slate-500 font-medium mt-1">Configure project scope, metrics, and business intelligence.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Core Configuration */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
            <h2 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2 uppercase tracking-tight">
              <Layout size={20} className="text-blue-600" />
              Core Configuration
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-700 uppercase tracking-widest ml-1">Project Identifier</label>
                <div className="relative">
                  <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    required
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-bold"
                    placeholder="e.g. ERP Ecosystem Overhaul"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-700 uppercase tracking-widest ml-1">Client Entity</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    required
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-bold"
                    placeholder="e.g. Global Tech Solutions"
                    value={formData.client}
                    onChange={(e) => setFormData({...formData, client: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-700 uppercase tracking-widest ml-1">Executive Summary</label>
              <textarea
                rows="4"
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-3xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-medium leading-relaxed"
                placeholder="Brief description of project goals..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>
          </div>

          {/* Business Sarthi - Dynamic Fields */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 uppercase tracking-tight">
                <Target size={20} className="text-blue-600" />
                Dynamic Project Intel
              </h2>
              <button
                type="button"
                onClick={addExtraField}
                className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all"
              >
                <Plus size={16} /> Add Field
              </button>
            </div>

            <div className="space-y-4">
              {formData.extraFields.length === 0 && (
                <div className="text-center py-10 border-2 border-dashed border-slate-100 rounded-3xl text-slate-400 font-bold text-xs uppercase tracking-widest">
                   No custom business fields defined
                </div>
              )}
              {formData.extraFields.map((field, index) => (
                <div key={index} className="flex gap-4 items-end animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="flex-1 space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Label</label>
                    <input
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-bold"
                      placeholder="e.g. Budget Cap"
                      value={field.label}
                      onChange={(e) => updateExtraField(index, 'label', e.target.value)}
                    />
                  </div>
                  <div className="flex-[2] space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Value</label>
                    <input
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-medium"
                      placeholder="e.g. Rs. 5,000,000"
                      value={field.value}
                      onChange={(e) => updateExtraField(index, 'value', e.target.value)}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeExtraField(index)}
                    className="p-3.5 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all mb-0.5"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/admin/projects')}
              className="px-8 py-4 rounded-2xl text-sm font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors"
            >
              Discard Changes
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-slate-900 text-white px-12 py-4 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-2xl shadow-slate-900/20 disabled:opacity-50"
            >
              {loading ? 'Processing Protocol...' : <><Save size={20} /> Save Project</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectForm;
