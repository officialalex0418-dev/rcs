import { useState } from "react";
import emailjs from "@emailjs/browser";
import { CheckCircle2, Mail, MapPin, Phone, Send } from "lucide-react";
import Seo from "../components/Seo";
import { company, services } from "../data/site";

const initialForm = { name: "", company: "", email: "", phone: "", service: "", budget: "", projectDetails: "" };

export default function Contact() {
  const [form, setForm] = useState(initialForm);
  const [state, setState] = useState({ type: "", message: "" });
  const [isSending, setIsSending] = useState(false);
  const onChange = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  async function handleSubmit(event) {
    event.preventDefault();
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
    if (!serviceId || !templateId || !publicKey) {
      setState({ type: "error", message: "The form is not configured yet. Please contact RCS directly by email or phone." });
      return;
    }
    setIsSending(true); setState({ type: "", message: "" });
    const message = [`Company: ${form.company || "Not provided"}`, `Phone: ${form.phone || "Not provided"}`, `Service: ${form.service || "Not selected"}`, `Budget: ${form.budget || "Not provided"}`, "", form.projectDetails].join("\n");
    try {
      await emailjs.send(serviceId, templateId, { from_name: form.name, from_email: form.email, subject: `New RCS inquiry: ${form.service || "General"}`, message, to_email: company.email, company: form.company, phone: form.phone, service: form.service, budget: form.budget, project_details: form.projectDetails }, { publicKey });
      setForm(initialForm); setState({ type: "success", message: "Thank you—your message has been sent. RCS will be in touch soon." });
    } catch {
      setState({ type: "error", message: "Your message could not be sent. Please try again or contact RCS directly by email or phone." });
    } finally { setIsSending(false); }
  }

  return <>
    <Seo title="Contact" description="Tell RCS what you are building and start a conversation about a practical digital solution." path="/contact" />
    <section className="page-hero"><div className="shell page-hero__inner"><p className="eyebrow">Contact RCS</p><h1>Have a project in mind?</h1><p>Tell us what you are building. We will help you turn the idea into a practical digital solution.</p></div></section>
    <section className="section"><div className="shell contact-grid"><div className="contact-details"><p className="eyebrow">Start a conversation</p><h2>Tell us where you want to go.</h2><p>Share as much or as little as you know today. A clearer brief helps, but an early idea is a good place to start too.</p><address><a href={`mailto:${company.email}`}><Mail size={19} aria-hidden="true" /><span><b>Email</b>{company.email}</span></a><a href={company.phoneHref}><Phone size={19} aria-hidden="true" /><span><b>Phone</b>{company.phone}</span></a><span><MapPin size={19} aria-hidden="true" /><span><b>Location</b>{company.address}</span></span></address></div>
      <form className="contact-form" onSubmit={handleSubmit} noValidate><div className="form-grid"><label htmlFor="name">Name <em>*</em><input id="name" name="name" value={form.name} onChange={onChange} autoComplete="name" required /></label><label htmlFor="company">Company<input id="company" name="company" value={form.company} onChange={onChange} autoComplete="organization" /></label><label htmlFor="email">Email <em>*</em><input id="email" type="email" name="email" value={form.email} onChange={onChange} autoComplete="email" required /></label><label htmlFor="phone">Phone<input id="phone" type="tel" name="phone" value={form.phone} onChange={onChange} autoComplete="tel" /></label><label htmlFor="service">Service<select id="service" name="service" value={form.service} onChange={onChange}><option value="">Select a service</option>{services.map((service) => <option key={service.id} value={service.title}>{service.title}</option>)}<option value="Other">Other</option></select></label><label htmlFor="budget">Budget <span className="field-optional">(optional)</span><input id="budget" name="budget" value={form.budget} onChange={onChange} placeholder="Optional" /></label></div><label htmlFor="projectDetails">Project details <em>*</em><textarea id="projectDetails" name="projectDetails" value={form.projectDetails} onChange={onChange} rows="6" required placeholder="What are you looking to build, improve, or solve?" /></label>{state.message && <p className={`form-message form-message--${state.type}`} role="status">{state.type === "success" && <CheckCircle2 size={18} aria-hidden="true" />}{state.message}</p>}<button className="button button--primary" type="submit" disabled={isSending}>{isSending ? "Sending…" : "Send inquiry"}<Send size={17} aria-hidden="true" /></button></form>
    </div></section>
  </>;
}
