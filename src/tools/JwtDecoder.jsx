import { useState, useCallback } from "react";
import { CopyIcon, CheckIcon, TrashIcon, AlertCircleIcon, LockIcon, InfoIcon } from "../components/Icons";

// ── helpers ──────────────────────────────────────────────────────────────────

function base64UrlDecode(str) {
  // Pad to multiple of 4
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
  return { header, payload, signature, raw: { header: parts[0], payload: parts[1] } };
}

function formatDate(ts) {
  try {
    return new Date(ts * 1000).toLocaleString();
  } catch {
    return String(ts);
  }
}

function isExpired(payload) {
  return payload.exp && Date.now() / 1000 > payload.exp;
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

// ── Sub-components ───────────────────────────────────────────────────────────

function JsonBlock({ label, color, data, rawB64 }) {
  const str = JSON.stringify(data, null, 2);
  const [copied, copy] = useCopy(str);
  return (
    <div className="rounded-xl border border-gray-700/60 overflow-hidden">
      <div className={`flex items-center justify-between px-4 py-2.5 border-b border-gray-700/60 ${color}`}>
        <span className="text-sm font-semibold text-white">{label}</span>
        <button
          onClick={copy}
          className="flex items-center gap-1.5 text-xs text-gray-300 hover:text-white transition-colors"
        >
          {copied ? <CheckIcon className="w-3.5 h-3.5 text-emerald-400" /> : <CopyIcon className="w-3.5 h-3.5" />}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <div className="bg-gray-900 px-4 py-3">
        {rawB64 && (
          <p className="font-mono text-xs text-gray-500 mb-2 break-all border-b border-gray-800 pb-2">{rawB64}</p>
        )}
        <pre className="font-mono text-sm text-gray-100 whitespace-pre-wrap break-words leading-5">{str}</pre>
      </div>
    </div>
  );
}

function ClaimRow({ k, v, payload }) {
  const knownClaims = {
    iss: "Issuer", sub: "Subject", aud: "Audience",
    exp: "Expiration", iat: "Issued At", nbf: "Not Before",
    jti: "JWT ID",
  };
  const label = knownClaims[k];
  const isTime = ["exp", "iat", "nbf"].includes(k);
  const displayVal = isTime ? formatDate(v) : JSON.stringify(v);
  const isExpiredClaim = k === "exp" && isExpired(payload);

  return (
    <div className="flex items-start gap-3 py-2 border-b border-gray-800/70 last:border-0">
      <span className="font-mono text-xs text-violet-400 w-12 shrink-0 pt-0.5">{k}</span>
      <div className="flex-1 min-w-0">
        {label && <div className="text-xs text-gray-500 mb-0.5">{label}</div>}
        <div className={`text-sm break-all ${isExpiredClaim ? "text-red-400" : "text-gray-200"}`}>
          {displayVal}
          {isExpiredClaim && <span className="ml-2 text-xs bg-red-900/60 text-red-400 px-1.5 py-0.5 rounded-md border border-red-700/40">EXPIRED</span>}
        </div>
      </div>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────

export default function JwtDecoder() {
  const [token, setToken] = useState("");
  const [decoded, setDecoded] = useState(null);
  const [error, setError] = useState(null);

  const decode = (val) => {
    setToken(val);
    if (!val.trim()) { setDecoded(null); setError(null); return; }
    const result = decodeJWT(val);
    if (!result) {
      setDecoded(null);
      setError("Invalid JWT — must have 3 base64url-encoded parts separated by dots.");
    } else {
      setDecoded(result);
      setError(null);
    }
  };

  const clear = () => { setToken(""); setDecoded(null); setError(null); };

  const expired = decoded ? isExpired(decoded.payload) : false;

  return (
    <div className="space-y-4">
      {/* Title */}
      <div>
        <h1 className="text-xl font-bold text-white">JWT Decoder</h1>
        <p className="text-sm text-gray-400 mt-0.5">Instantly split and decode JWT header, payload, and signature</p>
      </div>

      {/* Privacy note */}
      <div className="flex items-start gap-2 bg-blue-950/40 border border-blue-800/40 rounded-xl px-4 py-2.5 text-xs text-blue-300">
        <LockIcon className="w-3.5 h-3.5 mt-0.5 shrink-0" />
        Tokens are decoded entirely in your browser. Nothing is transmitted or stored.
      </div>

      {/* Token input */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Encoded Token</label>
          {token && (
            <button onClick={clear} className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-300 transition-colors">
              <TrashIcon className="w-3.5 h-3.5" /> Clear
            </button>
          )}
        </div>
        <textarea
          id="jwt-input"
          className={`w-full bg-gray-900 rounded-xl border font-mono text-sm text-gray-100 p-4 resize-none outline-none focus:ring-2 focus:ring-violet-500/50 min-h-[100px] placeholder-gray-600 transition-colors ${
            error ? "border-red-700/60" : "border-gray-700/60"
          }`}
          placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0IiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
          value={token}
          onChange={(e) => decode(e.target.value)}
          spellCheck={false}
        />
      </div>

      {/* Colorful token visualisation */}
      {decoded && (
        <div className="bg-gray-900 rounded-xl border border-gray-700/60 p-4 font-mono text-sm leading-6 break-all">
          <span className="text-pink-400">{decoded.raw.header}</span>
          <span className="text-gray-600">.</span>
          <span className="text-yellow-400">{decoded.raw.payload}</span>
          <span className="text-gray-600">.</span>
          <span className="text-emerald-400">{decoded.signature}</span>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 bg-red-950/60 border border-red-700/60 rounded-xl px-4 py-3 text-sm">
          <AlertCircleIcon className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
          <span className="text-red-300">{error}</span>
        </div>
      )}

      {/* Expiry warning */}
      {decoded && expired && (
        <div className="flex items-center gap-2 bg-orange-950/60 border border-orange-700/60 rounded-xl px-4 py-2.5 text-sm text-orange-300">
          <InfoIcon className="w-4 h-4 shrink-0" />
          This token has <strong className="ml-1">expired</strong>.
        </div>
      )}

      {/* Decoded sections */}
      {decoded && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Header */}
          <div className="space-y-3">
            <JsonBlock
              label="🩷 Header"
              color="bg-pink-950/40"
              data={decoded.header}
              rawB64={decoded.raw.header}
            />

            {/* Signature info */}
            <div className="rounded-xl border border-gray-700/60 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2.5 bg-emerald-950/40 border-b border-gray-700/60">
                <span className="text-sm font-semibold text-white">💚 Signature</span>
              </div>
              <div className="bg-gray-900 px-4 py-3">
                <p className="font-mono text-xs text-emerald-400 break-all">{decoded.signature}</p>
                <p className="text-xs text-gray-500 mt-2 flex items-center gap-1.5">
                  <LockIcon className="w-3 h-3" />
                  Signature verification requires the secret key and cannot be done client-side without it.
                </p>
              </div>
            </div>
          </div>

          {/* Payload */}
          <div className="space-y-3">
            <div className="rounded-xl border border-gray-700/60 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2.5 bg-yellow-950/40 border-b border-gray-700/60">
                <span className="text-sm font-semibold text-white">💛 Payload — Claims</span>
              </div>
              <div className="bg-gray-900 px-4 py-3 divide-y divide-gray-800/70">
                {Object.entries(decoded.payload).map(([k, v]) => (
                  <ClaimRow key={k} k={k} v={v} payload={decoded.payload} />
                ))}
              </div>
            </div>
            <JsonBlock
              label="Raw Payload JSON"
              color="bg-yellow-950/20"
              data={decoded.payload}
            />
          </div>
        </div>
      )}
    </div>
  );
}
