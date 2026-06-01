import { useEffect, useState } from "react";

export function FloatingObject() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {/* Dynamic Background Grid Pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(ellipse at 50% 50%, rgba(5,5,5,0) 40%, rgba(5,5,5,1) 100%),
            linear-gradient(rgba(255, 255, 255, 0.08) 1.5px, transparent 1.5px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.08) 1.5px, transparent 1.5px)
          `,
          backgroundSize: '100% 100%, 40px 40px, 40px 40px',
        }}
      />

      {/* Cyber-Grid Vertical Division Lines resembling high-end modern templates */}
      <div className="absolute inset-y-0 left-[15%] w-[1px] bg-white/[0.03] hidden sm:block" />
      <div className="absolute inset-y-0 left-[50%] w-[1px] bg-gradient-to-b from-transparent via-white/[0.04] to-transparent hidden sm:block" />
      <div className="absolute inset-y-0 right-[15%] w-[1px] bg-white/[0.03] hidden sm:block" />

      {/* Cybernetic Node 1: Glowing Green Orbit - Upper Right */}
      <div 
        className="absolute top-[20%] right-[8%] w-56 h-56 flex items-center justify-center opacity-30 sm:opacity-40 select-none animate-bounce"
        style={{ animationDuration: '9s' }}
      >
        {/* Glowing aura */}
        <div className="absolute inset-0 rounded-full bg-brand-blue/5 blur-[35px]" />
        {/* Rotated outer ring */}
        <div className="w-32 h-32 border border-brand-blue/30 rotate-12 rounded-full animate-spin" style={{ animationDuration: '28s' }} />
        {/* Rotated nested diamond */}
        <div className="absolute w-16 h-16 border-2 border-brand-blue/40 rotate-45 rounded-sm animate-pulse flex items-center justify-center">
          <div className="w-3 h-3 bg-brand-blue rounded-full animate-ping" />
        </div>
        {/* Micro coordinate label overlay */}
        <div className="absolute top-0 right-0 font-mono text-[8px] text-brand-blue/60 tracking-widest uppercase">
          SEC_LAT // 54.029
        </div>
      </div>

      {/* Cybernetic Node 2: Glowing Cyan Rings - Middle Left */}
      <div 
        className="absolute top-[48%] left-[6%] w-48 h-48 flex items-center justify-center opacity-20 sm:opacity-30 select-none animate-pulse"
        style={{ animationDuration: '7s' }}
      >
        <div className="absolute inset-0 rounded-full bg-brand-cyan/5 blur-[30px]" />
        {/* Double offset concentric rings */}
        <div className="w-24 h-24 border border-dashed border-brand-cyan/30 rounded-full animate-spin" style={{ animationDuration: '18s' }} />
        <div className="absolute w-16 h-16 border border-brand-cyan/20 rounded-full animate-reverse-spin" style={{ animationDuration: '12s' }} />
        <div className="absolute w-2 h-2 bg-brand-cyan rounded-full" />
        <div className="absolute bottom-0 left-0 font-mono text-[8px] text-brand-cyan/60 tracking-wider">
          PORT_O: 42_01
        </div>
      </div>

      {/* Cybernetic Node 3: Glowing Blue/Violet Vector - Bottom Right */}
      <div 
        className="absolute bottom-[15%] right-[12%] w-60 h-60 flex items-center justify-center opacity-25 sm:opacity-35 select-none animate-bounce"
        style={{ animationDuration: '11s' }}
      >
        <div className="absolute inset-0 rounded-full bg-brand-violet/5 blur-[40px]" />
        {/* Intersecting orbital rings */}
        <div className="w-28 h-28 border border-brand-violet/20 rounded-full rotate-45 transform animate-pulse" />
        <div className="absolute w-28 h-28 border border-brand-violet/20 rounded-full -rotate-45 transform animate-pulse" />
        <div className="absolute w-10 h-10 border border-brand-violet/40 rotate-12 bg-black/60 rounded flex items-center justify-center">
          <span className="font-mono text-[7px] text-brand-violet font-semibold animate-pulse">AST_Y</span>
        </div>
        <div className="absolute top-4 left-4 font-mono text-[8px] text-brand-violet/60 tracking-wider">
          AZIMUTH_90
        </div>
      </div>

      {/* Retro Horizontal Grid Pulse lines floating upwards */}
      <div className="absolute inset-x-0 top-1/4 h-[1px] bg-gradient-to-r from-transparent via-brand-cyan/15 to-transparent animate-pulse" style={{ animationDuration: '4s' }} />
      <div className="absolute inset-x-0 bottom-1/3 h-[1px] bg-gradient-to-r from-transparent via-brand-violet/10 to-transparent animate-pulse" style={{ animationDuration: '6s' }} />
    </div>
  );
}
