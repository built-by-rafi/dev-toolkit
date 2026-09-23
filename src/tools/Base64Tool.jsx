import { useState, useCallback } from "react";
import { CopyIcon, CheckIcon, TrashIcon, AlertCircleIcon, ArrowRightIcon } from "../components/Icons";

// ── helpers ──────────────────────────────────────────────────────────────────

function encode(input, mode) {
  try {
    if (mode === "standard") return btoa(unescape(encodeURIComponent(input)));
    if (mode === "url") return btoa(unescape(encodeURIComponent(input))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
    return "";
  } catch (e) {
    throw new Error("Cannot encode: " + e.message);
  }
}

function decode(input, mode) {
  try {
    let s = input.trim();
    if (mode === "url") {
      s = s.replace(/-/g, "+").replace(/_/g, "/");
      while (s.length % 4) s += "=";
    }
    return decodeURIComponent(escape(atob(s)));
  } catch (e) {
    throw new Error("Invalid Base64: " + e.message);
  }
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

// ── Sub-component ─────────────────────────────────────────────────────────────

function Panel({ label, value, onChange, readonly = false, placeholder = "" }) {
  const [copied, copy] = useCopy(value);
  return (
    <div className="flex flex-col gap-2 flex-1">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</label>
        {value && readonly && (
          <button onClick={copy} className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors">
            {copied ? <CheckIcon className="w-3.5 h-3.5 text-emerald-400" /> : <CopyIcon className="w-3.5 h-3.5" />}
            {copied ? "Copied!" : "Copy"}
          </button>
        )}
      </div>
      <textarea
        className={`w-full bg-gray-900 rounded-xl border border-gray-700/60 font-mono text-sm text-gray-100 p-4 resize-none outline-none placeholder-gray-600 min-h-[220px] ${
          readonly
            ? "focus:ring-0 cursor-default select-all"
            : "focus:ring-2 focus:ring-violet-500/50"
        }`}
        placeholder={placeholder}
        value={value}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        readOnly={readonly}
        spellCheck={false}
      />
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────

export default function Base64Tool() {
  const [mode, setMode] = useState("standard"); // standard | url
  const [encodeInput, setEncodeInput] = useState("");
  const [encodeOutput, setEncodeOutput] = useState("");
  const [encodeError, setEncodeError] = useState(null);

  const [decodeInput, setDecodeInput] = useState("");
  const [decodeOutput, setDecodeOutput] = useState("");
  const [decodeError, setDecodeError] = useState(null);

  const handleEncode = (val) => {
    setEncodeInput(val);
    setEncodeError(null);
    if (!val) { setEncodeOutput(""); return; }
    try { setEncodeOutput(encode(val, mode)); }
    catch (e) { setEncodeError(e.message); setEncodeOutput(""); }
  };

  const handleDecode = (val) => {
    setDecodeInput(val);
    setDecodeError(null);
    if (!val.trim()) { setDecodeOutput(""); return; }
    try { setDecodeOutput(decode(val, mode)); }
    catch (e) { setDecodeError(e.message); setDecodeOutput(""); }
  };

  const changeMode = (m) => {
    setMode(m);
    // Re-run with new mode
    setEncodeError(null);
    setDecodeError(null);
    if (encodeInput) {
      try { setEncodeOutput(encode(encodeInput, m)); } catch (e) { setEncodeError(e.message); }
    }
    if (decodeInput) {
      try { setDecodeOutput(decode(decodeInput, m)); } catch (e) { setDecodeError(e.message); }
    }
  };

  const clearAll = () => {
    setEncodeInput(""); setEncodeOutput(""); setEncodeError(null);
    setDecodeInput(""); setDecodeOutput(""); setDecodeError(null);
  };

  return (
    <div className="space-y-5">
      {/* Title */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-white">Base64 Encoder / Decoder</h1>
          <p className="text-sm text-gray-400 mt-0.5">Encode text to Base64 or decode Base64 back to plaintext</p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Mode toggle */}
          <div className="flex items-center gap-1 bg-gray-800 p-1 rounded-lg text-sm">
            {["standard", "url"].map((m) => (
              <button
                key={m}
                onClick={() => changeMode(m)}
                className={`px-3 py-1.5 rounded-md font-medium transition-all duration-200 ${
                  mode === m ? "bg-violet-600 text-white shadow" : "text-gray-400 hover:text-white"
                }`}
              >
                {m === "standard" ? "Standard" : "URL-safe"}
              </button>
            ))}
          </div>
          <button
            onClick={clearAll}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <TrashIcon className="w-4 h-4" /> Clear All
          </button>
        </div>
      </div>

      {/* ── ENCODER ── */}
      <section className="bg-gray-900/50 rounded-2xl border border-gray-800 p-5 space-y-3">
        <h2 className="text-sm font-bold text-violet-400 uppercase tracking-widest">Encoder</h2>
        <div className="flex flex-col lg:flex-row items-stretch gap-4">
          <Panel
            label="Plain Text"
            value={encodeInput}
            onChange={handleEncode}
            placeholder="Type or paste text to encode…"
          />
          <div className="flex items-center justify-center lg:py-0 py-2 shrink-0">
            <div className="flex flex-col items-center gap-1">
              <ArrowRightIcon className="w-5 h-5 text-violet-400 hidden lg:block" />
              <span className="text-xs text-gray-600 hidden lg:block">encode</span>
              <ArrowRightIcon className="w-5 h-5 text-violet-400 rotate-90 lg:hidden" />
            </div>
          </div>
          <Panel
            label={`Base64 ${mode === "url" ? "(URL-safe)" : "(Standard)"}`}
            value={encodeOutput}
            readonly
            placeholder="Encoded output…"
          />
        </div>
        {encodeError && (
          <div className="flex items-start gap-2 text-sm text-red-400">
            <AlertCircleIcon className="w-4 h-4 shrink-0 mt-0.5" />
            {encodeError}
          </div>
        )}
      </section>

      {/* ── DECODER ── */}
      <section className="bg-gray-900/50 rounded-2xl border border-gray-800 p-5 space-y-3">
        <h2 className="text-sm font-bold text-yellow-400 uppercase tracking-widest">Decoder</h2>
        <div className="flex flex-col lg:flex-row items-stretch gap-4">
          <Panel
            label={`Base64 ${mode === "url" ? "(URL-safe)" : "(Standard)"}`}
            value={decodeInput}
            onChange={handleDecode}
            placeholder="Paste Base64 string to decode…"
          />
          <div className="flex items-center justify-center shrink-0">
            <div className="flex flex-col items-center gap-1">
              <ArrowRightIcon className="w-5 h-5 text-yellow-400 hidden lg:block" />
              <span className="text-xs text-gray-600 hidden lg:block">decode</span>
              <ArrowRightIcon className="w-5 h-5 text-yellow-400 rotate-90 lg:hidden" />
            </div>
          </div>
          <Panel
            label="Plain Text"
            value={decodeOutput}
            readonly
            placeholder="Decoded output…"
          />
        </div>
        {decodeError && (
          <div className="flex items-start gap-2 text-sm text-red-400">
            <AlertCircleIcon className="w-4 h-4 shrink-0 mt-0.5" />
            {decodeError}
          </div>
        )}
      </section>
    </div>
  );
}
