import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, Save, Plus, Trash2, Layout, Briefcase,
  User, Users, Calendar, Target, ShieldCheck, DollarSign,
  Activity, CheckCircle2, AlertCircle, Clock, Zap
} from 'lucide-react';
import { apiFetch } from '../../utils/api';

const ProjectWizard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [employees, setEmployees] = useState([]);
  const [clients, setClients] = useState([]); // Will fetch from inquiries or clients

  const [formData, setFormData] = useState({
    name: '',
    code: `PRJ-${Math.floor(1000 + Math.random() * 9000)}`,
    client: '',
    description: '',
    status: 'PLANNING',
    priority: 'MEDIUM',
    manager: '',
    startDate: '',
    targetDate: '',
    objectives: '',
    inScope: [''],
    outOfScope: [''],
    requirements: [],
    deliverables: [],
    budget: {
      total: 0,
      breakdown: { employee: 0, infrastructure: 0, software: 0, contingency: 0 }
    },
    team: [],
    milestones: [],
    risks: []
  });

  const steps = [
    { id: 1, label: 'Core Info', icon: Briefcase },
    { id: 2, label: 'Requirements', icon: Target },
    { id: 3, label: 'Scope', icon: Layout },
    { id: 4, label: 'Budget', icon: DollarSign },
    { id: 5, label: 'Team', icon: Users },
    { id: 6, label: 'Review', icon: ShieldCheck }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [empRes, clientRes] = await Promise.all([
          apiFetch('/api/employees'),
          apiFetch('/api/inquiries') // Using inquiries as source for clients
        ]);
        const emps = await empRes.json();
        const cls = await clientRes.json();
        if (emps.success) setEmployees(emps.data);
        if (cls.success) setClients(cls.data);

        if (id) {
           const projRes = await apiFetch(`/api/projects/${id}`);
           const proj = await projRes.json();
           if (proj.success) setFormData({...proj.data,
              startDate: proj.data.startDate?.split('T')[0] || '',
              targetDate: proj.data.targetDate?.split('T')[0] || ''
           });
        }
      } catch (err) {
        console.error('Fetch error:', err);
      }
    };
    fetchData();
  }, [id]);

  const handleNext = () => setStep(prev => Math.min(prev + 1, steps.length));
  const handleBack = () => setStep(prev => Math.max(prev - 1, 1));

  const updateFormData = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const url = id ? `/api/projects/${id}` : '/api/projects';
      const method = id ? 'PUT' : 'POST';
      const response = await apiFetch(url, {
        method,
        body: JSON.stringify(formData)
      });
      if (response.ok) navigate('/admin/projects');
    } catch (err) {
      console.error('Submit error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen font-sans">
      <div className="max-w-6xl mx-auto space-y-10">

        {/* Wizard Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
           <button onClick={() => navigate('/admin/projects')} className="group flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors">
              <div className="p-2.5 bg-white border border-slate-200 rounded-xl group-hover:border-blue-500 transition-all">
                 <ArrowLeft size={18} />
              </div>
              <span className="text-xs font-black uppercase tracking-widest">Back to Portfolio</span>
           </button>
           <div className="text-center md:text-right">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">{id ? 'Refine Execution Strategy' : 'Initiate Project Protocol'}</h1>
              <p className="text-slate-500 font-medium">Step {step} of {steps.length}: {steps.find(s => s.id === step).label}</p>
           </div>
        </div>

        {/* Stepper */}
        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200/60 shadow-sm overflow-x-auto scrollbar-hide">
           <div className="flex justify-between items-center min-w-[800px] px-4">
              {steps.map((s, idx) => (
                <React.Fragment key={s.id}>
                  <div className="flex flex-col items-center gap-3 relative z-10">
                     <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 border-2 ${
                       step === s.id ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-600/20' :
                       step > s.id ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-slate-50 border-slate-100 text-slate-400'
                     }`}>
                        {step > s.id ? <CheckCircle2 size={22} /> : <s.icon size={22} />}
                     </div>
                     <span className={`text-[10px] font-black uppercase tracking-widest ${step === s.id ? 'text-blue-600' : 'text-slate-400'}`}>{s.label}</span>
                  </div>
                  {idx < steps.length - 1 && (
                    <div className="flex-1 h-0.5 bg-slate-100 mx-4 relative">
                       <div className={`absolute inset-0 bg-blue-600 transition-all duration-700`} style={{ width: step > s.id ? '100%' : '0%' }}></div>
                    </div>
                  )}
                </React.Fragment>
              ))}
           </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-[3rem] border border-slate-200/60 shadow-xl shadow-slate-900/5 p-12 animate-in slide-in-from-bottom-4 duration-500">

           {/* Step 1: Core Information */}
           {step === 1 && (
             <div className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <InputField label="Project Identifier" icon={Briefcase} placeholder="e.g. NextGen Web Ecosystem" value={formData.name} onChange={v => updateFormData('name', v)} />
                   <InputField label="Project Code" icon={Zap} value={formData.code} readOnly />
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Client Entity</label>
                      <select className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-bold" value={formData.client} onChange={e => updateFormData('client', e.target.value)}>
                         <option value="">Select Client</option>
                         {clients.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
                      </select>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Assigned Strategist (PM)</label>
                      <select className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-bold" value={formData.manager} onChange={e => updateFormData('manager', e.target.value)}>
                         <option value="">Select Manager</option>
                         {employees.filter(e => e.role === 'PROJECT_MANAGER' || e.role === 'ADMIN' || e.role === 'SUPER_ADMIN').map(e => <option key={e._id} value={e._id}>{e.name}</option>)}
                      </select>
                   </div>
                   <InputField label="Deployment Start" icon={Calendar} type="date" value={formData.startDate} onChange={v => updateFormData('startDate', v)} />
                   <InputField label="Strategic Deadline" icon={Target} type="date" value={formData.targetDate} onChange={v => updateFormData('targetDate', v)} />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Executive Summary</label>
                   <textarea rows="4" className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-[2rem] outline-none text-sm font-medium focus:border-blue-500 transition-all leading-relaxed" placeholder="Summarize the core objectives..." value={formData.description} onChange={e => updateFormData('description', e.target.value)} />
                </div>
             </div>
           )}

           {/* Step 2: Requirements */}
           {step === 2 && (
             <div className="space-y-8">
                <div className="flex justify-between items-center">
                   <h3 className="text-xl font-black text-slate-900 uppercase">Requirement Elicitation</h3>
                   <button onClick={() => updateFormData('requirements', [...formData.requirements, { title: '', description: '', priority: 'MEDIUM', status: 'PENDING' }])} className="flex items-center gap-2 bg-blue-600 px-5 py-3 rounded-xl text-[10px] font-black uppercase text-white shadow-lg">
                      <Plus size={16} /> Add Clause
                   </button>
                </div>
                <div className="space-y-4">
                   {formData.requirements.map((req, idx) => (
                     <div key={idx} className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-200/60 relative group">
                        <button onClick={() => updateFormData('requirements', formData.requirements.filter((_, i) => i !== idx))} className="absolute top-6 right-6 p-2 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                           <div className="lg:col-span-2 space-y-4">
                              <input className="w-full bg-transparent text-lg font-black text-slate-900 border-b border-slate-200 outline-none pb-2 focus:border-blue-500 transition-all" placeholder="Requirement Headline..." value={req.title} onChange={e => {
                                 const nr = [...formData.requirements]; nr[idx].title = e.target.value; updateFormData('requirements', nr);
                              }} />
                              <textarea className="w-full bg-white border border-slate-200 rounded-2xl p-4 text-xs font-medium outline-none" rows="2" placeholder="Detailed technical or business specification..." value={req.description} onChange={e => {
                                 const nr = [...formData.requirements]; nr[idx].description = e.target.value; updateFormData('requirements', nr);
                              }} />
                           </div>
                           <div className="space-y-4">
                              <select className="w-full p-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase" value={req.priority} onChange={e => {
                                 const nr = [...formData.requirements]; nr[idx].priority = e.target.value; updateFormData('requirements', nr);
                              }}>
                                 {['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map(p => <option key={p} value={p}>{p} Priority</option>)}
                              </select>
                              <select className="w-full p-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase" value={req.type} onChange={e => {
                                 const nr = [...formData.requirements]; nr[idx].type = e.target.value; updateFormData('requirements', nr);
                              }}>
                                 {['BUSINESS', 'FUNCTIONAL', 'NON_FUNCTIONAL', 'TECHNICAL'].map(t => <option key={t} value={t}>{t} Type</option>)}
                              </select>
                           </div>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
           )}

           {/* Step 3: Scope & Deliverables */}
           {step === 3 && (
             <div className="space-y-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                   <div className="space-y-4">
                      <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-widest">In-Scope Boundaries</h4>
                      {formData.inScope.map((s, idx) => (
                        <div key={idx} className="flex gap-2">
                           <input className="flex-1 px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold" value={s} onChange={e => {
                              const ns = [...formData.inScope]; ns[idx] = e.target.value; updateFormData('inScope', ns);
                           }} />
                           <button onClick={() => updateFormData('inScope', formData.inScope.filter((_, i) => i !== idx))} className="p-3 text-slate-300 hover:text-red-500"><Trash2 size={16}/></button>
                        </div>
                      ))}
                      <button onClick={() => updateFormData('inScope', [...formData.inScope, ''])} className="text-[9px] font-black text-blue-600 uppercase hover:underline">+ Expand In-Scope</button>
                   </div>
                   <div className="space-y-4">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Out-of-Scope Exclusions</h4>
                      {formData.outOfScope.map((s, idx) => (
                        <div key={idx} className="flex gap-2">
                           <input className="flex-1 px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold" value={s} onChange={e => {
                              const ns = [...formData.outOfScope]; ns[idx] = e.target.value; updateFormData('outOfScope', ns);
                           }} />
                           <button onClick={() => updateFormData('outOfScope', formData.outOfScope.filter((_, i) => i !== idx))} className="p-3 text-slate-300 hover:text-red-500"><Trash2 size={16}/></button>
                        </div>
                      ))}
                      <button onClick={() => updateFormData('outOfScope', [...formData.outOfScope, ''])} className="text-[9px] font-black text-slate-400 uppercase hover:underline">+ Add Exclusion</button>
                   </div>
                </div>
             </div>
           )}

           {/* Step 4: Budget */}
           {step === 4 && (
              <div className="space-y-12">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 p-10 bg-slate-50 rounded-[3rem] border border-slate-200/60">
                       <h3 className="text-lg font-black text-slate-900 uppercase mb-8 flex items-center gap-2"><DollarSign size={20} className="text-emerald-500"/> Allocation Strategy</h3>
                       <div className="grid grid-cols-2 gap-8">
                          <BudgetInput label="Human Capital" val={formData.budget.breakdown.employee} onChange={v => updateFormData('budget', {...formData.budget, breakdown: {...formData.budget.breakdown, employee: v}})} />
                          <BudgetInput label="Infrastructure" val={formData.budget.breakdown.infrastructure} onChange={v => updateFormData('budget', {...formData.budget, breakdown: {...formData.budget.breakdown, infrastructure: v}})} />
                          <BudgetInput label="Software & Tools" val={formData.budget.breakdown.software} onChange={v => updateFormData('budget', {...formData.budget, breakdown: {...formData.budget.breakdown, software: v}})} />
                          <BudgetInput label="Risk Contingency" val={formData.budget.breakdown.contingency} onChange={v => updateFormData('budget', {...formData.budget, breakdown: {...formData.budget.breakdown, contingency: v}})} />
                       </div>
                    </div>
                    <div className="p-10 bg-slate-900 rounded-[3rem] text-white flex flex-col justify-center text-center relative overflow-hidden shadow-2xl">
                       <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                       <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">Total Project Value</p>
                       <h4 className="text-4xl font-black mb-2">Rs. {Object.values(formData.budget.breakdown).reduce((a,b) => a+b, 0).toLocaleString()}</h4>
                       <p className="text-[9px] font-bold text-slate-500 uppercase">Calculated Investment Cap</p>
                    </div>
                 </div>
              </div>
           )}

           {/* Step 5: Team Allocation */}
           {step === 5 && (
             <div className="space-y-10">
                <div className="flex justify-between items-center">
                   <h3 className="text-xl font-black text-slate-900 uppercase">Specialist Sourcing</h3>
                   <button onClick={() => updateFormData('team', [...formData.team, { user: '', role: '', allocation: 100 }])} className="flex items-center gap-2 bg-slate-900 px-5 py-3 rounded-xl text-[10px] font-black uppercase text-white shadow-lg">
                      <Plus size={16} /> Allocate Member
                   </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {formData.team.map((mem, idx) => (
                     <div key={idx} className="p-6 bg-slate-50 border border-slate-200 rounded-[2.5rem] flex items-center gap-4 relative group">
                        <button onClick={() => updateFormData('team', formData.team.filter((_, i) => i !== idx))} className="absolute -top-2 -right-2 p-2 bg-white border border-slate-200 rounded-full text-slate-300 hover:text-red-500 shadow-sm transition-all"><Trash2 size={14} /></button>
                        <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center font-black text-slate-400 shadow-sm">
                           {mem.user ? employees.find(e => e._id === mem.user)?.name.charAt(0) : '?'}
                        </div>
                        <div className="flex-1 space-y-2">
                           <select className="w-full bg-transparent border-none text-sm font-black text-slate-900 outline-none p-0 h-auto" value={mem.user} onChange={e => {
                              const nt = [...formData.team]; nt[idx].user = e.target.value; updateFormData('team', nt);
                           }}>
                              <option value="">Select Personnel</option>
                              {employees.map(e => <option key={e._id} value={e._id}>{e.name} ({e.department})</option>)}
                           </select>
                           <div className="flex gap-4">
                              <input className="flex-1 bg-transparent border-none text-[10px] font-bold text-blue-600 uppercase outline-none p-0" placeholder="Assigned Project Role..." value={mem.role} onChange={e => {
                                 const nt = [...formData.team]; nt[idx].role = e.target.value; updateFormData('team', nt);
                              }} />
                              <div className="flex items-center gap-1">
                                 <input type="number" className="w-8 bg-transparent border-none text-[10px] font-bold text-slate-400 outline-none p-0 text-right" value={mem.allocation} onChange={e => {
                                    const nt = [...formData.team]; nt[idx].allocation = parseInt(e.target.value); updateFormData('team', nt);
                                 }} />
                                 <span className="text-[10px] font-black text-slate-300">%</span>
                              </div>
                           </div>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
           )}

           {/* Step 6: Review */}
           {step === 6 && (
             <div className="space-y-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                   <div className="space-y-8">
                      <div>
                         <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Tactical Summary</h4>
                         <h3 className="text-3xl font-black text-slate-900 leading-tight">{formData.name}</h3>
                         <p className="text-sm font-bold text-blue-600 uppercase mt-1">{formData.client} • {formData.code}</p>
                         <p className="text-xs font-medium text-slate-500 mt-4 leading-relaxed line-clamp-3">{formData.description}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                         <SummaryCard label="Objectives" val={`${formData.requirements.length} Clauses`} icon={Target} color="blue" />
                         <SummaryCard label="Resources" val={`${formData.team.length} Members`} icon={Users} color="indigo" />
                         <SummaryCard label="Timeframe" val={`${formData.startDate} → ${formData.targetDate}`} icon={Calendar} color="purple" />
                         <SummaryCard label="Budget" val={`Rs. ${Object.values(formData.budget.breakdown).reduce((a,b)=>a+b,0).toLocaleString()}`} icon={DollarSign} color="emerald" />
                      </div>
                   </div>
                   <div className="p-10 bg-slate-50 rounded-[3rem] border border-slate-200/60 flex flex-col justify-center">
                      <h4 className="text-[10px] font-black text-slate-900 uppercase text-center mb-8">Project Readiness Analysis</h4>
                      <div className="relative w-40 h-40 mx-auto flex items-center justify-center mb-10">
                         <svg className="w-full h-full transform -rotate-90">
                            <circle cx="80" cy="80" r="70" stroke="#e2e8f0" strokeWidth="12" fill="transparent" />
                            <circle cx="80" cy="80" r="70" stroke="#2563eb" strokeWidth="12" fill="transparent" strokeDasharray="440" strokeDashoffset={440 * (1 - 0.92)} strokeLinecap="round" />
                         </svg>
                         <span className="absolute text-4xl font-black text-slate-900">92%</span>
                      </div>
                      <div className="space-y-3">
                         <ReadinessCheck label="Structural Definition" status="PASSED" />
                         <ReadinessCheck label="Financial Allocation" status="PASSED" />
                         <ReadinessCheck label="Personnel Assignment" status="PASSED" />
                         <ReadinessCheck label="Risk Mitigation" status="WARNING" />
                      </div>
                   </div>
                </div>
             </div>
           )}

           {/* Controls */}
           <div className="mt-20 pt-10 border-t border-slate-100 flex justify-between items-center">
              <button onClick={handleBack} disabled={step === 1} className={`flex items-center gap-3 px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${step === 1 ? 'opacity-0' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'}`}>
                 <ArrowLeft size={18} /> Protocol Phase {step - 1}
              </button>

              <div className="flex gap-4">
                 <button className="px-10 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all">Save Draft</button>
                 {step < steps.length ? (
                   <button onClick={handleNext} className="flex items-center gap-3 bg-slate-900 text-white px-10 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-2xl shadow-slate-900/20">
                      Next Strategy <ArrowRight size={18} />
                   </button>
                 ) : (
                   <button onClick={handleSubmit} disabled={loading} className="flex items-center gap-3 bg-blue-600 text-white px-12 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-2xl shadow-blue-600/30">
                      {loading ? 'Initializing Build...' : <><Zap size={18} /> Deploy Project</>}
                   </button>
                 )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

// Internal Components
const InputField = ({ label, icon: Icon, value, onChange, readOnly, type = "text", placeholder }) => (
  <div className="space-y-2">
     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
     <div className="relative">
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300"><Icon size={20} /></div>
        <input
          readOnly={readOnly}
          type={type}
          placeholder={placeholder}
          className={`w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all text-sm font-bold ${readOnly ? 'text-slate-400' : 'text-slate-900'}`}
          value={value}
          onChange={e => onChange?.(e.target.value)}
        />
     </div>
  </div>
);

const BudgetInput = ({ label, val, onChange }) => (
  <div className="space-y-2">
     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</p>
     <div className="relative">
        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xs font-black text-slate-300 tracking-tighter">Rs.</span>
        <input type="number" className="w-full pl-12 pr-6 py-4 bg-white border border-slate-100 rounded-2xl outline-none text-sm font-black text-slate-900 focus:border-emerald-500 transition-all" value={val} onChange={e => onChange(parseInt(e.target.value) || 0)} />
     </div>
  </div>
);

const SummaryCard = ({ label, val, icon: Icon, color }) => (
  <div className="p-6 bg-slate-50 border border-slate-200 rounded-[2rem] flex flex-col items-center text-center gap-2 group hover:scale-105 transition-all cursor-default">
     <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-white border border-slate-100 text-${color}-600 shadow-sm`}><Icon size={18} /></div>
     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">{label}</p>
     <p className="text-[11px] font-black text-slate-900 leading-none">{val}</p>
  </div>
);

const ReadinessCheck = ({ label, status }) => (
  <div className="flex items-center justify-between px-6 py-4 bg-white border border-slate-100 rounded-2xl">
     <span className="text-[11px] font-bold text-slate-500">{label}</span>
     <div className="flex items-center gap-2">
        <span className={`text-[9px] font-black uppercase ${status === 'PASSED' ? 'text-emerald-500' : 'text-amber-500'}`}>{status}</span>
        {status === 'PASSED' ? <CheckCircle2 size={14} className="text-emerald-500" /> : <AlertCircle size={14} className="text-amber-500" />}
     </div>
  </div>
);

export default ProjectWizard;
