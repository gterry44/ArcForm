import { ArchetypeDetail, UserProfile, ActionItem } from "./types";

export const ARCHETYPES_LIST: ArchetypeDetail[] = [
  {
    name: "Foundation Builder",
    level: 1,
    description: "Just starting out. Focuses on learning the basic exercises and building overall strength.",
    recommendedFocus: "Standing tall, making your core strong, and learning simple lifts.",
    minPhysicalRequirements: "Just starting to exercise.",
    vTaperRatio: "1.05 - 1.12",
    estimatedBodyFat: "18% - 25%",
    imageRepresentation: "M10 80 L35 75 L35 40 L50 30 L65 40 L65 75 L90 80 L80 160 L20 160 Z" // SVG Path
  },
  {
    name: "Lean Frame",
    level: 2,
    description: "Lean but slim. Needs to eat good food and lift weights to build larger muscles.",
    recommendedFocus: "Shoulders, upper chest, and upper back.",
    minPhysicalRequirements: "Can do simple push-ups and pull-ups.",
    vTaperRatio: "1.15 - 1.20",
    estimatedBodyFat: "9% - 13%",
    imageRepresentation: "M15 80 L32 75 L35 35 L50 25 L65 35 M65 35 L68 75 L85 80 L75 160 L25 160 Z"
  },
  {
    name: "Athletic Builder",
    level: 3,
    description: "Already strong with good muscles, but has a bit of extra soft weight over them.",
    recommendedFocus: "Losing extra weight while building the upper chest and shoulders.",
    minPhysicalRequirements: "Can block out regular gym time and lift medium weights.",
    vTaperRatio: "1.20 - 1.25",
    estimatedBodyFat: "14% - 17%",
    imageRepresentation: "M8 78 L30 72 L35 30 L50 20 L65 30 L70 72 L92 78 L78 158 L22 158 Z"
  },
  {
    name: "Athletic V-Taper",
    level: 4,
    description: "The classic 'V' shape: wide shoulders and a slim, tight waist.",
    recommendedFocus: "Upper back, back of the shoulders, and keeping the waist slim.",
    minPhysicalRequirements: "Can do 10 clean pull-ups.",
    vTaperRatio: "1.28 - 1.34",
    estimatedBodyFat: "10% - 12%",
    imageRepresentation: "M5 75 L28 72 L35 25 L50 15 L65 25 L72 72 L95 75 L75 155 L25 155 Z"
  },
  {
    name: "Balanced Physique",
    level: 5,
    description: "Very balanced and even. Chest, back, and shoulders look solid and fit.",
    recommendedFocus: "Legs, upper chest, and stomach control.",
    minPhysicalRequirements: "Very strong and lean.",
    vTaperRatio: "1.35 - 1.40",
    estimatedBodyFat: "8% - 10%",
    imageRepresentation: "M3 72 L26 71 L35 20 L50 12 L65 20 L74 71 L97 72 L73 152 L27 152 Z"
  },
  {
    name: "Classic Aesthetic",
    level: 6,
    description: "Broad shoulders, a small waist, and big legs—like an action figure.",
    recommendedFocus: "Perfecting small muscles and staying extremely fit.",
    minPhysicalRequirements: "Elite levels of strength and fitness.",
    vTaperRatio: "1.41 - 1.48",
    estimatedBodyFat: "7% - 9%",
    imageRepresentation: "M1 68 L24 69 L35 15 L50 8 L65 15 L76 69 L99 68 L72 150 L28 150 Z"
  },
  {
    name: "Advanced Aesthetic",
    level: 7,
    description: "The highest possible level. Extremely defined muscles all over.",
    recommendedFocus: "Keeping your high strength and perfect form.",
    minPhysicalRequirements: "Years of hard training.",
    vTaperRatio: "1.49+",
    estimatedBodyFat: "6% - 8%",
    imageRepresentation: "M0 65 L22 68 L35 10 L50 5 L65 10 L78 68 L100 65 L70 148 L30 148 Z"
  }
];

export const INITIAL_USER_PROFILE: UserProfile = {
  name: "Guest Athlete",
  currentArchetype: "Lean Frame",
  targetArchetype: "Athletic V-Taper",
  weightLbs: 161.4,
  heightInches: 71,
  bodyFatPercentage: 11.8,
  momentum: {
    streak: 0,
    consistencyPercentage: 0,
    lastCheckInDate: "",
    aestheticScore: 0,
    totalWorkoutsLog: 0
  },
  scansList: [],
  actionsList: [
    { id: "act-1", task: "Perform dumbbell side raises to widen your shoulder appearance", completed: false, category: "training", pointsValue: 15 },
    { id: "act-2", task: "Log incline press sets to build upper-chest fullness", completed: false, category: "training", pointsValue: 15 },
    { id: "act-3", task: "Consume 165g high-density protein", completed: false, category: "nutrition", pointsValue: 10 },
    { id: "act-4", task: "Perform 5 minutes of stomach drawing-in exercises to narrow your waist outline", completed: false, category: "training", pointsValue: 10 },
    { id: "act-5", task: "8 hours of restorative deep sleep for recovery tracking", completed: false, category: "lifestyle", pointsValue: 10 }
  ],
  workoutHistory: []
};

// Growth blueprint details to answer the " billion-dollar product strategy " requirement perfectly
export const STARTUP_GROWTH_VISION = {
  foundersVision: {
    coreInsight: "People don't want workout files. They want to be visibly, quantifiably more attractive. Conventional trackers are chores; ArcForm represents a physical ascension system.",
    highRetentionMechanism: "Gamifying the physical silhouette transformation by locking/unlocking literal visual archetypes (e.g. from Lean Frame to Classic Aesthetic) evaluated via advanced computer vision.",
  },
  futureAiArchitecture: [
    {
      milestone: "Phase 1: Generative Sizing Matrix",
      techStack: "Gemini Vision Multi-Modal Inference",
      value: "Current system mapping skeletal lines and highlighting muscular opportunities directly from high-resolution customer photos."
    },
    {
      milestone: "Phase 2: Skeletal Angle Estimators",
      techStack: "Custom ResNet Landmark Localization",
      value: "Calculate visual shoulder-to-waist ratio directly from webcam streams and warn about symmetry imbalances down to 0.5 degrees."
    },
    {
      milestone: "Phase 3: Realtime Muscular Satiety Mapping",
      techStack: "Vision AI Video Scan + Muscle Occlusion Modeling",
      value: "Calculates precise hyper-trophic volume levels by looking at muscle pump diameters during live in-camera pose transitions."
    }
  ],
  retentionLoops: {
    viralLoop: "Aesthetic Progression Sharing. ArcForm generates ultra-premium, high-contrast, black-and-gold visual share cards (e.g. 'Athlete Earned: Athletic V-Taper Archetype • V-Taper Ratio +7%') optimized for Instagram, TikTok, and Reddit. Instantly sparks virality.",
    retentionTrigger: "The 24-hr Momentum Decay. Momentum points drop by a tiny fraction if a check-in is missed, immediately stimulating notifications and deep daily routine reinforcement."
  }
};
