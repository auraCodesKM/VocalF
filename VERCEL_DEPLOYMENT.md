# VocalWell.ai - Vercel Deployment Guide

## 🚀 Quick Deploy to Vercel

### Step 1: Import Repository to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New" → "Project"
3. Import your GitHub repository: `auraCodesKM/VocalF`
4. Vercel will auto-detect Next.js configuration

### Step 2: Configure Environment Variables

⚠️ **IMPORTANT**: You must add ALL the following environment variables in Vercel before deploying.

#### Required Environment Variables

Go to your project settings → Environment Variables and add each of these:

---

#### 🔥 Firebase Configuration

```

NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC2Zv0nHKheL4Z2zKJrEovfoFsiPjfLXK8
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=echo12.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=echo12
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=echo12.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=842877359776
NEXT_PUBLIC_FIREBASE_APP_ID=1:842877359776:web:f15571082b1a33ba195bc5
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-V7LTPKF6ZD
```

**Where to find these values:**
- Firebase Console → Project Settings → General → Your apps → Web app config

---

#### 🌐 Backend API Configuration

```
NEXT_PUBLIC_API_BASE_URL=YOUR_BACKEND_API_URL_HERE
```

**Values:**
- **Development/Testing**: `http://127.0.0.1:8080`
- **Production**: Your deployed backend URL (e.g., `https://your-backend.onrender.com` or `https://your-backend.railway.app`)

**⚠️ IMPORTANT**: Must be the FULL URL including `https://`

---

#### 📦 IPFS / Pinata Configuration

```
NEXT_PUBLIC_PINATA_JWT=your_pinata_jwt_token_here
```

**Where to get this:**
1. Go to [app.pinata.cloud](https://app.pinata.cloud/)
2. Sign up/Login
3. Go to API Keys
4. Create New Key → Select "Admin" permissions
5. Copy the JWT token

**Why needed**: To upload voice analysis reports to IPFS for decentralized storage

---

#### ⛓️ Blockchain Configuration (Optional)

```
NEXT_PUBLIC_CONTRACT_ADDRESS=0x7d115f7b72CccB0e741AB44919B376c1689e7f91
```

**Note**: This is for EduChain Testnet. Only needed if using blockchain verification features.

---

### Step 3: Deploy Settings

In Vercel project settings:

**Build Settings:**
- Framework Preset: `Next.js`
- Build Command: `npm run build` (auto-detected)
- Output Directory: `.next` (auto-detected)
- Install Command: `npm install` (auto-detected)

**Root Directory:** Leave as `.` (root)

---

### Step 4: Deploy!

Click "Deploy" and Vercel will:
1. Install dependencies
2. Build your application
3. Deploy to production
4. Give you a live URL (e.g., `your-app.vercel.app`)

---

## 📋 Complete Environment Variables Checklist

Copy this checklist when setting up:

- [ ] `NEXT_PUBLIC_FIREBASE_API_KEY`
- [ ] `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- [ ] `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- [ ] `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- [ ] `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- [ ] `NEXT_PUBLIC_FIREBASE_APP_ID`
- [ ] `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`
- [ ] `NEXT_PUBLIC_API_BASE_URL` (set to your backend URL)
- [ ] `NEXT_PUBLIC_PINATA_JWT` (get from Pinata dashboard)
- [ ] `NEXT_PUBLIC_CONTRACT_ADDRESS` (optional, for blockchain features)

---

## 🔧 Post-Deployment Steps

### 1. Update Firebase Authorized Domains

1. Go to Firebase Console → Authentication → Settings → Authorized domains
2. Add your Vercel domain: `your-app.vercel.app`
3. Add custom domain if you have one

### 2. Test Your Deployment

Visit your deployed URL and test:
- [ ] Homepage loads
- [ ] Sign up/Sign in works
- [ ] Voice analysis upload works
- [ ] Reports generate and save to IPFS

### 3. Setup Custom Domain (Optional)

1. In Vercel: Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update Firebase authorized domains

---

## 🐛 Troubleshooting

### Build Fails

**Error: Environment variables not found**
- Solution: Make sure ALL env vars are added in Vercel dashboard

**Error: Module not found**
- Solution: Run `npm install` locally, commit `package-lock.json`, push to GitHub

### Runtime Errors

**Firebase auth not working**
- Check: Firebase authorized domains include your Vercel domain
- Check: All Firebase env vars are set correctly

**Reports not uploading to IPFS**
- Check: `NEXT_PUBLIC_PINATA_JWT` is set correctly
- Check: Pinata account has sufficient storage

**Backend API not reachable**
- Check: `NEXT_PUBLIC_API_BASE_URL` points to deployed backend
- Check: Backend has CORS enabled for your Vercel domain

---

## 📊 Expected Build Output

Successful build will show:
```
✓ Compiled successfully
✓ Collecting page data
✓ Generating static pages (23/23)
✓ Finalizing page optimization
```

Build time: ~60-90 seconds
Total bundle size: ~500KB (First Load JS)

---

## 🔐 Security Notes

- ✅ All sensitive data is in environment variables
- ✅ `.env.local` is gitignored (not deployed)
- ✅ Firebase API keys are public-safe (protected by Firebase rules)
- ✅ Backend API should have CORS configured properly

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Firebase Web Setup](https://firebase.google.com/docs/web/setup)
- [Pinata Documentation](https://docs.pinata.cloud/)

---

## 💡 Pro Tips

1. **Use Production Environment**: Set all env vars to "Production" environment in Vercel
2. **Preview Deployments**: Vercel creates preview URLs for each git push
3. **Automatic Deploys**: Every push to `main` branch auto-deploys
4. **Custom Build Command**: If needed, you can customize in Vercel settings
5. **Analytics**: Enable Vercel Analytics for user insights

---

**Need Help?** Check the [GitHub Repository](https://github.com/auraCodesKM/VocalF) for issues and discussions.
