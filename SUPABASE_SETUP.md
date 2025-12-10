# Supabase Setup Guide

Complete guide to set up your Suburb Events backend with Supabase (hosted PostgreSQL).

## 🚀 Quick Setup (5 minutes)

### Step 1: Create Supabase Project

1. Go to https://supabase.com
2. Click "Start your project"
3. Sign in with GitHub (or create account)
4. Click "New Project"
5. Fill in:
   - **Name**: suburb-events
   - **Database Password**: (create a strong password - save this!)
   - **Region**: Choose closest to you (e.g., East US)
6. Click "Create new project"
7. Wait ~2 minutes for project to provision

### Step 2: Get Database Connection String

1. In your Supabase project dashboard, click **"Project Settings"** (gear icon at bottom left)
2. Click **"Database"** in the sidebar
3. Scroll down to **"Connection string"** section
4. Select **"URI"** tab (not "Session pooler")
5. Click **"Copy"** on the connection string
6. It will look like:
   ```
   postgresql://postgres.[project-ref]:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
   ```
7. **Important**: Replace `[YOUR-PASSWORD]` with the database password you created in Step 1

### Step 3: Update Backend .env

In your backend directory, update the `.env` file:

```bash
cd "/Users/akhildurvasula/Downloads/Startup Idea/backend"
```

Replace the contents with:

```env
DATABASE_URL="your-supabase-connection-string-here"
PORT=4000
NODE_ENV=development
JWT_SECRET="suburb-events-secret-key-change-in-production"
```

**Example:**
```env
DATABASE_URL="postgresql://postgres.abcdefghijk:MyP@ssw0rd@aws-0-us-east-1.pooler.supabase.com:6543/postgres"
PORT=4000
NODE_ENV=development
JWT_SECRET="suburb-events-secret-key-change-in-production"
```

### Step 4: Run Migrations & Seed

```bash
# Generate Prisma client
npm run prisma:generate

# Push schema to Supabase (creates all tables)
npx prisma db push

# Seed with sample data
npm run prisma:seed
```

### Step 5: Start Backend Server

```bash
npm run dev
```

You should see:
```
🚀 Server running on port 4000
📡 API available at http://localhost:4000
```

### Step 6: Verify in Supabase Dashboard

1. Go back to Supabase dashboard
2. Click **"Table Editor"** in sidebar
3. You should see all your tables:
   - users
   - suburbs
   - events
   - hoa_locations
   - etc.

---

## 🎯 What You Get With Supabase

✅ **Hosted PostgreSQL** - No local install needed
✅ **Database GUI** - Built-in table editor
✅ **Automatic Backups** - Daily backups included
✅ **Free Tier** - Up to 500MB database, 2GB bandwidth
✅ **Real-time Subscriptions** - Can add later
✅ **Authentication** - Can use Supabase Auth too (optional)

---

## 🔧 Alternative: Use Prisma Migrate Instead of db push

If you prefer proper migrations:

```bash
# Instead of: npx prisma db push
# Use:
npm run prisma:migrate

# When prompted for migration name, type: init
```

---

## 📊 View Your Data

### Option 1: Supabase Dashboard
- Go to your project → Table Editor
- Click on any table to view/edit data

### Option 2: Prisma Studio (Local GUI)
```bash
npm run prisma:studio
```
Opens at http://localhost:5555

---

## 🐛 Troubleshooting

### "Can't reach database server"
- Check Supabase project is active (green dot in dashboard)
- Verify connection string is correct
- Make sure you replaced `[YOUR-PASSWORD]` with actual password

### "Invalid connection string"
- Must use the **URI** format (not Session pooler)
- Include `?schema=public` or other parameters if needed
- Don't include spaces or line breaks

### "Prisma Client not generated"
```bash
npm run prisma:generate
```

### "Migration failed"
- Try `npx prisma db push` instead (no migration history)
- Or clear and retry: `npx prisma migrate reset`

---

## 🔑 Save Your Credentials

**Important:** Save these somewhere safe:
- Supabase Project URL
- Database Password
- Supabase Anon Key (if using Supabase Auth)
- Supabase Service Role Key (if needed)

You can find these in: **Project Settings → API**

---

## 🚀 Next Steps After Backend is Running

1. Keep backend terminal open with `npm run dev`
2. Open new terminal for frontend:
   ```bash
   cd "/Users/akhildurvasula/Downloads/Startup Idea/frontend"
   npm run dev
   ```
3. Open http://localhost:3000
4. Login with: alex@example.com / password123

---

## 💡 Pro Tip

Supabase also provides:
- **Auth UI** - Pre-built login components
- **Storage** - File uploads (for event photos)
- **Edge Functions** - Serverless functions
- **Realtime** - Live event updates

These can be added to your MVP later!

