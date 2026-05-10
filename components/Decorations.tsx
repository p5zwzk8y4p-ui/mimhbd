"use client";

import { motion } from "framer-motion";

export function Sparkle({
  size = 14,
  className = "",
  delay = 0
}: { size?: number; className?: string; delay?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={`twinkle ${className}`}
      style={{ animationDelay: `${delay}s`, filter: "drop-shadow(0 0 6px #FFD6F0)" }}
      fill="none"
    >
      <path
        d="M12 2 L13.6 9.4 L21 11 L13.6 12.6 L12 20 L10.4 12.6 L3 11 L10.4 9.4 Z"
        fill="#fff"
        stroke="#FF8FBF"
        strokeWidth="0.6"
      />
    </svg>
  );
}

export function Star4({
  size = 18,
  fill = "#C8B0FF",
  className = "",
  delay = 0
}: { size?: number; fill?: string; className?: string; delay?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={`twinkle ${className}`}
      style={{ animationDelay: `${delay}s` }}
      fill="none"
    >
      <path d="M12 2 C 12 8, 16 12, 22 12 C 16 12, 12 16, 12 22 C 12 16, 8 12, 2 12 C 8 12, 12 8, 12 2 Z"
        fill={fill}
        stroke="#fff"
        strokeWidth="0.8"
      />
    </svg>
  );
}

/* Cute pink axolotl mascot — chibi side-view, simplified */
export function Axolotl({
  size = 120,
  className = "",
  style
}: { size?: number; className?: string; style?: React.CSSProperties }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      className={className}
      style={style}
      aria-label="axolotl mascot"
    >
      <defs>
        <radialGradient id="axoBody" cx="40%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#FFE4F0" />
          <stop offset="60%" stopColor="#FFB3D9" />
          <stop offset="100%" stopColor="#FF8FBF" />
        </radialGradient>
        <radialGradient id="axoBlush" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FF6FA8" stopOpacity="0.65" />
          <stop offset="100%" stopColor="#FF6FA8" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="axoFrill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFD6EC" />
          <stop offset="100%" stopColor="#FF8FBF" />
        </linearGradient>
      </defs>

      {/* External frills (gills) */}
      <g opacity="0.95">
        <path d="M55 70 q -22 -14 -34 4 q 18 -2 30 14 z" fill="url(#axoFrill)" />
        <path d="M52 92 q -28 -2 -34 22 q 22 -10 38 -6 z" fill="url(#axoFrill)" />
        <path d="M58 110 q -22 8 -22 30 q 16 -14 32 -16 z" fill="url(#axoFrill)" />
      </g>

      {/* Body */}
      <path
        d="M55 95
           q 0 -50 55 -50
           q 60 0 60 55
           q 0 35 -22 50
           q 8 18 -4 28
           q -16 8 -32 -8
           q -28 6 -50 -16
           q -22 -22 -7 -59 z"
        fill="url(#axoBody)"
        stroke="#E957A8"
        strokeWidth="1.5"
        strokeOpacity="0.4"
      />

      {/* Tail frill */}
      <path
        d="M150 145 q 28 0 36 22 q -20 -2 -34 6 z"
        fill="url(#axoFrill)"
      />

      {/* Cheek blush */}
      <ellipse cx="92" cy="108" rx="14" ry="9" fill="url(#axoBlush)" />
      <ellipse cx="142" cy="108" rx="14" ry="9" fill="url(#axoBlush)" />

      {/* Eyes - sparkly */}
      <g>
        <ellipse cx="100" cy="92" rx="6" ry="8" fill="#3A1F4D" />
        <ellipse cx="148" cy="92" rx="6" ry="8" fill="#3A1F4D" />
        <circle cx="102" cy="89" r="2" fill="#fff" />
        <circle cx="150" cy="89" r="2" fill="#fff" />
        <circle cx="98" cy="95" r="1" fill="#fff" />
        <circle cx="146" cy="95" r="1" fill="#fff" />
      </g>

      {/* Mouth - little smile */}
      <path d="M118 112 q 6 5 14 0" stroke="#5B1B47" strokeWidth="1.6" fill="none" strokeLinecap="round" />

      {/* Tiny crown / star on head */}
      <g transform="translate(108 50)">
        <path d="M0 0 L3 6 L9 7 L4 11 L6 17 L0 14 L-6 17 L-4 11 L-9 7 L-3 6 Z"
          fill="#FFD8EC" stroke="#E957A8" strokeWidth="1" />
      </g>
    </svg>
  );
}

export function CloudPuff({
  size = 200,
  className = "",
  style
}: { size?: number; className?: string; style?: React.CSSProperties }) {
  return (
    <svg width={size} height={size * 0.6} viewBox="0 0 200 120" className={className} style={style}>
      <defs>
        <radialGradient id="cloud" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0.1" />
        </radialGradient>
      </defs>
      <ellipse cx="60" cy="70" rx="55" ry="32" fill="url(#cloud)" />
      <ellipse cx="120" cy="60" rx="60" ry="36" fill="url(#cloud)" />
      <ellipse cx="160" cy="78" rx="40" ry="24" fill="url(#cloud)" />
    </svg>
  );
}

export function HeartDoodle({ size = 22, color = "#FF6FA8", className = "" }: { size?: number; color?: string; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill="none">
      <path
        d="M12 21 C 5 15, 2 11, 4 7 C 6 3, 11 4, 12 8 C 13 4, 18 3, 20 7 C 22 11, 19 15, 12 21 Z"
        fill={color} stroke="#fff" strokeWidth="0.8"
      />
    </svg>
  );
}

export function MagicWand({ size = 28, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} fill="none">
      <line x1="6" y1="26" x2="22" y2="10" stroke="#C8B0FF" strokeWidth="3" strokeLinecap="round" />
      <path d="M24 4 L26 9 L31 11 L26 13 L24 18 L22 13 L17 11 L22 9 Z"
        fill="#FFD8EC" stroke="#E957A8" strokeWidth="1" strokeLinejoin="round" />
    </svg>
  );
}

/* Floating layer of sparkles + stars + axolotl friends */
export function FloatingDecor() {
  const items = [
    { x: "5%",  y: "12%", r: -8,  d: 0,   c: <Sparkle size={18} delay={0} /> },
    { x: "92%", y: "8%",  r: 10,  d: 0.4, c: <Star4 size={22} fill="#A8B5FF" delay={0.4} /> },
    { x: "12%", y: "60%", r: -4,  d: 0.8, c: <Star4 size={18} fill="#FF8FBF" delay={0.8} /> },
    { x: "88%", y: "72%", r: 6,   d: 1.2, c: <Sparkle size={16} delay={1.2} /> },
    { x: "48%", y: "6%",  r: 0,   d: 0.2, c: <Sparkle size={12} delay={0.2} /> },
    { x: "30%", y: "85%", r: 8,   d: 1.6, c: <Star4 size={14} fill="#C8B0FF" delay={1.6} /> },
    { x: "70%", y: "44%", r: -10, d: 2.0, c: <Sparkle size={14} delay={2.0} /> }
  ];
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[1]">
      {items.map((it, i) => (
        <div
          key={i}
          className="absolute drift"
          style={{ left: it.x, top: it.y, animationDelay: `${it.d}s`, transform: `rotate(${it.r}deg)` }}
        >
          {it.c}
        </div>
      ))}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.4 }}
        className="absolute"
        style={{ left: "3%", bottom: "8%" }}
      >
        <div className="float-slow" style={{ ['--r' as any]: "-8deg" }}>
          <Axolotl size={140} />
        </div>
      </motion.div>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.7 }}
        className="absolute hidden md:block"
        style={{ right: "2%", top: "55%" }}
      >
        <div className="float-slow" style={{ ['--r' as any]: "10deg", animationDelay: "1.5s" }}>
          <Axolotl size={110} style={{ transform: "scaleX(-1)" }} />
        </div>
      </motion.div>
    </div>
  );
}
