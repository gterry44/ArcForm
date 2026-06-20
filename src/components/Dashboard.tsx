import React, { useState } from "react";
import { 
  Sparkles, 
  Dumbbell,
  Clock,
  Share2,
  Copy,
  Info,
  X
} from "lucide-react";
import { UserProfile } from "../types";
import { PhysiqueBlueprint } from "./PhysiqueBlueprint";

interface DashboardProps {
  profile: UserProfile;
  toggleAction: (actionId: string) => void;
  setActiveTab: (tab: string) => void;
  onUpdateProfile?: (updated: UserProfile) => void;
}

export function getWorkoutGrade(sets: number, effort: number): string {
  if (sets >= 6 && effort >= 9) return "A+";
  if (sets >= 4 && effort >= 7) return "A";
  if (sets >= 3 && effort >= 5) return "B";
  return "C";
}

export default function Dashboard({ profile, setActiveTab, onUpdateProfile }: DashboardProps) {
  const momentum = profile.momentum;
  const recentScan = profile.scansList[0];
  
  // State for interactive share modal
  const [activeShareModal, setActiveShareModal] = useState<"archetype" | "momentum" | null>(null);
  const [copiedNotification, setCopiedNotification] = useState(false);
  const [downloadingSim, setDownloadingSim] = useState(false);
  const [downloadSuccessText, setDownloadSuccessText] = useState("");

  // Edit goals/custom target states
  const [showEditGoalsModal, setShowEditGoalsModal] = useState(false);
  const [editGoal, setEditGoal] = useState(() => profile.goal || "Build Wider Shoulders");
  const [editTargetArchetype, setEditTargetArchetype] = useState(() => profile.targetArchetype || "Athletic V-Taper");
  const [editSex, setEditSex] = useState(() => profile.biologicalSex || "Male");
  const [athleteTag, setAthleteTag] = useState(() => profile.athleteTag || "@skigreg44");

  const openEditGoalsModal = () => {
    setEditGoal(profile.goal || "Build Wider Shoulders");
    setEditTargetArchetype(profile.targetArchetype || "Athletic V-Taper");
    setEditSex(profile.biologicalSex || "Male");
    setAthleteTag(profile.athleteTag || "@skigreg44");
    setShowEditGoalsModal(true);
  };

  const handleSelectSexInModal = (sexValue: "Male" | "Female" | "Prefer Not to Say") => {
    setEditSex(sexValue);
    if (sexValue === "Male") {
      setEditGoal("Build Wider Shoulders");
    } else if (sexValue === "Female") {
      setEditGoal("Improve Posture & Symmetry");
    } else {
      setEditGoal("Look More Athletic");
    }
  };

  const handleSaveGoals = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateProfile) {
      onUpdateProfile({
        ...profile,
        biologicalSex: editSex as any,
        goal: editGoal,
        targetArchetype: editTargetArchetype as any,
        athleteTag: athleteTag
      });
    }
    setShowEditGoalsModal(false);
  };

  const handleShareSocial = (platform: "twitter" | "facebook" | "whatsapp") => {
    const shareMessage = `Carving my physical proportions design in ArcForm! Current shape: ${profile.currentArchetype}, Target style: ${profile.targetArchetype}. Visual symmetry tracking.`;
    let url = "";
    if (platform === "twitter") {
      url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareMessage)}`;
    } else {
      url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage)}`;
    }
    window.open(url, "_blank");
  };

  const handleNativeShare = () => {
    try {
      const shareData = {
        title: "ArcForm Proportions spec",
        text: `Current: ${profile.currentArchetype} • Target: ${profile.targetArchetype} • Active Streak: ${momentum.streak} days`,
        url: window.location.origin
      };
      if (navigator.share) {
        navigator.share(shareData);
      } else {
        navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
        setCopiedNotification(true);
        setTimeout(() => setCopiedNotification(false), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRealDownload = () => {
    setDownloadingSim(true);
    setDownloadSuccessText("");

    setTimeout(() => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = 800;
        canvas.height = 1000;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Slate backdrop structure
        ctx.fillStyle = "#0c0a09";
        ctx.fillRect(0, 0, 800, 1000);

        ctx.strokeStyle = "rgba(234, 179, 8, 0.2)";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(20, 20, 760, 960);

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#ffffff";
        ctx.font = "900 38px sans-serif";
        ctx.fillText("A R C F O R M", 400, 135);

        ctx.fillStyle = "#eab308";
        ctx.font = "bold 13px monospace";
        ctx.fillText("SYMMETRY MODEL SPECIFICATION CARD", 400, 175);

        ctx.fillStyle = "rgba(10, 10, 12, 0.95)";
        ctx.fillRect(50, 235, 700, 170);
        ctx.strokeStyle = "rgba(234, 179, 8, 0.15)";
        ctx.strokeRect(50, 235, 700, 170);

        ctx.textAlign = "left";
        ctx.fillStyle = "#71717a";
        ctx.font = "bold 13px monospace";
        ctx.fillText("ATHLETE PROFILE:", 80, 275);
        ctx.fillText("CURRENT STATE:", 80, 315);
        ctx.fillText("TARGET GOAL:", 80, 355);

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 19px sans-serif";
        ctx.fillText(athleteTag, 320, 275);
        ctx.fillText(profile.currentArchetype, 320, 315);
        ctx.fillText(profile.targetArchetype, 320, 355);

        ctx.textAlign = "center";
        ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
        ctx.font = "bold 13px monospace";
        ctx.fillText("SAVED LOCALLY FOR PRIVATE DISCIPLINE", 400, 915);

        const dataUrl = canvas.toDataURL("image/png");
        const downloadElement = document.createElement("a");
        downloadElement.download = `arcform_proportions_${athleteTag.replace(/[^a-zA-Z0-9]/g, "_")}.png`;
        downloadElement.href = dataUrl;
        document.body.appendChild(downloadElement);
        downloadElement.click();
        document.body.removeChild(downloadElement);

        setDownloadSuccessText("Symmetry Card saved to device!");
      } catch (err: any) {
        console.error("Canvas draw failure:", err);
      } finally {
        setDownloadingSim(false);
      }
    }, 1200);
  };

  const recommendedFocus = recentScan?.workoutFocus || "Shoulder Width Focus";
  const targetGoal = profile.targetArchetype || "Athletic V-Taper";
  const reasonText = targetGoal === "Lean Frame" 
    ? "Trimming midsection volume and tightening the deep core wall produces the highest leverage impact on your overall athletic profile and alignment proportions."
    : targetGoal === "Classic Aesthetic" || targetGoal === "Advanced Aesthetic"
    ? "Balancing lateral shoulder width with rear delta postural support delivers the most dramatic impact to your skeletal silhouette and supports your aesthetic goal."
    : `Improving shoulder width would have the biggest impact on your overall proportions and support your ${targetGoal} goal.`;

  return (
    <div id="arcform-dashboard-wrapper" className="space-y-8 animate-fade-in text-zinc-100 p-0 md:p-2">
      
      {/* 1. COMPACT HUD PANEL */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-zinc-900/40 border border-zinc-900 rounded-2xl p-5 text-left">
          <span className="text-[10px] font-mono text-zinc-500 uppercase block tracking-wider font-bold">Current Form</span>
          <span className="text-base font-black text-white mt-1 block uppercase">{profile.currentArchetype}</span>
          <span className="text-[10px] text-amber-500 block font-mono">My Build Shape</span>
        </div>
        
        <div className="bg-zinc-900/40 border border-zinc-900 rounded-2xl p-5 text-left relative overflow-hidden">
          <span className="text-[10px] font-mono text-zinc-500 uppercase block tracking-wider font-bold">Target Form</span>
          <span className="text-base font-black text-amber-400 mt-1 block uppercase">{profile.targetArchetype}</span>
          <button 
            type="button"
            onClick={openEditGoalsModal}
            className="text-[10px] text-zinc-400 hover:text-amber-400 mt-1 block select-none pointer-events-auto leading-none text-left underline cursor-pointer font-sans"
          >
            Change Target
          </button>
        </div>

        <div className="bg-zinc-900/40 border border-zinc-900 rounded-2xl p-5 text-left">
          <span className="text-[10px] font-mono text-zinc-500 uppercase block tracking-wider font-bold">Primary Opportunity</span>
          <span className="text-base font-black text-white mt-1 block uppercase truncate font-sans">
            {recommendedFocus}
          </span>
          <span className="text-[10px] text-emerald-500 block font-mono">▲ Highest Leverage Focus</span>
        </div>
      </div>

      {/* 2. CORE PHYSIQUE BLUEPRINT (THE MAIN PRODUCT CENTER) */}
      <div id="blueprint-hero-mount">
        <PhysiqueBlueprint profile={profile} />
      </div>

      {/* 3. TODAY'S TRAINING RECOMMENDATION */}
      <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-amber-500/20 rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-2xl text-left">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full filter blur-3xl pointer-events-none" />
        
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-mono bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full text-amber-400 uppercase font-bold tracking-wider">
              Today's Recommendation
            </span>
            <span className="text-xs font-mono text-zinc-505">Optimized • recovered</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-8 space-y-4">
              <div className="space-y-1 text-left">
                <span className="text-[10px] text-zinc-550 font-mono uppercase block font-bold">Recommended Focus</span>
                <span className="text-2xl font-display font-black text-white mt-1 uppercase tracking-tight block">
                  {recommendedFocus}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono text-amber-500 uppercase block font-bold tracking-wider text-left">Reason</span>
                <p className="text-sm text-zinc-400 leading-relaxed font-sans max-w-xl text-left">
                  {reasonText}
                </p>
              </div>
            </div>

            <div className="md:col-span-4 bg-zinc-950/85 border border-zinc-900 rounded-2xl p-5 text-center md:text-left space-y-4">
              <div className="space-y-1.5 font-sans">
                <span className="text-[9px] font-mono text-zinc-500 block uppercase font-bold">Estimated Time</span>
                <div className="flex items-center justify-center md:justify-start gap-1.5 text-white">
                  <Clock className="w-4 h-4 text-amber-500" />
                  <span className="text-sm font-bold font-mono">35-45 minutes</span>
                </div>
              </div>

              <button 
                type="button"
                onClick={() => setActiveTab("workout")}
                className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:brightness-110 active:scale-95 text-zinc-950 font-extrabold text-xs py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer font-mono uppercase tracking-wider text-center"
              >
                <Dumbbell className="w-4 h-4 stroke-[2]" />
                <span>Start Workout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. EXPANDABLE PRIVATE ACCESSORY: DYNAMIC BLUEPRINT CARDS OR SHARE CODES */}
      <div id="blueprint-exports-section" className="glass-panel rounded-3xl p-6 border border-zinc-900 text-left relative overflow-hidden bg-zinc-950/25">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-8 space-y-3">
            <span className="text-[9.5px] uppercase font-mono tracking-widest bg-amber-500/10 text-amber-500 px-3 py-1 rounded-full font-bold">
              ArcForm Card
            </span>
            <h3 className="text-xl font-display font-black text-white mt-1.5 uppercase tracking-tight">Need a Progress Card?</h3>
            <p className="text-xs text-zinc-400">Save a high-resolution design file representing your progress goal.</p>
            
            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              <button 
                onClick={() => setActiveShareModal("archetype")}
                className="bg-zinc-900 hover:bg-zinc-800 text-amber-450 border border-zinc-805 hover:border-amber-500/30 text-xs px-4 py-2.5 rounded-xl font-mono transition-colors flex items-center gap-2 font-bold cursor-pointer"
              >
                <Share2 className="w-4 h-4 text-amber-500" />
                <span>Export Card file</span>
              </button>
              
              <button 
                onClick={handleNativeShare}
                className="bg-zinc-900 hover:bg-zinc-805 text-zinc-350 border border-zinc-805 text-xs px-4 py-2.5 rounded-xl font-mono transition-colors flex items-center gap-2 cursor-pointer font-bold"
              >
                <Copy className="w-4 h-4 text-zinc-405" />
                <span>Copy Specs</span>
              </button>
            </div>
          </div>

          <div className="md:col-span-4 bg-zinc-900/10 border border-zinc-900 rounded-2xl p-5 text-center font-mono">
            <span className="text-[9px] text-zinc-500 block uppercase font-bold text-center tracking-wider mb-2">My Proportions</span>
            <div className="space-y-1.5 bg-zinc-950/70 p-3 rounded-xl border border-zinc-900">
              <span className="text-[8px] uppercase text-zinc-550 block font-bold leading-none tracking-widest">ACTIVE STREAK</span>
              <span className="text-lg font-black text-white block mt-1">{momentum.streak} days</span>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL overlay views */}
      {activeShareModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto animate-fade-in text-zinc-100">
          <div className="w-full max-w-lg bg-zinc-950 border border-zinc-900 rounded-3xl p-6 md:p-8 space-y-6 relative shadow-2xl text-left animate-zoom-in">
            
            <button 
              type="button"
              onClick={() => {
                setActiveShareModal(null);
                setDownloadSuccessText("");
              }}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-850 hover:border-zinc-700 p-2 rounded-full cursor-pointer transition-all"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1 text-center font-sans">
              <span className="text-[10px] uppercase font-mono tracking-widest bg-amber-500/10 text-amber-500 px-3 py-1 bg-amber-500/10 rounded-full font-bold">
                Export Options
              </span>
              <h3 className="text-xl font-display font-black text-white mt-1">Get Your Symmetry Card</h3>
              <p className="text-xs text-zinc-400 font-sans">Save local graphics specification file safely.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="bg-zinc-900/40 border border-zinc-900 rounded-2xl p-4 flex flex-col justify-between space-y-4">
                <div className="space-y-1.5 font-sans">
                  <span className="text-xs font-bold text-white uppercase font-mono leading-none block">Twitter Specs Post</span>
                  <p className="text-[11px] text-zinc-400 leading-normal font-sans">
                    Pre-formats a tweet detailing: current Shape ({profile.currentArchetype}), goal shape ({profile.targetArchetype}), and streak.
                  </p>
                </div>
                <button 
                  type="button"
                  onClick={() => handleShareSocial("twitter")}
                  className="w-full py-2.5 rounded-xl text-center bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-mono font-bold transition-all text-white cursor-pointer"
                >
                  Post to Twitter
                </button>
              </div>

              <div className="bg-zinc-900/40 border border-zinc-900 rounded-2xl p-4 flex flex-col justify-between space-y-4 font-mono">
                <div className="space-y-1.5 font-sans">
                  <span className="text-xs font-bold text-white uppercase font-mono block leading-none">Download spec PNG</span>
                  <p className="text-[11px] text-zinc-400 leading-normal font-sans font-sans">
                    Calculates pixel layout on high-resolution GPU surface on your device.
                  </p>
                </div>
                <button 
                  type="button"
                  onClick={handleRealDownload}
                  disabled={downloadingSim}
                  className="w-full py-2.5 rounded-xl text-center bg-gradient-to-r from-amber-500 to-yellow-500 hover:brightness-110 text-zinc-950 font-bold text-xs transition-all cursor-pointer leading-tight uppercase font-mono"
                >
                  {downloadingSim ? "Generating file..." : "Export Local spec file"}
                </button>
              </div>
            </div>

            <div className="space-y-3.5 border-t border-zinc-900 pt-5 font-mono">
              <div className="space-y-1.5 font-sans">
                <div className="flex justify-between items-center text-[10px] text-zinc-500 font-bold uppercase">
                  <span>Athlete Handle (printed on card):</span>
                  <span className="text-zinc-650">Auto-filled</span>
                </div>
                <input
                  type="text"
                  value={athleteTag}
                  onChange={(e) => setAthleteTag(e.target.value)}
                  placeholder="@yourname"
                  className="w-full bg-zinc-900/60 border border-zinc-850 focus:border-amber-500/50 outline-none text-white text-xs px-3 py-2.5 rounded-xl transition-all font-sans"
                />
              </div>

              {copiedNotification && (
                <div className="text-[11px] font-sans text-emerald-450 font-bold text-center">
                  Specs copied to clipboard
                </div>
              )}

              {downloadSuccessText && (
                <div className="text-[11px] font-sans text-amber-500 font-bold text-center">
                  {downloadSuccessText}
                </div>
              )}

              <div className="text-[10px] text-zinc-500 flex items-start gap-1.5 bg-zinc-900/30 p-2.5 rounded-lg leading-snug font-sans">
                <Info className="w-3.5 h-3.5 text-zinc-500 shrink-0 mt-0.5 font-sans" />
                <span>These high-resolution progress cards are prepared dynamically using an offline-first GPU surface layout. You can save, crop, or text them directly on iOS & Android.</span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* EDIT GOALS AND ALIGNMENT MODAL OVERLAY */}
      {showEditGoalsModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto animate-fade-in text-zinc-100">
          <div className="w-full max-w-md bg-zinc-950 border border-zinc-900 rounded-3xl p-6 md:p-8 space-y-5 relative shadow-2xl text-left animate-zoom-in">
            
            <button 
              type="button"
              onClick={() => setShowEditGoalsModal(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-850 hover:border-zinc-700 p-2 rounded-full cursor-pointer transition-all"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1 text-center font-sans">
              <span className="text-[10px] uppercase font-mono tracking-widest bg-amber-500/10 text-amber-500 px-3 py-1 rounded-full font-bold">
                Goal Configurator
              </span>
              <h3 className="text-xl font-display font-black text-white mt-2">
                Customize Targets
              </h3>
              <p className="text-xs text-zinc-400">
                Align your training focus, target ratios, and biological parameters.
              </p>
            </div>

            <form onSubmit={handleSaveGoals} className="space-y-4">
              
              <div className="space-y-2 font-sans">
                <label className="text-[10px] uppercase font-bold text-zinc-450 tracking-wider block font-sans">
                  Biological Context / Gender
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(["Male", "Female", "Prefer Not to Say"] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => handleSelectSexInModal(s)}
                      className={`py-2 px-1 rounded-xl border text-center text-xs font-semibold transition-all cursor-pointer select-none leading-tight font-sans ${
                        editSex === s
                          ? "bg-amber-950/20 border-amber-500 text-amber-405"
                          : "bg-zinc-900/40 border-zinc-900 text-zinc-400 hover:border-zinc-800"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5 font-sans">
                <label className="text-[10px] uppercase font-bold text-zinc-450 tracking-wider block font-sans">
                  Symmetry Focus Goal
                </label>
                <div className="space-y-1">
                  {editSex === "Male" && [
                    { id: "Build Wider Shoulders", label: "Build Shoulder Width", desc: "Target lateral clavicle width & postural width" },
                    { id: "Gain Visual Upper Chest", label: "Build Visual Chest Line", desc: "Accentuate clavicular upper pectoral density" },
                    { id: "Chisel V-Taper Cut", label: "Chisel V-Taper Frame", desc: "Broaden shoulder span and narrow transverse abdomen line" }
                  ].map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setEditGoal(g.id)}
                      className={`w-full p-2.5 rounded-xl border text-left transition-all block cursor-pointer select-none font-sans ${
                        editGoal === g.id
                          ? "bg-gradient-to-r from-amber-500/10 to-transparent border-amber-500 text-white font-extrabold"
                          : "bg-zinc-900/40 border-zinc-900 text-zinc-400 hover:border-zinc-850"
                      }`}
                    >
                      <span className="text-xs block text-white font-bold">{g.label}</span>
                      <span className="text-[9px] text-zinc-500 block leading-none mt-0.5">{g.desc}</span>
                    </button>
                  ))}

                  {editSex === "Female" && [
                    { id: "Improve Posture & Symmetry", label: "Posture & Silhouette", desc: "Strengthen thoracic spine and shoulder alignment" },
                    { id: "Accentuate Back Proportions", label: "Hourglass Taper Balance", desc: "Build wider upper lats & narrow lumbar visual line" },
                    { id: "Sleek Clavicle Frame", label: "Elegant Collar Profiles", desc: "Improve clavicle skeletal symmetry & visual posture" }
                  ].map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setEditGoal(g.id)}
                      className={`w-full p-2.5 rounded-xl border text-left transition-all block cursor-pointer select-none font-sans ${
                        editGoal === g.id
                          ? "bg-gradient-to-r from-amber-500/10 to-transparent border-amber-500 text-white font-extrabold"
                          : "bg-zinc-900/40 border-zinc-900 text-zinc-400 hover:border-zinc-850"
                      }`}
                    >
                      <span className="text-xs block text-white font-bold">{g.label}</span>
                      <span className="text-[9px] text-zinc-505 block leading-none mt-0.5">{g.desc}</span>
                    </button>
                  ))}

                  {editSex === "Prefer Not to Say" && [
                    { id: "Look More Athletic", label: "Look More Athletic", desc: "Build wider shoulders and compress midsection" },
                    { id: "Improve Posture & Symmetry", label: "Improve Posture & Symmetry", desc: "Stand tall, align shoulders, pull lats wide" },
                    { id: "Get Leaner & Defined", label: "Chisel Down & Define", desc: "Keep body fat low and highlight outline contours" },
                    { id: "Gain Dynamic Muscle Mass", label: "Gain Dynamic Muscle Mass", desc: "Increase general visual density and lean frame size" }
                  ].map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setEditGoal(g.id)}
                      className={`w-full p-2.5 rounded-xl border text-left transition-all block cursor-pointer select-none font-sans ${
                        editGoal === g.id
                          ? "bg-gradient-to-r from-amber-500/10 to-transparent border-amber-500 text-white font-extrabold"
                          : "bg-zinc-900/40 border-zinc-900 text-zinc-400 hover:border-zinc-850"
                      }`}
                    >
                      <span className="text-xs block text-white font-bold">{g.label}</span>
                      <span className="text-[9px] text-zinc-505 block leading-none mt-0.5">{g.desc}</span>
                    </button>
                  ))}
                  
                </div>
              </div>

              <div className="space-y-1.5 font-sans">
                <label className="text-[10px] uppercase font-bold text-zinc-450 tracking-wider block">
                  Physique Silhouette Target
                </label>
                <div className="space-y-1 max-h-[140px] overflow-y-auto pr-1 font-sans">
                  {[
                    "Athletic V-Taper",
                    "Balanced Physique",
                    "Classic Aesthetic",
                    "Lean Frame",
                    "Advanced Aesthetic"
                  ].map((tier) => (
                    <button
                      key={tier}
                      type="button"
                      onClick={() => setEditTargetArchetype(tier as any)}
                      className={`w-full p-2 rounded-xl border text-left text-xs transition-all block cursor-pointer select-none ${
                        editTargetArchetype === tier
                          ? "bg-amber-950/20 border-amber-500 text-amber-500 font-bold"
                          : "bg-zinc-900/40 border-zinc-900 text-zinc-400 hover:border-zinc-800"
                      }`}
                    >
                      {tier}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setShowEditGoalsModal(false)}
                  className="bg-zinc-900 hover:bg-zinc-800 text-zinc-400 py-3 rounded-xl text-xs font-semibold text-center transition-all cursor-pointer border border-zinc-800 font-sans"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-amber-500 to-yellow-500 text-zinc-950 py-3 rounded-xl text-xs font-extrabold uppercase tracking-wider text-center transition-all cursor-pointer shadow-lg shadow-amber-500/10 font-sans"
                >
                  Save Changes
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
