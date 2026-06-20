import React, { useState } from "react";
import { Award, Zap, Compass, RefreshCw, Layout, Eye, Sparkles, TrendingUp, CheckCircle, ArrowRight, ShieldCheck } from "lucide-react";
import { UserProfile, ArchetypeDetail, ArchetypeType } from "../types";
import { ARCHETYPES_LIST } from "../data";

interface ArchetypePediaProps {
  profile: UserProfile;
}

interface ProgressionStep {
  targetArchetype: ArchetypeType;
  level: number;
  timeframe: string;
  keyVisualChanges: string[];
  trainingFocus: string[];
  credibleMilestone: string;
}

const PROGRESSION_PATHS: Record<ArchetypeType, ProgressionStep[]> = {
  "Foundation Builder": [
    {
      targetArchetype: "Lean Frame",
      level: 2,
      timeframe: "8 - 12 Weeks",
      keyVisualChanges: [
        "Primary standing posture corrects to a tall, straight spine with level shoulders and neck.",
        "Initial separation lines appear around collarbones and upper chest plate.",
        "Core abdominal muscular wall tightens to lay down a solid front torso foundation."
      ],
      trainingFocus: [
        "Learn correct mechanics for major lifting patterns (pulldowns, shoulder presses, incline pushups).",
        "Perform daily 2-minute posture holds flattening back, shoulders, and heels against a wall.",
        "Sustain eating basic clean proteins (eggs, dairy, lean meats) to match recovery demands."
      ],
      credibleMilestone: "Complete 15 consistent training logs and hold a active wall-static posture comfortably for 1 minute."
    },
    {
      targetArchetype: "Athletic Builder",
      level: 3,
      timeframe: "16 - 24 Weeks",
      keyVisualChanges: [
        "Skeletal muscle bellies (especially biceps, chest plate, and outer back) gain noticeble thickness.",
        "Upper torso frame begins to widen, making the lower waist look smaller in comparison.",
        "Denser back silhouette creates an proud, upright visual outline."
      ],
      trainingFocus: [
        "Introduce direct compound lifting sets using flat and incline chest presses.",
        "Execute high-eccentric horizontal rows to broaden the shoulder blades and lat bases.",
        "Eat a slight, clean calorie surplus to pack on muscle fullness over the frame."
      ],
      credibleMilestone: "Sustain three consecutive A-grade workout logs and reach a solid bodyweight-equivalent lift."
    },
    {
      targetArchetype: "Athletic V-Taper",
      level: 4,
      timeframe: "36 - 50 Weeks",
      keyVisualChanges: [
        "Back width flare creates a clear visible 'V' shape from behind, tapering down cleanly.",
        "Side shoulder caps widen further to enhance broad outline even while relaxed.",
        "Midsection becomes compact and flat through targeted muscle contraction."
      ],
      trainingFocus: [
        "Heavy vertical pull-ups and pulldowns directly targeting outer lat expansion.",
        "Rigorous shoulder raises focusing on the side lateral heads under strict control.",
        "Morning vacuum stomach squeezes on empty stomach to tighten deep midsection walls."
      ],
      credibleMilestone: "Hit a verified 1.28+ shoulder-to-waist ratio and perform 10 clean, unassisted pull-ups."
    }
  ],
  "Lean Frame": [
    {
      targetArchetype: "Athletic V-Taper",
      level: 4,
      timeframe: "12 - 16 Weeks",
      keyVisualChanges: [
        "Primary upper back lats expand outward, carving a clear outline sweep from shoulders to hips.",
        "Lateral shoulder caps grow rounder, balancing neck length and broadening your relaxed frame.",
        "Upper chest plate fills upward, eliminating flat areas around the collarbones."
      ],
      trainingFocus: [
        "Aesthetic focus on slow-eccentric lat pulldowns and high 30-degree incline press variations.",
        "Dumbbell lateral shoulder raises performed with strict vertical control (no swaying weights).",
        "Eat a consistent 200-300 calorie surplus packed with clean daily protein."
      ],
      credibleMilestone: "Accumulate 40 total heavy back and side shoulder sets with verified slow-tempo controls."
    },
    {
      targetArchetype: "Balanced Physique",
      level: 5,
      timeframe: "24 - 36 Weeks",
      keyVisualChanges: [
        "Symmetric muscle fullness across entire upper body, creating a complete aesthetic look.",
        "Rear shoulder muscles stand out to pull posture back, naturally expanding the chest line.",
        "The midsection remains extremely trim, with sharp lines over the upper stomach area."
      ],
      trainingFocus: [
        "Symmetry priority work: add rear shoulder fly sets directly following your primary pressing routines.",
        "Incline chest-supported dumbbell pulling to widen inside margins of the back.",
        "Focus on healthy, unprocessed carbs to fuel active gym lifts without adding stomach depth."
      ],
      credibleMilestone: "Achieve a neat, balanced shape on your scans with a verified 7-day consistency score above 85%."
    },
    {
      targetArchetype: "Classic Aesthetic",
      level: 6,
      timeframe: "48 - 60 Weeks",
      keyVisualChanges: [
        "Stunning V-taper frame featuring a tiny waist outline set against broad, thick shoulders.",
        "Extreme muscular definition across chest folds, and outer lat outlines.",
        "Visually separate physical partitions across neck, chest, back, and arms."
      ],
      trainingFocus: [
        "High progressive volume raises, working close to physical muscular failure with correct form.",
        "Intricate cable extensions and posture alignments to maintain ultimate upright carriage.",
        "Careful portion-cycling phases to peel away any minor fat cover hiding the muscle grooves."
      ],
      credibleMilestone: "Hold body fat below 10% consistently while sustaining heavy physical performance on core exercises."
    }
  ],
  "Athletic Builder": [
    {
      targetArchetype: "Athletic V-Taper",
      level: 4,
      timeframe: "8 - 12 Weeks",
      keyVisualChanges: [
        "Waistline gets visibly smaller and tighter as soft excess weight is shed.",
        "Existing shoulder muscle and chest plate look significantly sharper and more separated.",
        "A flat stomach profile emerges as abdominal tissue compacts."
      ],
      trainingFocus: [
        "Establish a steady, small calorie deficit utilizing whole food meals.",
        "Consolidate back posture routines using high-tension, strict overhead pulling.",
        "Execute daily stomach drawings to build permanent deep transverse abdominal tightness."
      ],
      credibleMilestone: "Reduce body fat percentage below 13% while maintaining core compound workout weight."
    },
    {
      targetArchetype: "Balanced Physique",
      level: 5,
      timeframe: "16 - 24 Weeks",
      keyVisualChanges: [
        "Torso symmetry is restored as wide lat flare balances current solid chest depth.",
        "Upper chest section fills out and forms a clean, flat shelf up to collarbone lines.",
        "Symmetric lines between stomach blocks and side chest walls become highly defined."
      ],
      trainingFocus: [
        "Strict incline presses on 30-degree angles to target upper muscle fibers.",
        "Chest-supported row variations to build postural back thickness with zero low-back fatigue.",
        "Consistently tracking macro details to keep nutrition dense but lean."
      ],
      credibleMilestone: "Drop waist measurement to optimal ratio limits while maintaining wide shoulder outlines."
    },
    {
      targetArchetype: "Classic Aesthetic",
      level: 6,
      timeframe: "36 - 48 Weeks",
      keyVisualChanges: [
        "Instantly recognizable action-figure dimensions: thick, capped shoulders and narrow hips.",
        "Broad, high back width sweep that makes the midsection stand out as very tight.",
        "Carved separations between biceps, delts, chest folds, and back divisions."
      ],
      trainingFocus: [
        "Incorporate strict isolation variations (low cables, single-arm raises, chest-supported rows).",
        "Use drop sets and peak-tension pauses to stimulate new muscle fullness.",
        "Strict portion limits to achieve and sustain body fat between 8% to 10%."
      ],
      credibleMilestone: "Attain a proven 1.41+ shoulder-to-waist taper under single-digit body fat limits."
    }
  ],
  "Athletic V-Taper": [
    {
      targetArchetype: "Balanced Physique",
      level: 5,
      timeframe: "12 - 16 Weeks",
      keyVisualChanges: [
        "Total proportion balance between chest plate, back, and lower body parameters.",
        "Symmetrical chest fullness with even square thickness from upper to lower lines.",
        "Robust shoulder-to-neck transition that gives you a solid, healthy postural carriage."
      ],
      trainingFocus: [
        "Prioritize chest incline dumbbell press setups inside your active training log.",
        "Perform wide, slow chest-supported mid-back rows to expand visual back thickness.",
        "Slightly increase healthy carb and clean protein amounts to power muscle recovery."
      ],
      credibleMilestone: "Sustain active high-grade training loops and lock in A-grade performance for 14 straight days."
    },
    {
      targetArchetype: "Classic Aesthetic",
      level: 6,
      timeframe: "24 - 36 Weeks",
      keyVisualChanges: [
        "High muscular thickness coupled with an ultra-slim, compact waist envelope.",
        "Fabulous shoulder-to-hip sweep pulling your posture into permanent visual alignment.",
        "Deep muscular separation lines across back lats and abdominal structures."
      ],
      trainingFocus: [
        "Advanced high-eccentric mechanical loading variations and dropsets.",
        "Horizontal and visual stretch movements (such as high dumbbell pullovers) to expand lat length.",
        "Meticulous lifestyle and sodium tracking to enhance skin tightness over defined muscles."
      ],
      credibleMilestone: "Build a verified 1.41+ V-taper ratio with visible upper and lower abdominal symmetry."
    },
    {
      targetArchetype: "Advanced Aesthetic",
      level: 7,
      timeframe: "48 - 72 Weeks",
      keyVisualChanges: [
        "Elite muscular separation lines visible in any lighting.",
        "Ultra-thin skin appearance over deep back lats, chest corners, and side serratus ribs.",
        "Perfect posture symmetry from all scanning angles."
      ],
      trainingFocus: [
        "Sustain elite-level mechanical tension over multi-year progressive programs.",
        "Extremely precise calorie and meal scheduling to shave off minor fat layers without muscle loss.",
        "Strict sleep, muscle tissue therapy, and posture preservation guidelines."
      ],
      credibleMilestone: "Sustain body fat strictly at 7-8% while keeping high baseline strength parameters."
    }
  ],
  "Balanced Physique": [
    {
      targetArchetype: "Classic Aesthetic",
      level: 6,
      timeframe: "16 - 24 Weeks",
      keyVisualChanges: [
        "Broad, wide flare at the visual sides of the back forming a beautiful classic shield.",
        "Ultra-slim midsection with a flat lower stomach and crisp lines.",
        "Full, round shoulder caps transitioning into the upper arm with deep separation."
      ],
      trainingFocus: [
        "Perform overhead standing shoulder presses and wide pull-ups to failure with strict posture.",
        "Hold empty-stomach core vacuum drills for 3 rounds of 20 seconds each morning.",
        "Apply small, timed fat-loss cycles to naturally highlight the underlying physical design."
      ],
      credibleMilestone: "Drop body fat to 9% or below while keeping shoulder and lat dimensions fully intact."
    },
    {
      targetArchetype: "Advanced Aesthetic",
      level: 7,
      timeframe: "36 - 50 Weeks",
      keyVisualChanges: [
        "Complete, detailed muscular splits with deep grooves across chest, back, and arms.",
        "Sleek and dry abdominal walls with highly visible side outline detail.",
        "A pristine symmetrical outline that remains evident even when at rest."
      ],
      trainingFocus: [
        "Apply highest level physical mechanical tension with strict isolation controls.",
        "Extremely strict nutrient timing and protein-source rotating.",
        "Targeted secondary exercises for rear shoulders, core details, and lower back stability."
      ],
      credibleMilestone: "Reach a 1.49+ V-taper ratio on consecutive scans, and maintain full physical metrics."
    }
  ],
  "Classic Aesthetic": [
    {
      targetArchetype: "Advanced Aesthetic",
      level: 7,
      timeframe: "24 - 36 Weeks",
      keyVisualChanges: [
        "Deep muscular separation lines across every single visual perspective.",
        "Elite, highly defined side stomach musculature and a tight waist.",
        "Remarkable muscle density that holds its full shape and height even at rest."
      ],
      trainingFocus: [
        "Utilize high-tension tempo patterns including 4-second descents and pause locks.",
        "Maintain clean, mineral-balanced whole-food nutrition and strict water targets.",
        "Continue posture exercises to ensure chest muscles lay flat over an expanded ribcage."
      ],
      credibleMilestone: "Hold body fat below 8% while showing complete posture alignment ratings on multiple scans."
    }
  ],
  "Advanced Aesthetic": [
    {
      targetArchetype: "Advanced Aesthetic", // Stays high level but aims for elite, healthy symmetry
      level: 7,
      timeframe: "Continuous Maintenance",
      keyVisualChanges: [
        "Maintains elite muscular thickness with perfect vascular lines year-round.",
        "Posture is wide-set, standing upright with relaxed, open shoulders.",
        "Crisp separations across all physical views with zero joint strain."
      ],
      trainingFocus: [
        "Perform injury-preventative tempo lifts (strictly controlled cables and dumbbell sweeps).",
        "Deep tissue stretching, spinal decompression, and mobility alignments to widen back sweep naturally.",
        "Consume high-quality proteins and focus on premium micronutrient diets."
      ],
      credibleMilestone: "Hold perfect proportion ratios with high energy levels, clean joint health, and painless posture performance."
    }
  ]
};

export default function ArchetypePedia({ profile }: ArchetypePediaProps) {
  const [activeTab, setActiveTab] = useState<"paths" | "directory">("paths");
  
  // Initialize the explored starting point to the user's current archetype
  const [exploredStart, setExploredStart] = useState<ArchetypeType>(() => {
    return profile.currentArchetype || "Lean Frame";
  });

  const currentLevel = ARCHETYPES_LIST.find(a => a.name === profile.currentArchetype)?.level || 1;
  const targetLevel = ARCHETYPES_LIST.find(a => a.name === profile.targetArchetype)?.level || 1;

  // Retrieve progression sequence for selected starting archetype
  const exploredPath = PROGRESSION_PATHS[exploredStart] || PROGRESSION_PATHS["Lean Frame"];

  return (
    <div id="arcform-pedia-wrapper" className="space-y-8 animate-fade-in">
      
      {/* HEADER SECTION */}
      <div className="border-b border-zinc-900 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-widest mb-1.5 animate-pulse">
            <Award className="w-4 h-4 text-amber-500" />
            Progression Guide
          </div>
          <h1 className="text-3xl font-display font-black text-white tracking-tight">
            Physique Shapes Library
          </h1>
          <p className="text-xs text-zinc-400 mt-1 max-w-xl">
            Symmetry is built, not given. Realize your body shape goals by tracking a credible, realistic path of gradual visual progression. No shortcuts, just consistent training.
          </p>
        </div>

        {/* SUB-TABS INTERACTIVE CONTROL */}
        <div className="flex items-center bg-zinc-950 p-1 rounded-xl border border-zinc-900 shrink-0">
          <button
            onClick={() => setActiveTab("paths")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === "paths"
                ? "bg-amber-500 text-zinc-950 shadow-inner"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Progression Paths</span>
          </button>
          <button
            onClick={() => setActiveTab("directory")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === "directory"
                ? "bg-amber-500 text-zinc-950"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Layout className="w-3.5 h-3.5" />
            <span>All Shapes</span>
          </button>
        </div>
      </div>

      {activeTab === "paths" ? (
        <div className="space-y-8">
          
          {/* INTERACTIVE SELECTOR HEADER */}
          <div className="bg-zinc-950/60 border border-zinc-900 p-5 rounded-2xl space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5">
              <div>
                <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest font-bold">Interactive Selector</span>
                <h3 className="text-sm font-semibold text-white mt-1">Select a starting Physique Type:</h3>
              </div>
              {exploredStart === profile.currentArchetype && (
                <span className="text-[9px] font-mono bg-amber-500/10 text-amber-400 border border-amber-550/20 px-2.5 py-1 rounded-full uppercase font-bold shrink-0">
                  Showing Your Estimated Start Point
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {ARCHETYPES_LIST.map((arch) => {
                const isActive = exploredStart === arch.name;
                const isUserCurrent = profile.currentArchetype === arch.name;

                return (
                  <button
                    key={arch.name}
                    onClick={() => setExploredStart(arch.name)}
                    className={`px-3 py-2 rounded-xl border text-[11px] font-bold transition-all flex items-center gap-2 cursor-pointer select-none ${
                      isActive
                        ? "bg-amber-500 text-zinc-950 border-amber-400 shadow-md font-black"
                        : "bg-zinc-900/40 border-zinc-900 text-zinc-400 hover:text-white hover:border-zinc-800"
                    }`}
                  >
                    <span>{arch.name}</span>
                    {isUserCurrent && (
                      <span className={`text-[8px] font-black font-mono px-1 rounded uppercase ${
                        isActive ? "bg-zinc-950 text-amber-400" : "bg-amber-500/15 text-amber-400 border border-amber-500/20"
                      }`}>
                        Yours
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* PATHWAY CONTAINER */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* TIMELINE LEFT ROW (Step steps) */}
            <div className="lg:col-span-3 space-y-6 relative pl-4 md:pl-6 before:absolute before:left-[11px] md:before:left-[19px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gradient-to-b before:from-amber-500/80 before:via-yellow-500/30 before:to-transparent">
              
              <div className="mb-2 -ml-5 md:-ml-7 flex items-center gap-2 text-xs font-mono text-zinc-400 uppercase tracking-wider bg-zinc-950 w-max px-3 py-1 rounded-full border border-zinc-900">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Evolves Through {exploredPath.length} Targets</span>
              </div>

              {exploredPath.map((step, idx) => {
                return (
                  <div key={step.targetArchetype} className="relative group">
                    
                    {/* DOT NOTIFICATION */}
                    <div className="absolute -left-[2.05rem] md:-left-[2.55rem] top-2.5 w-[14px] h-[14px] md:w-[18px] md:h-[18px] rounded-full bg-zinc-950 border-2 border-amber-500 flex items-center justify-center shrink-0 z-10 transition-colors group-hover:bg-amber-500">
                      <span className="text-[7px] md:text-[9px] font-black text-amber-400 group-hover:text-zinc-950 font-mono">
                        {idx + 1}
                      </span>
                    </div>

                    <div className="bg-zinc-950/45 border border-zinc-900 p-6 rounded-2xl space-y-4 transition-all hover:border-zinc-800 hover:bg-zinc-950/65">
                      
                      {/* HEADER */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-900 pb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-mono bg-zinc-900 text-zinc-400 px-2 py-0.5 rounded uppercase">
                            Step {idx + 1}
                          </span>
                          <h4 className="text-base font-display font-black text-white">
                            {step.targetArchetype}
                          </h4>
                        </div>
                        <div className="flex items-center gap-2.5 text-[11px] font-mono">
                          <span className="text-zinc-500">Level {step.level}</span>
                          <span className="text-zinc-600">•</span>
                          <span className="text-amber-400 font-bold">{step.timeframe}</span>
                        </div>
                      </div>

                      {/* KEY VISUAL CHANGES - Direct Simple terms */}
                      <div className="space-y-2">
                        <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block font-bold">Key Appearance Changes :</span>
                        <ul className="space-y-1.5 pl-1">
                          {step.keyVisualChanges.map((change, cIdx) => (
                            <li key={cIdx} className="text-xs text-zinc-300 leading-relaxed flex items-start gap-2">
                              <span className="text-amber-500 shrink-0 mt-1 font-sans">•</span>
                              <span>{change}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* TRAINING FOCUS */}
                      <div className="space-y-2 pt-1">
                        <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block font-bold">Gym & Posture Focus :</span>
                        <ul className="space-y-1.5 pl-1">
                          {step.trainingFocus.map((focus, fIdx) => (
                            <li key={fIdx} className="text-xs text-zinc-300 leading-relaxed flex items-start gap-2">
                              <span className="text-emerald-500 shrink-0 mt-1 font-sans">✓</span>
                              <span>{focus}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* CREDIBLE MILESTONE */}
                      <div className="bg-zinc-900/30 border border-zinc-900/60 px-4 py-3 rounded-xl flex items-start gap-3 mt-3">
                        <ShieldCheck className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                        <div>
                          <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-widest block font-black leading-none">Credible Step Landmark</span>
                          <p className="text-[11px] text-zinc-400 mt-1 leading-normal">{step.credibleMilestone}</p>
                        </div>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>

            {/* SIDEBAR STRATEGY RULES */}
            <div className="space-y-6">
              
              {/* TARGET DETAILS */}
              <div className="bg-zinc-950/60 border border-zinc-900 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-1.5 text-white font-bold font-display text-xs uppercase tracking-wider border-b border-zinc-900 pb-2">
                  <Compass className="w-4 h-4 text-amber-500" />
                  <span>Your Active Route</span>
                </div>

                <div className="space-y-3 pt-1">
                  <div>
                    <span className="text-[9px] text-zinc-500 font-mono uppercase block">Estimated Starting State:</span>
                    <span className="text-xs font-bold text-white mt-1 block">{profile.currentArchetype}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-zinc-500 font-mono uppercase block">Assigned Goal Target:</span>
                    <span className="text-xs font-bold text-amber-400 mt-1 block">{profile.targetArchetype}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-zinc-500 font-mono uppercase block">Recommended Path Steps:</span>
                    <span className="text-xs text-zinc-400 mt-1 block leading-relaxed">
                      Evolving between these states takes dedication. Avoid rapid weights increases and focus strictly on correct shoulder postures, spinal alignments, and high joint control.
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setExploredStart(profile.currentArchetype)}
                  className="w-full text-center bg-zinc-900 hover:bg-zinc-850 hover:text-white border border-zinc-800 text-zinc-400 text-[10px] font-bold uppercase tracking-wider py-2 rounded-xl transition-all block cursor-pointer select-none"
                >
                  Reset To My Current Shape
                </button>
              </div>

              {/* TRUTHFUL PHILOSOPHY CARD */}
              <div className="bg-gradient-to-br from-zinc-950 to-zinc-900/40 border border-zinc-900 rounded-2xl p-5 space-y-3">
                <h4 className="text-xs font-bold text-white font-display flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-500" />
                  <span>Realistic & Honest Methods</span>
                </h4>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Avoid extreme quick-fix routines, excessive fat gain cycles, or anatomical terminology overload. Proportions respond to simple mechanical laws: widen upper back, flare shoulders with slow raises, and shrink midsection with core contraction holds. Truthful results speak louder than any hype.
                </p>
              </div>

            </div>

          </div>

        </div>
      ) : (
        /* ORIGINAL COMPENSATED MATRIX TIER LISTING */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-zinc-900">
              <h3 className="text-sm font-mono text-zinc-300 uppercase tracking-wider">
                Full Hierarchy Levels
              </h3>
              <span className="text-xs font-mono text-zinc-500">7 Tiers</span>
            </div>

            <div className="space-y-3">
              {ARCHETYPES_LIST.map((arch) => {
                const isCurrent = arch.name === profile.currentArchetype;
                const isTarget = arch.name === profile.targetArchetype;

                return (
                  <div 
                    key={arch.name}
                    className={`relative p-5 rounded-2xl transition-all border ${
                      isCurrent 
                        ? "bg-gradient-to-r from-amber-950/10 via-zinc-950 to-zinc-950 border-amber-500/30 shadow-lg shadow-amber-500/5 animate-fade-in" 
                        : isTarget 
                        ? "bg-gradient-to-r from-yellow-950/5 via-zinc-950 to-zinc-950 border-yellow-500/20"
                        : "bg-zinc-950/40 border-zinc-900 hover:border-zinc-800"
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-mono leading-none py-1 px-2 rounded-full uppercase shrink-0 font-bold ${
                            isCurrent 
                              ? "bg-amber-950/40 text-amber-400 border border-amber-900/30"
                              : isTarget
                              ? "bg-yellow-950/40 text-yellow-500 border border-yellow-905/30"
                              : "bg-zinc-900 text-zinc-400 border border-zinc-800"
                          }`}>
                            Level {arch.level}
                          </span>
                          
                          <h4 className="text-base font-display font-bold text-white">
                            {arch.name}
                          </h4>

                          {isCurrent && (
                            <span className="text-[10px] font-mono font-bold bg-amber-500/15 text-amber-400 border border-amber-550/20 px-1.5 py-0.5 rounded uppercase">
                              CURRENT
                            </span>
                          )}
                          {isTarget && (
                            <span className="text-[10px] font-mono font-bold bg-yellow-500/15 text-yellow-400 border border-yellow-500/20 px-1.5 py-0.5 rounded uppercase">
                              TARGET
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-zinc-400 leading-relaxed md:max-w-xl">
                          {arch.description}
                        </p>

                        <div className="pt-2 flex flex-wrap gap-x-4 gap-y-1.5 text-[11px] font-mono text-zinc-500 leading-none">
                          <div>
                            <span className="text-zinc-400 font-bold">Width-to-Waist:</span>{" "}
                            <span className="text-amber-400">{arch.vTaperRatio}</span>
                          </div>
                          <div>
                            <span className="text-zinc-400 font-bold">Body Fat Ceiling:</span>{" "}
                            <span className="text-amber-500">{arch.estimatedBodyFat}</span>
                          </div>
                          <div>
                            <span className="text-zinc-400 font-bold">Priority:</span>{" "}
                            <span className="text-emerald-400">{arch.recommendedFocus}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-center shrink-0 w-16 h-28 bg-zinc-90 w/80 rounded-xl border border-zinc-900 p-2">
                        <svg width="40" height="100" viewBox="0 0 100 200" className="opacity-80">
                          <line x1="50" y1="0" x2="50" y2="200" stroke="#18181b" strokeWidth="0.5" strokeDasharray="2,2"/>
                          <line x1="0" y1="100" x2="100" y2="100" stroke="#18181b" strokeWidth="0.5" strokeDasharray="2,2"/>
                          
                          <circle cx="50" cy="40" r="14" fill="none" stroke={isCurrent ? "#f59e0b" : "#27272a"} strokeWidth="1.5"/>
                          
                          <path 
                            d={arch.imageRepresentation} 
                            fill="none" 
                            stroke={isCurrent ? "#f59e0b" : isTarget ? "#fbbf24" : "#18181b"} 
                            strokeWidth="2"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-zinc-950/60 border border-zinc-900 rounded-2xl p-6 space-y-4">
              <h3 className="text-xs font-mono text-zinc-455 uppercase tracking-widest">
                Target Gap
              </h3>

              <div>
                <span className="text-[10px] text-zinc-500 font-mono uppercase block">Total Level Deviation:</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-3xl font-display font-extrabold text-amber-400">-{Math.max(0, targetLevel - currentLevel)} Levels</span>
                  <span className="text-xs text-zinc-500">to Target</span>
                </div>
              </div>

              <div className="space-y-2 text-xs leading-relaxed text-zinc-300 bg-zinc-900/20 p-4 rounded-xl border border-zinc-900">
                <span className="font-bold text-amber-400 block pb-1 border-b border-zinc-900">Progress Strategy</span>
                <p className="text-[11px] text-zinc-400 mt-1">
                  To evolve from <span className="text-white font-semibold">({profile.currentArchetype})</span> to target <span className="text-white font-semibold">({profile.targetArchetype})</span>, prioritize slow overhead raises, and tight stomach core contractions.
                </p>
              </div>

              <div className="pt-2">
                <span className="text-[10px] text-zinc-500 font-mono uppercase block">Progress Conditions:</span>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between text-xs py-1.5 border-b border-zinc-900">
                    <span className="text-zinc-400">Weekly Target Sets</span>
                    <span className="text-white font-mono font-bold">14+</span>
                  </div>
                  <div className="flex justify-between text-xs py-1.5 border-b border-zinc-900">
                    <span className="text-zinc-400">Body-Fat Threshold</span>
                    <span className="text-emerald-400 font-mono font-bold">Under 12.0%</span>
                  </div>
                  <div className="flex justify-between text-xs py-1.5">
                    <span className="text-zinc-400">Adherence Streak</span>
                    <span className="text-amber-400 font-mono font-bold">7 Days</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
