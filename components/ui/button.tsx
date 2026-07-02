import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-60",
  {
    variants: {
      variant: {
        default: "bg-primary text-white hover:scale-[1.02]",
        outline: "border border-border bg-card text-foreground hover:bg-white/5",
        accent: "bg-accent text-black hover:scale-[1.02]",
        invest:
          "rounded-lg bg-[#8B4513] px-6 py-3 text-white shadow-sm hover:bg-[#9a4f1a] hover:scale-[1.01] focus-visible:ring-[#8B4513]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export function Button({ className, variant, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant }), className)} {...props} />;
}
