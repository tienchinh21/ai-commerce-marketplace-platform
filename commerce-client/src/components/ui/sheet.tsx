"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  side?: "left" | "right";
  className?: string;
}

export function Sheet({
  isOpen,
  onClose,
  title,
  children,
  side = "right",
  className,
}: SheetProps) {
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div
        className={cn(
          "fixed inset-y-0 z-50 flex max-w-full",
          side === "right" ? "right-0 pl-10" : "left-0 pr-10"
        )}
      >
        <div
          className={cn(
            "w-screen max-w-md bg-white shadow-2xl transition-transform duration-300 ease-in-out flex flex-col",
            className
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-hairline-light px-6 py-4">
            <div className="text-base font-semibold text-ink">{title}</div>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-shade-40 hover:bg-shade-30/40 hover:text-ink transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="relative flex-1 overflow-y-auto p-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
