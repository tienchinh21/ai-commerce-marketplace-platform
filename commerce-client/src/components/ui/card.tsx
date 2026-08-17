import * as React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "light" | "cinematic" | "aloe" | "pistachio" | "outline";
}

export function Card({
  className,
  variant = "light",
  children,
  ...props
}: CardProps) {
  const variantStyles = {
    light: "bg-white border border-hairline-light shadow-elevation-3 text-ink",
    cinematic: "bg-canvas-night-elevated border border-surface-elevated-dark shadow-elevation-2 text-white",
    aloe: "bg-aloe-10 text-ink border-0 shadow-elevation-3",
    pistachio: "bg-pistachio-10 text-ink border-0 shadow-elevation-3",
    outline: "bg-transparent border border-hairline-light text-ink",
  };

  return (
    <div
      className={cn(
        "rounded-lg p-5 transition-all duration-200",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("mb-4 space-y-1", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("text-lg font-semibold tracking-tight text-inherit", className)}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-sm text-shade-50", className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("", className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("mt-6 flex items-center pt-4 border-t border-hairline-light", className)} {...props}>
      {children}
    </div>
  );
}
