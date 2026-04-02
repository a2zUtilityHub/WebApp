# Admin Panel Architecture

## 1. System Overview

The a2z Utility Hub Admin Panel is a comprehensive single-page application (SPA) built to manage all aspects of the platform. It is designed with modularity, security, and scalability in mind.

### Core Technologies
- **Frontend**: React 18, Vite
- **Routing**: React Router 6
- **Styling**: TailwindCSS, Shadcn/UI
- **State Management**: React Context + Hooks (SupabaseAuthContext)
- **Backend/DB**: Supabase (PostgreSQL, Auth, Storage, Edge Functions)
- **Animation**: Framer Motion

## 2. Architecture Diagram (Conceptual)