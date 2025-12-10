# 📦 GitHub Setup Guide

Follow these simple steps to get your code on GitHub.

---

## Step 1: Create GitHub Account (if you don't have one)

1. Go to **https://github.com**
2. Click **"Sign up"**
3. Create your account

---

## Step 2: Create New Repository on GitHub

1. Click the **"+"** icon (top right corner)
2. Select **"New repository"**
3. Fill in:
   - **Repository name**: `suburb-events`
   - **Description**: "Suburb Events MVP"
   - **Visibility**: Public or Private (your choice)
   - ⚠️ **IMPORTANT**: DON'T check any boxes (no README, no .gitignore, nothing!)
4. Click **"Create repository"**
5. **DON'T CLOSE THIS PAGE!** You'll need it in Step 4

---

## Step 3: Open Terminal in Your Project

1. Open **Terminal** app on your Mac
2. Type this and press Enter:
   ```bash
   cd "/Users/akhildurvasula/Downloads/Startup Idea"
   ```

---

## Step 4: Run These Commands (Copy & Paste)

Copy and paste each command one at a time, pressing Enter after each:

### Initialize Git:
```bash
git init
```

### Add all your files:
```bash
git add .
```

### Create your first commit:
```bash
git commit -m "Initial commit - Suburb Events MVP"
```

### Connect to GitHub:
⚠️ **REPLACE `YOUR-USERNAME`** with your actual GitHub username!

```bash
git remote add origin https://github.com/YOUR-USERNAME/suburb-events.git
```

Example: If your GitHub username is `johndoe`, use:
```bash
git remote add origin https://github.com/johndoe/suburb-events.git
```

### Change to main branch:
```bash
git branch -M main
```

### Push to GitHub:
```bash
git push -u origin main
```

⚠️ **You'll be asked for:**
- **Username**: Your GitHub username
- **Password**: Your GitHub **Personal Access Token** (NOT your password!)

---

## Step 5: Create Personal Access Token (for password)

If you don't have a token yet:

1. Go to **https://github.com/settings/tokens**
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. Give it a name: `suburb-events-deploy`
4. Check these boxes:
   - ✅ `repo` (all repo permissions)
   - ✅ `workflow`
5. Click **"Generate token"** (bottom of page)
6. **COPY THE TOKEN!** You can't see it again!
7. Use this token as your "password" when pushing

---

## ✅ Verify It Worked

1. Refresh your GitHub repository page
2. You should see all your files!
3. You'll see folders like `backend`, `frontend`, etc.

---

## 🎉 Done!

Now you can proceed with deployment:
- Your code is on GitHub ✅
- Ready for Render & Vercel ✅

**Next**: Open `DEPLOYMENT_GUIDE.md` and follow the deployment steps!

---

## 🆘 Troubleshooting

### "git: command not found"
- Install Git: https://git-scm.com/download/mac
- Or install Xcode Command Line Tools: `xcode-select --install`

### "Permission denied"
- Make sure you're using your Personal Access Token, not your password
- Create a new token if needed (Step 5 above)

### "Already exists"
- If you see "already exists", that's OK! Your git is already initialized
- Skip to the `git add .` command

---

## 🔄 Future Updates

After you've set this up once, updating your code is simple:

```bash
git add .
git commit -m "Your update message"
git push
```

That's it! Render and Vercel will auto-deploy your changes.

