import { useEffect, useState, useRef } from "react";
import { SearchIcon, ArrowRightIcon } from "./Icons";

export default function CommandPalette({ isOpen, onClose, tools, activeTab, onSelectTool }) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  const filtered = tools.filter((t) =>
    t.label.toLowerCase().includes(query.toLowerCase()) ||
    t.description?.toLowerCase().includes(query.toLowerCase()) ||
    t.category?.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (filtered.length || 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + (filtered.length || 1)) % (filtered.length || 1));
      } else if (e.key === "Enter" && filtered[selectedIndex]) {
        e.preventDefault();
        onSelectTool(filtered[selectedIndex].id);
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filtered, selectedIndex, onClose, onSelectTool]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/70 backdrop-blur-md transition-opacity">
      {/* Backdrop click */}
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-xl bg-gray-900 border border-cyan-500/30 rounded-2xl shadow-2xl shadow-cyan-950/80 overflow-hidden z-10 flex flex-col">
        {/* Search input header */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-800 bg-gray-950/60">
          <SearchIcon className="w-5 h-5 text-cyan-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a tool name or feature... (e.g. JSON, JWT, UUID, Regex)"
            className="flex-1 bg-transparent text-sm text-gray-100 placeholder-gray-500 outline-none"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
          />
          <kbd className="px-2 py-0.5 text-[10px] font-mono text-gray-400 bg-gray-800 border border-gray-700 rounded-md">
            ESC
          </kbd>
        </div>

        {/* Results list */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-sm text-gray-500">
              No developer tools found matching "{query}"
            </div>
          ) : (
            filtered.map((tool, idx) => {
              const Icon = tool.icon;
              const isSelected = idx === selectedIndex;
              const isActive = tool.id === activeTab;
              return (
                <button
                  key={tool.id}
                  onClick={() => {
                    onSelectTool(tool.id);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left transition-all ${
                    isSelected
                      ? "bg-cyan-950/60 text-cyan-200 border border-cyan-500/40 shadow-sm"
                      : "text-gray-300 hover:bg-gray-800/60 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isSelected ? "bg-cyan-500/20 text-cyan-300" : "bg-gray-800 text-gray-400"}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold flex items-center gap-2">
                        {tool.label}
                        {isActive && (
                          <span className="text-[10px] bg-cyan-900/60 text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-700/50">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 line-clamp-1">{tool.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-gray-500 uppercase tracking-wider">{tool.category}</span>
                    <ArrowRightIcon className={`w-4 h-4 ${isSelected ? "text-cyan-400 translate-x-0.5" : "text-gray-600"} transition-transform`} />
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 border-t border-gray-800 bg-gray-950/70 flex items-center justify-between text-[11px] text-gray-400">
          <span>Navigate with <kbd className="px-1 text-gray-300 bg-gray-800 rounded">↑</kbd> <kbd className="px-1 text-gray-300 bg-gray-800 rounded">↓</kbd></span>
          <span>Select with <kbd className="px-1.5 text-gray-300 bg-gray-800 rounded">Enter</kbd></span>
        </div>
      </div>
    </div>
  );
}
