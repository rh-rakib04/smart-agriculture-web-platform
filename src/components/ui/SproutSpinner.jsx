"use client";

/**
 * SproutSpinner
 * A lightweight animated growing-plant icon for inline loading states.
 *
 * Props:
 *   size   — "sm" (20px) | "md" (32px, default) | "lg" (48px) | number (px)
 *   color  — "green" (default, for light bg) | "white" (for dark/colored bg)
 *   className — extra tailwind classes
 *
 * Usage:
 *   <SproutSpinner />
 *   <SproutSpinner size="sm" color="white" />
 *   <SproutSpinner size={40} />
 */

const SIZES = { sm: 20, md: 32, lg: 48 };

const COLORS = {
  green: {
    soil: "rgba(139,99,64,0.3)",
    stem: "#4a7c2f",
    leafLeft: "#6aaa3a",
    leafRight: "#4a7c2f",
    bud: "#2d5a1b",
    spark1: "#c8a227",
    spark2: "#f0c040",
  },
  white: {
    soil: "rgba(255,255,255,0.2)",
    stem: "#ffffff",
    leafLeft: "#a8c66c",
    leafRight: "#ffffff",
    bud: "#eef4e6",
    spark1: "#fdd835",
    spark2: "#fdd835",
  },
};

export default function SproutSpinner({
  size = "md",
  color = "green",
  className = "",
}) {
  const px = typeof size === "number" ? size : (SIZES[size] ?? 32);
  const c = COLORS[color] ?? COLORS.green;

  return (
    <span
      className={`inline-flex items-center justify-center flex-shrink-0 ${className}`}
      style={{ width: px, height: px }}
      aria-label="Loading"
      role="status"
    >
      <svg
        width={px}
        height={px}
        viewBox="0 0 32 32"
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: "visible" }}
      >
        <style>{`
          @keyframes _soilPulse {
            0%,100% { transform: scaleX(1); }
            50%      { transform: scaleX(1.08); }
          }
          @keyframes _stemGrow {
            0%        { transform: scaleY(0); opacity: 0; }
            20%       { opacity: 1; }
            60%, 80%  { transform: scaleY(1); }
            100%      { transform: scaleY(0); opacity: 0; }
          }
          @keyframes _leafLeft {
            0%,  25% { transform: scale(0) rotate(40deg);  opacity: 0; }
            55%, 80% { transform: scale(1) rotate(0deg);   opacity: 1; }
            100%     { transform: scale(0) rotate(40deg);  opacity: 0; }
          }
          @keyframes _leafRight {
            0%,  30% { transform: scale(0) rotate(-40deg); opacity: 0; }
            60%, 80% { transform: scale(1) rotate(0deg);   opacity: 1; }
            100%     { transform: scale(0) rotate(-40deg); opacity: 0; }
          }
          @keyframes _budPop {
            0%,  40% { transform: scale(0); opacity: 0; }
            65%, 80% { transform: scale(1); opacity: 1; }
            100%     { transform: scale(0); opacity: 0; }
          }
          @keyframes _spark1 {
            0%,45%  { opacity:0; transform:translate(0,0) scale(0); }
            60%     { opacity:1; transform:translate(0,0) scale(1); }
            90%,100%{ opacity:0; transform:translate(-4px,-5px) scale(0.3); }
          }
          @keyframes _spark2 {
            0%,45%  { opacity:0; transform:translate(0,0) scale(0); }
            60%     { opacity:1; transform:translate(0,0) scale(1); }
            90%,100%{ opacity:0; transform:translate(4px,-5px) scale(0.3); }
          }
          @keyframes _spark3 {
            0%,45%  { opacity:0; transform:translate(0,0) scale(0); }
            60%     { opacity:1; transform:translate(0,0) scale(1); }
            90%,100%{ opacity:0; transform:translate(0,-6px) scale(0.3); }
          }
          ._soil      { animation: _soilPulse  1.6s ease-in-out infinite; }
          ._stem      { transform-origin: 50% 100%; animation: _stemGrow  1.6s cubic-bezier(0.34,1.56,0.64,1) infinite; }
          ._leafL     { transform-origin: 100% 100%; animation: _leafLeft  1.6s cubic-bezier(0.34,1.56,0.64,1) infinite; }
          ._leafR     { transform-origin: 0%   100%; animation: _leafRight 1.6s cubic-bezier(0.34,1.56,0.64,1) infinite; }
          ._bud       { transform-origin: 50%  100%; animation: _budPop    1.6s cubic-bezier(0.34,1.56,0.64,1) infinite; }
          ._sp1       { animation: _spark1 1.6s ease-out infinite; animation-delay: 0.7s; }
          ._sp2       { animation: _spark2 1.6s ease-out infinite; animation-delay: 0.8s; }
          ._sp3       { animation: _spark3 1.6s ease-out infinite; animation-delay: 0.75s; }
        `}</style>

        {/* soil */}
        <g className="_soil">
          <ellipse cx="16" cy="27" rx="10" ry="3" fill={c.soil} />
        </g>

        {/* stem */}
        <g className="_stem">
          <rect x="14.5" y="13" width="3" height="14" rx="1.5" fill={c.stem} />
        </g>

        {/* left leaf */}
        <g className="_leafL">
          <ellipse
            cx="9"
            cy="16"
            rx="6"
            ry="3.5"
            fill={c.leafLeft}
            transform="rotate(-30 9 16)"
          />
        </g>

        {/* right leaf */}
        <g className="_leafR">
          <ellipse
            cx="23"
            cy="16"
            rx="6"
            ry="3.5"
            fill={c.leafRight}
            transform="rotate(30 23 16)"
          />
        </g>

        {/* bud */}
        <g className="_bud">
          <ellipse cx="16" cy="12" rx="3" ry="4" fill={c.bud} />
        </g>

        {/* sparkles */}
        <circle className="_sp1" cx="10" cy="13" r="1.5" fill={c.spark1} />
        <circle className="_sp2" cx="22" cy="13" r="1.5" fill={c.spark1} />
        <circle className="_sp3" cx="16" cy="9" r="1.5" fill={c.spark2} />
      </svg>
    </span>
  );
}
