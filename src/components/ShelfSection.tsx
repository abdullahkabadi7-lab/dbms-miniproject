import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

export const ShelfSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);

  // Mouse tracking with lerp / easing
  const targetPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const currentPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const isHoveringRef = useRef<boolean>(false);
  const [isHovering, setIsHovering] = useState<boolean>(false);

  // Reduced hover radius to 60% of previous (72px)
  const HOVER_RADIUS = 72;

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    targetPosRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    if (!isHoveringRef.current) {
      isHoveringRef.current = true;
      setIsHovering(true);
      currentPosRef.current = { ...targetPosRef.current };
    }
  }, []);

  const handleMouseEnter = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    targetPosRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    currentPosRef.current = { ...targetPosRef.current };
    isHoveringRef.current = true;
    setIsHovering(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    isHoveringRef.current = false;
    setIsHovering(false);
  }, []);

  // Smooth cursor-following movement with slight easing / lerp loop
  useEffect(() => {
    let animId: number;

    const render = () => {
      if (isHoveringRef.current && revealRef.current) {
        const target = targetPosRef.current;
        const current = currentPosRef.current;

        // Slight easing / lerp factor (0.15) for smooth cursor following
        current.x += (target.x - current.x) * 0.15;
        current.y += (target.y - current.y) * 0.15;

        // Soft circular spotlight (reduced 120px radius) with feathered edge via CSS radial-gradient mask
        const maskGradient = `radial-gradient(circle ${HOVER_RADIUS}px at ${current.x.toFixed(1)}px ${current.y.toFixed(1)}px, black 0%, black 65%, transparent 100%)`;
        revealRef.current.style.maskImage = maskGradient;
        revealRef.current.style.webkitMaskImage = maskGradient;
      }
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Smooth scroll directly to Image 2 (Landing Page Hero) directly below
  const handleScrollToLandingHero = () => {
    const heroSection = document.getElementById('store-hero-section');
    if (heroSection) {
      heroSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-screen bg-black overflow-hidden flex flex-col justify-between select-none border-b border-neutral-900 cursor-crosshair"
    >
      {/* 1. Base Layer: Supermarket Shelf (Image 1 background) */}
      <img
        src="/shelf.jpg"
        alt="SmartMart Supermarket Shelf"
        className="absolute inset-0 w-full h-full object-cover object-center z-0 pointer-events-none"
      />

      {/* 2. REVEAL LAYER: emptyshelf revealed through a soft circular spotlight centered on cursor.
          - Reduced reveal radius: 120px
          - Soft feathered edge via mask-image and -webkit-mask-image
          - Completely invisible outside the spotlight
          - Smooth cursor-following movement with slight easing/lerp
          - pointer-events: none on the reveal layer
          - Above existing hero background (z-0) but below every text, button, and UI element (z-20)
          - Completely hidden when cursor leaves the hero
      */}
      <div
        ref={revealRef}
        className="absolute inset-0 w-full h-full z-10 pointer-events-none transition-opacity duration-200"
        style={{
          opacity: isHovering ? 1 : 0,
        }}
      >
        <img
          src="/emptyshelf.jpg"
          alt="Empty Supermarket Shelf"
          className="w-full h-full object-cover object-center pointer-events-none"
        />
      </div>

      {/* ======================================================== */}
      {/* IMAGE 1 UI OVERLAYS (Matches user's screenshot exactly)  */}
      {/* ======================================================== */}

      {/* Top Header */}
      <div className="relative z-20 p-6 sm:p-12 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-3">
          <span className="font-display font-black text-2xl tracking-tighter text-white drop-shadow-md">
            SMART<span className="text-[#00A8FF]">MART</span>
          </span>
          <span className="hidden sm:inline-block text-[10px] font-mono px-2.5 py-0.5 border border-white/20 text-neutral-300 backdrop-blur-md bg-black/50">
            IMMERSIVE ENTRANCE
          </span>
        </div>

        <div className="pointer-events-auto">
          <button
            onClick={handleScrollToLandingHero}
            className="group flex items-center gap-2 px-4 py-2 bg-black/60 hover:bg-[#00A8FF] text-white hover:text-black font-mono text-xs uppercase tracking-widest border border-white/20 hover:border-[#00A8FF] backdrop-blur-md transition-all duration-200 cursor-pointer"
          >
            <span>ENTER STORE</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* Center Callout: Exactly as in Image 1 screenshot */}
      <div className="relative z-20 self-center flex flex-col items-center gap-4 text-center my-auto px-4">
        <div className="font-display uppercase tracking-tight text-white drop-shadow-lg">
          <span className="block text-xs font-mono text-[#00A8FF] tracking-widest mb-1.5 flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#00A8FF]" />
            TRANSITION COMPLETE
          </span>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight drop-shadow-2xl">
            WELCOME TO SMARTMART
          </h1>
        </div>

        {/* Action Button: Connects directly to Image 2 (Landing Page Hero) below */}
        <button
          onClick={handleScrollToLandingHero}
          className="inline-flex items-center gap-3 px-8 py-4 bg-[#00A8FF] hover:bg-[#29C5FF] text-black font-mono text-sm font-bold uppercase tracking-widest shadow-[0_0_30px_rgba(0,168,255,0.4)] hover:shadow-[0_0_40px_rgba(0,168,255,0.6)] transition-all cursor-pointer mt-2"
        >
          <span>ENTER THE AISLES</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Empty bottom spacer (No scrollbar) */}
      <div className="relative z-20 p-6 sm:p-8 pointer-events-none" />
    </section>
  );
};
