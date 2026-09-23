import { useState, useEffect, useCallback } from "react";
import { CopyIcon, CheckIcon, TrashIcon, ShieldCheckIcon, SparklesIcon } from "../components/Icons";

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

// Client-side MD5 implementation
function md5(string) {
  function rotateLeft(lValue, iShiftBits) {
    return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
  }
  function addUnsigned(lX, lY) {
    const lX8 = lX & 0x80000000;
    const lY8 = lY & 0x80000000;
    const lX4 = lX & 0x40000000;
    const lY4 = lY & 0x40000000;
    const lResult = (lX & 0x3fffffff) + (lY & 0x3fffffff);
    if (lX4 & lY4) return lResult ^ 0x80000000 ^ lX8 ^ lY8;
    if (lX4 | lY4) {
      if (lResult & 0x40000000) return lResult ^ 0xc0000000 ^ lX8 ^ lY8;
      return lResult ^ 0x40000000 ^ lX8 ^ lY8;
    }
    return lResult ^ lX8 ^ lY8;
  }
  function F(x, y, z) { return (x & y) | (~x & z); }
  function G(x, y, z) { return (x & z) | (y & ~z); }
  function H(x, y, z) { return x ^ y ^ z; }
  function I(x, y, z) { return y ^ (x | ~z); }

  function FF(a, b, c, d, x, s, ac) {
    a = addUnsigned(a, addUnsigned(addUnsigned(F(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }
  function GG(a, b, c, d, x, s, ac) {
    a = addUnsigned(a, addUnsigned(addUnsigned(G(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }
  function HH(a, b, c, d, x, s, ac) {
    a = addUnsigned(a, addUnsigned(addUnsigned(H(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }
  function II(a, b, c, d, x, s, ac) {
    a = addUnsigned(a, addUnsigned(addUnsigned(I(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }

  function convertToWordArray(string) {
    let lWordCount;
    const lMessageLength = string.length;
    const lNumberOfWords_temp1 = lMessageLength + 8;
    const lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
    const lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
    const lWordArray = Array(lNumberOfWords - 1);
    let lBytePosition = 0;
    let lByteCount = 0;
    while (lByteCount < lMessageLength) {
      lWordCount = (lByteCount - (lByteCount % 4)) / 4;
      lBytePosition = (lByteCount % 4) * 8;
      lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
      lByteCount++;
    }
    lWordCount = (lByteCount - (lByteCount % 4)) / 4;
    lBytePosition = (lByteCount % 4) * 8;
    lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
    lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
    lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
    return lWordArray;
  }

  function wordToHex(lValue) {
    let wordToHexValue = "", wordToHexValue_temp = "", lByte, lCount;
    for (lCount = 0; lCount <= 3; lCount++) {
      lByte = (lValue >>> (lCount * 8)) & 255;
      wordToHexValue_temp = "0" + lByte.toString(16);
      wordToHexValue = wordToHexValue + wordToHexValue_temp.substr(wordToHexValue_temp.length - 2, 2);
    }
    return wordToHexValue;
  }

  const x = convertToWordArray(string);
  let a = 0x67452301, b = 0xefcdab89, c = 0x98badcfe, d = 0x10325476;
  const S11 = 7, S12 = 12, S13 = 17, S14 = 22;
  const S21 = 5, S22 = 9, S23 = 14, S24 = 20;
  const S31 = 4, S32 = 11, S33 = 16, S34 = 23;
  const S41 = 6, S42 = 10, S43 = 15, S44 = 21;

  for (let k = 0; k < x.length; k += 16) {
    const AA = a, BB = b, CC = c, DD = d;
    a = FF(a, b, c, d, x[k + 0], S11, 0xd76aa478);
    d = FF(d, a, b, c, x[k + 1], S12, 0xe8c7b756);
    c = FF(c, d, a, b, x[k + 2], S13, 0x242070db);
    b = FF(b, c, d, a, x[k + 3], S14, 0xc1bdceee);
    a = FF(a, b, c, d, x[k + 4], S11, 0xf57c0faf);
    d = FF(d, a, b, c, x[k + 5], S12, 0x4787c62a);
    c = FF(c, d, a, b, x[k + 6], S13, 0xa8304613);
    b = FF(b, c, d, a, x[k + 7], S14, 0xfd469501);
    a = FF(a, b, c, d, x[k + 8], S11, 0x698098d8);
    d = FF(d, a, b, c, x[k + 9], S12, 0x8b44f7af);
    c = FF(c, d, a, b, x[k + 10], S13, 0xffff5bb1);
    b = FF(b, c, d, a, x[k + 11], S14, 0x895cd7be);
    a = FF(a, b, c, d, x[k + 12], S11, 0x6b901122);
    d = FF(d, a, b, c, x[k + 13], S12, 0xfd987193);
    c = FF(c, d, a, b, x[k + 14], S13, 0xa679438e);
    b = FF(b, c, d, a, x[k + 15], S14, 0x49b40821);

    a = GG(a, b, c, d, x[k + 1], S21, 0xf61e2562);
    d = GG(d, a, b, c, x[k + 6], S22, 0xc040b340);
    c = GG(c, d, a, b, x[k + 11], S23, 0x265e5a51);
    b = GG(b, c, d, a, x[k + 0], S24, 0xe9b6c7aa);
    a = GG(a, b, c, d, x[k + 5], S21, 0xd62f105d);
    d = GG(d, a, b, c, x[k + 10], S22, 0x02441453);
    c = GG(c, d, a, b, x[k + 15], S23, 0xd8a1e681);
    b = GG(b, c, d, a, x[k + 4], S24, 0xe7d3fbc8);
    a = GG(a, b, c, d, x[k + 9], S21, 0x21e1cde6);
    d = GG(d, a, b, c, x[k + 14], S22, 0xc33707d6);
    c = GG(c, d, a, b, x[k + 3], S23, 0xf4d50d87);
    b = GG(b, c, d, a, x[k + 8], S24, 0x455a14ed);
    a = GG(a, b, c, d, x[k + 13], S21, 0xa9e3e905);
    d = GG(d, a, b, c, x[k + 2], S22, 0xfcefa3f8);
    c = GG(c, d, a, b, x[k + 7], S23, 0x676f02d9);
    b = GG(b, c, d, a, x[k + 12], S24, 0x8d2a4c8a);

    a = HH(a, b, c, d, x[k + 5], S31, 0xfffa3942);
    d = HH(d, a, b, c, x[k + 8], S32, 0x8771f681);
    c = HH(c, d, a, b, x[k + 11], S33, 0x6d9d6122);
    b = HH(b, c, d, a, x[k + 14], S34, 0xfde5380c);
    a = HH(a, b, c, d, x[k + 1], S31, 0xa4beea44);
    d = HH(d, a, b, c, x[k + 4], S32, 0x4bdecfa9);
    c = HH(c, d, a, b, x[k + 7], S33, 0xf6bb4b60);
    b = HH(b, c, d, a, x[k + 10], S34, 0xbebfbc70);
    a = HH(a, b, c, d, x[k + 13], S31, 0x289b7ec6);
    d = HH(d, a, b, c, x[k + 0], S32, 0xeaa127fa);
    c = HH(c, d, a, b, x[k + 3], S33, 0xd4ef3085);
    b = HH(b, c, d, a, x[k + 6], S34, 0x04881d05);
    a = HH(a, b, c, d, x[k + 9], S31, 0xd9d4d039);
    d = HH(d, a, b, c, x[k + 12], S32, 0xe6db99e5);
    c = HH(c, d, a, b, x[k + 15], S33, 0x1fa27cf8);
    b = HH(b, c, d, a, x[k + 2], S34, 0xc4ac5665);

    a = II(a, b, c, d, x[k + 0], S41, 0xf4292244);
    d = II(d, a, b, c, x[k + 7], S42, 0x432aff97);
    c = II(c, d, a, b, x[k + 14], S43, 0xab9423a7);
    b = II(b, c, d, a, x[k + 5], S44, 0xfc93a039);
    a = II(a, b, c, d, x[k + 12], S41, 0x655b59c3);
    d = II(d, a, b, c, x[k + 3], S42, 0x8f0ccc92);
    c = II(c, d, a, b, x[k + 10], S43, 0xffeff47d);
    b = II(b, c, d, a, x[k + 1], S44, 0x85845dd1);
    a = II(a, b, c, d, x[k + 8], S41, 0x6fa87e4f);
    d = II(d, a, b, c, x[k + 15], S42, 0xfe2ce6e0);
    c = II(c, d, a, b, x[k + 6], S43, 0xa3014314);
    b = II(b, c, d, a, x[k + 13], S44, 0x4e0811a1);
    a = II(a, b, c, d, x[k + 4], S41, 0xf7537e82);
    d = II(d, a, b, c, x[k + 11], S42, 0xbd3af235);
    c = II(c, d, a, b, x[k + 2], S43, 0x2ad7d2bb);
    b = II(b, c, d, a, x[k + 9], S44, 0xeb86d391);

    a = addUnsigned(a, AA);
    b = addUnsigned(b, BB);
    c = addUnsigned(c, CC);
    d = addUnsigned(d, DD);
  }

  return (wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d)).toLowerCase();
}

async function computeWebCryptoHash(algorithm, text) {
  const enc = new TextEncoder();
  const data = enc.encode(text);
  const hashBuffer = await window.crypto.subtle.digest(algorithm, data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function computeHmac(hashName, secret, text) {
  const enc = new TextEncoder();
  const keyData = enc.encode(secret);
  const cryptoKey = await window.crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: { name: hashName } },
    false,
    ["sign"]
  );
  const signature = await window.crypto.subtle.sign("HMAC", cryptoKey, enc.encode(text));
  return Array.from(new Uint8Array(signature)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export default function HashTool() {
  const [input, setInput] = useState("Hello DevToolkit!");
  const [isHmac, setIsHmac] = useState(false);
  const [hmacSecret, setHmacSecret] = useState("secret-key");
  const [hashes, setHashes] = useState({
    md5: "",
    sha1: "",
    sha256: "",
    sha384: "",
    sha512: "",
  });

  const updateHashes = async (text, secret, useHmac) => {
    if (!text) {
      setHashes({ md5: "", sha1: "", sha256: "", sha384: "", sha512: "" });
      return;
    }

    try {
      if (useHmac) {
        const [sha1, sha256, sha384, sha512] = await Promise.all([
          computeHmac("SHA-1", secret, text),
          computeHmac("SHA-256", secret, text),
          computeHmac("SHA-384", secret, text),
          computeHmac("SHA-512", secret, text),
        ]);
        setHashes({ md5: "N/A (HMAC-MD5 requires library)", sha1, sha256, sha384, sha512 });
      } else {
        const [sha1, sha256, sha384, sha512] = await Promise.all([
          computeWebCryptoHash("SHA-1", text),
          computeWebCryptoHash("SHA-256", text),
          computeWebCryptoHash("SHA-384", text),
          computeWebCryptoHash("SHA-512", text),
        ]);
        setHashes({
          md5: md5(text),
          sha1,
          sha256,
          sha384,
          sha512,
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    updateHashes(input, hmacSecret, isHmac);
  }, [input, hmacSecret, isHmac]);

  return (
    <div className="space-y-4">
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gray-900/60 p-4 rounded-2xl border border-gray-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">Hash & HMAC Generator</h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/60 font-mono">
              Web Crypto Native
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Compute MD5, SHA-1, SHA-256, SHA-384, and SHA-512 hashes or keyed HMAC signatures instantly in your browser.
          </p>
        </div>

        {/* HMAC Mode Toggle */}
        <label className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 rounded-xl border border-gray-700/60 cursor-pointer select-none text-xs font-semibold text-gray-200">
          <input
            type="checkbox"
            checked={isHmac}
            onChange={(e) => setIsHmac(e.target.checked)}
            className="rounded accent-cyan-500"
          />
          <span>Enable Keyed HMAC</span>
        </label>
      </div>

      {/* Input text */}
      <div className="bg-gray-900/60 rounded-2xl border border-gray-800 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
            Input Plaintext
          </label>
          <button
            onClick={() => setInput("")}
            className="text-xs text-gray-500 hover:text-red-400 flex items-center gap-1"
          >
            <TrashIcon className="w-3.5 h-3.5" /> Clear
          </button>
        </div>
        <textarea
          className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 font-mono text-xs text-gray-200 resize-none outline-none focus:border-cyan-500/50 min-h-[90px]"
          placeholder="Enter text to hash..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          spellCheck={false}
        />

        {isHmac && (
          <div className="space-y-1.5 pt-2 border-t border-gray-800">
            <label className="text-xs font-semibold text-purple-300">HMAC Secret Key</label>
            <input
              type="text"
              className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 font-mono text-xs text-purple-200 outline-none focus:border-purple-500/50"
              placeholder="Enter secret key for HMAC..."
              value={hmacSecret}
              onChange={(e) => setHmacSecret(e.target.value)}
            />
          </div>
        )}
      </div>

      {/* Hash Results List */}
      <div className="space-y-3">
        <HashRow label={isHmac ? "HMAC-MD5" : "MD5 (128-bit)"} value={hashes.md5} color="text-yellow-400" />
        <HashRow label={isHmac ? "HMAC-SHA1" : "SHA-1 (160-bit)"} value={hashes.sha1} color="text-orange-400" />
        <HashRow label={isHmac ? "HMAC-SHA256" : "SHA-256 (256-bit Standard)"} value={hashes.sha256} color="text-cyan-400" highlight />
        <HashRow label={isHmac ? "HMAC-SHA384" : "SHA-384 (384-bit)"} value={hashes.sha384} color="text-indigo-400" />
        <HashRow label={isHmac ? "HMAC-SHA512" : "SHA-512 (512-bit)"} value={hashes.sha512} color="text-purple-400" />
      </div>
    </div>
  );
}

function HashRow({ label, value, color, highlight = false }) {
  const [copied, copy] = useCopy(value);
  return (
    <div className={`bg-gray-900/60 rounded-xl border ${highlight ? "border-cyan-500/40 shadow-sm shadow-cyan-950/40" : "border-gray-800"} p-3.5 space-y-1.5`}>
      <div className="flex items-center justify-between">
        <span className={`text-xs font-bold uppercase tracking-wider ${color}`}>
          {label}
        </span>
        {value && value !== "N/A (HMAC-MD5 requires library)" && (
          <button
            onClick={copy}
            className="text-xs text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            {copied ? <CheckIcon className="w-3.5 h-3.5 text-emerald-400" /> : <CopyIcon className="w-3.5 h-3.5" />}
            Copy Hash
          </button>
        )}
      </div>
      <div className="bg-gray-950 rounded-lg p-2.5 font-mono text-xs text-gray-200 break-all select-all border border-gray-800/80">
        {value || "—"}
      </div>
    </div>
  );
}
