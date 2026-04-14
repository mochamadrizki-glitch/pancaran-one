import React from "react";
import clsx from "clsx";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={clsx(
          "block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-xs outline-none transition focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 placeholder:text-slate-400",
          className,
        )}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";

