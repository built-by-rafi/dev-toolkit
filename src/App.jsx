import { useState, useEffect } from "react";
import JsonFormatter from "./tools/JsonFormatter";
import JwtDecoder from "./tools/JwtDecoder";
import Base64Tool from "./tools/Base64Tool";
import UrlTool from "./tools/UrlTool";
import UuidTool from "./tools/UuidTool";
import HashTool from "./tools/HashTool";
import RegexTool from "./tools/RegexTool";

import Logo from "./components/Logo";
import CommandPalette from "./components/CommandPalette";
import {
  BracesIcon,
  KeyRoundIcon,
  BinaryIcon,
  LinkIcon,
  FingerprintIcon,
  ShieldCheckIcon,
  RegexIcon,
  SearchIcon,
  MoonIcon,
  SunIcon,
  LockIcon,
} from "./components/Icons";

const TOOLS = [
  {
    id: "json",
    label: "JSON Studio",
    shortLabel: "JSON",
    category: "Data & Formats",
    icon: BracesIcon,
    description: "Format, validate, minify, and convert JSON to TypeScript / YAML",
    component: JsonFormatter,
  },
  {
    id: "jwt",
    label: "JWT Decoder",
    shortLabel: "JWT",
    category: "Auth & Security",
    icon: KeyRoundIcon,
    description: "Inspect header/payload claims, expiry countdown, and verify HMAC signatures",
    component: JwtDecoder,
  },
  {
    id: "base64",
    label: "Base64 Studio",
    shortLabel: "Base64",
    category: "Encoding",
    icon: BinaryIcon,
    description: "Encode/decode text or convert images and files to Base64 Data URLs",
    component: Base64Tool,
  },
  {
    id: "url",
    label: "URL & Query",
    shortLabel: "URL",
    category: "Web & API",
    icon: LinkIcon,
    description: "Parse, edit, and rebuild URL query parameters in real-time",
    component: UrlTool,
  },
  {
    id: "uuid",
    label: "UUID Generator",
    shortLabel: "UUID",
    category: "Generators",
    icon: FingerprintIcon,
    description: "Generate cryptographically secure UUID v4, NanoID, and bulk IDs",
    component: UuidTool,
  },
  {
    id: "hash",
    label: "Hash & HMAC",
    shortLabel: "Hash",
    category: "Cryptography",
    icon: ShieldCheckIcon,
    description: "SHA-256, SHA-512, MD5, and keyed HMAC signature computation",
    component: HashTool,
  },
  {
    id: "regex",
    label: "Regex Tester",
    shortLabel: "Regex",
    category: "Code & Testing",
    icon: RegexIcon,
    description: "Test regular expressions with capture groups and preset patterns",
    component: RegexTool,
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState("json");
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [dark, setDark] = useState(() => {
    const stored = localStorage.getItem("devtoolkit-dark");
    return stored !== null ? stored === "true" : true;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("devtoolkit-dark", dark);
  }, [dark]);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const ActiveComponent = TOOLS.find((t) => t.id === activeTab)?.component ?? JsonFormatter;

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800/80 shadow-2xl shadow-black/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div className="cursor-pointer" onClick={() => setActiveTab("json")}>
            <Logo size="md" showSub={true} />
          </div>

          {/* Quick Search Bar / Command Palette trigger */}
          <button
            onClick={() => setIsPaletteOpen(true)}
            className="hidden md:flex items-center gap-3 px-3.5 py-1.5 rounded-xl bg-gray-900/90 border border-gray-800 hover:border-cyan-500/40 text-gray-400 hover:text-gray-200 text-xs transition-all shadow-inner group"
          >
            <SearchIcon className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
            <span>Search utilities or actions...</span>
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-gray-400 bg-gray-800 border border-gray-700/60 rounded">
              Ctrl K
            </kbd>
          </button>

          {/* Right Header items */}
          <div className="flex items-center gap-2">
            {/* Privacy indicator pill */}
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/50 text-[11px] text-emerald-300 font-medium">
              <LockIcon className="w-3 h-3 text-emerald-400" />
              <span>100% Client-Side</span>
            </div>

            {/* Mobile search trigger */}
            <button
              onClick={() => setIsPaletteOpen(true)}
              aria-label="Open Command Palette"
              className="md:hidden p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-900 border border-gray-800 transition-colors"
            >
              <SearchIcon className="w-4 h-4" />
            </button>

            {/* Dark mode toggle */}
            <button
              onClick={() => setDark((d) => !d)}
              aria-label="Toggle dark mode"
              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-900 border border-gray-800 transition-colors"
            >
              {dark ? <SunIcon className="w-4 h-4 text-yellow-400" /> : <MoonIcon className="w-4 h-4 text-cyan-400" />}
            </button>

            {/* GitHub repo button */}
            <a
              href="https://github.com/built-by-rafi/dev-toolkit"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-900 border border-gray-800 transition-colors"
              title="GitHub Repository"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Desktop Tool Navigation Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 overflow-x-auto scrollbar-none border-t border-gray-900">
          <nav className="flex items-center gap-1.5 min-w-max">
            {TOOLS.map((tool) => {
              const Icon = tool.icon;
              const isActive = activeTab === tool.id;
              return (
                <button
                  key={tool.id}
                  onClick={() => setActiveTab(tool.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 text-white shadow-md shadow-cyan-950/60 ring-1 ring-cyan-400/40"
                      : "text-gray-400 hover:text-gray-200 hover:bg-gray-900 border border-transparent"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-gray-400"}`} />
                  <span>{tool.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main App Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        <ActiveComponent />
      </main>

      {/* Modern Ultra-Professional Footer */}
      <footer className="border-t border-gray-900 bg-gray-950 py-8 text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Logo" className="w-7 h-7 rounded-lg border border-cyan-500/30 object-cover" />
            <div>
              <span className="font-bold text-gray-300">BUILT BY RAFI</span>
              <span className="mx-2 text-gray-700">·</span>
              <span className="text-gray-400">Next-Gen Privacy-First Developer Utility Suite</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <a href="https://dev-toolkit.ffrclup.workers.dev/" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">
              Live Cloudflare Deployment
            </a>
            <a href="https://github.com/built-by-rafi/dev-toolkit" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">
              GitHub Repo
            </a>
            <span className="text-gray-600">MIT License</span>
          </div>
        </div>
      </footer>

      {/* Command Palette Modal */}
      <CommandPalette
        isOpen={isPaletteOpen}
        onClose={() => setIsPaletteOpen(false)}
        tools={TOOLS}
        activeTab={activeTab}
        onSelectTool={(id) => setActiveTab(id)}
      />
    </div>
  );
}
