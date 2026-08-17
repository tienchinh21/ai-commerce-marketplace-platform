import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "mint" | "shade" | "outline" | "black" | "success" | "warning" | "danger";
}

export function Badge({
  className,
  variant = "shade",
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    mint: "bg-aloe-10 text-black font-semibold",
    shade: "bg-shade-30 text-black font-medium",
    outline: "border border-hairline-light bg-transparent text-black font-medium",
    black: "bg-black text-white font-medium",
    success: "bg-emerald-100 text-emerald-800 font-medium",
    warning: "bg-amber-100 text-amber-900 font-medium",
    danger: "bg-rose-100 text-rose-800 font-medium",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-pill px-3 py-0.5 text-xs tracking-wide transition-colors",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
