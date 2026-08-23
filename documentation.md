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

## Deployment (cPanel)

### 1. Build the Project
Run the following command in the `my-website` directory:
```bash
npm run build
```
This generates a `dist` folder.

### 2. Upload to cPanel
1. Log in to your cPanel File Manager.
2. Navigate to `public_html` (or your subdomain folder).
3. Upload all files and folders *inside* the `dist` directory.
4. Ensure the `.htaccess` file is also uploaded. This handles the Single Page Application (SPA) routing.

### 3. Troubleshooting "Not Loading"
- **Relative Paths**: We have configured `vite.config.js` with `base: './'` to ensure assets load correctly if the site is in a subfolder.
- **Routing**: If you get 404s on subpages, verify that `.htaccess` is present and contains the rewrite rules.
- **Cache**: Clear your browser cache or use Incognito mode after re-uploading.
