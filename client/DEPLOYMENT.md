# Client Deployment Guide

## Vercel Deployment

### Build Configuration
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Environment Variables
Add these environment variables in your Vercel project settings:

```
VITE_API_BASE_URL=https://your-backend-api-url.com
```

Replace `https://your-backend-api-url.com` with your actual backend API URL.

### Deployment Steps

1. **Push to GitHub**: Make sure your client folder is in a GitHub repository

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Set the root directory to `client` (if deploying just the client folder)

3. **Configure Build Settings**:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **Add Environment Variables**:
   - Go to Project Settings → Environment Variables
   - Add `VITE_API_BASE_URL` with your backend URL

5. **Deploy**: Click "Deploy" and Vercel will build and deploy your application

### Notes
- The client is now completely independent of the shared folder
- All API routes are configured in `src/lib/api-routes.ts`
- The API base URL is configurable via environment variables
- TypeScript compilation and build process are working correctly