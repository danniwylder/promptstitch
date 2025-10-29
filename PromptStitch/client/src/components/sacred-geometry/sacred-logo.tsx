import { motion } from "framer-motion";

interface SacredLogoProps {
  size?: "sm" | "md" | "lg";
}

export default function SacredLogo({ size = "lg" }: SacredLogoProps) {
  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-16 h-16", 
    lg: "w-24 h-24"
  };

  const iconSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl"
  };

  return (
    <div className={`${sizeClasses[size]} mx-auto relative`}>
      {/* Outer Sacred Triangle */}
      <motion.div 
        className="absolute inset-0 opacity-70"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        style={{
          clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
          background: "linear-gradient(135deg, var(--sacred-blue), var(--deep-teal))",
          border: "1px solid var(--sacred-gold)"
        }}
      />
      
      {/* Inner Inverted Triangle */}
      <motion.div 
        className="absolute inset-3 opacity-80"
        animate={{ 
          rotate: [180, -180],
          scale: [0.9, 1.1, 0.9]
        }}
        transition={{ 
          rotate: { duration: 25, repeat: Infinity, ease: "linear" },
          scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
        }}
        style={{
          clipPath: "polygon(50% 100%, 0% 0%, 100% 0%)",
          background: "linear-gradient(135deg, var(--ancient-green), var(--neon-cyan))",
          border: "1px solid var(--ethereal-pink)"
        }}
      />
      
      {/* Sacred Tetrahedron Core */}
      <motion.div 
        className="absolute inset-6 bg-gradient-to-br from-sacred-gold to-neon-cyan"
        animate={{ 
          boxShadow: [
            "0 0 5px var(--sacred-blue), 0 0 15px var(--deep-teal)",
            "0 0 15px var(--ancient-green), 0 0 25px var(--ethereal-pink)",
            "0 0 5px var(--sacred-blue), 0 0 15px var(--deep-teal)"
          ]
        }}
        transition={{ duration: 3, repeat: Infinity }}
        style={{
          clipPath: "polygon(50% 20%, 20% 80%, 80% 80%)",
        }}
      />
      
      {/* Central Sacred Symbol */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        >
          <i className={`fas fa-ankh ${iconSizes[size]} text-sacred-gold sigil-icon`} />
        </motion.div>
      </div>
    </div>
  );
}
