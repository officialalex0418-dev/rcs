import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, ArrowRight, Twitter } from "lucide-react";
import { Link } from "react-router-dom";
import { company, services } from "../data/site";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-agency-dark pt-24 pb-12 overflow-hidden relative">
      {/* Decorative Glow */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-agency-purple/10 rounded-full blur-[120px] -translate-y-1/2"></div>

      <div className="shell relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-20">
          {/* Brand Info */}
          <div className="lg:col-span-4 space-y-8">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center p-2 group-hover:bg-agency-purple transition-all duration-500">
                <img src="/Logo.png" width="36" height="36" alt="RCS logo" className="brightness-200 contrast-200" />
              </div>
              <div className="flex flex-col">
                <span className="text-white font-black tracking-tighter leading-none text-2xl">RCS</span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Digital Solutions</span>
              </div>
            </Link>

            <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-sm">
              We combine strategy, design, technology, and marketing to help brands grow, scale, and lead in the digital era. Your strategic partner for digital excellence.
            </p>

            <div className="flex gap-4">
              {[
                { icon: Facebook, href: company.social.facebook },
                { icon: Twitter, href: company.social.twitter || '#' },
                { icon: Linkedin, href: company.social.linkedin },
                { icon: Instagram, href: company.social.instagram },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-agency-purple hover:text-white hover:border-agency-purple transition-all duration-300"
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Links Grid */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-8">
            <div className="space-y-6">
              <h4 className="text-white font-black text-sm uppercase tracking-widest">Services</h4>
              <ul className="space-y-4">
                {services.slice(0, 5).map((service) => (
                  <li key={service.id}>
                    <Link to={`/services#${service.id}`} className="text-slate-400 text-sm font-bold hover:text-agency-purple transition-colors">
                      {service.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-white font-black text-sm uppercase tracking-widest">Company</h4>
              <ul className="space-y-4">
                {[
                  ["About Us", "/about"],
                  ["Our Process", "/#process"],
                  ["Careers", "/careers"],
                  ["Insights", "/insights"],
                  ["Contact Us", "/contact"],
                ].map(([label, href]) => (
                  <li key={href}>
                    <Link to={href} className="text-slate-400 text-sm font-bold hover:text-agency-purple transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-3 space-y-6">
            <h4 className="text-white font-black text-sm uppercase tracking-widest">Newsletter</h4>
            <p className="text-slate-400 text-sm font-medium">Get insights and ideas to grow your business.</p>
            <div className="relative group">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-5 text-white text-sm focus:outline-none focus:border-agency-purple transition-all"
              />
              <button className="absolute right-2 top-2 bottom-2 px-4 bg-agency-purple text-white rounded-xl hover:bg-agency-indigo transition-colors flex items-center justify-center">
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-500 text-[11px] font-bold uppercase tracking-widest">
            © {currentYear} RCS Digital Solutions. All rights reserved.
          </p>

          <div className="flex gap-8">
            <Link to="/terms" className="text-slate-500 text-[11px] font-black uppercase tracking-widest hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link to="/privacy" className="text-slate-500 text-[11px] font-black uppercase tracking-widest hover:text-white transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
