import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  iconClassName?: string;
  size?: "sm" | "md" | "lg";
}

export function AidraLogo({ className, iconClassName, size = "md" }: LogoProps) {
  const containerSizes = {
    sm: "h-6 w-6 rounded-[6px]",
    md: "h-8 w-8 rounded-[8px]",
    lg: "h-10 w-10 rounded-[10px]",
  };

  const iconSizes = {
    sm: "h-3.5 w-3.5",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  return (
    <div
      className={cn(
        "flex items-center justify-center bg-primary text-primary-foreground shadow-xs transition-all",
        containerSizes[size],
        className,
      )}
    >
      <svg viewBox="0 0 64 64" className={cn(iconSizes[size], iconClassName)}>
        <defs>
          <linearGradient id="aidraLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00dfd8" />
            <stop offset="50%" stopColor="#007cf0" />
            <stop offset="100%" stopColor="#7928ca" />
          </linearGradient>
        </defs>
        <path
          d="M 14 44 L 27 16 C 28.5 13.5 31.5 13.5 33 16 L 46 44"
          fill="none"
          stroke="url(#aidraLogoGrad)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 10 32 L 21 32 L 24 23 L 28 41 L 32 19 L 36 35 L 39 32 L 50 32"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="47" cy="15" r="4.5" fill="#50e3c2" />
      </svg>
    </div>
  );
}
