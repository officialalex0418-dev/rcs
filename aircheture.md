# Project Architecture

## Overview
This project is a modern web application built for **Royal Consultancy Services**. It follows a Single Page Application (SPA) architecture using **React** and **Vite**.

## Tech Stack
- **Framework:** [React 19](https://react.dev/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Routing:** [React Router DOM v7](https://reactrouter.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Email Service:** [@emailjs/browser](https://www.emailjs.com/)

## Directory Structure
- `my-website/src/components/`: Reusable UI components (Navbar, Footer, Cards, etc.).
- `my-website/src/pages/`: Main page views (Home, About, Services, Projects, etc.).
- `my-website/src/data/`: Static data and configuration (e.g., `site.js`).
- `my-website/src/assets/`: Static assets like images and styles.

## Core Logic
- **Routing:** Managed in `App.jsx` using `BrowserRouter`.
- **Layout:** The `Site` component wraps the routes with a common `Navbar` and `Footer`.
- **Utility:** `ScrollToTop` component ensures the page resets to the top on navigation.
- **Data-Driven UI:** Many components fetch their content from `src/data/site.js`, making content updates easier without changing UI code.
