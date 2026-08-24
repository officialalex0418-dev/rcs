import React, { useEffect, useState } from 'react';
import {
  ArrowRight, ArrowUpRight, CheckCircle2,
  Layers, Code2, Globe, Rocket,
  BarChart3, Users, Zap, Search,
  Briefcase, Palette, Target,
  PieChart, Activity, Sparkles,
  MousePointer2, Play
} from "lucide-react";
import { Link } from "react-router-dom";
import Seo from "../components/Seo";
import { company } from "../data/site";

const Home = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-agency-bg selection:bg-agency-purple/20 selection:text-agency-purple overflow-hidden">
      <Seo title="Home" description={company.description} />

      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-agency-lavender/30 to-transparent -z-10 blur-[120px]"></div>
        <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-agency-purple/5 rounded-full blur-[120px] -translate-x-1/2 -z-10"></div>

        <div className="shell grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          {/* Left Content */}
          <div className="lg:col-span-7 space-y-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur-md border border-slate-200 rounded-full shadow-sm animate-bounce-slow">
              <span className="text-agency-purple tracking-[0.2em] font-black text-[10px]">✦</span>
              <span className="text-slate-600 text-[10px] font-black uppercase tracking-widest">Digital Solutions That Deliver</span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-agency-primary tracking-tighter leading-[1.05]">
              Building digital <br />
              experiences that <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-agency-purple via-agency-indigo to-agency-purple bg-[length:200%_auto] animate-gradient-flow">
                move businesses <br />
                forward.
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-500 font-medium leading-relaxed max-w-xl">
              We combine strategy, design, technology, and marketing to help brands grow, scale, and lead in the digital era.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                to="/services"
                className="px-8 py-5 bg-agency-primary text-white text-[13px] font-black rounded-[2rem] shadow-xl shadow-agency-primary/20 hover:bg-agency-purple hover:shadow-agency-purple/30 transition-all duration-300 group flex items-center gap-3"
              >
                Explore Services
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/projects"
                className="px-8 py-5 bg-white border border-slate-200 text-agency-primary text-[13px] font-black rounded-[2rem] shadow-premium hover:border-agency-purple transition-all duration-300 flex items-center gap-3"
              >
                View Our Work
                <Play size={16} className="fill-current" />
              </Link>
            </div>
          </div>

          {/* Right Visual (3D Dashboard Mockup) */}
          <div className="lg:col-span-5 relative perspective-1000">
            <div className="relative z-10 animate-float">
              {/* Main Dashboard Card */}
              <div className="bg-white/80 backdrop-blur-2xl p-8 rounded-[3rem] shadow-2xl border border-white/50 rotate-y-[-10deg] rotate-x-[5deg]">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                  </div>
                  <div className="px-3 py-1 bg-agency-lavender rounded-lg text-agency-purple text-[9px] font-black uppercase tracking-wider">
                    Performance Insight
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Conversion</p>
                    <div className="flex items-end justify-between">
                      <span className="text-2xl font-black text-agency-primary">3.6K</span>
                      <span className="text-[10px] font-bold text-emerald-500">+12%</span>
                    </div>
                  </div>
                  <div className="bg-agency-primary p-4 rounded-2xl">
                    <p className="text-[9px] font-black text-white/50 uppercase tracking-widest mb-1">Growth</p>
                    <div className="flex items-end justify-between text-white">
                      <span className="text-2xl font-black">+124%</span>
                      <Sparkles size={16} className="text-agency-purple" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full w-3/4 bg-agency-purple rounded-full"></div>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full w-1/2 bg-agency-indigo rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* Floating Cards */}
              <div className="absolute -top-10 -right-10 bg-white p-6 rounded-[2rem] shadow-xl border border-slate-100 animate-float-delayed hidden md:block z-20">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-agency-lavender text-agency-purple flex items-center justify-center">
                    <BarChart3 size={24} />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Active Users</p>
                    <p className="text-lg font-black text-agency-primary">12.8K</p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-12 -left-12 bg-agency-indigo p-6 rounded-[2rem] shadow-xl text-white animate-float-slow hidden md:block z-20">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                    <Target size={24} />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-white/50 uppercase tracking-widest">Success Rate</p>
                    <p className="text-lg font-black">98.4%</p>
                  </div>
                </div>
              </div>

              {/* Background Glows for Visual */}
              <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-agency-purple/10 rounded-full blur-[80px]"></div>
            </div>
          </div>
        </div>
      </section>

      {/* --- TRUSTED BRANDS --- */}
      <section className="py-20 bg-white border-y border-slate-100">
        <div className="shell text-center">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-12">Trusted By Ambitious Brands</p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-40 hover:opacity-100 transition-opacity duration-500">
            {['Acme Corp', 'Velocity', 'Cloudix', 'Apex', 'PULSE', 'Visionary'].map((brand, i) => (
              <span key={i} className="text-2xl font-black tracking-tighter text-slate-900 grayscale">{brand}</span>
            ))}
          </div>
        </div>
      </section>

      {/* --- APPROACH SECTION --- */}
      <section id="process" className="py-32 bg-slate-50 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-agency-purple/5 rounded-full blur-[120px] translate-x-1/3 -translate-y-1/3"></div>

        <div className="shell">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-end mb-20">
            <div className="space-y-6">
              <div className="text-agency-purple tracking-[0.2em] font-black text-[10px] uppercase">Our Approach</div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-agency-primary tracking-tighter leading-tight">
                One partner from the <br />
                first question to <br />
                <span className="text-agency-purple">what comes next.</span>
              </h2>
            </div>
            <p className="text-lg text-slate-500 font-medium max-w-lg pb-2">
              We work as an extension of your team, bringing clarity to complexity and turning ideas into measurable results through a data-driven strategy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[
              { id: '01', title: 'Discovery', desc: 'Understanding your goals, market, and unique opportunities.', icon: Search },
              { id: '02', title: 'Strategy', desc: 'Building a tactical roadmap for growth and scalability.', icon: Target },
              { id: '03', title: 'Design', desc: 'Crafting intuitive experiences that users love to use.', icon: Palette },
              { id: '04', title: 'Build', desc: 'Developing high-performance technology with precision.', icon: Code2 },
              { id: '05', title: 'Optimize', desc: 'Continuous testing and data-driven improvement.', icon: Activity },
            ].map((step, i) => (
              <div
                key={i}
                className="group bg-white p-8 rounded-[2.5rem] border border-white shadow-premium hover:shadow-premium-hover hover:-translate-y-2 transition-all duration-500"
              >
                <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-6 group-hover:text-agency-purple transition-colors">{step.id}</div>
                <div className="w-12 h-12 rounded-2xl bg-slate-50 text-agency-purple flex items-center justify-center mb-6 group-hover:bg-agency-purple group-hover:text-white group-hover:rotate-6 transition-all duration-500">
                  <step.icon size={24} />
                </div>
                <h3 className="text-xl font-black text-agency-primary mb-3">{step.title}</h3>
                <p className="text-xs font-bold text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- SERVICES SECTION --- */}
      <section className="py-32 bg-white relative">
        <div className="shell">
          <div className="max-w-3xl mb-24 space-y-6">
            <div className="text-agency-purple tracking-[0.2em] font-black text-[10px] uppercase">What We Do</div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-agency-primary tracking-tighter leading-tight">
              From strategy to software. <br />
              <span className="text-agency-purple">Impact in every step.</span>
            </h2>
            <p className="text-lg text-slate-500 font-medium max-w-xl">
              End-to-end digital solutions that help you attract, engage, and convert your audience through design, technology, and performance marketing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { id: '01', title: 'Digital Strategy', desc: 'Strategic roadmaps, market analysis, and product positioning.', icon: Layers },
              { id: '02', title: 'Branding & Identity', desc: 'Crafting unique brand identities that connect and resonate.', icon: Palette },
              { id: '03', title: 'Web Development', desc: 'High-performance corporate sites and web applications.', icon: Code2 },
              { id: '04', title: 'App Development', desc: 'Modern mobile experiences built for scale and speed.', icon: Globe },
              { id: '05', title: 'UI/UX Design', desc: 'User-centric design that enhances engagement and flow.', icon: MousePointer2 },
              { id: '06', title: 'SEO & Content', desc: 'Performance-driven visibility and content marketing.', icon: Search },
              { id: '07', title: 'Marketing & Growth', desc: 'Data-backed campaigns to scale your user base.', icon: Rocket },
              { id: '08', title: 'Analytics & Insights', desc: 'Deep data analysis to drive better business decisions.', icon: PieChart },
            ].map((service, i) => (
              <div
                key={i}
                className="group p-8 rounded-[3rem] border border-slate-100 bg-white hover:bg-agency-primary transition-all duration-500 hover:shadow-2xl hover:shadow-agency-primary/20"
              >
                <div className="flex justify-between items-start mb-10">
                  <div className="w-14 h-14 rounded-2xl bg-agency-lavender text-agency-purple flex items-center justify-center group-hover:bg-agency-purple group-hover:text-white transition-all duration-500">
                    <service.icon size={28} />
                  </div>
                  <span className="text-[10px] font-black text-slate-300 group-hover:text-white/30 uppercase tracking-widest">{service.id}</span>
                </div>
                <h3 className="text-xl font-black text-agency-primary group-hover:text-white mb-4 transition-colors">{service.title}</h3>
                <p className="text-sm font-bold text-slate-400 group-hover:text-white/60 leading-relaxed transition-colors mb-6">{service.desc}</p>
                <div className="flex items-center gap-2 text-agency-purple group-hover:text-white font-black text-[10px] uppercase tracking-widest transition-colors">
                  Learn More <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- WORK / CASE STUDIES --- */}
      <section className="py-32 bg-agency-bg">
        <div className="shell">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-20">
            <div className="space-y-6">
              <div className="text-agency-purple tracking-[0.2em] font-black text-[10px] uppercase">Our Work</div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-agency-primary tracking-tighter leading-tight">
                Projects that turn <br />
                ideas <span className="text-agency-purple">into reality.</span>
              </h2>
            </div>
            <Link to="/projects" className="flex items-center gap-2 text-[12px] font-black uppercase tracking-[0.2em] text-agency-primary hover:text-agency-purple transition-colors pb-2">
              View All Projects <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { title: 'FinTech Platform', category: 'Web Development', color: 'bg-emerald-500', img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800' },
              { title: 'Healthcare Brand', category: 'Branding', color: 'bg-blue-500', img: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800' },
              { title: 'E-commerce Redesign', category: 'UI/UX Design', color: 'bg-purple-500', img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800' },
              { title: 'Growth Campaign', category: 'Marketing', color: 'bg-orange-500', img: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=800' },
            ].map((project, i) => (
              <Link
                key={i}
                to="/projects"
                className="group relative bg-white rounded-[3rem] overflow-hidden border border-slate-100 shadow-premium hover:shadow-premium-hover transition-all duration-700"
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={project.img}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-agency-primary/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>

                <div className="p-10">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] font-black text-agency-purple uppercase tracking-[0.2em]">{project.category}</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
                  </div>
                  <h3 className="text-3xl font-black text-agency-primary mb-6 group-hover:text-agency-purple transition-colors">{project.title}</h3>
                  <div className="flex items-center gap-2 font-black text-[11px] uppercase tracking-widest text-slate-400 group-hover:text-agency-primary transition-colors">
                    View Case Study <ArrowRight size={16} />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-20 pt-10 border-t border-slate-200 text-center">
            <Link
              to="/projects"
              className="px-12 py-5 bg-agency-primary text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-[2rem] hover:bg-agency-purple transition-all duration-300 shadow-xl shadow-agency-primary/20"
            >
              Explore Full Portfolio
            </Link>
          </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="py-24 relative overflow-hidden">
        <div className="shell">
          <div className="relative bg-agency-dark rounded-[4rem] p-12 lg:p-24 overflow-hidden border border-white/5 shadow-2xl">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-agency-purple/20 via-transparent to-agency-indigo/20"></div>
            <div className="absolute -bottom-1/4 -right-1/4 w-[600px] h-[600px] bg-agency-purple/20 rounded-full blur-[120px]"></div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <div className="text-agency-purple font-black text-[10px] uppercase tracking-[0.3em]">Ready to grow?</div>
                <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-tight">
                  Let's build something <br />
                  <span className="text-agency-purple">extraordinary</span> together.
                </h2>
                <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-md">
                  Share your idea and let's create digital solutions that drive growth and make a lasting impact.
                </p>
                <div className="pt-4">
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-3 px-10 py-5 bg-white text-agency-primary text-[11px] font-black uppercase tracking-[0.2em] rounded-[2rem] hover:bg-agency-purple hover:text-white transition-all duration-300 shadow-xl"
                  >
                    Start a Project <ArrowRight size={18} />
                  </Link>
                </div>
              </div>

              <div className="relative flex justify-center lg:justify-end">
                {/* 3D Rocket Placeholder Illustration */}
                <div className="relative animate-bounce-slow">
                  <div className="w-64 h-64 lg:w-96 lg:h-96 bg-gradient-to-br from-agency-purple to-agency-indigo rounded-full blur-[80px] opacity-30 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
                  <div className="relative z-10 flex flex-col items-center">
                    <Rocket size={200} className="text-white drop-shadow-[0_20px_50px_rgba(108,77,255,0.5)] rotate-[15deg]" />
                    <div className="mt-8 flex gap-2">
                      <div className="w-2 h-2 rounded-full bg-agency-purple animate-ping"></div>
                      <div className="w-2 h-2 rounded-full bg-agency-indigo animate-ping delay-100"></div>
                      <div className="w-2 h-2 rounded-full bg-white animate-ping delay-200"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
