# ✅ Deployment Checklist

Use this simple checklist before deploying:

## Before You Start

- [ ] Your code is pushed to GitHub
- [ ] You have your Supabase URL and keys ready
- [ ] Backend runs locally without errors (`npm run dev`)
- [ ] Frontend runs locally without errors (`npm run dev`)

---

## Deploy Backend to Render

1. [ ] Go to https://render.com and sign up with GitHub
2. [ ] Click "New +" → "Web Service"
3. [ ] Connect your GitHub repository
4. [ ] Settings:
   - [ ] Root Directory: `backend`
   - [ ] Build Command: `npm install`
   - [ ] Start Command: `npm start`
5. [ ] Add environment variables:
   - [ ] `SUPABASE_URL`
   - [ ] `SUPABASE_ANON_KEY`
   - [ ] `SUPABASE_SERVICE_ROLE_KEY`
   - [ ] `JWT_SECRET`
   - [ ] `NODE_ENV` = `production`
6. [ ] Click "Create Web Service"
7. [ ] **Save your backend URL!** (Example: `https://suburb-events-backend.onrender.com`)

---

## Deploy Frontend to Vercel

1. [ ] Go to https://vercel.com and sign up with GitHub
2. [ ] Click "Add New" → "Project"
3. [ ] Import your repository
4. [ ] Settings:
   - [ ] Root Directory: `frontend`
   - [ ] Framework: Next.js (auto-detected)
5. [ ] Add environment variable:
   - [ ] `NEXT_PUBLIC_API_URL` = `https://YOUR-BACKEND-URL.onrender.com/api`
6. [ ] Click "Deploy"
7. [ ] **Save your frontend URL!**

---

## Test Your Live App

1. [ ] Open your Vercel URL in a browser
2. [ ] See the styled onboarding screen
3. [ ] Click through the flow
4. [ ] Try signing up (if it works, you're done!)

---

## Common Issues

### "Cannot connect to server"
- ✅ Check your `NEXT_PUBLIC_API_URL` in Vercel settings
- ✅ Make sure it ends with `/api`
- ✅ Check backend is running on Render (green "Live" badge)

### Backend shows errors
- ✅ Check environment variables are set correctly (no typos!)
- ✅ Look at logs in Render dashboard
- ✅ Make sure Supabase tables are created

### Frontend looks broken
- ✅ Check build logs in Vercel
- ✅ Make sure `npm run build` works locally first

---

## 🎉 Done!

Once everything is checked off, your app is live!

