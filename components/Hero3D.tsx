'use client';

// NOTE: Spline 3D component temporarily removed due to network restrictions.
// Keeping a very simple placeholder container to avoid build errors
// while retaining the original layout API.

export default function Hero3D() {
  return (
    <div className="relative w-full h-[500px] lg:h-[600px] bg-gradient-to-br from-cyan-950/20 to-purple-950/20 rounded-2xl overflow-hidden border border-cyan-500/20 shadow-[0_0_30px_rgba(6,182,212,0.2)]">
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin"></div>
        <div className="text-cyan-400 text-lg mt-4 animate-pulse font-mono">
          3D 
        </div>
      </div>
    </div>
  );
}
