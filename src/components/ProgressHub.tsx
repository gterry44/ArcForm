import React, { useState } from "react";
import { Sparkles, Award, History } from "lucide-react";
import { UserProfile, PhysiqueScanResult } from "../types";
import VisualScan from "./VisualScan";
import ArchetypePedia from "./ArchetypePedia";
import BlueprintHistory from "./BlueprintHistory";

interface ProgressHubProps {
  profile: UserProfile;
  onAnalysisSuccess: (result: PhysiqueScanResult) => void;
}

type SubTab = "scan" | "tiers" | "history";

export default function ProgressHub({ profile, onAnalysisSuccess }: ProgressHubProps) {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>("scan");

  return (
    <div className="space-y-6 animate-fade-in text-zinc-100 p-0">
      
      {/* 1. Header Spec */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-zinc-900/40">
        <div className="text-left">
          <h2 className="text-2xl font-black font-display text-white tracking-tight uppercase">
            Progress Centre
          </h2>
          <p className="text-xs text-zinc-400">
            Audit your metrics, take photos to check your alignment, and track your physique shape changes.
          </p>
        </div>

        {/* 2. Sleek Sub-Tabs Controller */}
        <div className="flex bg-zinc-900/60 p-1 rounded-xl border border-zinc-900/80 w-full md:w-auto overflow-x-auto shrink-0 select-none">
          <button
            onClick={() => setActiveSubTab("scan")}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeSubTab === "scan"
                ? "bg-zinc-800 text-white border border-zinc-700/60"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Pose Check</span>
          </button>

          <button
            onClick={() => setActiveSubTab("tiers")}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeSubTab === "tiers"
                ? "bg-zinc-800 text-white border border-zinc-700/60"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Award className="w-4 h-4 text-yellow-500" />
            <span>Physique Types</span>
          </button>

          <button
            onClick={() => setActiveSubTab("history")}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeSubTab === "history"
                ? "bg-zinc-800 text-white border border-zinc-700/60"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <History className="w-4 h-4 text-emerald-500" />
            <span>Logs & Charts</span>
          </button>
        </div>
      </div>

      {/* Render selected screen of progress */}
      <div className="bg-zinc-950/20 rounded-3xl">
        {activeSubTab === "scan" && (
          <VisualScan 
            profile={profile} 
            onAnalysisSuccess={onAnalysisSuccess}
          />
        )}

        {activeSubTab === "tiers" && (
          <ArchetypePedia 
            profile={profile}
          />
        )}

        {activeSubTab === "history" && (
          <BlueprintHistory 
            profile={profile}
          />
        )}
      </div>

    </div>
  );
}
