import { cn } from "@/lib/utils";
import React from "react";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  containerClass?: string;
  background?: "default" | "muted" | "electric" | "dark";
}

export function Section({
  children,
  className,
  containerClass,
  background = "default",
  ...props
}: SectionProps) {
  return (
    <section
      className={cn(
        "py-20 md:py-32",
        {
          "bg-slate-950 text-slate-50": background === "default",
          "bg-slate-900 text-slate-50": background === "muted",
          "bg-electric-600 text-white": background === "electric",
          "bg-black text-white": background === "dark",
        },
        className
      )}
      {...props}
    >
      <div className={cn("container mx-auto px-4 md:px-8", containerClass)}>
        {children}
      </div>
    </section>
  );
}
