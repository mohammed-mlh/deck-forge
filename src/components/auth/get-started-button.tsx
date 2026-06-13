"use client";

import { SignUpButton } from "@clerk/nextjs";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface GetStartedButtonProps {
  children: React.ReactNode;
  className?: string;
}

export function GetStartedButton({ children, className }: GetStartedButtonProps) {
  return (
    <SignUpButton mode="modal">
      <button
        type="button"
        className={cn(
          "inline-flex items-center gap-2 rounded-md bg-(--color-primary) px-5 py-2.5 text-sm font-medium text-(--color-primary-foreground) transition-colors hover:bg-(--color-primary-hover)",
          className
        )}
      >
        {children}
        <ArrowRight className="size-4" />
      </button>
    </SignUpButton>
  );
}
