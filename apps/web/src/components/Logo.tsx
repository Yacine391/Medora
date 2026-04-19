import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  href?: string;
}

export function Logo({ className, size = "md", href = "/" }: LogoProps) {
  const sizes = {
    sm: { icon: 20, text: "text-sm" },
    md: { icon: 24, text: "text-base" },
    lg: { icon: 32, text: "text-xl" },
  };
  const { icon, text } = sizes[size];

  return (
    <Link
      href={href}
      className={cn("flex items-center gap-2 group", className)}
      aria-label="Medora — back to home"
    >
      <svg
        width={icon}
        height={icon}
        viewBox="0 0 32 32"
        fill="none"
        aria-hidden="true"
        className="shrink-0"
      >
        {/* Leaf shape */}
        <path
          d="M16 3C10 3 5 8.5 5 14c0 4.5 2.5 8 7 10l4 4 4-4c4.5-2 7-5.5 7-10 0-5.5-5-11-11-11z"
          fill="hsl(158 64% 38%)"
          className="group-hover:fill-[hsl(160_75%_25%)] transition-colors duration-200"
        />
        {/* White cross / plus */}
        <path
          d="M16 10v12M10 16h12"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
      <span className={cn("font-bold text-emerald-700 group-hover:text-emerald-800 transition-colors", text)}>
        Medora
      </span>
    </Link>
  );
}
