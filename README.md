# 🛠️ DevToolkit

> A **100% client-side, privacy-first** developer utility web app.  
> All processing happens in your browser — **no data ever leaves your machine**.

[![License: MIT](https://img.shields.io/badge/License-MIT-violet.svg)](./LICENSE)
[![Built with Vite](https://img.shields.io/badge/Built%20with-Vite-646cff.svg)](https://vite.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-v4-06b6d4.svg)](https://tailwindcss.com)
[![React](https://img.shields.io/badge/React-18-61dafb.svg)](https://react.dev)

---

## ✨ Features

### 🔷 JSON Formatter & Validator
- **Real-time formatting** with 2-space indentation
- **Minify** JSON to a single line
- **Syntax error detection** with exact **line & column** numbers
- Side-by-side input/output panels with **line numbers**
- One-click **copy** to clipboard

### 🔑 JWT Decoder
- Decodes **header**, **payload**, and **signature** instantly
- **Color-coded** token visualisation (pink = header, yellow = payload, green = signature)
- Human-readable **claim labels** (`iss`, `sub`, `exp`, `iat`, `aud`, etc.)
- **Expiry detection** — warns when a token is expired
- Explains why signature verification requires a secret key

### 🔤 Base64 Encoder / Decoder
- Supports **Standard** Base64 and **URL-safe** Base64 (RFC 4648)
- Live encoding **and** decoding as you type
- Handles **Unicode / UTF-8** text correctly
- Clear error messages for malformed Base64 input

---

## 🔒 Privacy Guarantee

| What we do | What we don't do |
|---|---|
| Process everything in-browser (JS only) | Send any data to a server |
| Store your dark-mode preference in `localStorage` | Log, track, or analyse your input |
| Use Google Fonts CDN for typography | Use analytics or tracking scripts |

---

## 🚀 Quick Start

```bash
# 1. Clone or download the repository
git clone https://github.com/your-username/dev-toolkit.git
cd dev-toolkit

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Build tool | [Vite 6](https://vite.dev) |
| UI framework | [React 18](https://react.dev) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) (via `@tailwindcss/vite`) |
| Fonts | [Inter](https://fonts.google.com/specimen/Inter) via Google Fonts |
| Deployment | Any static host (Netlify, Vercel, GitHub Pages, etc.) |

---

## 📂 Project Structure

```
dev-toolkit/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   └── Icons.jsx          # SVG icon components
│   ├── tools/
│   │   ├── JsonFormatter.jsx  # JSON Formatter & Validator
│   │   ├── JwtDecoder.jsx     # JWT Decoder
│   │   └── Base64Tool.jsx     # Base64 Encoder/Decoder
│   ├── App.jsx                # Root layout, navigation, dark mode
│   ├── main.jsx               # React entry point
│   └── index.css              # Tailwind CSS + global styles
├── index.html                 # HTML shell (SEO meta, fonts)
├── vite.config.js             # Vite + Tailwind plugin config
├── package.json
├── README.md
└── LICENSE
```

---

## 🛠️ Building for Production

```bash
npm run build
```

The output is in the `dist/` directory. Deploy it to any static hosting provider:

```bash
# Example: Netlify CLI
netlify deploy --dir dist --prod

# Example: Vercel CLI
vercel --prod
```

---

## 🧩 Adding a New Tool

1. Create `src/tools/YourTool.jsx` — export a default React component.
2. Add an icon to `src/components/Icons.jsx`.
3. Register the tool in the `TOOLS` array in `src/App.jsx`.

---

## 📄 License

MIT © 2024 — see [LICENSE](./LICENSE) for details.
