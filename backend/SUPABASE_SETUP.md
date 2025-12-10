# Supabase Backend Setup Guide

This backend has been configured to use Supabase as the database. Follow these steps to get it running.

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in:
   - **Name**: `suburb-events` (or whatever you prefer)
   - **Database Password**: Choose a strong password and save it
   - **Region**: Choose closest to you
5. Click "Create new project"
6. Wait ~2 minutes for setup to complete

## Step 2: Get Your Connection Details

1. In your Supabase project dashboard, click "Project Settings" (gear icon in the sidebar)
2. Go to "API" section
3. You'll see:
   - **Project URL**: This is your `SUPABASE_URL`
   - **anon/public key**: This is your `SUPABASE_ANON_KEY`
   - **service_role key** (click "Reveal"): This is your `SUPABASE_SERVICE_ROLE_KEY`

## Step 3: Update Your .env File

1. Open `backend/.env`
2. Replace the placeholder values:

```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-actual-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-actual-service-role-key-here

PORT=4000
NODE_ENV=development
JWT_SECRET=suburb-events-secret-key-change-in-production
```

⚠️ **Important**: The `service_role` key bypasses Row Level Security and should be kept secret!

## Step 4: Create Database Tables

1. In Supabase dashboard, click "SQL Editor" in the sidebar
2. Click "New Query"
3. Copy the ENTIRE contents of `backend/scripts/setup-tables.sql`
4. Paste into the SQL editor
5. Click "Run" (or press Cmd/Ctrl + Enter)
6. You should see "Success. No rows returned" - that's good!

## Step 5: Verify Tables Were Created

1. Click "Table Editor" in the Supabase sidebar
2. You should see tables like:
   - users
   - suburbs
   - suburb_scores
   - events
   - event_attendances
   - hoas
   - hoa_locations
   - user_home_locations

## Step 6: Install Dependencies & Run

```bash
cd backend
npm install
npm run dev
```

You should see:
```
✅ Supabase client initialized
🚀 Server running on http://localhost:4000
```

## Step 7: (Optional) Seed Sample Data

If you want some test data:

```bash
npm run seed
```

## Troubleshooting

### Error: "Missing Supabase configuration"

- Check that your `.env` file has all three Supabase variables filled in
- Make sure there are no extra spaces around the `=` sign
- Restart your server after changing `.env`

### Error: "relation does not exist"

- You haven't run the SQL setup script yet
- Go back to Step 4 and run `setup-tables.sql` in Supabase SQL Editor

### Error: "JWT expired" or "invalid signature"

- Make sure `JWT_SECRET` is set in `.env`
- Try logging in again to get a fresh token

### Can't connect to Supabase

- Check that your `SUPABASE_URL` is correct
- Make sure your internet connection is working
- Verify the keys are correct (anon key and service role key are different!)

## Next Steps

Once the backend is running:

1. Test the API at `http://localhost:4000/api/health` (should return `{"status":"ok"}`)
2. Try signing up: `POST http://localhost:4000/api/auth/signup`
3. Connect your frontend by setting `NEXT_PUBLIC_API_URL=http://localhost:4000/api` in `frontend/.env.local`

## API Documentation

See `API_DOCS.md` for full endpoint documentation.

