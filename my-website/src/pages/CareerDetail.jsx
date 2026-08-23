import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Briefcase, MapPin, Clock, Send, CheckCircle2, Sparkles } from 'lucide-react';
import Seo from '../components/Seo';

const CareerDetail = () => {
  const { slug } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', portfolioUrl: '', linkedInUrl: '', githubUrl: '', coverLetter: ''
  });
  const [resume, setResume] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    const fetchJob = async () => {
      try {
        let backendUrl = import.meta.env.VITE_API_URL || '';
        if (backendUrl.endsWith('/')) {
          backendUrl = backendUrl.slice(0, -1);
        }
        const response = await fetch(`${backendUrl}/api/careers/jobs`);
        const data = await response.json();
        if (data.success) {
          const found = data.data.find(j => j.slug === slug);
          setJob(found);
        }
      } catch (err) {
        console.error('Failed to fetch job:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [slug]);

  const onChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const onFileChange = (e) => setResume(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resume) {
      alert('Please upload your resume.');
      return;
    }

    setIsSending(true);
    setStatus({ type: '', message: '' });

    try {
      let backendUrl = import.meta.env.VITE_API_URL || '';
      if (backendUrl.endsWith('/')) {
        backendUrl = backendUrl.slice(0, -1);
      }

      const formData = new FormData();
      Object.keys(form).forEach(key => formData.append(key, form[key]));
      formData.append('job', job._id);
      formData.append('resume', resume);

      const response = await fetch(`${backendUrl}/api/careers/apply`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Submission failed');

      setStatus({ type: 'success', message: 'Application submitted successfully! Our HR team will review it and get back to you.' });
      setForm({ firstName: '', lastName: '', email: '', phone: '', portfolioUrl: '', linkedInUrl: '', githubUrl: '', coverLetter: '' });
      setResume(null);
      e.target.reset();
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Failed to submit application. Please try again.' });
    } finally {
      setIsSending(false);
    }
  };

  if (loading) return (
    <div className="py-40 text-center">
      <div className="w-12 h-12 border-4 border-emerald-600/20 border-t-emerald-600 rounded-full animate-spin mx-auto mb-6"></div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Loading Position Details...</p>
    </div>
  );

  if (!job) return (
    <div className="py-40 text-center">
      <h2 className="text-2xl font-black text-slate-900 mb-4">Position not found</h2>
      <Link to="/careers" className="text-emerald-600 font-bold hover:underline">View all roles</Link>
    </div>
  );

  return (
    <div className="bg-white selection:bg-emerald-100 selection:text-emerald-900">
      <Seo title={job.title} description={job.description.substring(0, 160)} />

      {/* Hero Header */}
      <section className="pt-24 pb-20 bg-slate-50 border-b border-slate-100">
        <div className="shell">
          <Link to="/careers" className="inline-flex items-center gap-2 text-slate-400 hover:text-emerald-600 mb-8 transition-colors font-bold text-xs uppercase tracking-widest">
            <ArrowLeft size={16} /> Back to Careers
          </Link>

          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[9px] font-black uppercase tracking-wider border border-emerald-100">
                {job.department || 'Technology'}
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-tight mb-8">
              {job.title}
            </h1>
            <div className="flex flex-wrap items-center gap-8">
              <span className="flex items-center gap-2 text-[11px] font-bold text-slate-500 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100">
                <MapPin size={14} className="text-emerald-500" /> {job.location}
              </span>
              <span className="flex items-center gap-2 text-[11px] font-bold text-slate-500 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100">
                <Briefcase size={14} className="text-emerald-500" /> {job.employmentType}
              </span>
              <span className="flex items-center gap-2 text-[11px] font-bold text-slate-500 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100">
                <Clock size={14} className="text-emerald-500" /> {job.workMode}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24">
        <div className="shell grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Details Column */}
          <div className="lg:col-span-7 space-y-12">
            <div>
              <h2 className="text-2xl font-black text-slate-900 mb-6">About the Role</h2>
              <div className="prose prose-slate max-w-none">
                <div className="whitespace-pre-wrap text-slate-600 leading-relaxed font-medium">{job.description}</div>
              </div>
            </div>

            {job.responsibilities?.length > 0 && (
              <div>
                <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Responsibilities
                </h3>
                <ul className="space-y-4">
                  {job.responsibilities.map((r, i) => (
                    <li key={i} className="flex gap-4 group">
                      <div className="mt-1.5 w-4 h-4 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                        <CheckCircle2 size={12} className="text-emerald-600" />
                      </div>
                      <span className="text-slate-600 font-medium leading-relaxed">{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {job.requirements?.length > 0 && (
              <div>
                <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Requirements
                </h3>
                <ul className="space-y-4">
                  {job.requirements.map((r, i) => (
                    <li key={i} className="flex gap-4">
                      <div className="mt-1.5 w-4 h-4 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                        <CheckCircle2 size={12} className="text-emerald-600" />
                      </div>
                      <span className="text-slate-600 font-medium leading-relaxed">{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {job.benefits?.length > 0 && (
              <div>
                <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Perks & Benefits
                </h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {job.benefits.map((b, i) => (
                    <li key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-emerald-600 shadow-sm">
                        <Sparkles size={16} />
                      </div>
                      <span className="text-sm font-bold text-slate-700">{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Form Column */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-200 shadow-2xl shadow-slate-200/50">
              <div className="mb-8">
                <h3 className="text-2xl font-black text-slate-900 mb-2">Apply Now</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Complete the form to submit your application</p>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">First Name</label>
                    <input placeholder="John" name="firstName" value={form.firstName} onChange={onChange} required className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-600 transition-all text-sm font-bold" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Last Name</label>
                    <input placeholder="Doe" name="lastName" value={form.lastName} onChange={onChange} required className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-600 transition-all text-sm font-bold" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                  <input type="email" placeholder="john@example.com" name="email" value={form.email} onChange={onChange} required className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-600 transition-all text-sm font-bold" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                  <input placeholder="+977 9800000000" name="phone" value={form.phone} onChange={onChange} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-600 transition-all text-sm font-bold" />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Upload Resume (PDF, DOCX)</label>
                  <div className="relative">
                    <input
                      type="file"
                      onChange={onFileChange}
                      required
                      accept=".pdf,.doc,.docx"
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-600 transition-all text-xs font-bold file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-black file:bg-emerald-600 file:text-white file:uppercase hover:file:bg-emerald-700 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Application / Cover Letter</label>
                  <textarea placeholder="Tell us why you are a great fit..." name="coverLetter" value={form.coverLetter} onChange={onChange} rows="4" className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-[2rem] outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-600 transition-all text-sm font-medium leading-relaxed"></textarea>
                </div>

                {status.message && (
                  <div className={`p-4 rounded-2xl text-xs font-bold flex gap-3 ${status.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' : 'bg-red-50 text-red-800 border border-red-100'}`}>
                    {status.type === 'success' ? <CheckCircle2 size={16} className="shrink-0" /> : <div className="w-1.5 h-1.5 bg-red-600 rounded-full mt-1.5"></div>}
                    {status.message}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSending}
                  className="w-full bg-[#0a3622] text-white py-5 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-emerald-700 transition-all active:scale-[0.98] shadow-xl shadow-[#0a3622]/10 disabled:opacity-50"
                >
                  {isSending ? 'Submitting...' : 'Submit Application'}
                  {!isSending && <Send size={18} />}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CareerDetail;
