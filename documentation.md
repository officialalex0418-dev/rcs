# RCS Project Documentation

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Running locally or on Atlas)

### Setup & Installation
1. **Frontend**:
   ```bash
   cd my-website
   npm install
   npm run dev
   ```
2. **Backend**:
   ```bash
   cd server
   npm install
   # Configure .env with the following:
   # MONGODB_URI=your_mongodb_uri
   # JWT_SECRET=your_jwt_secret
   # RESEND_API_KEY=your_resend_api_key (optional for startup, required for emails)
   npm run dev
   ```

## Admin Portal
- **Login**: Access via `/admin/login`.
- **Default Roles**: Super Admin, Admin, HR Manager, Project Manager, Sales.
- **Features**: Kanban boards for Recruitment and CRM, Gallery manager, and Project health tracker.

## API Reference
- `POST /api/auth/login`: Administrative sign-in.
- `GET /api/careers/jobs`: Public job listings.
- `POST /api/careers/apply`: Public application submission.
- `POST /api/inquiries`: Public inquiry submission.
- `GET /api/projects`: Internal project list (Admin only).

## Public Website
The public site at `rcs.com.np` (simulated) fetches dynamic content for Careers and Gallery from the backend, ensuring content can be updated without code changes.

## Deployment (Cloudflare Workers)

We use a **Cloudflare Worker** to serve the frontend. This provides full control over asset serving and SPA routing.

### 1. Build the Project
Run the following command in the `my-website` directory:
```bash
npm run build
```
This generates the `dist` folder.

### 2. Deploy the Worker
1. Install Wrangler: `npm install -g wrangler`
2. Login: `npx wrangler login`
3. Deploy: `npm run deploy` (runs `wrangler deploy`)

### 3. Verification
- The Worker script at `src/worker.js` handles serving static assets from the `dist` folder and provides SPA routing (mapping unknown paths to `index.html`).
- Ensure the Worker is routed to `rcs.com.np/*` in the Cloudflare Dashboard.

## CI/CD (Cloudflare Automatic Deployment)

The frontend is configured to deploy automatically via Cloudflare's GitHub integration.

### 1. Connection
1. In the **Cloudflare Dashboard**, go to **Workers & Pages**.
2. Connect your GitHub repository and select the `rcs` repo.
3. Configure the following build settings:
   - **Project Name**: `rcs`
   - **Production branch**: `main`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `my-website`

### 2. Environment Variables
Ensure the following variables are set in the Cloudflare Dashboard under **Settings** -> **Environment Variables**:
- `VITE_API_URL`: `https://rcs-ajbn.onrender.com`
- `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, `VITE_EMAILJS_PUBLIC_KEY`: Your EmailJS settings.

### 4. Troubleshooting
- **Hello World appearing**: If you see "Hello world", it means the default starter worker is active. Running `npm run deploy` will replace it with the RCS project worker.
- **Cache**: Purge Cloudflare cache if changes don't appear immediately.
