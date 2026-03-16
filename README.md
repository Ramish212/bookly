# Bookly — Branded Booking Pages for Small Businesses

A SaaS booking platform that lets small businesses create their own public booking page in minutes.

## Features

- 📅 Custom booking pages with branding
- 🗓️ Google Calendar OAuth sync
- 👥 Customer management
- 💼 Service management
- 🎨 Visual site customizer
- 🔐 Auth via Supabase

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4
- **Backend/DB:** Supabase (Auth + Postgres + Edge Functions)
- **Deployment:** Vercel

## Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/bookly.git
cd bookly
npm install
```

### 2. Set up environment variables
```bash
cp .env.example .env.local
```

Fill in your `.env.local`:
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

### 3. Set up Supabase
Run the SQL in `supabase/migrations/` in your Supabase SQL Editor.

### 4. Run locally
```bash
npm run dev
```

### 5. Deploy to Vercel
Connect this repo on [vercel.com](https://vercel.com) and add the environment variables.

## Environment Variables

| Variable | Description |
|---|---|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon/public key |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth 2.0 Client ID |

> **Note:** `GOOGLE_CLIENT_SECRET` goes in Supabase Edge Function secrets only — never in `.env`.
