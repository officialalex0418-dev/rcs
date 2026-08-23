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

## Deployment (Cloudflare Workers / Pages)

### 1. Build the Project
Run the following command in the `my-website` directory:
```bash
npm run build
```
This generates a `dist` folder with optimized and hashed assets.

### 2. Deploy to Cloudflare
We use Cloudflare for frontend hosting to ensure high performance and reliable SPA routing.

#### Option A: Cloudflare Pages (Recommended)
1. Connect your GitHub repository to Cloudflare Pages.
2. **Build Settings**:
   - **Framework preset**: `Vite` (or None)
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
3. The `public/_redirects` file will automatically handle SPA routing.

#### Option B: Manual Wrangler Deployment
If you need to trigger a manual push:
1. Install Wrangler: `npm install -g wrangler`
2. Login: `npx wrangler login`
3. Deploy: `npm run deploy`

### 3. Troubleshooting
- **Build Error: Missing entry-point**: This happens if Cloudflare tries to run a manual deploy command. In your Pages project settings under **Builds & deployments**, ensure the **"Deploy command"** field is completely **empty**.
- **Cache**: If changes don't appear, go to the Cloudflare dashboard and "Purge Everything" under Caching.
- **Environment Variables**: Ensure `VITE_API_URL` is set in the Cloudflare Dashboard under Settings -> Environment Variables.
