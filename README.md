# 🛠️ A2Z Utility Hub

Welcome to **A2Z Utility Hub**, a comprehensive, all-in-one web application suite. This platform combines a collection of productivity mini-apps, an e-commerce deals section, a blogging platform, and a highly advanced Admin Dashboard powered by Role-Based Access Control (RBAC).

---

## 📖 1. Project Overview

### Purpose
The goal of A2Z Utility Hub is to provide a single, unified platform where users can access essential daily tools (like video editing, task management, and file conversion) without needing to visit multiple disparate websites, while also discovering curated deals and reading informative content.

### Main Features & Use Cases
* **🧩 Utility Apps Suite:**
  * **Task Manager:** Kanban-style board with subtasks, tags, and time tracking.
  * **Video Editor:** In-browser video manipulation (timeline, voiceover, noise removal, export) using WebCodecs/FFmpeg.
  * **Tools:** URL Shortener, QR Code Generator, Barcode Scanner, File Converter, Profit Calculator, and JSON Formatter.
* **🛍️ E-Commerce & Deals:** Browse coupons, view product galleries, manage a shopping cart, and maintain a wishlist.
* **🔐 Robust Authentication:** Multi-step signup, OTP, Google OAuth, and strict RBAC (User, Moderator, Admin).
* **🎛️ Comprehensive Admin Dashboard:** Manage users, roles, system audit logs, blogs, SEO settings, support tickets, and an automated Chatbot.

---

## 💻 2. Tech Stack

* **Frontend:** React 18, Vite, Tailwind CSS, Shadcn UI (`components/ui`)
* **Backend Architecture:** Serverless / Backend-as-a-Service (BaaS)
* **Core Backend / Database:** Supabase (PostgreSQL, Supabase Auth, Storage)
* **Production Server:** Node.js / Express (`server.js` for serving/SSR)
* **State Management:** React Context API & Custom Hooks
* **Infrastructure & Deployment:** Docker, Docker Compose, Nginx (Reverse Proxy)
* **Testing:** Playwright (E2E) & Vitest (Unit Testing)

---

## 🚀 3. Setup Instructions

### Prerequisites
* [Node.js](https://nodejs.org/) (v18+ recommended)
* [npm](https://www.npmjs.com/) or yarn
* [Docker](https://www.docker.com/) & Docker Compose (for containerized setup)
* A [Supabase](https://supabase.com/) Account

### Frontend Setup (Local / VS Code)
1. **Clone & Open:** Open the project folder in VS Code.
2. **Install Dependencies:**
   ```bash
   npm install
   ```
3. *(Optional)* Install missing Shadcn UI components if required:
   ```bash
   node tools/install-missing-components.js
   ```
4. **Run Development Server:**
   ```bash
   npm run dev
   ```
5. Navigate to `http://localhost:5173` in your browser.

### Backend Setup (Supabase & Node Server)
This project uses Supabase as its primary database and authentication provider.
1. **Database Schema:**
   * Go to your Supabase Dashboard -> SQL Editor.
   * Run the contents of `db/init.sql` to set up extensions.
   * Run the contents of `db/01-schema-and-seed.sql` to create tables, RLS policies, and seed initial admin data.
2. **Local Node Server (Optional for Dev, Used in Prod):**
   If you want to test the production Node server (`server.js`):
   ```bash
   npm run build
   node server.js
   ```
   This will serve the built Vite application on `http://localhost:3000`.

---

## 🔗 4. Frontend–Backend Integration

The frontend connects directly to the Supabase PostgreSQL database and Auth services using the Supabase JS Client. 

* **Configuration File:** The connection is initialized in `src/lib/customSupabaseClient.js`.
* **API Flow Example (Fetching Tasks):**
  1. A React component calls a function from `src/api/taskManagerApi.js`.
  2. The API file uses the `supabase` client to query the `tasks` table.
  3. Supabase validates the request against PostgreSQL **Row Level Security (RLS)** policies using the user's active JWT token.
  4. Data is returned to the frontend and cached/managed by custom hooks (e.g., `useTaskManagement.js`).

---

## 🐳 5. Docker Configuration

The project is fully dockerized for easy CI/CD and production deployment. The configuration files are located in the `infra/` directory.

### Build and Run using Docker Compose
1. Ensure your Docker daemon is running.
2. Copy your `.env` file into the root directory (see section 6).
3. Run the following command from the root of the project:
   ```bash
   docker-compose -f infra/docker/docker-compose.yml up -d --build
   ```
4. **Access the app:** The Nginx container will serve the application, typically accessible at `http://localhost:80`.

### Stopping the Containers
```bash
docker-compose -f infra/docker/docker-compose.yml down
```

---

## 🔐 6. Environment Configuration

You need to configure environment variables for the frontend to communicate with Supabase and other services.

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
2. Edit `.env` with your actual keys:

```env
# Supabase Configuration (REQUIRED)
VITE_SUPABASE_URL=[https://your-project-ref.supabase.co](https://your-project-ref.supabase.co)
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Analytics & Ads (Optional)
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_ADSENSE_CLIENT_ID=ca-pub-XXXXXXXXXXXXXXXX

# Application Settings
VITE_APP_ENV=development # or production
PORT=3000 # Port for the Node server.js
```

---

## ⌨️ 7. Example Commands

Here are the most common commands you will use during development:

| Command | Description |
| :--- | :--- |
| `npm install` | Installs all Node modules. |
| `npm run dev` | Starts the Vite hot-reloading development server. |
| `npm run build` | Compiles the React application for production into `/dist`. |
| `npm run preview` | Previews the production build locally. |
| `npm run test:unit` | Runs unit tests using Vitest. |
| `npm run test:e2e` | Runs End-to-End tests using Playwright. |
| `node server.js` | Starts the production Node.js server. |

---

## 🚨 8. Troubleshooting

### 1. "Failed to fetch" or "401 Unauthorized" in the App
* **Cause:** Supabase connection failure or RLS policy blocking access.
* **Fix:** 1. Check that `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in your `.env` are exactly correct (no trailing slashes on the URL).
  2. Ensure you have run the SQL scripts in `db/01-schema-and-seed.sql` to establish the correct RLS policies.

### 2. Video Editor Features (FFmpeg) Crash or Hang
* **Cause:** Advanced video processing requires `SharedArrayBuffer`, which relies on Cross-Origin Isolation.
* **Fix:** Ensure you are accessing the dev server via `http://localhost` or `http://127.0.0.1` (browsers treat these as secure contexts). In production, ensure Nginx is sending the following headers:
  * `Cross-Origin-Opener-Policy: same-origin`
  * `Cross-Origin-Embedder-Policy: require-corp`

### 3. Port 5173 is already in use
* **Cause:** Another process is using Vite's default port.
* **Fix:** Run the dev server on a different port: `npm run dev -- --port 3001`

### 4. Docker build fails at `npm install`
* **Cause:** Cache issues or node version mismatches.
* **Fix:** Run Docker system prune: `docker system prune -f`, then rebuild with the `--no-cache` flag: 
  `docker-compose -f infra/docker/docker-compose.yml build --no-cache`
```