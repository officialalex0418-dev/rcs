import { ArrowLeft, ArrowRight, Check, ExternalLink } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import CtaBand from "../components/CtaBand";
import ProjectStatus from "../components/ProjectStatus";
import ProjectVisual from "../components/ProjectVisual";
import Seo from "../components/Seo";
import { company, projects } from "../data/site";
import NotFound from "./NotFound";

export default function ProjectDetail() {
  const { slug } = useParams();
  const project = projects.find((item) => item.slug === slug);
  if (!project) return <NotFound />;
  const schema = { "@context": "https://schema.org", "@type": "SoftwareApplication", name: project.title, description: project.fullDescription, applicationCategory: "BusinessApplication", url: `${company.siteUrl}/projects/${project.slug}`, creator: { "@type": "Organization", name: company.name } };
  return <>
    <Seo title={project.seo.title.replace(" | RCS", "")} description={project.seo.description} path={`/projects/${project.slug}`} schema={schema} />
    <section className="project-hero"><div className="shell"><nav className="breadcrumbs" aria-label="Breadcrumb"><Link to="/projects">Projects</Link><span>/</span><span aria-current="page">{project.title}</span></nav><div className="project-hero__grid"><div><ProjectStatus status={project.status} label={project.statusLabel} /><p className="eyebrow">{project.categories.join(" · ")}</p><h1>{project.title}</h1><p>{project.fullDescription}</p>{project.liveUrl && <a className="button button--primary" href={project.liveUrl} target="_blank" rel="noreferrer">Visit product <ExternalLink size={17} aria-hidden="true" /></a>}</div><ProjectVisual title={project.title} /></div></div></section>
    <section className="section"><div className="shell project-overview"><div><p className="eyebrow">Overview</p><h2>A technology product by RCS.</h2><p>{project.shortDescription}</p></div><dl><div><dt>Product</dt><dd>{project.client}</dd></div><div><dt>Category</dt><dd>{project.categories.join(" · ")}</dd></div><div><dt>Industry</dt><dd>{project.industry}</dd></div><div><dt>Status</dt><dd>{project.statusLabel}</dd></div></dl></div></section>
    <section className="section section--quiet"><div className="shell two-column-detail"><article><p className="eyebrow">Focus</p><h2>Built around practical operations.</h2><ul className="check-list">{project.objectives.map((objective) => <li key={objective}><Check size={18} aria-hidden="true" />{objective}</li>)}</ul></article><article><p className="eyebrow">Approach</p><h2>Product details that stay accurate.</h2><p>{project.solution}</p><p className="muted-note">{project.statusNote}</p></article></div></section>
    <section className="section"><div className="shell detail-notice"><h2>Feature and technology information</h2><p>RCS will publish the specific functionality, technology stack, screenshots, results, and timeline for this product as those details are approved for public release.</p></div></section>
    <div className="shell"><Link className="text-link text-link--standalone" to="/projects"><ArrowLeft size={17} aria-hidden="true" />Back to all projects</Link><CtaBand /></div>
  </>;
}
