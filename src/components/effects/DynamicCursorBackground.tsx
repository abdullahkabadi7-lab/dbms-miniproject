import React, { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  originX: number;
  originY: number;
  size: number;
  depth: number;
  baseAlpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
}

/**
 * DynamicCursorBackground:
 * - High-DPI crystal-clear pixel rendering (zero canvas blur)
 * - Pure pitch black (#000000) backdrop
 * - Razor-sharp pinpoint stars (100% white, sharp edges, no fuzzy shadows)
 * - Multi-depth parallax reactivity when cursor moves
 */
export const DynamicCursorBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const targetOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const currentOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    let width = window.innerWidth;
    let height = window.innerHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Balanced star count for clean negative space
    const STAR_COUNT = Math.min(180, Math.max(110, Math.floor((width * height) / 7500)));
    const stars: Star[] = [];

    for (let i = 0; i < STAR_COUNT; i++) {
      const originX = Math.random() * width;
      const originY = Math.random() * height;
      const depth = Math.random() * 0.85 + 0.15; // 0.15 (far) to 1.0 (near)

      // Razor-sharp small pinpoints (0.6px to 1.4px)
      const size = depth > 0.8 ? Math.random() * 0.5 + 1.0 : Math.random() * 0.4 + 0.6;

      // Bright diamond white opacity
      const baseAlpha = depth > 0.6 ? Math.random() * 0.15 + 0.85 : Math.random() * 0.2 + 0.75;

      stars.push({
        x: originX,
        y: originY,
        originX,
        originY,
        size,
        depth,
        baseAlpha,
        twinkleSpeed: Math.random() * 0.02 + 0.01,
        twinklePhase: Math.random() * Math.PI * 2,
      });
    }

    starsRef.current = stars;

    // Window Resize with DPR preservation
    const handleResize = () => {
      if (!canvas) return;
      const newDpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = width * newDpr;
      canvas.height = height * newDpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(newDpr, newDpr);

      starsRef.current.forEach((star) => {
        star.originX = Math.random() * width;
        star.originY = Math.random() * height;
      });
    };

    window.addEventListener('resize', handleResize);

    // Mouse Tracking (Normalized: -1 to 1)
    const handleMouseMove = (e: MouseEvent) => {
      const halfW = width / 2;
      const halfH = height / 2;
      targetOffsetRef.current = {
        x: (e.clientX - halfW) / halfW,
        y: (e.clientY - halfH) / halfH,
      };
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    let rafId: number;

    const render = () => {
      const ease = 0.075;
      currentOffsetRef.current.x += (targetOffsetRef.current.x - currentOffsetRef.current.x) * ease;
      currentOffsetRef.current.y += (targetOffsetRef.current.y - currentOffsetRef.current.y) * ease;

      const offsetX = currentOffsetRef.current.x;
      const offsetY = currentOffsetRef.current.y;

      // 1. Fill pitch black background
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);

      // Ensure NO blur or shadow is applied
      ctx.shadowBlur = 0;

      // 2. Draw crystal-clear bright stars
      for (let i = 0; i < starsRef.current.length; i++) {
        const star = starsRef.current[i];

        // Gentle organic twinkle
        star.twinklePhase += star.twinkleSpeed;
        const twinkle = Math.sin(star.twinklePhase) * 0.15;
        const alpha = Math.max(0.65, Math.min(1, star.baseAlpha + twinkle));

        // Parallax displacement based on depth
        const maxShift = 42;
        const moveX = -offsetX * star.depth * maxShift;
        const moveY = -offsetY * star.depth * maxShift;

        let drawX = star.originX + moveX;
        let drawY = star.originY + moveY;

        // Wrap around viewport edges
        if (drawX < -10) drawX += width + 20;
        if (drawX > width + 10) drawX -= width + 20;
        if (drawY < -10) drawY += height + 20;
        if (drawY > height + 10) drawY -= height + 20;

        ctx.beginPath();
        ctx.arc(drawX, drawY, star.size, 0, Math.PI * 2);

        // Crisp, solid, unblurred diamond white
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha.toFixed(2)})`;
        ctx.fill();
      }

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 w-full h-full select-none"
      style={{ backgroundColor: '#000000' }}
      aria-hidden="true"
    />
  );
};
