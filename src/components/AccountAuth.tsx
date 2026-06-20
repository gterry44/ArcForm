import React, { useState } from "react";
import { 
  Zap, 
  Lock, 
  Mail, 
  ArrowRight, 
  CheckCircle, 
  Sparkles, 
  Smartphone, 
  UserPlus, 
  ShieldCheck,
  User,
  Eye,
  EyeOff,
  ChevronRight
} from "lucide-react";
import { UserProfile, ArchetypeType } from "../types";
import { INITIAL_USER_PROFILE } from "../data";

interface AccountAuthProps {
  onSuccess: (profile: UserProfile) => void;
}

export default function AccountAuth({ onSuccess }: AccountAuthProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("register");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Questionnaire States
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [qStep, setQStep] = useState(1);
  const [biologicalSex, setBiologicalSex] = useState<"Male" | "Female" | "Prefer Not to Say">("Male");
  const [selectedGoals, setSelectedGoals] = useState<string[]>(["Build Wider Shoulders"]);
  const [selectedLevel, setSelectedLevel] = useState("Beginner");
  const [qWeight, setQWeight] = useState(170);
  const [qHeightFeet, setQHeightFeet] = useState(5);
  const [qHeightInches, setQHeightInches] = useState(10);
  const [selectedTargetArchetype, setSelectedTargetArchetype] = useState<ArchetypeType>("Athletic V-Taper");
  const [pendingProfile, setPendingProfile] = useState<UserProfile | null>(null);

  const selectedGoal = selectedGoals.join(", ");

  const toggleGoal = (goalId: string) => {
    setSelectedGoals(prev => {
      if (prev.includes(goalId)) {
        if (prev.length === 1) return prev; // Do not allow deselecting everything
        return prev.filter(g => g !== goalId);
      } else {
        return [...prev, goalId];
      }
    });
  };

  // Try loading default custom registered accounts
  const getExistingAccounts = (): UserProfile[] => {
    const saved = localStorage.getItem("arcform_user_accounts");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [INITIAL_USER_PROFILE];
      }
    }
    return [INITIAL_USER_PROFILE];
  };

  // Handle instant sandbox demo login
  const handleDemoLogin = () => {
    setErrorMsg("");
    setSuccessMsg("Starting free sandbox session...");
    
    const demoProfileName = "Sandbox Athlete Demo";
    const accounts = getExistingAccounts();
    const existing = accounts.find(a => a.name === demoProfileName);
    
    let template: UserProfile;
    if (existing) {
      template = existing;
    } else {
      template = { 
        ...INITIAL_USER_PROFILE, 
        name: demoProfileName,
        goal: "Look More Athletic",
        level: "Beginner",
        actionsList: [
          { id: "act-c1", task: "Do 3 sets of quick shoulder exercises", completed: false, category: "training", pointsValue: 15 },
          { id: "act-c2", task: "Eat a clean, balanced meal", completed: false, category: "nutrition", pointsValue: 15 },
          { id: "act-c3", task: "Stand tall with great posture", completed: false, category: "lifestyle", pointsValue: 10 }
        ],
        // Make sure it starts clean since user requested getting rid of prior metrics
        momentum: {
          streak: 0,
          consistencyPercentage: 0,
          lastCheckInDate: "",
          aestheticScore: 0,
          totalWorkoutsLog: 0
        },
        scansList: [],
        workoutHistory: []
      };
    }

    setTimeout(() => {
      setPendingProfile(template);
      if (template.goal && template.level) {
        onSuccess(template);
      } else {
        setShowQuestionnaire(true);
      }
      setSuccessMsg("");
    }, 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email.trim() || !password.trim()) {
      setErrorMsg("Please type in your email and password.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 letters or numbers.");
      return;
    }

    const accounts = getExistingAccounts();
    const existing = accounts.find(a => a.name.toLowerCase() === email.trim().toLowerCase());

    if (authMode === "login") {
      if (existing) {
        setSuccessMsg(`Welcome back! Loading your profile...`);
        setTimeout(() => {
          setPendingProfile(existing);
          if (existing.goal && existing.level) {
            onSuccess(existing);
          } else {
            setShowQuestionnaire(true);
          }
        }, 1200);
      } else {
        const newDuoProfile = { ...INITIAL_USER_PROFILE, name: email.trim() };
        setSuccessMsg(`Account created! Let's choose your fitness goals.`);
        setTimeout(() => {
          setPendingProfile(newDuoProfile);
          setShowQuestionnaire(true);
        }, 1200);
      }
    } else {
      // Sign Up process
      if (existing) {
        setErrorMsg("This email already has an account. Please Sign In instead.");
        return;
      }

      const freshProfile: UserProfile = {
        name: email.trim(),
        currentArchetype: "Foundation Builder",
        targetArchetype: "Athletic V-Taper",
        weightLbs: 175,
        heightInches: 71,
        bodyFatPercentage: 15.0,
        momentum: {
          streak: 1,
          consistencyPercentage: 100,
          lastCheckInDate: new Date().toISOString().split("T")[0],
          aestheticScore: 70,
          totalWorkoutsLog: 0
        },
        scansList: [],
        actionsList: [
          { id: `fresh-a1`, task: "Perform dumbbell side raises", completed: false, category: "training", pointsValue: 12 },
          { id: `fresh-a2`, task: "Eat healthy proteins", completed: false, category: "nutrition", pointsValue: 12 },
          { id: `fresh-a3`, task: "Log your first workout", completed: false, category: "training", pointsValue: 12 }
        ],
        workoutHistory: []
      };

      setSuccessMsg(`Account registered! Let's choose your fitness goals.`);
      setTimeout(() => {
        setPendingProfile(freshProfile);
        setShowQuestionnaire(true);
      }, 1200);
    }
  };

  const selectBiologicalSex = (sex: "Male" | "Female" | "Prefer Not to Say") => {
    setBiologicalSex(sex);
    if (sex === "Male") {
      setSelectedGoals(["Build Wider Shoulders"]);
      setSelectedTargetArchetype("Athletic V-Taper");
    } else if (sex === "Female") {
      setSelectedGoals(["Tighten Waist & Flat Tummy"]);
      setSelectedTargetArchetype("Balanced Physique");
    } else {
      setSelectedGoals(["Look More Athletic"]);
      setSelectedTargetArchetype("Lean Frame");
    }
  };

  const handleQuestionnaireSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingProfile) return;

    // Based on goals, customize actionsList to be extremely simple and personal
    let customizedActions: any[] = [];

    if (selectedGoals.includes("Build Wider Shoulders")) {
      customizedActions.push(
        { id: "act-c1", task: "Perform side shoulder raises to widen your upper body look", completed: false, category: "training", pointsValue: 15 },
        { id: "act-c2", task: "Check posture in mirror: stand tall and pull shoulders back to widen your outline", completed: false, category: "lifestyle", pointsValue: 10 },
        { id: "act-c3", task: "Consume a clean portion of whole-food protein (such as eggs, chicken, or a clean shake)", completed: false, category: "nutrition", pointsValue: 15 }
      );
    }
    if (selectedGoals.includes("Improve Back Width")) {
      customizedActions.push(
        { id: "act-c4", task: "Perform visual back-widening exercises to build wider proportions", completed: false, category: "training", pointsValue: 15 },
        { id: "act-c5", task: "Perform a chest-opening wall stretch to guide shoulders back", completed: false, category: "training", pointsValue: 10 },
        { id: "act-c6", task: "Drink 3 liters of fresh water today to keep muscles looking full", completed: false, category: "nutrition", pointsValue: 15 }
      );
    }
    if (selectedGoals.includes("Bring Up Upper Chest")) {
      customizedActions.push(
        { id: "act-c7", task: "Complete 3 sets of incline push-ups to build upper chest fullness", completed: false, category: "training", pointsValue: 15 },
        { id: "act-c8", task: "Stand tall and lift your shoulders to align and widen your posture look", completed: false, category: "lifestyle", pointsValue: 10 },
        { id: "act-c9", task: "Eat a balanced meal containing natural carbs & proteins", completed: false, category: "nutrition", pointsValue: 15 }
      );
    }
    if (selectedGoals.includes("Tighten Waist") || selectedGoals.includes("Tighten Waist & Flat Tummy")) {
      customizedActions.push(
        { id: "act-c10", task: "Perform 3 sets of 30-sec stomach drawing-in exercises to narrow your midsection look", completed: false, category: "training", pointsValue: 15 },
        { id: "act-c11", task: "Hit 8,000 steps to stimulate body-toning energy output", completed: false, category: "training", pointsValue: 15 },
        { id: "act-c12", task: "Keep dinner portions smart and avoid high-sodium snacks before bed", completed: false, category: "nutrition", pointsValue: 10 }
      );
    }
    if (selectedGoals.includes("Build Balanced Proportions")) {
      customizedActions.push(
        { id: "act-c13", task: "Do a 10-minute visual core line checklist workout", completed: false, category: "training", pointsValue: 15 },
        { id: "act-c14", task: "Check standing silhouette: stand tall and pull shoulders back in the mirror", completed: false, category: "lifestyle", pointsValue: 10 },
        { id: "act-c15", task: "Log a complete protein intake goal post-session", completed: false, category: "nutrition", pointsValue: 15 }
      );
    }
    if (selectedGoals.includes("Improve Posture") || selectedGoals.includes("Improve Posture & Silhouette") || selectedGoals.includes("Improve Posture & Symmetry")) {
      customizedActions.push(
        { id: "act-c16", task: "Perform chest-opening door frame stretches to open posture lines", completed: false, category: "training", pointsValue: 15 },
        { id: "act-c17", task: "Stand with heels, back, and head flat against wall for 3 minutes", completed: false, category: "training", pointsValue: 15 },
        { id: "act-c18", task: "Take a 5-minute break from screen posture to relax neck muscles", completed: false, category: "lifestyle", pointsValue: 10 }
      );
    }
    if (selectedGoals.includes("Build Active Tone") || selectedGoals.includes("Get Leaner & Defined") || selectedGoals.includes("Get Leaner")) {
      customizedActions.push(
        { id: "act-c19", task: "Perform 3 light sets of full-body toning reps or core bridges", completed: false, category: "training", pointsValue: 15 },
        { id: "act-c20", task: "Walk 7,500 active steps to burn energy naturally", completed: false, category: "training", pointsValue: 15 },
        { id: "act-c21", task: "Focus on clean, single-ingredient whole proteins today", completed: false, category: "nutrition", pointsValue: 10 }
      );
    }
    if (selectedGoals.includes("Build More Muscle") || selectedGoals.includes("Gain Dynamic Muscle Mass") || selectedGoals.includes("Look More Athletic")) {
      customizedActions.push(
        { id: "act-c22", task: "Perform 3 targeting sets of physical silhouette lifts", completed: false, category: "training", pointsValue: 15 },
        { id: "act-c23", task: "High-protein recovery snack directly after lifting check", completed: false, category: "nutrition", pointsValue: 15 },
        { id: "act-c24", task: "Target 8 hours of sleep tonight to maximize physical recovery", completed: false, category: "lifestyle", pointsValue: 10 }
      );
    }

    if (customizedActions.length === 0) {
      customizedActions = [
        { id: "act-c1", task: "Perform simple aesthetic outline stretches", completed: false, category: "training", pointsValue: 15 },
        { id: "act-c2", task: "Sustain consistent tall stature alignment throughout the afternoon", completed: false, category: "lifestyle", pointsValue: 10 },
        { id: "act-c3", task: "Hydrate with at least 8 glasses of pure, clean water", completed: false, category: "nutrition", pointsValue: 15 }
      ];
    } else {
      // Deduplicate and limit to 3 items
      const uniqueActions: any[] = [];
      const seen = new Set();
      customizedActions.forEach(act => {
        if (!seen.has(act.task)) {
          seen.add(act.task);
          uniqueActions.push({
            ...act,
            id: `act-comb-${uniqueActions.length}-${Date.now()}`
          });
        }
      });
      customizedActions = uniqueActions.slice(0, 3);
    }

    const totalHeightInches = (qHeightFeet * 12) + qHeightInches;
    
    // Determine a reasonable starting archetype depending on level and stats
    let predictedCurrentArchetype: ArchetypeType = "Foundation Builder";
    if (selectedLevel === "Advanced") {
      predictedCurrentArchetype = "Athletic Builder";
    } else if (selectedLevel === "Intermediate") {
      predictedCurrentArchetype = "Lean Frame";
    }

    const finalizedProfile: UserProfile = {
      ...pendingProfile,
      currentArchetype: predictedCurrentArchetype,
      targetArchetype: selectedTargetArchetype,
      weightLbs: qWeight,
      heightInches: totalHeightInches,
      bodyFatPercentage: biologicalSex === "Female" ? 22.0 : 15.0,
      goal: selectedGoal,
      level: selectedLevel,
      biologicalSex: biologicalSex,
      actionsList: customizedActions,
      momentum: {
        streak: 1,
        consistencyPercentage: 100,
        lastCheckInDate: new Date().toISOString().split("T")[0],
        aestheticScore: 65,
        totalWorkoutsLog: 0
      }
    };

    const savedAccounts = getExistingAccounts();
    const index = savedAccounts.findIndex(a => a.name.toLowerCase() === finalizedProfile.name.toLowerCase());
    
    let updatedAccounts = [...savedAccounts];
    if (index !== -1) {
      updatedAccounts[index] = finalizedProfile;
    } else {
      updatedAccounts.push(finalizedProfile);
    }
    localStorage.setItem("arcform_user_accounts", JSON.stringify(updatedAccounts));

    setSuccessMsg("Setup complete! Opening dashboard...");
    setTimeout(() => {
      onSuccess(finalizedProfile);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#08090a] text-zinc-100 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
      
      {/* RICH GLOW OVERLAYS */}
      <div className="absolute w-[450px] h-[450px] rounded-full bg-amber-500/5 -top-32 -left-32 filter blur-[120px] pointer-events-none" />
      <div className="absolute w-[450px] h-[450px] rounded-full bg-yellow-400/5 -bottom-32 -right-32 filter blur-[120px] pointer-events-none" />

      {/* CORE LOGIN CARD BOX */}
      <div className="w-full max-w-sm bg-zinc-950/80 border border-zinc-900 rounded-3xl p-6 relative z-10 shadow-2xl glow-gold">
        
        {showQuestionnaire ? (
          <div className="space-y-5 animate-fade-in text-left">
            {/* Header with Step Tracker */}
            <div className="text-center space-y-2 mb-4">
              <span className="text-[10px] uppercase font-mono font-bold text-amber-500 tracking-widest bg-amber-500/10 px-2.5 py-1 rounded-full">
                Step {qStep} of 3: {qStep === 1 ? "Bio & Stats" : qStep === 2 ? "Aesthetic Focus" : "Target Silhouette"}
              </span>
              <h2 className="text-lg md:text-xl font-display font-black text-white mt-1">
                {qStep === 1 ? "Your Profile Frame" : qStep === 2 ? "Tailored Appearance Goal" : "Target Visual Style"}
              </h2>
              <p className="text-[11px] text-zinc-400">
                {qStep === 1 ? "Define your biological stature and fitness experience." : qStep === 2 ? "Select your targeted aesthetic focal points." : "Choose your desired visual outline ratio."}
              </p>
            </div>

            {successMsg && (
              <div className="bg-emerald-950/40 border border-emerald-500/20 text-emerald-400 rounded-xl p-3 text-xs flex items-center gap-2 mb-4 animate-pulse">
                <CheckCircle className="w-4 h-4" /> {successMsg}
              </div>
            )}

            {/* STEP 1: BIO & PHYSICAL STATS */}
            {qStep === 1 && (
              <div className="space-y-4">
                {/* Sex Option */}
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block">
                    Biological Perspective / Category
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(["Male", "Female", "Prefer Not to Say"] as const).map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => selectBiologicalSex(s)}
                        className={`py-2 px-1 rounded-xl border text-center text-xs font-semibold transition-all cursor-pointer select-none leading-tight ${
                          biologicalSex === s
                            ? "bg-amber-500 text-black border-amber-400 font-black shadow-md"
                            : "bg-zinc-900/60 border-zinc-900 text-zinc-400 hover:border-zinc-850"
                        }`}
                      >
                        {s === "Prefer Not to Say" ? "Other" : s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Weight & Height Slider / Numbers */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1 col-span-1">
                    <label className="text-[10px] text-zinc-400 uppercase font-bold block">Height (ft)</label>
                    <select
                      value={qHeightFeet}
                      onChange={(e) => setQHeightFeet(Number(e.target.value))}
                      className="w-full bg-zinc-900 border border-zinc-850 text-xs rounded-xl p-2.5 outline-none focus:border-amber-500 text-zinc-100 font-mono"
                    >
                      {[4, 5, 6, 7].map((f) => (
                        <option key={f} value={f}>{f} ft</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1 col-span-1">
                    <label className="text-[10px] text-zinc-400 uppercase font-bold block">Height (in)</label>
                    <select
                      value={qHeightInches}
                      onChange={(e) => setQHeightInches(Number(e.target.value))}
                      className="w-full bg-zinc-900 border border-zinc-850 text-xs rounded-xl p-2.5 outline-none focus:border-amber-500 text-zinc-100 font-mono"
                    >
                      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => (
                        <option key={i} value={i}>{i} in</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1 col-span-1">
                    <label className="text-[10px] text-zinc-400 uppercase font-bold block">Weight (lbs)</label>
                    <input
                      type="number"
                      required
                      min={70}
                      max={400}
                      value={qWeight}
                      onChange={(e) => setQWeight(Number(e.target.value))}
                      className="w-full bg-zinc-900 border border-zinc-850 text-xs rounded-xl p-2.5 outline-none focus:border-amber-500 text-zinc-100 font-mono text-center"
                    />
                  </div>
                </div>

                {/* Experience Levels */}
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block">
                    Your Lifter Level or Stage
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { id: "Beginner", label: "Beginner", desc: "Just starting" },
                      { id: "Intermediate", label: "Medium", desc: "Some reps" },
                      { id: "Advanced", label: "Expert", desc: "Lifting years" }
                    ].map((l) => (
                      <button
                        key={l.id}
                        type="button"
                        onClick={() => setSelectedLevel(l.id)}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer select-none ${
                          selectedLevel === l.id
                            ? "bg-amber-950/40 border-amber-500/60 text-white shadow-md"
                            : "bg-zinc-900/40 border-zinc-900 text-zinc-400 hover:border-zinc-800"
                        }`}
                      >
                        <span className="font-bold text-xs block text-white">{l.label}</span>
                        <span className="text-[8px] mt-0.5 text-zinc-500 block leading-none">{l.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setQStep(2)}
                  className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 text-zinc-950 hover:brightness-110 active:scale-95 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 mt-2 shadow-lg cursor-pointer select-none"
                >
                  <span>Continue to Goals</span>
                  <ArrowRight className="w-3.5 h-3.5 text-zinc-950" />
                </button>
              </div>
            )}

            {/* STEP 2: DYNAMICALLY TAILORED BIOLOGICAL GOALS */}
            {qStep === 2 && (
              <div className="space-y-4">
                <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block">
                  Select your visual posture focus (pick multiple if you'd like):
                </label>
                <div className="space-y-1.5 max-h-[280px] overflow-y-auto pr-1">
                  {/* Provide Male Options */}
                  {biologicalSex === "Male" && [
                    { id: "Build Wider Shoulders", label: "Build Wider Shoulders", desc: "Build wider shoulders and a broader upper-body visual frame" },
                    { id: "Improve Back Width", label: "Improve Back Width", desc: "Widen upper back width to make your waist look naturally smaller" },
                    { id: "Bring Up Upper Chest", label: "Bring Up Upper Chest", desc: "Fill out the upper-chest area to look taller and more athletic" },
                    { id: "Tighten Waist", label: "Tighten Waist", desc: "Tighten your waist outline to make your midsection look narrower" },
                    { id: "Improve Posture", label: "Improve Posture", desc: "Pull rounded shoulders back instantly" }
                  ].map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => toggleGoal(g.id)}
                      className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer select-none gap-2 ${
                        selectedGoals.includes(g.id)
                          ? "bg-amber-950/30 border-amber-500/60 text-white shadow-sm shadow-amber-500/5 font-semibold"
                          : "bg-zinc-900/40 border-zinc-900 text-zinc-400 hover:border-zinc-850"
                      }`}
                    >
                      <div className="flex-1">
                        <span className="font-semibold text-xs block text-white">{g.label}</span>
                        <span className="text-[9px] mt-0.5 text-zinc-500 block leading-tight">{g.desc}</span>
                      </div>
                      <div className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                        selectedGoals.includes(g.id)
                          ? "bg-amber-500 border-amber-400 text-neutral-950"
                          : "border-zinc-800 bg-zinc-900/60 text-transparent"
                      }`}>
                        <CheckCircle className="w-3.5 h-3.5 stroke-[3px]" />
                      </div>
                    </button>
                  ))}

                  {/* Provide Female Options */}
                  {biologicalSex === "Female" && [
                    { id: "Tighten Waist & Flat Tummy", label: "Tighten Waist & Flat Tummy", desc: "Keep midsection flat and optimize your front silhouette outline" },
                    { id: "Build Balanced Proportions", label: "Build Balanced Proportions", desc: "Align symmetric visual frame lines and legs" },
                    { id: "Improve Posture & Silhouette", label: "Improve Posture & Silhouette", desc: "Correct rounded computer neck and slump lines" },
                    { id: "Build Active Tone", label: "Build Active Tone", desc: "Get sleek muscle tone and physical definition" }
                  ].map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => toggleGoal(g.id)}
                      className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer select-none gap-2 ${
                        selectedGoals.includes(g.id)
                          ? "bg-amber-950/30 border-amber-500/60 text-white shadow-sm shadow-amber-500/5 font-semibold"
                          : "bg-zinc-900/40 border-zinc-900 text-zinc-400 hover:border-zinc-850"
                      }`}
                    >
                      <div className="flex-1">
                        <span className="font-semibold text-xs block text-white">{g.label}</span>
                        <span className="text-[9px] mt-0.5 text-zinc-500 block leading-tight">{g.desc}</span>
                      </div>
                      <div className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                        selectedGoals.includes(g.id)
                          ? "bg-amber-500 border-amber-400 text-neutral-950"
                          : "border-zinc-800 bg-zinc-900/60 text-transparent"
                      }`}>
                        <CheckCircle className="w-3.5 h-3.5 stroke-[3px]" />
                      </div>
                    </button>
                  ))}

                  {/* Provide Prefer Not to Say / Other Options */}
                  {biologicalSex === "Prefer Not to Say" && [
                    { id: "Look More Athletic", label: "Look More Athletic", desc: "Build wider shoulders and compress midsection" },
                    { id: "Improve Posture & Symmetry", label: "Improve Posture & Symmetry", desc: "Stand tall, align shoulders, pull lats wide" },
                    { id: "Get Leaner & Defined", label: "Chisel Down & Define", desc: "Keep body fat low and highlight outline contours" },
                    { id: "Gain Dynamic Muscle Mass", label: "Gain Dynamic Muscle Mass", desc: "Increase general visual density and lean frame size" }
                  ].map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => toggleGoal(g.id)}
                      className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer select-none gap-2 ${
                        selectedGoals.includes(g.id)
                          ? "bg-amber-950/30 border-amber-500/60 text-white shadow-sm shadow-amber-500/5 font-semibold"
                          : "bg-zinc-900/40 border-zinc-900 text-zinc-400 hover:border-zinc-850"
                      }`}
                    >
                      <div className="flex-1">
                        <span className="font-semibold text-xs block text-white">{g.label}</span>
                        <span className="text-[9px] mt-0.5 text-zinc-500 block leading-tight">{g.desc}</span>
                      </div>
                      <div className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                        selectedGoals.includes(g.id)
                          ? "bg-amber-500 border-amber-400 text-neutral-950"
                          : "border-zinc-800 bg-zinc-900/60 text-transparent"
                      }`}>
                        <CheckCircle className="w-3.5 h-3.5 stroke-[3px]" />
                      </div>
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setQStep(1)}
                    className="col-span-1 bg-zinc-900 text-zinc-400 hover:bg-zinc-850 hover:text-white py-2.5 px-3 rounded-xl text-xs font-semibold text-center transition-all cursor-pointer select-none border border-zinc-800"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setQStep(3)}
                    className="col-span-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-zinc-950 hover:brightness-110 py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer select-none"
                  >
                    <span>Target Shape</span>
                    <ArrowRight className="w-3.5 h-3.5 text-zinc-950" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: DESIRED POSTURE SILHOUETTE TARGET */}
            {qStep === 3 && (
              <form onSubmit={handleQuestionnaireSubmit} className="space-y-4">
                <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block">
                  Select your target physique shape:
                </label>
                <div className="space-y-1.5 max-h-[280px] overflow-y-auto pr-1">
                  {[
                    { id: "Athletic V-Taper", label: "Athletic V-Taper", desc: "Broad shoulders and tapered tight waist outline." },
                    { id: "Balanced Physique", label: "Balanced Physique", desc: "Even upper and lower symmetry, centered upright posture." },
                    { id: "Classic Aesthetic", label: "Classic Aesthetic", desc: "Golden-era aesthetic alignment and physical fullness." },
                    { id: "Lean Frame", label: "Lean Frame", desc: "Slim line posture framework with high visual muscle outline." },
                    { id: "Advanced Aesthetic", label: "Advanced Aesthetic", desc: "Full proportion ratios and pristine symmetry metrics." }
                  ].map((tier) => (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => setSelectedTargetArchetype(tier.id as ArchetypeType)}
                      className={`w-full p-2.5 rounded-xl border text-left transition-all block cursor-pointer select-none ${
                        selectedTargetArchetype === tier.id
                          ? "bg-amber-950/30 border-amber-500/60 text-white shadow-sm shadow-amber-500/5 animate-pulse"
                          : "bg-zinc-900/40 border-zinc-900 text-zinc-400 hover:border-zinc-850"
                      }`}
                    >
                      <span className="font-semibold text-xs block text-white">{tier.label}</span>
                      <span className="text-[9px] mt-0.5 text-zinc-500 block leading-tight">{tier.desc}</span>
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setQStep(2)}
                    className="col-span-1 bg-zinc-900 text-zinc-400 hover:bg-zinc-850 hover:text-white py-2.5 px-3 rounded-xl text-xs font-semibold text-center transition-all cursor-pointer select-none border border-zinc-800"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="col-span-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-zinc-950 hover:brightness-110 active:scale-95 py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/10 cursor-pointer select-none"
                  >
                    <span>Complete Setup</span>
                    <CheckCircle className="w-3.5 h-3.5 text-zinc-950" />
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : (
          <>
            {/* LOGO BRAND BAR */}
            <div className="text-center space-y-3 mb-6">
              <div className="inline-flex bg-gradient-to-r from-amber-500 to-yellow-500 p-3 rounded-2xl text-black font-extrabold shadow-lg shadow-amber-500/10 mb-1">
                <Zap className="w-5 h-5 text-zinc-950 fill-zinc-950" />
              </div>
              <div>
                <h1 className="text-xl font-display font-black tracking-tight text-white uppercase">ArcForm OS</h1>
                <p className="text-[10px] font-mono text-amber-500 tracking-wider uppercase mt-1">Carve Your Stone</p>
              </div>
            </div>

            {/* INSTANT SANDBOX DEMO CALL BOX */}
            <div className="mb-4 bg-gradient-to-br from-amber-500/10 via-yellow-500/5 to-transparent border border-amber-500/20 p-3.5 rounded-2xl text-center space-y-2">
              <div className="flex justify-center items-center gap-1.5 text-[9px] text-amber-400 font-bold tracking-widest uppercase">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-500/20 animate-pulse" />
                <span>Instant Access</span>
              </div>
              <p className="text-[11px] text-zinc-300 leading-normal">
                Test the simple snapshot checks and workout logging features immediately.
              </p>
              <button
                type="button"
                onClick={handleDemoLogin}
                className="w-full bg-gradient-to-r from-amber-500 to-yellow-400 text-zinc-950 hover:brightness-115 active:scale-[0.98] py-2 px-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-amber-500/5"
              >
                Start Free Demo
              </button>
            </div>

            {/* FEEDBACK MSG OVERLAYS */}
            {errorMsg && (
              <div className="bg-red-950/40 border border-red-500/20 text-red-400 rounded-xl p-2.5 text-xs flex items-center gap-2 mb-3">
                <span className="font-bold">Error:</span> {errorMsg}
              </div>
            )}

            {successMsg && (
              <div className="bg-emerald-950/40 border border-emerald-500/20 text-emerald-400 rounded-xl p-2.5 text-xs flex items-center gap-2 mb-3">
                <CheckCircle className="w-4 h-4" /> {successMsg}
              </div>
            )}

            {/* ACCOUNT TAB ACCORDION FOR INTERACTIVE SELECTION */}
            <div className="flex bg-zinc-900/40 border border-zinc-900 rounded-xl p-1 mb-4">
              <button 
                onClick={() => { setAuthMode("login"); setErrorMsg(""); }}
                className={`flex-1 text-center py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  authMode === "login" ? "bg-amber-500 text-black shadow-md font-bold" : "text-zinc-400 hover:text-white"
                }`}
              >
                Sign In
              </button>
              <button 
                onClick={() => { setAuthMode("register"); setErrorMsg(""); }}
                className={`flex-1 text-center py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  authMode === "register" ? "bg-amber-500 text-black shadow-md font-bold" : "text-zinc-400 hover:text-white"
                }`}
              >
                Create Account
              </button>
            </div>

            {/* MAIN DYNAMIC FORM */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              
              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold text-zinc-400 tracking-wider block">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-3.5 h-3.5 text-zinc-500" />
                  <input 
                    type="email" 
                    required
                    placeholder="name@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-zinc-900/60 border border-zinc-850 rounded-xl p-2.5 pl-9 text-xs text-white outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold text-zinc-400 tracking-wider block">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 w-3.5 h-3.5 text-zinc-500" />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    required
                    placeholder="••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-zinc-900/60 border border-zinc-850 rounded-xl p-2.5 pl-9 pr-9 text-xs text-white outline-none focus:border-amber-500 transition-colors"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-zinc-500 hover:text-zinc-300"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 text-zinc-950 hover:opacity-95 active:scale-95 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 mt-1 shadow-lg shadow-amber-500/10 cursor-pointer"
              >
                <span>{authMode === "login" ? "Sign In" : "Sign Up"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </>
        )}

      </div>

    </div>
  );
}
