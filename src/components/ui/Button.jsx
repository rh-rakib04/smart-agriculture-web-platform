

import Link from "next/link";
import clsx from "clsx";
const variants = {
  primary:
    "bg-primary text-primary-foreground hover:opacity-90",

  secondary:
    "bg-secondary text-secondary-foreground hover:opacity-90",

  accent:
    "bg-accent text-accent-foreground hover:opacity-90",

  outline:
    "border border-border bg-transparent hover:bg-muted",

  ghost:
    "bg-transparent hover:bg-muted",

  destructive:
    "bg-destructive text-white hover:opacity-90",
};
const sizes = {
  sm: "h-8 px-3 text-sm rounded-md",
  md: "h-10 px-4 text-sm rounded-lg",
  lg: "h-12 px-6 text-base rounded-xl",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  className,
  href,
  disabled,
  ...props
}) {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:pointer-events-none";

  const classes = clsx(
    baseStyles,
    variants[variant],
    sizes[size],
    className
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {loading && <Spinner />}
        {children}
      </Link>
    );
  }

   return (
    <button
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Spinner />}
      {children}
    </button>
  );
}

function Spinner() {
  return (
    <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
  );
}


