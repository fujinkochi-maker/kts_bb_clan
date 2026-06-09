import { useEffect, useState } from "react";

interface CrackOverlayProps {
  animate?: boolean;
  className?: string;
}

const crackPaths = [
  "M0,200 Q80,180 120,240 Q160,300 240,280",
  "M120,240 Q180,200 220,140 Q260,80 340,100",
  "M220,140 Q280,160 320,220 Q360,280 440,260",
  "M320,220 Q380,200 420,160 Q460,120 540,140",
  "M80,180 Q40,240 60,320 Q80,400 40,480",
  "M240,280 Q260,360 240,440 Q220,520 260,600",
  "M340,100 Q380,40 440,20 Q500,0 560,40",
  "M440,260 Q480,340 460,420 Q440,500 480,580",
  "M60,320 Q120,340 180,380 Q240,420 300,400",
  "M240,440 Q300,460 360,500 Q420,540 460,520",
  "M460,120 Q520,100 580,120 Q640,140 700,120",
  "M540,140 Q580,200 560,260 Q540,320 580,380",
  "M700,120 Q740,180 720,240 Q700,300 740,360",
  "M580,380 Q640,400 700,420 Q760,440 820,420",
  "M740,360 Q800,380 860,360 Q920,340 960,360",
];

export function CrackOverlay({ animate = true, className = "" }: CrackOverlayProps) {
  const [visible, setVisible] = useState(!animate);

  useEffect(() => {
    if (!animate) return;
    const timer = setTimeout(() => setVisible(true), 600);
    return () => clearTimeout(timer);
  }, [animate]);

  return (
    <svg
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      viewBox="0 0 1000 650"
      preserveAspectRatio="xMidYMid slice"
    >
      {crackPaths.map((d, i) => (
        <path
          key={i}
          d={d}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          className={`text-primary/30 transition-opacity duration-1000 ${visible ? "opacity-100" : "opacity-0"}`}
          style={{
            animation: visible ? `crack-draw 1.5s ease-out ${i * 0.08}s forwards` : "none",
            strokeDasharray: 200,
            strokeDashoffset: visible ? 0 : 200,
          }}
        />
      ))}
    </svg>
  );
}
