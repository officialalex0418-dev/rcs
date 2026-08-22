import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function CtaBand() {
  return (
    <section className="cta-band">
      <div>
        <p className="eyebrow">Start a conversation</p>
        <h2>Have a project in mind?</h2>
        <p>Tell us what you are building. We will help turn the idea into a practical digital solution.</p>
      </div>
      <Link className="button button--light" to="/contact">Start a project <ArrowUpRight size={18} aria-hidden="true" /></Link>
    </section>
  );
}
