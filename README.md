# A2Z Utility Hub

A comprehensive, all-in-one web application suite featuring productivity tools (Task Manager, Video Editor, File Converters), e-commerce functionalities (Coupons, Store), a blogging engine, and a fully-featured Admin Dashboard with Role-Based Access Control.

## 🚀 Tech Stack

* **Frontend:** React 18, Vite, Tailwind CSS, Shadcn UI
* **Backend/BaaS:** Supabase (PostgreSQL, Auth, Storage)
* **State Management:** React Context API & Custom Hooks
* **Testing:** Playwright (E2E) & Vitest (Unit)
* **Infrastructure:** Docker, Nginx, Node.js (SSR/Static Serving)

## 📋 Prerequisites

Before running the project, ensure you have the following installed:
* [Node.js](https://nodejs.org/) (v18 or higher recommended)
* [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
* [Docker](https://www.docker.com/) & Docker Compose (if running via containers)
* A [Supabase](https://supabase.com/) account/project (for database & auth)

## ⚙️ Environment Configuration

1. Copy the example environment file to create your local environment:
   ```bash
   cp .env.example .env

Open .env and fill in your Supabase credentials (you can find these in your Supabase Project Settings -> API):

Code snippet
VITE_SUPABASE_URL=[https://your-project-ref.supabase.co](https://your-project-ref.supabase.co)
VITE_SUPABASE_ANON_KEY=your-anon-key
# Add any other required keys (e.g., Google AdSense IDs, Analytics tracking IDs)
🛠️ Step-by-Step Local Setup
1. Database Setup
Before running the app, set up your database schema in Supabase:

Go to the SQL Editor in your Supabase dashboard.

Copy the contents of db/init.sql and run it to set up required extensions/configs.

Copy the contents of db/01-schema-and-seed.sql and run it to create tables, apply Row Level Security (RLS) policies, and seed default roles/admin users.

2. Frontend & Local Development
Install project dependencies:

Bash
npm install
(Optional) If you notice missing Shadcn UI components, you can use the provided script:

Bash
node tools/install-missing-components.js
Start the Vite development server:

Bash
npm run dev
Open your browser and navigate to http://localhost:5173.

3. Connecting Frontend and Backend
The connection is handled seamlessly by src/lib/customSupabaseClient.js. As long as your .env file has the correct VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY, the React app will automatically communicate with your Supabase database for authentication, data fetching, and real-time updates.

🐳 Docker Setup (Production/Staging)
If you prefer to run the application in an isolated environment using Docker, we provide a complete infrastructure setup.

Ensure Docker daemon is running.

Build and start the containers in detached mode:

Bash
docker-compose -f infra/docker/docker-compose.yml up -d --build
The application will be served via the Nginx container, usually accessible at http://localhost:80 (or whichever port is defined in docker-compose.yml).

To stop the containers:

Bash
docker-compose -f infra/docker/docker-compose.yml down
🧪 Testing
To run the automated tests:

Unit Tests (Vitest):

Bash
npm run test:unit
End-to-End Tests (Playwright):

Bash
npx playwright install # Run this once to install test browsers
npm run test:e2e
🐛 Troubleshooting
Issue: The app loads but data isn't showing / Login fails.

Fix: Verify your .env file variables. Ensure VITE_SUPABASE_URL has no trailing slashes. Check the browser console; if you see a 401 Unauthorized or 403 Forbidden, your RLS policies in Supabase might be blocking the request, or your Anon key is incorrect.

Issue: Vite throws a port in use error.

Fix: Run npm run dev -- --port 3000 to specify a different port.

Issue: Docker build fails on npm install.

Fix: Ensure your Dockerfile has the correct Node version specified and that you don't have conflicting .npmrc or .nvmrc files breaking the container build. Try clearing docker cache: docker system prune -a.

Issue: Video Editor features not working.

Fix: Advanced video features require SharedArrayBuffer and specific Cross-Origin headers. If you are developing locally, ensure you are accessing the app via localhost or 127.0.0.1 so the browser treats it as a secure context.

📂 Project Highlights
src/pages/admin: The command center for managing the app, protected by AdminMiddleware.

src/components/apps: The modular source code for all standalone utilities (Tasks, Video Editor, Calculators).

src/hooks: Custom React hooks handling complex logic like network resilience, offline caching, and real-time data streaming.