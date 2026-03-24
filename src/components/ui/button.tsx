import * as React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "outline" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center rounded-xl text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-500 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
          {
            "bg-electric-500 text-white hover:bg-electric-600 shadow-md hover:shadow-lg hover:-translate-y-0.5": variant === "default",
            "bg-electric-50 text-electric-900 hover:bg-electric-100": variant === "secondary",
            "border border-slate-200 hover:bg-slate-50 text-slate-900 dark:border-slate-800 dark:hover:bg-slate-800 dark:text-slate-100": variant === "outline",
            "hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-100 text-slate-600 dark:text-slate-300": variant === "ghost",
            "underline-offset-4 hover:underline text-electric-600 dark:text-electric-500": variant === "link",
            "h-11 py-2 px-5": size === "default",
            "h-9 px-3 rounded-lg text-xs": size === "sm",
            "h-12 px-8 rounded-2xl text-base font-semibold": size === "lg",
            "h-10 w-10": size === "icon",
          },
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button };
