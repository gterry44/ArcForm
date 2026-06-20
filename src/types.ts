export type ArchetypeType =
  | "Foundation Builder"
  | "Lean Frame"
  | "Athletic Builder"
  | "Athletic V-Taper"
  | "Balanced Physique"
  | "Classic Aesthetic"
  | "Advanced Aesthetic";

export interface ArchetypeDetail {
  name: ArchetypeType;
  level: number;
  description: string;
  recommendedFocus: string;
  minPhysicalRequirements: string;
  vTaperRatio: string; // Shoulder-to-Waist ratio
  estimatedBodyFat: string;
  imageRepresentation: string; // Icon or abstract visual indicator
}

export interface PhysiqueScanResult {
  archetype: ArchetypeType;
  targetArchetype: ArchetypeType;
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  highestLeverageImprovements: string[];
  workoutFocus: string;
  dailyFocus: string;
  nextActions: string[];
  scannedAt: string;
  imageUrl?: string;
}

export interface MomentumSession {
  streak: number;
  consistencyPercentage: number;
  lastCheckInDate: string | null;
  aestheticScore: number; // calculated from scans and adherence
  totalWorkoutsLog: number;
}

export interface ActionItem {
  id: string;
  task: string;
  completed: boolean;
  category: "training" | "nutrition" | "lifestyle";
  pointsValue: number;
}

export interface ExerciseSet {
  id: string;
  setNumber: number;
  weightLbs: number;
  reps: number;
  type: "working" | "drop" | "warmup";
  isToFailure: boolean;
}

export interface ExerciseItem {
  id: string;
  name: string;
  sets: ExerciseSet[];
}

export interface WorkoutLog {
  id: string;
  date: string;
  focusTitle: string;
  setsCompleted: number;
  effortRating: number; // 1-10 scale
  exercises?: ExerciseItem[];
  notes?: string;
  aestheticScoreAtLog?: number;
}

export interface AestheticRecord {
  id: string;
  date: string;
  score: number;
  source: string; // "Initial" | "Protocol Change" | "Workout Logged" | "Physique Scan"
}

export interface UserProfile {
  name: string;
  currentArchetype: ArchetypeType;
  targetArchetype: ArchetypeType;
  weightLbs: number;
  heightInches: number;
  bodyFatPercentage: number;
  momentum: MomentumSession;
  scansList: PhysiqueScanResult[];
  actionsList: ActionItem[];
  workoutHistory: WorkoutLog[];
  aestheticHistory?: AestheticRecord[];
  goal?: string;
  level?: string;
  biologicalSex?: "Male" | "Female" | "Prefer Not to Say";
  athleteTag?: string;
}
