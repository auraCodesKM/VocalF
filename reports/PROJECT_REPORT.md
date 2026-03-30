# VocalWell.ai — Frontend Project Report

**Project:** VocalWell.ai Frontend (VocalF)
**Repository:** [auraCodesKM/VocalF](https://github.com/auraCodesKM/VocalF)
**Stack:** Next.js 14, TypeScript, Tailwind CSS, Supabase, Ethers.js
**Deployment:** Vercel — https://vocalwell.vercel.app
**Report Date:** March 2025

---

## 1. Project Summary

VocalWell.ai is a voice health SaaS platform that allows users to record or upload voice audio, receive AI-driven pathology analysis, track vocal exercise progress, and store tamper-proof clinical reports on IPFS with EduChain blockchain verification.

The frontend is a Next.js 14 App Router application with 23 routes, 60+ UI components, and integrations across Supabase (auth/storage), a Python/Flask ML backend, Pinata IPFS, and a custom EduChain smart contract.

---

## 2. Build Output Summary

| Metric | Value |
|---|---|
| Total pages | 23 |
| First Load JS (shared) | ~87.7 kB |
| Largest page | `/resource-hub` (433 kB) |
| Build time | ~60 seconds |
| Deployment platform | Vercel |

**Build configuration:**
- ESLint errors ignored during build (`ignoreDuringBuilds: true`)
- TypeScript errors ignored during build (`ignoreBuildErrors: true`)
- Images served unoptimized (disabled Next.js image optimization)
- Experimental features: `serverComponentsExternalPackages`

---

## 3. Pages and Routes

### Public Pages (no auth required)

| Route | Component | Description |
|---|---|---|
| `/` | `app/page.tsx` | Homepage with hero video, feature carousel, testimonials |
| `/signin` | `app/signin/` | Google OAuth sign-in |
| `/signup` | `app/signup/` | Google OAuth sign-up |
| `/features` | `app/features/` | Full features overview |
| `/terms` | `app/terms/` | Terms of service |
| `/auth/callback` | `app/auth/callback/` | OAuth redirect handler |
| `/auth-callback` | `app/auth-callback/` | Alternative OAuth callback |
| `/forgot-password` | `app/forgot-password/` | Password reset flow |

### Protected Pages (require Google OAuth session)

| Route | Component | Description |
|---|---|---|
| `/analysis` | `app/analysis/` | Voice recording/upload + real-time analysis |
| `/dashboard` | `app/dashboard/` | Stats, charts, history, exercise summary |
| `/dashboard/exercises` | `app/dashboard/exercises/` | 8 guided exercises with streak tracking |
| `/dashboard/doctor-connect` | `app/dashboard/doctor-connect/` | Leaflet map + specialist finder |
| `/dashboard/ai-chatbot` | `app/dashboard/ai-chatbot/` | AI assistant with history |
| `/dashboard/recommendations` | `app/dashboard/recommendations/` | Personalized vocal health advice |
| `/profile` | `app/profile/` | Account management, password reset, sign out |
| `/profile/reports` | `app/profile/reports/` | Full analysis history and report downloads |
| `/resource-hub` | `app/resource-hub/` | Blockchain-based resource marketplace |
| `/report-verification` | `app/report-verification/` | On-chain IPFS report verification |

---

## 4. Component Library

The `components/ui/` directory contains 60+ reusable components built on Radix UI primitives with Tailwind CSS styling.

**Categories:**

| Category | Components |
|---|---|
| Form controls | `input`, `button`, `label`, `textarea`, `checkbox`, `radio-group`, `switch`, `select`, `slider` |
| Modals & Overlays | `dialog`, `alert-dialog`, `drawer`, `sheet`, `popover`, `hover-card`, `tooltip` |
| Navigation | `sidebar`, `breadcrumb`, `navigation-menu`, `menubar`, `tabs` |
| Data display | `table`, `card`, `accordion`, `badge`, `separator`, `progress` |
| Visual effects | `background-beams`, `flickering-grid`, `pixel-image`, `hover-border-gradient`, `smooth-cursor`, `sticky-banner` |
| Charts | `chart` (Recharts wrapper) |
| Feedback | `toast`, `sonner`, `skeleton` |
| Layout | `resizable`, `scroll-area`, `aspect-ratio`, `collapsible` |
| Input | `input-otp`, `calendar`, `date-picker` |
| Carousel | `carousel` (Embla) |
| Command | `command` (cmdk) |
| Context menu | `context-menu`, `dropdown-menu` |

---

## 5. External Integrations

### Supabase
- **Auth:** Google OAuth with `@supabase/auth-helpers-nextjs` SSR support
- **Database:** PostgreSQL (user records, analysis history)
- **Storage:** File storage for analysis artifacts
- **Session:** Cookie-based with `@supabase/ssr`

### Flask Backend (vocalB)
- **Endpoint:** `POST /analyze` — submits WAV audio, receives prediction + report
- **Endpoint:** `GET /report/<path>` — downloads/views clinical PDF
- **Endpoint:** `GET /plot/<path>` — retrieves confidence chart PNG
- **Endpoint:** `GET /health` — health check

### EduChain Blockchain
- **Contract:** `0x7d115f7b72CccB0e741AB44919B376c1689e7f91`
- **Network:** EduChain Testnet
- **Library:** Ethers.js v6.13.5
- **Wallet:** MetaMask browser extension
- **Use:** Store SHA-256 report hash on-chain; verify report integrity

### Pinata (IPFS)
- **Use:** Upload clinical PDF reports to decentralized IPFS storage
- **Auth:** JWT-based API authentication (`NEXT_PUBLIC_PINATA_JWT`)
- **Output:** IPFS CID stored with on-chain reference

### Leaflet Maps
- **Library:** Leaflet 1.9.4 + React Leaflet 4.2.1
- **Use:** Doctor connect page — geographic display of vocal health specialists
- **Note:** Dynamic import required (SSR incompatible)

---

## 6. State Management

The application uses React Context for global state:

| Context | File | Purpose |
|---|---|---|
| `AuthContext` | `lib/contexts/AuthContext.tsx` | User session, sign in/out, auth state |
| `ExercisesContext` | `lib/contexts/ExercisesContext.tsx` | Exercise history, streak tracking, completion state |

Local state via `useState`/`useEffect` is used for UI-specific state. `localStorage` persists exercise history and analysis history per user ID.

---

## 7. Key Technical Decisions

### App Router (Next.js 14)
Full adoption of the Next.js App Router with `"use client"` directives on interactive components. Server components used for static/layout pages.

### Authentication
Simplified to Google OAuth only via Supabase — removed Firebase Auth dependency after build failures on Vercel. OAuth callback at `/auth/callback` handles the session exchange.

### Blockchain Report Storage
Reports are hashed (SHA-256) on the client, uploaded to IPFS via Pinata, and the CID + hash stored in the EduChain smart contract. Verification page reads the contract to confirm integrity without trusting the server.

### Audio Recording
In-browser recording uses the Web Audio API (MediaRecorder). Max recording time: 30 seconds. Files are sent as `multipart/form-data` to `/analyze`. The `/analyze` endpoint was renamed from `/audio` to avoid ad-blocker interference.

### Exercise Persistence
Exercise history is stored in `localStorage` keyed by user ID. The `ExercisesContext` provides streak calculation, completion tracking, and progress across sessions without requiring a database write on every exercise completion.

---

## 8. Known Issues and Workarounds

| Issue | Workaround Applied |
|---|---|
| Firebase build failures on Vercel | Removed all Firebase dependencies; migrated fully to Supabase |
| Leaflet SSR incompatibility | Dynamic import with `ssr: false` in doctor-connect route |
| `/audio` blocked by ad blockers | Renamed to `/analyze` |
| TypeScript errors in build | `ignoreBuildErrors: true` in `next.config.mjs` |
| `reportService.storeReport` not found | Replaced with direct `saveReport` import |
| Loader getting stuck | Added explicit timeout + state reset in analysis flow |

---

## 9. Environment Variables Reference

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon/public key |
| `NEXT_PUBLIC_API_BASE_URL` | Yes | Backend API base URL |
| `NEXT_PUBLIC_PINATA_JWT` | Optional | Pinata IPFS upload JWT |
| `NEXT_PUBLIC_CONTRACT_ADDRESS` | Optional | EduChain contract address |

---

## 10. Deployment History

| Commit | Change |
|---|---|
| `b203e92` | Fix syntax error in cursor component |
| `4364c74` | Update backend URL to Hugging Face |
| `a84080a` | Fix: prevent loader from getting stuck |
| `c864e43` | Fix: correct TypeScript interface — riskLevel not risk_level |
| `5413db6` | Fix: replace reportService.storeReport with saveReport |
| `e857713` | Chore: trigger Vercel redeploy with Render backend URL |
| `c02a68c` | Fix: remove all Firebase dependencies for Vercel build |
| `121258e` | Feat: simplify auth to Google OAuth only |

---

*Report generated for VocalWell.ai Frontend — March 2025*
