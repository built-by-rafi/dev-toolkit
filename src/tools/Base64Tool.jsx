import { useState, useCallback } from "react";
import { CopyIcon, CheckIcon, TrashIcon, AlertCircleIcon, ArrowRightIcon, FileImageIcon, UploadIcon } from "../components/Icons";

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
    throw new Error("Invalid Base64 sequence: " + e.message);
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

export default function Base64Tool() {
  const [activeSubTab, setActiveSubTab] = useState("text"); // 'text' | 'image'
  const [mode, setMode] = useState("standard"); // 'standard' | 'url'

  // Text state
  const [encodeInput, setEncodeInput] = useState("Welcome to DevToolkit — built with high privacy & performance by Rafi!");
  const [encodeOutput, setEncodeOutput] = useState("");
  const [encodeError, setEncodeError] = useState(null);
  const [decodeInput, setDecodeInput] = useState("");
  const [decodeOutput, setDecodeOutput] = useState("");
  const [decodeError, setDecodeError] = useState(null);

  // File / Image state
  const [fileDataUrl, setFileDataUrl] = useState("");
  const [fileMeta, setFileMeta] = useState(null);

  const [copiedEncode, copyEncode] = useCopy(encodeOutput);
  const [copiedDecode, copyDecode] = useCopy(decodeOutput);
  const [copiedDataUrl, copyDataUrl] = useCopy(fileDataUrl);
  const [copiedCss, copyCss] = useCopy(`background-image: url("${fileDataUrl}");`);
  const [copiedHtml, copyHtml] = useCopy(`<img src="${fileDataUrl}" alt="${fileMeta?.name || 'image'}" />`);

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

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result;
      if (typeof dataUrl === "string") {
        setFileDataUrl(dataUrl);
        setFileMeta({
          name: file.name,
          size: file.size,
          type: file.type || "application/octet-stream",
          b64Length: dataUrl.length,
        });
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4">
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gray-900/60 p-4 rounded-2xl border border-gray-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">Base64 & Data URL Studio</h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/60 font-mono">
              RFC 4648
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Encode and decode text, or convert images & assets to embedded Base64 Data URLs.
          </p>
        </div>

        {/* Sub-tab switcher */}
        <div className="flex items-center bg-gray-950 p-1 rounded-xl border border-gray-800">
          <button
            onClick={() => setActiveSubTab("text")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === "text" ? "bg-cyan-600 text-white shadow-sm" : "text-gray-400 hover:text-white"
            }`}
          >
            Text Mode
          </button>
          <button
            onClick={() => setActiveSubTab("image")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === "image" ? "bg-cyan-600 text-white shadow-sm" : "text-gray-400 hover:text-white"
            }`}
          >
            <FileImageIcon className="w-3.5 h-3.5" />
            Image & File to Data URL
          </button>
        </div>
      </div>

      {activeSubTab === "text" ? (
        <div className="space-y-4">
          {/* Format selection */}
          <div className="flex items-center justify-between bg-gray-900/40 p-2.5 rounded-xl border border-gray-800">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 font-medium">Standard / Variant:</span>
              <div className="flex items-center gap-1 bg-gray-950 p-0.5 rounded-lg border border-gray-800">
                <button
                  onClick={() => { setMode("standard"); handleEncode(encodeInput); }}
                  className={`px-2.5 py-1 text-xs rounded-md font-medium transition-all ${
                    mode === "standard" ? "bg-cyan-950 text-cyan-300 border border-cyan-700/50" : "text-gray-400 hover:text-white"
                  }`}
                >
                  Standard Base64
                </button>
                <button
                  onClick={() => { setMode("url"); handleEncode(encodeInput); }}
                  className={`px-2.5 py-1 text-xs rounded-md font-medium transition-all ${
                    mode === "url" ? "bg-cyan-950 text-cyan-300 border border-cyan-700/50" : "text-gray-400 hover:text-white"
                  }`}
                >
                  URL-Safe (-_)
                </button>
              </div>
            </div>
            <button
              onClick={() => { setEncodeInput(""); setEncodeOutput(""); setDecodeInput(""); setDecodeOutput(""); }}
              className="text-xs text-gray-400 hover:text-red-400 flex items-center gap-1 transition-colors"
            >
              <TrashIcon className="w-3.5 h-3.5" /> Clear All
            </button>
          </div>

          {/* Encoder Section */}
          <div className="bg-gray-900/60 rounded-2xl border border-gray-800 p-4 space-y-3">
            <h2 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Encode (Text → Base64)</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-gray-400">Plaintext Input</label>
                <textarea
                  className="w-full bg-gray-950 rounded-xl border border-gray-800 p-3 font-mono text-xs text-gray-200 resize-none outline-none focus:border-cyan-500/50 min-h-[140px]"
                  placeholder="Enter text to encode..."
                  value={encodeInput}
                  onChange={(e) => handleEncode(e.target.value)}
                  spellCheck={false}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs text-gray-400">Base64 Output</label>
                  {encodeOutput && (
                    <button onClick={copyEncode} className="text-xs text-gray-400 hover:text-white flex items-center gap-1">
                      {copiedEncode ? <CheckIcon className="w-3 h-3 text-emerald-400" /> : <CopyIcon className="w-3 h-3" />}
                      Copy
                    </button>
                  )}
                </div>
                <textarea
                  className="w-full bg-gray-950 rounded-xl border border-gray-800 p-3 font-mono text-xs text-cyan-300 resize-none outline-none min-h-[140px]"
                  readOnly
                  placeholder="Base64 output..."
                  value={encodeOutput}
                />
              </div>
            </div>
            {encodeError && (
              <p className="text-xs text-red-400 flex items-center gap-1">
                <AlertCircleIcon className="w-3.5 h-3.5" /> {encodeError}
              </p>
            )}
          </div>

          {/* Decoder Section */}
          <div className="bg-gray-900/60 rounded-2xl border border-gray-800 p-4 space-y-3">
            <h2 className="text-xs font-bold text-purple-400 uppercase tracking-wider">Decode (Base64 → Text)</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-gray-400">Base64 Input</label>
                <textarea
                  className="w-full bg-gray-950 rounded-xl border border-gray-800 p-3 font-mono text-xs text-gray-200 resize-none outline-none focus:border-purple-500/50 min-h-[140px]"
                  placeholder="Paste Base64 string to decode..."
                  value={decodeInput}
                  onChange={(e) => handleDecode(e.target.value)}
                  spellCheck={false}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs text-gray-400">Decoded Plaintext</label>
                  {decodeOutput && (
                    <button onClick={copyDecode} className="text-xs text-gray-400 hover:text-white flex items-center gap-1">
                      {copiedDecode ? <CheckIcon className="w-3 h-3 text-emerald-400" /> : <CopyIcon className="w-3 h-3" />}
                      Copy
                    </button>
                  )}
                </div>
                <textarea
                  className="w-full bg-gray-950 rounded-xl border border-gray-800 p-3 font-mono text-xs text-purple-300 resize-none outline-none min-h-[140px]"
                  readOnly
                  placeholder="Plaintext output..."
                  value={decodeOutput}
                />
              </div>
            </div>
            {decodeError && (
              <p className="text-xs text-red-400 flex items-center gap-1">
                <AlertCircleIcon className="w-3.5 h-3.5" /> {decodeError}
              </p>
            )}
          </div>
        </div>
      ) : (
        /* Image / File Data URL Mode */
        <div className="space-y-4">
          <div className="bg-gray-900/60 rounded-2xl border border-gray-800 p-6 flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-950/80 border border-cyan-800/60 flex items-center justify-center text-cyan-400">
              <FileImageIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Upload Image or File for Base64 Data URL</h3>
              <p className="text-xs text-gray-400 mt-1 max-w-md">
                Convert PNG, JPG, SVG, WebP, or any file into an inlined Base64 Data URL ready for CSS or HTML.
              </p>
            </div>
            <label className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-cyan-950/50 transition-all">
              <UploadIcon className="w-4 h-4" />
              Choose File to Convert
              <input type="file" className="hidden" onChange={handleFileUpload} />
            </label>
          </div>

          {fileDataUrl && fileMeta && (
            <div className="bg-gray-900/60 rounded-2xl border border-gray-800 p-4 space-y-4">
              {/* File Info Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-800">
                <div className="flex items-center gap-3">
                  {fileMeta.type.startsWith("image/") && (
                    <img src={fileDataUrl} alt="Preview" className="w-12 h-12 object-contain bg-gray-950 rounded-lg border border-gray-800 p-1" />
                  )}
                  <div>
                    <h4 className="text-xs font-bold text-white">{fileMeta.name}</h4>
                    <p className="text-[11px] text-gray-400 font-mono">
                      Type: {fileMeta.type} · Size: {(fileMeta.size / 1024).toFixed(1)} KB (Base64: {(fileMeta.b64Length / 1024).toFixed(1)} KB)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={copyDataUrl}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-cyan-300 rounded-lg text-xs font-semibold border border-cyan-800/40 transition-colors"
                  >
                    {copiedDataUrl ? <CheckIcon className="w-3.5 h-3.5 text-emerald-400" /> : <CopyIcon className="w-3.5 h-3.5" />}
                    Copy Data URL
                  </button>
                  <button
                    onClick={copyCss}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-purple-300 rounded-lg text-xs font-semibold border border-purple-800/40 transition-colors"
                  >
                    {copiedCss ? <CheckIcon className="w-3.5 h-3.5 text-emerald-400" /> : <CopyIcon className="w-3.5 h-3.5" />}
                    Copy CSS Snippet
                  </button>
                  <button
                    onClick={copyHtml}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-yellow-300 rounded-lg text-xs font-semibold border border-yellow-800/40 transition-colors"
                  >
                    {copiedHtml ? <CheckIcon className="w-3.5 h-3.5 text-emerald-400" /> : <CopyIcon className="w-3.5 h-3.5" />}
                    Copy &lt;img&gt;
                  </button>
                </div>
              </div>

              {/* Data URL preview */}
              <div className="space-y-1.5">
                <label className="text-xs text-gray-400">Raw Data URL String</label>
                <textarea
                  className="w-full bg-gray-950 rounded-xl border border-gray-800 p-3 font-mono text-xs text-cyan-200/90 resize-none outline-none min-h-[100px]"
                  readOnly
                  value={fileDataUrl}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
