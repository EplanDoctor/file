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
          "bg-white dark:bg-slate-950": background === "default",
          "bg-slate-50 dark:bg-slate-900/50": background === "muted",
          "bg-electric-500 text-white": background === "electric",
          "bg-slate-950 text-white dark:bg-black": background === "dark",
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
