import React from "react";
import { cn } from "./button";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: "bottom-border" | "full-border";
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant = "full-border", type, ...props }, ref) => {
    const baseStyles =
      "flex h-12 w-full bg-transparent px-3 py-2 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-outline focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50";
    
    const variants = {
      "full-border": "border border-primary focus-visible:border-2",
      "bottom-border": "border-b border-primary px-0 focus-visible:border-b-2",
    };

    return (
      <input
        type={type}
        className={cn(baseStyles, variants[variant], className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
