import { useEffect } from "react";
import { company } from "../data/site";

function upsertMeta(attribute, key, content) {
  let element = document.head.querySelector(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
}

export default function Seo({ title, description, path = "/", schema }) {
  useEffect(() => {
    const pageTitle = title ? `${title} | RCS` : "Royal Consultancy Services | Strategy, Technology & Growth";
    const pageDescription = description || company.description;
    const canonical = `${company.siteUrl}${path}`;

    document.title = pageTitle;
    upsertMeta("name", "description", pageDescription);
    upsertMeta("property", "og:title", pageTitle);
    upsertMeta("property", "og:description", pageDescription);
    upsertMeta("property", "og:url", canonical);
    upsertMeta("property", "og:type", "website");
    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", pageTitle);
    upsertMeta("name", "twitter:description", pageDescription);

    let link = document.head.querySelector("link[rel='canonical']");
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.setAttribute("href", canonical);

    const existingSchema = document.getElementById("page-schema");
    if (existingSchema) existingSchema.remove();
    if (schema) {
      const script = document.createElement("script");
      script.id = "page-schema";
      script.type = "application/ld+json";
      script.text = JSON.stringify(schema);
      document.head.appendChild(script);
    }

    return () => document.getElementById("page-schema")?.remove();
  }, [title, description, path, schema]);

  return null;
}
