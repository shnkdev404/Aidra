import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "rounded-[6px] bg-primary text-primary-foreground shadow-xs hover:opacity-90 active:scale-[0.98]",
        destructive: "rounded-[6px] bg-[#ee0000] text-white shadow-xs hover:bg-[#ee0000]/90",
        outline: "rounded-[6px] border border-border bg-canvas-elevated text-ink shadow-xs hover:bg-canvas hover:border-body",
        secondary: "rounded-[6px] bg-hairline-soft text-ink hover:bg-border",
        ghost: "rounded-[6px] text-body hover:bg-hairline-soft hover:text-ink",
        link: "text-[#0070f3] underline-offset-4 hover:underline",
        "pill-primary": "rounded-full bg-primary text-primary-foreground shadow-sm hover:opacity-90 hover:shadow-md active:scale-[0.98]",
        "pill-secondary": "rounded-full border border-border bg-canvas-elevated text-ink shadow-xs hover:bg-canvas hover:border-body",
        "pill-category": "rounded-[64px] border border-border bg-canvas-elevated text-ink hover:bg-canvas",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-[6px] px-3 text-xs",
        lg: "h-11 px-6 text-base",
        pill: "h-11 px-6 text-sm font-medium",
        icon: "h-9 w-9 rounded-[6px]",
        "icon-circular": "h-9 w-9 rounded-full border border-border bg-canvas-elevated text-ink hover:bg-canvas",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
