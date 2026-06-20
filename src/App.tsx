import React, { useState, useEffect } from "react";
import { 
  Flame, 
  Layout, 
  Sparkles, 
  Award, 
  Dumbbell, 
  Compass, 
  Zap, 
  Users,
  Target,
  Smartphone,
  Settings,
  LogOut,
  Shield,
  History
} from "lucide-react";
import { INITIAL_USER_PROFILE } from "./data";
import { UserProfile, PhysiqueScanResult, WorkoutLog } from "./types";
import Dashboard, { getWorkoutGrade } from "./components/Dashboard";
import WorkoutLogger from "./components/WorkoutLogger";
import AccountSettings from "./components/AccountSettings";
import AccountAuth from "./components/AccountAuth";
import GoldConfetti from "./components/GoldConfetti";
import ProgressHub from "./components/ProgressHub";

export default function App() {
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem("arcform_current_active_profile_v2");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_USER_PROFILE;
      }
    }
    return INITIAL_USER_PROFILE;
  });
  const [activeTab, setActiveTab] = useState<string>("blueprint");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem("arcform_session_authenticated") === "true";
  });
  const [confettiActive, setConfettiActive] = useState<boolean>(false);
  const [confettiMessage, setConfettiMessage] = useState<string>("");
  const [showConfettiOverlay, setShowConfettiOverlay] = useState<boolean>(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState<boolean>(false);

  const triggerConfetti = (message: string, withRain: boolean = true) => {
    setConfettiMessage(message);
    if (withRain) {
      setConfettiActive(true);
    }
    setShowConfettiOverlay(true);
    const timeout = setTimeout(() => {
      setShowConfettiOverlay(false);
    }, 4500);
  };

  // Sync profile to local storage for persistence active state
  useEffect(() => {
    if (isAuthenticated && profile && profile.name) {
      localStorage.setItem("arcform_current_active_profile_v2", JSON.stringify(profile));
    }
  }, [profile, isAuthenticated]);

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("arcform_session_authenticated");
    localStorage.removeItem("arcform_current_active_profile_v2");
  };

  if (!isAuthenticated) {
    return (
      <AccountAuth 
        onSuccess={(loggedProfile) => {
          setProfile(loggedProfile);
          setIsAuthenticated(true);
          localStorage.setItem("arcform_session_authenticated", "true");
          localStorage.setItem("arcform_current_active_profile_v2", JSON.stringify(loggedProfile));
          // Highlight login or register activation with mini golden celebration
          triggerConfetti(`Symmetry Room unlocked! Welcome.`, false);
        }} 
      />
    );
  }

  // Handle action item checkboxes (Daily Adherence Protocol)
  const handleToggleAction = (actionId: string) => {
    let completedAllGoals = false;
    
    setProfile(prev => {
      const allDoneBefore = prev.actionsList.length > 0 && prev.actionsList.every(act => act.completed);
      
      const updatedActions = prev.actionsList.map(act => {
        if (act.id === actionId) {
          const nextCompletedState = !act.completed;
          return { ...act, completed: nextCompletedState };
        }
        return act;
      });

      const allDoneAfter = updatedActions.length > 0 && updatedActions.every(act => act.completed);
      
      if (!allDoneBefore && allDoneAfter) {
        completedAllGoals = true;
      }

      // Recalculate momentum: each action toggled adds or subtracts its value from the aestheticScore
      const pointsDiff = updatedActions.reduce((total, act) => {
        if (act.completed) {
          return total + act.pointsValue;
        }
        return total;
      }, 0);

      // Base momentum starting point from general consistency levels
      const baseScore = Math.min(100, Math.max(20, 50 + pointsDiff));

      const histItem = {
        id: `h-act-${Date.now()}`,
        date: new Date().toISOString().split("T")[0],
        score: baseScore,
        source: "Protocol Check"
      };
      const oldHistory = prev.aestheticHistory || [];
      const newHistory = [...oldHistory, histItem].slice(-20);

      return {
        ...prev,
        actionsList: updatedActions,
        momentum: {
          ...prev.momentum,
          aestheticScore: baseScore
        },
        aestheticHistory: newHistory
      };
    });

    if (completedAllGoals) {
      triggerConfetti("Daily Adherence Protocol: 100% Perfect Habit Target Mastered!");
    }
  };

  // Add aesthetic workout sets log and bump momentum score
  const handleAddWorkout = (workout: Omit<WorkoutLog, "id" | "date">) => {
    const newLog: WorkoutLog = {
      ...workout,
      id: `w-${Date.now()}`,
      date: new Date().toISOString().split("T")[0]
    };

    const grade = getWorkoutGrade(workout.setsCompleted, workout.effortRating);
    if (grade === "A+") {
      triggerConfetti("Peak Mechanics! Ultimate 'A+' Session Grade Achieved!");
    } else {
      // Any other grade is a standard success but A+ gets super gold treatment. 
      // Let's still celebrate any logged session as a general completed physical goal!
      triggerConfetti(`Training Target Recorded: Grade ${grade} Session logged!`, false);
    }

    setProfile(prev => {
      // Create momentum bump
      const currentStreak = prev.momentum.streak + 1;
      const currentTotalLogs = prev.momentum.totalWorkoutsLog + 1;
      const aestheticBump = Math.min(100, prev.momentum.aestheticScore + 5);

      const histItem = {
        id: `h-work-${Date.now()}`,
        date: new Date().toISOString().split("T")[0],
        score: aestheticBump,
        source: "Workout Logged"
      };
      const oldHistory = prev.aestheticHistory || [];
      const newHistory = [...oldHistory, histItem].slice(-20);

      const finalLog: WorkoutLog = {
        ...newLog,
        aestheticScoreAtLog: aestheticBump
      };

      return {
        ...prev,
        momentum: {
          ...prev.momentum,
          streak: currentStreak,
          totalWorkoutsLog: currentTotalLogs,
          aestheticScore: aestheticBump
        },
        workoutHistory: [finalLog, ...prev.workoutHistory],
        aestheticHistory: newHistory
      };
    });
  };

  // Integrate results from mult-modal vision scanner
  const handleScanAnalysisSuccess = (result: PhysiqueScanResult) => {
    triggerConfetti(`Target Shape Identified: ${result.archetype}!`);
    setProfile(prev => {
      // Incorporate scan results as the top analysis scan entry
      const updatedScans = [result, ...prev.scansList];
      
      // Update action items directly reflecting targets specified by model appraisal
      // for optimal visual focus coupling!
      const newActions = result.nextActions.map((act, index) => ({
        id: `scan-act-${index}-${Date.now()}`,
        task: act,
        completed: false,
        category: "training" as const,
        pointsValue: 15
      }));

      const newScore = Math.min(100, prev.momentum.aestheticScore + 10);
      const histItem = {
        id: `h-scan-${Date.now()}`,
        date: new Date().toISOString().split("T")[0],
        score: newScore,
        source: "Physique Scan"
      };
      const oldHistory = prev.aestheticHistory || [];
      const newHistory = [...oldHistory, histItem].slice(-20);

      return {
        ...prev,
        currentArchetype: result.archetype,
        targetArchetype: result.targetArchetype,
        scansList: updatedScans,
        actionsList: [...newActions, ...prev.actionsList.slice(3)], // rotate daily check list targets
        momentum: {
          ...prev.momentum,
          aestheticScore: newScore
        },
        aestheticHistory: newHistory
      };
    });
  };

  return (
    <div className="min-h-screen text-zinc-100 flex flex-col md:flex-row relative">
      
      {/* GLOW DECORATIONS */}
      <div className="glow-backdrop w-80 h-80 bg-amber-500/5 top-20 left-20" />
      <div className="glow-backdrop w-80 h-80 bg-yellow-500/5 bottom-20 right-20" />

      {/* SIDEBAR NAVIGATION - DESKTOP */}
      <aside className="hidden md:flex flex-col justify-between w-64 bg-zinc-950/80 border-r border-zinc-900 p-6 z-10 sticky top-0 h-screen shrink-0">
        <div className="space-y-8">
          
          {/* BRAND LABEL */}
          <div className="flex items-center gap-2.5">
            <div className="bg-gradient-to-r from-amber-500 to-yellow-500 p-2 rounded-xl text-black font-extrabold flex items-center justify-center shadow-lg shadow-amber-550/15">
              <Zap className="w-5 h-5 text-zinc-950 fill-zinc-950" />
            </div>
            <div>
              <h2 className="text-xl font-display font-black tracking-tight text-white leading-none">ArcForm</h2>
              <span className="text-[9px] font-mono text-amber-400 uppercase tracking-widest leading-none mt-1 block">Carve Your Stone</span>
            </div>
          </div>

          {/* ACTIVE BIO SUMMARY */}
          <div className="bg-gray-900/55 p-3.5 rounded-xl border border-gray-800/60 text-xs text-zinc-300 flex items-center justify-between">
            <div>
              <span className="text-[9px] font-mono text-zinc-500 block uppercase">Estimated State</span>
              <span className="font-semibold">{profile.currentArchetype}</span>
            </div>
            <div className="text-right">
              <span className="text-[9px] font-mono text-emerald-500 block">▲ LEVEL {profile.scansList.length > 0 ? 3 : 2}</span>
            </div>
          </div>

          {/* MENU LINK LIST */}
          <nav className="space-y-1.5">
            <button 
              onClick={() => setActiveTab("blueprint")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all ${
                activeTab === "blueprint"
                  ? "bg-zinc-900 text-white border border-zinc-800"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-900/40"
              }`}
            >
              <Layout className="w-4 h-4 text-amber-400" />
              <span>Blueprint</span>
            </button>

            <button 
              onClick={() => setActiveTab("workout")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all ${
                activeTab === "workout"
                  ? "bg-zinc-900 text-white border border-zinc-800"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-900/40"
              }`}
            >
              <Dumbbell className="w-4 h-4 text-amber-400" />
              <span>Workout</span>
            </button>

            <button 
              onClick={() => setActiveTab("progress")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all ${
                activeTab === "progress"
                  ? "bg-zinc-900 text-white border border-zinc-800"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-900/40"
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Progress</span>
            </button>

            <button 
              onClick={() => setActiveTab("profile")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all ${
                activeTab === "profile"
                  ? "bg-zinc-900 text-white border border-zinc-800"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-900/40"
              }`}
            >
              <Settings className="w-4 h-4 text-amber-400" />
              <span>Profile</span>
            </button>
          </nav>
        </div>

        {/* COMPRESSION DETAILS */}
        <div className="space-y-3">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-dashed border-zinc-900 hover:border-red-500/20 text-zinc-500 hover:text-red-400 rounded-xl text-[10px] font-semibold uppercase tracking-wider transition-all"
          >
            <LogOut className="w-3.5 h-3.5 shrink-0 text-red-500/80" />
            <span>Sign Out Session</span>
          </button>

          <div className="flex items-center gap-2 bg-amber-950/20 border border-amber-500/10 p-3 rounded-xl">
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0" />
            <div className="text-[10px] leading-tight text-amber-400">
              <span className="font-bold block uppercase">Ascension Streak</span>
              {profile.momentum.streak} days active
            </div>
          </div>
          
          <button
            onClick={() => setShowPrivacyModal(true)}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 text-[10px] text-zinc-500 hover:text-amber-400 font-mono transition-colors border border-transparent hover:border-zinc-900/40 rounded-lg cursor-pointer"
          >
            <Shield className="w-3.5 h-3.5 text-amber-500/80" />
            <span>Your Privacy</span>
          </button>

          <div className="text-[10px] text-zinc-600 text-center leading-normal">
            ArcForm Operating System<br />
            v1.10.4 • Premium Build
          </div>
        </div>
      </aside>

      {/* MOBILE HEADER BAR */}
      <header className="md:hidden sticky top-0 inset-x-0 bg-zinc-950/95 border-b border-zinc-900 px-4 py-3.5 flex justify-between items-center z-50 backdrop-blur">
        <div className="flex items-center gap-2">
          <div className="bg-amber-500 p-1.5 rounded-lg text-black font-extrabold flex items-center justify-center">
            <Zap className="w-4 h-4 text-zinc-950 fill-zinc-950" />
          </div>
          <div>
            <h1 className="text-base font-display font-black text-white leading-none">ArcForm</h1>
            <span className="text-[8px] font-mono text-amber-400 block leading-none mt-0.5 uppercase tracking-widest">Carve Your Stone</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-amber-950/50 border border-amber-500/20 px-2.5 py-1 rounded-full text-amber-400 font-mono text-xs leading-none">
            <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>{profile.momentum.streak}d</span>
          </div>
          <div className="bg-gray-900 border border-gray-800 px-2 py-1 rounded-full text-[10px] font-mono text-zinc-400 leading-none">
            AESTHETIC {profile.momentum.aestheticScore}
          </div>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-4 md:p-8 lg:p-10 pb-24 md:pb-8 z-10 max-w-7xl mx-auto w-full">
        {activeTab === "blueprint" && (
          <Dashboard 
            profile={profile} 
            toggleAction={handleToggleAction} 
            setActiveTab={setActiveTab}
            onUpdateProfile={(updated) => setProfile(updated)}
          />
        )}
        {activeTab === "progress" && (
          <ProgressHub 
            profile={profile} 
            onAnalysisSuccess={handleScanAnalysisSuccess}
          />
        )}
        {activeTab === "workout" && (
          <WorkoutLogger 
            profile={profile} 
            onAddWorkout={handleAddWorkout}
          />
        )}
        {activeTab === "profile" && (
          <AccountSettings 
            currentProfile={profile} 
            onUpdateProfile={(updated) => setProfile(updated)}
            onLogout={handleLogout}
          />
        )}
      </main>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-zinc-950/95 border-t border-zinc-900 py-2 px-1 flex justify-around items-center z-50 backdrop-blur">
        <button 
          onClick={() => setActiveTab("blueprint")}
          className={`flex flex-col items-center justify-center gap-0.5 transition-colors ${
            activeTab === "blueprint" ? "text-amber-500" : "text-zinc-500"
          }`}
        >
          <Layout className="w-4 h-4" />
          <span className="text-[8px] font-mono uppercase tracking-wider">Blueprint</span>
        </button>

        <button 
          onClick={() => setActiveTab("workout")}
          className={`flex flex-col items-center justify-center gap-0.5 transition-colors ${
            activeTab === "workout" ? "text-amber-500" : "text-zinc-500"
          }`}
        >
          <Dumbbell className="w-4 h-4" />
          <span className="text-[8px] font-mono uppercase tracking-wider">Workout</span>
        </button>

        <button 
          onClick={() => setActiveTab("progress")}
          className={`flex flex-col items-center justify-center gap-0.5 transition-colors ${
            activeTab === "progress" ? "text-amber-500" : "text-zinc-500"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span className="text-[8px] font-mono uppercase tracking-wider">Progress</span>
        </button>

        <button 
          onClick={() => setActiveTab("profile")}
          className={`flex flex-col items-center justify-center gap-0.5 transition-colors ${
            activeTab === "profile" ? "text-amber-500" : "text-zinc-500"
          }`}
        >
          <Settings className="w-4 h-4" />
          <span className="text-[8px] uppercase tracking-wider">Profile</span>
        </button>
      </nav>

      {/* GOLD CONFETTI BURST */}
      <GoldConfetti active={confettiActive} onComplete={() => setConfettiActive(false)} />

      {/* FLOATING SUCCESS GOLDEN ALERT */}
      {showConfettiOverlay && (
        <div id="goal-success-toast" className="fixed top-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-500 p-[1px] rounded-2xl shadow-2xl shadow-yellow-500/30 max-w-sm w-[90%] font-sans transition-all">
          <div className="bg-zinc-950 p-4 rounded-2xl flex items-center gap-3">
            <div className="bg-amber-500/10 p-2 rounded-xl text-amber-400 shrink-0">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-[9px] font-mono font-black uppercase tracking-widest text-amber-500 block">METRIC UNLOCKED</span>
              <span className="text-xs text-white font-bold">{confettiMessage}</span>
            </div>
          </div>
        </div>
      )}

      {/* YOUR PRIVACY MODAL */}
      {showPrivacyModal && (
        <div id="privacy-policy-modal" className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4 transition-all animate-fade-in">
          <div className="bg-zinc-950 border border-amber-500/35 rounded-3xl w-full max-w-lg overflow-hidden relative shadow-2xl shadow-amber-500/5 max-h-[85vh] flex flex-col">
            
            {/* Header */}
            <div className="p-6 border-b border-zinc-900 bg-zinc-900/30 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2.5">
                <Shield className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="text-sm font-mono uppercase font-black text-white tracking-widest leading-none">ArcForm Privacy Policy</h3>
                  <span className="text-[9px] font-mono text-amber-500/80 uppercase tracking-widest block mt-1">Your Privacy</span>
                </div>
              </div>
              <button 
                onClick={() => setShowPrivacyModal(false)}
                className="text-zinc-400 hover:text-white font-mono text-xs px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-850 cursor-pointer border border-zinc-900 transition-all"
              >
                CLOSE
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-6 overflow-y-auto space-y-6 text-zinc-300 text-xs leading-relaxed font-sans">
              <div className="bg-amber-500/5 border border-amber-500/20 p-4 rounded-xl space-y-2">
                <h4 className="text-amber-400 font-bold uppercase font-mono tracking-wider text-[11px] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  Your photos stay on your device.
                </h4>
                <p className="text-zinc-400 text-[11px] leading-relaxed">
                  We don't upload your pictures to any server. Front-camera alignment and posture scanning run 100% locally on your browser. Your scans are eyes-only and totally safe.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase block tracking-wider">1. PHYSIQUE SCANS</span>
                  <p className="text-zinc-400">
                    Visual alignment calculations are computed directly on your phone or laptop. Nothing goes to the cloud. Your camera feed is private to you and never shared.
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase block tracking-wider">2. ZERO TRACKERS</span>
                  <p className="text-zinc-400">
                    There are no marketing pixels, Google tracking codes, or commercial advertising track scripts. Your daily reps, workouts, and progress indicators are not tracked or sold.
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase block tracking-wider">3. CLEAR DATA ANYTIME</span>
                  <p className="text-zinc-400">
                    You have full control. Go to the Settings tab at any time to wipe your entire history and account with a single click. There are no recovery backups kept on our end once deleted.
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase block tracking-wider">4. PRIVATE & SECURE</span>
                  <p className="text-zinc-400">
                    We prioritize safe, secure client-side storage so you can build your physique with peace of mind. Your layout options, goals, and history weights remain strictly confidential on your own machine.
                  </p>
                </div>
              </div>

              <div className="border-t border-zinc-900 pt-4 text-center text-[10px] text-zinc-500 font-mono">
                ArcForm Privacy Policy • Updated May 31, 2026
              </div>
            </div>

            {/* Footer button */}
            <div className="p-4 bg-zinc-900/10 border-t border-zinc-900 text-center shrink-0">
              <button 
                onClick={() => setShowPrivacyModal(false)}
                className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:brightness-110 active:scale-[0.99] text-zinc-950 font-bold py-2 px-4 rounded-xl font-mono text-xs uppercase tracking-wider transition-all cursor-pointer"
              >
                Accept & Go To Workout
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
