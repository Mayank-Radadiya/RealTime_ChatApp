import { cn } from "@/lib/utils/utils";
import { cva, VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { ButtonHTMLAttributes, FC } from "react";

// Define the class-variance-authority for the button component.
// means give default tailwind class name and some attributes
export const buttonVariants = cva(
  "active:scale-95 inline-flex items-center justify-center rounded-md text-sm font-medium transition-color focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-slate-900 text-white hover:bg-slate-800",
        ghost: "bg-transparent hover:text-slate-900 hover:bg-slate-200",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-2",
        lg: "h-11 px-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

// Interface for the button props, extending default button attributes and custom styling variants
export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>, // Default HTML button attributes
    VariantProps<typeof buttonVariants> {
  // Custom styling logic
  isLoading?: boolean; // Custom prop to indicate loading state
}

// Button component definition
const Button: FC<ButtonProps> = ({
  className,
  children,
  variant, // Styling variant (e.g., primary, secondary)
  isLoading, // Whether the button is in a loading state
  size, // Size of the button (e.g., small, large)
  ...props // Remaining props
}) => {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      {children}
    </button>
  );
};

export default Button;
