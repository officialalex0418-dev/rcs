import { ArrowRight, Blocks, ChartNoAxesCombined, Code2, Compass, Palette, Smartphone, Sparkles, Workflow } from "lucide-react";
import { Link } from "react-router-dom";
import CtaBand from "../components/CtaBand";
import SectionHeading from "../components/SectionHeading";
import Seo from "../components/Seo";
import { services } from "../data/site";

const icons = { ChartNoAxesCombined, Compass, Code2, Smartphone, Blocks, Sparkles, Palette, Workflow };

export default function Services() {
  return <>
    <Seo title="Services" description="Digital marketing, strategy, web and app development, SaaS, AI, branding, and automation from RCS." path="/services" />
    <section className="page-hero"><div className="shell page-hero__inner"><p className="eyebrow">RCS capabilities</p><h1>Technology built around your business.</h1><p>RCS brings the strategic, creative, and technical disciplines needed to move an idea into a useful, lasting digital solution.</p></div></section>
    <section className="section"><div className="shell"><SectionHeading eyebrow="Services" title="The right capability for the work ahead.">We scope each engagement around what the business needs now, with an eye on the system it may need next.</SectionHeading><div className="service-grid">{services.map((service) => { const Icon = icons[service.icon]; return <article id={service.id} className="service-card" key={service.id}><div className="service-card__icon"><Icon size={24} aria-hidden="true" /></div><h2>{service.title}</h2><p>{service.description}</p><Link to="/contact" className="text-link">Discuss this service <ArrowRight size={16} aria-hidden="true" /></Link></article>; })}</div></div></section>
    <section className="section section--quiet"><div className="shell engagement"><div><p className="eyebrow">How engagements begin</p><h2>Start with the decision that matters.</h2></div><div><p>Whether the need is a focused campaign, a new product, or an operational system, we begin by getting clear about the business problem, the people involved, and a practical path forward.</p><Link className="button button--outline" to="/contact">Tell us what you are building <ArrowRight size={17} aria-hidden="true" /></Link></div></div></section>
    <div className="shell"><CtaBand /></div>
  </>;
}
