import { ReactNode } from "react";
import ParticleSystem from "@/components/sacred-geometry/particle-system";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-midnight via-forest to-midnight font-modern text-gray-100 overflow-x-hidden">
      {/* Floating Particles Background */}
      <ParticleSystem />
      
      {/* Sacred Geometry Background Pattern */}
      <div className="fixed inset-0 sacred-geometry ancient-texture opacity-30" />
      
      {/* Main Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
