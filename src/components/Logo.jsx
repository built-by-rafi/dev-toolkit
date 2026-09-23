export default function Logo({ size = "md", showSub = true, className = "" }) {
  const isLg = size === "lg";
  return (
    <div className={`flex items-center gap-3 group select-none ${className}`}>
      {/* Glow Image Container */}
      <div className="relative">
        <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 opacity-60 blur-sm group-hover:opacity-100 transition duration-500 group-hover:duration-200 animate-pulse"></div>
        <div className="relative overflow-hidden rounded-xl border border-cyan-500/40 bg-gray-950 p-0.5 shadow-lg shadow-cyan-950/50">
          <img
            src="/logo.png"
            alt="Built by Rafi Logo"
            className={`${isLg ? "w-12 h-12" : "w-9 h-9"} rounded-lg object-cover transition-transform duration-300 group-hover:scale-105`}
            onError={(e) => {
              // Fallback if image fails
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      </div>

      {/* Brand Text */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-bold tracking-[0.2em] text-cyan-400 uppercase">
            BUILT BY
          </span>
          <span className="h-1 w-1 rounded-full bg-cyan-400 animate-ping"></span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg font-black tracking-tight bg-gradient-to-r from-cyan-400 via-teal-300 to-purple-400 bg-clip-text text-transparent font-mono drop-shadow-[0_0_12px_rgba(6,182,212,0.4)]">
            RAFI
          </span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 tracking-wide font-sans">
            DevToolkit
          </span>
        </div>
        {showSub && (
          <span className="text-[10px] text-gray-400 font-mono hidden sm:inline-block">
            Next-Gen Privacy-First Suite
          </span>
        )}
      </div>
    </div>
  );
}
