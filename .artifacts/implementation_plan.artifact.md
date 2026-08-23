# Implementation Plan - Fix Website Loading Issue & Update Documentation

The website is currently not loading after being uploaded to cPanel. Based on the audit, the primary issue is likely due to **absolute asset paths** in the Vite production build and potential routing conflicts on the Apache server (cPanel).

## User Review Required

> [!IMPORTANT]
> The fix involves changing the Vite build configuration to use **relative paths**. This ensures that assets will load correctly regardless of whether the site is hosted at the root of a domain or in a subfolder.

> [!NOTE]
> You will need to **rebuild the project** (`npm run build`) and **re-upload the contents of the `dist` folder** to cPanel after these changes are applied.

## Proposed Changes

### Frontend Configuration
#### [MODIFY] [vite.config.js](file:///C:/Users/laxmi/Videos/RCS/Royal Consultancy Services/my-website/vite.config.js)
- Add `base: './'` to the configuration to enable relative asset paths.

#### [MODIFY] [Navbar.jsx](file:///C:/Users/laxmi/Videos/RCS/Royal Consultancy Services/my-website/src/components/Navbar.jsx)
- Update the logo `src` to use a relative path or ensure it's compatible with the new base configuration.

### Deployment Assets
#### [MODIFY] [.htaccess](file:///C:/Users/laxmi/Videos/RCS/Royal Consultancy Services/my-website/public/.htaccess)
- Ensure the SPA routing rules are robust for cPanel environments.

### Documentation
#### [MODIFY] [documentation.md](file:///C:/Users/laxmi/Videos/RCS/Royal Consultancy Services/documentation.md)
- Add a "Deployment" section with specific instructions for cPanel.
- Explain how to handle the `dist` folder and `.htaccess`.

#### [MODIFY] [README.md](file:///C:/Users/laxmi/Videos/RCS/Royal Consultancy Services/my-website/README.md)
- Update the production checks and deployment notes.

## Verification Plan

### Automated Verification
- I will run `analyze_file` on the modified files to ensure no syntax errors were introduced.

### Manual Verification
- You will need to run `npm run build` locally and check the `dist/index.html` file to see if the asset paths are now relative (e.g., `./assets/...` instead of `/assets/...`).
- After uploading to cPanel, verify that the home page loads and that navigating to other routes (e.g., `/services`) works without 404 errors.
