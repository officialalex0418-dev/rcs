import { Menu, X, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";

const navigation = [
  ["Services", "/services"], ["Works", "/projects"], ["About", "/about"],
  ["Process", "/#process"], ["Insights", "/insights"], ["Careers", "/careers"], ["Contact", "/contact"],
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
        isScrolled
          ? "py-4 bg-white/80 backdrop-blur-xl shadow-glass border-b border-slate-200/50"
          : "py-6 bg-transparent"
      }`}
    >
      <div className="shell flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group" aria-label="RCS home">
          <div className="w-10 h-10 rounded-xl bg-agency-primary flex items-center justify-center p-2 group-hover:rotate-6 transition-transform duration-500 shadow-lg shadow-agency-primary/20">
            <img src="/Logo.png" width="32" height="32" alt="RCS logo" className="brightness-200 contrast-200" />
          </div>
          <div className="flex flex-col">
            <span className="text-agency-primary font-black tracking-tighter leading-none text-lg">RCS</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Digital Solutions</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8" aria-label="Primary navigation">
          {navigation.map(([label, href]) => (
            <NavLink
              key={href}
              to={href}
              className={({ isActive }) => `
                relative text-[13px] font-bold tracking-tight transition-all duration-300
                ${isActive ? "text-agency-purple" : "text-slate-600 hover:text-agency-purple"}
                group
              `}
            >
              {label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-agency-purple to-agency-indigo transition-all duration-300 group-hover:w-full"></span>
            </NavLink>
          ))}
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-4">
          <Link
            className="hidden sm:flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-agency-purple to-agency-indigo text-white text-[13px] font-black rounded-2xl shadow-lg shadow-agency-purple/20 hover:shadow-agency-purple/40 hover:-translate-y-0.5 active:scale-95 transition-all duration-300 group"
            to="/contact"
          >
            Let's Talk
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>

          <button
            className="lg:hidden w-11 h-11 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-200 text-agency-primary hover:bg-slate-100 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <div
        className={`lg:hidden fixed inset-0 top-[76px] bg-white z-[90] transition-all duration-500 ease-in-out transform ${
          isOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        }`}
      >
        <div className="shell py-10 flex flex-col gap-6">
          {navigation.map(([label, href]) => (
            <NavLink
              key={href}
              to={href}
              onClick={() => setIsOpen(false)}
              className="text-3xl font-black text-agency-primary hover:text-agency-purple transition-colors"
            >
              {label}
            </NavLink>
          ))}
          <div className="pt-6 border-t border-slate-100">
            <Link
              className="flex items-center justify-center gap-2 w-full py-5 bg-agency-primary text-white text-base font-black rounded-3xl"
              to="/contact"
              onClick={() => setIsOpen(false)}
            >
              Let's Talk <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
