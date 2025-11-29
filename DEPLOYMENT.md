# VocalWell.ai Frontend - Deployment Guide

## 🚀 Quick Start

### Environment Variables Required

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

#### Firebase Configuration
Get these from [Firebase Console](https://console.firebase.google.com/):
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`  
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`

#### Backend API Configuration
- `NEXT_PUBLIC_API_BASE_URL` - Your backend API URL
  - Development: `http://127.0.0.1:8080`
  - Production: `https://your-backend-api.com`

#### IPFS / Pinata Configuration  
- `NEXT_PUBLIC_PINATA_JWT` - Get from [Pinata](https://app.pinata.cloud/)

#### Blockchain (Optional)
- `NEXT_PUBLIC_CONTRACT_ADDRESS` - EduChain Testnet contract address

---

## 📦 Installation & Build

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start
```

---

## 🌐 Deployment Platforms

### Vercel (Recommended)

1. **Import Repository**
   - Go to [vercel.com](https://vercel.com)
   - Import from GitHub: `auraCodesKM/VocalF`

2. **Configure Environment Variables**
   - Add all variables from `.env.example`
   - Set `NEXT_PUBLIC_API_BASE_URL` to your production backend

3. **Deploy**
   - Vercel will automatically build and deploy

### Other Platforms

#### Netlify
```bash
# Build command
npm run build

# Publish directory
.next
```

#### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## ⚙️ Configuration Notes

### API Base URL
The application defaults to `http://127.0.0.1:8080` for local development. 

For production, set `NEXT_PUBLIC_API_BASE_URL` to your deployed backend URL.

### Firebase
All Firebase configuration can be overridden via environment variables. The app will fall back to development values if env vars are not set (useful for local development).

### IPFS/Pinata
Required for storing voice analysis reports. Get a free JWT from Pinata dashboard.

---

## 🔒 Security

- ✅ All sensitive data moved to environment variables
- ✅ `.env.local` is gitignored
- ✅ Firebase API keys are public-safe (restricted by Firebase rules)
- ✅ Production build tested and working

---

## 📊 Build Output

Latest production build:
- **23 pages** built successfully
- **First Load JS**: ~87.7 kB (shared)
- **Largest page**: `/resource-hub` at 433 kB
- **Build time**: ~60 seconds

---

## 🧪 Testing

```bash
# Run development server
npm run dev

# Test production build locally
npm run build
npm start
```

---

## 📝 Repository

**Frontend**: https://github.com/auraCodesKM/VocalF

For issues or questions, please open a GitHub issue.
