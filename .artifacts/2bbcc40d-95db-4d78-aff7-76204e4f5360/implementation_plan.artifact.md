# RCS Management Platform Implementation Plan

This plan outlines the extension of the existing Royal Consultancy Services (RCS) website into a full-scale business management ecosystem, including a secure Admin Portal, CRM, Careers System, and Project Management tool.

## User Review Required

> [!IMPORTANT]
> **New Backend Requirement**: The current project is a static React application. To support databases, authentication, and secure file uploads, I will need to introduce a Node.js/Express backend.
>
> **Database**: I propose using **MongoDB** as mentioned in your requirements. Do you have a MongoDB connection string ready, or should I set up a local instance for development?

> [!WARNING]
> **Authentication**: We will implement a custom JWT-based authentication system. Initial login credentials will need to be securely managed.

## Proposed Changes

The implementation will be modular, starting with the backend foundation and followed by the admin frontend.

### [Phase 1] Backend Infrastructure

We will create a `server/` directory to house the API, models, and middleware.

#### [NEW] [server/package.json](file:///C:/Users/laxmi/Videos/RCS/Royal Consultancy Services/server/package.json)
Initialize a new Node.js project with dependencies: `express`, `mongoose`, `jsonwebtoken`, `bcryptjs`, `cors`, `dotenv`, `multer`.

#### [NEW] [server/app.js](file:///C:/Users/laxmi/Videos/RCS/Royal Consultancy Services/server/app.js)
The main entry point for the Express API.

#### [NEW] [server/models/](file:///C:/Users/laxmi/Videos/RCS/Royal Consultancy Services/server/models/)
Create Mongoose schemas for `User`, `Job`, `Application`, `Inquiry`, `Project`, `Task`, `GalleryItem`, and `AuditLog`.

#### [NEW] [server/routes/](file:///C:/Users/laxmi/Videos/RCS/Royal Consultancy Services/server/routes/)
Define RESTful endpoints for all modules, protected by RBAC middleware.

---

### [Phase 2] Admin Portal (Frontend)

We will integrate the Admin Dashboard into the existing `my-website` project under the `/admin` route.

#### [MODIFY] [App.jsx](file:///C:/Users/laxmi/Videos/RCS/Royal Consultancy Services/my-website/src/App.jsx)
Add the `/admin` route and its nested children. Implement a `ProtectedRoute` component.

#### [NEW] [admin/components/](file:///C:/Users/laxmi/Videos/RCS/Royal Consultancy Services/my-website/src/admin/components/)
Create specialized admin components: `Sidebar`, `StatCard`, `KanbanBoard`, `RichTextEditor`, `FileUpload`.

#### [NEW] [admin/pages/](file:///C:/Users/laxmi/Videos/RCS/Royal Consultancy Services/my-website/src/admin/pages/)
Implement pages for Dashboard, Careers, Inquiries, Projects, and Gallery.

---

### [Phase 3] Module Implementation (Incremental)

1. **Careers & Applications**: Build the Job CRUD and the public application form that posts to our new API.
2. **Inquiry CRM**: Redirect public contact forms to the backend and build the admin lead management UI.
3. **Gallery Management**: Implement multi-file uploads and category/album management.
4. **Internal Project Management**: Build the internal task/milestone tracker.

## Verification Plan

### Automated Tests
- Postman/Insomnia collections to test API endpoints.
- Unit tests for permission logic (RBAC).

### Manual Verification
- Verify that public forms correctly populate the Admin Dashboard.
- Test drag-and-drop Kanban updates for applications and inquiries.
- Verify file upload security (no public access to resumes).
