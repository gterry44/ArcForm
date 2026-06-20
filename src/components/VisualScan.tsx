import React, { useState, useRef } from "react";
import { 
  Camera, 
  Upload, 
  Sparkles, 
  AlertCircle, 
  CheckCircle, 
  Zap, 
  Loader2, 
  ShieldAlert, 
  Award,
  ChevronRight,
  TrendingDown,
  HelpCircle,
  X
} from "lucide-react";
import { UserProfile, PhysiqueScanResult, ArchetypeType } from "../types";

interface VisualScanProps {
  profile: UserProfile;
  onAnalysisSuccess: (result: PhysiqueScanResult) => void;
}

export default function VisualScan({ profile, onAnalysisSuccess }: VisualScanProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<PhysiqueScanResult | null>(profile.scansList[0] || null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [presetSelection, setPresetSelection] = useState<string>("Lean Frame");
  const [customGoal, setCustomGoal] = useState<string>("Athletic V-Taper");
  const [showFramingModal, setShowFramingModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const presets = [
    { name: "Lean Frame", description: "Skinny baseline, low body fat", target: "Athletic V-Taper" },
    { name: "Foundation Builder", description: "Untrained or high fat, low alignment", target: "Athletic Builder" },
    { name: "Athletic Builder", description: "Good size baseline, needs symmetry refinement", target: "Classic Aesthetic" }
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setErrorMsg("File must be an image (PNG or JPEG).");
      return;
    }
    setErrorMsg(null);
    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Convert image to a smaller data URL if needed or trigger server scan
  const executeAnalysis = async () => {
    setAnalyzing(true);
    setErrorMsg(null);

    try {
      const response = await fetch("/api/analyze-physique", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          image: selectedImage, // will be base64 data url or null
          archetypePreset: presetSelection,
          targetArchetypeGoal: customGoal,
          userGoal: profile.goal,
          userLevel: profile.level
        })
      });

      const resData = await response.json();
      if (resData.success && resData.data) {
        const scanResult: PhysiqueScanResult = {
          ...resData.data,
          scannedAt: new Date().toISOString(),
          imageUrl: selectedImage || undefined
        };
        setResult(scanResult);
        onAnalysisSuccess(scanResult);
      } else {
        throw new Error(resData.error || "Failed to analyze physique snapshot.");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "An error occurred during physique analysis.");
    } finally {
      setAnalyzing(false);
    }
  };

  const loadPresetSampleAndTrigger = (presetName: string, targetName: string) => {
    setPresetSelection(presetName);
    setCustomGoal(targetName);
    // Draw a placeholder visual canvas representation for this archetype
    let colorHex = "#3182ce";
    if (presetName === "Lean Frame") colorHex = "#4299e1";
    if (presetName === "Foundation Builder") colorHex = "#ed8936";
    
    const svgMock = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="400" viewBox="0 0 100 200"><rect width="100" height="200" fill="%230f1115"/><path d="M20,10 C40,5 60,5 80,10 C70,40 75,70 90,110 C75,130 80,180 82,200 L18,200 C20,180 25,130 10,110 C25,70 30,40 20,10 Z" fill="none" stroke="${encodeURIComponent(colorHex)}" stroke-width="1.5"/><circle cx="50" cy="30" r="10" fill="none" stroke="${encodeURIComponent(colorHex)}" stroke-width="1.5"/></svg>`;
    
    setSelectedImage(svgMock);
  };

  return (
    <div id="arcform-visualscan-wrapper" className="space-y-8 animate-fade-in">
      
      {/* SHIELD HEADER */}
      <div className="border-b border-gray-800/60 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-widest mb-1.5 animate-pulse">
            <Sparkles className="w-4 h-4 text-amber-500" />
            Physique Scan & Assessment
          </div>
          <h1 className="text-3xl font-display font-black text-white tracking-tight">
            Physique Snapshot
          </h1>
          <p className="text-sm text-gray-400 mt-1 max-w-2xl">
            Upload a front, side, or back progress photo to calculate your strengths, muscle development opportunities, and targeted action steps.
          </p>
        </div>
        
        <button
          onClick={() => setShowFramingModal(true)}
          className="flex items-center gap-1.5 px-3 py-2 text-xs text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-amber-500/20 rounded-xl transition-all cursor-pointer font-mono shrink-0 select-none shadow-md"
        >
          <HelpCircle className="w-4 h-4 text-amber-500" />
          <span>Camera Framing Guide</span>
        </button>
      </div>

      {/* CORE INPUT & WORKFLOW GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* FILE CAPTURE COLUMN */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-mono text-gray-400 uppercase tracking-widest">
              STEP 1: Upload Photo
            </h3>

            {/* DRAG AND DROP ZONE */}
            <div 
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                dragActive 
                  ? "border-amber-500 bg-amber-950/10" 
                  : "border-gray-800 hover:border-gray-700 bg-gray-950/40"
              }`}
            >
              <input 
                ref={fileInputRef}
                type="file" 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileChange}
              />

              {selectedImage ? (
                <div className="space-y-4">
                  <div className="relative mx-auto w-40 h-52 bg-gray-900 rounded-lg overflow-hidden border border-gray-800 flex items-center justify-center">
                    <img 
                      src={selectedImage} 
                      alt="Uploaded Physique" 
                      className="max-w-full max-h-full object-cover"
                    />
                  </div>
                  <div className="text-xs text-emerald-400 flex items-center justify-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Photo loaded successfully
                  </div>
                  <span className="text-[10px] text-gray-500 block hover:underline">
                    Click to replace photo
                  </span>
                </div>
              ) : (
                <div className="space-y-4 py-4">
                  <div className="p-3 bg-gray-900/80 rounded-full w-min mx-auto border border-gray-800">
                    <Upload className="w-6 h-6 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-300">Drag & drop physique photo</p>
                    <p className="text-[10px] text-gray-500 mt-1">Fits front, side, or back poses pose</p>
                  </div>
                  <button 
                    type="button"
                    className="text-xs bg-gray-900 border border-gray-800 text-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-800 transition-all font-mono"
                  >
                    SELECT FROM DEVICE
                  </button>
                </div>
              )}
            </div>

            {/* ERROR DISPLAY */}
            {errorMsg && (
              <div className="bg-red-950/20 text-red-400 text-xs p-3 rounded-lg border border-red-500/10 flex gap-2 items-start">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* PRESETS IN CASE USER HAS NO PHOTO - EXTREMELY USER FRIENDLY */}
            <div className="space-y-3 pt-2">
              <span className="text-xs text-gray-400 font-mono block">No photo handy? Choose a starting template:</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {presets.map((p) => (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => loadPresetSampleAndTrigger(p.name, p.target)}
                    className={`p-2 rounded-lg text-left text-xs border transition-all ${
                      presetSelection === p.name && selectedImage && selectedImage.startsWith("data:image/svg+xml")
                        ? "bg-amber-950/20 border-amber-500/40 text-white"
                        : "bg-gray-900/40 border-gray-800/80 text-gray-400 hover:border-gray-700"
                    }`}
                  >
                    <span className="font-bold block text-white">{p.name}</span>
                    <span className="text-[9px] mt-0.5 block leading-tight text-gray-500">{p.description}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-6 space-y-4">
            <div>
              <h3 className="text-xs font-mono text-gray-400 uppercase tracking-widest">
                STEP 2: Target Goal
              </h3>
              <p className="text-[10px] text-gray-500 mt-0.5">Determine your next visual target</p>
            </div>

            <div className="space-y-2">
              <select 
                value={customGoal}
                onChange={(e) => setCustomGoal(e.target.value)}
                className="w-full bg-gray-900 border border-gray-800 text-gray-200 text-xs rounded-lg p-2.5 outline-none focus:border-amber-500"
              >
                <option value="Athletic Builder">Athletic Builder (Balanced Base)</option>
                <option value="Athletic V-Taper">Athletic V-Taper (Sholder & Back Width)</option>
                <option value="Balanced Physique">Balanced Physique (Chest & Waist Focus)</option>
                <option value="Classic Aesthetic">Classic Proportions (Tight Waist focus)</option>
                <option value="Advanced Aesthetic">Ultimate Physique (Elite definition)</option>
              </select>
            </div>

            <button
              onClick={executeAnalysis}
              disabled={analyzing || !selectedImage}
              className={`w-full py-3 px-4 rounded-xl text-xs font-mono tracking-wider font-bold transition-all flex items-center justify-center gap-2 ${
                analyzing 
                  ? "bg-amber-900/40 text-amber-300 border border-amber-800/30 cursor-not-allowed" 
                  : selectedImage
                  ? "bg-gradient-to-r from-amber-500 to-yellow-500 hover:opacity-90 text-black shadow-lg shadow-amber-500/10 cursor-pointer"
                  : "bg-gray-900 text-gray-500 border border-gray-805 cursor-not-allowed"
              }`}
            >
              {analyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
                  <span>ANALYZING PHOTOGRAPH...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-zinc-950" />
                  <span>ANALYZE PHYSIQUE SNAPSHOT</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* ANALYSIS OUTPUT COLUMN */}
        <div className="lg:col-span-7 space-y-6">
          {result ? (
            <div className="glass-panel rounded-2xl p-6 space-y-6 border border-amber-500/10 bg-gradient-to-b from-amber-950/5 to-transparent relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full filter blur-2xl" />
              
              {/* DIAGNOSIS METADATA */}
              <div className="flex items-start justify-between border-b border-gray-800/80 pb-4">
                <div>
                  <div className="text-[10px] font-mono text-amber-400 uppercase tracking-widest mb-1 font-bold">
                    PHYSIQUE report
                  </div>
                  <h3 className="text-xl font-display font-black text-white">
                    Estimated State: {result.archetype}
                  </h3>
                  <span className="text-[10px] text-gray-500 font-mono">
                    Scanned at: {new Date(result.scannedAt).toLocaleTimeString()} UTC
                  </span>
                </div>
                <div className="bg-amber-950/40 border border-amber-500/20 text-amber-400 font-mono text-xs px-2.5 py-1.5 rounded-lg text-center">
                  <span className="block text-[8px] uppercase text-gray-550 font-bold">TARGET GOAL</span>
                  {result.targetArchetype}
                </div>
              </div>

              {/* THREE CORE VIRTUES OF THE SCAN */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* STRENGTHS */}
                <div className="bg-gray-900/40 border border-gray-800/50 p-4 rounded-xl space-y-2">
                  <span className="text-xs font-bold text-emerald-400 uppercase font-mono tracking-wider">
                    Strong Points
                  </span>
                  <ul className="text-xs text-gray-300 space-y-1.5 list-disc pl-4 leading-relaxed">
                    {result.strengths.map((str, idx) => (
                      <li key={idx}>{str}</li>
                    ))}
                  </ul>
                </div>

                {/* WEAKNESS OPPORTUNITIES */}
                <div className="bg-gray-900/40 border border-gray-800/50 p-4 rounded-xl space-y-2">
                  <span className="text-xs font-bold text-red-400 uppercase font-mono tracking-wider">
                    Identified Gaps
                  </span>
                  <ul className="text-xs text-gray-300 space-y-1.5 list-disc pl-4 leading-relaxed">
                    {result.weaknesses.map((weak, idx) => (
                      <li key={idx}>{weak}</li>
                    ))}
                  </ul>
                </div>

                {/* VISUAL ADVANTAGES */}
                <div className="bg-gray-900/40 border border-gray-800/50 p-4 rounded-xl space-y-2">
                  <span className="text-xs font-bold text-amber-400 uppercase font-mono tracking-wider">
                    Growth Leverage
                  </span>
                  <ul className="text-xs text-gray-300 space-y-1.5 list-disc pl-4 leading-relaxed">
                    {result.opportunities.map((opp, idx) => (
                      <li key={idx}>{opp}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* HIGHEST LEVERAGE IMPROVEMENTS */}
              <div className="bg-gray-900/50 border border-gray-800/80 rounded-xl p-5 space-y-4 font-sans">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-400" />
                  <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                    HOW TO IMPROVE YOUR LOOK
                  </span>
                </div>
                <div className="space-y-3">
                  {result.highestLeverageImprovements.map((imp, idx) => (
                    <div key={idx} className="flex gap-2 text-xs text-gray-300 leading-relaxed">
                      <span className="text-amber-500 font-bold shrink-0 font-mono font-bold">0{idx + 1}.</span>
                      <p>{imp}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* FOCUS TRANSLATION ROW */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-800/80 pt-5">
                <div>
                  <span className="text-[10px] text-gray-500 font-mono uppercase block mb-1">Main Focus Area</span>
                  <p className="text-sm font-semibold text-white">{result.workoutFocus}</p>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 font-mono uppercase block mb-1">Today's Action</span>
                  <p className="text-sm font-semibold text-amber-400">{result.dailyFocus}</p>
                </div>
              </div>

              {/* NEXT PHYSICAL STEPS */}
              <div className="space-y-2.5">
                <span className="text-[10px] text-gray-500 font-mono uppercase block">Action Steps</span>
                {result.nextActions.map((act, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 bg-gray-950/40 border border-gray-900 p-2.5 rounded-lg text-xs font-mono text-gray-300">
                    <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{act}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="glass-panel rounded-2xl p-12 text-center flex flex-col items-center justify-center h-full border border-gray-800/40 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gray-500/5 rounded-full filter blur-2xl" />
              <ShieldAlert className="w-10 h-10 text-gray-600 mb-4" />
              <h3 className="text-base font-display font-bold text-gray-300">Awaiting Photo Analysis</h3>
              <p className="text-xs text-zinc-400 max-w-sm mt-1 leading-relaxed">
                Upload a front or back snapshot on the left, or use one of the templates to view key exercise focuses and progress steps.
              </p>
            </div>
          )}
        </div>

      </div>

      {/* CAMERA FRAMING GUIDE MODAL */}
      {showFramingModal && (
        <div id="camera-framing-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-all duration-300">
          <div className="bg-zinc-950 border border-zinc-900 rounded-3xl max-w-lg w-full p-6 space-y-6 relative overflow-hidden shadow-2xl animate-fade-in text-left">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
            
            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-amber-500 font-mono text-[10px] uppercase font-bold tracking-widest leading-none">
                  <Camera className="w-4 h-4 animate-pulse" />
                  <span>PHOTO GUIDELINES</span>
                </div>
                <h3 className="text-sm md:text-base font-display font-black text-white">How to Capture Perfect Silhouette Poses</h3>
              </div>
              <button
                onClick={() => setShowFramingModal(false)}
                className="p-1 rounded-lg bg-zinc-900 hover:bg-zinc-850 hover:text-white text-zinc-400 border border-zinc-800 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Step Guides Accordion/List */}
            <div className="space-y-4 text-xs leading-relaxed text-zinc-300">
              <p className="text-zinc-400">
                To get the most accurate aesthetic reading for your shoulders, upper back, chest fullness, and waist outline, implement these simple framing checks:
              </p>

              <div className="space-y-3.5 pt-1">
                {/* 1. Lighting */}
                <div className="bg-zinc-900/40 border border-zinc-900 p-3 rounded-xl flex gap-3">
                  <span className="text-lg leading-none shrink-0 font-mono text-amber-500 font-black">01</span>
                  <div className="space-y-0.5">
                    <h4 className="font-bold text-white text-xs">Shadows define muscles</h4>
                    <p className="text-[11px] text-zinc-400">Avoid strong backlighting (standing directly in front of a bright window). Stand with overhead or front lighting so muscle contours are clear.</p>
                  </div>
                </div>

                {/* 2. Height */}
                <div className="bg-zinc-900/40 border border-zinc-900 p-3 rounded-xl flex gap-3">
                  <span className="text-lg leading-none shrink-0 font-mono text-amber-500 font-black">02</span>
                  <div className="space-y-0.5">
                    <h4 className="font-bold text-white text-xs">Shoot at navel level</h4>
                    <p className="text-[11px] text-zinc-400">Placing the camera too high creates a large head/neck and small waist. Place your camera at chest/waist level for true aesthetic proportions.</p>
                  </div>
                </div>

                {/* 3. Distance */}
                <div className="bg-zinc-900/40 border border-zinc-900 p-3 rounded-xl flex gap-3">
                  <span className="text-lg leading-none shrink-0 font-mono text-amber-500 font-black">03</span>
                  <div className="space-y-0.5">
                    <h4 className="font-bold text-white text-xs">Stand 6 to 8 feet away</h4>
                    <p className="text-[11px] text-zinc-400">Ensure your entire upper frame (hips, chest, shoulders, and up to the head) is visible in the picture. Squeezing too close distorts proportions.</p>
                  </div>
                </div>

                {/* 4. Natural Posture */}
                <div className="bg-zinc-900/40 border border-zinc-900 p-3 rounded-xl flex gap-3">
                  <span className="text-lg leading-none shrink-0 font-mono text-amber-500 font-black">04</span>
                  <div className="space-y-0.5">
                    <h4 className="font-bold text-white text-xs">Clean, natural posture</h4>
                    <p className="text-[11px] text-zinc-400">Stand tall, relax your shoulders down, and keep your elbows slightly out. Avoid excessively flaring lats or puffing chest to get a true starting shape.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Got it action button */}
            <div className="pt-2 border-t border-zinc-900 flex justify-end">
              <button
                type="button"
                onClick={() => setShowFramingModal(false)}
                className="w-full sm:w-auto px-5 py-2.5 bg-amber-500 text-black text-xs font-mono font-bold rounded-xl hover:opacity-90 transition-all cursor-pointer select-none text-center"
              >
                GOT IT, LET'S SCAN
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
