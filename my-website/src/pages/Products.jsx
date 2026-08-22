import { ArrowRight, Blocks } from "lucide-react";
import { Link } from "react-router-dom";
import CtaBand from "../components/CtaBand";
import ProjectCard from "../components/ProjectCard";
import SectionHeading from "../components/SectionHeading";
import Seo from "../components/Seo";
import { projects } from "../data/site";

export default function Products() {
  const products = projects.filter((project) => project.kind === "product");
  return <>
    <Seo title="Products" description="Technology products and business platforms built by RCS." path="/products" />
    <section className="page-hero"><div className="shell page-hero__inner"><p className="eyebrow">RCS product ecosystem</p><h1>Products built to keep business moving.</h1><p>Alongside client work, RCS develops technology products and platforms designed around practical business challenges.</p></div></section>
    <section className="section"><div className="shell"><SectionHeading eyebrow="RCS products" title="Technology with a long view.">Each product has its own route, status, SEO metadata, and detail model so the ecosystem can grow without rebuilding the site.</SectionHeading><div className="project-grid">{products.map((product) => <ProjectCard key={product.id} project={product} />)}</div></div></section>
    <section className="section section--quiet"><div className="shell product-future"><Blocks size={31} aria-hidden="true" /><div><h2>More products, only when they are real.</h2><p>New RCS products will be introduced with a confirmed name, purpose, status, and product information—not filler or placeholder claims.</p></div><Link className="text-link" to="/projects">View all projects <ArrowRight size={17} aria-hidden="true" /></Link></div></section>
    <div className="shell"><CtaBand /></div>
  </>;
}
