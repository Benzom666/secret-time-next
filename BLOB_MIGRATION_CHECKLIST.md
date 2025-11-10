# Vercel Blob Migration - Complete Setup Checklist

## ✅ Completed Configuration

### 1. Upload API Route (`pages/api/upload.js`)
- ✅ Configured with `access: "public"` for publicly accessible URLs
- ✅ Added `addRandomSuffix: false` to preserve filenames
- ✅ Added `contentType` detection for proper MIME types
- ✅ Added console logging for successful uploads

### 2. Next.js Image Configuration (`next.config.js`)
- ✅ Migrated from `domains` to `remotePatterns` (Next.js best practice)
- ✅ Added `*.public.blob.vercel-storage.com` wildcard pattern
- ✅ Added `public.blob.vercel-storage.com` root domain
- ✅ Kept legacy S3/CloudFront patterns for migration period
- ✅ Added placeholder image domain (`i.ibb.co`)

### 3. Socket.IO 404 Noise Reduction
- ✅ Added conditional socket initialization in `pages/_app.js`
- ✅ Added conditional socket initialization in `pages/user/user-list.js`
- ✅ Added null checks in `pages/messages.js`
- ✅ Added null checks in `pages/messages/[chatRoomId].js`
- ✅ Added conditional socket initialization in `components/useSocketHook.js`
- ✅ Added reconnection limits (5 attempts instead of infinite)

### 4. Image Loading with Fallbacks (`modules/ImageShow.js`)
- ✅ Generates multiple URL candidates (Blob + legacy S3/CloudFront)
- ✅ Tries each candidate sequentially on error
- ✅ Falls back to placeholder if all fail
- ✅ Added detailed console logging for debugging

### 5. URL Transformation Utilities (`utils/Utilities.js`)
- ✅ `generateMediaUrlCandidates()` - Creates fallback URL list
- ✅ `replaceS3WithBlobUrl()` - Rewrites S3/CloudFront to Blob
- ✅ `normalizeMediaUrls()` - Recursively transforms nested objects
- ✅ `prepareRequestPayload()` - Transforms outgoing requests
- ✅ `transformAxiosResponse()` - Transforms incoming responses
- ✅ `attachBlobUrlTransformerToSocket()` - Wraps Socket.IO instances

### 6. Documentation
- ✅ Updated `README.md` with comprehensive Blob setup guide
- ✅ Added environment variable documentation
- ✅ Added migration strategy explanation
- ✅ Added upload flow documentation

---

## 🔧 Required Actions (You Must Do These)

### Step 1: Verify Environment Variables
Check your `.env.local` file contains:

```bash
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_XXXXXXXXXXXXXXXX
```

**How to get your token:**
1. Go to https://vercel.com/dashboard/stores
2. Create a Blob store or select existing one
3. Copy the `BLOB_READ_WRITE_TOKEN`
4. Paste into `.env.local`

### Step 2: Test Upload with Public Access
1. Open the app at `http://localhost:3000`
2. Upload a new profile image or any media
3. Check the browser console for: `[Blob Upload] Successfully uploaded: https://...`
4. **Copy that URL** and paste it directly in your browser
5. **Verify the image loads WITHOUT a `?token=` parameter**

✅ **If it loads** → Your uploads are public ✓  
❌ **If you see `?token=` or 403** → Re-upload with the updated `pages/api/upload.js`

### Step 3: Check Image Loading
1. Log in to the app
2. Navigate to `/user/user-list`
3. Open browser console (F12 → Console)
4. Look for these logs:
   ```
   [ImageShow] Generated candidates for: <url> => [array of URLs]
   [ImageShow] Failed to load image (attempt X/Y): <url>
   [ImageShow] Trying fallback candidate X: <url>
   ```
5. **Share the console output** if images still don't load

### Step 4: Migrate Existing S3 Data to Blob

**Option A: Manual Migration (Small datasets)**
1. Download all files from S3
2. Re-upload through the app's upload interface
3. Update database records with new Blob URLs

**Option B: Script Migration (Large datasets)**
Create a migration script that:
```javascript
// Pseudo-code
for each record in database:
  1. Download file from S3 URL
  2. Upload to Blob via `/api/upload`
  3. Update database record with new Blob URL
```

### Step 5: Verify Image Domains
After uploading to Blob, check the URL format:
- ✅ Should look like: `https://<project>.public.blob.vercel-storage.com/uploads/...`
- ✅ Should NOT have `?token=` parameter
- ✅ Should load in browser without authentication

If the hostname is different, add it to `next.config.js`:
```javascript
{
  protocol: "https",
  hostname: "your-actual-blob-hostname.com",
}
```

---

## 🐛 Debugging Guide

### Images Not Loading on User List

**Check 1: Console Logs**
Open browser console and look for:
```
[ImageShow] Generated candidates for: <url> => [...]
```
This shows what URLs are being tried.

**Check 2: Network Tab**
1. Open DevTools → Network tab
2. Filter by "Img"
3. Look for failed requests (red)
4. Check the URL and status code

**Common Issues:**
- **404**: File doesn't exist at that URL
- **403**: File is private or domain not allowed
- **CORS**: Domain not in `next.config.js`

### Socket.IO 404 Errors

If you still see socket errors:
1. Check that `socketURL` in `utils/Utilities.js` is valid
2. Or set it to empty string to disable: `export const socketURL = "";`

### Build Errors

If `npm run build` fails:
1. Ensure Node.js 18.x is installed (not 22.x)
2. Or keep using `NODE_OPTIONS=--openssl-legacy-provider npm run dev`

---

## 📋 Testing Checklist

Before marking migration complete, test:

- [ ] New image uploads return public Blob URLs
- [ ] Uploaded images load in browser without `?token=`
- [ ] Homepage shows all images correctly
- [ ] User list page shows profile images when logged in
- [ ] Messages page shows user avatars
- [ ] Image upload components work (profile, messages, etc.)
- [ ] No socket.io 404 spam in console
- [ ] No CORS errors in console
- [ ] No 403 errors on images

---

## 🎯 Next Steps After Migration

Once ALL media is migrated to Blob:

1. **Remove legacy S3 domains** from `next.config.js`:
   ```javascript
   // Remove these patterns:
   // { protocol: "https", hostname: "secrettime-cdn.s3.eu-west-2.amazonaws.com" },
   // { protocol: "https", hostname: "*.s3.*.amazonaws.com" },
   // { protocol: "https", hostname: "d2hill0ae3zx76.cloudfront.net" },
   ```

2. **Simplify `utils/Utilities.js`**:
   - Remove `generateMediaUrlCandidates()` (no longer needed)
   - Remove `replaceS3WithBlobUrl()` (no longer needed)
   - Keep `normalizeMediaUrls()` for general URL handling

3. **Update `modules/ImageShow.js`**:
   - Remove fallback candidate logic
   - Use direct `src` prop

4. **Decommission S3 bucket** (optional):
   - Verify no requests to S3 in production logs
   - Archive S3 bucket
   - Remove AWS credentials

---

## 📞 Support

If images still don't load after following this checklist:

1. **Share the browser console output** (especially `[ImageShow]` logs)
2. **Share a sample Blob URL** from a recent upload
3. **Share the Network tab** showing failed image requests
4. **Confirm your `BLOB_READ_WRITE_TOKEN` is set** in `.env.local`

The detailed logging added to `ImageShow.js` will help diagnose the exact issue.

