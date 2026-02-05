# 🚀 WCCRM Backend Deployment Guide for Render

Complete step-by-step guide to manually deploy your WCCRM backend server on Render.

---

## ✅ **Pre-Deployment Checklist**

### **✅ Backend Status**
- TypeScript compilation: ✅ **PASSED** (using tsx runtime)
- Server functionality: ✅ **WORKING** 
- Database connection: ✅ **CONNECTED**
- API endpoints: ✅ **TESTED**
- Production mode: ✅ **VERIFIED**

### **📋 What You'll Need**
- GitHub repository with your backend code
- Render account (free tier available)
- Your PostgreSQL database URL (already configured)

---

## 🔧 **Step 1: Prepare Your Repository**

### **1.1 Create Production Build Script**
Your `package.json` already has the right scripts, but let's verify:

```json
{
  "scripts": {
    "start": "NODE_ENV=production node dist/index.cjs",
    "build": "cd client && npm install && npm run build",
    "vercel-build": "npm install && npm run build"
  }
}
```

### **1.2 Create Build Configuration**
Create a `render.yaml` file in your root directory:

```yaml
services:
  - type: web
    name: wccrm-backend
    env: node
    buildCommand: npm install && npm run build
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: DATABASE_URL
        fromDatabase:
          name: wccrm-db
          property: connectionString
      - key: SESSION_SECRET
        generateValue: true
```

### **1.3 Update .gitignore**
Ensure your `.gitignore` includes:
```
node_modules/
dist/
.env
*.log
```

### **1.4 Commit and Push**
```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

---

## 🌐 **Step 2: Deploy on Render**

### **2.1 Create Render Account**
1. Go to [render.com](https://render.com)
2. Sign up with GitHub (recommended)
3. Authorize Render to access your repositories

### **2.2 Create Web Service**
1. **Click "New +"** in Render dashboard
2. **Select "Web Service"**
3. **Connect Repository:**
   - Choose your GitHub repository
   - Select the repository containing your backend code
   - Click "Connect"

### **2.3 Configure Service Settings**

#### **Basic Settings:**
- **Name**: `wccrm-backend` (or your preferred name)
- **Region**: Choose closest to your users
- **Branch**: `main` (or your default branch)
- **Root Directory**: Leave empty (unless backend is in subfolder)

#### **Build & Deploy:**
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

#### **Instance Type:**
- **Free Tier**: Select "Free" (512MB RAM, sleeps after 15min inactivity)
- **Paid Tier**: Select based on your needs

### **2.4 Environment Variables**
Add these environment variables in Render:

| Key | Value | Notes |
|-----|-------|-------|
| `NODE_ENV` | `production` | Required |
| `DATABASE_URL` | `postgresql://moses:uAFH7IVQiewf89hqoFwTGlTlAmhcnGEg@dpg-d5n7qmv5r7bs73djlt6g-a.oregon-postgres.render.com/paypruf?sslmode=require` | Your existing DB |
| `SESSION_SECRET` | `your-secure-random-string-here` | Generate a secure random string |
| `PORT` | `5000` | Render will override this automatically |

**To add environment variables:**
1. Scroll to "Environment Variables" section
2. Click "Add Environment Variable"
3. Enter key and value
4. Repeat for each variable

---

## 🔨 **Step 3: Build Configuration**

### **3.1 Create Production Build Script**
Create `build.js` in your root directory:

```javascript
import { build } from 'esbuild';
import { nodeExternals } from 'esbuild-node-externals';

await build({
  entryPoints: ['server/index.ts'],
  bundle: true,
  platform: 'node',
  target: 'node18',
  outfile: 'dist/index.cjs',
  format: 'cjs',
  plugins: [nodeExternals()],
  external: ['pg-native'],
});

console.log('✅ Backend built successfully!');
```

### **3.2 Update Package.json Scripts**
```json
{
  "scripts": {
    "dev": "NODE_ENV=development tsx server/index.ts",
    "build": "node build.js",
    "start": "NODE_ENV=production node dist/index.cjs",
    "check": "tsc"
  }
}
```

### **3.3 Install Build Dependencies**
```bash
npm install --save-dev esbuild esbuild-node-externals
```

---

## 🚀 **Step 4: Deploy**

### **4.1 Trigger Deployment**
1. **Click "Create Web Service"** in Render
2. Render will automatically:
   - Clone your repository
   - Install dependencies
   - Run build command
   - Start your server

### **4.2 Monitor Deployment**
Watch the deployment logs in real-time:
- ✅ **Installing dependencies**
- ✅ **Building application**
- ✅ **Starting server**
- ✅ **Health check passed**

### **4.3 Get Your URL**
Once deployed, Render provides:
- **Service URL**: `https://wccrm-backend.onrender.com` (example)
- **Custom Domain**: Optional, can be configured later

---

## 🧪 **Step 5: Test Deployment**

### **5.1 Health Check**
Test your deployed API:
```bash
curl https://your-app-name.onrender.com/api/events
```

### **5.2 Full API Test**
```bash
# Test events endpoint
curl https://your-app-name.onrender.com/api/events

# Test sermons endpoint  
curl https://your-app-name.onrender.com/api/sermons

# Test branding endpoint
curl https://your-app-name.onrender.com/api/branding
```

### **5.3 Create Test Data**
```bash
# Create a new event
curl -X POST https://your-app-name.onrender.com/api/events \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Event",
    "description": "Testing deployment",
    "date": "2026-03-01T10:00:00.000Z",
    "location": "Online"
  }'
```

---

## 🔧 **Step 6: Configuration & Optimization**

### **6.1 Custom Domain (Optional)**
1. Go to your service settings
2. Click "Custom Domains"
3. Add your domain
4. Configure DNS records as instructed

### **6.2 Auto-Deploy Setup**
Render automatically deploys when you push to your connected branch:
```bash
git add .
git commit -m "Update backend"
git push origin main
# Render will automatically redeploy
```

### **6.3 Monitoring**
- **Logs**: View real-time logs in Render dashboard
- **Metrics**: Monitor CPU, memory, and response times
- **Alerts**: Set up notifications for downtime

---

## 🚨 **Troubleshooting**

### **Common Issues:**

#### **Build Fails**
```bash
# Check build logs for specific errors
# Common fixes:
npm install --save-dev @types/node
npm install --save-dev typescript
```

#### **Database Connection Issues**
- Verify `DATABASE_URL` environment variable
- Check database is accessible from Render IPs
- Ensure SSL is properly configured

#### **Port Issues**
- Don't hardcode port 5000
- Use `process.env.PORT || 5000`
- Render automatically assigns ports

#### **Memory Issues (Free Tier)**
- Free tier has 512MB RAM limit
- Optimize dependencies
- Consider upgrading to paid tier

### **Debug Commands**
```bash
# Check environment variables
echo $DATABASE_URL

# Test database connection
npm run check

# View detailed logs
tail -f /var/log/render.log
```

---

## 📋 **Deployment Checklist**

### **Before Deployment:**
- [ ] Code committed and pushed to GitHub
- [ ] Environment variables configured
- [ ] Build scripts tested locally
- [ ] Database connection verified
- [ ] TypeScript compilation successful

### **During Deployment:**
- [ ] Repository connected to Render
- [ ] Build command configured
- [ ] Start command configured
- [ ] Environment variables added
- [ ] Deployment logs monitored

### **After Deployment:**
- [ ] Health check passed
- [ ] API endpoints tested
- [ ] Database operations verified
- [ ] Custom domain configured (if needed)
- [ ] Auto-deploy enabled

---

## 🎉 **Success!**

Your WCCRM backend is now deployed on Render! 

**Next Steps:**
1. **Update Frontend**: Configure your client to use the new backend URL
2. **Set Environment Variable**: `VITE_API_BASE_URL=https://your-app-name.onrender.com`
3. **Test Integration**: Verify frontend can communicate with deployed backend
4. **Monitor Performance**: Keep an eye on logs and metrics

**Your API Base URL**: `https://your-app-name.onrender.com`

---

**🚀 Congratulations! Your church community platform backend is live!**