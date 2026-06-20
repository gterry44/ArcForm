import React, { useEffect, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  shape: "circle" | "square" | "triangle" | "star";
  delay: number;
  duration: number;
  angle: number;
  spinSpeed: number;
}

interface GoldConfettiProps {
  active: boolean;
  onComplete: () => void;
}

export default function GoldConfetti({ active, onComplete }: GoldConfettiProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!active) {
      setParticles([]);
      return;
    }

    // Colors: pure gold, light yellow, old gold, pale bronze
    const goldColors = [
      "#ffd700", // Gold
      "#d4af37", // Metallic Gold
      "#f1db63", // Soft Pale Gold
      "#b79029", // Antique Gold
      "#ecc94b"  // Golden Bronze
    ];

    const shapes: Array<"circle" | "square" | "triangle" | "star"> = [
      "circle",
      "square",
      "triangle",
      "star"
    ];

    // Generate 60 gold particles
    const list: Particle[] = Array.from({ length: 70 }).map((_, i) => {
      const size = Math.random() * 12 + 6; // sizes between 6px and 18px
      const color = goldColors[Math.floor(Math.random() * goldColors.length)];
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      
      // Starting coordinates logic
      // We burst from the center bottom or center top or scattered
      const x = Math.random() * 100; // Left offset 0-100%
      const y = -10; // Start offscreen top
      
      const delay = Math.random() * 0.4; // staggered start
      const duration = Math.random() * 2.5 + 2.0; // fall duration between 2.0 and 4.5 seconds
      const angle = Math.random() * 360; 
      const spinSpeed = Math.random() * 720 - 360; // spins left or right

      return {
        id: i,
        x,
        y,
        size,
        color,
        shape,
        delay,
        duration,
        angle,
        spinSpeed
      };
    });

    setParticles(list);

    // Auto cleanup after the longest animation completes
    const timeout = setTimeout(() => {
      onComplete();
    }, 5000);

    return () => clearTimeout(timeout);
  }, [active, onComplete]);

  if (!active || particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((p) => {
        const shapeStyle: React.CSSProperties = {
          position: "absolute",
          top: "0px",
          left: `${p.x}%`,
          width: `${p.size}px`,
          height: `${p.size}px`,
          backgroundColor: p.shape !== "triangle" && p.shape !== "star" ? p.color : undefined,
          borderRadius: p.shape === "circle" ? "50%" : "0%",
          opacity: 0.9,
          transform: `translate3d(0, -50px, 0) rotate(${p.angle}deg)`,
          animation: `fall-${p.id} ${p.duration}s cubic-bezier(0.25, 1, 0.5, 1) ${p.delay}s forwards`,
        };

        const keyframe = `
          @keyframes fall-${p.id} {
            0% {
              transform: translate3d(0, -50px, 0) rotate(${p.angle}deg);
              opacity: 1;
            }
            50% {
              opacity: 0.9;
            }
            100% {
              transform: translate3d(${(Math.random() * 200 - 100)}px, 105vh, 0) rotate(${p.angle + p.spinSpeed}deg);
              opacity: 0;
            }
          }
        `;

        return (
          <div key={p.id}>
            <style dangerouslySetInnerHTML={{ __html: keyframe }} />
            {p.shape === "triangle" ? (
              <svg 
                style={{ 
                  position: "absolute", 
                  left: `${p.x}%`, 
                  width: `${p.size}px`, 
                  height: `${p.size}px`,
                  transform: `translate3d(0, -50px, 0) rotate(${p.angle}deg)`,
                  animation: `fall-${p.id} ${p.duration}s cubic-bezier(0.25, 1, 0.5, 1) ${p.delay}s forwards`
                }}
                viewBox="0 0 100 100"
              >
                <polygon points="50,0 100,100 0,100" fill={p.color} />
              </svg>
            ) : p.shape === "star" ? (
              <svg 
                style={{ 
                  position: "absolute", 
                  left: `${p.x}%`, 
                  width: `${p.size}px`, 
                  height: `${p.size}px`,
                  transform: `translate3d(0, -50px, 0) rotate(${p.angle}deg)`,
                  animation: `fall-${p.id} ${p.duration}s cubic-bezier(0.25, 1, 0.5, 1) ${p.delay}s forwards`
                }}
                viewBox="0 0 24 24"
              >
                <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.787 1.4 8.168L12 18.896l-7.334 3.857 1.4-8.168L.132 9.21l8.2-1.192L12 .587z" fill={p.color} />
              </svg>
            ) : (
              <div style={shapeStyle} />
            )}
          </div>
        );
      })}
    </div>
  );
}
