import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Serve larger JSON payloads for base64 physique photos
app.use(express.json({ limit: "15mb" }));

// Lazy init Gemini SDK
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key || key === "MY_GEMINI_API_KEY") {
      console.warn("GEMINI_API_KEY is not configured or holds placeholder. Server will use highly realistic dynamic fallback outputs.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key || "",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// REST API endpoint for physique analysis
app.post("/api/analyze-physique", async (req, res) => {
  try {
    const { image, archetypePreset, targetArchetypeGoal, userGoal, userLevel } = req.body;

    // Default template data for fallbacks or quick pre-selected mock loads
    const presettedArchetypes: Record<string, any> = {
      "Foundation Builder": {
        archetype: "Foundation Builder",
        targetArchetype: "Athletic Builder",
        strengths: ["Symmetric skeletal structure", "Healthy posture alignments", "Excellent joint mobility"],
        weaknesses: ["Overall muscle thickness is low", "Shoulders have room for wider development", "Waist area needs visual focus"],
        opportunities: ["High response to simple compound movements", "Quick lift adaptations", "Great potential for wider back and proportional look"],
        highestLeverageImprovements: [
          "Establish solid daily compound movements to promote core strength.",
          "Concentrate on upper body width (dumbbell shoulder raises, pull-ups) to form a wider shoulder look.",
          "Maintain progress tracking with a focus on waist tightening and stand-tall posture."
        ],
        workoutFocus: "Shoulder and Back Width",
        dailyFocus: "Wider Shoulders",
        nextActions: [
          "Complete baseline chest press assessment (3 sets of 8-10 reps on Incline Press)",
          "Perform 4 controlled sets of dumbbell shoulder raises to widen your shoulders",
          "Log first protein intake baseline (target 1.6-2.0g per kg of bodyweight)"
        ]
      },
      "Lean Frame": {
        archetype: "Lean Frame",
        targetArchetype: "Athletic V-Taper",
        strengths: ["Low levels of body fat", "Highly visible abdominal baseline", "Sleek, streamlined look"],
        weaknesses: ["Upper back width is shallow", "Shoulder width has room to grow", "Upper chest lacks fullness and thickness"],
        opportunities: ["Every pound of muscle added translates immediately to visual definition", "Highly reactive to simple gym exercises", "A wider visual silhouette can emerge incredibly fast"],
        highestLeverageImprovements: [
          "Target upper chest fullness through 30-degree incline pressing.",
          "Stimulate wider shoulders with weekly simple shoulder raises.",
          "Incorporate compound pull-ups and pulldowns targeting back width."
        ],
        workoutFocus: "Symmetrical Muscle & Width",
        dailyFocus: "Wider Shoulders",
        nextActions: [
          "Perform shoulder presses with controlled negatives",
          "Execute 4 sets of dumbbell shoulder raises",
          "Consume 250-calorie surplus of high-density clean nutrition"
        ]
      },
      "Athletic Builder": {
        archetype: "Athletic Builder",
        targetArchetype: "Classic Aesthetic",
        strengths: ["Solid structural base weight", "Proven muscle fullness baseline", "Good posture and hip structure"],
        weaknesses: ["Waist can be tightened further", "Shoulders and back width can be enhanced", "Upper chest lacks fullness"],
        opportunities: ["Transition easily to classic aesthetic symmetry ratios", "High capacity for visual muscle weight distribution", "Subtle body weight composition shifts reveal dramatic cuts"],
        highestLeverageImprovements: [
          "Prioritize upper chest fullness to balance chest-to-shoulder transition lines.",
          "Enhance back width and posture to craft a pronounced and wide posture look.",
          "Establish abdominal control while keeping waist narrow."
        ],
        workoutFocus: "Aesthetic Proportions Alignment",
        dailyFocus: "Upper Chest Fullness",
        nextActions: [
          "Engage in 30-degree incline dumbbell bench presses focusing on upper chest fullness",
          "Execute chest-supported raises to improve back posture and shoulder width",
          "Perform stomach drawing-in exercises for 3 rounds of waist tightening"
        ]
      }
    };

    // If an image is provided in base64 format, let's analyze it!
    const key = process.env.GEMINI_API_KEY;
    const hasValidKey = key && key !== "MY_GEMINI_API_KEY" && key.trim().length > 10;

    if (image && hasValidKey) {
      console.log("Processing base64 physique photo with server-side Gemini API...");
      const ai = getGeminiClient();

      // Strips the meta header if present (e.g. data:image/jpeg;base64,...)
      const base64Data = image.includes("base64,") ? image.split("base64,")[1] : image;

      const prompt = `
        You are an elite, objective, and deeply professional physique evaluator. Your role is to look at the user-submitted photograph and perform a brutally honest, highly accurate, and scientifically credible evaluation of their physical structure and development.
        
        Prioritize absolute credibility and realism above all else. Your feedback must be 100% trustworthy—never flatter the user and never sugarcoat structural or body-fat-related weaknesses. If the photo lacks muscle density, carries excess soft tissue, or shows poor shoulder width or posture, analyze that exactly.

        Follow this exact assessment tree to identify their current 'Current Archetype':
        - Foundation Builder: Detrained structure, low muscle density, flat chest, narrow frame, or skinny-fat with visible waist softness or posture sag.
        - Lean Frame: Narrow skeletal frame, low body fat, highly visible bones/abs, but clear lack of overall muscle fullness, shallow chest depth, and narrow shoulders.
        - Athletic Builder: Thick, muscular base weight, decent overall strength, but lacks a V-taper silhouette, has a wider/blocky waist, or carries moderate body fat that masks separation.
        - Athletic V-Taper: Highly athletic and defined with clear neck-to-shoulder taper, pronounced side-raise shoulders development, a narrow waist, and minimal torso fat.
        - Balanced Physique: Excellent symmetrical proportions across chest, shoulder-to-waist drop, and upper back, with low body fat and highly visible definition.
        - Classic Aesthetic: Golden-era muscular symmetry, dense shoulder width, an ultra-small waist vacuums profile, and visible partitions in the chest and shoulders.
        - Advanced Aesthetic: Peerless elite conditioning, massive shoulder flare, razor-thin waist width, and extreme muscle separation.

        CRITICAL DISCIPLINE FOR ARCHETYPE ASSIGNMENT:
        Unless there is outstanding visible muscle development, deep separation, and very low body fat, do NOT assign the premium states (Athletic V-Taper, Balanced Physique, Classic Aesthetic, or Advanced Aesthetic). Be highly conservative. Most standard gym-goers will fit under Foundation Builder, Lean Frame, or Athletic Builder. Assigning these correctly builds immediate user trust.

        PINPOINT REAL PHYSICAL PROPORTIONS:
        - Weaknesses/Strengths must clearly judge specific areas: e.g., "shoulder width", "upper chest development", "waist shape/tightness", "midsection fullness", or "upper back sweep".
        - Base these on what is actually visible. 
        - Highlighting real visual opportunities means giving them realistic aesthetic objectives based on their current silhouette gaps.

        The user has shared these goal & fitness level preferences:
        - Goal: ${userGoal || "None specified"}
        - Fitness Level: ${userLevel || "None specified"}

        CRITICAL TYPOGRAPHY & SIMPLIFICATION CONSTRAINT:
        Do NOT use complex, academic, or medical anatomical jargon like "clavicular lat width", "lateral shoulder volume", "symmetry alignment balance", or "serratus anterior engagement". Instead, translate all anatomy into basic appearance terms that a normal 20-year-old lifter would understand instantly. Use these exact translations or similar basic terms:
        - Instead of "clavicular lat width", use "Build Wider Shoulders" or "Improve Back Width"
        - Instead of "lateral shoulder volume", use "Build Wider Shoulders"
        - Instead of "symmetry alignment balance", use "Balanced Proportions" or "Symmetrical Shoulders & Chest"
        - Instead of "upper pectorals/clavicular fibers", use "Bring Up Upper Chest"
        - Instead of "abdominal vacuum control/transverse engagement", use "Tighten Waist" or "Flat Tummy"

        Return a strictly structured JSON response representing the visual assessment. 
        Format of JSON:
        {
          "archetype": "Name of estimated archetype",
          "targetArchetype": "Ideal next-step target archetype (e.g., 'Athletic V-Taper' for 'Lean Frame')",
          "strengths": ["Honest, specific strength: e.g., wide clavicle layout", "e.g., flat stomach baseline", "e.g., level level collarbones"],
          "weaknesses": ["Honest, critical gap: e.g., weak upper chest development", "e.g., narrow shoulder width profile", "e.g., soft body fat around waist"],
          "opportunities": ["Real visual opportunity: e.g., flare side shoulders to make waist look narrower", "e.g., thicken upper chest line to balance front posture", "e.g., pull back posture to amplify overall width"],
          "highestLeverageImprovements": [
            "Coaching lesson 1 focusing on correct shoulder width development and target posture",
            "Coaching lesson 2 focusing on chest thickness and visual chest separation",
            "Coaching lesson 3 focusing on tightening the waist and shrinking midsection fullness"
          ],
          "workoutFocus": "Shorthand focus matching their biggest opportunity (e.g., Build Wider Shoulders, Bring Up Upper Chest, Tighten Waist)",
          "dailyFocus": "One prominent single daily objective (e.g., 'Wider Shoulders')",
          "nextActions": [
            "Specific simple action 1 (e.g., 'Do 3 sets of slow lateral raises')",
            "Specific simple action 2 (e.g., 'Stand tall flat against a wall for 2 minutes')",
            "Specific simple action 3 (e.g., 'Perform 3 sets of deep belly-in vacuum holds')"
          ]
        }
        
        Return ONLY valid parsable JSON. No markdown backticks, no wrap text, just JSON.
      `;

      try {
        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: [
            {
              inlineData: {
                data: base64Data,
                mimeType: "image/jpeg"
              }
            },
            {
              text: prompt
            }
          ],
          config: {
            responseMimeType: "application/json",
            temperature: 0.2
          }
        });

        const rawText = response.text || "";
        console.log("Raw Gemini API Output:", rawText);
        
        // Scrub markdown backticks if returned despite explicit prompt instructions
        const cleanJsonText = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
        const analyzedData = JSON.parse(cleanJsonText);
        
        return res.json({
          success: true,
          source: "gemini-ai",
          data: analyzedData
        });
      } catch (geminiError: any) {
        console.error("Gemini analysis error:", geminiError);
        // Fallback to closest matching template or dynamic creation on error
        const preset = presettedArchetypes[archetypePreset] || presettedArchetypes["Lean Frame"];
        return res.json({
          success: true,
          source: "fallback-preset-due-to-error",
          error: geminiError.message,
          data: preset
        });
      }
    } else {
      // Use template presets or custom mock simulation for premium offline-first fidelity
      console.log(`Using mock template preset ${archetypePreset || "Lean Frame"} as fallback...`);
      const selectedPresetKey = archetypePreset && presettedArchetypes[archetypePreset] ? archetypePreset : "Lean Frame";
      const presetData = { ...presettedArchetypes[selectedPresetKey] };
      
      // If client supplied specific target goals or customized tags, we customize the template on the fly
      if (targetArchetypeGoal) {
        presetData.targetArchetype = targetArchetypeGoal;
      }

      // Customize output based on questionnaire selection
      if (userGoal) {
        if (userGoal === "Look More Athletic") {
          presetData.workoutFocus = "Shoulder Width Posture Alignment";
          presetData.dailyFocus = "Shoulder Width & Posture Balance";
          presetData.highestLeverageImprovements = [
            "Perform simple dumbbell shoulder raises to widen your shoulders.",
            "Do active back stretches to expand your shoulder visual baseline.",
            "Maintain straight shoulders and tight waist alignment."
          ];
          presetData.nextActions = [
            "Do 3 sets of quick dumbbell shoulder raises",
            "Stand straight with shoulders rolled back for 2 minutes",
            "Log your workout using the 'Finish Workout' check"
          ];
        } else if (userGoal === "Build More Muscle") {
          presetData.workoutFocus = "Aesthetic Muscle Fullness";
          presetData.dailyFocus = "High-Quality Proteins & Wider Shoulders";
          presetData.highestLeverageImprovements = [
            "Consume healthy meals high in clean proteins every day.",
            "Log 3 simple sets of arm or shoulder lift reps.",
            "Get a full night of deep sleep to let muscles heal and grow."
          ];
          presetData.nextActions = [
            "Eat 15-20g of clean, healthy protein right away",
            "Do 3 simple sets of dumbbell side curls or lifts",
            "Mark 'proteins' as done or click 'Finish Workout'"
          ];
        } else if (userGoal === "Get Leaner") {
          presetData.workoutFocus = "Midsection Trim & Frame Definition";
          presetData.dailyFocus = "Daily Walking & Light Balanced Meals";
          presetData.highestLeverageImprovements = [
            "Keep your meal portions smart, light, and clean.",
            "Walk 8,000 steps today to naturally burn extra energy.",
            "Drink plenty of crisp, clean water to remain hydrated."
          ];
          presetData.nextActions = [
            "Hydrate with a fresh glass of water",
            "Go for an easy 10-15 minute walk outside",
            "Check off light meals as completed on your tracker"
          ];
        } else if (userGoal === "Improve Posture") {
          presetData.workoutFocus = "Symmetry & Postural Alignment";
          presetData.dailyFocus = "Standing Tall & Chest Openers";
          presetData.highestLeverageImprovements = [
            "Perform basic neck, shoulder, and back stretches.",
            "Stand tall and straight against a flat wall for 2 minutes.",
            "Sit upright at your desk with relaxed, level shoulders."
          ];
          presetData.nextActions = [
            "Wall stretch: stand tall flat against a wall for 2 minutes",
            "Perform 1 minute of gentle deep shoulder openers",
            "Adjust your chair to sit upright with relaxed shoulders"
          ];
        } else if (userGoal === "Improve My Overall Appearance") {
          presetData.workoutFocus = "Aesthetic Proportion Balancing";
          presetData.dailyFocus = "All-Around Proportional Polish";
          presetData.highestLeverageImprovements = [
            "Keep premium posture standards active all day.",
            "Drink ample cool water to support skin and energy.",
            "Incorporate light visual chest & back posture exercises."
          ];
          presetData.nextActions = [
            "Wash your face and drink a cold cup of water",
            "Do 2 minutes of posture holds to instantly look more athletic",
            "Complete a simple 10-minute active stretch routine"
          ];
        }
      }

      if (userLevel) {
        if (userLevel === "Beginner") {
          presetData.nextActions = presetData.nextActions.map((act: string) => "Easy: " + act);
          presetData.strengths = presetData.strengths.concat(["Ready to learn correct lifting techniques"]);
        } else if (userLevel === "Advanced") {
          presetData.nextActions = presetData.nextActions.map((act: string) => "Challenging: " + act + " with heavier weight");
          presetData.strengths = presetData.strengths.concat(["Solid fitness base already set"]);
        }
      }

      // Add a slight delay to simulate processing aesthetics
      await new Promise(resolve => setTimeout(resolve, 800));

      return res.json({
        success: true,
        source: "engine-simulated",
        data: presetData
      });
    }
  } catch (err: any) {
    console.error("Endpoint error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Vite & Static client assets serving
async function bootstrapServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Development Mode: Mounting Vite Dev Server Middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Production Mode: Serving Static Dist Directory Assets...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ArcForm Engine online at host 0.0.0.0 on port ${PORT}`);
  });
}

bootstrapServer();
