import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Helper to get the latest Gemini API client dynamically on each request to prevent stale key caches
function getAiClient() {
  const currentKey = process.env.GEMINI_API_KEY;
  if (!currentKey || currentKey === "MY_GEMINI_API_KEY") {
    throw new Error("GEMINI_API_KEY environment variable is not configured or contains placeholder.");
  }
  return new GoogleGenAI({
    apiKey: currentKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Helper to call generative model with a robust fallback pipeline for high-demand or quota issues
async function generateContentWithFallback(ai: any, contents: any, config: any) {
  const modelsToTry = ["gemini-3.5-flash", "gemini-flash-latest", "gemini-3.1-flash-lite"];
  let lastError: any = null;

  for (const model of modelsToTry) {
    try {
      console.log(`[Gemini API] Attempting generateContent using model: ${model}`);
      const response = await ai.models.generateContent({
        model,
        contents,
        config,
      });
      console.log(`[Gemini API] Success using model: ${model}`);
      return response;
    } catch (err: any) {
      console.error(`[Gemini API] Error using model ${model}:`, err.message || err);
      lastError = err;
    }
  }
  throw lastError || new Error("All GenAI models in the fallback queue returned 503 or failed.");
}

// API endpoint for health check
app.get("/api/health", (req, res) => {
  const key = process.env.GEMINI_API_KEY;
  res.json({ 
    status: "ok", 
    time: new Date().toISOString(),
    hasApiKey: !!key,
    keyLength: key ? key.length : 0,
    keyPrefix: key ? key.substring(0, 4) : "none"
  });
});

// API endpoint to retrieve the provisioned Google Client ID
app.get("/api/auth/config", (req, res) => {
  const envKeys = Object.keys(process.env);
  console.log("[Auth Config Debug] Available env keys:", envKeys);
  
  // Try retrieving from any standard Google / general client ID key injected by the platform
  const clientId = 
    process.env.VITE_GOOGLE_CLIENT_ID || 
    process.env.GOOGLE_CLIENT_ID || 
    process.env.CLIENT_ID || 
    process.env.OAUTH_CLIENT_ID || 
    process.env.GOOGLE_OAUTH_CLIENT_ID || 
    "";
  
  console.log("[Auth Config Debug] Selected Client ID:", clientId ? `${clientId.substring(0, 15)}...` : "none");
  res.json({ clientId });
});

// API endpoint to suggest content improvements
app.post("/api/resume/suggest", async (req, res) => {
  try {
    const { originalText, sectionType, tone, targetRole, jobDescription } = req.body;

    if (!originalText) {
      return res.status(400).json({ error: "Original text is required" });
    }

    const ai = getAiClient();

    const prompt = `
      You are an expert executive resume writer and career coach.
      Analyze the following draft content for a resume section.
      
      Section Type: ${sectionType || "General/Experience"}
      Tone Requested: ${tone || "Professional and Accomplishment-oriented"}
      Target Role/Title (Optional): ${targetRole || "Not specified"}

      ${jobDescription ? `Target Job Description to align and tailor with:\n"""\n${jobDescription}\n"""` : ""}

      Draft Content:
      """
      ${originalText}
      """

      Task: Provide exactly 3 rewritten variations that are highly optimized using active action verbs and focusing on measurable results. Specifically:
      1. Rephrase bullet points to start with strong, high-impact professional action verbs.
      2. Identify weak or generic statements in the text, and rewrite them to be highly specific and metrics-focused. If exact metrics are absent in the draft, write them using standard numeric placeholders (e.g. "by [X]%", "impacting [Y] users", "[Z] hours saved") to prompt the user where they should quantify.
      3. If a Target Job Description is provided above, analyze its key terms and tailor the language to align with its core requirements and methodologies.

      Respond with a JSON object following this strict schema:
      {
        "suggestions": [
          "First highly tailored variation optimized for the target job description if provided, with strong action verbs",
          "Second variation focusing heavily on specific numerical placeholders and metrics-backed formatting",
          "Third variation balancing professional phrasing and high-priority keyword alignment"
        ],
        "actionVerbs": ["verb1", "verb2", "verb3", "verb4"],
        "keySkills": ["skill1", "skill2", "skill3"],
        "coachingTip": "A constructive 2-sentence feedback explaining which parts of the draft were generic, and why the new versions with action verbs and specific targets improve ATS and human reading."
      }
    `;

    const response = await generateContentWithFallback(ai, prompt, {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        required: ["suggestions", "actionVerbs", "keySkills", "coachingTip"],
        properties: {
          suggestions: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Three tailored, high-impact bullet rewrites."
          },
          actionVerbs: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Four strong action verbs suitable for this section."
          },
          keySkills: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Three industry-relevant skills or keywords."
          },
          coachingTip: {
            type: Type.STRING,
            description: "A constructive coaching tip for the user."
          }
        }
      }
    });

    const parsedData = JSON.parse(response.text?.trim() || "{}");
    res.json(parsedData);
  } catch (err: any) {
    console.error("Error in /api/resume/suggest:", err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
});

// API endpoint to quickly rewrite any resume section text to elevate its professional tone
app.post("/api/resume/rewrite", async (req, res) => {
  try {
    const { originalText, sectionType } = req.body;

    if (!originalText || !originalText.trim()) {
      return res.status(400).json({ error: "Original text is required for rewriting." });
    }

    const ai = getAiClient();

    const prompt = `
      You are an elite executive resume writer.
      Rewrite and optimize the following professional text from a resume ${sectionType || "summary/experience"} field to maximize executive impact and professional tone.

      Rules:
      1. Elevate vocabulary using high-impact action verbs.
      2. Clear and professional formatting (sentences or bullet lists as entered).
      3. Do NOT make up new degrees, fake companies, or fake numbers. If the user presents generic tasks, improve structural phrasing first.
      4. Maintain all technical terms, tool names, and metrics.

      Draft Text:
      """
      ${originalText}
      """

      Respond with a JSON object following this strict schema:
      {
        "rewrittenText": "The fully optimized and polished professional rewrite of the draft text."
      }
    `;

    const response = await generateContentWithFallback(ai, prompt, {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        required: ["rewrittenText"],
        properties: {
          rewrittenText: {
            type: Type.STRING,
            description: "The complete rewritten, polished text."
          }
        }
      }
    });

    const parsedData = JSON.parse(response.text?.trim() || "{}");
    res.json(parsedData);
  } catch (err: any) {
    console.error("Error in /api/resume/rewrite:", err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
});

// API endpoint to analyze a resume against a job description (ATS Checker)
app.post("/api/resume/analyze-ats", async (req, res) => {
  try {
    const { resumeText, jobDescription } = req.body;

    if (!resumeText) {
      return res.status(400).json({ error: "Resume text is required" });
    }
    if (!jobDescription) {
      return res.status(400).json({ error: "Job description is required for comparative analysis" });
    }

    const ai = getAiClient();

    const prompt = `
      You are an Applicant Tracking System (ATS) parsing parser and a Senior Technical Recruiter.
      Evaluate the provided resume text against the target job description.

      Resume Text:
      """
      ${resumeText}
      """

      Job Description:
      """
      ${jobDescription}
      """

      Task: Conduct a high-fidelity ATS audit. You must output detailed assessments on keyword matching, formatting standards, section complete headings, readability, and critical improvements.

      Respond with a JSON object following this strict schema:
      {
        "matchScore": 75, // Integer from 0 to 100
        "readabilityScore": 85, // Integer from 0 to 100
        "missingKeywords": [
          { "keyword": "React", "importance": "High", "tips": "Add to skills and project descriptions" },
          { "keyword": "Kubernetes", "importance": "Medium", "tips": "Mention hands-on clusters setup if applicable" }
        ],
        "matchedKeywords": ["TypeScript", "Node.js", "Express", "RESTful APIs"],
        "formattingChecks": [
          { "check": "Standard Headings", "passed": true, "details": "Found common headings (Experience, Education, Skills) correctly." },
          { "check": "Multiple Columns", "passed": false, "details": "The text hints at a multi-column layout, which can confuse legacy parser systems." },
          { "check": "Images and Custom Shapes", "passed": false, "details": "Review if there are decorative shapes, headers, or logos that block parsing." }
        ],
        "sectionAnalysis": {
          "contact": "Check: Found email and phone. Missed LinkedIn link/GitHub profile.",
          "experience": "Strong usage of action verbs, but could emphasize more financial/percent-based scaling parameters.",
          "skills": "Well defined, but lacks explicit hierarchy or grouping.",
          "education": "Complete and clear."
        },
        "criticalFixes": [
          "Convert to a single-column layout to prevent text reading sequence issues.",
          "Add missing high-priority keywords: Kubernetes, Docker, and Microservices.",
          "Quantify bullet points in your professional experience section (e.g., increased performance by X%, managed Y size team)."
        ]
      }
    `;

    const response = await generateContentWithFallback(ai, prompt, {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        required: ["matchScore", "readabilityScore", "missingKeywords", "matchedKeywords", "formattingChecks", "sectionAnalysis", "criticalFixes"],
        properties: {
          matchScore: { type: Type.INTEGER, description: "Matching percentage out of 100" },
          readabilityScore: { type: Type.INTEGER, description: "Readability and flow percentage out of 100" },
          missingKeywords: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              required: ["keyword", "importance", "tips"],
              properties: {
                keyword: { type: Type.STRING },
                importance: { type: Type.STRING, description: "High, Medium, or Low" },
                tips: { type: Type.STRING }
              }
            }
          },
          matchedKeywords: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Keywords from the JD that are matched in the resume text"
          },
          formattingChecks: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              required: ["check", "passed", "details"],
              properties: {
                check: { type: Type.STRING },
                passed: { type: Type.BOOLEAN },
                details: { type: Type.STRING }
              }
            }
          },
          sectionAnalysis: {
            type: Type.OBJECT,
            required: ["contact", "experience", "skills", "education"],
            properties: {
              contact: { type: Type.STRING },
              experience: { type: Type.STRING },
              skills: { type: Type.STRING },
              education: { type: Type.STRING }
            }
          },
          criticalFixes: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "List of the most pressing optimization steps."
          }
        }
      }
    });

    const parsedData = JSON.parse(response.text?.trim() || "{}");
    res.json(parsedData);
  } catch (err: any) {
    console.error("Error in /api/resume/analyze-ats:", err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
});

// Configure Vite or Static delivery depending on environment
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    // Development Mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production Mode
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running in ${process.env.NODE_ENV || "development"} mode on http://localhost:${PORT}`);
  });
}

setupServer().catch((err) => {
  console.error("Failed to start server:", err);
});
