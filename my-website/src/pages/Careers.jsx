import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, MapPin, Clock, ArrowRight } from 'lucide-react';
import Seo from '../components/Seo';
import { company } from '../data/site';

const Careers = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const backendUrl = import.meta.env.VITE_API_URL || '';
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
    <>
      <Seo title="Careers" description="Join the RCS team and help us build digital experiences that move businesses forward." />
      <section className="page-hero">
        <div className="shell page-hero__inner">
          <p className="eyebrow">Join the team</p>
          <h1>Build what comes next.</h1>
          <p>We are looking for thoughtful designers, engineers, and strategists to help us solve interesting problems.</p>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <div className="flex justify-between items-end mb-12">
            <div>
              <p className="eyebrow">Current Openings</p>
              <h2>Explore our open roles.</h2>
            </div>
            <p className="text-gray-500 max-w-sm text-right hidden md:block">
              Don't see a role that fits? Send a general application to {company.email}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {loading ? (
              <div className="py-12 text-center text-gray-500">Loading open positions...</div>
            ) : jobs.length === 0 ? (
              <div className="py-12 text-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                <p className="text-gray-500 font-medium">No open positions at the moment.</p>
                <p className="text-sm text-gray-400 mt-1">Check back soon or follow us on LinkedIn.</p>
              </div>
            ) : (
              jobs.map((job) => (
                <Link
                  key={job._id}
                  to={`/careers/${job.slug}`}
                  className="group bg-white border border-gray-200 p-6 md:p-8 rounded-xl hover:border-blue-500 hover:shadow-md transition flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition mb-2">{job.title}</h3>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1"><Briefcase size={16} /> {job.department}</span>
                      <span className="flex items-center gap-1"><MapPin size={16} /> {job.location}</span>
                      <span className="flex items-center gap-1"><Clock size={16} /> {job.employmentType}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-blue-600 font-bold">
                    View Position <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="section section--quiet">
        <div className="shell grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="eyebrow">Life at RCS</p>
            <h2>Work with intent.</h2>
            <p className="mt-6 text-lg text-gray-600">
              We value clear thinking, deliberate execution, and continuous learning. Our team works across design, technology, and strategy to deliver meaningful results for our clients.
            </p>
            <ul className="mt-8 space-y-4">
              <li className="flex gap-3">
                <div className="mt-1 p-1 bg-blue-600 rounded-full"></div>
                <span>Flexible work environment (Remote & Hybrid options)</span>
              </li>
              <li className="flex gap-3">
                <div className="mt-1 p-1 bg-blue-600 rounded-full"></div>
                <span>Modern tech stack and high-quality tools</span>
              </li>
              <li className="flex gap-3">
                <div className="mt-1 p-1 bg-blue-600 rounded-full"></div>
                <span>Collaborative culture focused on growth</span>
              </li>
            </ul>
          </div>
          <div className="aspect-video bg-gray-200 rounded-2xl overflow-hidden relative">
            <img src="team1.png" alt="RCS Team Collaboration" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>
    </>
  );
};

export default Careers;
