# Memory & Performance Management

## Overview
This application is designed to be lightweight and fast, leveraging the performance benefits of **Vite** and **React**.

## Performance Strategies
- **Fast Refresh:** Vite's Hot Module Replacement (HMR) ensures a fast development experience.
- **Production Optimization:** Vite performs tree-shaking and asset minification during the build process to reduce the bundle size.
- **Client-Side Routing:** `react-router-dom` enables seamless transitions between pages without full page reloads, saving bandwidth and improving user experience.

## Memory Management
- **State Handling:** Uses React's `useState` and `useEffect` for efficient component-level state management.
- **Garbage Collection:** Standard JavaScript garbage collection handles the lifecycle of React components and event listeners.
- **Scroll Management:** The `ScrollToTop` component in `App.jsx` handles window scrolling efficiently during route transitions.

## Asset Optimization
- Images and icons (via Lucide) are loaded on demand.
- Static data is kept in a centralized `site.js` to avoid redundant memory usage across different components.
