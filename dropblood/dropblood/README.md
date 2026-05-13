# DropBlood

Blood donation platform. React frontend + Supabase backend.

## Setup (Do this first)

### 1. Supabase Tables
- Go to your Supabase project
- Click **SQL Editor**
- Copy everything from `SUPABASE_SETUP.sql` and run it

### 2. Supabase Auth Settings
- Go to **Authentication → Settings**
- Under "Email Auth" make sure it's enabled
- Optional: disable "Confirm email" for easier testing

### 3. Deploy to Vercel
- Push this folder to a GitHub repo
- Go to vercel.com → New Project → Import your repo
- No environment variables needed (credentials are in src/lib/supabase.js)
- Click Deploy

## Pages
- `/` — Home feed (posts)
- `/donations` — Donation records
- `/members` — Member directory
- `/messages/:userId` — Direct messages

## Tech Stack
- React 18
- Supabase (auth + database + realtime)
- Tailwind CSS
- React Router v6
- Vercel (hosting)
