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
   # Configure .env with MONGODB_URI and JWT_SECRET
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
