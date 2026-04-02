# A2Z Utility Hub Infrastructure

This directory contains the configuration for deploying the A2Z Utility Hub application. It includes examples for both a dynamic Node.js deployment and a static site deployment on a standard web host like Hostinger.

## Overview

-   **`docker/`**: Contains `Dockerfile` and `docker-compose.yml` for a full-stack deployment using Docker and Nginx as a reverse proxy. This is ideal for VPS hosting.
-   **`nginx/`**: Contains Nginx configuration examples.
-   **Root Directory Files:**
    -   `.htaccess`: Apache configuration for deploying on shared hosting (like Hostinger).
    -   `server.js` / `passenger-config.json`: For deploying as a Node.js application on Hostinger.

---

## Option A: Deploying as a Node.js App on Hostinger (Recommended)

This method uses Hostinger's "Setup Node.js App" feature, providing better performance and handling of server-side logic.

### 1. DNS Configuration

Ensure your DNS is configured in Hostinger's DNS Zone Editor. Your server's IP is in hPanel under **Hosting** → **Plan details**.

-   **A Records:** Point `@`, `www`, `admin`, `blogs`, and `db` to `YOUR_HOSTINGER_SERVER_IP`.
-   **Email Records:** Use Hostinger's default SPF/DKIM records for email deliverability.

### 2. Preparing and Uploading Files

1.  **Build the App:** Run `npm run build` locally.
2.  **Create ZIP:** Create a `.zip` file containing:
    -   `dist/` (folder)
    -   `node_modules/` (folder)
    -   `package.json`
    -   `server.js`
    -   `passenger-config.json`
3.  **Upload to Hostinger:**
    -   In File Manager, go to `public_html` and create a folder (e.g., `a2z-app`).
    -   Upload and extract the `.zip` file there.

### 3. Setting up the Node.js Application

1.  In hPanel, go to **Advanced** → **Setup Node.js App**.
2.  **Create Application:**
    -   Node.js version: `20.x.x`
    -   Application root: `/public_html/a2z-app`
    -   Application startup file: `server.js`
3.  **Add Environment Variables:** Add your `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
4.  **Configure `.htaccess`:** Place the provided `.htaccess` file in your `public_html` directory. This proxies traffic from your domains to the Node.js app.

---

## Option B: Deploying as a Static Site on Hostinger

This is the simplest deployment method, suitable for standard web hosting plans. It involves uploading the built static files directly.

### 1. Build the Application

On your local machine, run the build command to generate the static files:

```bash
npm install
npm run build
```

This will create a `dist` folder containing `index.html` and all the necessary CSS, JavaScript, and asset files.

### 2. Upload Files to Hostinger

1.  **Connect to File Manager:** Open the File Manager in your Hostinger hPanel.
2.  **Navigate to `public_html`:** This is the root directory for your main domain (`a2zutilityhub.com`).
3.  **Upload Contents:** Upload all files and folders from **inside** your local `dist` folder directly into `public_html`. The `index.html` file from your `dist` folder should be at the top level of `public_html`.

### 3. Configure Subdomains and `.htaccess`

1.  **Subdomains:** In hPanel, ensure your subdomains (`admin`, `blogs`, `db`) are created. They should point to the `public_html` directory as well.
2.  **`htaccess` for Routing:** The `.htaccess` file in `public_html` is crucial. It must contain rules to redirect all requests to `index.html`. This allows React Router to handle all the page navigation (like `/dashboard` or `/admin/users`) correctly. The existing `.htaccess` file is already configured for this.

### 4. Verification

-   `https://a2zutilityhub.com` should load the public site.
-   `https://admin.a2zutilityhub.com` will also load the site, and React Router will direct to the admin section if the user is logged in and has permissions.
-   `https://blogs.a2zutilityhub.com` will do the same for the blog section.

### Database Access (`db.a2zutilityhub.com`)

For database administration, it is recommended to use the **Databases** → **phpMyAdmin** tool provided within hPanel. For direct access via a URL, you would create a `db` folder inside `public_html`, place a tool like `Adminer.php` inside it, and protect the directory with a password using the "Directory Privacy" feature in hPanel.