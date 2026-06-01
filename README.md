# Lock In — Cycle Tracker

Personal cycle tracking app built with Next.js, Supabase, and Vercel.

## Setup

1. Clone the repo
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env.local` and fill in your keys
4. Run the SQL in `lib/supabase-schema.sql` in your Supabase SQL editor
5. Deploy to Vercel and add env vars in Vercel dashboard

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## Stack

- Next.js 14
- Supabase (Postgres)
- Tailwind CSS
- Claude AI (built-in chat)
