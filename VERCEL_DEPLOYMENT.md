# Vercel Deployment Guide

## ✅ Configuration Pushed

All deployment configurations have been pushed to GitHub:
- ✅ Node.js 22.x in `package.json` engines field
- ✅ `.nvmrc` file specifying Node 22
- ✅ `vercel.json` with build configuration
- ✅ Removed `--openssl-legacy-provider` flags (not needed in Node 22)

## 🚀 Next Steps in Vercel Dashboard

### 1. Clear Build Cache & Redeploy

**Option A: Via Vercel Dashboard**
1. Go to your project in [Vercel Dashboard](https://vercel.com/dashboard)
2. Go to **Settings** → **General**
3. Scroll to **Build & Development Settings**
4. Click **"Clear Cache"** button
5. Go to **Deployments** tab
6. Click **"Redeploy"** on the latest deployment
7. Check **"Use existing Build Cache"** should be **UNCHECKED**

**Option B: Via Git (Recommended - Automatic)**
The push we just did will automatically trigger a new deployment with:
- ✅ Fresh build cache
- ✅ Node.js 22.x
- ✅ Updated dependencies

### 2. Add Environment Variable

In Vercel Dashboard → Your Project → **Settings** → **Environment Variables**:

**Add this variable:**
```
BLOB_READ_WRITE_TOKEN = vercel_blob_rw_XXXXXXXXXXXXXXXX
```

**Important:**
- Select **Production**, **Preview**, and **Development** environments
- Get the token from: [Vercel Dashboard → Storage](https://vercel.com/dashboard/stores)
- Click **"Save"** after adding

### 3. Verify Build Logs

After the deployment starts, check the build logs for:

✅ **Good Signs:**
```
Node.js 22.x detected
Installing dependencies...
npm install --legacy-peer-deps
Build completed successfully
```

❌ **Bad Signs:**
```
Error: Node.js 18.x is required
ERESOLVE dependency conflicts
Build failed
```

If you see bad signs, the cache might still be stuck.

### 4. Force Clean Deployment (If Cache Persists)

If the error still persists after redeploy:

1. **Delete the deployment:**
   - Go to **Deployments** tab
   - Find the failed deployment
   - Click **"···"** menu → **"Delete"**

2. **Trigger fresh deploy:**
   ```bash
   git commit --allow-empty -m "Force Vercel rebuild"
   git push
   ```

3. **Or use Vercel CLI:**
   ```bash
   npm i -g vercel
   vercel --prod --force
   ```

### 5. Check Vercel Project Settings

Go to **Settings** → **General** and verify:

**Framework Preset:** Next.js  
**Node.js Version:** 22.x (should be auto-detected)  
**Build Command:** `npm run build` (or leave default)  
**Install Command:** `npm install --legacy-peer-deps`  

If "Install Command" is empty, add it manually:
```bash
npm install --legacy-peer-deps
```

## 🔍 Troubleshooting

### Issue: "Node.js 18 is required" Error Persists

**Solution 1: Clear Everything**
```bash
# Delete .next folder
rm -rf .next

# Delete node_modules
rm -rf node_modules

# Delete lock files
rm -rf package-lock.json yarn.lock

# Fresh install
npm install --legacy-peer-deps
```

Then commit and push.

**Solution 2: Override in Vercel Dashboard**
1. Settings → General → Node.js Version
2. Manually select **22.x** from dropdown
3. Save and redeploy

**Solution 3: Check `.vercelignore`**
Make sure you're not ignoring critical files:
```bash
# Create .vercelignore if it doesn't exist
cat > .vercelignore << EOF
.env
.env.local
node_modules
.next
EOF
```

### Issue: Dependency Conflicts During Build

The `--legacy-peer-deps` flag in `vercel.json` should handle this, but if not:

1. Check `vercel.json` has:
   ```json
   {
     "installCommand": "npm install --legacy-peer-deps"
   }
   ```

2. Or add to `package.json` scripts:
   ```json
   "scripts": {
     "vercel-build": "npm install --legacy-peer-deps && next build"
   }
   ```

### Issue: Environment Variables Not Loading

1. Verify `BLOB_READ_WRITE_TOKEN` is added in Vercel Dashboard
2. Check it's enabled for **Production** environment
3. After adding, click **"Redeploy"** (not just save)

### Issue: Images Not Loading After Deployment

1. Check browser console for errors
2. Verify `next.config.js` image patterns are correct
3. Check Blob token is valid and has read/write permissions
4. Test Blob URL directly in browser: should load without `?token=`

## ✅ Success Checklist

After successful deployment, verify:

- [ ] Build completes without errors
- [ ] Node.js 22.x is used (check build logs)
- [ ] No dependency conflict errors
- [ ] Site loads at your Vercel URL
- [ ] Images load on homepage
- [ ] Images load on user list page (when logged in)
- [ ] Image uploads work
- [ ] No console errors in browser

## 📞 If Still Stuck

If the error persists after all these steps:

1. **Share the exact error message** from Vercel build logs
2. **Share the "Build" section** of the logs (not just the summary)
3. **Check if you have a `.vercel` folder** in your repo (might need to delete it)
4. **Try deploying from a fresh branch:**
   ```bash
   git checkout -b deploy-fix
   git push origin deploy-fix
   # Then deploy this branch in Vercel
   ```

## 🎯 Current Status

- ✅ Node.js 22.x configured in `package.json`
- ✅ `.nvmrc` file created
- ✅ `vercel.json` with proper install command
- ✅ OpenSSL legacy flags removed
- ✅ All changes pushed to GitHub

**The new deployment should automatically start with Node 22.x!**

Check your [Vercel Dashboard](https://vercel.com/dashboard) for the latest deployment status.

