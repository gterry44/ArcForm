import React, { useState } from "react";
import { 
  Dumbbell, 
  Check, 
  Plus, 
  X,
  Trash2
} from "lucide-react";
import { UserProfile, WorkoutLog, ExerciseItem, ExerciseSet } from "../types";

interface WorkoutLoggerProps {
  profile: UserProfile;
  onAddWorkout: (workout: Omit<WorkoutLog, "id" | "date">) => void;
}

const DEFAULT_RECOMMENDED_EXERCISES: Record<string, string[]> = {
  "Shoulder Width Focus": ["Dumbbell Side Raise", "Cable Side Press"],
  "Upper Chest Line Focus": ["Incline Dumbbell Press", "Clavicular Flyes"],
  "Lats & Back Expansion": ["Lat Pulldown", "One-Arm Row"],
  "Posture & Rear Shoulder Support": ["Cable Face Pulls", "Rear Delt Flyes"],
  "Core Wall Vacuum Tightening": ["Stomach Vacuum Hold", "Hanging Leg Raises"]
};

export default function WorkoutLogger({ profile, onAddWorkout }: WorkoutLoggerProps) {
  // Read recommended focus directly from user's latest scan/blueprint
  const recommendedFocus = profile.scansList[0]?.workoutFocus || "Shoulder Width Focus";
  
  // States: "logging" | "saved"
  const [sessionStage, setSessionStage] = useState<"logging" | "saved">("logging");
  const [sessionNotes, setSessionNotes] = useState("");
  
  // Auto-seed exercises based on the current recommended blueprint focus
  const [exercises, setExercises] = useState<ExerciseItem[]>(() => {
    const list = DEFAULT_RECOMMENDED_EXERCISES[recommendedFocus] || ["Dumbbell Side Raise"];
    return list.map((name, idx) => ({
      id: `ex-${idx}-${Date.now()}`,
      name: name,
      sets: [
        { id: `set-${idx}-1-${Date.now()}`, setNumber: 1, weightLbs: 35, reps: 10, type: "working", isToFailure: false },
        { id: `set-${idx}-2-${Date.now()}`, setNumber: 2, weightLbs: 35, reps: 10, type: "working", isToFailure: false }
      ]
    }));
  });

  const handleAddExercise = () => {
    const newEx: ExerciseItem = {
      id: `ex-added-${Date.now()}-${Math.random()}`,
      name: "Custom Target Exercise",
      sets: [
        { id: `set-added-1-${Date.now()}-${Math.random()}`, setNumber: 1, weightLbs: 30, reps: 10, type: "working", isToFailure: false }
      ]
    };
    setExercises(prev => [...prev, newEx]);
  };

  const handleDeleteExercise = (exId: string) => {
    setExercises(prev => prev.filter(ex => ex.id !== exId));
  };

  const handleUpdateExerciseName = (exId: string, name: string) => {
    setExercises(prev => prev.map(ex => ex.id === exId ? { ...ex, name } : ex));
  };

  const handleAddSet = (exId: string) => {
    setExercises(prev => prev.map(ex => {
      if (ex.id === exId) {
        const nextSetNum = ex.sets.length + 1;
        const lastSet = ex.sets[ex.sets.length - 1];
        const newSet: ExerciseSet = {
          id: `set-${Date.now()}-${Math.random()}`,
          setNumber: nextSetNum,
          weightLbs: lastSet ? lastSet.weightLbs : 30,
          reps: lastSet ? lastSet.reps : 10,
          type: "working",
          isToFailure: false
        };
        return { ...ex, sets: [...ex.sets, newSet] };
      }
      return ex;
    }));
  };

  const handleRemoveSet = (exId: string, setId: string) => {
    setExercises(prev => prev.map(ex => {
      if (ex.id === exId) {
        const filtered = ex.sets.filter(s => s.id !== setId);
        const resequenced = filtered.map((s, index) => ({ ...s, setNumber: index + 1 }));
        return { ...ex, sets: resequenced };
      }
      return ex;
    }));
  };

  const handleUpdateSetField = (exId: string, setId: string, field: keyof ExerciseSet, value: any) => {
    setExercises(prev => prev.map(ex => {
      if (ex.id === exId) {
        return {
          ...ex,
          sets: ex.sets.map(s => s.id === setId ? { ...s, [field]: value } : s)
        };
      }
      return ex;
    }));
  };

  const totalSetsCompleted = exercises.reduce((acc, curr) => acc + curr.sets.length, 0);

  const handleSaveWorkout = (e: React.FormEvent) => {
    e.preventDefault();
    if (exercises.length === 0 || totalSetsCompleted === 0) {
      alert("Please include at least one complete exercise set.");
      return;
    }

    onAddWorkout({
      focusTitle: recommendedFocus,
      setsCompleted: totalSetsCompleted,
      effortRating: 8, // Hidden effort rating mapping to support the grade calculation system silently
      exercises: exercises,
      notes: sessionNotes || undefined
    });

    setSessionStage("saved");
  };

  const handleRestart = () => {
    setSessionNotes("");
    const list = DEFAULT_RECOMMENDED_EXERCISES[recommendedFocus] || ["Dumbbell Side Raise"];
    setExercises(list.map((name, idx) => ({
      id: `ex-${idx}-${Date.now()}`,
      name: name,
      sets: [
        { id: `set-${idx}-1-${Date.now()}`, setNumber: 1, weightLbs: 35, reps: 10, type: "working", isToFailure: false },
        { id: `set-${idx}-2-${Date.now()}`, setNumber: 2, weightLbs: 35, reps: 10, type: "working", isToFailure: false }
      ]
    })));
    setSessionStage("logging");
  };

  return (
    <div id="arcform-sculpting-logger-container" className="space-y-6 animate-fade-in text-zinc-100 max-w-xl mx-auto text-left">
      
      {/* HEADER */}
      <div className="border-b border-zinc-900 pb-3">
        <span className="text-[10px] font-mono text-amber-500 uppercase tracking-widest block font-bold mb-1">
          Blueprint Implementation
        </span>
        <h1 className="text-2xl font-black font-display text-white uppercase tracking-tight">
          Symmetry Sculpting
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Log today's recommended exercises to sculpt your target proportions.
        </p>
      </div>

      {sessionStage === "logging" && (
        <form onSubmit={handleSaveWorkout} className="space-y-6">
          <div className="bg-zinc-900/30 border border-zinc-900 p-4 rounded-2xl flex items-center justify-between">
            <div className="text-left">
              <span className="text-[9px] font-mono text-zinc-500 block uppercase font-bold">Recommended Sequence</span>
              <span className="text-sm font-black text-amber-400 font-sans block uppercase mt-0.5">{recommendedFocus}</span>
            </div>
            
            <button
              type="button"
              onClick={handleAddExercise}
              className="bg-zinc-900 hover:bg-zinc-850 text-zinc-300 hover:text-white px-3 py-1.5 rounded-lg border border-zinc-800 text-[10px] font-mono tracking-wider uppercase font-bold cursor-pointer transition-colors"
            >
              + Add Accent Exercise
            </button>
          </div>

          {/* ACTIVE EXERCISE ROWS */}
          <div className="space-y-4">
            {exercises.map((ex) => (
              <div key={ex.id} className="bg-zinc-900/20 border border-zinc-900 p-4 rounded-2xl space-y-3.5">
                
                {/* Exercise Title Box */}
                <div className="flex items-center justify-between gap-3">
                  <input
                    type="text"
                    value={ex.name}
                    onChange={(e) => handleUpdateExerciseName(ex.id, e.target.value)}
                    className="bg-transparent border-b border-transparent hover:border-zinc-800 focus:border-amber-500/40 text-sm font-bold text-white outline-none pb-0.5 flex-1 transition-all"
                    placeholder="Exercise name"
                  />
                  
                  <button
                    type="button"
                    onClick={() => handleDeleteExercise(ex.id)}
                    className="text-zinc-500 hover:text-red-400 transition-colors p-1"
                    title="Remove Exercise"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Simplified set rows */}
                <div className="space-y-2">
                  <div className="text-[10px] font-mono text-zinc-500 grid grid-cols-12 gap-2 pb-1 border-b border-zinc-900 text-center font-bold">
                    <div className="col-span-2 text-left">SET</div>
                    <div className="col-span-4">WEIGHT (LBS)</div>
                    <div className="col-span-4">REPS</div>
                    <div className="col-span-2"></div>
                  </div>

                  {ex.sets.map((set) => (
                    <div key={set.id} className="grid grid-cols-12 gap-2 items-center text-center">
                      <div className="col-span-2 text-xs font-mono font-bold text-zinc-500 text-left">
                        {set.setNumber}
                      </div>

                      {/* Weight */}
                      <div className="col-span-4">
                        <input
                          type="number"
                          value={set.weightLbs}
                          onChange={(e) => handleUpdateSetField(ex.id, set.id, "weightLbs", Number(e.target.value) || 0)}
                          className="w-full bg-zinc-900/60 border border-zinc-850 focus:border-amber-505/40 rounded-lg py-1 text-center text-xs font-mono text-white outline-none transition-all"
                          min="0"
                        />
                      </div>

                      {/* Reps */}
                      <div className="col-span-4">
                        <input
                          type="number"
                          value={set.reps}
                          onChange={(e) => handleUpdateSetField(ex.id, set.id, "reps", Number(e.target.value) || 0)}
                          className="w-full bg-zinc-900/60 border border-zinc-850 focus:border-amber-505/40 rounded-lg py-1 text-center text-xs font-mono text-white outline-none transition-all"
                          min="0"
                        />
                      </div>

                      {/* Remove Set */}
                      <div className="col-span-2 flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveSet(ex.id, set.id)}
                          disabled={ex.sets.length <= 1}
                          className="text-zinc-600 hover:text-zinc-400 disabled:opacity-20 cursor-pointer p-0.5"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Set Row */}
                <button
                  type="button"
                  onClick={() => handleAddSet(ex.id)}
                  className="text-[10px] font-mono text-amber-500 hover:text-amber-400 flex items-center gap-1 cursor-pointer font-bold uppercase tracking-wider"
                >
                  + Add Set
                </button>

              </div>
            ))}
          </div>

          {/* Notes field */}
          <div className="space-y-1.5 text-left font-sans">
            <label className="text-[10px] uppercase tracking-wider font-bold text-zinc-500">Optional Session Notes:</label>
            <textarea
              value={sessionNotes}
              onChange={(e) => setSessionNotes(e.target.value)}
              placeholder="e.g. felt incredible lateral pump, shoulders wide, clean muscle path..."
              className="w-full bg-zinc-900/40 border border-zinc-850 focus:border-amber-500/40 rounded-xl p-3 text-xs outline-none transition-all placeholder:text-zinc-600"
              rows={2}
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:brightness-110 text-zinc-950 font-bold text-xs uppercase tracking-widest rounded-xl cursor-pointer shadow-lg shadow-amber-500/5 font-mono"
          >
            Save Blueprint Workout
          </button>
        </form>
      )}

      {sessionStage === "saved" && (
        <div className="bg-zinc-950/40 border border-zinc-900 p-6 rounded-3xl text-center space-y-5 animate-zoom-in">
          <div className="w-10 h-10 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-400 mx-auto">
            <Check className="w-5 h-5 stroke-[3]" />
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-black text-white uppercase">Session Logged</h3>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-sm mx-auto">
              You saved custom training details to your logs. Today's target was completed and your progress streak was successfully bumped!
            </p>
          </div>

          <div className="border-t border-zinc-900 pt-3 space-y-1.5 font-mono text-xs">
            <div className="flex justify-between">
              <span className="text-zinc-500">Symmetry Blueprint:</span>
              <span className="text-amber-400 font-bold uppercase">{recommendedFocus}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Total Sets Recorded:</span>
              <span className="text-white font-bold">{totalSetsCompleted} sets</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRestart}
            className="w-full py-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded-xl text-xs font-semibold cursor-pointer border border-zinc-800 transition-colors"
          >
            Start Another Workout
          </button>
        </div>
      )}

    </div>
  );
}

export function SymmetryForm() {
  return null;
}
