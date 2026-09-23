import { useState, useCallback } from "react";
import { CopyIcon, CheckIcon, TrashIcon, LinkIcon, PlusIcon, SparklesIcon } from "../components/Icons";

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

const SAMPLE_URL = "https://api.example.com/v1/search?query=react+developer&category=tools&limit=25&active=true#section-results";

export default function UrlTool() {
  const [urlInput, setUrlInput] = useState(SAMPLE_URL);
  const [parsedParams, setParsedParams] = useState([]);
  const [baseUrl, setBaseUrl] = useState("");
  const [hash, setHash] = useState("");
  const [encodeInput, setEncodeInput] = useState("");
  const [encodeOutput, setEncodeOutput] = useState("");
  const [decodeInput, setDecodeInput] = useState("");
  const [decodeOutput, setDecodeOutput] = useState("");

  const [copiedUrl, copyUrl] = useCopy(urlInput);

  // Parse URL into base and key-value params
  const parseUrl = (fullUrl) => {
    try {
      const parsed = new URL(fullUrl.trim());
      setBaseUrl(`${parsed.origin}${parsed.pathname}`);
      setHash(parsed.hash);
      const params = [];
      parsed.searchParams.forEach((value, key) => {
        params.push({ key, value, id: Math.random().toString() });
      });
      setParsedParams(params);
    } catch {
      // Manual fallback if not full URL with protocol
      const parts = fullUrl.split("?");
      setBaseUrl(parts[0] || "");
      if (parts[1]) {
        const queryAndHash = parts[1].split("#");
        setHash(queryAndHash[1] ? `#${queryAndHash[1]}` : "");
        const search = queryAndHash[0];
        const params = [];
        search.split("&").forEach((pair) => {
          if (!pair) return;
          const [k, v] = pair.split("=");
          params.push({
            key: decodeURIComponent(k || ""),
            value: decodeURIComponent(v || ""),
            id: Math.random().toString()
          });
        });
        setParsedParams(params);
      } else {
        setParsedParams([]);
        setHash("");
      }
    }
  };

  const handleUrlChange = (val) => {
    setUrlInput(val);
    parseUrl(val);
  };

  // Reconstruct URL when query params table is edited
  const rebuildUrl = (newBase, newParams, newHash) => {
    let q = "";
    if (newParams.length > 0) {
      const searchParams = new URLSearchParams();
      newParams.forEach(({ key, value }) => {
        if (key.trim()) searchParams.append(key, value);
      });
      const qs = searchParams.toString();
      if (qs) q = `?${qs}`;
    }
    const finalUrl = `${newBase}${q}${newHash}`;
    setUrlInput(finalUrl);
  };

  const updateParam = (id, field, value) => {
    const updated = parsedParams.map((p) => (p.id === id ? { ...p, [field]: value } : p));
    setParsedParams(updated);
    rebuildUrl(baseUrl, updated, hash);
  };

  const removeParam = (id) => {
    const updated = parsedParams.filter((p) => p.id !== id);
    setParsedParams(updated);
    rebuildUrl(baseUrl, updated, hash);
  };

  const addParam = () => {
    const newEntry = { key: "new_param", value: "value", id: Math.random().toString() };
    const updated = [...parsedParams, newEntry];
    setParsedParams(updated);
    rebuildUrl(baseUrl, updated, hash);
  };

  // Quick encoder / decoder
  const handleEncode = (text) => {
    setEncodeInput(text);
    try {
      setEncodeOutput(encodeURIComponent(text));
    } catch {
      setEncodeOutput("");
    }
  };

  const handleDecode = (text) => {
    setDecodeInput(text);
    try {
      setDecodeOutput(decodeURIComponent(text));
    } catch {
      setDecodeOutput("");
    }
  };

  return (
    <div className="space-y-4">
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gray-900/60 p-4 rounded-2xl border border-gray-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">URL & Query Parameter Studio</h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/60 font-mono">
              RFC 3986
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Break down URLs into interactive editable query parameters, encode/decode components in real-time.
          </p>
        </div>

        <button
          onClick={() => handleUrlChange(SAMPLE_URL)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-xs font-medium transition-colors border border-gray-700/60 self-start sm:self-auto"
        >
          <SparklesIcon className="w-3.5 h-3.5 text-cyan-400" />
          Load Sample URL
        </button>
      </div>

      {/* Main URL Inspector & Editor */}
      <div className="bg-gray-900/60 rounded-2xl border border-gray-800 p-4 space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
              <LinkIcon className="w-3.5 h-3.5" />
              Full URL
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={copyUrl}
                className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors"
              >
                {copiedUrl ? <CheckIcon className="w-3.5 h-3.5 text-emerald-400" /> : <CopyIcon className="w-3.5 h-3.5" />}
                Copy URL
              </button>
              <button
                onClick={() => handleUrlChange("")}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-400 transition-colors"
              >
                <TrashIcon className="w-3.5 h-3.5" /> Clear
              </button>
            </div>
          </div>
          <input
            type="text"
            className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 font-mono text-xs text-cyan-300 outline-none focus:border-cyan-500/50"
            placeholder="https://example.com/api?key=value..."
            value={urlInput}
            onChange={(e) => handleUrlChange(e.target.value)}
          />
        </div>

        {/* Interactive Query Parameter Table */}
        <div className="space-y-3 pt-2 border-t border-gray-800">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider">
              Query Parameters ({parsedParams.length})
            </h3>
            <button
              onClick={addParam}
              className="flex items-center gap-1 px-2.5 py-1 bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 rounded-lg text-xs font-semibold border border-cyan-800/50 transition-colors"
            >
              <PlusIcon className="w-3 h-3" />
              Add Parameter
            </button>
          </div>

          {parsedParams.length === 0 ? (
            <div className="py-6 text-center text-xs text-gray-500 bg-gray-950/50 rounded-xl border border-gray-800/60">
              No query parameters detected. Click "Add Parameter" to append new search params!
            </div>
          ) : (
            <div className="space-y-2">
              {parsedParams.map((param) => (
                <div key={param.id} className="flex items-center gap-2 bg-gray-950 p-2 rounded-xl border border-gray-800">
                  <input
                    type="text"
                    value={param.key}
                    placeholder="Key"
                    onChange={(e) => updateParam(param.id, "key", e.target.value)}
                    className="flex-1 bg-transparent px-2.5 py-1 font-mono text-xs text-cyan-400 border border-gray-800 rounded-lg outline-none focus:border-cyan-500/50"
                  />
                  <span className="text-gray-600 font-bold">=</span>
                  <input
                    type="text"
                    value={param.value}
                    placeholder="Value"
                    onChange={(e) => updateParam(param.id, "value", e.target.value)}
                    className="flex-1 bg-transparent px-2.5 py-1 font-mono text-xs text-gray-200 border border-gray-800 rounded-lg outline-none focus:border-cyan-500/50"
                  />
                  <button
                    onClick={() => removeParam(param.id)}
                    className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-gray-900 rounded-lg transition-colors"
                  >
                    <TrashIcon className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Component Encoder / Decoder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Encoder */}
        <div className="bg-gray-900/60 rounded-2xl border border-gray-800 p-4 space-y-2">
          <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">
            Quick URL Component Encode
          </label>
          <input
            type="text"
            placeholder="Text with spaces, ?, &, / ..."
            value={encodeInput}
            onChange={(e) => handleEncode(e.target.value)}
            className="w-full bg-gray-950 border border-gray-800 rounded-xl p-2.5 font-mono text-xs text-gray-200 outline-none focus:border-cyan-500/50"
          />
          <div className="pt-1">
            <span className="text-[11px] text-gray-500">Encoded Result:</span>
            <div className="mt-1 p-2.5 bg-gray-950 rounded-xl border border-gray-800 font-mono text-xs text-cyan-300 break-all select-all min-h-[38px]">
              {encodeOutput || "—"}
            </div>
          </div>
        </div>

        {/* Decoder */}
        <div className="bg-gray-900/60 rounded-2xl border border-gray-800 p-4 space-y-2">
          <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">
            Quick URL Component Decode
          </label>
          <input
            type="text"
            placeholder="Paste %20, %2F encoded string..."
            value={decodeInput}
            onChange={(e) => handleDecode(e.target.value)}
            className="w-full bg-gray-950 border border-gray-800 rounded-xl p-2.5 font-mono text-xs text-gray-200 outline-none focus:border-purple-500/50"
          />
          <div className="pt-1">
            <span className="text-[11px] text-gray-500">Decoded Result:</span>
            <div className="mt-1 p-2.5 bg-gray-950 rounded-xl border border-gray-800 font-mono text-xs text-purple-300 break-all select-all min-h-[38px]">
              {decodeOutput || "—"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
