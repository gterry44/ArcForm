import React, { useState } from "react";
import { UserProfile, ArchetypeType } from "../types";
import { ARCHETYPES_LIST } from "../data";
import { Maximize2, Minimize2, Sparkles, Compass, Layers } from "lucide-react";

interface PhysiqueBlueprintProps {
  profile: UserProfile;
}

interface ArchetypeCoordinates {
  leftShoulder: [number, number];
  rightShoulder: [number, number];
  leftWaist: [number, number];
  rightWaist: [number, number];
  leftHip: [number, number];
  rightHip: [number, number];
  head: [number, number];
}

const ARCHETYPE_COORDS_MAP: Record<ArchetypeType, ArchetypeCoordinates> = {
  "Foundation Builder": {
    leftShoulder: [10, 80],
    rightShoulder: [90, 80],
    leftWaist: [35, 75],
    rightWaist: [65, 75],
    leftHip: [20, 160],
    rightHip: [80, 160],
    head: [50, 30]
  },
  "Lean Frame": {
    leftShoulder: [15, 80],
    rightShoulder: [85, 80],
    leftWaist: [32, 75],
    rightWaist: [68, 75],
    leftHip: [25, 160],
    rightHip: [75, 160],
    head: [50, 25]
  },
  "Athletic Builder": {
    leftShoulder: [8, 78],
    rightShoulder: [92, 78],
    leftWaist: [30, 72],
    rightWaist: [70, 72],
    leftHip: [22, 158],
    rightHip: [78, 158],
    head: [50, 20]
  },
  "Athletic V-Taper": {
    leftShoulder: [5, 75],
    rightShoulder: [95, 75],
    leftWaist: [28, 72],
    rightWaist: [72, 72],
    leftHip: [25, 155],
    rightHip: [75, 155],
    head: [50, 15]
  },
  "Balanced Physique": {
    leftShoulder: [3, 72],
    rightShoulder: [97, 72],
    leftWaist: [26, 71],
    rightWaist: [74, 71],
    leftHip: [27, 152],
    rightHip: [73, 152],
    head: [50, 12]
  },
  "Classic Aesthetic": {
    leftShoulder: [1, 68],
    rightShoulder: [99, 68],
    leftWaist: [24, 69],
    rightWaist: [76, 69],
    leftHip: [28, 150],
    rightHip: [72, 150],
    head: [50, 8]
  },
  "Advanced Aesthetic": {
    leftShoulder: [0, 65],
    rightShoulder: [100, 65],
    leftWaist: [22, 68],
    rightWaist: [78, 68],
    leftHip: [30, 148],
    rightHip: [70, 148],
    head: [50, 5]
  }
};

export const PhysiqueBlueprint: React.FC<PhysiqueBlueprintProps> = ({ profile }) => {
  const [activeFocalArea, setActiveFocalArea] = useState<"shoulders" | "waist" | "general">("general");
  // Interactive "Stone Revealed" morph preview state (0 to 100)
  const [carvingReveal, setCarvingReveal] = useState<number>(65);

  const currentArchName = profile.currentArchetype;
  const targetArchName = profile.targetArchetype;

  const currentArch = ARCHETYPES_LIST.find((a) => a.name === currentArchName) || ARCHETYPES_LIST[1];
  const targetArch = ARCHETYPES_LIST.find((a) => a.name === targetArchName) || ARCHETYPES_LIST[3];

  const currentCoords = ARCHETYPE_COORDS_MAP[currentArchName] || ARCHETYPE_COORDS_MAP["Lean Frame"];
  const targetCoords = ARCHETYPE_COORDS_MAP[targetArchName] || ARCHETYPE_COORDS_MAP["Athletic V-Taper"];

  // Find intermediate step for anticipation progression
  const currentLevel = currentArch.level;
  const targetLevel = targetArch.level;
  const intermediateArch = ARCHETYPES_LIST.find(
    (a) => a.level > currentLevel && a.level < targetLevel
  ) || ARCHETYPES_LIST.find((a) => a.level === currentLevel + 1) || targetArch;

  // Calculate dynamic transition coordinates based on carvingReveal slider
  const interpolate = (start: number, end: number, factor: number) => {
    return start + (end - start) * factor;
  };

  const currentFactor = carvingReveal / 100;

  // Let's create custom SVG path states if possible, or transition opacity. 
  // Let's render the Current outline (Raw Stone) as a solid blocky background with lower opacity,
  // and render the Target (Revealed Form) with full glowing line elegance, 
  // with dynamic focal sweep rings that grow/shrink based on user interactions.

  return (
    <div className="glass-panel rounded-3xl p-8 lg:p-12 border border-zinc-900 bg-zinc-950/45 relative overflow-hidden box-border">
      {/* Background blueprint grids: luxury draft pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="grid-pattern-blueprint" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-pattern-blueprint)" />
        </svg>
      </div>

      {/* Main Grid Deck */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 relative z-10 items-center">
        
        {/* Left Column: Command & Sculptor Conviction */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-10">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500">
                <Compass className="w-4 h-4 stroke-[1.25]" />
              </span>
              <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest font-bold">
                Blueprint Layout
              </span>
            </div>

            <div className="space-y-3">
              <h3 className="text-4xl font-display font-black text-white tracking-tight uppercase leading-none">
                Sculpt Your Line
              </h3>
              <p className="text-sm text-zinc-400 font-sans leading-relaxed tracking-wide">
                Your target shape is within reach. Focus on what matters, stay consistent, and let's work on your symmetry.
              </p>
            </div>

            {/* Tactile Sculptor HUD controls */}
            <div className="space-y-2 pt-4 text-left">
              <div 
                onClick={() => setActiveFocalArea("shoulders")}
                className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                  activeFocalArea === "shoulders" 
                    ? "bg-amber-500/10 border-amber-500/40" 
                    : "bg-zinc-900/10 border-zinc-900/40 hover:border-zinc-800"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-white tracking-wide flex items-center gap-2.5">
                    <Maximize2 className="w-4 h-4 text-amber-550 stroke-[1.5]" />
                    Shoulder Width Focus
                  </span>
                  <span className="text-[9px] text-zinc-500 font-mono">Focal Area</span>
                </div>
                <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                  Sculpt lateral shoulders to construct your athletic frame.
                </p>
              </div>

              <div 
                onClick={() => setActiveFocalArea("waist")}
                className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                  activeFocalArea === "waist" 
                    ? "bg-amber-500/10 border-amber-500/40" 
                    : "bg-zinc-900/10 border-zinc-900/40 hover:border-zinc-800"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-white tracking-wide flex items-center gap-2.5">
                    <Minimize2 className="w-4 h-4 text-amber-550 stroke-[1.5]" />
                    Waist Line Focus
                  </span>
                  <span className="text-[9px] text-zinc-500 font-mono">Focal Area</span>
                </div>
                <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                  Define midsection control to expose proportions clearly.
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Carving Progress Slider Panel */}
          <div className="bg-zinc-900/30 p-5 rounded-2xl border border-zinc-900 space-y-4">
            <div className="flex justify-between text-[11px] font-mono text-zinc-400 tracking-wider font-bold">
              <span>Goal Progress: {carvingReveal}%</span>
            </div>
            
            {/* Range slider representing carving / removal progression */}
            <div className="relative flex items-center">
              <input 
                type="range" 
                min="10" 
                max="100" 
                value={carvingReveal}
                onChange={(e) => setCarvingReveal(Number(e.target.value))}
                className="w-full h-1 bg-zinc-850 rounded-lg appearance-none cursor-pointer accent-amber-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-mono">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
              <span>Simulate target form changes over time.</span>
            </div>
          </div>
        </div>

        {/* Right Column: Architectural Drafting Instrument (The Masterpiece Visual) */}
        <div className="lg:col-span-7 flex flex-col justify-between bg-black/40 rounded-3xl p-8 lg:p-10 border border-zinc-900 relative min-h-[500px]">
          {/* Subtle luxurious patent marking lines */}
          <div className="absolute top-4 left-4 font-mono text-[8px] text-zinc-600 tracking-wider uppercase">
            ARCFORM SYMMETRY MODEL
          </div>
          <div className="absolute top-4 right-4 font-mono text-[8px] text-zinc-650 tracking-wider">
            STATUS: ACTIVE
          </div>
          <div className="absolute bottom-4 left-4 font-mono text-[8px] text-zinc-650 tracking-wide uppercase">
            CONSISTENCY OVER EVERYTHING
          </div>
          <div className="absolute bottom-4 right-4 font-mono text-[8px] text-zinc-600 tracking-widest text-right">
            BALANCED SYMMETRY
          </div>

          {/* Luxury Archetype Anticipation Track */}
          <div className="flex justify-between items-center z-10 border-b border-zinc-900/80 pb-4 mb-4">
            <div className="text-left">
              <span className="text-[9px] font-mono text-zinc-500 block uppercase tracking-wider">Current Form</span>
              <span className="text-xs font-black text-white uppercase tracking-tight">{currentArchName}</span>
            </div>
            
            {/* Interactive arrow element showing inevitable progression */}
            <div className="hidden sm:flex items-center gap-2 text-zinc-600 font-mono text-[10px]">
              <span className="px-1.5 py-0.5 rounded border border-zinc-800 bg-zinc-900/30 text-zinc-500">Tier {currentLevel}</span>
              <span>➔</span>
              <span className="text-amber-500 font-medium">Progress Goal</span>
              <span>➔</span>
              <span className="px-1.5 py-0.5 rounded border border-amber-950 bg-amber-950/20 text-amber-500">Tier {targetLevel}</span>
            </div>

            <div className="text-right">
              <span className="text-[9px] font-mono text-amber-500 block uppercase tracking-wider">Target Form</span>
              <span className="text-xs font-black text-amber-500 uppercase tracking-tight">{targetArchName}</span>
            </div>
          </div>

          {/* Centralized SVG Silhouette Drafting */}
          <div className="w-full max-w-[300px] mx-auto aspect-[4/5] relative flex items-center justify-center my-4">
            
            {/* Visual Depth Glow effects behind */}
            <div 
              className="absolute inset-0 bg-radial from-amber-500/5 via-transparent to-transparent pointer-events-none transition-opacity duration-500" 
              style={{ opacity: carvingReveal / 100 }}
            />

            <svg 
              viewBox="0 0 100 180" 
              className="w-full h-full drop-shadow-[0_0_40px_rgba(245,158,11,0.02)] transition-transform duration-500"
            >
              <defs>
                {/* Tech Blueprint Grid Watermark patterns */}
                <pattern id="inner-dots" width="8" height="8" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="0.5" fill="rgba(255, 255, 255, 0.08)" />
                </pattern>

                <linearGradient id="body-gradient-raw" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3f3f46" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#27272a" stopOpacity="0.05" />
                </linearGradient>

                <linearGradient id="body-gradient-target" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#eab308" stopOpacity={interpolate(0.01, 0.12, currentFactor)} />
                  <stop offset="100%" stopColor="#d97706" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Watermark grid behind outline */}
              <rect x="5" y="5" width="90" height="170" fill="url(#inner-dots)" pointerEvents="none" />

              {/* Center baseline tracking axes */}
              <line x1="50" y1="0" x2="50" y2="180" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="0.5" />
              <line x1="0" y1="80" x2="100" y2="80" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="0.5" />
              <line x1="0" y1="150" x2="100" y2="150" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="0.5" />

              {/* Concentric drafting crosshairs */}
              <circle cx="50" cy="80" r="40" fill="none" stroke="rgba(234, 179, 8, 0.03)" strokeWidth="0.5" />
              <circle cx="50" cy="80" r="70" fill="none" stroke="rgba(234, 179, 8, 0.015)" strokeWidth="0.5" strokeDasharray="1 5" />

              {/* 1. RAW STONE / CURRENT FORM (Dashed background outline - fading as carvingReveal increases) */}
              <path
                d={currentArch.imageRepresentation}
                fill="url(#body-gradient-raw)"
                stroke="rgba(113, 113, 122, 0.5)"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="4 4"
                style={{ opacity: interpolate(1.0, 0.3, currentFactor) }}
                className="transition-all duration-300"
              />

              {/* 2. PROGRESS REVEAL OVERLAY INDICATOR PATH (Dynamic blend visualization) */}
              <path
                d={targetArch.imageRepresentation}
                fill="url(#body-gradient-target)"
                stroke="#d97706"
                strokeWidth={interpolate(1.0, 2.5, currentFactor)}
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ 
                  opacity: currentFactor,
                  filter: `drop-shadow(0 0 ${interpolate(0, 10, currentFactor)}px rgba(245, 158, 11, 0.35))` 
                }}
                className="transition-all duration-300"
              />

              {/* Drafting horizontal callouts & measurements */}
              <g className={`transition-all duration-300 ${activeFocalArea === "shoulders" || activeFocalArea === "general" ? "opacity-100" : "opacity-20"}`}>
                {/* Horizontal shoulder measuring line with dynamic focus dots */}
                <line 
                  x1={currentCoords.leftShoulder[0]} 
                  y1={targetCoords.leftShoulder[1]} 
                  x2={targetCoords.leftShoulder[0]} 
                  y2={targetCoords.leftShoulder[1]} 
                  stroke="#fbbf24" 
                  strokeWidth="0.5" 
                  strokeDasharray="1 1"
                />
                <line 
                  x1={currentCoords.rightShoulder[0]} 
                  y1={targetCoords.rightShoulder[1]} 
                  x2={targetCoords.rightShoulder[0]} 
                  y2={targetCoords.rightShoulder[1]} 
                  stroke="#fbbf24" 
                  strokeWidth="0.5" 
                  strokeDasharray="1 1"
                />

                {/* Left & Right custom shoulder targets */}
                <circle cx={targetCoords.leftShoulder[0]} cy={targetCoords.leftShoulder[1]} r="2" fill="#f59e0b" />
                <circle cx={targetCoords.rightShoulder[0]} cy={targetCoords.rightShoulder[1]} r="2" fill="#f59e0b" />
                
                {/* Visual marker line across the width gap */}
                <path 
                  d={`M ${targetCoords.leftShoulder[0]} ${targetCoords.leftShoulder[1]} H ${targetCoords.rightShoulder[0]}`}
                  fill="none"
                  stroke="rgba(245, 158, 11, 0.15)"
                  strokeWidth="0.5"
                />
              </g>

              <g className={`transition-all duration-300 ${activeFocalArea === "waist" || activeFocalArea === "general" ? "opacity-100" : "opacity-20"}`}>
                {/* Core waist indicators */}
                <line 
                  x1={currentCoords.leftWaist[0]} 
                  y1={targetCoords.leftWaist[1]} 
                  x2={targetCoords.leftWaist[0]} 
                  y2={targetCoords.leftWaist[1]} 
                  stroke="#fbbf24" 
                  strokeWidth="0.5" 
                  strokeDasharray="1 1"
                />
                <line 
                  x1={currentCoords.rightWaist[0]} 
                  y1={targetCoords.rightWaist[1]} 
                  x2={targetCoords.rightWaist[0]} 
                  y2={targetCoords.rightWaist[1]} 
                  stroke="#fbbf24" 
                  strokeWidth="0.5" 
                  strokeDasharray="1 1"
                />

                <circle cx={targetCoords.leftWaist[0]} cy={targetCoords.leftWaist[1]} r="1.5" fill="#f59e0b" />
                <circle cx={targetCoords.rightWaist[0]} cy={targetCoords.rightWaist[1]} r="1.5" fill="#f59e0b" />
              </g>

              {/* Precise architectural labels embedded seamlessly into the drawing */}
              {activeFocalArea === "shoulders" && (
                <text x="50" y="66" textAnchor="middle" fill="#fbbf24" fontSize="4.5" fontFamily="monospace" letterSpacing="0.08em" fontWeight="bold">
                  SHOULDERS FOCUS
                </text>
              )}

              {activeFocalArea === "waist" && (
                <text x="50" y="66" textAnchor="middle" fill="#fbbf24" fontSize="4.5" fontFamily="monospace" letterSpacing="0.08em" fontWeight="bold">
                  WAIST LINE
                </text>
              )}

              {/* Reference indicator head center dot */}
              <circle cx="50" cy="30" r="1.5" fill="rgba(234, 179, 8, 0.3)" />
            </svg>
          </div>

          {/* Emotional Payoff Quote Line - Minimalist, single sentence */}
          <div className="text-center pt-4 border-t border-zinc-900/40">
            <h1 className="text-lg font-black tracking-tight text-white uppercase font-display leading-tight">
              THE LINE IS THERE. STAY CONSISTENT.
            </h1>
          </div>
        </div>

      </div>
    </div>
  );
};
