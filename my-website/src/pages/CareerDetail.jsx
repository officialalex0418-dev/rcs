import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Briefcase, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react';
import Seo from '../components/Seo';

const CareerDetail = () => {
  const { slug } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', portfolioUrl: '', linkedInUrl: '', githubUrl: '', coverLetter: ''
  });
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await fetch(`/api/careers/jobs`); // In production, we'd fetch by slug
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await fetch('/api/careers/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, job: job._id })
      });

      if (!response.ok) throw new Error('Submission failed');

      setStatus({ type: 'success', message: 'Application submitted successfully! Our HR team will review it and get back to you.' });
      setForm({ firstName: '', lastName: '', email: '', phone: '', portfolioUrl: '', linkedInUrl: '', githubUrl: '', coverLetter: '' });
    } catch (err) {
      setStatus({ type: 'error', message: 'Failed to submit application. Please try again or email us directly.' });
    } finally {
      setIsSending(false);
    }
  };

  if (loading) return <div className="py-24 text-center text-gray-500">Loading position details...</div>;
  if (!job) return <div className="py-24 text-center text-gray-500">Position not found. <Link to="/careers" className="text-blue-600 underline">View all roles</Link></div>;

  return (
    <>
      <Seo title={job.title} description={job.description.substring(0, 160)} />
      <section className="page-hero">
        <div className="shell">
          <Link to="/careers" className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-8 transition">
            <ArrowLeft size={18} /> Back to Careers
          </Link>
          <p className="eyebrow">{job.department}</p>
          <h1>{job.title}</h1>
          <div className="flex flex-wrap gap-6 mt-6 text-gray-600">
            <span className="flex items-center gap-2 font-medium"><MapPin size={18} className="text-blue-600" /> {job.location}</span>
            <span className="flex items-center gap-2 font-medium"><Briefcase size={18} className="text-blue-600" /> {job.employmentType}</span>
            <span className="flex items-center gap-2 font-medium"><Clock size={18} className="text-blue-600" /> {job.workMode}</span>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2">
            <div className="prose max-w-none">
              <h2 className="text-2xl font-bold mb-4">About the Role</h2>
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed mb-8">{job.description}</div>

              {job.responsibilities?.length > 0 && (
                <>
                  <h3 className="text-xl font-bold mb-4">Responsibilities</h3>
                  <ul className="list-disc pl-5 space-y-2 text-gray-700 mb-8">
                    {job.responsibilities.map((r, i) => <li key={i}>{r}</li>)}
                  </ul>
                </>
              )}

              {job.requirements?.length > 0 && (
                <>
                  <h3 className="text-xl font-bold mb-4">Requirements</h3>
                  <ul className="list-disc pl-5 space-y-2 text-gray-700 mb-8">
                    {job.requirements.map((r, i) => <li key={i}>{r}</li>)}
                  </ul>
                </>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-gray-50 p-8 rounded-2xl border border-gray-100">
              <h3 className="text-xl font-bold mb-6">Apply Now</h3>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4">
                  <input placeholder="First Name" name="firstName" value={form.firstName} onChange={onChange} required className="w-full px-4 py-2 border border-gray-200 rounded-lg" />
                  <input placeholder="Last Name" name="lastName" value={form.lastName} onChange={onChange} required className="w-full px-4 py-2 border border-gray-200 rounded-lg" />
                </div>
                <input type="email" placeholder="Email Address" name="email" value={form.email} onChange={onChange} required className="w-full px-4 py-2 border border-gray-200 rounded-lg" />
                <input placeholder="Phone Number" name="phone" value={form.phone} onChange={onChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg" />
                <input placeholder="LinkedIn URL" name="linkedInUrl" value={form.linkedInUrl} onChange={onChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg" />
                <input placeholder="Portfolio URL" name="portfolioUrl" value={form.portfolioUrl} onChange={onChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg" />
                <textarea placeholder="Tell us why you're a good fit..." name="coverLetter" value={form.coverLetter} onChange={onChange} rows="4" className="w-full px-4 py-2 border border-gray-200 rounded-lg"></textarea>

                {status.message && (
                  <div className={`p-4 rounded-lg text-sm flex gap-2 ${status.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {status.type === 'success' && <CheckCircle2 size={16} className="shrink-0" />}
                    {status.message}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSending}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {isSending ? 'Submitting...' : 'Submit Application'}
                  {!isSending && <Send size={18} />}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CareerDetail;
