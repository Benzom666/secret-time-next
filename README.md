## Secret-Time Next

- Next.js 11 front-end for the Secret-Time platform.
- Media uploads now use Vercel Blob via the internal `/api/upload` route (see setup below).

## Getting Started

1. Install dependencies  
   `npm install --legacy-peer-deps`
2. Copy `env.example` to `.env.local` (or your preferred env file) and fill in values.
3. Run the dev server  
   `npm run dev`

## Environment Variables

| Variable | Description | Required |
| --- | --- | --- |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob token with read/write access. Get from [Vercel Dashboard → Storage](https://vercel.com/dashboard/stores). | **Yes** |
| `NEXT_PUBLIC_IMAGE_DOMAINS` | Optional comma-separated list of additional image domains (e.g. `cdn.example.com,legacy.s3.amazonaws.com`). | No |

### Getting Your Blob Token

1. Go to [Vercel Dashboard → Storage](https://vercel.com/dashboard/stores)
2. Create a new Blob store (or use existing)
3. Copy the `BLOB_READ_WRITE_TOKEN` value
4. Add to `.env.local`:
   ```bash
   BLOB_READ_WRITE_TOKEN=vercel_blob_rw_XXXXXXXXXXXXXXXX
   ```

## Vercel Blob Upload Configuration

### Upload Settings
All uploads are configured with:
- ✅ `access: "public"` - Files are publicly accessible without tokens
- ✅ `addRandomSuffix: false` - Preserves original filenames
- ✅ Automatic content-type detection

### Image Optimization
`next.config.js` is configured to allow images from:
- ✅ `*.public.blob.vercel-storage.com` (Vercel Blob)
- ✅ Legacy S3/CloudFront domains (for migration period)
- ✅ Any domains in `NEXT_PUBLIC_IMAGE_DOMAINS`

### File Upload Flow

1. **Client Upload**: Components use `imageUploader()` or `imageUploaderNew()` from `utils/Utilities.js`
2. **API Route**: `/api/upload` receives files and streams to Vercel Blob
3. **Public URLs**: Returns public Blob URLs (e.g. `https://<project>.public.blob.vercel-storage.com/uploads/...`)
4. **Automatic Rewriting**: Legacy S3/CloudFront URLs are automatically rewritten to Blob URLs in:
   - API responses (`apiRequest`, `apiRequestChatHistory`)
   - Socket.IO events (via `attachBlobUrlTransformerToSocket`)
   - Redux state (via `normalizeMediaUrls` in `authReducer`)
   - Image components (via `replaceS3WithBlobUrl` in `ImageShow`)

### Migration from S3

During migration, the app supports both Blob and legacy S3/CloudFront URLs:
1. **New uploads** → Go directly to Vercel Blob
2. **Existing S3 URLs** → Automatically generate fallback candidates
3. **Image loading** → Tries Blob first, falls back to S3/CloudFront if needed

Once all media is migrated to Blob, remove the legacy S3 domains from `next.config.js`.