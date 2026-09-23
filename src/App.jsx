import { useState, useEffect } from "react";
import JsonFormatter from "./tools/JsonFormatter";
import JwtDecoder from "./tools/JwtDecoder";
import Base64Tool from "./tools/Base64Tool";
import { BracesIcon, KeyRoundIcon, BinaryIcon, MoonIcon, SunIcon, CodeIcon } from "./components/Icons";

const TOOLS = [
  { id: "json", label: "JSON Formatter", icon: BracesIcon, component: JsonFormatter },
  { id: "jwt", label: "JWT Decoder", icon: KeyRoundIcon, component: JwtDecoder },
  { id: "base64", label: "Base64", icon: BinaryIcon, component: Base64Tool },
];

export default function App() {
  const [activeTab, setActiveTab] = useState("json");
  const [dark, setDark] = useState(() => {
    const stored = localStorage.getItem("devtoolkit-dark");
    return stored !== null ? stored === "true" : true;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("devtoolkit-dark", dark);
  }, [dark]);

  const ActiveComponent = TOOLS.find((t) => t.id === activeTab)?.component ?? JsonFormatter;

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-md">
              <CodeIcon className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-white">DevToolkit</span>
              <span className="ml-2 text-xs text-gray-400 hidden sm:inline">100% client-side · privacy first</span>
            </div>
          </div>

          {/* Nav Tabs */}
          <nav className="hidden sm:flex items-center gap-1">
            {TOOLS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === id
                    ? "bg-violet-600 text-white shadow-md shadow-violet-900/40"
                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </nav>

          {/* Dark mode */}
          <button
            onClick={() => setDark((d) => !d)}
            aria-label="Toggle dark mode"
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-all duration-200"
          >
            {dark ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Nav */}
        <div className="sm:hidden flex border-t border-gray-800">
          {TOOLS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex-1 flex flex-col items-center gap-1 py-2 text-xs font-medium transition-all duration-200 ${
                activeTab === id ? "text-violet-400 border-t-2 border-violet-500" : "text-gray-500 border-t-2 border-transparent"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        <ActiveComponent />
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-4 text-center text-xs text-gray-600">
        DevToolkit · All processing happens locally in your browser · No data is ever sent to a server
      </footer>
    </div>
  );
}
