import { useState, useCallback } from "react";
import { CopyIcon, CheckIcon, TrashIcon, AlertCircleIcon, WandIcon } from "../components/Icons";

// ── helpers ──────────────────────────────────────────────────────────────────

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

function parseJsonError(raw, input) {
  try {
    JSON.parse(input);
    return null;
  } catch (e) {
    const msg = e.message;
    // Extract line/col from common V8 error messages
    const posMatch = msg.match(/position (\d+)/);
    if (posMatch) {
      const pos = parseInt(posMatch[1], 10);
      const lines = input.slice(0, pos).split("\n");
      return { line: lines.length, col: lines[lines.length - 1].length + 1, message: msg };
    }
    return { line: null, col: null, message: msg };
  }
}

function prettyPrint(input) {
  return JSON.stringify(JSON.parse(input), null, 2);
}

// ── Line-numbered textarea renderer ─────────────────────────────────────────

function LineNumbers({ code, errorLine }) {
  const lines = code.split("\n");
  return (
    <div className="select-none text-right pr-3 pt-[14px] font-mono text-xs leading-5 text-gray-600 min-w-[3rem]">
      {lines.map((_, i) => (
        <div
          key={i}
          className={`leading-5 ${errorLine === i + 1 ? "text-red-400 font-bold" : ""}`}
        >
          {i + 1}
        </div>
      ))}
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────

export default function JsonFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState(null);
  const [validMsg, setValidMsg] = useState(null);
  const [copied, copy] = useCopy(output);

  const format = () => {
    if (!input.trim()) return;
    const err = parseJsonError(null, input);
    if (err) {
      setError(err);
      setOutput("");
      setValidMsg(null);
    } else {
      setError(null);
      const pretty = prettyPrint(input);
      setOutput(pretty);
      setValidMsg("Valid JSON ✓");
    }
  };

  const minify = () => {
    if (!input.trim()) return;
    const err = parseJsonError(null, input);
    if (err) { setError(err); setOutput(""); return; }
    setError(null);
    setOutput(JSON.stringify(JSON.parse(input)));
    setValidMsg("Valid JSON ✓");
  };

  const clear = () => { setInput(""); setOutput(""); setError(null); setValidMsg(null); };

  const handleInput = (val) => {
    setInput(val);
    setError(null);
    setValidMsg(null);
    setOutput("");
  };

  const displayCode = output || input;

  return (
    <div className="space-y-4">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">JSON Formatter & Validator</h1>
          <p className="text-sm text-gray-400 mt-0.5">Format, minify, and validate JSON with line-level error detection</p>
        </div>
      </div>

      {/* Action bar */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={format}
          className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
        >
          <WandIcon className="w-4 h-4" />
          Format
        </button>
        <button
          onClick={minify}
          className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-lg transition-colors"
        >
          Minify
        </button>
        <button
          onClick={clear}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-medium rounded-lg transition-colors ml-auto"
        >
          <TrashIcon className="w-4 h-4" />
          Clear
        </button>
      </div>

      {/* Error banner */}
      {error && (
        <div className="flex items-start gap-3 bg-red-950/60 border border-red-700/60 rounded-xl px-4 py-3 text-sm">
          <AlertCircleIcon className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
          <div>
            <span className="text-red-300 font-semibold">
              Syntax Error{error.line ? ` (Line ${error.line}, Col ${error.col})` : ""}
            </span>
            <p className="text-red-400/80 mt-0.5 font-mono text-xs">{error.message}</p>
          </div>
        </div>
      )}

      {/* Valid banner */}
      {validMsg && !error && (
        <div className="flex items-center gap-2 bg-emerald-950/60 border border-emerald-700/60 rounded-xl px-4 py-2.5 text-sm text-emerald-300">
          <CheckIcon className="w-4 h-4" />
          {validMsg}
        </div>
      )}

      {/* Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Input</label>
          <div
            className={`relative flex bg-gray-900 rounded-xl border overflow-hidden ${
              error ? "border-red-700/70" : "border-gray-700/60"
            }`}
          >
            <LineNumbers code={input || " "} errorLine={error?.line} />
            <textarea
              id="json-input"
              className="flex-1 bg-transparent font-mono text-sm text-gray-100 resize-none outline-none pt-[14px] pr-4 pb-4 leading-5 min-h-[420px] placeholder-gray-600"
              placeholder={`{\n  "hello": "world"\n}`}
              value={input}
              onChange={(e) => handleInput(e.target.value)}
              spellCheck={false}
            />
          </div>
        </div>

        {/* Output */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Output</label>
            {output && (
              <button
                onClick={copy}
                className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
              >
                {copied ? <CheckIcon className="w-3.5 h-3.5 text-emerald-400" /> : <CopyIcon className="w-3.5 h-3.5" />}
                {copied ? "Copied!" : "Copy"}
              </button>
            )}
          </div>
          <div className="flex bg-gray-900 rounded-xl border border-gray-700/60 overflow-hidden min-h-[420px]">
            {output ? (
              <>
                <LineNumbers code={output} errorLine={null} />
                <pre className="flex-1 font-mono text-sm text-gray-100 pt-[14px] pr-4 pb-4 leading-5 overflow-auto whitespace-pre">{output}</pre>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-600 text-sm">
                Output will appear here
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
