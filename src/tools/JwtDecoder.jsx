import { useState, useCallback, useEffect } from "react";
import { CopyIcon, CheckIcon, TrashIcon, AlertCircleIcon, LockIcon, SparklesIcon, ShieldCheckIcon } from "../components/Icons";

function base64UrlDecode(str) {
  str = str.replace(/-/g, "+").replace(/_/g, "/");
  while (str.length % 4) str += "=";
  try {
    return JSON.parse(decodeURIComponent(atob(str).split("").map(c =>
      "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)
    ).join("")));
  } catch {
    return null;
  }
}

function decodeJWT(token) {
  const parts = token.trim().split(".");
  if (parts.length !== 3) return null;
  const header = base64UrlDecode(parts[0]);
  const payload = base64UrlDecode(parts[1]);
  const signature = parts[2];
  if (!header || !payload) return null;
  return { header, payload, signature, raw: { header: parts[0], payload: parts[1], signature: parts[2] } };
}

function formatDate(ts) {
  try {
    return new Date(ts * 1000).toLocaleString();
  } catch {
    return String(ts);
  }
}

function getExpiryRelative(exp) {
  if (!exp) return null;
  const diffSec = exp - Math.floor(Date.now() / 1000);
  if (diffSec <= 0) {
    const pastSec = Math.abs(diffSec);
    if (pastSec < 60) return `Expired ${pastSec}s ago`;
    if (pastSec < 3600) return `Expired ${Math.floor(pastSec / 60)}m ago`;
    if (pastSec < 86400) return `Expired ${Math.floor(pastSec / 3600)}h ago`;
    return `Expired ${Math.floor(pastSec / 86400)}d ago`;
  } else {
    if (diffSec < 60) return `Expires in ${diffSec}s`;
    if (diffSec < 3600) return `Expires in ${Math.floor(diffSec / 60)}m`;
    if (diffSec < 86400) return `Expires in ${Math.floor(diffSec / 3600)}h`;
    return `Expires in ${Math.floor(diffSec / 86400)}d`;
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

const SAMPLE_JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyXzEyMzQ1IiwibmFtZSI6IlJhZmkgQWx0b24iLCJyb2xlIjoiU2VuaW9yIEFyY2hpdGVjdCIsImFkbWluIjp0cnVlLCJpYXQiOjE3OTAxNjAwMDAsImV4cCI6MTgyMTY5NjAwMH0.wM5gY0eRfZvC7QxP1z3o8h4m9k2j5n6l7p8q9r0s1t2";

export default function JwtDecoder() {
  const [token, setToken] = useState(SAMPLE_JWT);
  const [decoded, setDecoded] = useState(null);
  const [error, setError] = useState(null);
  const [secretKey, setSecretKey] = useState("your-256-bit-secret");
  const [sigStatus, setSigStatus] = useState(null); // 'valid' | 'invalid' | null
  const [copiedToken, copyToken] = useCopy(`Authorization: Bearer ${token}`);

  const decode = (val) => {
    setToken(val);
    setSigStatus(null);
    if (!val.trim()) { setDecoded(null); setError(null); return; }
    const result = decodeJWT(val);
    if (!result) {
      setDecoded(null);
      setError("Invalid JWT structure — must contain exactly 3 dot-separated base64url segments.");
    } else {
      setDecoded(result);
      setError(null);
    }
  };

  useEffect(() => {
    decode(SAMPLE_JWT);
  }, []);

  // Client-side HS256 verification via Web Crypto API
  const verifySignature = async () => {
    if (!decoded || !token.trim() || !secretKey) return;
    try {
      const parts = token.trim().split(".");
      if (parts.length !== 3) return;

      const enc = new TextEncoder();
      const keyData = enc.encode(secretKey);
      const data = enc.encode(`${parts[0]}.${parts[1]}`);

      const cryptoKey = await window.crypto.subtle.importKey(
        "raw",
        keyData,
        { name: "HMAC", hash: { name: "SHA-256" } },
        false,
        ["sign"]
      );

      const signatureBuffer = await window.crypto.subtle.sign("HMAC", cryptoKey, data);
      const computedSig = btoa(String.fromCharCode(...new Uint8Array(signatureBuffer)))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");

      if (computedSig === parts[2]) {
        setSigStatus("valid");
      } else {
        setSigStatus("invalid");
      }
    } catch (e) {
      setSigStatus("invalid");
    }
  };

  const isExpired = decoded?.payload?.exp && Date.now() / 1000 > decoded.payload.exp;
  const expiryNote = decoded?.payload?.exp ? getExpiryRelative(decoded.payload.exp) : null;

  return (
    <div className="space-y-4">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gray-900/60 p-4 rounded-2xl border border-gray-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">JWT Decoder & Inspector</h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/60 font-mono">
              HS256 Supported
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Instantly decode, inspect claims, check token expiry, and verify HMAC SHA-256 signatures client-side.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => decode(SAMPLE_JWT)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-xs font-medium transition-colors border border-gray-700/60"
          >
            <SparklesIcon className="w-3.5 h-3.5 text-cyan-400" />
            Load Sample
          </button>
          <button
            onClick={copyToken}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-xs font-medium transition-colors border border-gray-700/60"
          >
            {copiedToken ? <CheckIcon className="w-3.5 h-3.5 text-emerald-400" /> : <CopyIcon className="w-3.5 h-3.5" />}
            Copy as Header
          </button>
        </div>
      </div>

      {/* Input */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Encoded JWT Token</label>
          {token && (
            <button
              onClick={() => { setToken(""); setDecoded(null); setError(null); }}
              className="text-xs text-gray-500 hover:text-red-400 flex items-center gap-1"
            >
              <TrashIcon className="w-3.5 h-3.5" /> Clear
            </button>
          )}
        </div>
        <textarea
          className={`w-full bg-gray-900 rounded-xl border font-mono text-sm text-gray-100 p-4 resize-none outline-none min-h-[90px] placeholder-gray-600 transition-colors ${
            error ? "border-red-700/60" : "border-gray-800 focus:border-cyan-500/50"
          }`}
          placeholder="eyJhbGciOi..."
          value={token}
          onChange={(e) => decode(e.target.value)}
          spellCheck={false}
        />
      </div>

      {/* Token visual representation */}
      {decoded && (
        <div className="bg-gray-900/90 rounded-xl border border-gray-800 p-3 font-mono text-xs leading-6 break-all">
          <span className="text-pink-400 font-medium">{decoded.raw.header}</span>
          <span className="text-gray-500 font-black px-0.5">.</span>
          <span className="text-yellow-400 font-medium">{decoded.raw.payload}</span>
          <span className="text-gray-500 font-black px-0.5">.</span>
          <span className="text-emerald-400 font-medium">{decoded.raw.signature}</span>
        </div>
      )}

      {error && (
        <div className="flex items-start gap-3 bg-red-950/60 border border-red-700/60 rounded-xl px-4 py-3 text-sm">
          <AlertCircleIcon className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
          <span className="text-red-300 font-medium">{error}</span>
        </div>
      )}

      {/* Expiration Banner */}
      {decoded && decoded.payload.exp && (
        <div
          className={`flex items-center justify-between px-4 py-2.5 rounded-xl border text-xs font-medium ${
            isExpired
              ? "bg-red-950/40 border-red-800/60 text-red-300"
              : "bg-emerald-950/40 border-emerald-800/60 text-emerald-300"
          }`}
        >
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isExpired ? "bg-red-500" : "bg-emerald-500"} animate-pulse`} />
            <span>Token Status: <strong>{isExpired ? "Expired" : "Active & Valid"}</strong></span>
          </div>
          <span className="font-mono">{expiryNote}</span>
        </div>
      )}

      {/* Decoded Sections */}
      {decoded && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left Column: Header + Signature */}
          <div className="space-y-4">
            {/* Header */}
            <div className="rounded-xl border border-gray-800 overflow-hidden bg-gray-900/80">
              <div className="flex items-center justify-between px-4 py-2.5 bg-pink-950/30 border-b border-gray-800">
                <span className="text-xs font-bold text-pink-300 uppercase tracking-wider">Header (Algorithm & Token Type)</span>
                <span className="text-[11px] font-mono text-pink-400">{decoded.header.alg || "Unknown"}</span>
              </div>
              <pre className="p-4 font-mono text-xs text-pink-200 overflow-x-auto whitespace-pre">
                {JSON.stringify(decoded.header, null, 2)}
              </pre>
            </div>

            {/* Signature & Verify */}
            <div className="rounded-xl border border-gray-800 overflow-hidden bg-gray-900/80">
              <div className="flex items-center justify-between px-4 py-2.5 bg-emerald-950/30 border-b border-gray-800">
                <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">Signature Verification</span>
                <span className="text-[11px] font-mono text-emerald-400">Web Crypto API</span>
              </div>
              <div className="p-4 space-y-3">
                <div className="font-mono text-xs text-emerald-400/90 break-all bg-gray-950 p-2.5 rounded-lg border border-gray-800">
                  {decoded.raw.signature}
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-gray-400">Verify HMAC-SHA256 with Secret Key:</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter HMAC secret..."
                      value={secretKey}
                      onChange={(e) => { setSecretKey(e.target.value); setSigStatus(null); }}
                      className="flex-1 bg-gray-950 border border-gray-800 rounded-lg px-3 py-1.5 text-xs text-gray-200 font-mono outline-none focus:border-cyan-500/50"
                    />
                    <button
                      onClick={verifySignature}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition-colors"
                    >
                      <ShieldCheckIcon className="w-3.5 h-3.5" />
                      Verify
                    </button>
                  </div>
                  {sigStatus === "valid" && (
                    <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1 mt-1">
                      <CheckIcon className="w-3.5 h-3.5" /> Signature verified successfully!
                    </p>
                  )}
                  {sigStatus === "invalid" && (
                    <p className="text-xs text-red-400 font-semibold flex items-center gap-1 mt-1">
                      <AlertCircleIcon className="w-3.5 h-3.5" /> Signature does not match secret.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Payload Claims */}
          <div className="rounded-xl border border-gray-800 overflow-hidden bg-gray-900/80">
            <div className="flex items-center justify-between px-4 py-2.5 bg-yellow-950/30 border-b border-gray-800">
              <span className="text-xs font-bold text-yellow-300 uppercase tracking-wider">Payload (Claims & Data)</span>
              <span className="text-[11px] font-mono text-yellow-400">{Object.keys(decoded.payload).length} claims</span>
            </div>
            <div className="p-4 space-y-3">
              {/* Claims breakdown */}
              <div className="divide-y divide-gray-800 border border-gray-800 rounded-lg overflow-hidden bg-gray-950/60">
                {Object.entries(decoded.payload).map(([k, v]) => {
                  const isTime = ["exp", "iat", "nbf"].includes(k) && typeof v === "number";
                  return (
                    <div key={k} className="p-2.5 flex items-start gap-3">
                      <span className="font-mono text-xs font-bold text-cyan-400 w-16 shrink-0 pt-0.5">{k}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-mono text-gray-200 break-all">{JSON.stringify(v)}</div>
                        {isTime && (
                          <div className="text-[11px] text-gray-500 font-sans mt-0.5">
                            Formatted: {formatDate(v)}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Raw JSON */}
              <pre className="p-3 bg-gray-950 font-mono text-xs text-yellow-200/90 rounded-lg border border-gray-800 overflow-x-auto whitespace-pre">
                {JSON.stringify(decoded.payload, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
