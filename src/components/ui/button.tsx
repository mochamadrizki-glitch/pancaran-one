import React from "react";
import clsx from "clsx";

export type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const baseClasses =
  "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#1e3a8a] disabled:opacity-60 disabled:cursor-not-allowed";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-[#1e3a8a] text-white hover:bg-[#1d357b] shadow-sm px-4 py-2 ring-offset-white",
  secondary:
    "bg-white text-[#0f172a] border border-slate-200 hover:bg-slate-50 shadow-sm px-4 py-2 ring-offset-white",
  ghost:
    "bg-transparent text-slate-600 hover:bg-slate-100 px-3 py-1.5 ring-offset-white",
};

export function Button({
  variant = "primary",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(baseClasses, variantClasses[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
}

