# 🚀 V3 Alpha Deployment Guide

Complete guide to deploy your Suburban Culture Engine V3 to production.

---

## 📋 Overview

- **Backend:** Render (Node.js)
- **Frontend:** Vercel (Next.js)
- **Database:** Supabase (already set up)

---

## 🎯 Step 1: Deploy Backend to Render

### A. Create New Web Service

1. Go to: **https://render.com/dashboard**
2. Click **"New +"** → **"Web Service"**
3. Click **"Connect a repository"** (if needed, authorize GitHub)
4. Select: **`StealthStartupSuburbMVP2`**

### B. Configure Build Settings

**Service Name:** `suburb-events-v3-backend` (or any name)

**Root Directory:** `backend-v3`

**Environment:** `Node`

**Build Command:**
```
npm install && npm run build
```

**Start Command:**
```
npm start
```

### C. Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"**

Add these 4 variables:

```
SUPABASE_URL=https://swxlsqfcyzpbfwvynjwg.supabase.co
SUPABASE_ANON_KEY=<your_anon_key_from_supabase>
JWT_SECRET=production-secret-key-change-this-to-random-string
NODE_ENV=production
```

> **Important:** Use the SAME Supabase URL and anon key from your local setup!

### D. Deploy

1. Click **"Create Web Service"**
2. Wait 3-5 minutes for deployment
3. Once done, you'll see: ✅ **Live at `https://suburb-events-v3-backend.onrender.com`**
4. **Copy this URL** - you'll need it for the frontend!

---

## 🎨 Step 2: Deploy Frontend to Vercel

### A. Create New Project

1. Go to: **https://vercel.com/dashboard**
2. Click **"Add New..."** → **"Project"**
3. **Import** your GitHub repo: **`StealthStartupSuburbMVP2`**

### B. Configure Project Settings

**Project Name:** `suburb-events-v3-frontend` (or any name)

**Root Directory:** `frontend-v3` ⬅️ **Click "Edit" and set this!**

**Framework Preset:** `Next.js` (auto-detected)

**Build Command:** (leave default)
```
npm run build
```

**Output Directory:** (leave default) `.next`

### C. Add Environment Variables

Click **"Environment Variables"** and add:

```
NEXT_PUBLIC_API_URL=https://suburb-events-v3-backend.onrender.com/api
```

> **Replace with YOUR actual Render backend URL from Step 1D!**

**Optional (for Mapbox later):**
```
NEXT_PUBLIC_MAPBOX_TOKEN=<your_mapbox_token>
```

### D. Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes
3. Once done: ✅ **Live at `https://suburb-events-v3-frontend.vercel.app`**

---

## ✅ Step 3: Test Production

1. **Open your Vercel URL** in a browser
2. You should see:
   - ✅ Suburb banner
   - ✅ Map (with Leaflet/OpenStreetMap)
   - ✅ Floating buttons
   - ✅ Event creation working
3. **Try hosting an event** - it should save to your production database!

---

## 🐛 Troubleshooting

### Backend Won't Start on Render

**Check Logs:**
- Render Dashboard → Your Service → "Logs" tab
- Look for errors like "Missing SUPABASE_URL"

**Fix:** Add missing environment variables

### Frontend Shows API Errors

**Check:**
- Vercel Dashboard → Your Project → "Settings" → "Environment Variables"
- Make sure `NEXT_PUBLIC_API_URL` points to your Render backend URL
- Must include `/api` at the end!

**Fix:** Update env var and redeploy

### CORS Errors

The V3 backend allows all origins (`origin: '*'`) for Alpha, so CORS should work.

If you still get CORS errors, check Render logs.

---

## 🎊 Success!

Your V3 Alpha is now live! 🚀

**Backend:** https://suburb-events-v3-backend.onrender.com  
**Frontend:** https://suburb-events-v3-frontend.vercel.app

Share the frontend URL with friends to test!

---

## 📝 Notes

- The first request to Render may take 30 seconds (free tier spins down when idle)
- Vercel auto-deploys on every GitHub push to `main`
- Render auto-deploys on every GitHub push to `main`

