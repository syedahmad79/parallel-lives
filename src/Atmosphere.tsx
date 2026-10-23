import { useEffect, useRef } from "react";
export default function Atmosphere({ reduced }: { reduced: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let frame = 0,
      w = 0,
      h = 0;
    let pointerX = 0,
      pointerY = 0;
    const ratio = Math.min(devicePixelRatio || 1, 1.5);
    const stars = Array.from({ length: 80 }, (_, i) => ({
      x: ((i * 137.508) % 997) / 997,
      y: ((i * 73.137) % 991) / 991,
      r: i % 7 === 0 ? 1.3 : 0.6,
    }));
    function draw(t: number) {
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);
      for (const [i, s] of stars.entries()) {
        ctx.beginPath();
        ctx.arc(
          s.x * w + pointerX * s.r,
          s.y * h + pointerY * s.r,
          s.r,
          0,
          Math.PI * 2,
        );
        ctx.fillStyle = `rgba(211,218,245,${0.15 + (reduced ? 0.15 : (Math.sin(t / 4000 + i) + 1) * 0.13)})`;
        ctx.fill();
      }
      if (!reduced && !document.hidden) frame = requestAnimationFrame(draw);
    }
    function resize() {
      w = innerWidth;
      h = innerHeight;
      canvas!.width = w * ratio;
      canvas!.height = h * ratio;
      ctx!.setTransform(ratio, 0, 0, ratio, 0, 0);
      if (reduced || document.hidden) draw(0);
    }
    function move(e: PointerEvent) {
      pointerX = (e.clientX / w - 0.5) * 8;
      pointerY = (e.clientY / h - 0.5) * 8;
    }
    function visibility() {
      cancelAnimationFrame(frame);
      if (!document.hidden) draw(0);
    }
    resize();
    draw(0);
    addEventListener("resize", resize);
    if (!reduced) addEventListener("pointermove", move, { passive: true });
    document.addEventListener("visibilitychange", visibility);
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("resize", resize);
      removeEventListener("pointermove", move);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [reduced]);
  return <canvas ref={ref} className="atmosphere" aria-hidden="true" />;
}
export function BranchArt({ small = false }: { small?: boolean }) {
  return (
    <svg
      className={small ? "branch-art small" : "branch-art"}
      viewBox="0 0 1000 640"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id={small ? "mini-line" : "main-line"}
          x1="150"
          y1="600"
          x2="700"
          y2="40"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#7974bc" stopOpacity="0" />
          <stop offset=".5" stopColor="#9c92ce" />
          <stop offset="1" stopColor="#e5c69a" stopOpacity=".5" />
        </linearGradient>
        <filter id={small ? "mini-glow" : "main-glow"}>
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>
      <g
        stroke={`url(#${small ? "mini-line" : "main-line"})`}
        strokeWidth="1.2"
      >
        {[
          "M500 640V400C500 330 320 330 320 240V40",
          "M500 640V420C500 300 700 300 700 200V0",
          "M500 640V360C500 260 500 220 500 0",
          "M320 260C320 190 170 190 170 80V0",
          "M700 210C700 160 850 170 850 70V0",
          "M500 400C500 330 610 330 610 240V130",
          "M320 240C320 210 410 200 410 100V0",
          "M700 200C700 120 620 130 620 20V0",
        ].map((d, i) => (
          <path key={i} d={d} className="thread-path" />
        ))}
      </g>
      <g fill="#e8d2ac">
        {[
          [500, 400],
          [320, 240],
          [700, 200],
          [500, 170],
          [610, 240],
          [170, 80],
          [410, 100],
          [850, 70],
        ].map(([cx, cy], i) => (
          <g key={i}>
            <circle
              cx={cx}
              cy={cy}
              r="8"
              opacity=".25"
              filter={`url(#${small ? "mini-glow" : "main-glow"})`}
            />
            <circle cx={cx} cy={cy} r={i === 0 ? 3 : 2} />
          </g>
        ))}
      </g>
    </svg>
  );
}
