import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function GridBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const CELL  = 40;
    const state = { opacity: 0, offsetY: 0 };

    // Fade in on mount
    gsap.to(state, { opacity: 0.06, duration: 1.2, ease: "power2.out" });

    // Slow infinite vertical scroll
    gsap.to(state, {
      offsetY: CELL,
      duration: 4,
      ease: "none",
      repeat: -1,
    });

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = `rgba(0,0,0,${state.opacity})`;
      ctx.lineWidth = 1;

      const cols = Math.ceil(canvas.width  / CELL) + 1;
      const rows = Math.ceil(canvas.height / CELL) + 1;
      const oY   = state.offsetY % CELL;

      // Vertical lines
      for (let c = 0; c < cols; c++) {
        const x = c * CELL;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // Horizontal lines with scroll offset
      for (let r = 0; r < rows; r++) {
        const y = r * CELL - oY;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    };

    gsap.ticker.add(draw);

    return () => {
      gsap.ticker.remove(draw);
      window.removeEventListener("resize", resize);
      gsap.killTweensOf(state);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0 dark:invert dark:opacity-30"
    />
  );
}