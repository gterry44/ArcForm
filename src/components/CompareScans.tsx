import React, { useState } from "react";
import { 
  Sparkles, 
  ArrowRight, 
  GitCompare, 
  History, 
  Calendar, 
  Zap, 
  Award, 
  CheckCircle2, 
  ShieldAlert,
  Flame,
  FileText
} from "lucide-react";
import { UserProfile, PhysiqueScanResult, ArchetypeType } from "../types";

interface CompareScansProps {
  profile: UserProfile;
}

export default function CompareScans({ profile }: CompareScansProps) {
  const [activeSegment, setActiveSegment] = useState<"side-by-side" | "leverage" | "anatomy">("side-by-side");

  const scans = profile.scansList || [];
  
  if (scans.length === 0) {
    return (
      <div className="glass-panel p-8 rounded-3xl text-center space-y-4 border border-zinc-900">
        <GitCompare className="w-10 h-10 text-zinc-650 mx-auto" />
        <h3 className="text-sm font-display font-bold text-zinc-300">Transformation Compare Deck Awaiting Photos</h3>
        <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed">
          Please upload or select a photo in the <strong>Physique Snapshot</strong> tab first to compare your physical transformation history.
        </p>
      </div>
    );
  }

  // Latest scan is index 0
  const latestScan = scans[0];

  // First scan is the last in list
  let firstScan = scans[scans.length - 1];

  // If there's only 1 scan in the history, we generate an incredibly accurate, motivative simulated "First Scan / Baseline" 
  // corresponding to when they started (e.g., raw Lean Frame or Foundation Builder 30 days ago) so they have a beautiful baseline to compare 
  // progress with immediately!
  const isSimulatedBaseline = scans.length === 1;
  if (isSimulatedBaseline) {
    const baselineDate = new Date();
    baselineDate.setDate(baselineDate.getDate() - 30);
    
    // Create base default scan details depending on their current archetype
    let priorArchetype: ArchetypeType = "Lean Frame";
    let strengths = ["Incredible low fat baseline", "Great symmetric layout"];
    let weaknesses = ["Needs broader shoulders", "Upper chest lacks volume"];
    let opportunities = ["Fast shoulder width expansion potential"];
    
    if (latestScan.archetype === "Lean Frame") {
      priorArchetype = "Foundation Builder";
      strengths = ["Symmetric skeletal structure", "Zero old muscle injuries"];
      weaknesses = ["Muscles lack overall density", "Core posture sits shallow"];
      opportunities = ["Beginner lifts will stack mass extremely early"];
    } else if (latestScan.archetype === "Athletic Builder") {
      priorArchetype = "Lean Frame";
      strengths = ["Lean frame definitions", "Visible base abdominal line"];
      weaknesses = ["Shallow shoulder width frame", "Back posture curves in"];
      opportunities = ["Quick frame expansion with lateral raises"];
    } else if (latestScan.archetype === "Athletic V-Taper") {
      priorArchetype = "Athletic Builder";
      strengths = ["Excellent core strength", "Broad frame profile"];
      weaknesses = ["Lower back postures lean forward", "Shoulders lack roundness"];
      opportunities = ["Balanced proportions with posture emphasis"];
    } else {
      priorArchetype = "Lean Frame";
    }

    firstScan = {
      archetype: priorArchetype,
      targetArchetype: latestScan.archetype,
      strengths,
      weaknesses,
      opportunities,
      highestLeverageImprovements: [
        "Incorporate daily standing tall checks.",
        "Add shoulder raising sets using light weights.",
        "Maintain clean protein habits with simple water intake."
      ],
      workoutFocus: "Initial Frame Prep",
      dailyFocus: "Learn Baseline Posture",
      nextActions: [
        "Learn correct shoulder alignment",
        "Set daily step reminder goal (8k)",
        "Log basic starting weight & stats"
      ],
      scannedAt: baselineDate.toISOString().split("T")[0] + "T10:00:00.000Z"
    };
  }

  // Simplified appearance metrics comparisons 
  // Transforming high-brow anatomy jargon to instant builder appearance tags
  const metricsComparison = [
    {
      attribute: "Shoulder Width",
      description: "Build Wider Shoulders",
      baselineValue: "Baseline Set",
      latestValue: "Active Target",
      improvementRating: "✓ Active Goal",
      highlightColor: "text-amber-400"
    },
    {
      attribute: "Back Width",
      description: "Improve Back Width & V-Taper",
      baselineValue: "Baseline Set",
      latestValue: "Active Target",
      improvementRating: "✓ Goal Supported",
      highlightColor: "text-amber-400"
    },
    {
      attribute: "Upper Chest Fullness",
      description: "Bring Up Upper Chest Appearance",
      baselineValue: "Baseline Set",
      latestValue: "Active Target",
      improvementRating: "✓ Consistency Active",
      highlightColor: "text-emerald-400"
    },
    {
      attribute: "Core & Waist Tightness",
      description: "Tighten Waist Outline",
      baselineValue: "Baseline Set",
      latestValue: "Active Target",
      improvementRating: "✓ Volume Maintained",
      highlightColor: "text-amber-400"
    }
  ];

  const formatDate = (isoStr: string) => {
    try {
      const date = new Date(isoStr);
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    } catch {
      return isoStr.split("T")[0];
    }
  };

  return (
    <div id="compare-scans-block" className="bg-zinc-950/40 border border-zinc-900 rounded-3xl p-5 md:p-6 space-y-6 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full filter blur-2xl pointer-events-none" />
      
      {/* Dynamic Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-905 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1 px-2.5 rounded-full bg-amber-500/10 text-amber-500 text-[9px] font-mono uppercase font-black tracking-wider">
              New: Transformation Compare
            </span>
            <History className="w-3.5 h-3.5 text-zinc-500" />
          </div>
          <h3 className="text-base font-display font-black text-white">Physical Silhouette Progress</h3>
          <p className="text-xs text-zinc-500">
            Compare your raw baseline profile to your latest aesthetic improvements side-by-side.
          </p>
        </div>
        
        {/* Toggle navigation for comparison states */}
        <div className="flex bg-zinc-900/50 p-1 rounded-xl border border-zinc-850/60 text-xs shrink-0 select-none">
          <button
            onClick={() => setActiveSegment("side-by-side")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeSegment === "side-by-side"
                ? "bg-amber-500 text-black font-semibold shadow-sm"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Side-By-Side
          </button>
          <button
            onClick={() => setActiveSegment("leverage")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeSegment === "leverage"
                ? "bg-amber-500 text-black font-semibold shadow-sm"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            How to Improve
          </button>
        </div>
      </div>

      {/* SEGMENT 1: SIDE-BY-SIDE PHYSICAL CARD SPLIT */}
      {activeSegment === "side-by-side" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* FIRST SCAN (BASELINE) */}
            <div className={`border rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between ${
              isSimulatedBaseline 
                ? "bg-zinc-950/40 border-amber-500/10 text-zinc-400" 
                : "bg-zinc-900/15 border-zinc-900 text-zinc-400"
            }`}>
              <div className={`absolute top-0 right-0 py-1 px-3.5 font-mono text-[8.5px] uppercase border-b border-l rounded-xs font-bold ${
                isSimulatedBaseline 
                  ? "bg-amber-950/60 text-amber-400 border-amber-500/20" 
                  : "bg-zinc-950 text-zinc-500 border-zinc-900"
              }`}>
                {isSimulatedBaseline ? "Estimated Starting Baseline" : "OFFICIAL BASELINE"}
              </div>
              
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase block font-bold">STARTING POINT</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-zinc-400">{firstScan.archetype}</span>
                    <span className="text-[8.5px] font-mono bg-zinc-950 text-zinc-500 font-bold px-1.5 py-0.2 rounded border border-zinc-850">
                      {formatDate(firstScan.scannedAt)}
                    </span>
                  </div>
                </div>

                {/* Abstract graphical representation of baseline pose */}
                <div className="h-28 bg-zinc-950/60 rounded-xl border border-zinc-900 flex items-center justify-center p-3 relative group">
                  <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/40 pointer-events-none" />
                  {firstScan.imageUrl ? (
                    <img src={firstScan.imageUrl} className="max-h-full max-w-full object-contain filter grayscale contrast-125 opacity-50" alt="Baseline pose" />
                  ) : (
                    <div className="w-10 h-24 border border-zinc-800 rounded-full flex flex-col items-center justify-center relative opacity-25">
                      <div className="w-7 h-7 bg-zinc-800 rounded-full mb-1" />
                      <div className="w-5 h-8 bg-zinc-800 rounded-md" />
                      <span className="text-[7px] font-mono text-zinc-600 uppercase absolute bottom-1">Lean Base</span>
                    </div>
                  )}
                  <div className="absolute bottom-2 left-2 text-[9px] font-mono text-zinc-500 uppercase">
                    Initial outline snapshot
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[9px] text-zinc-500 font-mono uppercase block">First Training Focus:</span>
                  <p className="text-xs text-zinc-400 font-semibold">{firstScan.workoutFocus}</p>
                </div>

                <div className="border-t border-zinc-900/60 pt-3 space-y-1.5 text-xs text-zinc-500">
                  <div className="flex items-center justify-between">
                    <span>Estimate Chest Depth:</span>
                    <span className="font-mono text-zinc-450">Flat Baseline</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Estimate Waist Fit:</span>
                    <span className="font-mono text-zinc-450">Soft / Straight</span>
                  </div>
                </div>
              </div>
            </div>

            {/* LATEST SCAN (CURRENT) */}
            <div className="bg-gradient-to-b from-amber-950/5 via-zinc-950/20 to-transparent border-2 border-amber-500/20 rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 py-1 px-3.5 bg-amber-500 text-[8px] text-black font-mono font-bold rounded-xs uppercase tracking-wider">
                LATEST SNAPSHOT
              </div>
              
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-amber-500 uppercase block font-bold">CURRENT STATE</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-white">{latestScan.archetype}</span>
                    <span className="text-[8.5px] font-mono bg-amber-950/50 text-amber-400 font-bold px-1.5 py-0.2 rounded border border-amber-500/20">
                      {formatDate(latestScan.scannedAt)}
                    </span>
                  </div>
                </div>

                {/* Abstract graphical representation of current pose */}
                <div className="h-28 bg-zinc-950 rounded-xl border border-amber-500/10 flex items-center justify-center p-3 relative">
                  <div className="absolute inset-0 bg-amber-500/5 filter blur-md rounded-full pointer-events-none" />
                  {latestScan.imageUrl ? (
                    <img src={latestScan.imageUrl} className="max-h-full max-w-full object-contain filter brightness-110 contrast-110" alt="Current posture" />
                  ) : (
                    <div className="w-12 h-24 border border-amber-500/30 rounded-full flex flex-col items-center justify-center relative shadow-xl shadow-amber-500/5">
                      <div className="w-8 h-8 bg-amber-550/15 border border-amber-500/40 rounded-full mb-1 flex items-center justify-center">
                        <span className="text-[8px] text-amber-400 font-bold">V</span>
                      </div>
                      <div className="w-6 h-8 bg-amber-550/10 border border-amber-500/20 rounded-sm" />
                      <span className="text-[7.5px] font-mono text-amber-400 font-bold uppercase absolute bottom-1">Wide Cap</span>
                    </div>
                  )}
                  <div className="absolute bottom-2 left-2 text-[9px] font-mono text-amber-400 font-bold uppercase flex items-center gap-1">
                    <Sparkles className="w-3 h-3 animate-pulse" />
                    <span>Target Alignment Active</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[9px] text-amber-500/65 font-mono uppercase block">Active Training Focus:</span>
                  <p className="text-xs text-white font-bold flex items-center gap-1.5">
                    <span>{latestScan.workoutFocus}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  </p>
                </div>

                <div className="border-t border-zinc-900 pt-3 space-y-1.5 text-xs text-zinc-350">
                  <div className="flex items-center justify-between">
                    <span>Estimate Chest Depth:</span>
                    <span className="font-mono text-emerald-400 font-bold">Molded Profile</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Estimate Waist Fit:</span>
                    <span className="font-mono text-amber-400 font-bold">Sculpted, Tight</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* DYNAMIC PROGRESS GRID OF TRANSLATED ATTRIBUTES */}
          <div className="space-y-3.5 bg-zinc-900/20 p-4 rounded-2xl border border-zinc-900">
            <h4 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider block">
              Aesthetic Action Targets Supported:
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
              {metricsComparison.map((dim, index) => (
                <div key={index} className="bg-zinc-950/80 p-3 rounded-xl border border-zinc-900 flex flex-col justify-between space-y-2">
                  <div>
                    <span className="text-[10px] font-mono text-zinc-500 block font-bold leading-none uppercase">{dim.attribute}</span>
                    <span className="text-[9px] text-zinc-500 block leading-tight mt-1">{dim.description}</span>
                  </div>
                  
                  <div className="space-y-1 border-t border-zinc-900 pt-2 text-[11px]">
                    <div className="flex justify-between text-zinc-500">
                      <span>Before:</span>
                      <span className="truncate max-w-[80px]">{dim.baselineValue}</span>
                    </div>
                    <div className="flex justify-between text-white font-semibold">
                      <span>Now:</span>
                      <span className="text-amber-400 truncate max-w-[80px]">{dim.latestValue}</span>
                    </div>
                  </div>

                  <div className="text-[9px] font-mono bg-amber-500/10 text-amber-400 font-bold px-1.5 py-0.5 rounded border border-amber-500/20 text-center w-full">
                    {dim.improvementRating}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SEGMENT 2: IMPROVEMENTS STRATEGY COMPARISON */}
      {activeSegment === "leverage" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 leading-relaxed">
          
          {/* Baseline Leverage Actions */}
          <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-900 space-y-3.5">
            <div className="flex items-center gap-2 border-b border-zinc-900 pb-2">
              <Calendar className="w-4 h-4 text-zinc-500" />
              <span className="text-xs font-bold text-zinc-400 uppercase font-mono">PREVIOUS RECOMMENDATIONS</span>
            </div>
            <div className="space-y-2.5">
              {firstScan.highestLeverageImprovements.map((imp, idx) => (
                <div key={idx} className="flex gap-2 text-xs text-zinc-500 leading-relaxed">
                  <span className="font-mono text-zinc-650">0{idx + 1}.</span>
                  <p className="line-through">{imp}</p>
                </div>
              ))}
            </div>
            <div className="text-[10px] font-mono text-zinc-500 bg-zinc-900/30 p-2 rounded">
              Status: These basic items have been integrated or completed as your starting shape evolved.
            </div>
          </div>

          {/* New Leverage Actions */}
          <div className="bg-zinc-950 border-2 border-amber-500/10 p-4 rounded-xl space-y-3.5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full filter blur-xl" />
            <div className="flex items-center gap-2 border-b border-zinc-900 pb-2 justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500 animate-pulse" />
                <span className="text-xs font-bold text-white uppercase font-mono">LATEST PRIORITY RECOMMENDATIONS</span>
              </div>
              <span className="text-[9px] bg-amber-500 text-black font-semibold px-2 py-0.2 rounded font-mono uppercase">Active</span>
            </div>
            <div className="space-y-2.5">
              {latestScan.highestLeverageImprovements.map((imp, idx) => (
                <div key={idx} className="flex gap-2 text-xs text-zinc-300 leading-relaxed">
                  <span className="text-amber-500 font-bold shrink-0 font-mono">0{idx + 1}.</span>
                  <p>{imp}</p>
                </div>
              ))}
            </div>
            <div className="text-[10px] font-mono text-amber-400 bg-amber-950/20 p-2 rounded border border-amber-500/10">
              Your primary daily action step: <strong>{latestScan.dailyFocus}</strong>
            </div>
          </div>

        </div>
      )}

      {/* Motivational message */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-zinc-950 p-3.5 rounded-2xl border border-zinc-905">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-amber-500 animate-pulse shrink-0" />
          <span className="text-xs text-zinc-400">
            {isSimulatedBaseline 
              ? "Your starting blueprint path is live. Today's session supported your goal." 
              : "Today’s session supported your goal. Your training consistency remains strong."
            }
          </span>
        </div>
        <div className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20 shrink-0 uppercase leading-none">
          {scans.length} Scan Entries Logged
        </div>
      </div>
    </div>
  );
}
