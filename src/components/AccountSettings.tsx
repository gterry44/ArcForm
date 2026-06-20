import React, { useState, useEffect } from "react";
import { 
  User, 
  Settings, 
  Sparkles, 
  Lock, 
  Mail, 
  ArrowRight, 
  RotateCcw, 
  Check, 
  AlertCircle, 
  Database, 
  FileText, 
  Apple, 
  Play, 
  Layers, 
  Eye, 
  Trash2,
  ChevronRight,
  LogOut,
  Sliders,
  DollarSign,
  Heart
} from "lucide-react";
import { UserProfile, ArchetypeType } from "../types";
import { INITIAL_USER_PROFILE } from "../data";

interface AccountSettingsProps {
  currentProfile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  onLogout: () => void;
}

export default function AccountSettings({ currentProfile, onUpdateProfile, onLogout }: AccountSettingsProps) {
  // Account List state loaded from localStorage
  const [accounts, setAccounts] = useState<UserProfile[]>([]);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  
  // Registration Inputs
  const [regName, setRegName] = useState("");
  const [regWeight, setRegWeight] = useState(165);
  const [regHeight, setRegHeight] = useState(70);
  const [regBodyFat, setRegBodyFat] = useState(14.5);
  const [regArchetype, setRegArchetype] = useState<ArchetypeType>("Foundation Builder");
  const [regTarget, setRegTarget] = useState<ArchetypeType>("Athletic V-Taper");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // App Settings Configuration State
  const [weightUnit, setWeightUnit] = useState<"lbs" | "kg">("lbs");
  const [hapticSim, setHapticSim] = useState(true);
  const [ambientGlow, setAmbientGlow] = useState(true);
  const [goldGradients, setGoldGradients] = useState(true);
  const [backupKey, setBackupKey] = useState("arcform_secure_backup_2026");

  // Load registered accounts
  useEffect(() => {
    const saved = localStorage.getItem("arcform_user_accounts");
    if (saved) {
      try {
        setAccounts(JSON.parse(saved));
      } catch (e) {
        // Fallback
        setAccounts([currentProfile]);
      }
    } else {
      const initialList = [currentProfile];
      localStorage.setItem("arcform_user_accounts", JSON.stringify(initialList));
      setAccounts(initialList);
    }
  }, [currentProfile]);

  // Handle Switch account
  const handleSwitchAccount = (emailOrName: string) => {
    const found = accounts.find(a => a.name === emailOrName);
    if (found) {
      onUpdateProfile(found);
      setSuccessMsg(`Switched to active profile: ${found.name}`);
      setTimeout(() => setSuccessMsg(""), 3000);
    }
  };

  // Handle Register a new account
  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim()) {
      setErrorMessage("Please enter an account display name or email");
      return;
    }

    // Check conflict
    const exist = accounts.some(a => a.name.toLowerCase() === regName.toLowerCase());
    if (exist) {
      setErrorMessage("An account with that name already exists");
      return;
    }

    // Create a new customized physique user profile
    const newAccount: UserProfile = {
      name: regName.trim(),
      currentArchetype: regArchetype,
      targetArchetype: regTarget,
      weightLbs: regWeight,
      heightInches: regHeight,
      bodyFatPercentage: regBodyFat,
      momentum: {
        streak: 1,
        consistencyPercentage: 100,
        lastCheckInDate: new Date().toISOString().split("T")[0],
        aestheticScore: 65,
        totalWorkoutsLog: 0
      },
      scansList: [
        {
          archetype: regArchetype,
          targetArchetype: regTarget,
          strengths: ["Clean symmetry framework", "Favorable rib structure"],
          weaknesses: ["Shoulders have room for broader development"],
          opportunities: ["Increase upper body width and posture"],
          highestLeverageImprovements: ["Heavy pull-ups", "Stomach drawing-in exercises for waist design"],
          workoutFocus: "Shoulder width and narrow waist proportions",
          dailyFocus: "Shoulder raises 4 x 15 reps, stomach drawing-in exercises 3 x 30s",
          nextActions: [
            "Perform dumbbell shoulder raises",
            "Maintain body fat below the 15% threshold",
            "Track daily sets completed"
          ],
          scannedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
        }
      ],
      actionsList: [
        { id: `reg-a1`, task: "Perform dumbbell shoulder raises for wider shoulders", completed: false, category: "training", pointsValue: 15 },
        { id: `reg-a2`, task: "Maintain healthy portions to keep waist tight", completed: false, category: "nutrition", pointsValue: 15 },
        { id: `reg-a3`, task: "Complete 10 focused shoulder and back sets", completed: false, category: "training", pointsValue: 15 }
      ],
      workoutHistory: []
    };

    const updated = [...accounts, newAccount];
    setAccounts(updated);
    localStorage.setItem("arcform_user_accounts", JSON.stringify(updated));
    onUpdateProfile(newAccount);

    setSuccessMsg(`Account "${regName}" created! Booting layout.`);
    setRegName("");
    setIsRegisterMode(false);
    setErrorMessage("");
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  // Delete an account from list
  const handleDeleteAccount = (nameToDelete: string, e: React.MouseEvent) => {
    e.stopPropagation();

    const filtered = accounts.filter(a => a.name !== nameToDelete);
    setAccounts(filtered);
    localStorage.setItem("arcform_user_accounts", JSON.stringify(filtered));

    if (currentProfile.name === nameToDelete) {
      if (filtered.length > 0) {
        onUpdateProfile(filtered[0]);
      } else {
        onLogout();
      }
    }
    setSuccessMsg("Account deleted successfully");
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  // Convert current weight representation matching settings toggle (lbs to kg)
  const displayWeight = (lbsValue: number) => {
    if (weightUnit === "kg") {
      return `${Math.round(lbsValue * 0.453592)} kg`;
    }
    return `${lbsValue} lbs`;
  };

  // Convert current height representation (inches to cm)
  const displayHeight = (inchesValue: number) => {
    return `${Math.round(inchesValue * 2.54)} cm`;
  };

  const handlePurgeAll = () => {
    if (confirm("Reset everything? This will purge local database profiles immediately.")) {
      localStorage.clear();
      onUpdateProfile(INITIAL_USER_PROFILE);
      setSuccessMsg("Local data purged. Initialized to factory preset.");
      setTimeout(() => setSuccessMsg(""), 3000);
    }
  };

  return (
    <div id="settings-flow-wrapper" className="space-y-8 animate-fade-in text-zinc-100">
      
      {/* HEADER SECTION */}
      <div className="border-b border-gray-800/60 pb-6">
        <div className="flex items-center gap-2 text-xs font-mono text-amber-500 uppercase tracking-widest mb-1.5">
          <Settings className="w-4 h-4 text-amber-500" />
          Settings room
        </div>
        <h1 className="text-3xl font-display font-black text-white tracking-tight">
          System Settings & Accounts
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Switch between physical targets, manage athlete profiles, and customize your app options.
        </p>
      </div>

      {/* FEEDBACK LABELS */}
      {successMsg && (
        <div className="bg-emerald-950/40 border border-emerald-500/20 px-4 py-3 rounded-xl text-xs text-emerald-400 flex items-center gap-2 animate-pulse">
          <Check className="w-4 h-4" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMessage && (
        <div className="bg-red-950/40 border border-red-500/20 px-4 py-3 rounded-xl text-xs text-red-400 flex items-center gap-2 animate-pulse">
          <AlertCircle className="w-4 h-4" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* TWO COLUMN GRID LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* LEFT COLUMN (COLSPAN-3): ACCOUNTS SYSTEM */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* PROFILE CONTROL LIST */}
          <div className="glass-panel rounded-2xl p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-gray-850 pb-3">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
                  Registered Accounts ({accounts.length})
                </h3>
              </div>
              
              <button 
                onClick={() => setIsRegisterMode(!isRegisterMode)}
                className="text-xs bg-amber-500 text-black px-3 py-1.5 rounded-lg font-semibold hover:opacity-95 transition-opacity"
              >
                {isRegisterMode ? "Show Accounts List" : "+ Register New Account"}
              </button>
            </div>

            {/* REGISTER NEW PROFILE INTERACTIVE FORM */}
            {isRegisterMode ? (
              <form onSubmit={handleCreateAccount} className="space-y-4 p-4 bg-zinc-950/50 rounded-xl border border-zinc-900 animate-slide-up">
                <h4 className="text-xs font-semibold text-amber-400 uppercase tracking-widest">Submit New Profile Credentials</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-400 uppercase font-bold">Display Name / Email</label>
                    <input 
                      type="text" 
                      placeholder="e.g. athlete@arcform.com"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-850 text-xs rounded-lg p-2 outline-none focus:border-amber-500 text-zinc-100"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-400 uppercase font-bold">Current Calibrated Weight</label>
                    <input 
                      type="number" 
                      value={regWeight}
                      onChange={(e) => setRegWeight(Number(e.target.value))}
                      className="w-full bg-zinc-900 border border-zinc-850 text-xs rounded-lg p-2 outline-none focus:border-amber-500 text-zinc-100"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-400 uppercase font-bold">Base Stature (Inches)</label>
                    <input 
                      type="number" 
                      value={regHeight}
                      onChange={(e) => setRegHeight(Number(e.target.value))}
                      className="w-full bg-zinc-900 border border-zinc-850 text-xs rounded-lg p-2 outline-none focus:border-amber-500 text-zinc-100"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-400 uppercase font-bold">Body Fat Percentage (%)</label>
                    <input 
                      type="number" 
                      step="0.1" 
                      value={regBodyFat}
                      onChange={(e) => setRegBodyFat(Number(e.target.value))}
                      className="w-full bg-zinc-900 border border-zinc-850 text-xs rounded-lg p-2 outline-none focus:border-amber-500 text-zinc-100"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-400 uppercase font-bold">Initial Framework State</label>
                    <select 
                      value={regArchetype}
                      onChange={(e) => setRegArchetype(e.target.value as ArchetypeType)}
                      className="w-full bg-zinc-900 border border-zinc-850 text-xs rounded-lg p-2 outline-none focus:border-amber-500 text-zinc-100"
                    >
                      <option value="Foundation Builder">Foundation Builder</option>
                      <option value="Lean Frame">Lean Frame</option>
                      <option value="Athletic Builder">Athletic Builder</option>
                      <option value="Athletic V-Taper">Athletic V-Taper</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-400 uppercase font-bold">Target Structural Goal</label>
                    <select 
                      value={regTarget}
                      onChange={(e) => setRegTarget(e.target.value as ArchetypeType)}
                      className="w-full bg-zinc-900 border border-zinc-850 text-xs rounded-lg p-2 outline-none focus:border-amber-500 text-zinc-100"
                    >
                      <option value="Athletic V-Taper">Athletic V-Taper</option>
                      <option value="Balanced Physique">Balanced Physique</option>
                      <option value="Classic Aesthetic">Classic Aesthetic</option>
                      <option value="Advanced Aesthetic">Advanced Aesthetic</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsRegisterMode(false)}
                    className="px-3 py-1.5 text-xs text-zinc-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-4 py-1.5 text-xs font-semibold bg-amber-500 hover:opacity-90 text-black rounded-lg transition-opacity"
                  >
                    Initialize Account
                  </button>
                </div>
              </form>
            ) : (
              /* ACCOUNTS INSTANT SWITCH CARDS */
              <div className="space-y-2.5">
                {accounts.map((acc) => {
                  const isActive = acc.name === currentProfile.name;
                  return (
                    <div 
                      key={acc.name}
                      onClick={() => handleSwitchAccount(acc.name)}
                      className={`p-4 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                        isActive 
                          ? "bg-gradient-to-r from-amber-500/10 via-zinc-950 to-zinc-950 border-amber-500/40" 
                          : "bg-zinc-950/45 border-zinc-900 hover:border-zinc-800"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-lg border ${
                          isActive ? "bg-amber-500 text-black border-amber-400" : "bg-zinc-900 text-zinc-400 border-zinc-850"
                        }`}>
                          <User className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-semibold text-white">{acc.name}</span>
                            {isActive && (
                              <span className="bg-amber-500/15 text-amber-500 text-[8px] font-bold px-1.5 py-0.2 rounded uppercase">
                                Active Logged In
                              </span>
                            )}
                          </div>
                          <div className="flex gap-2 text-[10px] text-zinc-400 mt-1">
                            <span>{displayWeight(acc.weightLbs)}</span>
                            <span>•</span>
                            <span>{displayHeight(acc.heightInches)}</span>
                            <span>•</span>
                            <span className="text-amber-500 font-semibold">{acc.currentArchetype}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        {acc.name !== INITIAL_USER_PROFILE.name && (
                          <button 
                            onClick={(e) => handleDeleteAccount(acc.name, e)}
                            className="p-1 px-2 rounded hover:bg-red-950/30 hover:text-red-400 text-zinc-500 transition-colors"
                            title="Delete Account Data"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <ChevronRight className="w-4 h-4 text-zinc-600" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* PRIVACY FRAMEWORK */}
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-semibold text-white uppercase tracking-wider">Your Privacy</h3>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Your photos and metrics stay safe on your own device. Your pictures never leave your phone or computer, meaning you have complete privacy. We don't track you.
            </p>
          </div>

          {/* DEDICATED DELETE ACCOUNT SECTION */}
          <div className="glass-panel p-6 rounded-2xl space-y-4 border border-red-500/10 bg-red-950/5">
            <div className="flex items-center gap-2">
              <Trash2 className="w-4 h-4 text-red-500" />
              <h3 className="text-xs font-semibold text-white uppercase tracking-wider">Delete Account</h3>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Permanently delete one of your athlete profiles and all associated scan history from this device. Please select the account you want to delete.
            </p>
            
            <div className="space-y-3 pt-1">
              <div className="space-y-1">
                <label className="text-[10px] text-zinc-400 uppercase font-bold">Select Account to Remove</label>
                <select
                  id="delete-account-select"
                  className="w-full bg-zinc-950 border border-zinc-900 rounded-lg p-2.5 text-xs text-zinc-100 outline-none focus:border-red-500"
                  defaultValue={currentProfile.name}
                >
                  {accounts.map(acc => (
                    <option key={acc.name} value={acc.name}>
                      {acc.name} {acc.name === currentProfile.name ? "(Active Profile)" : ""}
                    </option>
                  ))}
                </select>
              </div>
              
              <button
                type="button"
                onClick={(e) => {
                  const selectEl = document.getElementById("delete-account-select") as HTMLSelectElement;
                  const nameToDelete = selectEl ? selectEl.value : currentProfile.name;
                  if (!nameToDelete) return;
                  if (confirm(`Are you absolutely sure you want to delete the account "${nameToDelete}"? This will delete all progress, workouts, and snapshots.`)) {
                    if (nameToDelete === INITIAL_USER_PROFILE.name) {
                      setErrorMessage("Cannot delete the master admin preset account");
                      setTimeout(() => setErrorMessage(""), 3000);
                      return;
                    }

                    const filtered = accounts.filter(a => a.name !== nameToDelete);
                    setAccounts(filtered);
                    localStorage.setItem("arcform_user_accounts", JSON.stringify(filtered));

                    if (currentProfile.name === nameToDelete) {
                      onUpdateProfile(INITIAL_USER_PROFILE);
                    }
                    setSuccessMsg(`Account "${nameToDelete}" successfully deleted.`);
                    setTimeout(() => setSuccessMsg(""), 3000);
                  }
                }}
                className="w-full bg-red-650 hover:bg-red-600 text-white font-mono font-bold text-[10px] uppercase py-2.5 px-4 rounded-xl transition-all select-none cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-red-950/20"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Permanently Delete Selected Account</span>
              </button>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN (COLSPAN-2): SYSTEM CONTROLS & DEPLOYMENT CODES */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* GENERAL APP PARAMETERS ACCORDION */}
          <div className="glass-panel rounded-2xl p-5 space-y-5">
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider border-b border-gray-850 pb-2">
              General App Preferences
            </h3>

            <div className="space-y-4 text-xs">
              
              {/* WEIGHT UNIT SELECTOR */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold text-zinc-300 block">System Weight Grid</span>
                  <span className="text-[10px] text-zinc-550 italic">Switch metrics unit output</span>
                </div>
                <div className="bg-zinc-900 p-0.5 rounded-lg border border-zinc-850 flex items-center">
                  <button 
                    onClick={() => setWeightUnit("lbs")}
                    className={`px-3 py-1 rounded text-[10px] font-bold uppercase transition-colors ${
                      weightUnit === "lbs" ? "bg-amber-500 text-black" : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    Lbs
                  </button>
                  <button 
                    onClick={() => setWeightUnit("kg")}
                    className={`px-3 py-1 rounded text-[10px] font-bold uppercase transition-colors ${
                      weightUnit === "kg" ? "bg-amber-500 text-black" : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    Kg
                  </button>
                </div>
              </div>

              {/* SIMULATED HAPTICS */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold text-zinc-300 block">Tactile Touch Signals</span>
                  <span className="text-[10px] text-zinc-550 italic">Trigger local haptic simulators</span>
                </div>
                <button 
                  onClick={() => setHapticSim(!hapticSim)}
                  className={`w-9 h-5 rounded-full p-0.5 transition-colors focus:outline-none ${
                    hapticSim ? "bg-amber-500" : "bg-neutral-800"
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full bg-zinc-950 transition-transform ${
                    hapticSim ? "translate-x-4" : "translate-x-0"
                  }`} />
                </button>
              </div>

              {/* AMBIENT GLOW EFFECTS */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold text-zinc-300 block">Premium Background Glow</span>
                  <span className="text-[10px] text-zinc-550 italic">Trigger radial neon backdrop overlays</span>
                </div>
                <button 
                  onClick={() => setAmbientGlow(!ambientGlow)}
                  className={`w-9 h-5 rounded-full p-0.5 transition-colors focus:outline-none ${
                    ambientGlow ? "bg-amber-500" : "bg-neutral-800"
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full bg-zinc-950 transition-transform ${
                    ambientGlow ? "translate-x-4" : "translate-x-0"
                  }`} />
                </button>
              </div>

              {/* SUBMISSION BACKUP KEY */}
              <div className="space-y-1.5 border-t border-zinc-900 pt-3.5">
                <label className="text-[10px] font-bold text-zinc-400 uppercase block">Keychain Security Backup Code</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={backupKey} 
                    onChange={(e) => setBackupKey(e.target.value)}
                    className="flex-1 bg-zinc-950 border border-zinc-850 rounded-lg p-2 text-xs outline-none focus:border-amber-500 font-mono text-amber-500"
                  />
                  <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-850 text-zinc-400 flex items-center justify-center">
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* APP STORE BADGES & SUBMISSION MOCK */}
          <div className="glass-panel rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider border-b border-gray-850 pb-2">
              App Store Launch Kit
            </h3>
            
            <p className="text-[11px] text-zinc-400 leading-normal">
              Below are the distribution badges configured with optimized local launch assets for app directories:
            </p>

            <div className="space-y-2.5">
                         {/* APPLE APP STORE ACCENT */}
              <div className="bg-zinc-950 border border-zinc-900 p-3.5 rounded-xl flex items-center justify-between hover:border-amber-500/20 transition-all">
                <div className="flex items-center gap-2.5 text-zinc-100">
                  <Apple className="w-5 h-5 text-amber-500 fill-amber-500/10" />
                  <div>
                    <span className="text-[10px] font-bold text-amber-500 uppercase block font-mono">App Store Icon Certified</span>
                    <span className="text-xs font-semibold block mt-0.5">Gold Metal Finish (1024x1024)</span>
                  </div>
                </div>
                <div className="bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-bold px-2 py-1 rounded">
                  READY
                </div>
              </div>

              {/* GOOGLE PLAY ACCENT */}
              <div className="bg-zinc-950 border border-zinc-900 p-3.5 rounded-xl flex items-center justify-between hover:border-amber-500/20 transition-all">
                <div className="flex items-center gap-2.5 text-zinc-100">
                  <Play className="w-4 h-4 text-amber-550 fill-amber-550" strokeWidth={2.5} />
                  <div>
                    <span className="text-[10px] font-bold text-amber-500 uppercase block font-mono">Security and Privacy</span>
                    <span className="text-xs font-semibold block mt-0.5">Secure local data storage</span>
                  </div>
                </div>
                <div className="bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-bold px-2 py-1 rounded">
                  ACTIVE
                </div>
              </div>
            </div>

            {/* DESTRUCTOR BUTTON */}
            <div className="pt-3 border-t border-zinc-900 flex justify-between items-center text-xs">
              <span className="text-zinc-650">Clear Saved Data</span>
              <button 
                onClick={handlePurgeAll}
                className="text-[10px] text-red-500 font-semibold hover:underline flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-550" />
                <span>Reset All Data</span>
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-500/5 to-transparent border border-amber-500/10 p-5 rounded-2xl text-center space-y-2">
            <Heart className="w-6 h-6 text-amber-500 mx-auto fill-amber-550/10" />
            <h4 className="text-xs font-semibold text-white">ArcForm Premium Membership</h4>
            <p className="text-[10px] text-zinc-500 leading-normal max-w-xs mx-auto">
              Your registered accounts receive automatic priority upgrade logs for seamless native iCloud backup distribution.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
