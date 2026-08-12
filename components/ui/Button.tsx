import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

export function Button({ className, variant = "secondary", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-cyan-neon/60 disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary" && "bg-cyan-neon text-navy-950 shadow-glow hover:bg-cyan-soft",
        variant === "secondary" && "border border-cyan-neon/25 bg-cyan-neon/10 text-cyan-soft hover:border-cyan-neon/60",
        variant === "ghost" && "text-slate-300 hover:bg-white/5 hover:text-cyan-soft",
        className
      )}
      {...props}
    />
  );
}
