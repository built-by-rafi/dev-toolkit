# 🛠️ DevToolkit

> A **100% client-side, privacy-first** developer utility web app.  
> All data processing occurs entirely within your browser — **no data is ever stored, tracked, or sent to any server**.

<p align="center">
  <a href="https://dev-toolkit.ffrclup.workers.dev/">
    <img src="https://img.shields.io/badge/🚀_Live_Demo-dev--toolkit.ffrclup.workers.dev-7c3aed?style=for-the-badge" alt="Live Demo" />
  </a>
</p>

<p align="center">
  <a href="./LICENSE"><img src="https://img.shields.io/badge/License-MIT-violet.svg?style=flat-square" alt="License: MIT" /></a>
  <a href="https://vite.dev"><img src="https://img.shields.io/badge/Built%20with-Vite-646cff.svg?style=flat-square" alt="Built with Vite" /></a>
  <a href="https://tailwindcss.com"><img src="https://img.shields.io/badge/Tailwind%20CSS-v4-06b6d4.svg?style=flat-square" alt="Tailwind CSS" /></a>
  <a href="https://react.dev"><img src="https://img.shields.io/badge/React-18-61dafb.svg?style=flat-square" alt="React 18" /></a>
  <a href="https://dev-toolkit.ffrclup.workers.dev/"><img src="https://img.shields.io/badge/Status-Online-emerald.svg?style=flat-square" alt="Deployment Status" /></a>
</p>

---

## 🌐 Live Application

Experience DevToolkit instantly without installing anything:

👉 **[Launch Live Demo](https://dev-toolkit.ffrclup.workers.dev/)** (`https://dev-toolkit.ffrclup.workers.dev/`)

---

## ✨ Features & Utilities

### 🔷 JSON Formatter & Validator
- **Instant Pretty-Printing**: Formats unformatted or minified JSON with clean 2-space indentation.
- **Minification**: Compresses JSON into a single line for lightweight transfer.
- **Precision Error Detection**: Real-time syntax validation pinpointing exact **Line** and **Column** coordinates for syntax errors.
- **Side-by-Side Editor**: Synchronized line-numbered input and output panels.
- **One-Click Actions**: Quick copy to clipboard and instant clear options.

### 🔑 JWT Decoder
- **Three-Part Breakdown**: Automatically splits and decodes Header, Payload, and Signature into structured, readable sections.
- **Color-Coded Inspection**: Intuitive syntax highlighting matching RFC 7519 specifications (Header in pink, Payload in yellow, Signature in green).
- **Human-Readable Claims**: Translates standard claims (`iss`, `sub`, `aud`, `exp`, `iat`, `nbf`) into understandable timestamps and descriptions.
- **Expiration Status**: Automatic token validity check with visual badge indicators for expired tokens.
- **Cryptographic Transparency**: Explains signature verification requirements without exposing sensitive keys.

### 🔤 Base64 Encoder / Decoder
- **Dual Format Support**: Seamless switching between **Standard** Base64 and **URL-Safe** Base64 (RFC 4648).
- **Live Two-Way Processing**: Real-time encoding and decoding as you type.
- **Full UTF-8 / Unicode Support**: Accurately handles multi-byte special characters, emojis, and symbols.
- **Descriptive Error Handling**: Clear inline alerts for corrupt or incorrectly padded inputs.

---

## 🔒 Privacy & Security Guarantee

DevToolkit is designed specifically for engineers handling sensitive keys, tokens, and payloads.

| Principle | DevToolkit Implementation |
|---|---|
| **Zero Backend Exposure** | 100% executed locally inside client JavaScript runtime. No API requests are sent. |
| **No Data Retention** | No databases, cookies, or remote logging. Closing or refreshing clears in-memory state. |
| **Local Preferences Only** | Dark/light theme mode preference is preserved locally via browser `localStorage`. |
| **No Tracking or Telemetry** | Zero Google Analytics, tracking pixels, cookies, or third-party monitoring scripts. |

---

## 🚀 Getting Started Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or newer recommended)
- `npm`, `pnpm`, or `yarn`

### Installation & Run

```bash
# 1. Clone the repository
git clone https://github.com/built-by-rafi/dev-toolkit.git

# 2. Navigate to the project directory
cd dev-toolkit

# 3. Install dependencies
npm install

# 4. Start local development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| **Build & Bundler** | [Vite 6](https://vite.dev) |
| **UI Library** | [React 18](https://react.dev) |
| **CSS & Styling** | [Tailwind CSS v4](https://tailwindcss.com) (via `@tailwindcss/vite`) |
| **Typography** | [Inter](https://fonts.google.com/specimen/Inter) font family |
| **Hosting** | [Cloudflare Workers / Pages](https://dev-toolkit.ffrclup.workers.dev/) |

---

## 📂 Project Architecture

```
dev-toolkit/
├── public/
│   └── favicon.svg          # Application favicon
├── src/
│   ├── components/
│   │   └── Icons.jsx        # Lightweight inline SVG icon set
│   ├── tools/
│   │   ├── JsonFormatter.jsx# JSON Formatter & Validator tool
│   │   ├── JwtDecoder.jsx   # JWT Decoder tool
│   │   └── Base64Tool.jsx   # Base64 Encode & Decode tool
│   ├── App.jsx              # Application shell, layout & navigation
│   ├── main.jsx             # React DOM root entrypoint
│   └── index.css            # Tailwind CSS styling and theme setup
├── index.html               # HTML5 container & SEO meta tags
├── vite.config.js           # Vite build and plugin configuration
├── CONTRIBUTING.md          # Open-source contributor guidelines
├── README.md                # Project documentation
└── LICENSE                  # MIT License
```

---

## 🛠️ Production Build

```bash
# Generate optimized production assets in dist/
npm run build

# Preview the production build locally
npm run preview
```

---

## 🤝 Contributing

Contributions, feature requests, and bug reports are welcome! Please check out the [CONTRIBUTING.md](./CONTRIBUTING.md) guide before opening a pull request.

---

## 📄 License

This project is open-source and distributed under the [MIT License](./LICENSE).  
Copyright © 2024 DevToolkit Contributors.
