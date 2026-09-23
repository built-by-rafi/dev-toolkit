import { useState, useMemo } from "react";
import { RegexIcon, AlertCircleIcon, TrashIcon, SparklesIcon } from "../components/Icons";

const PRESET_PATTERNS = [
  { name: "Email Address", pattern: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}", flags: "g" },
  { name: "HTTP/HTTPS URL", pattern: "https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)", flags: "g" },
  { name: "IPv4 Address", pattern: "\\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\b", flags: "g" },
  { name: "Hex Color", pattern: "#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})", flags: "g" },
  { name: "UUID v4", pattern: "[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}", flags: "gi" },
];

export default function RegexTool() {
  const [pattern, setPattern] = useState("(\\w+)@([\\w.]+)");
  const [flags, setFlags] = useState("g");
  const [testText, setTestText] = useState("Contact rafi@example.com or support@devtoolkit.io for assistance.");

  const toggleFlag = (flag) => {
    setFlags((prev) => (prev.includes(flag) ? prev.replace(flag, "") : prev + flag));
  };

  // Evaluate matches
  const { matches, error } = useMemo(() => {
    if (!pattern) return { matches: [], error: null };
    try {
      const regex = new RegExp(pattern, flags);
      const results = [];
      let match;

      if (!flags.includes("g")) {
        const single = regex.exec(testText);
        if (single) {
          results.push({
            match: single[0],
            index: single.index,
            groups: single.slice(1),
          });
        }
      } else {
        // Prevent infinite loops on empty matches
        let lastIndex = -1;
        while ((match = regex.exec(testText)) !== null) {
          results.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1),
          });
          if (regex.lastIndex === lastIndex) {
            regex.lastIndex++;
          }
          lastIndex = regex.lastIndex;
        }
      }

      return { matches: results, error: null };
    } catch (e) {
      return { matches: [], error: e.message };
    }
  }, [pattern, flags, testText]);

  return (
    <div className="space-y-4">
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gray-900/60 p-4 rounded-2xl border border-gray-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">Regex Tester & Debugger</h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/60 font-mono">
              Live Evaluation
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Test regular expressions in real-time, inspect match indices and capture groups, or pick common presets.
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-gray-400 flex items-center gap-1 mr-1">
            <SparklesIcon className="w-3.5 h-3.5 text-cyan-400" />
            Presets:
          </span>
          {PRESET_PATTERNS.slice(0, 3).map((p) => (
            <button
              key={p.name}
              onClick={() => { setPattern(p.pattern); setFlags(p.flags); }}
              className="px-2 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-[11px] font-medium transition-colors border border-gray-700/60"
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Regex Expression Bar */}
      <div className="bg-gray-900/60 rounded-2xl border border-gray-800 p-4 space-y-3">
        <label className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
          <RegexIcon className="w-3.5 h-3.5" />
          Regular Expression
        </label>
        <div className="flex items-center gap-2 bg-gray-950 border border-gray-800 rounded-xl px-3 py-2">
          <span className="text-gray-500 font-mono font-bold text-sm">/</span>
          <input
            type="text"
            className="flex-1 bg-transparent font-mono text-sm text-cyan-300 outline-none"
            placeholder="[a-zA-Z0-9]+..."
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            spellCheck={false}
          />
          <span className="text-gray-500 font-mono font-bold text-sm">/</span>

          {/* Flags toggle buttons */}
          <div className="flex items-center gap-1 pl-2 border-l border-gray-800">
            {["g", "i", "m", "s"].map((f) => (
              <button
                key={f}
                onClick={() => toggleFlag(f)}
                className={`w-6 h-6 rounded flex items-center justify-center font-mono text-xs font-bold transition-colors ${
                  flags.includes(f)
                    ? "bg-cyan-500 text-gray-950 shadow-sm"
                    : "text-gray-500 hover:text-gray-300 bg-gray-900"
                }`}
                title={`Flag: ${f}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <p className="text-xs text-red-400 flex items-center gap-1">
            <AlertCircleIcon className="w-3.5 h-3.5" /> {error}
          </p>
        )}
      </div>

      {/* Test String and Match Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Test String */}
        <div className="bg-gray-900/60 rounded-2xl border border-gray-800 p-4 space-y-2 flex flex-col">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">Test String</label>
            <button
              onClick={() => setTestText("")}
              className="text-xs text-gray-500 hover:text-red-400 flex items-center gap-1"
            >
              <TrashIcon className="w-3.5 h-3.5" /> Clear
            </button>
          </div>
          <textarea
            className="flex-1 w-full bg-gray-950 border border-gray-800 rounded-xl p-3 font-mono text-xs text-gray-200 resize-none outline-none focus:border-cyan-500/50 min-h-[260px]"
            placeholder="Type or paste sample text here to test against the pattern..."
            value={testText}
            onChange={(e) => setTestText(e.target.value)}
            spellCheck={false}
          />
        </div>

        {/* Matches Inspector */}
        <div className="bg-gray-900/60 rounded-2xl border border-gray-800 p-4 space-y-2 flex flex-col">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">
              Matches Found ({matches.length})
            </label>
            {matches.length > 0 && (
              <span className="text-xs text-emerald-400 font-semibold">● Passing</span>
            )}
          </div>

          <div className="flex-1 bg-gray-950 border border-gray-800 rounded-xl p-3 max-h-[300px] overflow-y-auto space-y-2">
            {matches.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-gray-500 py-12">
                No matches found in test string.
              </div>
            ) : (
              matches.map((m, idx) => (
                <div key={idx} className="bg-gray-900/80 p-2.5 rounded-lg border border-gray-800 space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-gray-400">
                    <span className="font-semibold text-cyan-400">Match #{idx + 1}</span>
                    <span className="font-mono">Index: {m.index}</span>
                  </div>
                  <div className="font-mono text-xs text-emerald-300 bg-gray-950 px-2 py-1 rounded border border-gray-800 break-all select-all">
                    {m.match}
                  </div>
                  {m.groups.length > 0 && (
                    <div className="pt-1 space-y-0.5">
                      <span className="text-[10px] text-gray-500 uppercase tracking-wider">Capture Groups:</span>
                      {m.groups.map((grp, gIdx) => (
                        <div key={gIdx} className="text-[11px] font-mono text-purple-300 pl-2">
                          Group {gIdx + 1}: <span className="text-gray-300">{grp}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
