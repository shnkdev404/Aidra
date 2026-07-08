import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/**
 * React-Bits-inspired shiny text: a gold shimmer sweeps across ink.
 */
export function ShinyText({
  children,
  className,
  speed = 4,
}: {
  children: ReactNode;
  className?: string;
  speed?: number;
}) {
  return (
    <span
      className={cn("inline-block bg-clip-text text-transparent", className)}
      style={{
        backgroundImage:
          "linear-gradient(90deg, oklch(0.20 0.02 40) 0%, oklch(0.20 0.02 40) 40%, oklch(0.75 0.13 82) 50%, oklch(0.20 0.02 40) 60%, oklch(0.20 0.02 40) 100%)",
        backgroundSize: "200% 100%",
        animation: `shimmer ${speed}s linear infinite`,
        WebkitBackgroundClip: "text",
      }}
    >
      {children}
    </span>
  );
}
