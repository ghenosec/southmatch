import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-extrabold transition-transform select-none " +
  "disabled:cursor-not-allowed disabled:opacity-50 enabled:active:translate-y-0.5 " +
  "min-h-11";

const variants: Record<Variant, string> = {
  primary:
    "bg-action text-white border-[3px] border-ink shadow-paper-sm hover:bg-action-dark hover:-translate-y-0.5",
  secondary:
    "bg-snow text-ink border-[3px] border-ink shadow-paper-sm hover:bg-sky-pale hover:-translate-y-0.5",
  ghost: "text-ink underline-offset-4 hover:underline",
};

const sizes: Record<Size, string> = {
  md: "px-5 py-2 text-base",
  lg: "px-7 py-3 text-lg sm:text-xl",
};

export function buttonClass(variant: Variant = "primary", size: Size = "md", extra = ""): string {
  return `${base} ${variants[variant]} ${sizes[size]} ${extra}`.trim();
}

interface ButtonProps extends ComponentProps<"button"> {
  variant?: Variant;
  size?: Size;
}

export function Button({ variant = "primary", size = "md", className = "", type = "button", ...props }: ButtonProps) {
  return <button type={type} className={buttonClass(variant, size, className)} {...props} />;
}

interface ButtonLinkProps extends Omit<ComponentProps<typeof Link>, "className"> {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

export function ButtonLink({ variant = "primary", size = "md", className = "", ...props }: ButtonLinkProps) {
  return <Link className={buttonClass(variant, size, className)} {...props} />;
}
