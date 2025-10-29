import { motion } from "framer-motion";

interface MysticalIconProps {
  icon: "invocations" | "ilk" | "alchemy" | "settings" | "threads" | "sigils" | "conflux" | "home";
  size?: "sm" | "md" | "lg";
  className?: string;
  animate?: boolean;
}

export default function MysticalIcon({ icon, size = "md", className = "", animate = true }: MysticalIconProps) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12"
  };

  const iconVariants = {
    initial: { scale: 1, rotate: 0 },
    hover: { scale: 1.1, rotate: 5 },
    tap: { scale: 0.95 }
  };

  const renderIcon = () => {
    switch (icon) {
      case "invocations":
        // Sacred scroll with triangular elements
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <motion.path
              d="M30 20 L70 20 L75 25 L75 80 L70 85 L30 85 L25 80 L25 25 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              animate={animate ? { pathLength: [0, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <path d="M35 35 L50 25 L65 35 Z" fill="currentColor" opacity="0.6" />
            <path d="M35 55 L50 45 L65 55 Z" fill="currentColor" opacity="0.4" />
            <path d="M35 75 L50 65 L65 75 Z" fill="currentColor" opacity="0.3" />
          </svg>
        );

      case "ilk":
        // Layered sacred hexagons
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <motion.polygon
              points="50,15 80,30 80,60 50,75 20,60 20,30"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              animate={animate ? { rotate: [0, 360] } : {}}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              style={{ transformOrigin: "50% 50%" }}
            />
            <polygon points="50,25 70,35 70,55 50,65 30,55 30,35" fill="currentColor" opacity="0.3" />
            <circle cx="50" cy="45" r="8" fill="currentColor" />
          </svg>
        );

      case "alchemy":
        // Alchemical vessel with sacred triangles
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <motion.path
              d="M30 25 L70 25 L60 50 L65 75 Q65 85 50 85 Q35 85 35 75 L40 50 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              animate={animate ? { opacity: [0.5, 1, 0.5] } : {}}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <path d="M40 35 L50 20 L60 35 Z" fill="currentColor" opacity="0.6" />
            <circle cx="50" cy="60" r="6" fill="currentColor" opacity="0.8" />
          </svg>
        );

      case "settings":
        // Sacred gear with geometric precision
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <motion.g
              animate={animate ? { rotate: [0, 360] } : {}}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              style={{ transformOrigin: "50% 50%" }}
            >
              {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                <rect
                  key={i}
                  x="47"
                  y="15"
                  width="6"
                  height="20"
                  fill="currentColor"
                  transform={`rotate(${angle} 50 50)`}
                  opacity="0.8"
                />
              ))}
            </motion.g>
            <circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" strokeWidth="3" />
            <circle cx="50" cy="50" r="8" fill="currentColor" />
          </svg>
        );

      case "threads":
        // Time spiral with sacred geometry
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <motion.path
              d="M50 50 Q70 30, 85 50 Q70 70, 50 50 Q30 70, 15 50 Q30 30, 50 50"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              animate={animate ? { strokeDashoffset: [0, -100] } : {}}
              strokeDasharray="5,5"
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
            <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.5" />
            <path d="M50 30 L50 50 L65 50" stroke="currentColor" strokeWidth="2" fill="none" />
          </svg>
        );

      case "sigils":
        // Sacred star/sigil
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <motion.g
              animate={animate ? { scale: [1, 1.1, 1], rotate: [0, 5, 0] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ transformOrigin: "50% 50%" }}
            >
              <path
                d="M50 10 L60 40 L90 40 L65 58 L75 88 L50 68 L25 88 L35 58 L10 40 L40 40 Z"
                fill="currentColor"
                opacity="0.3"
              />
              <path
                d="M50 20 L57 42 L78 42 L62 53 L68 75 L50 62 L32 75 L38 53 L22 42 L43 42 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
            </motion.g>
          </svg>
        );

      case "conflux":
        // Infinity/convergence symbol with sacred geometry
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <motion.path
              d="M20 50 Q30 20, 50 50 Q70 80, 80 50 Q70 20, 50 50 Q30 80, 20 50 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              animate={animate ? { pathLength: [0, 1, 0] } : {}}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <circle cx="35" cy="50" r="8" fill="currentColor" opacity="0.5" />
            <circle cx="65" cy="50" r="8" fill="currentColor" opacity="0.5" />
          </svg>
        );

      case "home":
        // Sacred Ankh/home symbol
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <motion.g
              animate={animate ? { opacity: [0.7, 1, 0.7] } : {}}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <circle cx="50" cy="30" r="12" fill="none" stroke="currentColor" strokeWidth="3" />
              <path d="M50 42 L50 85" stroke="currentColor" strokeWidth="3" />
              <path d="M30 60 L70 60" stroke="currentColor" strokeWidth="3" />
              <path d="M35 25 L50 15 L65 25" fill="none" stroke="currentColor" strokeWidth="2" />
            </motion.g>
          </svg>
        );

      default:
        return null;
    }
  };

  const MotionDiv = animate ? motion.div : "div";

  return (
    <MotionDiv
      className={`${sizeClasses[size]} ${className}`}
      {...(animate ? { variants: iconVariants, whileHover: "hover", whileTap: "tap" } : {})}
    >
      {renderIcon()}
    </MotionDiv>
  );
}
