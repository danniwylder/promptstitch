import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Particle {
  id: string;
  x: number;
  delay: number;
  duration: number;
}

export default function ParticleSystem() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const createParticle = (): Particle => ({
      id: Math.random().toString(36).substr(2, 9),
      x: Math.random() * 100,
      delay: Math.random() * 8,
      duration: 8 + Math.random() * 4,
    });

    // Create initial particles
    const initialParticles = Array.from({ length: 50 }, createParticle);
    setParticles(initialParticles);

    // Continue creating particles
    const interval = setInterval(() => {
      setParticles(prev => {
        const newParticle = createParticle();
        // Remove old particles and add new one
        const filtered = prev.filter(p => Math.random() > 0.02); // Randomly remove particles
        return [...filtered, newParticle].slice(-50); // Keep max 50 particles
      });
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="particle"
          style={{
            left: `${particle.x}vw`,
          }}
          initial={{ y: "100vh", rotate: 0, opacity: 0 }}
          animate={{ 
            y: "-100vh", 
            rotate: 360, 
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            ease: "linear",
            repeat: Infinity,
            opacity: {
              times: [0, 0.1, 0.9, 1],
              duration: particle.duration,
            }
          }}
        />
      ))}
    </div>
  );
}
