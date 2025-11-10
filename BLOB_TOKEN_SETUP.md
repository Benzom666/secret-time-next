# Vercel Blob Token Setup Guide

## 🚨 Current Status
The app will now **deploy successfully** even without the Blob token. Uploads will be disabled until you add the token, but the site will work for viewing existing data.

## 📋 Step-by-Step Token Setup

### Step 1: Create Vercel Blob Store

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on **"Storage"** in the top navigation
3. Click **"Create Database"** or **"Create Store"**
4. Select **"Blob"**
5. Give it a name (e.g., `secret-time-blob`)
6. Click **"Create"**

### Step 2: Get Your Token

After creating the Blob store:

1. You'll see a screen with connection details
2. Look for **"BLOB_READ_WRITE_TOKEN"**
3. Click **"Copy"** or **"Show Token"**
4. It should look like: `vercel_blob_rw_XXXXXXXXXXXXXXXXXXXXXXXXX`

**Important:** This token starts with `vercel_blob_rw_` followed by a long string.

### Step 3: Add Token to Your Project

**Method 1: Via Vercel Dashboard (Recommended)**

1. Go to your project (e.g., `secret-time-next`)
2. Click **"Settings"** tab
3. Click **"Environment Variables"** in the sidebar
4. Click **"Add New"** button
5. Fill in:
   - **Key:** `BLOB_READ_WRITE_TOKEN`
   - **Value:** `vercel_blob_rw_XXXXXXXXXXXXXXXXXXXXXXXXX` (paste your actual token)
   - **Environments:** Check ALL three boxes:
     - ✅ Production
     - ✅ Preview
     - ✅ Development
6. Click **"Save"**
7. **IMPORTANT:** After saving, you MUST redeploy for the change to take effect

**Method 2: Via Vercel CLI**

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Add environment variable
vercel env add BLOB_READ_WRITE_TOKEN
# Paste your token when prompted
# Select: Production, Preview, Development (all three)
```

### Step 4: Redeploy Your Application

After adding the environment variable:

**Option A: Via Dashboard**
1. Go to **"Deployments"** tab
2. Find the latest deployment
3. Click **"···"** (three dots menu)
4. Click **"Redeploy"**
5. **IMPORTANT:** Make sure to click **"Redeploy"** button in the confirmation dialog

**Option B: Via Git Push**
```bash
git commit --allow-empty -m "Trigger redeploy with Blob token"
git push
```

**Option C: Via Vercel CLI**
```bash
vercel --prod
```

### Step 5: Verify Token is Working

After redeployment:

1. Check the deployment logs for:
   ```
   ✓ Environment variables loaded
   ```

2. Visit your deployed site

3. Try uploading an image:
   - If successful: You'll see the image uploaded to Blob
   - If failed: Check browser console for errors

4. Check Vercel logs for:
   ```
   [Blob Upload] Successfully uploaded: https://...
   ```

## 🔍 Troubleshooting

### Issue: Token Not Found Error

**Symptom:**
```
warning: Blob storage not configured
```

**Solutions:**

1. **Check token name is EXACTLY:**
   ```
   BLOB_READ_WRITE_TOKEN
   ```
   (Not `BLOB_TOKEN`, not `VERCEL_BLOB_TOKEN`, exactly `BLOB_READ_WRITE_TOKEN`)

2. **Check token value format:**
   - Must start with `vercel_blob_rw_`
   - No spaces before/after
   - No quotes around the value
   - Full token copied (not truncated)

3. **Check environments selected:**
   - All three boxes must be checked (Production, Preview, Development)

4. **Redeploy after adding:**
   - Environment variables only take effect after redeployment
   - Simply saving is NOT enough

### Issue: "Invalid Token" Error

**Symptom:**
```
Blob upload failed: Invalid token
```

**Solutions:**

1. **Regenerate token:**
   - Vercel Dashboard → Storage → Your Blob Store
   - Click on the store
   - Look for **"Regenerate Token"** or **"Create Token"**
   - Copy the NEW token
   - Update environment variable with new token
   - Redeploy

2. **Check token permissions:**
   - Token must have READ and WRITE permissions
   - Make sure you copied `BLOB_READ_WRITE_TOKEN` (not just read-only)

### Issue: "Blob Store Not Found"

**Symptom:**
```
Error: Blob store not found
```

**Solutions:**

1. **Link Blob store to project:**
   - Vercel Dashboard → Storage → Your Blob Store
   - Click **"Connect to Project"**
   - Select your project (`secret-time-next`)
   - Click **"Connect"**

2. **Verify connection:**
   - Go to your project settings
   - Look for **"Storage"** or **"Connected Stores"**
   - Your Blob store should be listed there

### Issue: Deployment Loop/Build Fails

**Current Fix:** The app now deploys WITHOUT the token. You can:

1. Let it deploy successfully first
2. Then add the token via dashboard
3. Then redeploy

**This breaks the loop!**

## 🎯 Expected Behavior

### Before Token is Added:
- ✅ Site deploys successfully
- ✅ Existing images from S3/CDN load fine
- ⚠️ New uploads return: "Blob storage not configured"
- ⚠️ Browser console shows warning about missing token

### After Token is Added:
- ✅ Site deploys successfully
- ✅ Existing images from S3/CDN load fine
- ✅ New uploads go to Vercel Blob
- ✅ Console shows: `[Blob Upload] Successfully uploaded: https://...`

## 📝 Environment Variable Checklist

Copy this into Vercel Dashboard → Settings → Environment Variables:

```
Variable Name: BLOB_READ_WRITE_TOKEN
Variable Value: vercel_blob_rw_XXXXXXXXXXXXXXXXXXXXXXXXX
Environments: ✅ Production ✅ Preview ✅ Development
```

**Double-check:**
- [ ] Variable name is EXACTLY `BLOB_READ_WRITE_TOKEN`
- [ ] Value starts with `vercel_blob_rw_`
- [ ] All 3 environment checkboxes are selected
- [ ] Clicked "Save" button
- [ ] Triggered a redeploy after saving

## 🆘 Still Stuck?

If you've followed all steps and it still doesn't work:

1. **Share these details:**
   - Exact error message from Vercel deployment logs
   - Screenshot of your Environment Variables page
   - Screenshot of your Blob store connection page
   - First 20 characters of your token (e.g., `vercel_blob_rw_ABC1...`)

2. **Try this temporary workaround:**
   - Add the token to your local `.env.local` file
   - Test locally with `npm run dev`
   - If it works locally, the token is valid
   - Issue is with Vercel configuration

3. **Nuclear option (last resort):**
   ```bash
   # Delete and recreate Blob store
   # Vercel Dashboard → Storage → Your Store → Settings → Delete
   
   # Create new Blob store
   # Get new token
   # Add to project
   # Redeploy
   ```

## ✅ Success Verification

After setup, visit your deployed site and:

1. Open browser console (F12)
2. Try uploading an image
3. You should see:
   ```
   [Blob Upload] Successfully uploaded: https://xxx.blob.vercel-storage.com/uploads/...
   ```
4. The image should appear immediately
5. The URL should be publicly accessible (open in new tab - no login required)

**If you see this, Blob is working! 🎉**

