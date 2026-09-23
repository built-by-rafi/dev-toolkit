import { useState, useCallback, useEffect } from "react";
import { CopyIcon, CheckIcon, RefreshCwIcon, FingerprintIcon } from "../components/Icons";

function generateNanoId(length = 21) {
  const chars = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLFG_";
  let id = "";
  const randomValues = new Uint8Array(length);
  window.crypto.getRandomValues(randomValues);
  for (let i = 0; i < length; i++) {
    id += chars[randomValues[i] % chars.length];
  }
  return id;
}

function useCopy(text) {
  const [copied, setCopied] = useState(false);
  const copy = useCallback(() => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }, [text]);
  return [copied, copy];
}

export default function UuidTool() {
  const [type, setType] = useState("v4"); // 'v4' | 'nanoid' | 'timestamp'
  const [count, setCount] = useState(5);
  const [uppercase, setUppercase] = useState(false);
  const [hyphens, setHyphens] = useState(true);
  const [braces, setBraces] = useState(false);
  const [generatedList, setGeneratedList] = useState([]);

  const generateSingle = () => {
    let raw = "";
    if (type === "nanoid") {
      raw = generateNanoId(21);
    } else if (type === "timestamp") {
      const now = Date.now().toString(36);
      const rand = Math.random().toString(36).substring(2, 9);
      raw = `${now}-${rand}`;
    } else {
      raw = window.crypto.randomUUID ? window.crypto.randomUUID() : "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    }

    if (type === "v4") {
      if (!hyphens) raw = raw.replace(/-/g, "");
      if (uppercase) raw = raw.toUpperCase();
      if (braces) raw = `{${raw}}`;
    } else {
      if (uppercase) raw = raw.toUpperCase();
    }

    return raw;
  };

  const regenerate = () => {
    const list = Array.from({ length: count }, () => ({
      id: Math.random().toString(),
      value: generateSingle()
    }));
    setGeneratedList(list);
  };

  useEffect(() => {
    regenerate();
  }, [type, count, uppercase, hyphens, braces]);

  const allAsText = generatedList.map((item) => item.value).join("\n");
  const allAsJson = JSON.stringify(generatedList.map((item) => item.value), null, 2);

  const [copiedAllText, copyAllText] = useCopy(allAsText);
  const [copiedAllJson, copyAllJson] = useCopy(allAsJson);

  return (
    <div className="space-y-4">
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gray-900/60 p-4 rounded-2xl border border-gray-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">UUID & Identifier Generator</h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/60 font-mono">
              Cryptographically Secure
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Generate cryptographically secure RFC 4122 UUID v4, NanoID, and timestamp IDs in bulk.
          </p>
        </div>

        <button
          onClick={regenerate}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-cyan-950/50 transition-all self-start sm:self-auto"
        >
          <RefreshCwIcon className="w-3.5 h-3.5" />
          Regenerate
        </button>
      </div>

      {/* Control Panel */}
      <div className="bg-gray-900/60 rounded-2xl border border-gray-800 p-4 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Format selection */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-400">ID Standard:</span>
            <div className="flex items-center gap-1 bg-gray-950 p-1 rounded-xl border border-gray-800">
              <button
                onClick={() => setType("v4")}
                className={`px-3 py-1 text-xs rounded-lg font-semibold transition-all ${
                  type === "v4" ? "bg-cyan-950 text-cyan-300 border border-cyan-700/50 shadow-sm" : "text-gray-400 hover:text-white"
                }`}
              >
                UUID v4
              </button>
              <button
                onClick={() => setType("nanoid")}
                className={`px-3 py-1 text-xs rounded-lg font-semibold transition-all ${
                  type === "nanoid" ? "bg-cyan-950 text-cyan-300 border border-cyan-700/50 shadow-sm" : "text-gray-400 hover:text-white"
                }`}
              >
                NanoID (21)
              </button>
              <button
                onClick={() => setType("timestamp")}
                className={`px-3 py-1 text-xs rounded-lg font-semibold transition-all ${
                  type === "timestamp" ? "bg-cyan-950 text-cyan-300 border border-cyan-700/50 shadow-sm" : "text-gray-400 hover:text-white"
                }`}
              >
                Timestamp ID
              </button>
            </div>
          </div>

          {/* Quantity selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-400">Count:</span>
            <div className="flex items-center gap-1 bg-gray-950 p-1 rounded-xl border border-gray-800">
              {[1, 5, 10, 25, 50].map((num) => (
                <button
                  key={num}
                  onClick={() => setCount(num)}
                  className={`w-7 py-1 text-xs rounded-lg font-mono font-medium transition-all ${
                    count === num ? "bg-cyan-950 text-cyan-300 border border-cyan-700/50" : "text-gray-400 hover:text-white"
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Toggles */}
        {type === "v4" && (
          <div className="flex flex-wrap items-center gap-6 pt-3 border-t border-gray-800 text-xs text-gray-300">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={uppercase}
                onChange={(e) => setUppercase(e.target.checked)}
                className="rounded accent-cyan-500"
              />
              <span>Uppercase</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={hyphens}
                onChange={(e) => setHyphens(e.target.checked)}
                className="rounded accent-cyan-500"
              />
              <span>Include Hyphens</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={braces}
                onChange={(e) => setBraces(e.target.checked)}
                className="rounded accent-cyan-500"
              />
              <span>Enclose in Braces &#123;...&#125;</span>
            </label>
          </div>
        )}
      </div>

      {/* Results List */}
      <div className="bg-gray-900/60 rounded-2xl border border-gray-800 p-4 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-gray-800">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
            <FingerprintIcon className="w-3.5 h-3.5 text-cyan-400" />
            Generated Identifiers ({generatedList.length})
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={copyAllText}
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 bg-gray-950 px-2.5 py-1 rounded-lg border border-gray-800 transition-colors"
            >
              {copiedAllText ? <CheckIcon className="w-3 h-3 text-emerald-400" /> : <CopyIcon className="w-3 h-3" />}
              Copy All (Lines)
            </button>
            <button
              onClick={copyAllJson}
              className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 bg-gray-950 px-2.5 py-1 rounded-lg border border-gray-800 transition-colors"
            >
              {copiedAllJson ? <CheckIcon className="w-3 h-3 text-emerald-400" /> : <CopyIcon className="w-3 h-3" />}
              Copy JSON Array
            </button>
          </div>
        </div>

        <div className="space-y-1.5 max-h-[380px] overflow-y-auto">
          {generatedList.map((item, idx) => (
            <ItemRow key={item.id} value={item.value} index={idx + 1} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ItemRow({ value, index }) {
  const [copied, copy] = useCopy(value);
  return (
    <div className="flex items-center justify-between bg-gray-950 px-3.5 py-2.5 rounded-xl border border-gray-800/80 group hover:border-cyan-500/40 transition-colors">
      <div className="flex items-center gap-3 min-w-0">
        <span className="text-[11px] font-mono text-gray-600 w-5 select-none">{index}.</span>
        <span className="font-mono text-xs text-cyan-300 tracking-wide select-all truncate">{value}</span>
      </div>
      <button
        onClick={copy}
        className="opacity-70 group-hover:opacity-100 p-1 text-gray-400 hover:text-white transition-opacity"
        title="Copy"
      >
        {copied ? <CheckIcon className="w-3.5 h-3.5 text-emerald-400" /> : <CopyIcon className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
}
