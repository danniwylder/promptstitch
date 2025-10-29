import { ReactNode, ButtonHTMLAttributes } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MysticalButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  icon?: string;
}

export default function MysticalButton({ 
  children, 
  variant = "primary", 
  size = "md", 
  icon,
  className,
  ...props 
}: MysticalButtonProps) {
  const baseClasses = "sacred-button rounded-full font-mystical text-white transition-all duration-300 flex items-center gap-2 justify-center";
  
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-8 py-3 text-base",
    lg: "px-12 py-4 text-lg"
  };

  const variantClasses = {
    primary: "hover:text-sacred-gold",
    secondary: "hover:text-neon-cyan opacity-80 hover:opacity-100",
    outline: "bg-transparent border-2 border-sacred-gold/50 hover:bg-sacred-gold/10"
  };

  return (
    <motion.button
      className={cn(
        baseClasses,
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      {...props}
    >
      {icon && <i className={`${icon} ${size === 'sm' ? 'text-sm' : 'text-base'}`} />}
      {children}
    </motion.button>
  );
}
