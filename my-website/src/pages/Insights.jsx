import { ArrowRight, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import CtaBand from "../components/CtaBand";
import Seo from "../components/Seo";
import { insightCategories } from "../data/site";

export default function Insights() {
  return <>
    <Seo title="Insights" description="Practical perspectives on technology, business, marketing, AI, SaaS, and digital growth from RCS." path="/insights" />
    <section className="page-hero"><div className="shell page-hero__inner"><p className="eyebrow">Insights</p><h1>Useful thinking for what businesses build next.</h1><p>Technology, business, marketing, AI, SaaS, digital growth, and case-study perspectives—ready for RCS to publish as verified articles.</p></div></section>
    <section className="section"><div className="shell"><div className="category-list" aria-label="Insight categories">{insightCategories.map((category) => <span key={category}>{category}</span>)}</div><div className="empty-state empty-state--large"><FileText size={34} aria-hidden="true" /><p className="eyebrow">Editorial system ready</p><h2>New insights are on the way.</h2><p>There are no published articles to show yet. This page is intentionally free of invented posts and is ready for RCS to add verified content through a centralized data or future CMS model.</p><Link className="button button--outline" to="/contact">Suggest a conversation <ArrowRight size={17} aria-hidden="true" /></Link></div></div></section>
    <div className="shell"><CtaBand /></div>
  </>;
}
