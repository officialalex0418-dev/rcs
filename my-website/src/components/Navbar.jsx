import { Menu, X, ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";

const navigation = [
  ["Services", "/services"], ["Projects", "/projects"], ["Products", "/products"],
  ["About", "/about"], ["Careers", "/careers"], ["Insights", "/insights"], ["Contact", "/contact"],
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return <header className={`site-header ${isScrolled ? "site-header--scrolled" : ""}`}>
    <div className="shell site-header__inner">
      <Link to="/" className="brand" aria-label="RCS home">
        <img src="/Logo.png" width="48" height="48" alt="RCS logo" />
        <span><strong>RCS</strong><small>Royal Consultancy Services</small></span>
      </Link>
      <nav className="desktop-nav" aria-label="Primary navigation">
        {navigation.map(([label, href]) => <NavLink key={href} to={href} className={({ isActive }) => `nav-link ${isActive ? "nav-link--active" : ""}`}>{label}</NavLink>)}
      </nav>
      <div className="site-header__actions">
        <Link className="button button--small button--primary" to="/contact">Start a project <ArrowUpRight size={16} aria-hidden="true" /></Link>
        <button className="menu-toggle" type="button" aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"} aria-expanded={isOpen} aria-controls="mobile-navigation" onClick={() => setIsOpen((open) => !open)}>{isOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}</button>
      </div>
    </div>
    <nav id="mobile-navigation" className={`mobile-nav ${isOpen ? "mobile-nav--open" : ""}`} aria-label="Mobile navigation" aria-hidden={!isOpen}>
      <div className="shell mobile-nav__inner">
        {navigation.map(([label, href]) => <NavLink key={href} to={href} onClick={() => setIsOpen(false)} className="mobile-nav__link">{label}</NavLink>)}
        <Link className="button button--primary mobile-nav__cta" to="/contact" onClick={() => setIsOpen(false)}>Start a project <ArrowUpRight size={17} aria-hidden="true" /></Link>
      </div>
    </nav>
  </header>;
}
