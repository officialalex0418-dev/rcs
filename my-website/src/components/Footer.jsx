import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Heart, Twitter, Youtube, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import { company } from "../data/site";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#052e16] text-white pt-24 pb-12 font-sans overflow-hidden relative">
      {/* Decorative Gradient Background */}
      <div className="absolute top-0 right-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500 rounded-full blur-[150px]"></div>
      </div>

      <div className="shell relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 mb-20">
          {/* Brand Identity - Col 1-4 */}
          <div className="lg:col-span-4 space-y-8">
            <Link to="/" className="flex items-center gap-4 group">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg transition-all duration-500 group-hover:rotate-[10deg] group-hover:scale-110">
                <img src="/Logo.png" alt="RCS Logo" className="w-10 h-10 object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-black tracking-tighter leading-none">RCS</span>
                <span className="text-[10px] font-black opacity-40 uppercase tracking-[0.2em] mt-1">Royal Consultancy Services</span>
              </div>
            </Link>
            <p className="text-[15px] text-emerald-50/60 leading-relaxed max-w-sm font-medium">
              We provide transformative consultancy services, helping businesses navigate complexity and achieve sustainable growth through innovation and trust.
            </p>
            <div className="flex items-center gap-4">
              {[
                { icon: Facebook, href: company.social.facebook },
                { icon: Linkedin, href: company.social.linkedin },
                { icon: Instagram, href: company.social.instagram },
                { icon: Twitter, href: "#" }
              ].map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/60 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-all duration-500 hover:-translate-y-1 shadow-lg shadow-black/10"
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links - Col 5-6 */}
          <div className="lg:col-span-2">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-10 text-emerald-400">Services</h3>
            <ul className="space-y-5">
              {['Digital Strategy', 'Brand Identity', 'Market Analysis', 'HR Solutions', 'Tech Support'].map((item) => (
                <li key={item}>
                  <Link to={`/services`} className="text-[13px] text-emerald-50/50 hover:text-emerald-300 transition-all duration-300 font-bold flex items-center gap-2 group">
                    <span className="w-1 h-1 bg-emerald-800 rounded-full group-hover:w-2 transition-all"></span>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company - Col 7-8 */}
          <div className="lg:col-span-2">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-10 text-emerald-400">Explore</h3>
            <ul className="space-y-5">
              {['About Us', 'Our Clients', 'Success Stories', 'Careers', 'Contact'].map((item) => (
                <li key={item}>
                  <Link to={`/${item.toLowerCase().replace(/ /g, '')}`} className="text-[13px] text-emerald-50/50 hover:text-emerald-300 transition-all duration-300 font-bold flex items-center gap-2 group">
                    <span className="w-1 h-1 bg-emerald-800 rounded-full group-hover:w-2 transition-all"></span>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details - Col 9-12 */}
          <div className="lg:col-span-4 bg-white/5 p-8 rounded-[2rem] border border-white/5">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-8 text-white">Get in touch</h3>
            <ul className="space-y-8">
              <li className="flex items-start gap-5 group">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center shrink-0 group-hover:bg-emerald-500 transition-colors duration-500">
                  <MapPin size={22} className="text-emerald-400 group-hover:text-white" />
                </div>
                <div>
                  <span className="block text-[10px] font-black uppercase tracking-widest text-emerald-500/60 mb-1">Office Location</span>
                  <span className="text-[14px] text-white font-bold leading-relaxed">
                    Pingalasthan, Gaushala, Kathmandu, Nepal
                  </span>
                </div>
              </li>
              <li className="flex items-center gap-5 group">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center shrink-0 group-hover:bg-emerald-500 transition-colors duration-500">
                  <Phone size={22} className="text-emerald-400 group-hover:text-white" />
                </div>
                <div>
                  <span className="block text-[10px] font-black uppercase tracking-widest text-emerald-500/60 mb-1">Call Us</span>
                  <a href="tel:+97715914591" className="text-[14px] text-white hover:text-emerald-400 font-bold transition-colors">
                    +977 1 5914591
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-5 group">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center shrink-0 group-hover:bg-emerald-500 transition-colors duration-500">
                  <Mail size={22} className="text-emerald-400 group-hover:text-white" />
                </div>
                <div>
                  <span className="block text-[10px] font-black uppercase tracking-widest text-emerald-500/60 mb-1">Email Support</span>
                  <a href="mailto:info@rcsnepal.com.np" className="text-[14px] text-white hover:text-emerald-400 font-bold transition-colors">
                    info@rcsnepal.com.np
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[10px] font-black text-emerald-50/20 uppercase tracking-[0.2em]">
            © {currentYear} Royal Consultancy Services. Built for excellence.
          </p>

          <div className="flex items-center gap-10">
             <div className="flex items-center gap-6">
                <Link to="/privacy-policy" className="text-[9px] font-black text-emerald-50/20 hover:text-white transition-colors uppercase tracking-widest">Privacy</Link>
                <Link to="/terms" className="text-[9px] font-black text-emerald-50/20 hover:text-white transition-colors uppercase tracking-widest">Terms</Link>
                <Link to="/cookies" className="text-[9px] font-black text-emerald-50/20 hover:text-white transition-colors uppercase tracking-widest">Cookies</Link>
             </div>
             <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-emerald-500/5 rounded-full border border-white/5">
                <Globe size={12} className="text-emerald-500" />
                <span className="text-[9px] font-black text-emerald-50/40 uppercase tracking-widest">English (NP)</span>
             </div>
          </div>

          <div className="flex items-center gap-2 text-[10px] font-black text-emerald-50/30 uppercase tracking-[0.2em]">
            <span>Crafted with</span>
            <Heart size={14} className="text-red-500 fill-red-500 animate-pulse" />
            <span>in Nepal</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
