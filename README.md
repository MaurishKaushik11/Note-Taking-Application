# Note Taking App (React + Node + TypeScript)

A full-stack note-taking application with Email + OTP and Google authentication, secure JWT-based authorization, and create/delete notes.

## Tech Stack
- Frontend: React (TypeScript), Vite, TailwindCSS
- Backend: Node.js, Express, TypeScript
- Database: MongoDB (Mongoose)
- Auth: JWT, Google Sign-In, Email OTP (Resend)
- Deployment: Frontend (Netlify/Vercel), Backend (Render/Railway/Fly.io)

## Features
- Sign up using Email + OTP or Google account
- Login using Google (if previously signed up with Google)
- Form validations and meaningful error messages
- Secure JWT auth for creating/deleting notes
- Mobile-friendly UI closely matching provided design assets

## Monorepo Structure
```
/ (root)
├─ client/            # React + Vite + TS frontend
├─ server/            # Express + TS backend
├─ .gitignore
└─ README.md
```

## Quick Start

### Prerequisites
- Node.js 18+
- pnpm (recommended) or npm/yarn
- MongoDB (Atlas or local)
- Google OAuth client (Web) for frontend and backend verification
- Resend API Key (or use console email sender for local dev)

### Backend Setup
1. Create `server/.env` from `server/.env.example` and fill values.
2. Install deps:
   ```bash
   pnpm install
   pnpm --filter server dev
   ```
   Or with npm:
   ```bash
   npm install --workspaces
   npm --workspace server run dev
   ```

### Frontend Setup
1. Copy design assets into `client/public/assets/` (see Assets section).
2. Create `client/.env` from `client/.env.example` and fill values.
3. Run:
   ```bash
   pnpm --filter client dev
   ```

### Environment Variables

Backend (`server/.env`):
- `PORT=5000`
- `MONGODB_URI=`
- `JWT_SECRET=`
- `RESEND_API_KEY=` (optional for local)
- `EMAIL_FROM=` (e.g., `no-reply@yourdomain.com`)
- `GOOGLE_CLIENT_ID=` (for verifying frontend Google ID tokens)
- `CLIENT_ORIGIN=` (frontend URL for CORS)

Frontend (`client/.env`):
- `VITE_API_BASE_URL=` (backend URL)
- `VITE_GOOGLE_CLIENT_ID=`

## Assets
Download assets from the provided link and place them at `client/public/assets/`.

If you want me to auto-download them for you on Windows, approve the commands I’ll propose to fetch and extract them.

## Scripts
Root uses workspaces. Common scripts:
- `pnpm --filter server dev` – start backend in watch mode
- `pnpm --filter client dev` – start frontend

## Deployment
- Backend: Render, Railway, or Fly.io
- Frontend: Netlify or Vercel

See detailed deployment steps near the end of the file after development is complete.

---

I will keep this README updated as we implement features.
