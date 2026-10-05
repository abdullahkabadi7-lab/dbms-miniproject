import React, { useState, useEffect, useRef, useCallback } from 'react';

export const ShelfSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const backgroundStageRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);
  const calloutRef = useRef<HTMLDivElement>(null);

  // Mouse tracking with lerp / easing
  const targetPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const currentPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const isHoveringRef = useRef<boolean>(false);
  const [isHovering, setIsHovering] = useState<boolean>(false);

  // Hover radius for empty shelf reveal spotlight
  const HOVER_RADIUS = 100;

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

  // Smooth cursor-following movement with true background 3D parallax loop
  useEffect(() => {
    let animId: number;

    const render = () => {
      if (sectionRef.current) {
        const target = targetPosRef.current;
        const current = currentPosRef.current;

        // Smooth easing / lerp factor (0.12)
        current.x += (target.x - current.x) * 0.12;
        current.y += (target.y - current.y) * 0.12;

        const rect = sectionRef.current.getBoundingClientRect();
        const width = rect.width || window.innerWidth;
        const height = rect.height || window.innerHeight;

        // Normalized offset from center: -1 to 1
        const normX = Math.max(-1, Math.min(1, (current.x - width / 2) / (width / 2)));
        const normY = Math.max(-1, Math.min(1, (current.y - height / 2) / (height / 2)));

        // 1. VISIBLE BACKGROUND PARALLAX:
        // Moving the cursor causes the entire supermarket shelf background to physically shift & tilt in 3D!
        if (backgroundStageRef.current) {
          const shiftX = -normX * 32; // 32px physical horizontal travel
          const shiftY = -normY * 26; // 26px physical vertical travel
          const rotateY = normX * 3.5; // 3.5deg subtle perspective tilt
          const rotateX = -normY * 3.5;

          backgroundStageRef.current.style.transform = `scale(1.07) translate3d(${shiftX.toFixed(2)}px, ${shiftY.toFixed(2)}px, 0) perspective(1000px) rotateY(${rotateY.toFixed(2)}deg) rotateX(${rotateX.toFixed(2)}deg)`;
        }

        // 2. COUNTER-PARALLAX FOR DISPLAY TITLE:
        // Text floats forward in opposite direction for dramatic holographic depth
        if (calloutRef.current) {
          const textShiftX = normX * 18;
          const textShiftY = normY * 14;
          calloutRef.current.style.transform = `translate3d(${textShiftX.toFixed(2)}px, ${textShiftY.toFixed(2)}px, 0)`;
        }

        // 3. REVEAL LAYER MASK on empty shelf
        if (revealRef.current) {
          const maskGradient = `radial-gradient(circle ${HOVER_RADIUS}px at ${current.x.toFixed(1)}px ${current.y.toFixed(1)}px, black 0%, black 65%, transparent 100%)`;
          revealRef.current.style.maskImage = maskGradient;
          revealRef.current.style.webkitMaskImage = maskGradient;
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-screen bg-black overflow-hidden flex flex-col justify-between select-none border-b border-neutral-900 cursor-crosshair"
    >
      {/* Dynamic 3D Parallax Background Container (Physically reacts to cursor) */}
      <div
        ref={backgroundStageRef}
        className="absolute -inset-10 w-[calc(100%+80px)] h-[calc(100%+80px)] pointer-events-none will-change-transform transition-transform duration-75 ease-out"
      >
        {/* 1. Base Layer: Supermarket Shelf */}
        <img
          src="/shelf.jpg"
          alt="SmartMart Supermarket Shelf"
          className="absolute inset-0 w-full h-full object-cover object-center z-0"
        />

        {/* 2. REVEAL LAYER: Empty shelf revealed through soft circular spotlight */}
        <div
          ref={revealRef}
          className="absolute inset-0 w-full h-full z-10 transition-opacity duration-200"
          style={{
            opacity: isHovering ? 1 : 0,
          }}
        >
          <img
            src="/emptyshelf.jpg"
            alt="Empty Supermarket Shelf"
            className="w-full h-full object-cover object-center"
          />
        </div>
      </div>

      {/* Center Callout: High-end luxury typography with 3D counter-parallax */}
      <div
        ref={calloutRef}
        className="relative z-20 self-center flex flex-col items-center text-center my-auto px-4 pt-20 pointer-events-none will-change-transform"
      >
        {/* Floating pill badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/60 border border-white/20 backdrop-blur-md text-[11px] font-mono tracking-[0.2em] text-neutral-300 uppercase shadow-[0_8px_32px_rgba(0,0,0,0.6)] mb-4">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)] animate-pulse" />
          <span>EST. 2026 &bull; DIGITAL PROVISION RESERVE</span>
        </div>

        {/* Stunning Luxury SmartMart Display Title */}
        <h1 className="font-display font-black text-6xl sm:text-8xl lg:text-9xl tracking-tighter uppercase leading-none drop-shadow-[0_12px_40px_rgba(0,0,0,0.95)]">
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-neutral-100 to-neutral-400">
            SMART
          </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00A8FF] via-[#48d6ff] to-[#00A8FF] ml-1 drop-shadow-[0_0_35px_rgba(0,168,255,0.7)]">
            MART
          </span>
        </h1>

        {/* Refined Luxury Editorial Baseline (Replaces the clunky hover line) */}
        <div className="flex items-center gap-3 mt-4 text-xs font-mono tracking-[0.25em] text-neutral-400 uppercase drop-shadow-md">
          <span className="w-8 h-[1px] bg-gradient-to-r from-transparent to-white/40" />
          <span>ORGANIC ESTABLISHED &bull; SYNCHRONIZED STOCK</span>
          <span className="w-8 h-[1px] bg-gradient-to-l from-transparent to-white/40" />
        </div>
      </div>

      {/* Empty bottom spacer (No scrollbar) */}
      <div className="relative z-20 p-6 sm:p-8 pointer-events-none" />
    </section>
  );
};
