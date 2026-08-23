# RCS Website

The Royal Consultancy Services website is a React and Vite single-page application focused on technology, digital growth, products, and project work.

## Run locally

```bash
npm install
npm run dev
```

Production checks:

```bash
npm run lint
npm run build
```

## Content architecture

Most company content is centralized in [src/data/site.js](src/data/site.js):

- `company` contains verified public contact and social information.
- `services` powers service cards and contact form choices.
- `projects` powers the project grid, filters, product ecosystem, project routes, status badge, metadata, and sitemap entry.
- `process` and `insightCategories` power reusable editorial sections.

To add a project, add one complete verified object to `projects`, including a unique `id`, `slug`, categories, status, public description, and SEO fields. The route `/projects/:slug` is generated from the same model. Do not add features, client results, technologies, launch dates, or imagery until they are approved for publication.

## Contact form

The form preserves the existing EmailJS implementation. Configure only these values in an uncommitted `.env` file:

```text
VITE_EMAILJS_SERVICE_ID=
VITE_EMAILJS_TEMPLATE_ID=
VITE_EMAILJS_PUBLIC_KEY=
```

`VITE_` variables are exposed to the browser, so never put a private API key, password, token, or email credential in this file. EmailJS public keys are designed for client use.

## SEO and deployment

The site includes route-level title/description/canonical/Open Graph metadata, Organization and WebSite structured data, `public/robots.txt`, and `public/sitemap.xml`.

Because the app uses browser routes, configure the production host to return `index.html` for unknown application routes. That keeps direct links such as `/projects/business-sarthi` working after deployment.

### cPanel Specifics
The project is configured to use relative asset paths (`base: './'` in `vite.config.js`). When deploying to cPanel:
1. Upload the *contents* of the `dist` folder.
2. Ensure `.htaccess` (from the `public` folder) is in the root of your web directory.
