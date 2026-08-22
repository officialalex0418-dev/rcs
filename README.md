# Royal Consultancy Services (RCS) Management Platform

The RCS Management Platform is a full-stack business ecosystem combining a public marketing website with a robust internal management portal.

## Project Structure

- `my-website/` - React frontend (Vite)
    - Public Website
    - Admin Portal (/admin)
- `server/` - Node.js/Express API Backend
    - MongoDB Models
    - RBAC & JWT Authentication

## Key Features

- **Careers & Recruitment**: Job postings, application tracking, and interview management.
- **Inquiry CRM**: Lead management from public contact and project forms.
- **Gallery Management**: Internal media and album manager for public assets.
- **Project Tracking**: Internal task and milestone management for staff.
- **Analytics**: Reports on business growth, sales, and recruitment performance.

## Getting Started

### Backend
1. `cd server`
2. `npm install`
3. Create a `.env` file based on the documentation.
4. `npm run dev`

### Frontend
1. `cd my-website`
2. `npm install`
3. `npm run dev`

## Documentation
For detailed architecture and memory management details, refer to:
- [Architecture Details](aircheture.md)
- [Performance & Memory Logs](memeory.md)
- [Project Phases](phase.md)
- [System Documentation](documentation.md)
