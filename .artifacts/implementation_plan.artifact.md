# Implementation Plan: Modules 1, 2, and 3

This plan covers the implementation of Real-Time Dashboard Analytics, Dynamic Project Creation, and Inquiry/Email Thread Management.

## Proposed Changes

### Module 1: Real-Time Dashboard Analytics
- **Backend:** Create `dashboardController.js` and `dashboardRoutes.js` to aggregate data (Projects, Inquiries, Vacancies, Applications, Tasks, Payroll).
- **Frontend:** Update `AdminDashboard.jsx` to fetch live data using a polling mechanism (WebSockets can be added later if needed).

### Module 2: Dynamic Project Creation
- **Backend:** Update `Project.js` Mongoose model to support dynamic text fields and a more flexible media gallery.
- **Frontend:** Create a `ProjectForm.jsx` component with dynamic input fields and multi-media upload support.

### Module 3: Inquiry & Email Thread Management
- **Backend:** Update `Inquiry.js` model to include a `messages` array for conversation history.
- **Backend:** Update `inquiryController.js` to handle sending replies via Resend API and appending them to the thread.
- **Frontend:** Update `InquiriesList.jsx` to include a "View Thread" modal and a reply interface.

## User Review Required

> [!IMPORTANT]
> **Resend API Key**: You will need to add your `RESEND_API_KEY` to the `.env` file on Render for the email functionality to work.

## Verification Plan

### Automated Tests
- Postman/Insomnia tests for new `/api/dashboard/stats` and `/api/inquiries/:id/reply` endpoints.

### Manual Verification
- Verify that the Dashboard stats reflect the actual numbers in the database.
- Create a project with dynamic fields and verify it's saved correctly.
- Reply to an inquiry and verify that the message appears in the thread and an email is triggered.
