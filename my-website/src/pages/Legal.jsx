import Seo from "../components/Seo";
import { company } from "../data/site";

const content = {
  privacy: { title: "Privacy", description: "How RCS handles information submitted through this website.", sections: [["Contact information", "When you submit the contact form, the information you enter is sent through the site's configured email service so RCS can respond to your inquiry."], ["Website content", "This website does not publish account areas or require visitors to create a user account. If analytics, cookies, or additional services are introduced, this policy should be updated before they are enabled."], ["Questions", `For questions about information you have submitted, contact RCS at ${company.email}.`]] },
  terms: { title: "Terms", description: "Website terms for Royal Consultancy Services.", sections: [["Website use", "The content on this website is provided for general information about RCS and its services. It does not create a service agreement or guarantee a specific project outcome."], ["Project enquiries", "Submitting an enquiry starts a conversation only. Scope, delivery, pricing, and any project commitments are agreed separately in writing."], ["Questions", `For questions about these terms, contact RCS at ${company.email}.`]] },
};

export default function Legal({ type }) {
  const page = content[type];
  return <><Seo title={page.title} description={page.description} path={`/${type}`} /><section className="page-hero page-hero--compact"><div className="shell page-hero__inner"><p className="eyebrow">RCS website</p><h1>{page.title}</h1><p>{page.description}</p></div></section><section className="section"><article className="shell legal-copy">{page.sections.map(([heading, body]) => <section key={heading}><h2>{heading}</h2><p>{body}</p></section>)}</article></section></>;
}
