import { useState, useCallback, useMemo } from "react";
import { CopyIcon, CheckIcon, TrashIcon, AlertCircleIcon, WandIcon, DownloadIcon, UploadIcon, SparklesIcon } from "../components/Icons";

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

function parseJsonError(input) {
  try {
    JSON.parse(input);
    return null;
  } catch (e) {
    const msg = e.message;
    const posMatch = msg.match(/position (\d+)/);
    if (posMatch) {
      const pos = parseInt(posMatch[1], 10);
      const lines = input.slice(0, pos).split("\n");
      return { line: lines.length, col: lines[lines.length - 1].length + 1, message: msg };
    }
    const lineMatch = msg.match(/line (\d+) column (\d+)/);
    if (lineMatch) {
      return { line: parseInt(lineMatch[1], 10), col: parseInt(lineMatch[2], 10), message: msg };
    }
    return { line: null, col: null, message: msg };
  }
}

// Convert JSON to TypeScript interface
function jsonToTypeScript(jsonStr, rootName = "RootObject") {
  try {
    const obj = JSON.parse(jsonStr);
    const interfaces = [];

    function getType(val, keyName) {
      if (val === null) return "any";
      if (Array.isArray(val)) {
        if (val.length === 0) return "any[]";
        return `${getType(val[0], keyName)}[]`;
      }
      if (typeof val === "object") {
        const nestedName = keyName.charAt(0).toUpperCase() + keyName.slice(1);
        generateInterface(val, nestedName);
        return nestedName;
      }
      return typeof val;
    }

    function generateInterface(data, name) {
      if (typeof data !== "object" || data === null || Array.isArray(data)) return;
      let res = `export interface ${name} {\n`;
      for (const [k, v] of Object.entries(data)) {
        const safeKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(k) ? k : `"${k}"`;
        res += `  ${safeKey}: ${getType(v, k)};\n`;
      }
      res += `}\n`;
      interfaces.push(res);
    }

    if (Array.isArray(obj)) {
      if (obj.length > 0 && typeof obj[0] === "object") {
        generateInterface(obj[0], rootName);
        return interfaces.reverse().join("\n") + `\nexport type ${rootName}List = ${rootName}[];`;
      }
      return `export type ${rootName} = any[];`;
    }

    generateInterface(obj, rootName);
    return interfaces.reverse().join("\n");
  } catch (e) {
    return `// Error generating TypeScript: ${e.message}`;
  }
}

// Simple JSON to YAML converter
function jsonToYaml(obj, indent = 0) {
  const pad = "  ".repeat(indent);
  if (obj === null) return "null\n";
  if (typeof obj === "boolean" || typeof obj === "number") return `${obj}\n`;
  if (typeof obj === "string") return `"${obj.replace(/"/g, '\\"')}"\n`;

  if (Array.isArray(obj)) {
    if (obj.length === 0) return "[]\n";
    let res = "\n";
    for (const item of obj) {
      const rendered = jsonToYaml(item, indent + 1);
      res += `${pad}- ${rendered.trimStart()}`;
    }
    return res;
  }

  if (typeof obj === "object") {
    const keys = Object.keys(obj);
    if (keys.length === 0) return "{}\n";
    let res = indent === 0 ? "" : "\n";
    for (const k of keys) {
      const val = obj[k];
      const safeK = /^[a-zA-Z0-9_-]+$/.test(k) ? k : `"${k}"`;
      if (typeof val === "object" && val !== null) {
        res += `${pad}${safeK}:${jsonToYaml(val, indent + 1)}`;
      } else {
        res += `${pad}${safeK}: ${jsonToYaml(val, 0)}`;
      }
    }
    return res;
  }
  return `${obj}\n`;
}

function LineNumbers({ code, errorLine }) {
  const lines = code.split("\n");
  return (
    <div className="select-none text-right pr-3 pt-[14px] font-mono text-xs leading-5 text-gray-600 min-w-[3rem]">
      {lines.map((_, i) => (
        <div key={i} className={`leading-5 ${errorLine === i + 1 ? "text-red-400 font-bold bg-red-950/40 rounded px-1" : ""}`}>
          {i + 1}
        </div>
      ))}
    </div>
  );
}

const SAMPLE_JSON = `{
  "name": "DevToolkit",
  "author": "Rafi",
  "version": "2.0.0",
  "privacy": "100% Client-Side",
  "features": [
    "JSON Formatter & Validator",
    "JWT Decoder",
    "Base64 & Data URL Studio",
    "URL & Query Parser",
    "UUID Generator",
    "Hash & HMAC Tools"
  ],
  "config": {
    "darkMode": true,
    "telemetry": false,
    "theme": "cyan-purple-cyber"
  }
}`;

export default function JsonFormatter() {
  const [input, setInput] = useState(SAMPLE_JSON);
  const [output, setOutput] = useState("");
  const [viewMode, setViewMode] = useState("json"); // json | typescript | yaml
  const [indentSize, setIndentSize] = useState("2"); // 2 | 4 | tab
  const [error, setError] = useState(null);
  const [copied, copy] = useCopy(output || input);

  // Stats calculation
  const stats = useMemo(() => {
    if (!input.trim()) return null;
    try {
      const parsed = JSON.parse(input);
      const byteSize = new Blob([input]).size;
      const countKeys = (o) => (typeof o === "object" && o !== null ? Object.keys(o).reduce((acc, k) => acc + 1 + countKeys(o[k]), 0) : 0);
      const calcDepth = (o) => (typeof o === "object" && o !== null ? 1 + Math.max(0, ...Object.values(o).map(calcDepth)) : 0);
      return {
        valid: true,
        bytes: byteSize > 1024 ? `${(byteSize / 1024).toFixed(1)} KB` : `${byteSize} B`,
        keys: countKeys(parsed),
        depth: calcDepth(parsed),
      };
    } catch {
      return { valid: false };
    }
  }, [input]);

  const format = () => {
    if (!input.trim()) return;
    const err = parseJsonError(input);
    if (err) {
      setError(err);
      setOutput("");
      return;
    }
    setError(null);
    const parsed = JSON.parse(input);
    const space = indentSize === "tab" ? "\t" : parseInt(indentSize, 10);
    setOutput(JSON.stringify(parsed, null, space));
    setViewMode("json");
  };

  const minify = () => {
    if (!input.trim()) return;
    const err = parseJsonError(input);
    if (err) { setError(err); setOutput(""); return; }
    setError(null);
    setOutput(JSON.stringify(JSON.parse(input)));
    setViewMode("json");
  };

  const toTypeScript = () => {
    if (!input.trim()) return;
    const err = parseJsonError(input);
    if (err) { setError(err); setOutput(""); return; }
    setError(null);
    setOutput(jsonToTypeScript(input));
    setViewMode("typescript");
  };

  const toYaml = () => {
    if (!input.trim()) return;
    const err = parseJsonError(input);
    if (err) { setError(err); setOutput(""); return; }
    setError(null);
    try {
      setOutput(jsonToYaml(JSON.parse(input)));
      setViewMode("yaml");
    } catch (e) {
      setError({ line: null, col: null, message: e.message });
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === "string") {
        setInput(content);
        setError(null);
      }
    };
    reader.readAsText(file);
  };

  const downloadOutput = () => {
    const textToDownload = output || input;
    if (!textToDownload) return;
    const ext = viewMode === "typescript" ? "ts" : viewMode === "yaml" ? "yaml" : "json";
    const mime = viewMode === "json" ? "application/json" : "text/plain";
    const blob = new Blob([textToDownload], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `formatted-result.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gray-900/60 p-4 rounded-2xl border border-gray-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">JSON Formatter & Schema Studio</h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/60 font-mono">
              v2.0
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Format, minify, validate, and convert JSON to TypeScript Interfaces or YAML client-side.
          </p>
        </div>

        {/* Quick file and sample buttons */}
        <div className="flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-xs font-medium transition-colors border border-gray-700/60">
            <UploadIcon className="w-3.5 h-3.5" />
            Upload File
            <input type="file" accept=".json,.txt" className="hidden" onChange={handleFileUpload} />
          </label>
          <button
            onClick={() => setInput(SAMPLE_JSON)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-xs font-medium transition-colors border border-gray-700/60"
          >
            <SparklesIcon className="w-3.5 h-3.5 text-cyan-400" />
            Load Sample
          </button>
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-gray-900/40 p-2.5 rounded-xl border border-gray-800/80">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={format}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-lg transition-all shadow-md shadow-cyan-950/50"
          >
            <WandIcon className="w-3.5 h-3.5" />
            Format
          </button>
          <button
            onClick={minify}
            className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-medium rounded-lg transition-colors"
          >
            Minify
          </button>

          <span className="h-4 w-px bg-gray-700 mx-1"></span>

          {/* Indent selector */}
          <div className="flex items-center gap-1 text-xs text-gray-400 bg-gray-800/80 px-2 py-1 rounded-lg border border-gray-700/50">
            <span>Indent:</span>
            <select
              value={indentSize}
              onChange={(e) => setIndentSize(e.target.value)}
              className="bg-transparent text-gray-200 outline-none cursor-pointer"
            >
              <option value="2" className="bg-gray-900">2 Spaces</option>
              <option value="4" className="bg-gray-900">4 Spaces</option>
              <option value="tab" className="bg-gray-900">Tab</option>
            </select>
          </div>

          <span className="h-4 w-px bg-gray-700 mx-1"></span>

          {/* Converters */}
          <button
            onClick={toTypeScript}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              viewMode === "typescript" ? "bg-cyan-950 text-cyan-300 border border-cyan-500/50" : "bg-gray-800 hover:bg-gray-700 text-gray-300"
            }`}
          >
            → TypeScript
          </button>
          <button
            onClick={toYaml}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              viewMode === "yaml" ? "bg-cyan-950 text-cyan-300 border border-cyan-500/50" : "bg-gray-800 hover:bg-gray-700 text-gray-300"
            }`}
          >
            → YAML
          </button>
        </div>

        <div className="flex items-center gap-2">
          {stats && stats.valid && (
            <div className="hidden md:flex items-center gap-3 text-[11px] font-mono text-gray-400 bg-gray-950/60 px-2.5 py-1 rounded-lg border border-gray-800">
              <span>Size: <strong className="text-cyan-400">{stats.bytes}</strong></span>
              <span>Keys: <strong className="text-indigo-400">{stats.keys}</strong></span>
              <span>Depth: <strong className="text-purple-400">{stats.depth}</strong></span>
            </div>
          )}
          <button
            onClick={() => { setInput(""); setOutput(""); setError(null); }}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-gray-400 hover:text-red-400 hover:bg-gray-800/80 rounded-lg transition-colors"
          >
            <TrashIcon className="w-3.5 h-3.5" />
            Clear
          </button>
        </div>
      </div>

      {/* Error alert */}
      {error && (
        <div className="flex items-start gap-3 bg-red-950/60 border border-red-700/60 rounded-xl px-4 py-3 text-sm">
          <AlertCircleIcon className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
          <div className="space-y-0.5">
            <span className="text-red-300 font-semibold">
              Syntax Error {error.line ? `(Line ${error.line}, Column ${error.col})` : ""}
            </span>
            <p className="text-red-400/90 font-mono text-xs">{error.message}</p>
          </div>
        </div>
      )}

      {/* Side-by-side Editor Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              Input JSON
              {stats?.valid && <span className="text-emerald-400 text-[10px]">● Valid</span>}
            </label>
          </div>
          <div className={`relative flex bg-gray-900 rounded-xl border overflow-hidden ${error ? "border-red-600/70" : "border-gray-800"}`}>
            <LineNumbers code={input || " "} errorLine={error?.line} />
            <textarea
              className="flex-1 bg-transparent font-mono text-sm text-gray-100 resize-none outline-none pt-[14px] pr-4 pb-4 leading-5 min-h-[440px] placeholder-gray-600"
              placeholder={`{\n  "enter": "json"\n}`}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setError(null);
              }}
              spellCheck={false}
            />
          </div>
        </div>

        {/* Output */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
              Output {viewMode === "typescript" ? "(TypeScript)" : viewMode === "yaml" ? "(YAML)" : "(Formatted JSON)"}
            </label>
            <div className="flex items-center gap-2">
              {(output || input) && (
                <>
                  <button
                    onClick={downloadOutput}
                    className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors"
                  >
                    <DownloadIcon className="w-3.5 h-3.5" />
                    Download
                  </button>
                  <button
                    onClick={copy}
                    className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors"
                  >
                    {copied ? <CheckIcon className="w-3.5 h-3.5 text-emerald-400" /> : <CopyIcon className="w-3.5 h-3.5" />}
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </>
              )}
            </div>
          </div>
          <div className="flex bg-gray-900 rounded-xl border border-gray-800 overflow-hidden min-h-[440px]">
            {output ? (
              <>
                <LineNumbers code={output} errorLine={null} />
                <pre className="flex-1 font-mono text-sm text-cyan-200 pt-[14px] pr-4 pb-4 leading-5 overflow-auto whitespace-pre">{output}</pre>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-600 text-sm gap-2">
                <WandIcon className="w-8 h-8 text-gray-700" />
                <span>Click "Format", "→ TypeScript", or "→ YAML"</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
