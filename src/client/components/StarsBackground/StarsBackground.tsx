'use client';

import { useEffect, useRef } from 'react';
import "./StarsBackground.scss"

type StarsBackgroundType = 'small' | 'normal' | 'large';

interface StarsBackgroundProps {
  starCount?: number;
  type?: StarsBackgroundType;
}

export default function StarsBackground({
  starCount = 2000,
  type = 'small',
}: StarsBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastBreakpointRef = useRef<string>("");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d")!;
    let animationFrame: number;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    const getBreakpoint = (w: number) => {
      if (w < 480) return "xs";
      if (w < 768) return "sm";
      if (w < 1024) return "md";
      if (w < 1600) return "ls";
      return "lg";
    };

    const stars: {
      x: number;
      y: number;
      size: number;
      twinkle: number;
      appearDelay: number; // нове
    }[] = [];

    const APPEAR_DURATION = 5000; // 5 секунд вигульовування

    const getBaseStarSize = () => {
      if (type === "large") return 1.4;
      if (type === "small") return 0.7;
      return 1;
    };

    const getAdjustedCount = (bp: string) => {
      let base = starCount;

      if (type === "large") base *= 1.1;
      if (type === "small") base *= 0.9;

      if (bp === "xs") return Math.floor(base * 0.2);
      if (bp === "sm") return Math.floor(base * 0.4);
      if (bp === "md") return Math.floor(base * 0.6);
      if (bp === "ls") return Math.floor(base * 0.8);

      return Math.floor(base);
    };

    let startTime = 0;

    const generateStars = () => {
      resizeCanvas();

      const bp = getBreakpoint(canvas.width);
      lastBreakpointRef.current = bp;

      stars.length = 0;

      const count = getAdjustedCount(bp);
      const baseSize = getBaseStarSize();

      startTime = performance.now(); // старт появи

      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: (Math.random() * 1.5 + 0.5) * baseSize,
          twinkle: Math.random() * 10,
          appearDelay: Math.random() * APPEAR_DURATION, // випадкова затримка появи
        });
      }
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const now = performance.now();
      const time = Date.now() * 0.002;

      for (const s of stars) {
        const elapsed = now - startTime;

        if (elapsed < s.appearDelay) continue; // ще ховаємо зірку

        const appearProgress = Math.min((elapsed - s.appearDelay) / 500, 1); // 0 → 1 за 0.5 сек
        const baseOpacity = 0.5 + Math.sin(time + s.twinkle) * 0.5;

        const opacity = baseOpacity * appearProgress;

        ctx.globalAlpha = opacity;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(s.x, s.y, s.size, s.size);
      }

      ctx.globalAlpha = 1;
      animationFrame = requestAnimationFrame(render);
    };

    requestAnimationFrame(() => {
      generateStars();
      render();
    });

    // --- debounce 400ms ---
    let timeout: NodeJS.Timeout;

    const onResize = () => {
      clearTimeout(timeout);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.length = 0;

      timeout = setTimeout(() => {
        generateStars();
      }, 400);
    };

    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", onResize);
    };
  }, [starCount, type]);

  return (
    <div className="StarsBackground">
      <canvas className="stars-canvas" ref={canvasRef} />
    </div>
  );
}
