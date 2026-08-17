import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "outline-dark"
    | "outline-light"
    | "aloe"
    | "ghost"
    | "danger"
    | "link";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] select-none cursor-pointer";

    const variantStyles = {
      primary: "rounded-pill bg-black text-white hover:bg-shade-70",
      "outline-dark":
        "rounded-pill border-2 border-white bg-transparent text-white hover:bg-white hover:text-black",
      "outline-light":
        "rounded-pill border border-black bg-white text-black hover:bg-black hover:text-white",
      aloe:
        "rounded-pill bg-aloe-10 text-black hover:bg-pistachio-10 shadow-sm font-semibold",
      ghost: "rounded-pill bg-transparent text-black hover:bg-black/5",
      danger: "rounded-pill bg-red-600 text-white hover:bg-red-700",
      link: "rounded-none p-0 text-black underline-offset-4 hover:underline bg-transparent",
    };

    const sizeStyles = {
      sm: "text-xs px-3.5 py-1.5 gap-1.5 h-8",
      md: "text-[14px] px-5 py-2.5 gap-2 h-11",
      lg: "text-[16px] px-7 py-3.5 gap-2.5 h-13",
      icon: "p-2.5 h-10 w-10 rounded-full",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          baseStyles,
          variantStyles[variant],
          size !== "icon" || variant === "link" ? sizeStyles[size] : sizeStyles.icon,
          className
        )}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
