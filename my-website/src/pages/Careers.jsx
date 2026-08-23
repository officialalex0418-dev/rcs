import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase, MapPin, Clock, ArrowRight,
  Users, Target, CheckCircle2,
  Zap, UserCheck
} from 'lucide-react';
import Seo from '../components/Seo';

const Careers = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        let backendUrl = import.meta.env.VITE_API_URL || '';
        if (backendUrl.endsWith('/')) {
          backendUrl = backendUrl.slice(0, -1);
        }
        const response = await fetch(`${backendUrl}/api/careers/jobs`);
        const data = await response.json();
        if (data.success) {
          setJobs(data.data);
        }
      } catch (err) {
        console.error('Failed to fetch jobs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  return (
    <div className="bg-white selection:bg-emerald-100 selection:text-emerald-900">
      <Seo title="Careers" description="Join the RCS team and help us build digital experiences that move businesses forward." />

      {/* High-Fidelity Hero Section */}
      <section className="relative pt-24 pb-32 md:pt-40 md:pb-56 overflow-hidden bg-slate-50">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-100/30 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-100/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>

        <div className="shell relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 mb-8">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700">We're Hiring</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-black text-slate-900 leading-[0.95] mb-8 tracking-tighter">
                Build what <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">comes next.</span>
              </h1>
              <p className="text-xl text-slate-600 max-w-xl mb-12 leading-relaxed font-medium">
                Join a collective of creators, thinkers, and builders. We're not just building services; we're crafting the future of digital consultancy.
              </p>

              {/* Hero Feature Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { icon: Zap, color: 'emerald', title: 'Impact', desc: 'Real work, real results.' },
                  { icon: Target, color: 'blue', title: 'Growth', desc: 'Define your path.' },
                  { icon: Users, color: 'orange', title: 'Culture', desc: 'People first, always.' }
                ].map((feature, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all group">
                    <div className={`w-12 h-12 rounded-2xl bg-${feature.color === 'emerald' ? 'emerald' : feature.color === 'blue' ? 'blue' : 'orange'}-50 text-${feature.color === 'emerald' ? 'emerald' : feature.color === 'blue' ? 'blue' : 'orange'}-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <feature.icon size={24} />
                    </div>
                    <h4 className="text-sm font-black text-slate-900 mb-1">{feature.title}</h4>
                    <p className="text-[11px] text-slate-500 font-bold leading-tight">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="relative z-10 aspect-square rounded-[3rem] overflow-hidden shadow-2xl border-[12px] border-white">
                <img
                  src="/Hero.png"
                  alt="Team Collaboration"
                  className="w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent"></div>
              </div>

              {/* Floating Team Card */}
              <div className="absolute -bottom-6 -left-6 z-20 bg-white/95 backdrop-blur-md p-6 rounded-[2.5rem] shadow-2xl border border-white/20 max-w-[280px] hidden md:block animate-float">
                <div className="flex flex-col gap-4">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden">
                        <img src={`https://i.pravatar.cc/150?u=${i}`} alt="User" className="w-full h-full object-cover" />
                      </div>
                    ))}
                    <div className="w-10 h-10 rounded-full border-2 border-white bg-emerald-600 flex items-center justify-center text-[10px] font-black text-white">
                      +12
                    </div>
                  </div>
                  <div>
                    <h5 className="text-sm font-black text-slate-900 mb-1">More than a team</h5>
                    <p className="text-[11px] text-slate-500 font-bold leading-relaxed">
                      Join a community of 50+ experts driving global innovation.
                    </p>
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute top-1/2 -right-12 w-24 h-24 bg-orange-400/10 rounded-full blur-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Horizontal Job Vacancy Cards */}
      <section id="openings" className="py-32 bg-white relative">
        <div className="shell">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="max-w-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-8 bg-emerald-600"></div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600">Opportunities</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                Shape the future <br /> with us.
              </h2>
            </div>
            <p className="text-sm text-slate-500 font-bold max-w-[280px] leading-relaxed">
              We're looking for passionate individuals to join our growing team across multiple departments.
            </p>
          </div>

          <div className="space-y-6">
            {loading ? (
              <div className="py-32 text-center">
                <div className="w-12 h-12 border-4 border-emerald-600/20 border-t-emerald-600 rounded-full animate-spin mx-auto mb-6"></div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Synchronizing Openings...</p>
              </div>
            ) : jobs.length === 0 ? (
              <div className="py-24 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center mx-auto mb-6">
                  <Briefcase className="w-10 h-10 text-slate-300" />
                </div>
                <p className="text-xl font-black text-slate-900">No active openings right now</p>
                <p className="text-sm text-slate-500 mt-2 font-medium">Check back soon or drop your CV at careers@rcsnepal.com.np</p>
              </div>
            ) : (
              <>
                {jobs.map((job) => (
                  <div
                    key={job._id}
                    className="bg-white border border-slate-200 p-6 md:p-8 rounded-[1.5rem] hover:border-emerald-600/30 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 group"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                      <div className="flex items-center gap-6 flex-1">
                        <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 transition-colors group-hover:bg-emerald-600 group-hover:text-white">
                          <Briefcase size={28} />
                        </div>
                        <div>
                          <h3 className="text-xl font-black text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors">
                            {job.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                            <span className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
                              <MapPin size={14} className="text-emerald-500" /> {job.location}
                            </span>
                            <div className="w-1 h-1 rounded-full bg-slate-200 hidden md:block"></div>
                            <span className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
                              <UserCheck size={14} className="text-emerald-500" /> {job.experienceLevel || '1-2 Years'}
                            </span>
                            <div className="w-1 h-1 rounded-full bg-slate-200 hidden md:block"></div>
                            <span className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
                              <Clock size={14} className="text-emerald-500" /> {job.employmentType}
                            </span>
                          </div>
                        </div>
                      </div>

                      <Link
                        to={`/careers/${job.slug}`}
                        className="bg-[#0a3622] text-white px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all active:scale-95 shadow-lg shadow-[#0a3622]/10 shrink-0"
                      >
                        Apply Now <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                ))}

                <div className="pt-12 flex justify-center">
                  <button
                    onClick={() => document.getElementById('openings')?.scrollIntoView({ behavior: 'smooth' })}
                    className="flex items-center gap-2 px-8 py-4 bg-white border border-slate-200 rounded-2xl text-[11px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
                  >
                    View All Openings <ArrowRight size={16} />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Why Join Us - High Fidelity */}
      <section className="py-32 bg-slate-900 overflow-hidden relative">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-emerald-600 rounded-full blur-[150px]"></div>
          <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-600 rounded-full blur-[150px]"></div>
        </div>

        <div className="shell relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="order-2 lg:order-1">
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-tr from-emerald-600 to-blue-600 rounded-[4rem] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-700"></div>
                <div className="relative aspect-[5/4] rounded-[3.5rem] overflow-hidden shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=1000"
                    alt="Career Growth at RCS"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>

                  {/* Stats Overlay */}
                  <div className="absolute bottom-10 left-10 right-10 flex justify-between gap-4">
                    {[
                      { label: 'Growth', val: '40%' },
                      { label: 'Retention', val: '95%' },
                      { label: 'Happy Team', val: '100%' }
                    ].map((stat, i) => (
                      <div key={i} className="text-center">
                        <div className="text-2xl font-black text-white">{stat.val}</div>
                        <div className="text-[9px] font-black uppercase tracking-widest text-emerald-400">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500 mb-6 block">Our Culture</span>
              <h2 className="text-4xl md:text-6xl font-black text-white mb-10 leading-[1.1] tracking-tighter">
                More than just <br /> a workplace.
              </h2>
              <p className="text-lg text-slate-400 font-medium leading-relaxed mb-12 max-w-lg">
                We're building a culture where ideas are valued over hierarchy, and people are supported to do their best work.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {[
                  { title: 'Inclusion', desc: 'A seat for everyone at the table.' },
                  { title: 'Learning', desc: 'Monthly stipends for courses.' },
                  { title: 'Balance', desc: 'Flexible hours & remote options.' },
                  { title: 'Impact', desc: 'Work on global-scale projects.' }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-emerald-500">
                      <CheckCircle2 size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-white mb-1">{item.title}</h4>
                      <p className="text-[11px] text-slate-500 font-bold leading-tight">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Careers;
