"use client";

import { useMemo, useSyncExternalStore } from "react";

interface Particle {
  id: number;
  left: number;
  delay: number;
  duration: number;
  size: number;
  isGold: boolean;
}

interface DataLine {
  id: number;
  left: number;
  delay: number;
  duration: number;
  height: number;
}

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function fmt(n: number, decimals = 2) {
  return Number(n.toFixed(decimals));
}

const emptySubscribe = () => () => {};

export function CyberBackground() {
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  const particles = useMemo<Particle[]>(() => {
    if (!mounted) return [];
    return Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: fmt(seededRandom(i * 1.1) * 100),
      delay: fmt(seededRandom(i * 2.3) * 15),
      duration: fmt(12 + seededRandom(i * 3.7) * 10),
      size: fmt(2 + seededRandom(i * 4.9) * 4),
      isGold: seededRandom(i * 5.2) > 0.85,
    }));
  }, [mounted]);

  const dataLines = useMemo<DataLine[]>(() => {
    if (!mounted) return [];
    return Array.from({ length: 8 }, (_, i) => ({
      id: i,
      left: fmt(10 + seededRandom(i * 6.1) * 80),
      delay: fmt(seededRandom(i * 7.3) * 8),
      duration: fmt(4 + seededRandom(i * 8.5) * 4),
      height: fmt(30 + seededRandom(i * 9.7) * 50, 0),
    }));
  }, [mounted]);

  return (
    <div className="cyber-bg" aria-hidden="true">
      {/* Base grid overlay */}
      <div className="cyber-grid" />

      {/* Perspective grid (floor effect) */}
      <div className="cyber-grid-perspective" style={{ top: "60%" }} />

      {/* Large ambient glow spots */}
      <div
        className="cyber-glow-spot"
        style={{
          width: "600px",
          height: "600px",
          left: "-10%",
          top: "10%",
          background: "radial-gradient(circle, rgba(124, 58, 237, 0.18) 0%, transparent 70%)",
        }}
      />
      <div
        className="cyber-glow-spot"
        style={{
          width: "500px",
          height: "500px",
          right: "-5%",
          top: "40%",
          background: "radial-gradient(circle, rgba(37, 99, 235, 0.14) 0%, transparent 70%)",
          animationDelay: "3s",
        }}
      />
      <div
        className="cyber-glow-spot"
        style={{
          width: "400px",
          height: "400px",
          left: "30%",
          bottom: "10%",
          background: "radial-gradient(circle, rgba(255, 215, 0, 0.1) 0%, transparent 70%)",
          animationDelay: "6s",
        }}
      />

      {/* Floating orbs */}
      <div
        className="cyber-orb"
        style={{
          width: "300px",
          height: "300px",
          left: "5%",
          top: "20%",
        }}
      />
      <div
        className="cyber-orb"
        style={{
          width: "200px",
          height: "200px",
          right: "10%",
          top: "60%",
          animationDelay: "2s",
        }}
      />
      <div
        className="cyber-orb"
        style={{
          width: "250px",
          height: "250px",
          left: "50%",
          top: "5%",
          animationDelay: "4s",
        }}
      />

      {/* Cyber rings (Millennium Item inspired) */}
      <div
        className="cyber-ring"
        style={{
          width: "400px",
          height: "400px",
          left: "50%",
          top: "30%",
        }}
      />
      <div
        className="cyber-ring cyber-ring-inner"
        style={{
          width: "300px",
          height: "300px",
          left: "50%",
          top: "30%",
        }}
      />
      <div
        className="cyber-ring"
        style={{
          width: "200px",
          height: "200px",
          left: "50%",
          top: "30%",
          animationDuration: "25s",
        }}
      />

      {/* Secondary ring cluster */}
      <div
        className="cyber-ring"
        style={{
          width: "250px",
          height: "250px",
          left: "15%",
          top: "70%",
          opacity: 0.5,
        }}
      />
      <div
        className="cyber-ring cyber-ring-inner"
        style={{
          width: "180px",
          height: "180px",
          left: "15%",
          top: "70%",
          opacity: 0.5,
        }}
      />

      {/* Energy waves */}
      <div className="cyber-wave" style={{ top: "20%", animationDelay: "0s" }} />
      <div className="cyber-wave" style={{ top: "45%", animationDelay: "2s" }} />
      <div className="cyber-wave" style={{ top: "70%", animationDelay: "4s" }} />
      <div className="cyber-wave" style={{ top: "90%", animationDelay: "6s" }} />

      {/* Scanlines */}
      <div className="cyber-scanline" style={{ animationDelay: "0s" }} />
      <div className="cyber-scanline" style={{ animationDelay: "3.3s" }} />
      <div className="cyber-scanline" style={{ animationDelay: "6.6s" }} />

      {/* Floating particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className={`cyber-particle ${p.isGold ? "cyber-particle-gold" : ""}`}
          style={{
            left: `${p.left}%`,
            bottom: "-20px",
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}

      {/* Data stream lines */}
      {dataLines.map((d) => (
        <div
          key={d.id}
          className="cyber-data-line"
          style={{
            left: `${d.left}%`,
            height: `${d.height}px`,
            animationDelay: `${d.delay}s`,
            animationDuration: `${d.duration}s`,
          }}
        />
      ))}

      {/* Hexagonal decorations (Duel Disk inspired) */}
      <svg
        className="cyber-hex"
        style={{ left: "5%", top: "15%", width: "150px", height: "150px" }}
        viewBox="0 0 100 100"
      >
        <polygon
          points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5"
          fill="none"
          stroke="rgba(124, 58, 237, 0.5)"
          strokeWidth="0.5"
        />
        <polygon
          points="50,15 85,32.5 85,67.5 50,85 15,67.5 15,32.5"
          fill="none"
          stroke="rgba(124, 58, 237, 0.2)"
          strokeWidth="0.5"
        />
        <polygon
          points="50,25 75,37.5 75,62.5 50,75 25,62.5 25,37.5"
          fill="none"
          stroke="rgba(124, 58, 237, 0.1)"
          strokeWidth="0.5"
        />
      </svg>

      <svg
        className="cyber-hex"
        style={{
          right: "8%",
          top: "50%",
          width: "120px",
          height: "120px",
          animationDirection: "reverse",
          animationDuration: "45s",
        }}
        viewBox="0 0 100 100"
      >
        <polygon
          points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5"
          fill="none"
          stroke="rgba(255, 215, 0, 0.15)"
          strokeWidth="0.5"
        />
        <polygon
          points="50,20 80,35 80,65 50,80 20,65 20,35"
          fill="none"
          stroke="rgba(255, 215, 0, 0.1)"
          strokeWidth="0.5"
        />
      </svg>

      <svg
        className="cyber-hex"
        style={{
          left: "70%",
          bottom: "20%",
          width: "100px",
          height: "100px",
          animationDuration: "50s",
        }}
        viewBox="0 0 100 100"
      >
        <polygon
          points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5"
          fill="none"
          stroke="rgba(124, 58, 237, 0.2)"
          strokeWidth="0.5"
        />
      </svg>

      {/* Circuit lines (top corners) */}
      <svg
        className="absolute left-0 top-0 h-64 w-64 opacity-40"
        viewBox="0 0 200 200"
        style={{ animation: "millennium-glow 4s ease-in-out infinite" }}
      >
        <path
          d="M0,50 L50,50 L50,100 L100,100 L100,150"
          fill="none"
          stroke="rgba(124, 58, 237, 0.5)"
          strokeWidth="1"
          strokeDasharray="5,5"
        />
        <circle cx="50" cy="50" r="3" fill="rgba(124, 58, 237, 0.6)" />
        <circle cx="100" cy="100" r="3" fill="rgba(124, 58, 237, 0.6)" />
        <circle cx="100" cy="150" r="3" fill="rgba(124, 58, 237, 0.6)" />
      </svg>

      <svg
        className="absolute right-0 top-0 h-64 w-64 opacity-40"
        viewBox="0 0 200 200"
        style={{
          transform: "scaleX(-1)",
          animation: "millennium-glow 4s ease-in-out infinite",
          animationDelay: "2s",
        }}
      >
        <path
          d="M0,50 L50,50 L50,100 L100,100 L100,150"
          fill="none"
          stroke="rgba(124, 58, 237, 0.5)"
          strokeWidth="1"
          strokeDasharray="5,5"
        />
        <circle cx="50" cy="50" r="3" fill="rgba(124, 58, 237, 0.6)" />
        <circle cx="100" cy="100" r="3" fill="rgba(124, 58, 237, 0.6)" />
        <circle cx="100" cy="150" r="3" fill="rgba(124, 58, 237, 0.6)" />
      </svg>

      {/* Bottom corner circuits */}
      <svg
        className="absolute bottom-0 left-0 h-48 w-48 opacity-30"
        viewBox="0 0 150 150"
      >
        <path
          d="M0,100 L30,100 L30,70 L60,70 L60,40 L90,40"
          fill="none"
          stroke="rgba(124, 58, 237, 0.5)"
          strokeWidth="1"
        />
        <circle cx="30" cy="100" r="2" fill="rgba(124, 58, 237, 0.5)" />
        <circle cx="60" cy="70" r="2" fill="rgba(124, 58, 237, 0.5)" />
        <circle cx="90" cy="40" r="2" fill="rgba(124, 58, 237, 0.5)" />
      </svg>

      {/* Vignette overlay — lighter so effects show through */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 0%, rgba(9, 9, 11, 0.15) 60%, rgba(9, 9, 11, 0.45) 100%)",
        }}
      />
    </div>
  );
}
