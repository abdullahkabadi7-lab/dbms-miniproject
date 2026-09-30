import React, { useState, useEffect, useRef, useCallback } from 'react';

export const ShelfSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);

  // Mouse tracking with lerp / easing
  const targetPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const currentPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const isHoveringRef = useRef<boolean>(false);
  const [isHovering, setIsHovering] = useState<boolean>(false);

  // Hover radius increased by ~33% (from 72px to 96px)
  const HOVER_RADIUS = 96;

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

      {/* Center Callout: Clean title over the interactive spotlight */}
      <div className="relative z-20 self-center flex flex-col items-center gap-3 text-center my-auto px-4 pt-24 pointer-events-none">
        <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold uppercase tracking-tight text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)]">
          WELCOME TO SMARTMART
        </h1>
        <p className="text-xs sm:text-sm font-mono text-neutral-300 tracking-widest uppercase drop-shadow-md">
          HOVER TO INSPECT AISLE STOCK &bull; SCROLL DOWN TO EXPLORE
        </p>
      </div>

      {/* Empty bottom spacer (No scrollbar) */}
      <div className="relative z-20 p-6 sm:p-8 pointer-events-none" />
    </section>
  );
};
