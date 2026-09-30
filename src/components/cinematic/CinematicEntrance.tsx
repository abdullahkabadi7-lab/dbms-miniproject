import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ArrowDown, ArrowRight, Sparkles } from 'lucide-react';

interface CinematicEntranceProps {
  onComplete: () => void;
}

const TOTAL_FRAMES = 96;

export const CinematicEntrance: React.FC<CinematicEntranceProps> = ({ onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const lastDrawnFrameRef = useRef<number>(-1);

  const [isAtStart, setIsAtStart] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);
  const [hasReachedEnd, setHasReachedEnd] = useState<boolean>(false);

  // Wheel virtual scroll tracking
  const targetProgressRef = useRef<number>(0);
  const currentProgressRef = useRef<number>(0);
  const rafIdRef = useRef<number | null>(null);

  // Total scroll distance for comfortable pacing
  const TOTAL_DISTANCE = 1600;

  // Lock body scroll while entrance is active
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Preload all 96 WebP frames into memory for instantaneous 60fps canvas drawing
  useEffect(() => {
    const loadedImgs: HTMLImageElement[] = [];

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      const frameNum = String(i).padStart(3, '0');
      img.src = `/frames/frame_${frameNum}.webp`;
      img.onload = () => {
        if (i === 0 && canvasRef.current) {
          drawFrame(0);
        }
      };
      loadedImgs.push(img);
    }

    imagesRef.current = loadedImgs;
  }, []);

  // Draw frame to canvas with high-DPI object-cover scaling
  const drawFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let img = imagesRef.current[frameIndex];

    if (!img || !img.complete || img.naturalWidth === 0) {
      for (let offset = 1; offset < 30; offset++) {
        const prev = imagesRef.current[frameIndex - offset];
        if (prev && prev.complete && prev.naturalWidth > 0) {
          img = prev;
          break;
        }
        const next = imagesRef.current[frameIndex + offset];
        if (next && next.complete && next.naturalWidth > 0) {
          img = next;
          break;
        }
      }
    }

    if (!img || !img.complete || img.naturalWidth === 0) return;

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const imgWidth = img.naturalWidth;
    const imgHeight = img.naturalHeight;

    const canvasRatio = canvasWidth / canvasHeight;
    const imgRatio = imgWidth / imgHeight;

    let drawWidth = canvasWidth;
    let drawHeight = canvasHeight;
    let offsetX = 0;
    let offsetY = 0;

    if (canvasRatio > imgRatio) {
      drawHeight = canvasWidth / imgRatio;
      offsetY = (canvasHeight - drawHeight) / 2;
    } else {
      drawWidth = canvasHeight * imgRatio;
      offsetX = (canvasWidth - drawWidth) / 2;
    }

    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    lastDrawnFrameRef.current = frameIndex;
  }, []);

  // Resize canvas to match display window dimensions with devicePixelRatio
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;

    if (lastDrawnFrameRef.current >= 0) {
      drawFrame(lastDrawnFrameRef.current);
    }
  }, [drawFrame]);

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  // Intercept wheel events without moving layout
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY;
      const nextTarget = Math.min(Math.max(targetProgressRef.current + delta / TOTAL_DISTANCE, 0), 1);
      targetProgressRef.current = nextTarget;
    };

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const currentY = e.touches[0].clientY;
      const delta = touchStartY - currentY;
      touchStartY = currentY;

      const nextTarget = Math.min(Math.max(targetProgressRef.current + (delta * 2.2) / TOTAL_DISTANCE, 0), 1);
      targetProgressRef.current = nextTarget;
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  // 60FPS fluid RAF render loop with butter-smooth inertial easing
  useEffect(() => {
    let isRunning = true;

    const loop = () => {
      if (!isRunning) return;

      const target = targetProgressRef.current;
      const current = currentProgressRef.current;
      const diff = target - current;

      if (Math.abs(diff) > 0.0004) {
        const nextProgress = current + diff * 0.22;
        currentProgressRef.current = nextProgress;
        setProgress(nextProgress);

        // Instant switch between Entrance.png and animation (NO fade transition)
        if (nextProgress <= 0.002) {
          setIsAtStart(true);
        } else {
          setIsAtStart(false);
          const frameIndex = Math.min(
            Math.floor(nextProgress * (TOTAL_FRAMES - 1)),
            TOTAL_FRAMES - 1
          );
          if (frameIndex !== lastDrawnFrameRef.current) {
            drawFrame(frameIndex);
          }
        }

        if (nextProgress >= 0.99) {
          setHasReachedEnd(true);
          setTimeout(() => {
            onComplete();
          }, 350);
        } else {
          setHasReachedEnd(false);
        }
      }

      rafIdRef.current = requestAnimationFrame(loop);
    };

    rafIdRef.current = requestAnimationFrame(loop);

    return () => {
      isRunning = false;
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [drawFrame]);

  const handleEnterStore = () => {
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 w-full h-full bg-black select-none overflow-hidden">
      {/* 1. Entrance Image: Initial visual.
          Removed instantly (no fade transition) once scrolling starts.
      */}
      {isAtStart && (
        <img
          src="/entrance.png"
          alt="SmartMart Entrance"
          className="absolute inset-0 w-full h-full object-cover object-center z-20 pointer-events-none"
        />
      )}

      {/* 2. Hardware Canvas Frame Renderer (60 FPS, Zero Stutter, Instant Scrub) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover object-center z-10"
      />

      {/* 3. Cinematic Interface HUD */}
      <div className="absolute inset-0 z-30 pointer-events-none flex flex-col justify-between p-6 sm:p-12">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-display font-black text-2xl tracking-tighter text-white drop-shadow-md">
              SMART<span className="text-[#00A8FF]">MART</span>
            </span>
            <span className="hidden sm:inline-block text-[10px] font-mono px-2.5 py-0.5 border border-white/20 text-neutral-300 backdrop-blur-md bg-black/50">
              IMMERSIVE ENTRANCE
            </span>
          </div>

          <div className="flex items-center gap-3 pointer-events-auto">
            <button
              onClick={handleEnterStore}
              className="group flex items-center gap-2 px-4 py-2 bg-black/60 hover:bg-[#00A8FF] text-white hover:text-black font-mono text-xs uppercase tracking-widest border border-white/20 hover:border-[#00A8FF] backdrop-blur-md transition-all duration-200 cursor-pointer"
            >
              <span>ENTER STORE</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Center Completion Card when reaching the end */}
        {hasReachedEnd && (
          <div className="self-center flex flex-col items-center gap-4 pointer-events-auto animate-in fade-in zoom-in-95 duration-300">
            <div className="text-center font-display uppercase tracking-tight text-white drop-shadow-lg">
              <span className="block text-xs font-mono text-[#00A8FF] tracking-widest mb-1 flex items-center justify-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#00A8FF]" />
                TRANSITION COMPLETE
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold">
                WELCOME TO SMARTMART
              </h2>
            </div>
            <button
              onClick={handleEnterStore}
              className="inline-flex items-center gap-3 px-8 py-4 bg-[#00A8FF] hover:bg-[#29C5FF] text-black font-mono text-sm font-bold uppercase tracking-widest shadow-[0_0_30px_rgba(0,168,255,0.4)] hover:shadow-[0_0_40px_rgba(0,168,255,0.6)] transition-all cursor-pointer"
            >
              <span>ENTER THE AISLES</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Bottom Bar: Instructions */}
        <div className="flex flex-col items-center gap-4">
          {/* Scroll Prompt (visible at start) */}
          {isAtStart && (
            <div className="flex flex-col items-center gap-2 pointer-events-none">
              <span className="text-[11px] font-mono tracking-widest uppercase bg-black/60 backdrop-blur-md px-4 py-1.5 border border-white/20 text-neutral-300">
                SCROLL WHEEL DOWN TO ENTER
              </span>
              <div className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-bounce">
                <ArrowDown className="w-4 h-4 text-white" />
              </div>
            </div>
          )}

          {/* Scrub status while actively scrubbing */}
          {!isAtStart && !hasReachedEnd && (
            <div className="flex items-center gap-3 font-mono text-[10px] tracking-widest uppercase text-neutral-300 bg-black/70 backdrop-blur-md px-4 py-1.5 border border-white/10">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00A8FF] animate-pulse" />
              <span>SCROLL DOWN TO ADVANCE • SCROLL UP TO REVERSE ({Math.round(progress * 100)}%)</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
