import { ArrowLeft, Home } from "lucide-react";
import { Link } from "react-router-dom";
import Seo from "../components/Seo";

export default function NotFound() {
  return <><Seo title="Page not found" description="The page you requested could not be found." path="/404" /><section className="not-found"><div><p className="eyebrow">404</p><h1>Looks like this page took a wrong turn.</h1><p>The link may have moved, or the page may not be available yet.</p><div><Link className="button button--primary" to="/"><Home size={17} aria-hidden="true" />Back to home</Link><Link className="text-link" to="/projects"><ArrowLeft size={17} aria-hidden="true" />Explore projects</Link></div></div></section></>;
}
