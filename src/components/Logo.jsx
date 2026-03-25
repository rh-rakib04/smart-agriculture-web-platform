import Link from "next/link";
import { Cormorant_Garamond, Raleway } from "next/font/google";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["700"],
  style: ["normal", "italic"],
});

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["200"],
});

const LeafIcon = () => (
  <svg
    width="32"
    height="38"
    viewBox="0 0 52 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ flexShrink: 0, alignSelf: "center", margin: "0 2px" }}
  >
    <defs>
      <radialGradient id="lg1" cx="40%" cy="60%" r="60%">
        <stop offset="0%" stopColor="#4fc46a" />
        <stop offset="100%" stopColor="#1a5c2e" />
      </radialGradient>
      <radialGradient id="lg2" cx="60%" cy="40%" r="60%">
        <stop offset="0%" stopColor="#3dab58" />
        <stop offset="100%" stopColor="#14482a" />
      </radialGradient>
      <radialGradient id="lg3" cx="50%" cy="50%" r="60%">
        <stop offset="0%" stopColor="#5dd476" />
        <stop offset="100%" stopColor="#22703c" />
      </radialGradient>
    </defs>

    {/* Stem */}
    <path d="M26 72 C26 72 26 50 26 28" stroke="#C9A84C" strokeWidth="1.6" strokeLinecap="round" fill="none" />

    {/* Left leaf */}
    <path d="M26 50 C20 48 9 42 6 28 C6 28 4 18 12 14 C16 20 20 30 26 37 Z" fill="url(#lg1)" />
    <path d="M26 50 C18 38 9 26 7 18" stroke="#C9A84C" strokeWidth="0.65" strokeLinecap="round" fill="none" opacity="0.55" />
    <path d="M19 41 C15 38 11 33 9 29" stroke="#C9A84C" strokeWidth="0.32" strokeLinecap="round" fill="none" opacity="0.28" />

    {/* Right leaf */}
    <path d="M26 42 C32 40 43 34 46 20 C46 20 48 10 40 6 C36 12 32 22 26 28 Z" fill="url(#lg2)" />
    <path d="M26 42 C34 30 43 18 45 10" stroke="#C9A84C" strokeWidth="0.65" strokeLinecap="round" fill="none" opacity="0.55" />
    <path d="M34 32 C38 28 41 22 43 18" stroke="#C9A84C" strokeWidth="0.32" strokeLinecap="round" fill="none" opacity="0.28" />

    {/* Top small leaf */}
    <path d="M26 28 C22 24 17 16 19 8 C23 6 28 12 26 24 Z" fill="url(#lg3)" opacity="0.92" />
    <path d="M26 28 C22 20 18 12 18 8" stroke="#C9A84C" strokeWidth="0.45" strokeLinecap="round" fill="none" opacity="0.48" />

    {/* Base teardrop */}
    <ellipse cx="26" cy="72" rx="2.8" ry="3.5" fill="#C9A84C" opacity="0.9" />

    {/* Top dot */}
    <circle cx="26" cy="3" r="1.5" fill="#C9A84C" opacity="0.4" />
  </svg>
);

const Logo = () => {
  return (
    <Link
      href="/"
      className="inline-flex flex-col items-center gap-1 select-none no-underline group"
      aria-label="KrishiNova Home"
    >
      {/* Icon embedded between text */}
      <div className="flex items-center">
          <div className="transition-transform duration-500 ease-out group-hover:scale-110">
            <LeafIcon />
          </div>
        {/* Krishi */}
        <span
          className={cormorant.className}
          style={{
            fontSize: "1.5rem",
            fontWeight: 700,
            lineHeight: 1,
            letterSpacing: "1px",
            color: "var(--foreground)",
          }}
        >
          Krishi
        </span>

        {/* Leaf icon */}

        {/* Nova */}
        <span
          className={cormorant.className}
          style={{
            fontSize: "1.5rem",
            fontWeight: 700,
            fontStyle: "italic",
            lineHeight: 1,
            letterSpacing: "1px",
            color: "#C9A84C",
          }}
        >
          Nova
        </span>
      </div>

  
    </Link>
  );
};

export default Logo;