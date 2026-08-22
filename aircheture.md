# RCS Management Platform Architecture

## Overview
The RCS project has evolved from a static website into a comprehensive **Business Management Ecosystem**. It follows a decoupled full-stack architecture with a React frontend and a Node.js/Express backend.

## Tech Stack
- **Frontend:** [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Backend:** [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/)
- **Database:** [MongoDB](https://www.mongodb.com/) (Atlas/Local)
- **Authentication:** JWT (JSON Web Tokens) with Role-Based Access Control (RBAC)
- **Styling:** Tailwind CSS (Admin) + Custom CSS (Public)
- **Icons:** [Lucide React](https://lucide.dev/)

## Core Modules
1. **Careers System:** Manages job postings and recruitment pipeline.
2. **Inquiry CRM:** Converts public contact/project inquiries into manageable leads.
3. **Project Management:** Internal task and milestone tracker for staff.
4. **Gallery Management:** Media manager for public portfolio and website assets.
5. **System Services:** Audit logging and internal notification engine.

## Directory Structure
- `my-website/src/`: React frontend.
    - `admin/`: Secure Management Portal UI.
    - `pages/`: Public marketing website views.
    - `components/`: Shared UI components.
- `server/`: Express API backend.
    - `models/`: Mongoose data schemas.
    - `controllers/`: Business logic.
    - `routes/`: API endpoint definitions.
    - `middleware/`: Auth and RBAC protection.

## Security & Privacy
- **RBAC:** Roles (Super Admin, HR, Sales, PM) control access to sensitive modules.
- **JWT:** Secure stateless authentication for administrative actions.
- **Data Protection:** Candidate and inquiry data is stored securely and only accessible via authorized endpoints.
