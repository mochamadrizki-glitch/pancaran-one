import React from "react";
import clsx from "clsx";

type BadgeVariant = "success" | "warning" | "danger" | "neutral";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const baseClasses =
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium tracking-wide";

const variantClasses: Record<BadgeVariant, string> = {
  success:
    "border-emerald-100 bg-emerald-50 text-emerald-700",
  warning:
    "border-amber-100 bg-amber-50 text-amber-700",
  danger:
    "border-rose-100 bg-rose-50 text-rose-700",
  neutral:
    "border-slate-200 bg-slate-50 text-slate-700",
};

export function Badge({ variant = "neutral", className, ...props }: BadgeProps) {
  return (
    <span
      className={clsx(baseClasses, variantClasses[variant], className)}
      {...props}
    />
  );
}

