import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { company, services } from "../data/site";

const companyLinks = [["About", "/about"], ["Projects", "/projects"], ["Products", "/products"], ["Insights", "/insights"], ["Contact", "/contact"]];

export default function Footer() {
  return <footer className="site-footer">
    <div className="shell site-footer__grid">
      <div className="footer-intro">
        <Link to="/" className="brand brand--footer" aria-label="RCS home"><img src="/Logo.png" width="48" height="48" alt="RCS logo" /><span><strong>RCS</strong><small>Royal Consultancy Services</small></span></Link>
        <p>{company.description}</p>
        <div className="social-links" aria-label="RCS social media">
          <a href={company.social.facebook} target="_blank" rel="noreferrer" aria-label="RCS on Facebook"><Facebook size={18} /></a>
          <a href={company.social.instagram} target="_blank" rel="noreferrer" aria-label="RCS on Instagram"><Instagram size={18} /></a>
          <a href={company.social.linkedin} target="_blank" rel="noreferrer" aria-label="RCS on LinkedIn"><Linkedin size={18} /></a>
        </div>
      </div>
      <div><h2>Services</h2><ul>{services.slice(0, 5).map((service) => <li key={service.id}><Link to={`/services#${service.id}`}>{service.title}</Link></li>)}</ul></div>
      <div><h2>Company</h2><ul>{companyLinks.map(([label, href]) => <li key={href}><Link to={href}>{label}</Link></li>)}</ul></div>
      <div><h2>Contact</h2><address>
        <a href={`mailto:${company.email}`}><Mail size={16} aria-hidden="true" />{company.email}</a>
        <a href={company.phoneHref}><Phone size={16} aria-hidden="true" />{company.phone}</a>
        <span><MapPin size={16} aria-hidden="true" />{company.address}</span>
      </address></div>
    </div>
    <div className="shell site-footer__bottom"><p>© {new Date().getFullYear()} {company.name}. All rights reserved.</p><div><Link to="/privacy">Privacy</Link><Link to="/terms">Terms</Link></div></div>
  </footer>;
}
