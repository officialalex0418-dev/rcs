import { ArrowRight, Check } from "lucide-react";
import { Link } from "react-router-dom";
import CtaBand from "../components/CtaBand";
import SectionHeading from "../components/SectionHeading";
import Seo from "../components/Seo";
import { process } from "../data/site";

const principles = [
  ["Strategy first", "We start by understanding the business problem, its users, and what a useful outcome looks like."],
  ["Built for growth", "We think beyond the immediate launch so the work has a clearer path to evolve."],
  ["Technology + marketing", "We connect the product experience to the way a business reaches, serves, and grows with people."],
  ["One partner", "Strategy, design, development, marketing, and automation can work together rather than in isolation."],
];

export default function About() {
  return <>
    <Seo title="About" description="Learn how RCS brings technology, creativity, and strategy together to build for real business outcomes." path="/about" />
    <section className="page-hero"><div className="shell page-hero__inner"><p className="eyebrow">About RCS</p><h1>Technology, creativity, and strategy working as one.</h1><p>RCS helps businesses move from a promising idea to a practical digital experience, product, or growth system.</p></div></section>
    <section className="section"><div className="shell about-grid"><div><p className="eyebrow">Who we are</p><h2>We build around the problem, not a preset package.</h2></div><div><p>RCS works at the intersection of digital growth and technology. That means looking beyond a single website, campaign, or application to understand how the work can create long-term value for the business behind it.</p><p>Our focus is clear thinking, thoughtful design, and scalable execution—so the result is useful in the real world, not only impressive in a presentation.</p></div></div></section>
    <section className="section section--quiet"><div className="shell"><SectionHeading eyebrow="Why RCS" title="A practical approach to ambitious work." /><div className="principle-grid">{principles.map(([title, copy]) => <article key={title}><Check size={19} aria-hidden="true" /><h3>{title}</h3><p>{copy}</p></article>)}</div></div></section>
    <section className="section"><div className="shell"><SectionHeading eyebrow="Our process" title="How we move work forward." /><div className="process-list">{process.map(([number, title, description]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{description}</p></article>)}</div><Link className="text-link text-link--standalone" to="/services">Explore our capabilities <ArrowRight size={17} aria-hidden="true" /></Link></div></section>
    <div className="shell"><CtaBand /></div>
  </>;
}
