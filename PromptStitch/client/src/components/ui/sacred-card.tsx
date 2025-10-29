import { ReactNode } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import MysticalIcon from "@/components/sacred-geometry/mystical-icons";

interface SacredCardProps {
  title: string;
  description: string;
  icon: "invocations" | "ilk" | "alchemy" | "settings" | "threads" | "sigils" | "conflux" | "home";
  href: string;
  gradientFrom: string;
  gradientTo: string;
  stats?: string;
  children?: ReactNode;
  "data-testid"?: string;
}

export default function SacredCard({ 
  title, 
  description, 
  icon, 
  href, 
  gradientFrom, 
  gradientTo, 
  stats,
  children,
  "data-testid": testId
}: SacredCardProps) {
  return (
    <Link href={href}>
      <motion.div 
        className="glow-border rounded-2xl p-8 bg-gradient-to-br from-midnight/80 to-forest/60 backdrop-blur-sm cursor-pointer"
        whileHover={{ 
          scale: 1.05,
          y: -8,
        }}
        transition={{ duration: 0.3 }}
        data-testid={testId}
      >
        <div className="text-center">
          <motion.div 
            className={`w-16 h-16 mx-auto mb-6 bg-gradient-to-br ${gradientFrom} ${gradientTo} rounded-full flex items-center justify-center`}
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            <MysticalIcon icon={icon} size="md" className="text-white" />
          </motion.div>
          
          <h2 className="font-mystical text-2xl font-semibold text-sacred-gold mb-3">
            {title}
          </h2>
          
          <p className="text-gray-300 mb-6">
            {description}
          </p>
          
          {stats && (
            <div className="text-sm text-gray-400">
              {stats}
            </div>
          )}
          
          {children}
        </div>
      </motion.div>
    </Link>
  );
}
