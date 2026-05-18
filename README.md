# TariffSense AI — Trade Intelligence Platform

A trade compliance platform that consolidates HTS classification, landed-cost analysis, FTA eligibility review, and sourcing scenario modeling into a single web application. Built in response to the 2025–2026 U.S. tariff environment, where importers are navigating Section 301, Section 122, and Section 232 simultaneously.

**Live demo:** [https://tariffsense-ai.netlify.app/]

---

## What it does

| Module | Description |
|--------|-------------|
| **HTS Classification Engine** | Returns top HTS code candidates with base duty rates, Section 301 stacking, GRI rationale, and audit-exposure scoring |
| **Landed Cost Calculator** | Full duty stack: base MFN + Section 122 + Section 301 + Section 232 + MPF (capped $575.35) + HMF |
| **FTA Eligibility Scanner** | Portfolio-wide scan against USMCA, KORUS, and ASEAN agreements with annual savings by import line |
| **Sourcing Scenario Modeler** | Duty delta and 3-year NPV for any sourcing reallocation before committing |
| **Regulatory Watch** | AI intelligence briefs filtered to your portfolio countries and product categories |
| **Executive Report Generator** | VP/CPO-ready tariff exposure summaries, printable |
| **Tariff Intelligence Feed** | Auto-refreshes every 14 days via a Firestore-cached AI call shared across all users |
| **Quick Duty Estimator** | Public-facing tool on the landing page — no sign-in required |
| **Guided Tour** | 6-step walkthrough that runs live AI features for first-time evaluators |

---

## Tech stack

- **Frontend** — Vanilla JavaScript, single HTML file, no framework
- **Authentication** — Firebase Authentication (Google OAuth 2.0)
- **Database** — Firestore (real-time persistence, shared tariff intelligence cache)
- **AI** — Google Gemini 2.0 Flash via Netlify serverless function
- **Hosting** — Netlify (static site + serverless functions)
- **API security** — Gemini API key stored as Netlify environment variable, never exposed to users

---

## Project structure

```
tariffsense-ai/
├── index.html                  # Full application — landing page + all app pages
├── netlify.toml                # Netlify build configuration
└── netlify/
    └── functions/
        └── ai.js               # Serverless Gemini proxy — keeps API key server-side
```

---

## Setup

### Prerequisites
- Google account
- [Firebase project](https://console.firebase.google.com)
- [Gemini API key](https://ai.google.dev) (free, no credit card)
- [Netlify account](https://app.netlify.com) (free)

### Firebase configuration

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Authentication → Google** sign-in
3. Enable **Firestore Database** (production mode)
4. Add these Firestore security rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /metadata/{doc} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

5. Project Settings → General → Your apps → Add web app → copy the `firebaseConfig` object

### Deploy to Netlify

1. Fork or clone this repo to your GitHub account
2. Go to [app.netlify.com](https://app.netlify.com) → Add new site → Import from GitHub
3. Select your repo — leave build settings blank (handled by `netlify.toml`)
4. Deploy
5. Site settings → Environment variables → add `GEMINI_API_KEY` with your Gemini API key
6. Trigger a redeploy

### First login

After deploying, open your Netlify URL, sign in with Google, click the API Key indicator in the top bar, paste your Firebase `firebaseConfig` JSON, and save. The app loads with a sample portfolio. All AI features route through the Netlify function — no API key exposure to users.

---

## 2026 tariff data

Rates sourced from USITC HTS Schedule, USTR Section 301 lists, CBP Section 232 proclamations, the Section 122 global surcharge (10%, Feb 24 – Jul 24, 2026), the U.S.–India trade framework (Feb 2026), and the CBP CAPE refund portal (opened Apr 2026). The Tariff Intelligence Feed refreshes automatically every 14 days.

> **Disclaimer:** All HTS classifications and duty calculations are preliminary estimates for informational purposes only and do not constitute legal advice or binding tariff classifications. Verify all classifications and rates with a licensed customs broker before filing.

---

## Background

Built from direct experience analyzing $4.2M in tariff exposure during a Cummins India internship — doing manually in Oracle ERP and ICEGATE what this platform automates.

---

## Author

**Aditi Gupta** — MS Supply Chain Analytics, Rutgers Business School (Dec 2026)  
[LinkedIn](https://linkedin.com/in/your-profile) · ag2956@scarletmail.rutgers.edu

---

## License

MIT — see [LICENSE](LICENSE)
