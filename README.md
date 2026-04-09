# 🛠️ A2Z Utility Hub

Welcome to the **A2Z Utility Hub** repository. This project is a comprehensive, all-in-one web application suite that combines a collection of productivity mini-apps, an e-commerce deals section, a blogging platform, and a highly advanced Admin Dashboard powered by Role-Based Access Control (RBAC).

---

## 📖 1. Project Overview & Features

### Purpose
The goal of A2Z Utility Hub is to provide a single, unified platform where users can access essential daily tools without needing to visit multiple disparate websites, while also discovering curated deals and reading informative content.

### Core Modules
* **🧩 Utility Apps Suite:**
  * **Task Manager:** Kanban-style board with subtasks, tags, time tracking, and team management.
  * **Video Editor:** In-browser video manipulation (timeline, voiceover, noise removal, AI features) using WebCodecs/FFmpeg.
  * **Quick Tools:** URL Shortener, QR Code Generator, Barcode Scanner, File Converter, Profit Calculator, and JSON Formatter.
* **🛍️ E-Commerce & Deals:** Browse coupons, view product galleries, manage a shopping cart, and maintain a wishlist.
* **🎛️ Comprehensive Admin Dashboard:** Manage users, roles, system audit logs, blogs, SEO settings, support tickets, and an automated Chatbot.
* **🔐 Robust Authentication:** Multi-step signup, OTP, Google OAuth, and strict RBAC (User, Moderator, Admin).

---

## 💻 2. Tech Stack Architecture

* **Frontend:** React 18, Vite (Bundler), Tailwind CSS, Shadcn UI (`src/components/ui`)
* **State Management:** React Context API & Custom Hooks
* **Backend Architecture:** Serverless / Backend-as-a-Service (BaaS)
* **Database & Auth:** Supabase (PostgreSQL, Supabase Auth, Storage)
* **Production Node Server:** Express.js (`server.js` for serving built files)
* **Infrastructure & Deployment:** Docker, Docker Compose, Nginx (Reverse Proxy)
* **Testing:** Playwright (End-to-End) & Vitest (Unit Testing)

---

## ⚙️ 3. Environment Configuration

Before running the application, you must configure your environment variables. Never commit `.env` files containing real secrets.

1. **Create your local environment file:**
   ```bash
   # Copy the example file to create your local .env file
   cp .env.example .env
   ```

2. **Populate the `.env` file:**
   Open `.env` in VS Code and fill in the required values. You will need a Supabase project to get these keys.
   ```env
   # Supabase Configuration (CRITICAL FOR BACKEND)
   VITE_SUPABASE_URL=[https://your-project-ref.supabase.co](https://your-project-ref.supabase.co)
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

   # Application Settings
   VITE_APP_ENV=development 
   PORT=3000 # Port used by server.js in production

   # Analytics & Ads (Optional for Local Dev)
   VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   VITE_ADSENSE_CLIENT_ID=ca-pub-XXXXXXXXXXXXXXXX
   ```

---

## 🚀 4. Local Development Setup

We maintain a decoupled BaaS architecture. The frontend runs via Vite, and it communicates directly with your Supabase PostgreSQL database.

### Step 4.1: Database Setup (Supabase)
1. Log in to your [Supabase Dashboard](https://supabase.com/).
2. Navigate to the **SQL Editor**.
3. Open `db/init.sql` from the repository, paste it into the SQL Editor, and run it to set up required extensions.
4. Open `db/01-schema-and-seed.sql`, paste it, and run it. This will build your tables, establish Row Level Security (RLS) policies, and inject initial admin roles/users.

### Step 4.2: Frontend Setup (React/Vite)
Open your terminal (in VS Code or standalone) and navigate to the project root:

```bash
# 1. Install all Node.js dependencies
npm install

# 2. (Optional) Run the script to verify and install any missing Shadcn UI components
node tools/install-missing-components.js

# 3. Start the Vite hot-reloading development server
npm run dev
```
*Your application should now be accessible at `http://localhost:5173`.*

### Step 4.3: Running the Production Node Backend (Optional for Dev)
To test the production-ready Node.js server (`server.js`) locally:
```bash
# Build the optimized production assets into the /dist folder
npm run build

# Start the Express server to serve the application
node server.js
```
*The app will be accessible at `http://localhost:3000`.*

---

1. Install package
Run this command to install the required dependencies.
Details:
npm install @supabase/supabase-js
Code:
File: Code
```
npm install @supabase/supabase-js
```

2. Add Supabase UI components
Run this command to install the Supabase shadcn components.
Details:
npx shadcn@latest add @supabase/supabase-client-nextjs
Code:
File: Code
```
npx shadcn@latest add @supabase/supabase-client-nextjs
```

3. Set env variables
Add the following values to your env file.
Code:
File: .env.local
```
NEXT_PUBLIC_SUPABASE_URL=https://emgfcirrbenkwczlfcof.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVtZ2ZjaXJyYmVua3djemxmY29mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5MjgyOTUsImV4cCI6MjA3MjUwNDI5NX0.dax_Lv126OrP0JUS8K8OKOhkItkXBYohQCymXhiwgpM
```

4. Check out more UI components
Add auth, realtime and storage functionality to your project
Details:
Explore supabase.com/ui

5. Install Agent Skills (Optional)
Agent Skills give AI coding tools ready-made instructions, scripts, and resources for working with Supabase more accurately and efficiently.
Details:
npx skills add supabase/agent-skills
Code:
File: Code
```
npx skills add supabase/agent-skills
```

## 🐳 5. Docker Deployment

The project includes complete Infrastructure as Code (IaC) via Docker and Nginx for staging and production environments.

### Build and Run Containers
1. Ensure the Docker daemon is running on your machine.
2. Verify your `.env` file is present in the root directory.
3. Run the following command to build the images and start the containers in detached mode:
   ```bash
   docker-compose -f infra/docker/docker-compose.yml up -d --build
   ```
4. Access the application via `http://localhost` (Nginx serves it on port 80).

### Stop and Clean Up Containers
```bash
# Stop containers and remove networks
docker-compose -f infra/docker/docker-compose.yml down

# If you need to rebuild completely without cache (useful if npm install hangs):
docker-compose -f infra/docker/docker-compose.yml build --no-cache
```

---

## 🧪 6. Testing Guide

Ensure all tests pass before submitting code.

**Unit Tests (Vitest):**
```bash
# Run unit tests to verify individual component/hook logic
npm run test:unit
```

**End-to-End Tests (Playwright):**
```bash
# (First time only) Install required browsers for Playwright
npx playwright install 

# Run the E2E test suite (verifies Auth, Admin, QR Generation, RBAC)
npm run test:e2e
```

---

## 🤝 7. Git Workflow & Contribution Standards

To keep our repository clean and organized, please adhere to the following standards when contributing:

### ❌ DON'T:
* **DON'T** commit secrets. Never push `.env` files.
* **DON'T** panic when you see a Git `CONFLICT`. It just means Git needs a human decision to merge overlapping changes.
* **DON'T** push directly to `main`. Always create a new branch (`feature/your-feature-name` or `bugfix/issue-description`).

### ✅ DO:
* **DO** update `.env.example` with dummy values if you add new environment variables.
* **DO** utilize GitHub Pull Requests (PRs) for code review before merging.

### Git Color Indicators (Reading Code diffs):
When reviewing code changes in VS Code or GitHub PRs, note the Git colors:
* 🟩 **Green (Added):** New lines of code that did not exist previously.
* 🟥 **Red (Deleted):** Lines that have been removed. (Modified lines show as one red deleted line and one green added line).
* 🟦 **Blue (Context):** Unchanged code surrounding your edits.
* 🟨 **Yellow:** Currently selected line or active cursor.

---

## 🚨 8. Troubleshooting

### "Failed to fetch" or "401 Unauthorized"
* **Cause:** Supabase connection failure or RLS policy blocking access.
* **Fix:** Verify your `.env` file variables (`VITE_SUPABASE_URL` must not have a trailing slash). Ensure you ran the `01-schema-and-seed.sql` script so your RLS policies are active.

### Video Editor / FFmpeg Crashes
* **Cause:** Advanced video processing requires `SharedArrayBuffer`, relying on Cross-Origin Isolation.
* **Fix:** In local dev, access the app strictly via `http://localhost` or `http://127.0.0.1` (secure contexts). In production, ensure Nginx sends the required headers (`Cross-Origin-Opener-Policy` and `Cross-Origin-Embedder-Policy`), as configured in `infra/nginx/nginx.conf`.

### Port 5173 / 3000 is Already in Use
* **Cause:** Another service is hogging the Vite or Node port.
* **Fix:** Run Vite on a different port: `npm run dev -- --port 5174`.
```
