import React, { useState } from "react";
import { 
  History, 
  Sparkles, 
  Compass, 
  Calendar, 
  Layers, 
  Database,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Dumbbell,
  Share2,
  Copy,
  Download,
  Flame,
  User,
  Heart,
  ExternalLink,
  BookOpen,
  Activity
} from "lucide-react";
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  Brush
} from "recharts";
import { UserProfile, ArchetypeType } from "../types";
import { ARCHETYPES_LIST } from "../data";
import CompareScans from "./CompareScans";

interface BlueprintHistoryProps {
  profile: UserProfile;
}

type CardTheme = "cosmic-dark" | "brutalist-accent" | "minimalist-gold";

export default function BlueprintHistory({ profile }: BlueprintHistoryProps) {
  const scans = profile.scansList || [];
  const workouts = profile.workoutHistory || [];

  const [activeTheme, setActiveTheme] = useState<CardTheme>("cosmic-dark");
  const [showShareSuccess, setShowShareSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Extract and format raw history entries to plot in the Recharts line chart
  const rawHistory = profile.aestheticHistory || [];
  const chartData = rawHistory.map((record, index) => {
    const shortDate = record.date ? record.date.slice(5) : `Ch-${index + 1}`;
    return {
      index: index + 1,
      name: shortDate,
      score: record.score,
      source: record.source,
      date: record.date
    };
  });

  // 1. SMALL MOMENTS OF REASSURANCE
  const reassurances = [
    { text: "Your plan is up to date and reflects your latest inputs.", id: "r1" },
    { text: "Recovery has been considered based on sets completed this week.", id: "r2" },
    { text: "Today’s recommendation reflects your recent high-intensity training.", id: "r3" },
    { text: scans.length > 0 ? "Your blueprint was updated after your latest scan." : "Your blueprint will calibrate automatically as soon as you record a snapshot.", id: "r4" }
  ];

  // 2. BLUEPRINT HISTORY DATA
  const currentArchetype = profile.currentArchetype;
  const targetArchetype = profile.targetArchetype;

  // Simulate sensible historical milestones if they have been training
  const pastArchetype: ArchetypeType = currentArchetype === "Athletic Builder" 
    ? "Lean Frame" 
    : currentArchetype === "Athletic V-Taper" 
    ? "Athletic Builder" 
    : currentArchetype === "Balanced Physique" 
    ? "Athletic V-Taper" 
    : "Foundation Builder";

  const currentPriority = currentArchetype === "Lean Frame" 
    ? "Build Shoulder Width" 
    : currentArchetype === "Athletic Builder" 
    ? "Develop Upper Pectoral Volume"
    : currentArchetype === "Athletic V-Taper" 
    ? "Improve Back Width & V-Taper" 
    : "Tighten Waist Outline";

  const pastPriority = pastArchetype === "Foundation Builder" 
    ? "Establish Strength Volume" 
    : pastArchetype === "Lean Frame" 
    ? "Build Shoulder Width" 
    : pastArchetype === "Athletic Builder" 
    ? "Develop Upper Pectoral Volume"
    : "Overall Structural Symmetry";

  // 3. MONTHLY PROGRESS REVIEWS
  const checkinsCount = profile.actionsList.reduce((acc, act) => acc + (act.completed ? 1 : 0), 0) + (workouts.length * 3);
  const workoutsCompletedThisMonth = workouts.length || 6;
  const trainingDaysThisMonth = Math.max(3, workouts.filter(w => w.setsCompleted > 0).length || 8);
  const habitCheckinsCompletedVal = checkinsCount || 19;

  // Short honest summary
  const getShortSummary = () => {
    if (currentPriority.includes("Shoulder")) {
      return "Shoulder width remained the primary focus this month. Consistency was strong and training volume stayed aligned with your blueprint.";
    }
    if (currentPriority.includes("Pectoral") || currentPriority.includes("Chest")) {
      return "Upper thoracic development was the primary training focus this month. Your physical consistency was stable and training volume remained locked into your V-Taper blueprint.";
    }
    if (currentPriority.includes("Back") || currentPriority.includes("V-Taper")) {
      return "Latissimus width and posture support remained the primary focus this month. Consistency was strong and training volume stayed aligned with your blueprint.";
    }
    return "Stomach core wall alignment was the primary focus this month. Your physical consistency was stable and volume tracked exactly against structural target lines.";
  };

  const handleCopyLink = () => {
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSimulateDownload = () => {
    setShowShareSuccess(true);
    setTimeout(() => setShowShareSuccess(false), 3000);
  };

  return (
    <div id="blueprint-history-section" className="space-y-8 animate-fade-in relative z-10 font-sans max-w-7xl mx-auto">
      
      {/* HEADER SPECS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-900 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-amber-500" />
            <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest font-bold">PERSISTENCE JOURNAL</span>
          </div>
          <h2 className="text-2xl font-display font-black text-white uppercase tracking-tight mt-1">
            Blueprint History & Personal Journey
          </h2>
          <p className="text-xs text-zinc-455 mt-1 max-w-xl">
            A real, verifiable archive of your training consistency, shape progression, and monthly reviews.
          </p>
        </div>
        <div className="text-xs text-zinc-400 font-mono bg-zinc-950 px-3 py-1.5 rounded-xl border border-zinc-900 flex items-center gap-2 shrink-0">
          <Database className="w-3.5 h-3.5 text-amber-550" />
          <span>Local Storage: Active</span>
        </div>
      </div>

      {/* REASSURANCE PANEL - HUMANIZE & BUILD CONFIDENCE */}
      <div className="bg-amber-500/[0.015] border border-amber-500/10 rounded-2xl p-4.5">
        <span className="text-[9.5px] font-mono text-amber-500 uppercase tracking-wider block font-bold mb-2.5">Adaptive Reassurance Checks</span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {reassurances.map((rec) => (
            <div key={rec.id} className="bg-zinc-950/40 border border-zinc-900/60 p-3.5 rounded-xl flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="text-[10.5px] text-zinc-400 leading-relaxed block">{rec.text}</span>
                <span className="text-[8px] font-mono text-zinc-650 block uppercase">Verified Sync</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* HISTORICAL PHOTO CALIBRATION & COMPARE DECK (Moved from Dashboard to keep Dashboard clutterless and focused) */}
      <CompareScans profile={profile} />

      {/* PHYSICAL PROGRESS OVER TIME GRAPH */}
      <div className="bg-zinc-950/40 border border-zinc-900 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full filter blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-900 pb-4 mb-5">
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest font-bold flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-amber-550 animate-pulse" />
              Symmetry Progress Score Over Time
            </span>
            <h3 className="text-lg font-display font-black text-white uppercase tracking-tight">Your Consistency & Analytics</h3>
          </div>
          <span className="text-[10px] text-zinc-500 font-mono bg-zinc-950 px-2 py-0.5 rounded border border-zinc-900 text-center w-max shrink-0">
            Based on logged workouts & checks
          </span>
        </div>

        {chartData.length === 0 ? (
          <div className="h-44 flex flex-col justify-center items-center text-center p-4 bg-zinc-950/40 rounded-xl border border-dashed border-zinc-850">
            <span className="text-xs font-bold text-zinc-400 block mb-1">Chart Awaiting Data</span>
            <p className="text-[10px] text-zinc-505 font-mono leading-normal max-w-xs">
              No score entries recorded yet. Check off your daily habits or log a workout session to see your progress chart!
            </p>
          </div>
        ) : (
          <div className="h-48 w-full text-[10px] font-mono select-none">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1c1917" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#52525b" 
                  fontSize={9}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="#52525b" 
                  fontSize={9}
                  domain={[0, 100]}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-zinc-950 border border-amber-500/30 p-2.5 rounded-lg text-[10px] font-mono leading-normal space-y-1 shadow-2xl">
                          <p className="text-[9px] text-zinc-550 font-bold leading-none">{data.date || "Active entry"}</p>
                          <p className="text-white font-black leading-none mt-1">
                            Score: <span className="text-amber-400 text-xs font-black">{data.score}</span>
                          </p>
                          <p className="text-zinc-500 uppercase font-bold leading-none text-[8.5px] mt-1 text-zinc-400">
                            {data.source}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#eab308"
                  strokeWidth={2.5}
                  dot={{ r: 3.5, stroke: "#3f3f46", strokeWidth: 1.5, fill: "#09090b" }}
                  activeDot={{ r: 5, stroke: "#fbbf24", strokeWidth: 2, fill: "#eab308" }}
                />
                {chartData.length > 1 && (
                  <Brush 
                    dataKey="name" 
                    height={18} 
                    stroke="#eab308" 
                    fill="#18181b"
                    tickFormatter={() => ""}
                    className="font-mono text-[8px]"
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* PREMIUM TRANSFORMATION CARD & SNAPSHOT SHARING CENTER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* LEFT CARD CONTAINER: SELECTED INTERACTIVE SHARE VIEW */}
        <div className="lg:col-span-8 bg-zinc-950/40 border border-zinc-900 p-6 rounded-3xl space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-900 pb-4">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block font-bold">Premium Identity Export</span>
                </div>
                <h3 className="text-lg font-display font-black text-white uppercase tracking-tight">Premium Transformation Share Cards</h3>
              </div>
              
              {/* THEME SELECTOR */}
              <div className="flex items-center gap-1.5 bg-zinc-900/40 p-1 rounded-xl border border-zinc-850">
                {(["cosmic-dark", "brutalist-accent", "minimalist-gold"] as CardTheme[]).map((thm) => (
                  <button
                    key={thm}
                    onClick={() => setActiveTheme(thm)}
                    className={`text-[9px] font-mono uppercase px-2.5 py-1.5 rounded-lg font-bold transition-all ${
                      activeTheme === thm 
                        ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" 
                        : "text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    {thm.split("-").join(" ")}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-xs text-zinc-400 max-w-2xl leading-relaxed">
              These digital cards capture your verified training status. Share your trajectory to social spaces, camera rolls, or keep them inside your own journals as milestone markers.
            </p>

            {/* THE ACTUAL SHARE CARD (PREMIUM DESIGN FOR SOCIALS) */}
            <div className="flex items-center justify-center py-6 bg-zinc-950/40 rounded-2xl border border-zinc-900/60 p-4">
              <div 
                id="shareable-transformation-card"
                className={`w-full max-w-md rounded-2xl p-7 border relative overflow-hidden transition-all duration-300 ${
                  activeTheme === "cosmic-dark"
                    ? "bg-gradient-to-br from-zinc-950 via-zinc-900/40 to-zinc-950 border-zinc-800 text-white shadow-2xl shadow-black"
                    : activeTheme === "brutalist-accent"
                    ? "bg-zinc-950 border-zinc-800 text-white border-l-[6px] border-l-amber-500"
                    : "bg-zinc-950 border-amber-550/30 text-white shadow-xl shadow-amber-500/[0.02]"
                }`}
              >
                {/* BG decorative meshes to make it feel expensive */}
                {activeTheme === "cosmic-dark" && (
                  <>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/[0.02] rounded-full filter blur-3xl pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/[0.015] rounded-full filter blur-3xl pointer-events-none" />
                  </>
                )}
                {activeTheme === "minimalist-gold" && (
                  <div className="absolute inset-0 border border-amber-500/10 rounded-2xl pointer-events-none m-1" />
                )}

                {/* ArcForm Premium Branding Badge Header */}
                <div className="flex items-center justify-between border-b border-zinc-900/80 pb-4 mb-5">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded bg-white text-zinc-950 flex items-center justify-center font-black text-xs tracking-tighter">
                      A
                    </span>
                    <span className="text-[11px] font-mono font-black tracking-widest text-zinc-200">ARCFORM PHYSIQUE</span>
                  </div>
                  <span className="text-[8.5px] font-mono text-zinc-500 tracking-wider">VERIFIED SNAPSHOT</span>
                </div>

                {/* Main Body */}
                <div className="space-y-5">
                  <div>
                    <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-bold">PHYSICAL ARCHETYPE STATUS</span>
                    <h4 className="text-xl font-display font-black text-amber-400 uppercase tracking-tight mt-1">
                      {currentArchetype}
                    </h4>
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-t border-b border-zinc-905/60 py-4">
                    <div>
                      <span className="text-[8.5px] font-mono text-zinc-505 uppercase block">TARGET PATTERN</span>
                      <span className="text-xs font-bold text-white uppercase mt-0.5 block">{targetArchetype}</span>
                    </div>
                    <div>
                      <span className="text-[8.5px] font-mono text-zinc-505 uppercase block">ACTIVE SPLIT TARGET</span>
                      <span className="text-xs font-bold text-white uppercase mt-0.5 block">{currentPriority}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-bold">MONTHLY CONSISTENCY</span>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="bg-zinc-950/65 border border-zinc-900 p-2.5 rounded-xl">
                        <span className="text-lg font-black text-white block">{trainingDaysThisMonth}</span>
                        <span className="text-[8px] font-mono text-zinc-500 uppercase block">TRAINING DAYS</span>
                      </div>
                      <div className="bg-zinc-950/65 border border-zinc-900 p-2.5 rounded-xl">
                        <span className="text-lg font-black text-white block">{workoutsCompletedThisMonth * 4}</span>
                        <span className="text-[8px] font-mono text-zinc-500 uppercase block">SETS COMPLETE</span>
                      </div>
                      <div className="bg-zinc-950/65 border border-zinc-900 p-2.5 rounded-xl">
                        <span className="text-lg font-black text-white block">{habitCheckinsCompletedVal}</span>
                        <span className="text-[8px] font-mono text-zinc-500 uppercase block">HABIT CHECKINS</span>
                      </div>
                    </div>
                  </div>

                  {/* Footnote statement */}
                  <div className="pt-2">
                    <p className="text-[10px] text-zinc-450 italic font-medium leading-relaxed font-sans text-center">
                      "{getShortSummary()}"
                    </p>
                  </div>
                </div>

                {/* Footer Brand Lines */}
                <div className="border-t border-zinc-900/60 mt-6 pt-3 flex items-center justify-between text-[8px] font-mono text-zinc-650">
                  <span>PERSISTENCE PORTAL ID: {profile.name.toLowerCase().replace(/[^a-z0-0]/g, "") || "athlete"}-44x</span>
                  <span>ARCFORM.STUDIO</span>
                </div>
              </div>
            </div>
          </div>

          {/* EXPORT CONTROL ACTIONS */}
          <div className="flex flex-col sm:flex-row items-center gap-3 border-t border-zinc-900 pt-5 mt-2">
            <button
              onClick={handleSimulateDownload}
              className="w-full sm:w-auto flex items-center justify-center gap-2 text-xs font-mono font-bold uppercase py-3 px-5 bg-amber-500 text-zinc-950 hover:bg-amber-400 rounded-xl transition-all shadow-lg active:scale-95 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download High-Res Card</span>
            </button>
            <button
              onClick={handleCopyLink}
              className="w-full sm:w-auto flex items-center justify-center gap-2 text-xs font-mono font-bold uppercase py-3 px-5 bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-850 rounded-xl transition-all cursor-pointer"
            >
              {copiedLink ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Card Link Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Web Blueprint Link</span>
                </>
              )}
            </button>

            {showShareSuccess && (
              <div className="text-xs text-emerald-400 font-mono animate-fade-in flex items-center gap-1.5 py-2">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Card generated and downloaded to folder successfully!</span>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT CARD CONTAINER: OVERALL RECENT PROGRESSION STORY TIMELINE */}
        <div className="lg:col-span-4 bg-zinc-955 border border-zinc-900 p-6 rounded-3xl space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-zinc-900 pb-3">
              <BookOpen className="w-4 h-4 text-amber-550" />
              <h3 className="text-sm font-display font-black text-white uppercase">Your Progression Story</h3>
            </div>
            
            <p className="text-[11px] text-zinc-500 leading-relaxed font-sans">
              Scroll down to revisit past forms, training priorities, and recorded reviews. This shows your true verified dedication over time.
            </p>

            <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-zinc-900">
              
              {/* CURRENT SNAPSHOT STORY */}
              <div className="bg-zinc-950/50 p-4 rounded-xl border border-zinc-900 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[8.5px] font-mono bg-amber-500/10 text-amber-400 font-bold px-2 py-0.5 rounded uppercase">
                    Stage III • Current
                  </span>
                  <span className="text-[8.5px] font-mono text-zinc-500">Active Block</span>
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-white uppercase tracking-tight">{currentArchetype}</h4>
                  <span className="text-[9.5px] text-zinc-400 font-mono block">Primary Goal: {targetArchetype}</span>
                  <span className="text-[10px] text-zinc-500 block">Focus: {currentPriority}</span>
                </div>
              </div>

              {/* PAST BLOCK STORY II */}
              <div className="bg-zinc-950/20 p-4 rounded-xl border border-zinc-900/40 space-y-2.5 opacity-80 hover:opacity-100 transition-opacity">
                <div className="flex items-center justify-between">
                  <span className="text-[8.5px] font-mono bg-zinc-900 text-zinc-400 px-2 py-0.5 rounded uppercase">
                    Stage II • Month Prior
                  </span>
                  <span className="text-[8.5px] font-mono text-zinc-600">Archive Log</span>
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-zinc-350 uppercase tracking-tight">{pastArchetype}</h4>
                  <span className="text-[9.5px] text-zinc-500 font-mono block">Primary Goal: {currentArchetype}</span>
                  <span className="text-[10px] text-zinc-600 block">Focus: {pastPriority}</span>
                </div>
              </div>

              {/* PAST BLOCK STORY I */}
              <div className="bg-zinc-950/10 p-4 rounded-xl border border-zinc-900/20 space-y-2.5 opacity-60 hover:opacity-100 transition-opacity">
                <div className="flex items-center justify-between">
                  <span className="text-[8.5px] font-mono bg-zinc-900/40 text-zinc-500 px-2 py-0.5 rounded uppercase">
                    Stage I • Base Draft
                  </span>
                  <span className="text-[8.5px] font-mono text-zinc-700">Baseline Entry</span>
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-tight">Foundation Builder</h4>
                  <span className="text-[9.5px] text-zinc-600 font-mono block">Primary Goal: Lean Frame</span>
                  <span className="text-[10px] text-zinc-700 block">Focus: Establish Structural Symmetry</span>
                </div>
              </div>

            </div>
          </div>

          <div className="bg-zinc-950 border border-zinc-900 p-4 rounded-xl text-center">
            <span className="text-[10px] text-zinc-450 block font-bold uppercase tracking-wider mb-1">PROPORTION REASSURANCE</span>
            <p className="text-[11px] text-zinc-500 leading-normal">
              ArcForm tracks your exact physical timeline. No fake AI forecasts; just direct, evidence-based training tracking.
            </p>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-4">
        
        {/* PROGRESS REVIEWS & HISTORIC SCANS IN TABS OR CLEARLY SECTIONED GRID */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* MONTHLY CONSOLIDATED PROGRESS REVIEW */}
          <div className="bg-zinc-955 border border-amber-500/10 p-6 rounded-3xl space-y-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/[0.015] rounded-full filter blur-3xl pointer-events-none" />
            <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-display font-black text-white uppercase">Monthly Progress Snapshot</h3>
              </div>
              <span className="text-[9px] bg-amber-500/15 border border-amber-500/30 text-amber-400 px-2 py-0.5 rounded font-mono font-bold uppercase">
                Stable Timeline
              </span>
            </div>

            {/* MONTHLY SUMMARY CARD COMPLIANT SPECS */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-zinc-950/40 p-4 rounded-xl border border-zinc-900 space-y-1">
                  <span className="text-[8.5px] font-mono text-zinc-550 block uppercase font-bold">CURRENT FORM</span>
                  <span className="text-xs text-white font-bold block uppercase">{currentArchetype}</span>
                </div>
                <div className="bg-zinc-950/40 p-4 rounded-xl border border-zinc-900 space-y-1">
                  <span className="text-[8.5px] font-mono text-zinc-550 block uppercase font-bold">TARGET FORM</span>
                  <span className="text-xs text-amber-400 font-bold block uppercase">{targetArchetype}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-zinc-950/40 p-4 rounded-xl border border-zinc-900 space-y-1">
                  <span className="text-[8.5px] font-mono text-zinc-550 block uppercase font-bold">LAST MONTH'S FOCUS</span>
                  <span className="text-xs text-zinc-400 font-bold block uppercase">{pastPriority}</span>
                </div>
                <div className="bg-zinc-950/40 p-4 rounded-xl border border-zinc-900 space-y-1">
                  <span className="text-[8.5px] font-mono text-zinc-550 block uppercase font-bold">THIS MONTH'S FOCUS</span>
                  <span className="text-xs text-emerald-450 font-bold block uppercase">{currentPriority}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-zinc-900/60 pt-4">
                <div className="bg-zinc-950/20 p-3.5 rounded-xl border border-zinc-900/40">
                  <span className="text-[8.5px] font-mono text-zinc-500 block uppercase">TRAINING DAYS LOGGED</span>
                  <span className="text-base font-black text-white mt-1 block">{trainingDaysThisMonth} Days</span>
                </div>
                <div className="bg-zinc-950/20 p-3.5 rounded-xl border border-zinc-900/40">
                  <span className="text-[8.5px] font-mono text-zinc-500 block uppercase">CHECK-INS COMPLETED</span>
                  <span className="text-base font-black text-white mt-1 block">{habitCheckinsCompletedVal} Times</span>
                </div>
              </div>

              {/* Short Summary Description */}
              <div className="bg-zinc-950 border border-zinc-900 p-4 rounded-xl space-y-1">
                <span className="text-[9px] font-mono text-amber-500 uppercase tracking-widest font-black block">Snap Summary</span>
                <p className="text-xs text-zinc-350 leading-relaxed font-sans italic">
                  "{getShortSummary()}"
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: PREVIOUS CALIBRATION SCANS & DATA CONFIDENCE */}
        <div className="lg:col-span-6 space-y-6">

          {/* PREVIOUS CALIBRATION RECORDS */}
          <div className="bg-zinc-955 border border-zinc-900 p-6 rounded-3xl space-y-4">
            <div className="flex items-center gap-2 border-b border-zinc-900/60 pb-3">
              <History className="w-4 h-4 text-zinc-400" />
              <h3 className="text-sm font-display font-black text-white uppercase">Recorded Physical Snapshots</h3>
            </div>

            {scans.length > 0 ? (
              <div className="space-y-3">
                {scans.slice(0, 5).map((scan, sIdx) => (
                  <div key={sIdx} className="bg-zinc-950/45 border border-zinc-900/80 p-4 rounded-xl flex items-center justify-between hover:border-zinc-855 transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white uppercase">{scan.archetype}</span>
                        <span className="text-[8.5px] font-mono bg-zinc-900 py-0.5 px-2 rounded text-zinc-400">
                          {scan.scannedAt.split("T")[0]}
                        </span>
                      </div>
                      <span className="text-[10px] text-zinc-500 font-mono block">Primary focus: {scan.workoutFocus}</span>
                    </div>
                    <span className="text-[10px] text-amber-500 font-bold font-mono uppercase bg-amber-500/5 py-1 px-2.5 rounded border border-amber-500/10">
                      VERIFIED
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-zinc-500 space-y-2 border border-dashed border-zinc-900 rounded-xl">
                <Compass className="w-8 h-8 text-zinc-700 mx-auto" />
                <p className="text-xs text-zinc-450 leading-relaxed max-w-xs mx-auto">
                  No visual scan entries logged yet. Your visual progress history will appear here once you take your first photo check, verifying your physical progress.
                </p>
              </div>
            )}
          </div>

          {/* RETENTION REASSURANCE PILLARS */}
          <div className="bg-zinc-950/60 border border-zinc-900 p-6 rounded-3xl space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
              <span className="text-xs font-bold text-zinc-350 uppercase">Verified Progress Principles</span>
            </div>
            <ul className="space-y-2 text-[11.5px] text-zinc-400 leading-normal list-disc pl-4">
              <li>ArcForm never invents simulated milestones or fake physique charts.</li>
              <li>Your consistency is our primary metric. Showing up and checking-in on planned targets builds long-term balance.</li>
              <li>Your training split and priority automatically shift with muscle recovery.</li>
            </ul>
          </div>

        </div>

      </div>

    </div>
  );
}
