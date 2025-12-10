# 🚀 Simple Deployment Guide

Deploy your Suburb Events app in ~15 minutes!

---

## Part 1: Deploy Backend to Render (5 minutes)

### Step 1: Create Render Account
1. Go to https://render.com
2. Click **"Get Started for Free"**
3. Sign up with GitHub (easiest option)

### Step 2: Create New Web Service
1. Click **"New +"** button (top right)
2. Select **"Web Service"**
3. Click **"Build and deploy from a Git repository"**
4. Click **"Connect GitHub"** and authorize Render
5. Find your repository and click **"Connect"**

### Step 3: Configure the Service
Fill in these settings:

- **Name**: `suburb-events-backend` (or whatever you like)
- **Region**: Choose closest to you
- **Branch**: `main` (or `master`)
- **Root Directory**: `backend`
- **Runtime**: **Node**
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Instance Type**: **Free**

### Step 4: Add Environment Variables
Click **"Advanced"** → **"Add Environment Variable"**

Add these 4 variables (get values from your Supabase dashboard):

| KEY | VALUE |
|-----|-------|
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_ANON_KEY` | Your publishable key |
| `SUPABASE_SERVICE_ROLE_KEY` | Your secret key |
| `JWT_SECRET` | `your-secret-jwt-key-change-this` |
| `NODE_ENV` | `production` |
| `PORT` | `4000` |

### Step 5: Deploy!
1. Click **"Create Web Service"**
2. Wait 2-3 minutes for deployment
3. You'll get a URL like: `https://suburb-events-backend.onrender.com`
4. **SAVE THIS URL!** You'll need it for the frontend

✅ **Backend is live!**

---

## Part 2: Deploy Frontend to Vercel (5 minutes)

### Step 1: Create Vercel Account
1. Go to https://vercel.com
2. Click **"Sign Up"**
3. Sign up with GitHub (easiest option)

### Step 2: Import Your Project
1. Click **"Add New..."** → **"Project"**
2. Find your repository and click **"Import"**

### Step 3: Configure the Project
- **Framework Preset**: Next.js (should auto-detect)
- **Root Directory**: `frontend`
- **Build Command**: Leave default (`npm run build`)
- **Output Directory**: Leave default (`.next`)

### Step 4: Add Environment Variable
Click **"Environment Variables"** section

Add this ONE variable:

| KEY | VALUE |
|-----|-------|
| `NEXT_PUBLIC_API_URL` | `https://your-backend-url.onrender.com/api` |

⚠️ **Important**: Replace `your-backend-url.onrender.com` with YOUR actual Render URL from Part 1!

Example: `https://suburb-events-backend.onrender.com/api`

### Step 5: Deploy!
1. Click **"Deploy"**
2. Wait 1-2 minutes
3. You'll get a URL like: `https://suburb-events-xyz.vercel.app`

✅ **Frontend is live!**

---

## Part 3: Test Your Live App (2 minutes)

1. Open your Vercel URL in a browser
2. You should see the styled onboarding screen!
3. Click "Get Started"
4. Try creating an account

### If something doesn't work:
- **Backend issue**: Check Render logs (Logs tab in Render dashboard)
- **Frontend issue**: Check Vercel logs (Deployments → click on deployment → View Function Logs)
- **Environment variables**: Make sure they're correct (no extra spaces!)

---

## 🎉 You're Live!

Your app URLs:
- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-backend.onrender.com`

---

## 💡 Free Tier Limitations

### Render (Backend):
- ⚠️ **Spins down after 15 min of inactivity**
- First request after sleep takes ~30-60 seconds
- **Solution**: Upgrade to paid plan ($7/month) for 24/7 uptime

### Vercel (Frontend):
- ✅ Always online, super fast!
- 100 GB bandwidth/month (plenty for MVP)

---

## 🔄 How to Update Your App

### Update Backend:
1. Push code to GitHub
2. Render auto-deploys (takes ~2 min)

### Update Frontend:
1. Push code to GitHub
2. Vercel auto-deploys (takes ~1 min)

That's it! Both platforms auto-deploy on every push to your main branch.

---

## 📞 Need Help?

- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Check logs** in both dashboards if something breaks

Good luck! 🚀

