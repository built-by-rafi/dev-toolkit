# Contributing to DevToolkit

Thank you for your interest in contributing to **DevToolkit**! 🎉

DevToolkit is an open-source, 100% client-side, privacy-first developer utility web app. We welcome contributions of all kinds — from adding new utility tools and improving UI/UX to fixing bugs and enhancing documentation.

---

## 📜 Table of Contents

1. [Code of Conduct](#-code-of-conduct)
2. [Guiding Principles](#-guiding-principles)
3. [How Can I Contribute?](#-how-can-i-contribute)
4. [Local Development Setup](#-local-development-setup)
5. [Adding a New Tool (Step-by-Step)](#-adding-a-new-tool-step-by-step)
6. [Submitting a Pull Request](#-submitting-a-pull-request)
7. [Coding Guidelines & Style](#-coding-guidelines--style)
8. [License](#-license)

---

## 🛡️ Code of Conduct

We are committed to providing a friendly, safe, and welcoming environment for everyone, regardless of experience level, background, or identity. Please be respectful, considerate, and collaborative.

---

## 🔒 Guiding Principles

Every tool added to DevToolkit must adhere to our core privacy guarantees:

1. **100% Client-Side Only**: All computations, formatting, decoding, or conversions must happen exclusively inside the user's browser.
2. **Zero Network Calls / Telemetry**: No user input or metadata may ever be transmitted to external APIs, analytics services, or remote servers.
3. **Responsive & Accessible**: Interfaces must work seamlessly on both desktop and mobile viewports with dark mode support.
4. **Lightweight & Fast**: Avoid heavy dependencies where simple native browser APIs or lightweight algorithms suffice.

---

## 💡 How Can I Contribute?

### 1. Reporting Bugs
- Search existing [Issues](https://github.com/built-by-rafi/dev-toolkit/issues) to avoid duplicates.
- Open a new issue with a clear title, description, steps to reproduce, expected behavior, and browser/OS details.

### 2. Suggesting Enhancements & New Tools
- Have an idea for a useful developer tool? Open an issue tagged `enhancement` and describe what the tool does, common use cases, and how you imagine the UI layout.

### 3. Code Contributions
- Pick up an open issue or propose your own improvements via a Pull Request!

---

## 💻 Local Development Setup

Follow these steps to get a local copy up and running:

### 1. Fork the Repository
Click the **Fork** button at the top-right of the [DevToolkit GitHub repository](https://github.com/built-by-rafi/dev-toolkit) to create your own copy.

### 2. Clone Your Fork
```bash
git clone https://github.com/<your-username>/dev-toolkit.git
cd dev-toolkit
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Start Development Server
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser. Any edits you make to files in `src/` will hot-reload automatically.

---

## 🧩 Adding a New Tool (Step-by-Step)

Adding a new utility is quick and modular:

### Step 1: Create the Tool Component
Create a new file in `src/tools/`, for example `src/tools/UuidGenerator.jsx`:

```jsx
import { useState } from "react";
import { CopyIcon, CheckIcon } from "../components/Icons";

export default function UuidGenerator() {
  const [uuid, setUuid] = useState("");

  const generate = () => {
    setUuid(crypto.randomUUID());
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-white">UUID Generator</h1>
        <p className="text-sm text-gray-400 mt-0.5">Generate cryptographically secure v4 UUIDs</p>
      </div>

      <button
        onClick={generate}
        className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-sm font-medium transition-colors"
      >
        Generate UUID
      </button>

      {uuid && (
        <div className="p-4 bg-gray-900 border border-gray-800 rounded-xl font-mono text-sm text-gray-100">
          {uuid}
        </div>
      )}
    </div>
  );
}
```

### Step 2: Add an Icon (Optional)
If your tool needs a new icon, add an SVG component in `src/components/Icons.jsx`.

### Step 3: Register the Tool in `App.jsx`
Open `src/App.jsx`:
1. Import your component and icon.
2. Add an object to the `TOOLS` array:
   ```javascript
   import UuidGenerator from "./tools/UuidGenerator";
   import { FingerprintIcon } from "./components/Icons";

   const TOOLS = [
     { id: "json", label: "JSON Formatter", icon: BracesIcon, component: JsonFormatter },
     { id: "jwt", label: "JWT Decoder", icon: KeyRoundIcon, component: JwtDecoder },
     { id: "base64", label: "Base64", icon: BinaryIcon, component: Base64Tool },
     { id: "uuid", label: "UUID Generator", icon: FingerprintIcon, component: UuidGenerator }, // <--- Added
   ];
   ```

---

## 🚀 Submitting a Pull Request

Once you've made your changes:

### 1. Create a Descriptive Branch
```bash
git checkout -b feature/uuid-generator
# or
git checkout -b fix/jwt-timestamp-formatting
```

### 2. Verify Your Build
Ensure the application builds without warnings or errors:
```bash
npm run build
```

### 3. Commit Your Changes
Write clear, conventional commit messages:
```bash
git add .
git commit -m "feat: add UUID generator utility tool"
```

### 4. Push to Your Fork
```bash
git push -u origin feature/uuid-generator
```

### 5. Open a Pull Request
1. Go to the [DevToolkit repository](https://github.com/built-by-rafi/dev-toolkit).
2. Click **Compare & pull request**.
3. Provide a clear description of the change, screenshots of new UI (if applicable), and list any related issues.

---

## 🎨 Coding Guidelines & Style

- **Styling**: Use Tailwind CSS utility classes. Stick to the project's color palette (dark theme with `gray-950`, `gray-900`, `gray-800` surfaces and `violet-600` accents).
- **Semantics**: Use clean, accessible HTML (`<button>`, `<label>`, `<main>`, `<header>`).
- **Icons**: Use inline SVGs via `src/components/Icons.jsx` to keep the bundle small and avoid external icon font bloat.
- **Copy Feedback**: Always give the user clear feedback when copying to the clipboard (e.g. using a momentary "Copied!" state).

---

## ⚖️ License

By contributing to DevToolkit, you agree that your contributions will be licensed under the project's [MIT License](./LICENSE).
