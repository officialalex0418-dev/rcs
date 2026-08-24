import { ArrowRight, ArrowUpRight, Blocks, ChartNoAxesCombined, Code2, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import CtaBand from "../components/CtaBand";
import ProjectCard from "../components/ProjectCard";
import SectionHeading from "../components/SectionHeading";
import Seo from "../components/Seo";
import { company, process, projects, services } from "../data/site";

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "Organization", name: company.name, url: company.siteUrl, email: company.email, telephone: company.phone, address: { "@type": "PostalAddress", addressLocality: "Kathmandu", addressCountry: "NP" }, sameAs: Object.values(company.social) },
    { "@type": "WebSite", name: company.name, url: company.siteUrl },
  ],
};

const capabilityIcons = [ChartNoAxesCombined, Code2, Blocks, Sparkles];

export default function Home() {
  const featuredProjects = projects.filter((project) => project.featured);
  return <>
    <Seo description={company.description} schema={schema} />
    <section className="hero">
      <div className="shell hero__grid">
        <div className="hero__content reveal">
          <p className="eyebrow">Strategy · Technology · Growth</p>
          <h1>Building digital experiences that move businesses forward.</h1>
          <p className="hero__copy">RCS combines strategy, design, technology, and marketing to help businesses build, launch, and scale.</p>
          <div className="hero__actions"><Link className="button button--primary" to="/contact">Start a project <ArrowUpRight size={18} aria-hidden="true" /></Link><Link className="button button--outline" to="/projects">Explore our work <ArrowRight size={18} aria-hidden="true" /></Link></div>
        </div>
        <div className="hero__visual reveal reveal--delay" aria-label="RCS creates connected strategy, design, technology, and growth systems" role="img">
          <div className="hero-orbit hero-orbit--one" /><div className="hero-orbit hero-orbit--two" />
          <div className="hero-system"><div className="hero-system__top"><span>RCS</span><i /><i /></div><div className="hero-system__body"><div className="hero-system__panel"><small>Strategy</small><b>Direction</b><span /></div><div className="hero-system__panel hero-system__panel--accent"><small>Technology</small><b>Build</b><span /></div><div className="hero-system__panel"><small>Growth</small><b>Momentum</b><span /></div></div><div className="hero-system__line"><i /><i /><i /><i /><i /></div></div>
          <div className="floating-note floating-note--one"><span>01</span> Design with intent</div><div className="floating-note floating-note--two"><span>02</span> Build for growth</div>
        </div>
      </div>
    </section>

    <section className="section section--quiet"><div className="shell intro-grid">
      <div><p className="eyebrow">RCS at a glance</p><h2>One partner from the first question to what comes next.</h2></div>
      <p>RCS is a digital agency, technology company, and product builder. We connect the work of strategy, creative, software, and digital growth around the business problem at hand.</p>
    </div><div className="shell capability-grid">
      {services.slice(0, 6).map((service, index) => { const Icon = capabilityIcons[index % capabilityIcons.length]; return <div key={service.id} className="capability"><Icon size={20} aria-hidden="true" /><span>{service.title}</span></div>; })}
    </div></section>

    <section className="section"><div className="shell"><SectionHeading eyebrow="What we do" title="From strategy to software.">Focused services for businesses that need to clarify an opportunity, create a better experience, or build the technology behind the next stage of growth.</SectionHeading>
      <div className="service-preview-grid">{services.map((service) => <Link key={service.id} to={`/services#${service.id}`} className="service-preview"><span>{String(services.indexOf(service) + 1).padStart(2, "0")}</span><h3>{service.title}</h3><p>{service.description}</p><ArrowUpRight size={19} aria-hidden="true" /></Link>)}</div>
      <Link className="text-link text-link--standalone" to="/services">Explore services <ArrowRight size={17} aria-hidden="true" /></Link>
    </div></section>

    <section className="section section--dark"><div className="shell"><SectionHeading eyebrow="Selected work" title="Projects that turn ideas into reality.">From business platforms to digital experiences, we build solutions designed around real problems.</SectionHeading>
      <div className="project-grid">{featuredProjects.map((project) => <ProjectCard key={project.id} project={project} priority />)}</div>
      <Link className="button button--light" to="/projects">View all projects <ArrowRight size={17} aria-hidden="true" /></Link>
    </div></section>

    <section className="section"><div className="shell roadmap"><div><SectionHeading eyebrow="Building what is next" title="Products with room to evolve.">RCS is continuously developing products, business platforms, and technology initiatives. New work is published when its details are ready to share.</SectionHeading><Link className="text-link" to="/products">Explore the product ecosystem <ArrowRight size={17} aria-hidden="true" /></Link></div><ol className="roadmap__steps"><li><span>01</span><div><b>Current focus</b><p>Products and platforms under active development.</p></div></li><li><span>02</span><div><b>Next releases</b><p>New technology initiatives as they become ready to announce.</p></div></li><li><span>03</span><div><b>Long-term value</b><p>Systems designed to support better decisions and sustained growth.</p></div></li></ol></div></section>

    <section className="section section--quiet"><div className="shell"><SectionHeading eyebrow="How we work" title="Clear thinking, deliberate execution.">A thoughtful process keeps the work grounded in business goals while making room for learning and iteration.</SectionHeading><div className="process-grid">{process.map(([number, title, description]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{description}</p></article>)}</div></div></section>
    <div className="shell"><CtaBand /></div>
  </>;
}
