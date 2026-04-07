<div align="center">
  <img src="public/logo.png" alt="FortisMail Logo" width="120" />
  <h1>FortisMail</h1>
  <p><b>Zero-Knowledge, End-to-End Encrypted (E2EE) Corporate Webmail</b></p>

  <p>
    <a href="https://fortis-mail.vercel.app/login">Live Demo</a> •
    <a href="./WHITEPAPER.md">Security Whitepaper</a> •
    <a href="https://github.com/myxxzin/fortis-mail">Repository</a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/React-19.x-blue?style=flat-square&logo=react" alt="React" />
    <img src="https://img.shields.io/badge/TypeScript-5.9-blue?style=flat-square&logo=typescript" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Vite-8.x-purple?style=flat-square&logo=vite" alt="Vite" />
    <img src="https://img.shields.io/badge/Tailwind-4.2-38bdf8?style=flat-square&logo=tailwind-css" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Firebase-12.x-ffca28?style=flat-square&logo=firebase" alt="Firebase" />
  </p>
</div>

---

## 📖 Overview

**FortisMail** is a highly secure webmail application specifically designed for enterprise-grade internal communication. Built around a **Zero-Knowledge Architecture**, the application ensures that the server (Firebase) acts entirely as a "blind courier". 

The server only routes opaque, encrypted blobs. Even in the event of a total database breach, your communications remain completely inaccessible to attackers because all encryption and decryption processes occur strictly **client-side** in the browser.

## ✨ Key Features

- 🔒 **End-to-End Encryption (E2EE):** All messages and attachments are encrypted before leaving your device.
- 🚫 **Zero-Knowledge Architecture:** No keys are ever transmitted to or stored on the server in plaintext. 
- 🛡️ **Hybrid Cryptography:** Utilizes **AES-256-GCM** for fast bulk data encryption and **ECDH Ephemeral Keys** for secure key exchange, guaranteeing **Forward Secrecy**.
- ⏱️ **Anti-Replay Attack Protection:** ECDSA digital signatures are bound to timestamps and recipient constraints to prevent mail spoofing and replay attacks.
- ⚡ **Volatile Memory Security:** Strictly avoids local storage or Redux state for private keys. Decrypted keys live exclusively in volatile RAM via React Context and are permanently destroyed when the tab is closed.

## 🛠️ Tech Stack

FortisMail leverages modern, high-performance web technologies:

- **Frontend Core:** React 19, TypeScript
- **Build Tool:** Vite 8 (with Oxc compilation)
- **Styling:** Tailwind CSS 4 (Utility-first)
- **Database & Auth:** Firebase (Firestore & Cloud Storage)
- **Animations:** Framer Motion
- **Native Cryptography:** Web Crypto API (`window.crypto.subtle`) — No vulnerable npm crypto-dependencies.

## 📂 Project Structure

```text
fortis-mail/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI elements (Modals, Sidebars, Inputs)
│   ├── config/             # Firebase configuration
│   ├── context/            # React Contexts (Auth, Mail, Theme, Contact)
│   ├── layouts/            # Main layout wrappers
│   ├── pages/              # Application pages (Inbox, Login, Compose, Docs)
│   ├── utils/              # Cryptographic core (cryptoAuth.ts)
│   └── locales/            # i18n translation strings (EN/VI)
├── eslint.config.js        # Strict Type-aware ESLint configuration
├── tsconfig.json           # Layered TypeScript configuration
└── vercel.json             # Vercel SPA routing deployment config
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (LTS recommended)
- A Firebase Project with Firestore and Cloud Storage enabled.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/myxxzin/fortis-mail.git
   cd fortis-mail
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory and add your Firebase credentials:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```
   > ⚠️ **Warning:** Never commit the `.env` file to version control.

4. **Start the Development Server:**
   ```bash
   npm run dev
   ```

5. **Build for Production:**
   ```bash
   npm run build
   ```

## 📜 Developer Scripts

We have included several CommonJS/ESM scripts to automate refactoring and standardize styling during active development:
- `npm run dev` / `npm run build` — Standard Vite lifecycle commands.
- `node elevate_surfaces.cjs` — Migrates hardcoded hex colors to Tailwind's semantic dark mode scale (`bg-slate-900`).
- `node fix_text.cjs` — Normalizes all text contrast issues in dark mode for accessibility.

## 🔐 Security Deep Dive

For an in-depth understanding of the cryptographic models, key life-cycles, and PBKDF2 hash derivations used in FortisMail, please read the [WHITEPAPER.md](./WHITEPAPER.md) included in this repository.

## 🌍 Deployment

FortisMail is fully configured for zero-downtime deployment on **Vercel**. Simply connect your GitHub repository to Vercel, and the provided `vercel.json` will automatically configure SPA routing.

---
*Open-source, secure, and built for the modern enterprise.*
